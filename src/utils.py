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
    berdasarkan alasan penolakan teratas (Top Rejection Reason) dari data PostgreSQL.
    Sesuai PRD.md Bab 5.7 & DESIGN.md.
    """
    recommendations = {
        "Partner is unresponsive": {
            "root_cause": "Entitas mitra (Host LC atau Opportunity Provider luar negeri) tidak memberikan respons / lambat meninjau lamaran peserta.",
            "action": "Terapkan Service Level Agreement (SLA) tindak lanjut maksimal 3 hari kerja bersama Host LC mitra, serta prioritaskan aliansi kemitraan dengan Host LC yang memiliki riwayat respons cepat (fast-response entities)."
        },
        "Required citizenship not matching": {
            "root_cause": "Ketidakcocokan paspor/kewarganegaraan peserta dengan regulasi izin kerja, visa magang, atau syarat khusus opportunity di negara tujuan.",
            "action": "Pasang filter validasi kewarganegaraan dan Country Visa Requirement Matrix pada tahap konsultasi awal sebelum EP menekan tombol apply di portal EXPA."
        },
        "Position is filled": {
            "root_cause": "Kuota posisi magang/proyek relawan pada Host LC terkait telah terpenuhi oleh kandidat dari negara lain lebih awal.",
            "action": "Dorong EP untuk mengajukan aplikasi di awal gelombang rekrutmen (Early Bird Application) dan tawarkan rekomendasi opportunity alternatif yang masih terbuka segera dalam 24 jam."
        },
        "The background is not suitable": {
            "root_cause": "Latar belakang akademik atau jurusan kuliah peserta tidak relevan dengan kebutuhan proyek/perusahaan mitra.",
            "action": "Wajibkan sesi Profile Matching & CV Consultation bersama Vice President/Team Leader OGX untuk mengarahkan EP ke proyek yang linear dengan bidang studinya."
        },
        "Skills are not suitable": {
            "root_cause": "Keterampilan teknis (hard skills) atau sertifikasi pelamar belum mencukupi standar minimum penerimaan perusahaan mitra.",
            "action": "Sediakan panduan Portfolio & Interview Preparation Clinic, serta verifikasi kelayakan skill kandidat secara internal sebelum pengajuan lamaran resmi."
        },
        "Incomplete/low quality of CV/profile": {
            "root_cause": "Profil portal EXPA peserta belum terisi lengkap atau kualitas berkas Curriculum Vitae kurang profesional.",
            "action": "Standarisasi template CV bertaraf internasional (Europass / AIESEC Standard ATS-friendly CV) dan lakukan CV screening 1-on-1 sebelum tahap submit."
        },
        "Poor language proficiency": {
            "root_cause": "Skor kemahiran bahasa asing (terutama Bahasa Inggris aktif) belum memenuhi ekspektasi wawancara host provider.",
            "action": "Adakan simulasi wawancara bahasa Inggris (Mock Interview Session) dan tawarkan pembekalan English for Professional Exchange kepada calon kandidat."
        },
        "EP is unresponsive": {
            "root_cause": "Calon peserta asal (Exchange Participant) tidak membalas pesan, mangkir dari jadwal wawancara, atau hilang kontak.",
            "action": "Aktifkan saluran komunikasi multi-channel (WhatsApp automated reminder, panggilan telepon, dan email darurat) serta tetapkan batas waktu konfirmasi keikutsertaan maksimal 48 jam."
        },
        "Problem with the timeline or realization date": {
            "root_cause": "Jadwal realisasi proyek bertabrakan dengan kalender akademik perkuliahan, ujian semester, atau KKN kampus asal.",
            "action": "Sinkronkan kalender pembukaan pendaftaran OGX dengan kalender libur semester Universitas Andalas (UNAND) agar tanggal realisasi tidak berbenturan."
        },
        "Lack of professional experience": {
            "root_cause": "Perusahaan mitra Global Talent (GTa) membutuhkan kandidat dengan pengalaman kerja nyata/magang sebelumnya.",
            "action": "Arahkan mahasiswa tingkat awal ke program Global Volunteer (GV) atau Global Teacher (GTe) terlebih dahulu untuk membangun portofolio sebelum mendaftar ke GTa."
        },
        "Project is canceled": {
            "root_cause": "Proyek dibatalkan sepihak oleh Opportunity Provider di negara tuan rumah akibat perubahan internal organisasi.",
            "action": "Lakukan re-allocation instan bagi peserta terdampak ke proyek serupa di negara lain yang status operasionalnya terverifikasi stabil."
        }
    }
    
    # Fallback default
    return recommendations.get(
        reason_text,
        {
            "root_cause": "Faktor kendala kesiapan pelamar atau penyesuaian kuota pada entitas penyelenggara program.",
            "action": "Lakukan evaluasi berkala dan pendampingan personal kepada calon peserta untuk memitigasi hambatan administratif lebih dini."
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
