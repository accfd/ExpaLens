"""
Fungsi Utilitas & Helper ExpaLens
"""

import os
import streamlit as st

def load_css(file_name: str = "styles.css"):
    """
    Memuat dan menginjeksikan custom CSS ke antarmuka Streamlit.
    """
    css_path = os.path.join(os.path.dirname(__file__), file_name)
    if os.path.exists(css_path):
        with open(css_path, "r", encoding="utf-8") as f:
            st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

def format_number(val: float | int) -> str:
    """Format angka integer dengan pemisah ribuan standar (cth: 75,520)"""
    if val is None or val != val:  # Check None or NaN
        return "0"
    return f"{int(val):,}"

def format_percent(val: float) -> str:
    """Format persentase dengan 1 desimal (cth: 64.2%)"""
    if val is None or val != val:
        return "0.0%"
    return f"{val:.1f}%"

def format_days(val: float) -> str:
    """Format durasi hari (cth: 14.5 Hari)"""
    if val is None or val != val:
        return "- Hari"
    return f"{val:.1f} Hari"

def calculate_yoy(current_val: float, prev_val: float) -> tuple[float, str]:
    """
    Menghitung persentase pertumbuhan Year-over-Year (YoY)
    Mengembalikan (nilai_delta_persen, label_tampilan)
    """
    if prev_val == 0 or prev_val is None:
        return 0.0, "0.0%"
    delta = ((current_val - prev_val) / prev_val) * 100
    sign = "+" if delta > 0 else ""
    return delta, f"{sign}{delta:.1f}%"

def get_recommendation_action(reason_text: str) -> dict:
    """
    Recommended Action Engine: Mengembalikan analisis akar masalah dan saran taktis
    berdasarkan alasan penolakan teratas (Top Rejection Reason).
    Sesuai PRD.md Bab 5.7 & DESIGN.md.
    """
    recommendations = {
        "Did not show up for interview / unresponsive": {
            "root_cause": "Calon peserta tidak hadir wawancara atau hilang kontak (ghosting).",
            "action": "Implementasikan sistem pengingat otomatis (WhatsApp/Email automated reminder) H-1 dan H-2 jam sebelum jadwal wawancara, serta terapkan konfirmasi ulang kehadiran H-6 jam."
        },
        "Does not match opportunity requirements / skills": {
            "root_cause": "Kualifikasi jurusan atau keahlian teknis peserta tidak cocok dengan spesifikasi proyek.",
            "action": "Wajibkan sesi Profile Consultation & CV Review bersama Manajer Program sebelum pendaftaran diajukan resmi ke CRM Expa."
        },
        "Visa / Passport issues": {
            "root_cause": "Terkendala masa berlaku paspor kedaluwarsa atau penolakan visa kedutaan.",
            "action": "Tetapkan syarat administratif wajib paspor aktif minimal 6 bulan sejak awal pendaftaran dan sediakan Country Visa Kit sedini mungkin."
        },
        "Financial / Budget constraints": {
            "root_cause": "Peserta mundur akibat kendala biaya tiket penerbangan atau biaya hidup di luar negeri.",
            "action": "Sediakan transparansi simulasi estimasi biaya hidup (cost of living breakdown) sejak awal dan jalin kerja sama beasiswa/sponsor lokal."
        },
        "Selected another opportunity": {
            "root_cause": "Peserta lebih memilih program alternatif atau tawaran magang lain di dalam negeri.",
            "action": "Percepat durasi peninjauan seleksi (fast-track application review) agar peserta memperoleh kepastian status sebelum menerima tawaran lain."
        }
    }
    
    # Default fallback bila alasan tidak tercantum spesifik
    return recommendations.get(
        reason_text,
        {
            "root_cause": "Faktor kendala kesiapan peserta atau penyesuaian kuota mitra.",
            "action": "Lakukan evaluasi berkala dan follow-up personal kepada calon peserta untuk mengidentifikasi hambatan administratif lebih dini."
        }
    )

def render_global_sidebar():
    """
    Merender kontrol penyaringan global pada bilah samping (Sidebar)
    Sesuai Kebutuhan No. 5 Tabel 3 Milestone 2 & PRD.md.
    """
    st.sidebar.markdown("### 🔍 Filter Global Data")
    
    # 1. Filter Tahun
    selected_years = st.sidebar.multiselect(
        "Pilih Tahun Pendaftaran",
        options=[2021, 2022, 2023, 2024, 2025],
        default=[2021, 2022, 2023, 2024, 2025],
        help="Menyaring data aplikasi berdasarkan tahun pengajuan (Applied Date)."
    )
    
    # 2. Filter Program
    selected_products = st.sidebar.multiselect(
        "Pilih Program Pertukaran",
        options=["GV (New)", "GTa", "GTe"],
        default=["GV (New)", "GTa", "GTe"],
        help="Menyaring data berdasarkan lini produk AIESEC."
    )
    
    # 3. Filter Status
    selected_statuses = st.sidebar.multiselect(
        "Pilih Status Aplikasi",
        options=["accepted", "approved", "finished", "rejected"],
        default=["accepted", "approved", "finished", "rejected"],
        help="Menyaring data berdasarkan status akhir seleksi."
    )
    
    st.sidebar.markdown("---")
    st.sidebar.caption("🌐 **ExpaLens v1.0** — AIESEC in UNAND OGX")
    
    return {
        "years": selected_years,
        "products": selected_products,
        "statuses": selected_statuses
    }
