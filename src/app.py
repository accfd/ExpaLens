"""
ExpaLens: Titik Masuk Utama Dashboard
Departemen Outgoing Exchange - AIESEC in Universitas Andalas

Navigasi multi-halaman resmi tanpa emotikon.
"""

import os
import sys
import streamlit as st

# Menambahkan direktori src ke sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from config import PAGE_CONFIG
from utils import load_css

# 1. Konfigurasi Halaman Dasar
st.set_page_config(**PAGE_CONFIG)

# 2. Memuat Kustomisasi CSS
load_css()

# 3. Definisi Navigasi Halaman Resmi (Tanpa Emotikon)
pages = [
    st.Page("pages/1_Overview.py", title="Ringkasan Utama", default=True),
    st.Page("pages/2_Application_Trends.py", title="Tren Pendaftaran"),
    st.Page("pages/3_Conversion_Funnel.py", title="Tahapan Seleksi"),
    st.Page("pages/4_Destinations.py", title="Negara Tujuan"),
    st.Page("pages/5_Rejections.py", title="Alasan Penolakan"),
]

# Menjalankan Navigasi Bilah Sisi
pg = st.navigation(pages, position="sidebar")
pg.run()
