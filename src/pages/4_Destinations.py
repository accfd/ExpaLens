"""
Halaman 4: Peta dan Negara Tujuan (Destinations)
Sesuai: PRD.md Bab 5.6, Tabel 3 Milestone 2, dan DESIGN.md
Terhubung langsung secara reaktif ke database PostgreSQL aiesec_dw.
"""

import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
from config import PAGE_CONFIG, AIESEC_BLUE, MIDNIGHT_NAVY, EXPALENS_PLOTLY_THEME, apply_plot_theme
from utils import load_css, render_global_sidebar, format_number
from db_connection import get_destinations_map_data, get_host_lc_drilldown

load_css()
sidebar_filters = render_global_sidebar()

years = sidebar_filters["years"]
products = sidebar_filters["products"]
statuses = sidebar_filters["statuses"]

# Memuat data agregat destinasi dari PostgreSQL
map_df = get_destinations_map_data(years=years, products=products, statuses=statuses)

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

if not map_df.empty:
    fig_map = px.choropleth(
        map_df,
        locations="host_mc",
        locationmode="country names",
        color="total_apps",
        hover_name="host_mc",
        hover_data={
            "host_mc": False,
            "host_region": True,
            "total_apps": ":,",
            "accepted": ":,",
            "finished": ":,"
        },
        color_continuous_scale=[[0, "#F0F6FF"], [0.2, "#93C5FD"], [0.6, "#3B82F6"], [1, "#0A2540"]],
        labels={
            "total_apps": "Total Aplikasi",
            "host_region": "Wilayah (Region)",
            "accepted": "Diterima",
            "finished": "Lulus"
        }
    )
    fig_map.update_geos(
        showcoastlines=True,
        coastlinecolor="#CACCD1",
        projection_type="natural earth",
        showcountries=True,
        countrycolor="#E2E8F0"
    )
    apply_plot_theme(
        fig_map,
        height=420,
        margin=dict(t=10, b=10, l=10, r=10)
    )
    st.plotly_chart(fig_map, use_container_width=True)
else:
    st.info("Tidak ada data destinasi negara untuk filter saat ini.")

col_d1, col_d2 = st.columns([1, 1.4])

with col_d1:
    # No. 16A: Clustered Bar Chart Peringkat Negara Tujuan
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">No. 16: Peringkat Top 10 Negara Tujuan (Host MC)</div>
    </div>
    """, unsafe_allow_html=True)
    
    if not map_df.empty:
        top10_mc = map_df.head(10).sort_values(by="total_apps", ascending=True)
        fig_top_mc = px.bar(
            top10_mc,
            x="total_apps", y="host_mc",
            orientation="h",
            color="total_apps",
            color_continuous_scale=[[0, "#93C5FD"], [1, AIESEC_BLUE]],
            text="total_apps",
            labels={"total_apps": "Total Aplikasi", "host_mc": "Negara Tujuan"}
        )
        fig_top_mc.update_traces(texttemplate="%{x:,}", textposition="outside")
        apply_plot_theme(
            fig_top_mc,
            height=400,
            showlegend=False
        )
        st.plotly_chart(fig_top_mc, use_container_width=True)
    else:
        st.info("Tidak ada data peringkat negara.")

with col_d2:
    # No. 16B & 16C: Host LC Drill-down Selector & Matrix Table
    st.markdown("""
    <div class="chart-container">
        <div class="chart-title">Drill-Down: Performa Komite Lokal Tujuan (Host LC)</div>
    </div>
    """, unsafe_allow_html=True)
    
    if not map_df.empty:
        country_options = map_df["host_mc"].dropna().unique().tolist()
        selected_country = st.selectbox(
            "Pilih Negara Tujuan untuk Penelusuran Detail:",
            options=country_options,
            index=0
        )
        
        # Tarik data riil Host LC untuk negara terpilih
        lc_df = get_host_lc_drilldown(
            country_name=selected_country,
            years=years,
            products=products,
            statuses=statuses
        )
        
        st.caption(f"Menampilkan rincian performa kampus & komite lokal di negara **{selected_country}**:")
        if not lc_df.empty:
            st.dataframe(
                lc_df,
                use_container_width=True,
                height=340,
                column_config={
                    "Total Apps": st.column_config.NumberColumn(format="%d"),
                    "Accepted": st.column_config.NumberColumn(format="%d"),
                    "Approved": st.column_config.NumberColumn(format="%d"),
                    "Finished": st.column_config.NumberColumn(format="%d"),
                    "Finish Rate %": st.column_config.NumberColumn(format="%.1f%%"),
                    "Avg Days to Accept": st.column_config.NumberColumn(format="%.1f hari")
                }
            )
        else:
            st.info(f"Belum ada data Host LC tercatat untuk negara {selected_country}.")
    else:
        st.info("Pilih filter untuk memuat penelusuran Host LC.")
