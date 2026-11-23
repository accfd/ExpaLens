"""
Backend Database Connector for ExpaLens FastAPI
Direct connection to PostgreSQL data mart: aiesec_dw
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

def get_overview_data(years=None, products=None, statuses=None, regions=None, countries=None, host_lcs=None):
    where_sql, params = _build_filter_clause(years, products, statuses, regions, countries, host_lcs, exclude_zero_year=False)
    engine = get_db_engine()
    
    q_kpi = f"""
    SELECT 
        COUNT(f.apl_id) as total_applications,
        COALESCE(SUM(f.is_accepted), 0) as total_accepted,
        COALESCE(SUM(f.is_approved), 0) as total_approved,
        COALESCE(SUM(f.is_realized), 0) as total_realized,
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
        COALESCE(SUM(f.is_accepted), 0) as accepted,
        COALESCE(SUM(f.is_approved), 0) as approved,
        COALESCE(SUM(f.is_realized), 0) as realized,
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
        
    # Product counts dictionary
    product_breakdown = df_prod.to_dict(orient="records")
    product_map = {row["product_name"]: row["total_apps"] for row in product_breakdown}
    
    # Achievements
    achievements = df_achieve.to_dict(orient="records")
    
    # Calculate YoY
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
