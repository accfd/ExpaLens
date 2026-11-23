"""
Halaman 3: Tahapan Seleksi dan Kelulusan (Conversion Funnel)
Sesuai: PRD.md Bab 5.5, Tabel 3 Milestone 2, dan DESIGN.md
"""

import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
from config import (
    PAGE_CONFIG, AIESEC_BLUE, MIDNIGHT_NAVY, CORAL_RED, DARK_TEAL, TEACHER_ORANGE,
    EXPALENS_PLOTLY_THEME
)
from utils import load_css, render_global_sidebar

st.set_page_config(**PAGE_CONFIG)
load_css()
sidebar_filters = render_global_sidebar()

st.markdown("""
<div class="header-container">
    <div class="header-title">Halaman 3: Tahapan Seleksi dan Kelulusan (Conversion Funnel)</div>
    <div class="header-subtitle">
        Pengukuran rasio konversi peserta antartahapan seleksi dan analisis efisiensi durasi waktu pemrosesan (Process Speed).
    </div>
</div>
""", unsafe_allow_html=True)

# Top Metric Cards: Rata-rata Hari Pemrosesan
m1, m2, m3, m4 = st.columns(4)
with m1:
    st.markdown("""
    <div class="metric-card">
        <div class="metric-card-label">Avg Days to Accept</div>
        <div class="metric-card-num" style="color: #037EF3;">14.5 Hari</div>
        <div style="font-size: 11px; color: #64748B;">Applied → Accepted</div>
    </div>
    """, unsafe_allow_html=True)

with m2:
    st.markdown("""
    <div class="metric-card">
        <div class="metric-card-label">Avg Days to Approve</div>
        <div class="metric-card-num" style="color: #0A8EA0;">7.2 Hari</div>
        <div style="font-size: 11px; color: #64748B;">Accepted → Approved</div>
    </div>
    """, unsafe_allow_html=True)

with m3:
    st.markdown("""
    <div class="metric-card">
        <div class="metric-card-label">Avg Days to Realize</div>
        <div class="metric-card-num" style="color: #F59E0B;">32.0 Hari</div>
        <div style="font-size: 11px; color: #64748B;">Approved → Realized</div>
    </div>
    """, unsafe_allow_html=True)

with m4:
    st.markdown("""
    <div class="metric-card">
        <div class="metric-card-label">Avg Days to Finish</div>
        <div class="metric-card-num" style="color: #10B981;">45.8 Hari</div>
        <div style="font-size: 11px; color: #64748B;">Realized → Finished</div>
    </div>
    """, unsafe_allow_html=True)

col_mid1, col_mid2 = st.columns(2)

with col_mid1:
    # No. 11: Funnel Chart Rasio Konversi
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 11: Persentase Konversi Antartahapan (Conversion Rate)</div>
    </div>
    """, unsafe_allow_html=True)
    
    stages = ["Applied", "Accepted", "Approved", "Realized", "Finished"]
    vals = [75520, 48500, 31200, 18900, 12150]
    
    fig_conv = go.Figure(go.Funnel(
        y=stages, x=vals,
        textinfo="value+percent previous",
        marker=dict(color=[AIESEC_BLUE, "#0A8EA0", "#30C39E", "#F48924", "#F85A40"])
    ))
    fig_conv.update_layout(**EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(), height=340)
    st.plotly_chart(fig_conv, use_container_width=True)

with col_mid2:
    # No. 12: Clustered Bar Chart Durasi per Program
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 12: Rata-Rata Waktu Proses per Program (Hari)</div>
    </div>
    """, unsafe_allow_html=True)
    
    metrics = ["Days to Accept", "Days to Approve", "Days to Realize", "Days to Finish"]
    fig_time = go.Figure(data=[
        go.Bar(name="GV", x=metrics, y=[12, 6, 28, 42], marker_color=CORAL_RED),
        go.Bar(name="GTa", x=metrics, y=[18, 9, 38, 52], marker_color=DARK_TEAL),
        go.Bar(name="GTe", x=metrics, y=[15, 8, 34, 48], marker_color=TEACHER_ORANGE)
    ])
    fig_time.update_layout(**EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(), barmode="group", height=340)
    st.plotly_chart(fig_time, use_container_width=True)

col_bot1, col_bot2 = st.columns([1, 1.4])

with col_bot1:
    # No. 13: Stacked Column Chart Tahapan Penolakan
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 13: Tahapan Terjadinya Penolakan (Rejection Stage)</div>
    </div>
    """, unsafe_allow_html=True)
    
    prods = ["GV", "GTa", "GTe"]
    fig_stage = go.Figure(data=[
        go.Bar(name="Pre-Accepted", x=prods, y=[65, 58, 62], marker_color="#EF4444"),
        go.Bar(name="Post-Accepted", x=prods, y=[25, 30, 26], marker_color="#F59E0B"),
        go.Bar(name="Post-Approved", x=prods, y=[10, 12, 12], marker_color="#94A3B8")
    ])
    fig_stage.update_layout(**EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(), barmode="stack", height=300)
    st.plotly_chart(fig_stage, use_container_width=True)

with col_bot2:
    # No. 14: Scatter Chart Kecepatan Seleksi vs Volume Negara
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 14: Kecepatan Proses vs Volume Pendaftaran per Negara</div>
    </div>
    """, unsafe_allow_html=True)
    
    # Placeholder Scatter data
    countries = ["Malaysia", "Turkey", "Vietnam", "Taiwan", "Thailand", "Egypt", "India", "Poland"]
    avg_days = [10.5, 18.2, 12.1, 14.8, 11.2, 22.4, 16.5, 20.1]
    apps_count = [12400, 9800, 8500, 7200, 6800, 5100, 4900, 3200]
    
    fig_scatter = px.scatter(
        x=avg_days, y=apps_count, text=countries, size=apps_count,
        color_discrete_sequence=[AIESEC_BLUE],
        labels={"x": "Rata-rata Waktu Proses (Hari)", "y": "Total Pendaftaran"}
    )
    fig_scatter.update_traces(textposition='top center')
    fig_scatter.update_layout(**EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(), height=300)
    st.plotly_chart(fig_scatter, use_container_width=True)
