"""
Halaman 5: Alasan Penolakan Peserta (Rejections)
Sesuai: PRD.md Bab 5.7, Tabel 3 Milestone 2, dan DESIGN.md
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
from utils import load_css, render_global_sidebar, get_recommendation_action
from db_connection import get_rejections_ranking, get_rejections_by_product

load_css()
sidebar_filters = render_global_sidebar()

years = sidebar_filters["years"]
products = sidebar_filters["products"]
statuses = sidebar_filters["statuses"]

# Memuat data riil alasan penolakan dari PostgreSQL
rejection_df = get_rejections_ranking(years=years, products=products, statuses=statuses)
rejection_prod_df = get_rejections_by_product(years=years, products=products, statuses=statuses)

st.markdown("""
<div class="header-container">
    <div class="header-title">Halaman 5: Alasan Penolakan Peserta (Rejections)</div>
    <div class="header-subtitle">
        Analisis faktor kegagalan aplikasi pendaftaran dan mesin rekomendasi taktis terotomatisasi (Action Engine).
    </div>
</div>
""", unsafe_allow_html=True)

col_r1, col_r2 = st.columns([1.3, 1])

with col_r1:
    # No. 17: Clustered Bar Chart Peringkat Alasan Penolakan
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 17: Peringkat Alasan Penolakan Terbanyak (Top Rejection Reasons)</div>
    </div>
    """, unsafe_allow_html=True)
    
    if not rejection_df.empty:
        fig_reason = px.bar(
            rejection_df.sort_values(by="Count", ascending=True),
            x="Count", y="Reason",
            orientation="h",
            color="Count",
            color_continuous_scale=[[0, "#93C5FD"], [0.6, "#F59E0B"], [1, "#EF4444"]],
            text="Count",
            labels={"Count": "Jumlah Kasus Penolakan", "Reason": "Alasan Penolakan"}
        )
        fig_reason.update_traces(texttemplate="%{x:,}", textposition="outside")
        apply_plot_theme(
            fig_reason,
            height=420,
            showlegend=False,
            yaxis=dict(tickfont=dict(size=11))
        )
        st.plotly_chart(fig_reason, use_container_width=True)
    else:
        st.info("Tidak ada data penolakan untuk filter saat ini.")

with col_r2:
    # No. 18: Sebaran Alasan Penolakan per Program
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 18: Sebaran Alasan Penolakan per Program (GV, GTa, GTe)</div>
    </div>
    """, unsafe_allow_html=True)
    
    if not rejection_prod_df.empty and not rejection_df.empty:
        # Ambil top 5 alasan terbanyak secara umum
        top5_reasons = rejection_df["Reason"].head(5).tolist()
        filtered_sub = rejection_prod_df[rejection_prod_df["Reason"].isin(top5_reasons)]
        
        fig_prod_reasons = go.Figure()
        for prod in ["GV (New)", "GTa", "GTe"]:
            sub = filtered_sub[filtered_sub["product_name"] == prod]
            # Sesuaikan urutan sesuai top 5
            counts_map = dict(zip(sub["Reason"], sub["Count"]))
            y_vals = [counts_map.get(r, 0) for r in top5_reasons]
            p_color = PRODUCT_COLOR_MAP.get(prod, AIESEC_BLUE)
            
            fig_prod_reasons.add_trace(go.Bar(
                name=prod,
                x=top5_reasons,
                y=y_vals,
                marker_color=p_color,
                text=y_vals,
                textposition="auto"
            ))
            
        apply_plot_theme(
            fig_prod_reasons,
            barmode="group",
            height=420,
            xaxis=dict(tickangle=-25, tickfont=dict(size=10)),
            yaxis_title="Jumlah Kasus",
            xaxis_title="Top 5 Alasan"
        )
        st.plotly_chart(fig_prod_reasons, use_container_width=True)
    else:
        st.info("Tidak ada data sebaran alasan per program.")

# No. 19: Dynamic Recommendation Engine Box (Sesuai PRD.md & DESIGN.md)
st.markdown("### No. 19: Rekomendasi Tindakan Taktis Operasional (Recommended Action)")

if not rejection_df.empty:
    top_reason_detected = rejection_df.iloc[0]["Reason"]
    top_reason_count = rejection_df.iloc[0]["Count"]
    recommendation = get_recommendation_action(top_reason_detected)

    st.markdown(f"""
    <div class="action-box">
        <div style="font-size: 12px; font-weight: 700; color: #037EF3; text-transform: uppercase; letter-spacing: 0.05em;">
            MASALAH UTAMA TERDETEKSI (PERINGKAT 1)
        </div>
        <div style="font-size: 20px; font-weight: 700; color: #0A2540; margin: 4px 0 8px 0;">
            {top_reason_detected} ({top_reason_count:,} Kasus Terjadi)
        </div>
        <div style="font-size: 14px; color: #52565E; margin-bottom: 12px; line-height: 1.5;">
            <strong>Analisis Akar Masalah (Root Cause):</strong><br>
            {recommendation['root_cause']}
        </div>
        <div style="padding: 12px 16px; background-color: #FFFFFF; border-left: 4px solid #037EF3; border-radius: 4px;">
            <strong style="color: #037EF3;">Saran Tindakan Taktis Tim OGX:</strong><br>
            <span style="font-size: 14px; color: #0F172A; line-height: 1.5;">{recommendation['action']}</span>
        </div>
    </div>
    """, unsafe_allow_html=True)
else:
    st.info("Belum ada data penolakan yang terdeteksi.")
