"""
ExpaLens: Main Entry Point Dashboard Streamlit
Departemen Outgoing Exchange (OGX) - AIESEC in UNAND

Menggunakan Streamlit Modern Navigation (st.navigation)
Menghilangkan halaman 'app' dan langsung membuka Ringkasan Utama (Overview).
"""

import streamlit as st
import os
import sys

# Menambahkan src ke sys.path jika belum ada
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from config import PAGE_CONFIG
from utils import load_css

# 1. Konfigurasi Halaman Dasar
st.set_page_config(**PAGE_CONFIG)

# 2. Injeksi Tema CSS Eksekutif (AIESEC Blue Book & Lato Font)
load_css()

# 3. Definisi Navigasi Multi-Halaman Modern
pages = [
    st.Page("pages/1_Overview.py", title="Ringkasan Utama", icon="📊", default=True),
    st.Page("pages/2_Application_Trends.py", title="Tren Pendaftaran", icon="📈"),
    st.Page("pages/3_Conversion_Funnel.py", title="Tahapan Seleksi", icon="🎯"),
    st.Page("pages/4_Destinations.py", title="Negara Tujuan", icon="🗺️"),
    st.Page("pages/5_Rejections.py", title="Alasan Penolakan", icon="🚫"),
]

# Inisialisasi Navigasi: Langsung menampilkan Overview secara default tanpa navbar 'app'
pg = st.navigation(pages, position="sidebar")
pg.run()
