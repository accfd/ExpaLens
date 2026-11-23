"""
Halaman 3: Tahapan Seleksi dan Kelulusan (Conversion Funnel)
Sesuai: PRD.md Bab 5.5, Tabel 3 Milestone 2, dan DESIGN.md
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
from utils import load_css, render_global_sidebar, format_days, format_number, format_percent
from db_connection import (
    get_funnel_durations, get_durations_by_product, get_country_speed_vs_volume, get_overview_data
)

load_css()
sidebar_filters = render_global_sidebar()

years = sidebar_filters["years"]
products = sidebar_filters["products"]
statuses = sidebar_filters["statuses"]

# Memuat data riil durasi tahapan dari PostgreSQL
durations = get_funnel_durations(years=years, products=products, statuses=statuses)
dur_prod_df = get_durations_by_product(years=years, products=products, statuses=statuses)
speed_df = get_country_speed_vs_volume(years=years, products=products, statuses=statuses)
ov_data = get_overview_data(years=years, products=products, statuses=statuses)

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
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-card-label">Avg Days to Accept</div>
        <div class="metric-card-num" style="color: #037EF3;">{format_days(durations.get('avg_days_to_accept'))}</div>
        <div style="font-size: 11px; color: #64748B;">Applied → Accepted</div>
    </div>
    """, unsafe_allow_html=True)

with m2:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-card-label">Avg Days to Approve</div>
        <div class="metric-card-num" style="color: #0A8EA0;">{format_days(durations.get('avg_days_to_approve'))}</div>
        <div style="font-size: 11px; color: #64748B;">Accepted → Approved</div>
    </div>
    """, unsafe_allow_html=True)

with m3:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-card-label">Avg Days to Realize</div>
        <div class="metric-card-num" style="color: #F59E0B;">{format_days(durations.get('avg_days_to_realize'))}</div>
        <div style="font-size: 11px; color: #64748B;">Approved → Realized</div>
    </div>
    """, unsafe_allow_html=True)

with m4:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-card-label">Avg Days to Finish</div>
        <div class="metric-card-num" style="color: #10B981;">{format_days(durations.get('avg_days_to_finish'))}</div>
        <div style="font-size: 11px; color: #64748B;">Realized → Finished</div>
    </div>
    """, unsafe_allow_html=True)

col_mid1, col_mid2 = st.columns(2)

with col_mid1:
    # No. 11: Funnel Chart Rasio Konversi
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 11: Persentase Konversi Antartahapan (Step Conversion Rate)</div>
    </div>
    """, unsafe_allow_html=True)
    
    stages = ["Applied", "Accepted", "Approved", "Realized", "Finished"]
    vals = [
        ov_data.get("total_applications", 0),
        ov_data.get("total_accepted", 0),
        ov_data.get("total_approved", 0),
        ov_data.get("total_realized", 0),
        ov_data.get("total_finished", 0)
    ]
    
    fig_conv = go.Figure(go.Funnel(
        y=stages, x=vals,
        textinfo="value+percent previous",
        marker=dict(color=[AIESEC_BLUE, "#0A8EA0", "#30C39E", "#F48924", "#10B981"]),
        connector=dict(line=dict(color="#CACCD1", width=1))
    ))
    apply_plot_theme(
        fig_conv,
        height=340,
        margin=dict(t=20, b=20, l=100, r=20)
    )
    st.plotly_chart(fig_conv, use_container_width=True)

with col_mid2:
    # No. 12: Clustered Bar Chart Durasi per Program
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 12: Rata-Rata Waktu Proses per Program (Hari)</div>
    </div>
    """, unsafe_allow_html=True)
    
    if not dur_prod_df.empty:
        fig_time = go.Figure()
        metric_cols = [
            ("days_to_accept", "Applied → Accepted"),
            ("days_to_approve", "Accepted → Approved"),
            ("days_to_realize", "Approved → Realized"),
            ("days_to_finish", "Realized → Finished")
        ]
        
        for col_name, col_label in metric_cols:
            fig_time.add_trace(go.Bar(
                name=col_label,
                x=dur_prod_df["product_name"],
                y=dur_prod_df[col_name].round(1),
                text=dur_prod_df[col_name].round(1),
                textposition="auto"
            ))
            
        apply_plot_theme(
            fig_time,
            barmode="group",
            height=340,
            xaxis_title="Program Pertukaran",
            yaxis_title="Rata-rata Durasi (Hari)"
        )
        st.plotly_chart(fig_time, use_container_width=True)
    else:
        st.info("Tidak ada data durasi per program.")

# No. 13: Country Speed vs Volume Scatter Plot
st.markdown("""
<div class="chart-container">
    <div class="chart-title">No. 13: Efisiensi Waktu Penerimaan vs Volume Aplikasi per Negara Tujuan</div>
</div>
""", unsafe_allow_html=True)

if not speed_df.empty:
    fig_scatter = px.scatter(
        speed_df,
        x="avg_days_accept",
        y="total_apps",
        text="host_mc",
        size="total_apps",
        color="avg_days_accept",
        color_continuous_scale=[[0, "#10B981"], [0.5, "#F59E0B"], [1, "#EF4444"]],
        labels={
            "avg_days_accept": "Rata-rata Waktu Diterima (Hari)",
            "total_apps": "Total Aplikasi",
            "host_mc": "Negara Tujuan"
        }
    )
    fig_scatter.update_traces(textposition="top center", marker=dict(opacity=0.85, line=dict(width=1, color="#0A2540")))
    apply_plot_theme(
        fig_scatter,
        height=380,
        xaxis_title="Kecepatan Respon / Seleksi Host (Hari)",
        yaxis_title="Volume Aplikasi Terdaftar"
    )
    st.plotly_chart(fig_scatter, use_container_width=True)
else:
    st.info("Tidak ada data kecepatan vs volume negara.")
