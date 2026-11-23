"""
Halaman 2: Tren Pendaftaran (Application Trends)
Sesuai: PRD.md Bab 5.4, Tabel 3 Milestone 2, dan DESIGN.md
"""

import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import numpy as np
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
    <div class="header-title">Halaman 2: Tren Pendaftaran (Application Trends)</div>
    <div class="header-subtitle">
        Analisis dinamika volume pendaftaran bulanan, komposisi status akhir, dan siklus musim puncak (Summer & Winter Peak).
    </div>
</div>
""", unsafe_allow_html=True)

# No. 6: Line Chart Perkembangan Jumlah Pendaftaran Peserta Setiap Bulan
st.markdown("""
<div class="chart-container">
    <div class="chart-title">No. 6: Perkembangan Jumlah Pendaftaran Peserta Setiap Bulan (2021–2025)</div>
</div>
""", unsafe_allow_html=True)

# Placeholder Line Chart Time-Series
months = pd.date_range(start="2021-01-01", end="2025-12-31", freq="MS")
np.random.seed(42)
volume = np.random.randint(400, 2200, size=len(months))

fig_line = go.Figure()
fig_line.add_trace(go.Scatter(
    x=months, y=volume,
    mode="lines+markers",
    name="Total Aplikasi",
    line=dict(color=AIESEC_BLUE, width=3, shape="spline"),
    marker=dict(size=5, color=MIDNIGHT_NAVY)
))
fig_line.update_layout(
    **EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(),
    height=340,
    xaxis_title="Garis Waktu Bulanan",
    yaxis_title="Jumlah Pendaftaran (Aplikasi)"
)
st.plotly_chart(fig_line, use_container_width=True)

col_mid1, col_mid2 = st.columns(2)

with col_mid1:
    # No. 7: Stacked Area Chart Komposisi Status Utama per Bulan
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 7: Komposisi Status Bulanan (Accepted, Finished, Rejected)</div>
    </div>
    """, unsafe_allow_html=True)
    
    # Placeholder Area Chart
    fig_area = go.Figure()
    fig_area.add_trace(go.Scatter(x=months[-24:], y=np.random.randint(200, 700, 24), mode='lines', stackgroup='one', name='Accepted', line=dict(color='#F59E0B')))
    fig_area.add_trace(go.Scatter(x=months[-24:], y=np.random.randint(100, 400, 24), mode='lines', stackgroup='one', name='Finished', line=dict(color='#10B981')))
    fig_area.add_trace(go.Scatter(x=months[-24:], y=np.random.randint(150, 500, 24), mode='lines', stackgroup='one', name='Rejected', line=dict(color='#EF4444')))
    fig_area.update_layout(**EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(), height=320)
    st.plotly_chart(fig_area, use_container_width=True)

with col_mid2:
    # No. 8: Clustered Column Chart Perkembangan per Program dari Tahun ke Tahun
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 8: Tren Pendaftaran Tahunan per Program (GV, GTa, GTe)</div>
    </div>
    """, unsafe_allow_html=True)
    
    years = [2021, 2022, 2023, 2024, 2025]
    fig_prod_year = go.Figure(data=[
        go.Bar(name="Global Volunteer (GV)", x=years, y=[7200, 8900, 9500, 8400, 8150], marker_color=CORAL_RED),
        go.Bar(name="Global Talent (GTa)", x=years, y=[3100, 4200, 4800, 4600, 4600], marker_color=DARK_TEAL),
        go.Bar(name="Global Teacher (GTe)", x=years, y=[1800, 2400, 2900, 2600, 2370], marker_color=TEACHER_ORANGE)
    ])
    fig_prod_year.update_layout(**EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(), barmode='group', height=320)
    st.plotly_chart(fig_prod_year, use_container_width=True)

col_bot1, col_bot2 = st.columns([1.5, 1])

with col_bot1:
    # No. 9: Matrix Heatmap Seasonality (Bulan vs Tahun)
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 9: Pola Musiman Pendaftaran (Seasonality Heatmap)</div>
    </div>
    """, unsafe_allow_html=True)
    
    month_names = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"]
    heatmap_data = np.random.randint(100, 900, size=(5, 12))
    
    fig_heatmap = go.Figure(data=go.Heatmap(
        z=heatmap_data,
        x=month_names,
        y=["2021", "2022", "2023", "2024", "2025"],
        colorscale=[[0, "#F0F6FF"], [0.5, "#60A5FA"], [1, AIESEC_BLUE]]
    ))
    fig_heatmap.update_layout(**EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(), height=260)
    st.plotly_chart(fig_heatmap, use_container_width=True)

with col_bot2:
    # No. 10: 100% Stacked Bar Chart Metode Pelaksanaan & Durasi
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 10: Preferensi Remote & Durasi</div>
    </div>
    """, unsafe_allow_html=True)
    
    prods = ["GV", "GTa", "GTe"]
    fig_pref = go.Figure(data=[
        go.Bar(name="On-site", x=prods, y=[75, 45, 60], marker_color=AIESEC_BLUE),
        go.Bar(name="Semi-Remote", x=prods, y=[25, 55, 40], marker_color="#93C5FD")
    ])
    fig_pref.update_layout(**EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(), barmode='relative', height=260)
    st.plotly_chart(fig_pref, use_container_width=True)
