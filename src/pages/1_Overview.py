"""
Halaman 1: Ringkasan Utama (Overview)
Sesuai: PRD.md Bab 5.3, Tabel 3 Milestone 2, dan DESIGN.md
"""

import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
from config import (
    PAGE_CONFIG, AIESEC_BLUE, MIDNIGHT_NAVY, CORAL_RED, DARK_TEAL, TEACHER_ORANGE,
    EXPALENS_PLOTLY_THEME, PRODUCT_COLOR_MAP
)
from utils import load_css, render_global_sidebar, format_number, format_percent

st.set_page_config(**PAGE_CONFIG)
load_css()
sidebar_filters = render_global_sidebar()

# Header Halaman
st.markdown("""
<div class="header-container">
    <div class="header-title">Halaman 1: Ringkasan Utama (Overview)</div>
    <div class="header-subtitle">
        Tinjauan kinerja pendaftaran program pertukaran pemuda internasional Departemen Outgoing Exchange AIESEC in UNAND.
    </div>
</div>
""", unsafe_allow_html=True)

# Layout Eksekutif (Kolom Kiri 30% : Kolom Kanan 70%)
col_left, col_right = st.columns([1, 2.3])

with col_left:
    # No. 1: Hero Card Gelap (Midnight Navy #0A2540)
    st.markdown("""
    <div class="hero-card">
        <div class="hero-card-title">TOTAL PENDAFTARAN (ALL TIME)</div>
        <div class="hero-card-value">75,520</div>
        <table class="hero-card-table">
            <tr>
                <td><strong>Global Volunteer (GV)</strong></td>
                <td style="text-align: right; color: #F85A40; font-weight: 700;">42,150</td>
            </tr>
            <tr>
                <td><strong>Global Talent (GTa)</strong></td>
                <td style="text-align: right; color: #0A8EA0; font-weight: 700;">21,300</td>
            </tr>
            <tr>
                <td><strong>Global Teacher (GTe)</strong></td>
                <td style="text-align: right; color: #F48924; font-weight: 700;">12,070</td>
            </tr>
        </table>
    </div>
    """, unsafe_allow_html=True)
    
    # KPI Pertumbuhan YoY & Rata-rata Durasi
    st.markdown("""
    <div class="metric-card">
        <div class="metric-card-label">Pertumbuhan Tahunan (YoY Growth)</div>
        <div class="metric-card-num" style="color: #10B981;">+14.2%</div>
        <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Dibandingkan tahun sebelumnya</div>
    </div>
    <div class="metric-card">
        <div class="metric-card-label">Rata-rata Waktu Proses Seleksi</div>
        <div class="metric-card-num" style="color: #037EF3;">14.5 Hari</div>
        <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Applied → Accepted</div>
    </div>
    """, unsafe_allow_html=True)

    # No. 4: Persentase keberhasilan penyelesaian program (Finish Rate Gauge Chart)
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">Keberhasilan Kelulusan (Finish Rate)</div>
    </div>
    """, unsafe_allow_html=True)
    
    # TODO: Integrasikan data real dari PostgreSQL untuk nilai Finish Rate
    fig_gauge = go.Figure(go.Indicator(
        mode="gauge+number",
        value=64.2,
        number={"suffix": "%", "font": {"family": "Lato, sans-serif", "size": 32, "color": MIDNIGHT_NAVY}},
        gauge={
            "axis": {"range": [0, 100], "tickfont": {"size": 10}},
            "bar": {"color": AIESEC_BLUE},
            "steps": [
                {"range": [0, 50], "color": "#FEE2E2"},
                {"range": [50, 70], "color": "#FEF3C7"},
                {"range": [70, 100], "color": "#D1FAE5"}
            ],
            "threshold": {
                "line": {"color": "#10B981", "width": 4},
                "thickness": 0.75,
                "value": 70
            }
        }
    ))
    fig_gauge.update_layout(
        **EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(),
        height=220,
        margin=dict(t=10, b=10, l=20, r=20)
    )
    st.plotly_chart(fig_gauge, use_container_width=True)

with col_right:
    # No. 2: Distribusi jumlah peserta pada setiap tahapan seleksi (Customer Funnel Chart)
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">Distribusi Tahapan Seleksi (Customer Funnel Progress)</div>
    </div>
    """, unsafe_allow_html=True)
    
    # Placeholder visual Funnel
    funnel_stages = ["Applied", "Accepted", "Approved", "Realized", "Finished"]
    funnel_values = [75520, 48500, 31200, 18900, 12150]
    
    fig_funnel = go.Figure(go.Funnel(
        y=funnel_stages,
        x=funnel_values,
        textinfo="value+percent initial",
        marker=dict(color=[AIESEC_BLUE, "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"]),
        connector=dict(line=dict(color="#CACCD1", width=1))
    ))
    fig_funnel.update_layout(
        **EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(),
        height=320,
        margin=dict(t=20, b=20, l=60, r=20)
    )
    st.plotly_chart(fig_funnel, use_container_width=True)
    
    # No. 3: Perbandingan pencapaian setiap tahapan seleksi berdasarkan jenis program pertukaran
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">Pencapaian Tahapan Seleksi per Program Pertukaran</div>
    </div>
    """, unsafe_allow_html=True)
    
    # Placeholder Clustered Column Chart (GV, GTa, GTe)
    stages = ["Accepted", "Approved", "Finished"]
    fig_bar = go.Figure(data=[
        go.Bar(name="Global Volunteer (GV)", x=stages, y=[28000, 19500, 8200], marker_color=CORAL_RED),
        go.Bar(name="Global Talent (GTa)", x=stages, y=[13500, 8200, 2600], marker_color=DARK_TEAL),
        go.Bar(name="Global Teacher (GTe)", x=stages, y=[7000, 3500, 1350], marker_color=TEACHER_ORANGE)
    ])
    fig_bar.update_layout(
        **EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(),
        barmode="group",
        height=320
    )
    st.plotly_chart(fig_bar, use_container_width=True)
