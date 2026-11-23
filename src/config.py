"""
Konfigurasi Desain & Tema ExpaLens
Mengacu pada:
- PRD.md
- DESIGN.md (AIESEC Brand Guidelines [Blue Book])
"""

import plotly.graph_objects as go

# ==============================================================================
# 1. PALET WARNA RESMI AIESEC (AIESEC Blue Book Halaman 14)
# ==============================================================================
AIESEC_BLUE = "#037EF3"      # Biru Utama AIESEC (Primary Brand Accent)
DARK_TEAL = "#0A8EA0"        # Resmi: Global Talent & Perusahaan (Blue Book hal. 14)
CORAL_RED = "#F85A40"        # Resmi: Global Volunteer & NGO (Blue Book hal. 14)
TEACHER_ORANGE = "#F48924"   # Resmi: Global Teacher & Edukasi (Blue Book hal. 14)
AIESEC_TEAL = "#30C39E"      # AIESEC Teal (Inovasi & Entrepreneurship)
AIESEC_YELLOW = "#FFC845"    # Aksen Kuning (Highlight & Warning)

# WARNA NETRAL RESMI BLUE BOOK & EXECUTIVE DASHBOARD
CANVAS_BG = "#F3F4F7"        # Latar Utama Kanvas Aplikasi (Light Gray)
BORDER_GRAY = "#CACCD1"      # Garis Batas / Mid Gray (Blue Book hal. 14)
TEXT_MUTED = "#52565E"       # Teks Sekunder / Dark Gray (Blue Book hal. 14)
MIDNIGHT_NAVY = "#0A2540"    # Navy Gelap untuk Hero Card & Tooltip
HEADING_BLACK = "#0F172A"    # Teks Judul Utama (Slate-900)
ICE_BLUE_BG = "#F0F6FF"      # Latar Kartu Rekomendasi / Tint Lembut

# WARNA STATUS SEMANTIK
STATUS_SUCCESS = "#10B981"   # Finished / Lulus / Pertumbuhan YoY Positif
STATUS_WARNING = "#F59E0B"   # Accepted / Perhatian
STATUS_CRITICAL = "#EF4444"  # Rejected / Penurunan YoY

# ==============================================================================
# 2. PEMETAAN WARNA PRODUK PERTUKARAN AIESEC
# ==============================================================================
PRODUCT_COLOR_MAP = {
    "GV (New)": CORAL_RED,      # #F85A40 (Global Volunteer)
    "GTa": DARK_TEAL,           # #0A8EA0 (Global Talent)
    "GTe": TEACHER_ORANGE       # #F48924 (Global Teacher)
}

# ==============================================================================
# 3. KONFIGURASI TEMA GLOBAL PLOTLY (EXPALENS THEME)
# ==============================================================================
EXPALENS_PLOTLY_THEME = {
    "layout": go.Layout(
        font=dict(family="Lato, sans-serif", color=HEADING_BLACK),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        colorway=[AIESEC_BLUE, DARK_TEAL, CORAL_RED, TEACHER_ORANGE, AIESEC_TEAL],
        margin=dict(t=40, r=20, b=40, l=40),
        xaxis=dict(
            showgrid=False,
            linecolor=BORDER_GRAY,
            tickfont=dict(size=12, color=TEXT_MUTED, family="Lato, sans-serif"),
            title_font=dict(size=13, color=HEADING_BLACK, family="Lato, sans-serif")
        ),
        yaxis=dict(
            showgrid=True,
            gridcolor="#EBF0F5",
            linecolor="rgba(0,0,0,0)",
            tickfont=dict(size=12, color=TEXT_MUTED, family="Lato, sans-serif"),
            title_font=dict(size=13, color=HEADING_BLACK, family="Lato, sans-serif")
        ),
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1,
            font=dict(size=12, color=TEXT_MUTED, family="Lato, sans-serif")
        ),
        hoverlabel=dict(
            bgcolor=MIDNIGHT_NAVY,
            font_size=12,
            font_family="Lato, sans-serif",
            font_color="#FFFFFF"
        )
    )
}

def apply_plot_theme(fig, **custom_kwargs):
    """
    Menerapkan tema resmi ExpaLens ke objek Figure Plotly tanpa memicu
    konflik duplikasi keyword argument (misalnya margin atau height).
    """
    theme_dict = EXPALENS_PLOTLY_THEME["layout"].to_plotly_json().copy()
    theme_dict.update(custom_kwargs)
    fig.update_layout(**theme_dict)
    return fig

# ==============================================================================
# 4. KONFIGURASI HALAMAN STREAMLIT
# ==============================================================================
PAGE_CONFIG = {
    "page_title": "ExpaLens - AIESEC in UNAND OGX BI",
    "layout": "wide",
    "initial_sidebar_state": "expanded"
}
