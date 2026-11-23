"""
ExpaLens: Main Entry Point Dashboard Streamlit
Departemen Outgoing Exchange (OGX) - AIESEC in UNAND
"""

import streamlit as st
from config import PAGE_CONFIG, AIESEC_BLUE, MIDNIGHT_NAVY
from utils import load_css, render_global_sidebar
from db_connection import check_db_status

# 1. Konfigurasi Halaman Streamlit
st.set_page_config(**PAGE_CONFIG)

# 2. Injeksi Tema CSS Eksekutif (AIESEC Blue Book & Lato Font)
load_css()

# 3. Bilah Sisi Global
sidebar_filters = render_global_sidebar()

# 4. Header Section Eksekutif (Sesuai DESIGN.md)
st.markdown("""
<div class="header-container">
    <div class="header-title">Welcome back, OGX Team 👋</div>
    <div class="header-subtitle">
        Platform Business Intelligence & Performance Lens untuk monitoring, evaluasi, dan pengambilan keputusan 
        strategis Departemen Outgoing Exchange (OGX) AIESEC in Universitas Andalas.
    </div>
</div>
""", unsafe_allow_html=True)

# 5. Status Koneksi & Informasi Lingkungan
db_active = check_db_status()
col_status1, col_status2 = st.columns([2, 1])

with col_status1:
    st.markdown("""
    <div class="hero-card">
        <div class="hero-card-title">SISTEM ANALITIK TERINTEGRASI</div>
        <div class="hero-card-value">ExpaLens BI</div>
        <p style="font-size: 14px; opacity: 0.9; line-height: 1.6;">
            Mengintegrasikan <strong>75.520 transaksi aplikasi bersih</strong> periode 2021–2025 dari CRM Expa 
            ke dalam Data Mart Star Schema PostgreSQL (<code>aiesec_dw</code>). Dilengkapi 5 halaman dashboard 
            interaktif untuk eksplorasi data secara dinamis.
        </p>
    </div>
    """, unsafe_allow_html=True)

with col_status2:
    if db_active:
        st.success("🟢 **PostgreSQL Terhubung:** Database `aiesec_dw` aktif dan siap melayani kueri.")
    else:
        st.info("ℹ️ **Status Database:** PostgreSQL lokal belum aktif. Aplikasi siap berjalan dalam mode cadangan data.")
    
    st.markdown("""
    <div class="metric-card">
        <div class="metric-card-label">Official Brand Identity</div>
        <div class="metric-card-num" style="color: #037EF3;">AIESEC Blue</div>
        <div style="font-size: 12px; color: #64748B; margin-top: 4px;">Kode HEX: <code>#037EF3</code> | Font: <strong>Lato</strong></div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("### 📑 Navigasi Modul Dashboard Analitik")
st.markdown("Silakan pilih salah satu modul analisis melalui menu di bawah ini atau navigasi bilah samping (*sidebar*):")

# 6. Grid Kartu Navigasi 5 Halaman Dashboard
c1, c2, c3 = st.columns(3)
with c1:
    st.markdown("""
    <div class="metric-card">
        <div class="metric-card-label">Halaman 1</div>
        <div style="font-size: 18px; font-weight: 700; color: #0F172A; margin: 4px 0;">Ringkasan Utama</div>
        <p style="font-size: 13px; color: #64748B;">
            Executive overview, scorecard KPI utama, capaian tahapan per program, dan gauge kelulusan (Finish Rate).
        </p>
        <a href="/Overview" target="_self" style="color: #037EF3; font-weight: 700; text-decoration: none; font-size: 13px;">Buka Halaman Overview →</a>
    </div>
    """, unsafe_allow_html=True)

with c2:
    st.markdown("""
    <div class="metric-card">
        <div class="metric-card-label">Halaman 2</div>
        <div style="font-size: 18px; font-weight: 700; color: #0F172A; margin: 4px 0;">Tren Pendaftaran</div>
        <p style="font-size: 13px; color: #64748B;">
            Tren aplikasi bulanan, komposisi status seleksi, pertumbuhan tahunan produk, dan heatmap musim puncak.
        </p>
        <a href="/Application_Trends" target="_self" style="color: #037EF3; font-weight: 700; text-decoration: none; font-size: 13px;">Buka Halaman Tren →</a>
    </div>
    """, unsafe_allow_html=True)

with c3:
    st.markdown("""
    <div class="metric-card">
        <div class="metric-card-label">Halaman 3</div>
        <div style="font-size: 18px; font-weight: 700; color: #0F172A; margin: 4px 0;">Tahapan Seleksi</div>
        <p style="font-size: 13px; color: #64748B;">
            Rasio konversi antar-tahap (funnel), durasi rata-rata hari proses seleksi, dan scatter plot kecepatan negara.
        </p>
        <a href="/Conversion_Funnel" target="_self" style="color: #037EF3; font-weight: 700; text-decoration: none; font-size: 13px;">Buka Halaman Funnel →</a>
    </div>
    """, unsafe_allow_html=True)

c4, c5 = st.columns(2)
with c4:
    st.markdown("""
    <div class="metric-card">
        <div class="metric-card-label">Halaman 4</div>
        <div style="font-size: 18px; font-weight: 700; color: #0F172A; margin: 4px 0;">Peta & Negara Tujuan</div>
        <p style="font-size: 13px; color: #64748B;">
            Peta koroplet interaktif persebaran pendaftar global (ISO-3) dan penelusuran berjenjang Host LC.
        </p>
        <a href="/Destinations" target="_self" style="color: #037EF3; font-weight: 700; text-decoration: none; font-size: 13px;">Buka Halaman Destinasi →</a>
    </div>
    """, unsafe_allow_html=True)

with c5:
    st.markdown("""
    <div class="metric-card">
        <div class="metric-card-label">Halaman 5</div>
        <div style="font-size: 18px; font-weight: 700; color: #0F172A; margin: 4px 0;">Alasan Penolakan</div>
        <p style="font-size: 13px; color: #64748B;">
            Peringkat penyebab penolakan peserta, tren dari waktu ke waktu, dan Dynamic Recommendation Action Engine.
        </p>
        <a href="/Rejections" target="_self" style="color: #037EF3; font-weight: 700; text-decoration: none; font-size: 13px;">Buka Halaman Penolakan →</a>
    </div>
    """, unsafe_allow_html=True)
