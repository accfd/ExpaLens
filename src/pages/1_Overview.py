"""
Halaman 1: Ringkasan Utama (Overview)
Sesuai: PRD.md Bab 5.3, Tabel 3 Milestone 2, dan DESIGN.md
Terhubung langsung secara reaktif ke database PostgreSQL aiesec_dw.
"""

import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
from config import (
    PAGE_CONFIG, AIESEC_BLUE, MIDNIGHT_NAVY, CORAL_RED, DARK_TEAL, TEACHER_ORANGE,
    EXPALENS_PLOTLY_THEME, PRODUCT_COLOR_MAP
)
from utils import load_css, render_global_sidebar, format_number, format_percent, format_days
from db_connection import (
    get_overview_data, get_product_breakdown_overview, get_program_achievements
)

st.set_page_config(**PAGE_CONFIG)
load_css()
sidebar_filters = render_global_sidebar()

# Mengambil data riil dari PostgreSQL sesuai filter sidebar
years = sidebar_filters["years"]
products = sidebar_filters["products"]
statuses = sidebar_filters["statuses"]

ov_data = get_overview_data(years=years, products=products, statuses=statuses)
prod_breakdown = get_product_breakdown_overview(years=years, products=products, statuses=statuses)
achieve_df = get_program_achievements(years=years, products=products, statuses=statuses)

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

# Ekstraksi angka breakdown produk
prod_counts = {"GV (New)": 0, "GTa": 0, "GTe": 0}
if not prod_breakdown.empty:
    for _, row in prod_breakdown.iterrows():
        p_name = row["product_name"]
        if p_name in prod_counts:
            prod_counts[p_name] = row["total_apps"]

total_apps_val = ov_data.get("total_applications", 0)
total_accepted_val = ov_data.get("total_accepted", 0)
total_approved_val = ov_data.get("total_approved", 0)
total_realized_val = ov_data.get("total_realized", 0)
total_finished_val = ov_data.get("total_finished", 0)
finish_rate_val = ov_data.get("finish_rate", 0.0)
avg_days_accept = ov_data.get("avg_days_to_accept", 0.0)

with col_left:
    # No. 1: Hero Card Gelap (Midnight Navy #0A2540)
    st.markdown(f"""
    <div class="hero-card">
        <div class="hero-card-title">TOTAL PENDAFTARAN (APPLICATIONS)</div>
        <div class="hero-card-value">{format_number(total_apps_val)}</div>
        <table class="hero-card-table">
            <tr>
                <td><strong>Global Talent (GTa)</strong></td>
                <td style="text-align: right; color: {DARK_TEAL}; font-weight: 700;">{format_number(prod_counts['GTa'])}</td>
            </tr>
            <tr>
                <td><strong>Global Teacher (GTe)</strong></td>
                <td style="text-align: right; color: {TEACHER_ORANGE}; font-weight: 700;">{format_number(prod_counts['GTe'])}</td>
            </tr>
            <tr>
                <td><strong>Global Volunteer (GV)</strong></td>
                <td style="text-align: right; color: {CORAL_RED}; font-weight: 700;">{format_number(prod_counts['GV (New)'])}</td>
            </tr>
        </table>
    </div>
    """, unsafe_allow_html=True)
    
    # KPI Total Realized, Finished, & Rata-rata Durasi
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-card-label">Total Realized & Finished</div>
        <div class="metric-card-num" style="color: #10B981;">{format_number(total_realized_val)} / {format_number(total_finished_val)}</div>
        <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Peserta berangkat / menyelesaikan program</div>
    </div>
    <div class="metric-card">
        <div class="metric-card-label">Rata-rata Waktu Proses Seleksi</div>
        <div class="metric-card-num" style="color: #037EF3;">{format_days(avg_days_accept)}</div>
        <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Applied → Accepted</div>
    </div>
    """, unsafe_allow_html=True)

    # No. 4: Persentase keberhasilan penyelesaian program (Finish Rate Gauge Chart)
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">Keberhasilan Kelulusan (Finish Rate)</div>
    </div>
    """, unsafe_allow_html=True)
    
    gauge_val = min(100.0, max(0.0, float(finish_rate_val)))
    fig_gauge = go.Figure(go.Indicator(
        mode="gauge+number",
        value=gauge_val,
        number={"suffix": "%", "font": {"family": "Lato, sans-serif", "size": 32, "color": MIDNIGHT_NAVY}},
        gauge={
            "axis": {"range": [0, 100], "tickfont": {"size": 10}},
            "bar": {"color": AIESEC_BLUE},
            "steps": [
                {"range": [0, 30], "color": "#FEE2E2"},
                {"range": [30, 60], "color": "#FEF3C7"},
                {"range": [60, 100], "color": "#D1FAE5"}
            ],
            "threshold": {
                "line": {"color": "#10B981", "width": 4},
                "thickness": 0.75,
                "value": 50
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
    # No. 2: Customer Funnel Chart
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 2: Corong Konversi Seleksi Aplikasi (Customer Funnel Chart)</div>
    </div>
    """, unsafe_allow_html=True)
    
    funnel_stages = ["1. Applied", "2. Accepted", "3. Approved", "4. Realized", "5. Finished"]
    funnel_values = [total_apps_val, total_accepted_val, total_approved_val, total_realized_val, total_finished_val]
    
    fig_funnel = go.Figure(go.Funnel(
        y=funnel_stages,
        x=funnel_values,
        textinfo="value+percent initial",
        marker=dict(color=[AIESEC_BLUE, "#0A8EA0", "#30C39E", "#F48924", "#10B981"]),
        connector=dict(line=dict(color="#CACCD1", width=1))
    ))
    fig_funnel.update_layout(
        **EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(),
        height=330,
        margin=dict(t=20, b=20, l=120, r=20)
    )
    st.plotly_chart(fig_funnel, use_container_width=True)
    
    # No. 3: Clustered Column Chart Capaian per Program
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 3: Capaian Tahapan Seleksi per Program Pertukaran (GV, GTa, GTe)</div>
    </div>
    """, unsafe_allow_html=True)
    
    if not achieve_df.empty:
        fig_clustered = go.Figure()
        fig_clustered.add_trace(go.Bar(
            name="Accepted",
            x=achieve_df["product_name"],
            y=achieve_df["accepted"],
            marker_color=AIESEC_BLUE,
            text=achieve_df["accepted"],
            textposition="auto"
        ))
        fig_clustered.add_trace(go.Bar(
            name="Approved",
            x=achieve_df["product_name"],
            y=achieve_df["approved"],
            marker_color=DARK_TEAL,
            text=achieve_df["approved"],
            textposition="auto"
        ))
        fig_clustered.add_trace(go.Bar(
            name="Realized",
            x=achieve_df["product_name"],
            y=achieve_df["realized"],
            marker_color=TEACHER_ORANGE,
            text=achieve_df["realized"],
            textposition="auto"
        ))
        fig_clustered.add_trace(go.Bar(
            name="Finished",
            x=achieve_df["product_name"],
            y=achieve_df["finished"],
            marker_color="#10B981",
            text=achieve_df["finished"],
            textposition="auto"
        ))
        fig_clustered.update_layout(
            **EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(),
            barmode="group",
            height=330,
            xaxis_title="Program Pertukaran",
            yaxis_title="Jumlah Peserta"
        )
        st.plotly_chart(fig_clustered, use_container_width=True)
    else:
        st.info("Tidak ada data capaian program untuk filter yang dipilih.")
