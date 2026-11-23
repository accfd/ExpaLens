"""
Halaman 1: Ringkasan Utama (Overview)
Sesuai: PRD.md Bab 5.3, Tabel 3 Milestone 2, dan DESIGN.md (AIESEC Blue Book)
Dashboard Eksekutif Terpadu & Terhubung Langsung ke PostgreSQL aiesec_dw
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

# 1. Konfigurasi Halaman & Injeksi Desain CSS
st.set_page_config(**PAGE_CONFIG)
load_css()
sidebar_filters = render_global_sidebar()

# 2. Pengambilan Data Riil Berdasarkan Filter Sidebar Aktif
years = sidebar_filters["years"]
products = sidebar_filters["products"]
statuses = sidebar_filters["statuses"]

ov_data = get_overview_data(years=years, products=products, statuses=statuses)
prod_breakdown = get_product_breakdown_overview(years=years, products=products, statuses=statuses)
achieve_df = get_program_achievements(years=years, products=products, statuses=statuses)

# Ekstraksi Variabel Metrik
total_apps_val = ov_data.get("total_applications", 0)
total_accepted_val = ov_data.get("total_accepted", 0)
total_approved_val = ov_data.get("total_approved", 0)
total_realized_val = ov_data.get("total_realized", 0)
total_finished_val = ov_data.get("total_finished", 0)
finish_rate_val = ov_data.get("finish_rate", 0.0)
avg_days_accept = ov_data.get("avg_days_to_accept", 0.0)

# Pemetaan Volume Produk
prod_counts = {"GV (New)": 0, "GTa": 0, "GTe": 0}
if not prod_breakdown.empty:
    for _, row in prod_breakdown.iterrows():
        p_name = row["product_name"]
        if p_name in prod_counts:
            prod_counts[p_name] = row["total_apps"]

# 3. Header Section Bersih & Eksekutif
st.markdown("""
<div class="header-container">
    <div class="header-title">Executive Overview: OGX Performance</div>
    <div class="header-subtitle">
        Tinjauan komprehensif performa pendaftaran, capaian tahapan seleksi, dan efisiensi konversi Departemen Outgoing Exchange AIESEC in UNAND.
    </div>
</div>
""", unsafe_allow_html=True)

# 4. BARIS 1: Hero Card & Funnel Chart (Rasio 1 : 2.2)
col_hero, col_funnel = st.columns([1, 2.2])

with col_hero:
    st.markdown(f"""
    <div class="hero-card">
        <div class="hero-card-title">TOTAL PENDAFTARAN (APPLICATIONS)</div>
        <div class="hero-card-value">{format_number(total_apps_val)}</div>
        <table class="hero-card-table">
            <tr>
                <td><strong>Global Talent (GTa)</strong></td>
                <td style="text-align: right; color: {DARK_TEAL}; font-weight: 700; font-size: 14px;">
                    {format_number(prod_counts['GTa'])}
                </td>
            </tr>
            <tr>
                <td><strong>Global Teacher (GTe)</strong></td>
                <td style="text-align: right; color: {TEACHER_ORANGE}; font-weight: 700; font-size: 14px;">
                    {format_number(prod_counts['GTe'])}
                </td>
            </tr>
            <tr>
                <td><strong>Global Volunteer (GV)</strong></td>
                <td style="text-align: right; color: {CORAL_RED}; font-weight: 700; font-size: 14px;">
                    {format_number(prod_counts['GV (New)'])}
                </td>
            </tr>
        </table>
    </div>
    """, unsafe_allow_html=True)

with col_funnel:
    st.markdown("""
    <div class="chart-container">
        <div class="chart-header">
            <div class="chart-title">Corong Konversi Seleksi Utama (Customer Funnel)</div>
            <div class="chart-subtitle">Distribusi volume peserta dan persentase retensi kumulatif dari tahap pendaftaran hingga penyelesaian program.</div>
        </div>
    """, unsafe_allow_html=True)
    
    funnel_stages = ["1. Applied", "2. Accepted", "3. Approved", "4. Realized", "5. Finished"]
    funnel_values = [total_apps_val, total_accepted_val, total_approved_val, total_realized_val, total_finished_val]
    
    fig_funnel = go.Figure(go.Funnel(
        y=funnel_stages,
        x=funnel_values,
        textinfo="value+percent initial",
        marker=dict(color=[AIESEC_BLUE, "#0A8EA0", "#30C39E", "#F48924", "#10B981"]),
        connector=dict(line=dict(color="#E2E8F0", width=1.5)),
        textfont=dict(family="Lato, sans-serif", size=13, color="#FFFFFF")
    ))
    fig_funnel.update_layout(
        **EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(),
        height=245,
        margin=dict(t=10, b=10, l=110, r=20)
    )
    st.plotly_chart(fig_funnel, use_container_width=True)
    st.markdown("</div>", unsafe_allow_html=True)

# 5. BARIS 2: 4 Kartu KPI Eksekutif Bersebelahan (Grid 4 Kolom)
kpi1, kpi2, kpi3, kpi4 = st.columns(4)

with kpi1:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-card-label">Total Realized</div>
        <div class="metric-card-num" style="color: #0F172A;">{format_number(total_realized_val)}</div>
        <div class="metric-card-desc">Peserta Berangkat ke Luar Negeri</div>
        <span class="metric-card-badge" style="background-color: #DCFCE7; color: #15803D;">● Berangkat Aktif</span>
    </div>
    """, unsafe_allow_html=True)

with kpi2:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-card-label">Total Finished</div>
        <div class="metric-card-num" style="color: #0F172A;">{format_number(total_finished_val)}</div>
        <div class="metric-card-desc">Peserta Menyelesaikan Program</div>
        <span class="metric-card-badge" style="background-color: #EFF6FF; color: #1D4ED8;">● Lulus Evaluasi</span>
    </div>
    """, unsafe_allow_html=True)

with kpi3:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-card-label">Finish Rate</div>
        <div class="metric-card-num" style="color: {AIESEC_BLUE};">{format_percent(finish_rate_val)}</div>
        <div class="metric-card-desc">Rasio Kelulusan dari Diterima</div>
        <span class="metric-card-badge" style="background-color: #FEF3C7; color: #B45309;">Target: ≥50.0%</span>
    </div>
    """, unsafe_allow_html=True)

with kpi4:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-card-label">Avg Selection Time</div>
        <div class="metric-card-num" style="color: #0F172A;">{format_days(avg_days_accept)}</div>
        <div class="metric-card-desc">Applied → Accepted</div>
        <span class="metric-card-badge" style="background-color: #F1F5F9; color: #475569;">Durasi Seleksi Awal</span>
    </div>
    """, unsafe_allow_html=True)

# 6. BARIS 3: Dua Grafik Seimbang (Grid 2 Kolom 50% : 50%)
col_chart_left, col_chart_right = st.columns(2)

with col_chart_left:
    st.markdown("""
    <div class="chart-container">
        <div class="chart-header">
            <div class="chart-title">Capaian Tahapan per Program Pertukaran</div>
            <div class="chart-subtitle">Perbandingan jumlah peserta pada tahap Accepted, Approved, Realized, dan Finished untuk GTa, GTe, dan GV.</div>
        </div>
    """, unsafe_allow_html=True)
    
    if not achieve_df.empty:
        fig_clustered = go.Figure()
        fig_clustered.add_trace(go.Bar(
            name="Accepted",
            x=achieve_df["product_name"],
            y=achieve_df["accepted"],
            marker_color=AIESEC_BLUE,
            text=achieve_df["accepted"].apply(lambda x: f"{int(x):,}" if x > 0 else ""),
            textposition="outside",
            textfont=dict(size=11, family="Lato, sans-serif")
        ))
        fig_clustered.add_trace(go.Bar(
            name="Approved",
            x=achieve_df["product_name"],
            y=achieve_df["approved"],
            marker_color=DARK_TEAL,
            text=achieve_df["approved"].apply(lambda x: f"{int(x):,}" if x > 0 else ""),
            textposition="outside",
            textfont=dict(size=11, family="Lato, sans-serif")
        ))
        fig_clustered.add_trace(go.Bar(
            name="Realized",
            x=achieve_df["product_name"],
            y=achieve_df["realized"],
            marker_color=TEACHER_ORANGE,
            text=achieve_df["realized"].apply(lambda x: f"{int(x):,}" if x > 0 else ""),
            textposition="outside",
            textfont=dict(size=11, family="Lato, sans-serif")
        ))
        fig_clustered.add_trace(go.Bar(
            name="Finished",
            x=achieve_df["product_name"],
            y=achieve_df["finished"],
            marker_color="#10B981",
            text=achieve_df["finished"].apply(lambda x: f"{int(x):,}" if x > 0 else ""),
            textposition="outside",
            textfont=dict(size=11, family="Lato, sans-serif")
        ))
        fig_clustered.update_layout(
            **EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(),
            barmode="group",
            height=320,
            xaxis_title="Program Pertukaran",
            yaxis_title="Jumlah Peserta",
            margin=dict(t=30, b=20, l=40, r=20),
            legend=dict(orientation="h", yanchor="bottom", y=1.04, xanchor="right", x=1)
        )
        st.plotly_chart(fig_clustered, use_container_width=True)
    else:
        st.info("Tidak ada data capaian program untuk filter yang dipilih.")
    st.markdown("</div>", unsafe_allow_html=True)

with col_chart_right:
    st.markdown("""
    <div class="chart-container">
        <div class="chart-header">
            <div class="chart-title">Keberhasilan Kelulusan (Finish Rate)</div>
            <div class="chart-subtitle">Persentase peserta yang menyelesaikan program dibandingkan total peserta diterima (Target: ≥50%).</div>
        </div>
    """, unsafe_allow_html=True)
    
    gauge_val = min(100.0, max(0.0, float(finish_rate_val)))
    fig_gauge = go.Figure(go.Indicator(
        mode="gauge+number",
        value=gauge_val,
        number={
            "suffix": "%",
            "font": {"family": "Lato, sans-serif", "size": 36, "color": MIDNIGHT_NAVY}
        },
        gauge={
            "axis": {
                "range": [0, 100],
                "tickfont": {"size": 11, "family": "Lato, sans-serif"},
                "tickcolor": "#CACCD1",
                "dtick": 20
            },
            "bar": {"color": AIESEC_BLUE, "thickness": 0.28},
            "bgcolor": "#F8FAFC",
            "borderwidth": 1,
            "bordercolor": "#E2E8F0",
            "steps": [
                {"range": [0, 30], "color": "#FEE2E2"},
                {"range": [30, 60], "color": "#FEF3C7"},
                {"range": [60, 100], "color": "#D1FAE5"}
            ],
            "threshold": {
                "line": {"color": "#10B981", "width": 4},
                "thickness": 0.8,
                "value": 50
            }
        }
    ))
    fig_gauge.update_layout(
        **EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(),
        height=290,
        margin=dict(t=25, b=20, l=30, r=30)
    )
    st.plotly_chart(fig_gauge, use_container_width=True)
    st.markdown("</div>", unsafe_allow_html=True)
