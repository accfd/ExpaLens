"""
Modul Koneksi Basis Data PostgreSQL (aiesec_dw) & Caching Streamlit
Mendukung koneksi dengan atau tanpa password lokal secara aman.
"""

import os
import streamlit as st
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Memuat variabel lingkungan dari berkas .env
load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "aiesec_dw")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

@st.cache_resource(show_spinner="Menyambungkan ke database PostgreSQL...")
def get_db_engine():
    """
    Membuat dan me-return SQLAlchemy Engine dengan koneksi caching.
    Mendukung format koneksi dengan password maupun password kosong (passwordless).
    """
    if DB_PASSWORD and DB_PASSWORD.strip():
        db_url = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    else:
        db_url = f"postgresql+psycopg2://{DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    try:
        engine = create_engine(db_url, pool_pre_ping=True)
        return engine
    except Exception as e:
        st.error(f"Gagal membuat engine koneksi basis data: {e}")
        return None

def check_db_status() -> bool:
    """
    Memeriksa ketersediaan koneksi basis data aktif.
    """
    try:
        engine = get_db_engine()
        if engine is not None:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1;"))
            return True
        return False
    except Exception:
        return False

def _build_filter_clause(years=None, products=None, statuses=None, exclude_zero_year=False):
    """
    Membangun klausa WHERE SQL dan dict parameter berdasarkan filter aktif sidebar.
    Menangani rentang tahun (2021-2025) untuk visualisasi time-series serta
    mempertahankan total 75.520 aplikasi saat all-years terpilih pada Overview/Destinations.
    """
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
            
    where_sql = ("WHERE " + " AND ".join(conditions)) if conditions else ""
    return where_sql, params

# ==============================================================================
# KUERI ANALITIK SPESIFIK UNTUK SETIAP HALAMAN DASHBOARD
# ==============================================================================

@st.cache_data(ttl=3600, show_spinner="Memuat ringkasan KPI Overview...")
def get_overview_data(years=None, products=None, statuses=None):
    """Mengambil metrik ringkasan kartu KPI utama untuk Halaman 1 Overview."""
    where_sql, params = _build_filter_clause(years, products, statuses, exclude_zero_year=False)
    engine = get_db_engine()
    if engine is None:
        return {}
    
    q = f"""
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
    {where_sql};
    """
    
    with engine.connect() as conn:
        df = pd.read_sql_query(text(q), con=conn, params=params)
        
    if df.empty:
        return {
            "total_applications": 0, "total_accepted": 0, "total_approved": 0,
            "total_realized": 0, "total_finished": 0, "total_rejected": 0,
            "finish_rate": 0.0, "avg_days_to_accept": 0.0
        }
    
    row = df.iloc[0].to_dict()
    total_acc = row.get("total_accepted", 0) or 0
    total_fin = row.get("total_finished", 0) or 0
    row["finish_rate"] = (total_fin / total_acc * 100) if total_acc > 0 else 0.0
    return row

@st.cache_data(ttl=3600, show_spinner="Memuat breakdown produk Overview...")
def get_product_breakdown_overview(years=None, products=None, statuses=None):
    """Mengambil volume pendaftaran per produk untuk Hero Card Halaman 1."""
    where_sql, params = _build_filter_clause(years, products, statuses, exclude_zero_year=False)
    engine = get_db_engine()
    if engine is None:
        return pd.DataFrame()
        
    q = f"""
    SELECT 
        p.product_name,
        COUNT(f.apl_id) as total_apps
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    {where_sql}
    GROUP BY p.product_name
    ORDER BY total_apps DESC;
    """
    with engine.connect() as conn:
        return pd.read_sql_query(text(q), con=conn, params=params)

@st.cache_data(ttl=3600, show_spinner="Memuat capaian program Overview...")
def get_program_achievements(years=None, products=None, statuses=None):
    """Mengambil capaian tahapan (Accepted, Approved, Finished) per produk."""
    where_sql, params = _build_filter_clause(years, products, statuses, exclude_zero_year=False)
    engine = get_db_engine()
    if engine is None:
        return pd.DataFrame()
        
    q = f"""
    SELECT 
        p.product_name,
        COALESCE(SUM(f.is_accepted), 0) as accepted,
        COALESCE(SUM(f.is_approved), 0) as approved,
        COALESCE(SUM(f.is_realized), 0) as realized,
        COALESCE(SUM(f.is_finished), 0) as finished
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    {where_sql}
    GROUP BY p.product_name
    ORDER BY p.product_name;
    """
    with engine.connect() as conn:
        return pd.read_sql_query(text(q), con=conn, params=params)

@st.cache_data(ttl=3600, show_spinner="Memuat tren pendaftaran bulanan...")
def get_monthly_application_trends(years=None, products=None, statuses=None):
    """Mengambil volume aplikasi dan sebaran status per bulan untuk Halaman 2 Trends."""
    where_sql, params = _build_filter_clause(years, products, statuses, exclude_zero_year=True)
    engine = get_db_engine()
    if engine is None:
        return pd.DataFrame()
        
    q = f"""
    SELECT 
        d.year,
        d.month,
        d.month_name,
        CONCAT(d.year, '-', LPAD(d.month::text, 2, '0'), '-01') as period_date,
        COUNT(f.apl_id) as total_apps,
        COALESCE(SUM(f.is_accepted), 0) as accepted,
        COALESCE(SUM(f.is_finished), 0) as finished,
        COALESCE(SUM(f.is_rejected), 0) as rejected
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    {where_sql}
    GROUP BY d.year, d.month, d.month_name
    ORDER BY d.year ASC, d.month ASC;
    """
    with engine.connect() as conn:
        df = pd.read_sql_query(text(q), con=conn, params=params)
    if not df.empty and "period_date" in df.columns:
        df["period_date"] = pd.to_datetime(df["period_date"])
    return df

@st.cache_data(ttl=3600, show_spinner="Memuat tren tahunan per produk...")
def get_yearly_product_trends(years=None, products=None, statuses=None):
    """Mengambil volume pendaftaran tahunan per program untuk Halaman 2."""
    where_sql, params = _build_filter_clause(years, products, statuses, exclude_zero_year=True)
    engine = get_db_engine()
    if engine is None:
        return pd.DataFrame()
        
    q = f"""
    SELECT 
        d.year,
        p.product_name,
        COUNT(f.apl_id) as total_apps
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    {where_sql}
    GROUP BY d.year, p.product_name
    ORDER BY d.year ASC, p.product_name ASC;
    """
    with engine.connect() as conn:
        return pd.read_sql_query(text(q), con=conn, params=params)

@st.cache_data(ttl=3600, show_spinner="Memuat matriks seasonality...")
def get_seasonality_heatmap_data(years=None, products=None, statuses=None):
    """Mengambil matriks kepadatan aplikasi (Bulan vs Tahun) untuk Seasonality Heatmap."""
    where_sql, params = _build_filter_clause(years, products, statuses, exclude_zero_year=True)
    engine = get_db_engine()
    if engine is None:
        return pd.DataFrame()
        
    q = f"""
    SELECT 
        d.year,
        d.month,
        d.month_name,
        COUNT(f.apl_id) as total_apps
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    {where_sql}
    GROUP BY d.year, d.month, d.month_name
    ORDER BY d.year ASC, d.month ASC;
    """
    with engine.connect() as conn:
        return pd.read_sql_query(text(q), con=conn, params=params)

@st.cache_data(ttl=3600, show_spinner="Memuat preferensi durasi produk...")
def get_duration_preferences(years=None, products=None, statuses=None):
    """Mengambil perbandingan tipe durasi program untuk Halaman 2."""
    where_sql, params = _build_filter_clause(years, products, statuses, exclude_zero_year=False)
    engine = get_db_engine()
    if engine is None:
        return pd.DataFrame()
        
    q = f"""
    SELECT 
        p.product_name,
        COALESCE(p.duration_type, 'Standard') as duration_type,
        COUNT(f.apl_id) as total_apps
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    {where_sql}
    GROUP BY p.product_name, p.duration_type;
    """
    with engine.connect() as conn:
        return pd.read_sql_query(text(q), con=conn, params=params)

@st.cache_data(ttl=3600, show_spinner="Memuat metrik durasi tahapan funnel...")
def get_funnel_durations(years=None, products=None, statuses=None):
    """Mengambil rata-rata hari pada masing-masing tahapan untuk Halaman 3 Funnel."""
    where_sql, params = _build_filter_clause(years, products, statuses, exclude_zero_year=False)
    engine = get_db_engine()
    if engine is None:
        return {}
        
    q = f"""
    SELECT 
        AVG(f.days_to_accept) as avg_days_to_accept,
        AVG(f.days_to_approve) as avg_days_to_approve,
        AVG(f.days_to_realize) as avg_days_to_realize,
        AVG(f.days_to_finish) as avg_days_to_finish,
        AVG(f.days_to_reject) as avg_days_to_reject
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    {where_sql};
    """
    with engine.connect() as conn:
        df = pd.read_sql_query(text(q), con=conn, params=params)
    return df.iloc[0].to_dict() if not df.empty else {}

@st.cache_data(ttl=3600, show_spinner="Memuat durasi per produk...")
def get_durations_by_product(years=None, products=None, statuses=None):
    """Mengambil rata-rata durasi tahapan per program GV, GTa, GTe untuk Halaman 3."""
    where_sql, params = _build_filter_clause(years, products, statuses, exclude_zero_year=False)
    engine = get_db_engine()
    if engine is None:
        return pd.DataFrame()
        
    q = f"""
    SELECT 
        p.product_name,
        AVG(f.days_to_accept) as days_to_accept,
        AVG(f.days_to_approve) as days_to_approve,
        AVG(f.days_to_realize) as days_to_realize,
        AVG(f.days_to_finish) as days_to_finish
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    {where_sql}
    GROUP BY p.product_name;
    """
    with engine.connect() as conn:
        return pd.read_sql_query(text(q), con=conn, params=params)

@st.cache_data(ttl=3600, show_spinner="Memuat kecepatan vs volume negara...")
def get_country_speed_vs_volume(years=None, products=None, statuses=None):
    """Mengambil kecepatan proses vs volume pendaftaran antarnegara untuk Halaman 3."""
    where_sql, params = _build_filter_clause(years, products, statuses, exclude_zero_year=False)
    engine = get_db_engine()
    if engine is None:
        return pd.DataFrame()
        
    q = f"""
    SELECT 
        h.host_mc,
        COUNT(f.apl_id) as total_apps,
        AVG(f.days_to_accept) as avg_days_accept
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    {where_sql}
    GROUP BY h.host_mc
    HAVING COUNT(f.apl_id) >= 50 AND AVG(f.days_to_accept) IS NOT NULL
    ORDER BY total_apps DESC
    LIMIT 25;
    """
    with engine.connect() as conn:
        return pd.read_sql_query(text(q), con=conn, params=params)

@st.cache_data(ttl=3600, show_spinner="Memuat data peta destinasi dunia...")
def get_destinations_map_data(years=None, products=None, statuses=None):
    """Mengambil data agregat per negara mitra untuk Choropleth Map Halaman 4."""
    where_sql, params = _build_filter_clause(years, products, statuses, exclude_zero_year=False)
    engine = get_db_engine()
    if engine is None:
        return pd.DataFrame()
        
    q = f"""
    SELECT 
        h.host_mc,
        h.host_region,
        COUNT(f.apl_id) as total_apps,
        COALESCE(SUM(f.is_accepted), 0) as accepted,
        COALESCE(SUM(f.is_finished), 0) as finished
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    {where_sql}
    GROUP BY h.host_mc, h.host_region
    ORDER BY total_apps DESC;
    """
    with engine.connect() as conn:
        return pd.read_sql_query(text(q), con=conn, params=params)

@st.cache_data(ttl=3600, show_spinner="Memuat rincian Host LC...")
def get_host_lc_drilldown(country_name, years=None, products=None, statuses=None):
    """Mengambil rincian performa kampus/komite lokal (Host LC) di suatu negara untuk Halaman 4."""
    where_sql, params = _build_filter_clause(years, products, statuses, exclude_zero_year=False)
    engine = get_db_engine()
    if engine is None:
        return pd.DataFrame()
        
    country_filter = "AND h.host_mc = :c_name" if where_sql else "WHERE h.host_mc = :c_name"
    params["c_name"] = country_name
    
    q = f"""
    SELECT 
        h.host_lc as "Host LC Name",
        COUNT(f.apl_id) as "Total Apps",
        COALESCE(SUM(f.is_accepted), 0) as "Accepted",
        COALESCE(SUM(f.is_approved), 0) as "Approved",
        COALESCE(SUM(f.is_finished), 0) as "Finished",
        ROUND((COALESCE(SUM(f.is_finished), 0)::numeric / NULLIF(SUM(f.is_accepted), 0) * 100), 1) as "Finish Rate %",
        ROUND(AVG(f.days_to_accept)::numeric, 1) as "Avg Days to Accept"
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_host h ON f.host_lc = h.host_lc
    {where_sql} {country_filter}
    GROUP BY h.host_lc
    ORDER BY "Total Apps" DESC
    LIMIT 50;
    """
    with engine.connect() as conn:
        return pd.read_sql_query(text(q), con=conn, params=params)

@st.cache_data(ttl=3600, show_spinner="Memuat data alasan penolakan...")
def get_rejections_ranking(years=None, products=None, statuses=None):
    """Mengambil peringkat alasan penolakan (di luar 'Not Rejected') untuk Halaman 5."""
    where_sql, params = _build_filter_clause(years, products, statuses, exclude_zero_year=False)
    engine = get_db_engine()
    if engine is None:
        return pd.DataFrame()
        
    reason_filter = "AND r.reason_text != 'Not Rejected'" if where_sql else "WHERE r.reason_text != 'Not Rejected'"
    
    q = f"""
    SELECT 
        r.reason_text as "Reason",
        COUNT(f.apl_id) as "Count"
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_rejection_reason r ON f.reason_id = r.reason_id
    {where_sql} {reason_filter}
    GROUP BY r.reason_text
    ORDER BY "Count" DESC;
    """
    with engine.connect() as conn:
        return pd.read_sql_query(text(q), con=conn, params=params)

@st.cache_data(ttl=3600, show_spinner="Memuat alasan penolakan per produk...")
def get_rejections_by_product(years=None, products=None, statuses=None):
    """Mengambil sebaran alasan penolakan per produk untuk Halaman 5."""
    where_sql, params = _build_filter_clause(years, products, statuses, exclude_zero_year=False)
    engine = get_db_engine()
    if engine is None:
        return pd.DataFrame()
        
    reason_filter = "AND r.reason_text != 'Not Rejected'" if where_sql else "WHERE r.reason_text != 'Not Rejected'"
    
    q = f"""
    SELECT 
        r.reason_text as "Reason",
        p.product_name,
        COUNT(f.apl_id) as "Count"
    FROM fact_exchange_application f
    JOIN dim_date d ON f.applied_date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_rejection_reason r ON f.reason_id = r.reason_id
    {where_sql} {reason_filter}
    GROUP BY r.reason_text, p.product_name
    ORDER BY "Count" DESC;
    """
    with engine.connect() as conn:
        return pd.read_sql_query(text(q), con=conn, params=params)
