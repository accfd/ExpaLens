"""
Halaman 2: Tren Pendaftaran (Application Trends)
Sesuai: PRD.md Bab 5.4, Tabel 3 Milestone 2, dan DESIGN.md
Terhubung langsung secara reaktif ke database PostgreSQL aiesec_dw.
"""

import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
from config import (
    PAGE_CONFIG, AIESEC_BLUE, MIDNIGHT_NAVY, CORAL_RED, DARK_TEAL, TEACHER_ORANGE,
    EXPALENS_PLOTLY_THEME, PRODUCT_COLOR_MAP, apply_plot_theme
)
from utils import load_css, render_global_sidebar
from db_connection import (
    get_monthly_application_trends, get_yearly_product_trends,
    get_seasonality_heatmap_data, get_duration_preferences
)

load_css()
sidebar_filters = render_global_sidebar()

years = sidebar_filters["years"]
products = sidebar_filters["products"]
statuses = sidebar_filters["statuses"]

# Memuat data agregat riil dari PostgreSQL
trend_df = get_monthly_application_trends(years=years, products=products, statuses=statuses)
yearly_prod_df = get_yearly_product_trends(years=years, products=products, statuses=statuses)
heatmap_df = get_seasonality_heatmap_data(years=years, products=products, statuses=statuses)
duration_df = get_duration_preferences(years=years, products=products, statuses=statuses)

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

if not trend_df.empty:
    fig_line = go.Figure()
    fig_line.add_trace(go.Scatter(
        x=trend_df["period_date"],
        y=trend_df["total_apps"],
        mode="lines+markers",
        name="Total Aplikasi Bulanan",
        line=dict(color=AIESEC_BLUE, width=3, shape="spline"),
        marker=dict(size=6, color=MIDNIGHT_NAVY),
        hovertemplate="<b>%{x|%B %Y}</b><br>Total Aplikasi: %{y:,}<extra></extra>"
    ))
    apply_plot_theme(
        fig_line,
        height=340,
        xaxis_title="Garis Waktu Bulanan",
        yaxis_title="Jumlah Pendaftaran (Aplikasi)"
    )
    st.plotly_chart(fig_line, use_container_width=True)
else:
    st.info("Tidak ada data tren bulanan yang cocok dengan kriteria filter.")

col_mid1, col_mid2 = st.columns(2)

with col_mid1:
    # No. 7: Stacked Area Chart Komposisi Status Utama per Bulan
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 7: Komposisi Status Bulanan (Accepted, Finished, Rejected)</div>
    </div>
    """, unsafe_allow_html=True)
    
    if not trend_df.empty:
        fig_area = go.Figure()
        fig_area.add_trace(go.Scatter(
            x=trend_df["period_date"], y=trend_df["accepted"],
            mode="lines", stackgroup="one", name="Accepted",
            line=dict(color="#F59E0B", width=1), fillcolor="rgba(245, 158, 11, 0.6)"
        ))
        fig_area.add_trace(go.Scatter(
            x=trend_df["period_date"], y=trend_df["finished"],
            mode="lines", stackgroup="one", name="Finished",
            line=dict(color="#10B981", width=1), fillcolor="rgba(16, 185, 129, 0.6)"
        ))
        fig_area.add_trace(go.Scatter(
            x=trend_df["period_date"], y=trend_df["rejected"],
            mode="lines", stackgroup="one", name="Rejected",
            line=dict(color="#EF4444", width=1), fillcolor="rgba(239, 68, 68, 0.5)"
        ))
        apply_plot_theme(
            fig_area,
            height=320,
            xaxis_title="Periode",
            yaxis_title="Volume Peserta"
        )
        st.plotly_chart(fig_area, use_container_width=True)
    else:
        st.info("Tidak ada data status bulanan.")

with col_mid2:
    # No. 8: Clustered Column Chart Perkembangan per Program dari Tahun ke Tahun
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 8: Tren Pendaftaran Tahunan per Program (GV, GTa, GTe)</div>
    </div>
    """, unsafe_allow_html=True)
    
    if not yearly_prod_df.empty:
        fig_prod_year = go.Figure()
        unique_prods = yearly_prod_df["product_name"].unique()
        for prod in unique_prods:
            sub = yearly_prod_df[yearly_prod_df["product_name"] == prod]
            p_color = PRODUCT_COLOR_MAP.get(prod, AIESEC_BLUE)
            fig_prod_year.add_trace(go.Bar(
                name=prod,
                x=sub["year"],
                y=sub["total_apps"],
                marker_color=p_color,
                text=sub["total_apps"],
                textposition="auto"
            ))
        apply_plot_theme(
            fig_prod_year,
            barmode="group",
            height=320,
            xaxis_title="Tahun Pendaftaran",
            yaxis_title="Total Aplikasi",
            xaxis=dict(tickmode="linear", dtick=1)
        )
        st.plotly_chart(fig_prod_year, use_container_width=True)
    else:
        st.info("Tidak ada data tren tahunan per program.")

col_bot1, col_bot2 = st.columns([1.5, 1])

with col_bot1:
    # No. 9: Matrix Heatmap Seasonality (Bulan vs Tahun)
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 9: Pola Musiman Pendaftaran (Seasonality Heatmap)</div>
    </div>
    """, unsafe_allow_html=True)
    
    if not heatmap_df.empty:
        month_order = [
            (1, "Januari"), (2, "Februari"), (3, "Maret"), (4, "April"),
            (5, "Mei"), (6, "Juni"), (7, "Juli"), (8, "Agustus"),
            (9, "September"), (10, "Oktober"), (11, "November"), (12, "Desember")
        ]
        month_dict = dict(month_order)
        heatmap_df["month_label"] = heatmap_df["month"].map(month_dict)
        
        pivot_heat = heatmap_df.pivot(index="month_label", columns="year", values="total_apps").fillna(0)
        # Susun urutan bulan Januari -> Desember
        ordered_labels = [label for _, label in month_order if label in pivot_heat.index]
        pivot_heat = pivot_heat.reindex(ordered_labels)
        
        fig_heat = px.imshow(
            pivot_heat,
            labels=dict(x="Tahun", y="Bulan", color="Total Aplikasi"),
            x=[str(c) for c in pivot_heat.columns],
            y=pivot_heat.index,
            color_continuous_scale=[[0, "#F0F6FF"], [0.5, "#60A5FA"], [1, "#0A2540"]],
            aspect="auto",
            text_auto=True
        )
        apply_plot_theme(
            fig_heat,
            height=340
        )
        st.plotly_chart(fig_heat, use_container_width=True)
    else:
        st.info("Tidak ada data seasonality.")

with col_bot2:
    # No. 10: 100% Stacked Bar Chart Durasi Program
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 10: Preferensi Durasi Program (Durasi Magang/Volunteering)</div>
    </div>
    """, unsafe_allow_html=True)
    
    if not duration_df.empty:
        fig_dur = px.bar(
            duration_df,
            x="product_name",
            y="total_apps",
            color="duration_type",
            barmode="relative",
            color_discrete_sequence=[AIESEC_BLUE, DARK_TEAL, TEACHER_ORANGE],
            labels={"product_name": "Program", "total_apps": "Total Aplikasi", "duration_type": "Tipe Durasi"}
        )
        apply_plot_theme(
            fig_dur,
            height=340
        )
        st.plotly_chart(fig_dur, use_container_width=True)
    else:
        st.info("Tidak ada data preferensi durasi.")
