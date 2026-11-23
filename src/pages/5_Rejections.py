"""
Halaman 5: Alasan Penolakan Peserta (Rejections)
Sesuai: PRD.md Bab 5.7, Tabel 3 Milestone 2, dan DESIGN.md
"""

import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
from config import (
    PAGE_CONFIG, AIESEC_BLUE, MIDNIGHT_NAVY, CORAL_RED, DARK_TEAL, TEACHER_ORANGE,
    EXPALENS_PLOTLY_THEME
)
from utils import load_css, render_global_sidebar, get_recommendation_action

st.set_page_config(**PAGE_CONFIG)
load_css()
sidebar_filters = render_global_sidebar()

st.markdown("""
<div class="header-container">
    <div class="header-title">Halaman 5: Alasan Penolakan Peserta (Rejections)</div>
    <div class="header-subtitle">
        Analisis faktor kegagalan aplikasi pendaftaran dan mesin rekomendasi taktis terotomatisasi (Action Engine).
    </div>
</div>
""", unsafe_allow_html=True)

# Placeholder Data Alasan Penolakan
sample_rejection_data = pd.DataFrame({
    "Reason": [
        "Did not show up for interview / unresponsive",
        "Does not match opportunity requirements / skills",
        "Visa / Passport issues",
        "Financial / Budget constraints",
        "Selected another opportunity",
        "Language proficiency requirement",
        "Project dates conflict with university exams",
        "Parental consent not obtained",
        "Health / Personal emergency",
        "Quota full on Host LC"
    ],
    "Count": [5200, 4100, 3400, 2900, 2100, 1800, 1400, 1100, 800, 500]
})

col_r1, col_r2 = st.columns([1.3, 1])

with col_r1:
    # No. 17: Clustered Bar Chart Peringkat Alasan Penolakan
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 17: Peringkat Alasan Penolakan Terbanyak (Top Rejection Reasons)</div>
    </div>
    """, unsafe_allow_html=True)
    
    fig_reason = px.bar(
        sample_rejection_data.sort_values(by="Count", ascending=True),
        x="Count", y="Reason",
        orientation="h",
        color="Count",
        color_continuous_scale=[[0, "#93C5FD"], [1, "#EF4444"]],
        labels={"Count": "Jumlah Kasus Penolakan", "Reason": "Alasan Penolakan"}
    )
    fig_reason.update_layout(**EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(), height=380)
    st.plotly_chart(fig_reason, use_container_width=True)

with col_r2:
    # No. 18A: Sebaran Alasan Penolakan per Program
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 18: Sebaran Alasan Penolakan per Program (GV, GTa, GTe)</div>
    </div>
    """, unsafe_allow_html=True)
    
    top5_reasons = sample_rejection_data["Reason"].head(5).tolist()
    fig_prod_reasons = go.Figure(data=[
        go.Bar(name="GV", x=top5_reasons, y=[2800, 1200, 1900, 1600, 900], marker_color=CORAL_RED),
        go.Bar(name="GTa", x=top5_reasons, y=[1500, 2100, 900, 800, 800], marker_color=DARK_TEAL),
        go.Bar(name="GTe", x=top5_reasons, y=[900, 800, 600, 500, 400], marker_color=TEACHER_ORANGE)
    ])
    fig_prod_reasons.update_layout(
        **EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(),
        barmode="group",
        height=380,
        xaxis=dict(tickangle=-25)
    )
    st.plotly_chart(fig_prod_reasons, use_container_width=True)

# No. 19: Dynamic Recommendation Engine Box (Sesuai PRD.md & DESIGN.md)
st.markdown("### 💡 No. 19: Rekomendasi Tindakan Taktis Operasional (Recommended Action)")

# Mendapatkan alasan penolakan teratas dari data
top_reason_detected = sample_rejection_data.iloc[0]["Reason"]
recommendation = get_recommendation_action(top_reason_detected)

st.markdown(f"""
<div class="action-box">
    <div style="font-size: 12px; font-weight: 700; color: #037EF3; text-transform: uppercase; letter-spacing: 0.05em;">
        🚨 MASALAH UTAMA TERDETEKSI (PERINGKAT 1)
    </div>
    <div class="action-box-title" style="margin-top: 4px; font-size: 17px;">
        {top_reason_detected} ({sample_rejection_data.iloc[0]['Count']:,} Kasus)
    </div>
    <div style="margin: 8px 0; font-size: 13px; color: #475569;">
        <strong>Identifikasi Akar Masalah:</strong> {recommendation['root_cause']}
    </div>
    <div class="action-box-desc" style="background-color: #FFFFFF; padding: 12px; border-radius: 8px; border: 1px solid #D4E5FB; margin-top: 8px;">
        🎯 <strong>Rekomendasi Tindakan Tim Customer Experience & Quality:</strong><br>
        {recommendation['action']}
    </div>
</div>
""", unsafe_allow_html=True)
