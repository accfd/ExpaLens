"""
Modul Koneksi Basis Data PostgreSQL (aiesec_dw) & Caching Streamlit
"""

import os
import streamlit as st
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Memuat variabel lingkungan dari berkas .env
load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "aiesec_dw")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

@st.cache_resource(show_spinner="Menyambungkan ke basis data PostgreSQL...")
def get_db_engine():
    """
    Membuat dan me-return SQLAlchemy Engine dengan koneksi caching.
    """
    db_url = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    try:
        engine = create_engine(db_url, pool_pre_ping=True)
        return engine
    except Exception as e:
        st.error(f"Gagal membuat engine koneksi basis data: {e}")
        return None

@st.cache_data(ttl=3600, show_spinner="Memuat data analitik...")
def run_query(sql_query: str, params: dict = None) -> pd.DataFrame:
    """
    Mengeksekusi kueri SQL ke PostgreSQL dan mengembalikan pandas DataFrame dengan caching 1 jam.
    """
    engine = get_db_engine()
    if engine is None:
        return pd.DataFrame()
    
    try:
        with engine.connect() as conn:
            df = pd.read_sql_query(sql_query, con=conn, params=params)
        return df
    except Exception as e:
        st.warning(f"Koneksi PostgreSQL lokal tidak tersedia ({e}). Memeriksa cadangan file CSV...")
        return pd.DataFrame()

def check_db_status() -> bool:
    """
    Memeriksa ketersediaan koneksi basis data aktif.
    """
    try:
        engine = get_db_engine()
        if engine is not None:
            with engine.connect() as conn:
                conn.execute(pd.io.sql.text("SELECT 1;"))
            return True
        return False
    except Exception:
        return False
