"""
Halaman 4: Peta dan Negara Tujuan (Destinations)
Sesuai: PRD.md Bab 5.6, Tabel 3 Milestone 2, dan DESIGN.md
"""

import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
from config import PAGE_CONFIG, AIESEC_BLUE, MIDNIGHT_NAVY, EXPALENS_PLOTLY_THEME
from utils import load_css, render_global_sidebar

st.set_page_config(**PAGE_CONFIG)
load_css()
sidebar_filters = render_global_sidebar()

st.markdown("""
<div class="header-container">
    <div class="header-title">Halaman 4: Peta dan Negara Tujuan (Destinations)</div>
    <div class="header-subtitle">
        Persebaran geografis mitra internasional dan penelusuran berjenjang performa komite lokal tujuan (Host LC).
    </div>
</div>
""", unsafe_allow_html=True)

# No. 15: Choropleth Map Persebaran Global
st.markdown("""
<div class="chart-container">
    <div class="chart-title">No. 15: Persebaran Pendaftaran Peserta Berdasarkan Negara Tujuan (Choropleth Map)</div>
</div>
""", unsafe_allow_html=True)

# Sample placeholder dataset negara tujuan dengan ISO-3
sample_map_df = pd.DataFrame({
    "iso_alpha": ["MYS", "TUR", "VNM", "TWN", "THA", "EGY", "IND", "POL", "BRA", "JPN"],
    "country": ["Malaysia", "Turkey", "Vietnam", "Taiwan", "Thailand", "Egypt", "India", "Poland", "Brazil", "Japan"],
    "applications": [12400, 9800, 8500, 7200, 6800, 5100, 4900, 3200, 2800, 2100],
    "finished": [2450, 1820, 1640, 1310, 1250, 890, 780, 540, 420, 380]
})

fig_map = px.choropleth(
    sample_map_df,
    locations="iso_alpha",
    color="applications",
    hover_name="country",
    hover_data=["applications", "finished"],
    color_continuous_scale=[[0, "#F0F6FF"], [0.5, "#60A5FA"], [1, AIESEC_BLUE]],
    labels={"applications": "Total Aplikasi"}
)
fig_map.update_geos(showcoastlines=True, coastlinecolor="#CACCD1", projection_type="natural earth")
fig_map.update_layout(
    **EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(),
    height=420,
    margin=dict(t=10, b=10, l=10, r=10)
)
st.plotly_chart(fig_map, use_container_width=True)

col_d1, col_d2 = st.columns([1, 1.4])

with col_d1:
    # No. 16A: Clustered Bar Chart Peringkat Negara Tujuan
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 16: Peringkat Top 10 Negara Tujuan (Host MC)</div>
    </div>
    """, unsafe_allow_html=True)
    
    fig_top_mc = px.bar(
        sample_map_df.sort_values(by="applications", ascending=True),
        x="applications", y="country",
        orientation="h",
        color_discrete_sequence=[AIESEC_BLUE],
        labels={"applications": "Total Aplikasi", "country": "Negara Tujuan"}
    )
    fig_top_mc.update_layout(**EXPALENS_PLOTLY_THEME["layout"].to_plotly_json(), height=360)
    st.plotly_chart(fig_top_mc, use_container_width=True)

with col_d2:
    # No. 16B & 16C: Host LC Drill-down Selector & Matrix Table
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">Drill-Down: Performa Komite Lokal Tujuan (Host LC)</div>
    </div>
    """, unsafe_allow_html=True)
    
    selected_country = st.selectbox(
        "Pilih Negara Tujuan untuk Penelusuran Detail:",
        options=sample_map_df["country"].tolist(),
        index=0
    )
    
    # Placeholder data Host LC untuk negara terpilih
    st.caption(f"Menampilkan rincian kampus & komite lokal di negara **{selected_country}**:")
    sample_lc_df = pd.DataFrame({
        "Host LC Name": [f"{selected_country} Central LC", f"{selected_country} South LC", f"{selected_country} Tech Univ LC"],
        "Total Apps": [4500, 3800, 2100],
        "Accepted": [2900, 2400, 1300],
        "Approved": [1900, 1500, 850],
        "Finished": [850, 680, 390],
        "Finish Rate": ["29.3%", "28.3%", "30.0%"],
        "Avg Days Accept": ["9.8 Hari", "11.2 Hari", "10.4 Hari"]
    })
    
    st.dataframe(sample_lc_df, use_container_width=True, hide_index=True)
