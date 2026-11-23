"""
Backend Database Connector for ExpaLens FastAPI
Direct connection to PostgreSQL data mart: aiesec_dw
Provides complete data queries for all 5 BI pages
"""

import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "aiesec_dw")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

def get_db_engine():
    if DB_PASSWORD and DB_PASSWORD.strip():
        db_url = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    else:
        db_url = f"postgresql+psycopg2://{DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    return create_engine(db_url, pool_pre_ping=True)

def _build_filter_clause(years=None, products=None, statuses=None, regions=None, countries=None, host_lcs=None, exclude_zero_year=False):
    conditions = []
    params = {}
    ALL_YEARS = {2021, 2022, 2023, 2024, 2025}
    
    if exclude_zero_year:
        conditions.append("d.year BETWEEN 2021 AND 2025")
        if years and set(years) != ALL_YEARS:
            placeholders = [f":y_{i}" for i in range(len(years))]
            conditions.append(f"d.year IN ({', '.join(placeholders)})")
            for i, y in enumerate(years):
                params[f"y_{i}"] = int(y)
    else:
        if years and set(years) != ALL_YEARS:
            placeholders = [f":y_{i}" for i in range(len(years))]
            conditions.append(f"d.year IN ({', '.join(placeholders)})")
            for i, y in enumerate(years):
                params[f"y_{i}"] = int(y)
            
    ALL_PRODUCTS = {"GV (New)", "GTa", "GTe"}
    if products and set(products) != ALL_PRODUCTS:
        placeholders = [f":p_{i}" for i in range(len(products))]
        conditions.append(f"p.product_name IN ({', '.join(placeholders)})")
        for i, p in enumerate(products):
            params[f"p_{i}"] = str(p)
            
    ALL_STATUSES = {"accepted", "approved", "finished", "rejected"}
    if statuses and set(statuses) != ALL_STATUSES:
        placeholders = [f":s_{i}" for i in range(len(statuses))]
        conditions.append(f"f.status IN ({', '.join(placeholders)})")
        for i, s in enumerate(statuses):
            params[f"s_{i}"] = str(s)
            
    if regions:
        placeholders = [f":reg_{i}" for i in range(len(regions))]
        conditions.append(f"h.host_region IN ({', '.join(placeholders)})")
        for i, reg in enumerate(regions):
            params[f"reg_{i}"] = str(reg)

    if countries:
        placeholders = [f":mc_{i}" for i in range(len(countries))]
        conditions.append(f"h.host_mc IN ({', '.join(placeholders)})")
        for i, mc in enumerate(countries):
            params[f"mc_{i}"] = str(mc)

    if host_lcs:
        placeholders = [f":lc_{i}" for i in range(len(host_lcs))]
        conditions.append(f"h.host_lc IN ({', '.join(placeholders)})")
        for i, lc in enumerate(host_lcs):
            params[f"lc_{i}"] = str(lc)
            
    where_sql = ("WHERE " + " AND ".join(conditions)) if conditions else ""
    return where_sql, params

def get_filter_options():
    engine = get_db_engine()
    q = """
    SELECT DISTINCT host_region, host_mc, host_lc 
    FROM dim_host 
    WHERE host_region IS NOT NULL AND host_mc IS NOT NULL AND host_lc IS NOT NULL
    ORDER BY host_region, host_mc, host_lc;
    """
    with engine.connect() as conn:
        df = pd.read_sql_query(text(q), con=conn)
        
    regions = sorted(df["host_region"].dropna().unique().tolist())
    countries_by_region = df.groupby("host_region")["host_mc"].unique().apply(lambda x: sorted(list(set(x)))).to_dict()
    lcs_by_country = df.groupby("host_mc")["host_lc"].unique().apply(lambda x: sorted(list(set(x)))).to_dict()
    
    return {
        "years": [2021, 2022, 2023, 2024, 2025],
        "products": ["GV (New)", "GTa", "GTe"],
        "statuses": ["accepted", "approved", "finished", "rejected"],
        "regions": regions,
        "countries_by_region": countries_by_region,
        "lcs_by_country": lcs_by_country
    }

# ==============================================================================
# 1. HALAMAN 1: RINGKASAN UTAMA (OVERVIEW)
# ==============================================================================
def get_overview_data(years=None, products=None, statuses=None, regions=None, countries=None, host_lcs=None):
    engine = get_db_engine()
    where_sql, params = _build_filter_clause(years, products, statuses, regions, countries, host_lcs)
    
    q_kpi = f"""
    SELECT 
        COUNT(f.apl_id) as total_applications,
        COALESCE(SUM(CASE WHEN f.is_accepted = 1 OR f.is_approved = 1 OR f.is_realized = 1 OR f.is_finished = 1 THEN 1 ELSE 0 END), 0) as total_accepted,
        COALESCE(SUM(CASE WHEN f.is_approved = 1 OR f.is_realized = 1 OR f.is_finished = 1 THEN 1 ELSE 0 END), 0) as total_approved,
        COALESCE(SUM(CASE WHEN f.is_realized = 1 OR f.is_finished = 1 THEN 1 ELSE 0 END), 0) as total_realized,
        COALESCE(SUM(f.is_finished), 0) as total_finished,
        COALESCE(SUM(f.is_rejected), 0) as total_rejected,
        AVG(f.days_to_accept) as avg_days_to_accept
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    {where_sql};
    """
    
    q_product = f"""
    SELECT 
        p.product_name,
        COUNT(f.apl_id) as total_apps
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    {where_sql}
    GROUP BY p.product_name
    ORDER BY total_apps DESC;
    """
    
    q_achieve = f"""
    SELECT 
        p.product_name,
        COALESCE(SUM(CASE WHEN f.is_accepted = 1 OR f.is_approved = 1 OR f.is_realized = 1 OR f.is_finished = 1 THEN 1 ELSE 0 END), 0) as accepted,
        COALESCE(SUM(CASE WHEN f.is_approved = 1 OR f.is_realized = 1 OR f.is_finished = 1 THEN 1 ELSE 0 END), 0) as approved,
        COALESCE(SUM(CASE WHEN f.is_realized = 1 OR f.is_finished = 1 THEN 1 ELSE 0 END), 0) as realized,
        COALESCE(SUM(f.is_finished), 0) as finished
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    {where_sql}
    GROUP BY p.product_name
    ORDER BY p.product_name;
    """
    
    with engine.connect() as conn:
        df_kpi = pd.read_sql_query(text(q_kpi), con=conn, params=params)
        df_prod = pd.read_sql_query(text(q_product), con=conn, params=params)
        df_achieve = pd.read_sql_query(text(q_achieve), con=conn, params=params)
        
    kpi_dict = df_kpi.iloc[0].to_dict() if not df_kpi.empty else {}
    total_acc = kpi_dict.get("total_accepted", 0) or 0
    total_fin = kpi_dict.get("total_finished", 0) or 0
    finish_rate = round((total_fin / total_acc * 100), 1) if total_acc > 0 else 0.0
    kpi_dict["finish_rate"] = finish_rate
    if kpi_dict.get("avg_days_to_accept") is not None:
        kpi_dict["avg_days_to_accept"] = round(float(kpi_dict["avg_days_to_accept"]), 1)
        
    product_breakdown = df_prod.to_dict(orient="records")
    product_map = {row["product_name"]: row["total_apps"] for row in product_breakdown}
    achievements = df_achieve.to_dict(orient="records")
    yoy_data = get_yoy_growth(years, products, statuses, regions, countries, host_lcs)
    
    return {
        "kpis": kpi_dict,
        "product_counts": product_map,
        "product_breakdown": product_breakdown,
        "achievements": achievements,
        "yoy": yoy_data
    }

def get_yoy_growth(years=None, products=None, statuses=None, regions=None, countries=None, host_lcs=None):
    engine = get_db_engine()
    where_sql, params = _build_filter_clause(None, products, statuses, regions, countries, host_lcs, exclude_zero_year=True)
    
    q = f"""
    SELECT 
        d.year,
        COUNT(f.apl_id) as total_apps
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    {where_sql}
    GROUP BY d.year
    ORDER BY d.year ASC;
    """
    with engine.connect() as conn:
        df = pd.read_sql_query(text(q), con=conn, params=params)
        
    if df.empty:
        return {"current_year": 2024, "prev_year": 2023, "yoy_pct": 0.0, "is_positive": True}
        
    year_map = dict(zip(df["year"], df["total_apps"]))
    target_year = years[0] if (years and len(years) == 1 and years[0] > 2021) else 2024
    prev_year = target_year - 1
    
    current_val = year_map.get(target_year, 0)
    prev_val = year_map.get(prev_year, 0)
    yoy_pct = round(((current_val - prev_val) / prev_val) * 100, 1) if prev_val > 0 else 0.0
    
    return {
        "current_year": target_year,
        "prev_year": prev_year,
        "current_val": current_val,
        "prev_val": prev_val,
        "yoy_pct": yoy_pct,
        "is_positive": yoy_pct >= 0
    }

# ==============================================================================
# 2. HALAMAN 2: TREN PENDAFTARAN (APPLICATION TRENDS)
# ==============================================================================
def get_trends_data(years=None, products=None, statuses=None, regions=None, countries=None, host_lcs=None):
    engine = get_db_engine()
    where_sql, params = _build_filter_clause(years, products, statuses, regions, countries, host_lcs, exclude_zero_year=True)
    
    # 1. Monthly trend & Status dynamics
    q_monthly = f"""
    SELECT 
        d.year,
        d.month,
        d.month_name,
        TO_CHAR(d.full_date, 'YYYY-MM') as year_month,
        COUNT(f.apl_id) as total_apps,
        COALESCE(SUM(f.is_accepted), 0) as accepted,
        COALESCE(SUM(f.is_finished), 0) as finished,
        COALESCE(SUM(f.is_rejected), 0) as rejected
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    {where_sql}
    GROUP BY d.year, d.month, d.month_name, TO_CHAR(d.full_date, 'YYYY-MM')
    ORDER BY d.year ASC, d.month ASC;
    """
    
    # 2. Product yearly volume
    q_product_yearly = f"""
    SELECT 
        d.year,
        p.product_name,
        COUNT(f.apl_id) as total_apps
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    {where_sql}
    GROUP BY d.year, p.product_name
    ORDER BY d.year ASC, p.product_name;
    """
    
    # 3. Preference method & duration
    q_pref = f"""
    SELECT 
        p.product_name,
        p.duration_type,
        COUNT(f.apl_id) as total_apps
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    {where_sql}
    GROUP BY p.product_name, p.duration_type
    ORDER BY p.product_name;
    """
    
    with engine.connect() as conn:
        df_monthly = pd.read_sql_query(text(q_monthly), con=conn, params=params)
        df_prod_yr = pd.read_sql_query(text(q_product_yearly), con=conn, params=params)
        df_pref = pd.read_sql_query(text(q_pref), con=conn, params=params)
        
    # Pivot product yearly into {year, GTa, GTe, GV}
    product_yearly = []
    if not df_prod_yr.empty:
        pivot_df = df_prod_yr.pivot(index="year", columns="product_name", values="total_apps").fillna(0).reset_index()
        for _, row in pivot_df.iterrows():
            item = {"year": int(row["year"])}
            for col in pivot_df.columns:
                if col != "year":
                    item[col] = int(row[col])
            product_yearly.append(item)
            
    # Preference breakdown
    preference_method = []
    if not df_pref.empty:
        for prod, grp in df_pref.groupby("product_name"):
            total_prod = grp["total_apps"].sum()
            short_t = grp[grp["duration_type"] == "Short-term"]["total_apps"].sum()
            long_t = grp[grp["duration_type"] == "Long-term"]["total_apps"].sum()
            preference_method.append({
                "product_name": prod,
                "short_term_count": int(short_t),
                "long_term_count": int(long_t),
                "short_term_pct": round((short_t / total_prod * 100), 1) if total_prod > 0 else 0,
                "long_term_pct": round((long_t / total_prod * 100), 1) if total_prod > 0 else 0,
                "total_apps": int(total_prod)
            })
            
    monthly_trend = df_monthly[["year_month", "total_apps"]].to_dict(orient="records") if not df_monthly.empty else []
    status_dynamics = df_monthly[["year_month", "accepted", "finished", "rejected"]].to_dict(orient="records") if not df_monthly.empty else []
    seasonality_matrix = df_monthly[["year", "month", "month_name", "total_apps"]].to_dict(orient="records") if not df_monthly.empty else []
    
    return {
        "monthly_trend": monthly_trend,
        "status_dynamics": status_dynamics,
        "product_yearly": product_yearly,
        "seasonality_matrix": seasonality_matrix,
        "preference_method": preference_method
    }

# ==============================================================================
# 3. HALAMAN 3: TAHAPAN SELEKSI DAN KELULUSAN (CONVERSION FUNNEL)
# ==============================================================================
def get_funnel_data(years=None, products=None, statuses=None, regions=None, countries=None, host_lcs=None):
    engine = get_db_engine()
    where_sql, params = _build_filter_clause(years, products, statuses, regions, countries, host_lcs)
    
    # 1. Total counts for funnel steps
    q_steps = f"""
    SELECT 
        COUNT(f.apl_id) as applied,
        COALESCE(SUM(CASE WHEN f.is_accepted = 1 OR f.is_approved = 1 OR f.is_realized = 1 OR f.is_finished = 1 THEN 1 ELSE 0 END), 0) as accepted,
        COALESCE(SUM(CASE WHEN f.is_approved = 1 OR f.is_realized = 1 OR f.is_finished = 1 THEN 1 ELSE 0 END), 0) as approved,
        COALESCE(SUM(CASE WHEN f.is_realized = 1 OR f.is_finished = 1 THEN 1 ELSE 0 END), 0) as realized,
        COALESCE(SUM(f.is_finished), 0) as finished
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    {where_sql};
    """
    
    # 2. Avg processing days per product
    q_days = f"""
    SELECT 
        p.product_name,
        ROUND(AVG(f.days_to_accept)::numeric, 1) as days_to_accept,
        ROUND(AVG(f.days_to_approve)::numeric, 1) as days_to_approve,
        ROUND(AVG(f.days_to_realize)::numeric, 1) as days_to_realize,
        ROUND(AVG(f.days_to_finish)::numeric, 1) as days_to_finish
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    {where_sql}
    GROUP BY p.product_name
    ORDER BY p.product_name;
    """
    
    # 3. Rejection stage per product
    q_rej_stage = f"""
    SELECT 
        p.product_name,
        SUM(CASE WHEN f.is_rejected = 1 AND f.is_accepted = 0 THEN 1 ELSE 0 END) as pre_accepted,
        SUM(CASE WHEN f.is_rejected = 1 AND f.is_accepted = 1 AND f.is_approved = 0 THEN 1 ELSE 0 END) as post_accepted,
        SUM(CASE WHEN f.is_rejected = 1 AND f.is_approved = 1 THEN 1 ELSE 0 END) as post_approved
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    {where_sql}
    GROUP BY p.product_name
    ORDER BY p.product_name;
    """
    
    # 4. Country speed scatter
    q_scatter = f"""
    SELECT 
        h.host_mc as country,
        h.host_region as region,
        COUNT(f.apl_id) as total_apps,
        ROUND(AVG(f.days_to_accept)::numeric, 1) as avg_days_to_accept
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    {where_sql}
    GROUP BY h.host_mc, h.host_region
    HAVING COUNT(f.apl_id) >= 10 AND AVG(f.days_to_accept) IS NOT NULL
    ORDER BY total_apps DESC
    LIMIT 30;
    """
    
    with engine.connect() as conn:
        df_steps = pd.read_sql_query(text(q_steps), con=conn, params=params)
        df_days = pd.read_sql_query(text(q_days), con=conn, params=params)
        df_rej = pd.read_sql_query(text(q_rej_stage), con=conn, params=params)
        df_scat = pd.read_sql_query(text(q_scatter), con=conn, params=params)
        
    s = df_steps.iloc[0].to_dict() if not df_steps.empty else {}
    app = s.get("applied", 0) or 1
    acc = s.get("accepted", 0) or 0
    apr = s.get("approved", 0) or 0
    rea = s.get("realized", 0) or 0
    fin = s.get("finished", 0) or 0
    
    funnel_rates = [
        {
            "stage": "Applied ke Accepted",
            "from_count": app,
            "to_count": acc,
            "conversion_rate": round((acc / app * 100), 1) if app > 0 else 0,
            "drop_rate": round(((app - acc) / app * 100), 1) if app > 0 else 0
        },
        {
            "stage": "Accepted ke Approved",
            "from_count": acc,
            "to_count": apr,
            "conversion_rate": round((apr / acc * 100), 1) if acc > 0 else 0,
            "drop_rate": round(((acc - apr) / acc * 100), 1) if acc > 0 else 0
        },
        {
            "stage": "Approved ke Realized",
            "from_count": apr,
            "to_count": rea,
            "conversion_rate": round((rea / apr * 100), 1) if apr > 0 else 0,
            "drop_rate": round(((apr - rea) / apr * 100), 1) if apr > 0 else 0.0
        },
        {
            "stage": "Realized ke Finished",
            "from_count": rea,
            "to_count": fin,
            "conversion_rate": round((fin / rea * 100), 1) if rea > 0 else 0,
            "drop_rate": round(((rea - fin) / rea * 100), 1) if rea > 0 else 0.0
        }
    ]
    
    return {
        "funnel_rates": funnel_rates,
        "avg_processing_days": df_days.fillna(0).to_dict(orient="records"),
        "rejection_stages": df_rej.fillna(0).to_dict(orient="records"),
        "country_speed_scatter": df_scat.fillna(0).to_dict(orient="records")
    }

# ==============================================================================
# 4. HALAMAN 4: PETA DAN NEGARA TUJUAN (DESTINATIONS)
# ==============================================================================
def get_destinations_data(years=None, products=None, statuses=None, regions=None, countries=None, host_lcs=None):
    engine = get_db_engine()
    where_sql, params = _build_filter_clause(years, products, statuses, regions, countries, host_lcs)
    
    # 1. Top Host MC
    q_top_mc = f"""
    SELECT 
        h.host_mc as country_name,
        h.host_region as region,
        COUNT(f.apl_id) as total_apps,
        COALESCE(SUM(f.is_accepted), 0) as accepted,
        COALESCE(SUM(f.is_approved), 0) as approved,
        COALESCE(SUM(f.is_finished), 0) as finished
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    {where_sql}
    GROUP BY h.host_mc, h.host_region
    ORDER BY total_apps DESC
    LIMIT 15;
    """
    
    # 2. Host LC drilldown
    q_lc = f"""
    SELECT 
        h.host_mc as country_name,
        h.host_lc,
        COUNT(f.apl_id) as total_apps,
        COALESCE(SUM(f.is_accepted), 0) as accepted,
        COALESCE(SUM(f.is_approved), 0) as approved,
        COALESCE(SUM(f.is_finished), 0) as finished,
        ROUND((COALESCE(SUM(f.is_finished), 0)::numeric / NULLIF(COALESCE(SUM(f.is_accepted), 0), 0) * 100), 1) as finish_rate
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    {where_sql}
    GROUP BY h.host_mc, h.host_lc
    ORDER BY total_apps DESC
    LIMIT 30;
    """
    
    with engine.connect() as conn:
        df_top_mc = pd.read_sql_query(text(q_top_mc), con=conn, params=params)
        df_lc = pd.read_sql_query(text(q_lc), con=conn, params=params)
        
    # Map country ISO3
    ISO_MAP = {
        "Malaysia": "MYS", "India": "IND", "Vietnam": "VNM", "Thailand": "THA",
        "Taiwan": "TWN", "Egypt": "EGY", "Turkey": "TUR", "Brazil": "BRA",
        "Japan": "JPN", "Korea": "KOR", "Poland": "POL", "Germany": "DEU",
        "Italy": "ITA", "Philippines": "PHL", "Morocco": "MAR", "Colombia": "COL",
        "Mexico": "MEX", "Sri Lanka": "LKA", "Cambodia": "KHM", "China": "CHN"
    }
    
    choropleth_map = []
    for _, row in df_top_mc.iterrows():
        c_name = row["country_name"]
        choropleth_map.append({
            "country_name": c_name,
            "country_code_iso3": ISO_MAP.get(c_name, c_name[:3].upper()),
            "total_apps": int(row["total_apps"]),
            "region": row["region"]
        })
        
    return {
        "choropleth_map": choropleth_map,
        "top_host_mcs": df_top_mc.fillna(0).to_dict(orient="records"),
        "host_lc_drilldown": df_lc.fillna(0).to_dict(orient="records")
    }

# ==============================================================================
# 5. HALAMAN 5: ALASAN PENOLAKAN PESERTA (REJECTIONS)
# ==============================================================================
def get_rejections_data(years=None, products=None, statuses=None, regions=None, countries=None, host_lcs=None):
    engine = get_db_engine()
    where_sql, params = _build_filter_clause(years, products, statuses, regions, countries, host_lcs)
    
    # Tambahkan filter di luar 'Not Rejected'
    rej_filter = "r.reason_text != 'Not Rejected'"
    where_rej = f"{where_sql} AND {rej_filter}" if where_sql else f"WHERE {rej_filter}"
    
    # 1. Top Rejection Reasons
    q_top = f"""
    SELECT 
        r.reason_text,
        COUNT(f.apl_id) as total_cases
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    JOIN dim_rejection_reason r ON f.reason_id = r.reason_id
    {where_rej}
    GROUP BY r.reason_text
    ORDER BY total_cases DESC
    LIMIT 10;
    """
    
    # 2. Reasons by Product
    q_prod = f"""
    SELECT 
        r.reason_text,
        p.product_name,
        COUNT(f.apl_id) as total_cases
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    JOIN dim_rejection_reason r ON f.reason_id = r.reason_id
    {where_rej}
    GROUP BY r.reason_text, p.product_name
    ORDER BY total_cases DESC;
    """
    
    # 3. Monthly Rejection Trend
    q_trend = f"""
    SELECT 
        TO_CHAR(d.full_date, 'YYYY-MM') as year_month,
        COUNT(f.apl_id) as rejected_cases
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    JOIN dim_rejection_reason r ON f.reason_id = r.reason_id
    {where_rej}
    GROUP BY TO_CHAR(d.full_date, 'YYYY-MM')
    ORDER BY year_month ASC;
    """
    
    with engine.connect() as conn:
        df_top = pd.read_sql_query(text(q_top), con=conn, params=params)
        df_prod = pd.read_sql_query(text(q_prod), con=conn, params=params)
        df_trend = pd.read_sql_query(text(q_trend), con=conn, params=params)
        
    total_rej = df_top["total_cases"].sum() if not df_top.empty else 1
    top_reasons = []
    for rank, row in enumerate(df_top.to_dict(orient="records"), start=1):
        top_reasons.append({
            "rank": rank,
            "reason_text": row["reason_text"],
            "total_cases": int(row["total_cases"]),
            "percentage": round((row["total_cases"] / total_rej * 100), 1)
        })
        
    # Pivot reasons by product
    reasons_by_product = []
    if not df_prod.empty:
        pivot = df_prod.pivot(index="reason_text", columns="product_name", values="total_cases").fillna(0).reset_index()
        top_texts = [r["reason_text"] for r in top_reasons[:6]]
        filtered_pivot = pivot[pivot["reason_text"].isin(top_texts)]
        for _, row in filtered_pivot.iterrows():
            item = {"reason_text": row["reason_text"]}
            for col in filtered_pivot.columns:
                if col != "reason_text":
                    item[col] = int(row[col])
            reasons_by_product.append(item)
            
    # Dynamic recommendation engine
    top_reason = top_reasons[0]["reason_text"] if top_reasons else "Tidak ada penolakan terdeteksi"
    top_pct = top_reasons[0]["percentage"] if top_reasons else 0.0
    
    RECOMMENDATION_CATALOG = {
        "Company rejected profile": {
            "title": "Standarisasi Kurasi Portofolio dan Uji Pra-Kualifikasi Kandidat",
            "desc": "Sebagian besar penolakan berasal dari ketidaksesuaian profil dengan standar perusahaan mitra. Tim OGX disarankan menyelenggarakan sesi CV Clinic intensif, simulasi tes teknis, dan verifikasi portofolio sebelum pendaftaran dikirim ke Opportunity Portal."
        },
        "EP uncontactable": {
            "title": "Optimasi Kanal Respons Cepat dan Perjanjian Komitmen Awal",
            "desc": "Banyak calon peserta sulit dihubungi pasca pendaftaran. Disarankan menggunakan saluran komunikasi langsung (WhatsApp/Telegram bot otomatisasi) dalam 1x24 jam pertama pendaftaran untuk memastikan nomor aktif dan komitmen pendaftar."
        },
        "Language proficiency": {
            "title": "Penyediaan Program Pelatihan Bahasa Asing dan Simulasi Wawancara",
            "desc": "Kandidat mengalami kendala kefasihan bahasa kerja mitra. Disarankan membangun kerja sama pelatihan bahasa Inggris intensif atau verifikasi skor EF SET/IELTS sebelum merekomendasikan kandidat ke negara dengan persyaratan bahasa ketat."
        },
        "Visa rejection": {
            "title": "Penyusunan Panduan Terpadu Dokumen Imigrasi dan Pendampingan Visa",
            "desc": "Kegagalan pada tahap akhir akibat kendala administratif visa. Disarankan membuat SOP verifikasi kelengkapan berkas konsuler minimal 45 hari sebelum estimasi tanggal keberangkatan."
        }
    }
    
    matched_rec = RECOMMENDATION_CATALOG.get(top_reason, {
        "title": "Evaluasi Berkala Standar Kelayakan dan Pendampingan Pelamar",
        "desc": f"Ditemukan dominasi alasan '{top_reason}' sebesar {top_pct}%. Disarankan tim Customer Experience mengadakan evaluasi berkala dan memperketat bimbingan satu-satu bagi setiap calon peserta."
    })
    
    recommended_action = {
        "top_reason": top_reason,
        "affected_percentage": top_pct,
        "priority_level": "Tinggi" if top_pct > 25 else "Sedang",
        "action_title": matched_rec["title"],
        "action_description": matched_rec["desc"]
    }
    
    return {
        "top_rejection_reasons": top_reasons,
        "reasons_by_product": reasons_by_product,
        "rejection_trend": df_trend.to_dict(orient="records"),
        "recommended_action": recommended_action
    }
