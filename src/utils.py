"""
Fungsi Utilitas & Helper ExpaLens
Departemen Outgoing Exchange AIESEC in Universitas Andalas
"""

import os
import streamlit as st
from db_connection import get_filter_options

def load_css(file_name: str = "styles.css"):
    """
    Memuat dan menginjeksikan kustomisasi CSS ke antarmuka Streamlit.
    """
    css_path = os.path.join(os.path.dirname(__file__), file_name)
    if os.path.exists(css_path):
        with open(css_path, "r", encoding="utf-8") as f:
            st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

def format_number(val: float | int) -> str:
    """Format angka integer dengan pemisah ribuan standar (contoh: 75.520)"""
    if val is None or val != val:
        return "0"
    return f"{int(val):,}".replace(",", ".")

def format_percent(val: float) -> str:
    """Format persentase dengan 1 desimal (contoh: 41,3%)"""
    if val is None or val != val:
        return "0,0%"
    return f"{val:.1f}%".replace(".", ",")

def format_days(val: float) -> str:
    """Format durasi hari (contoh: 70,8 Hari)"""
    if val is None or val != val:
        return "- Hari"
    formatted = f"{val:.1f}".replace(".", ",")
    return f"{formatted} Hari"

def calculate_yoy(current_val: float, prev_val: float) -> tuple[float, str]:
    """
    Menghitung persentase pertumbuhan Year-over-Year (YoY).
    Mengembalikan pasangan nilai numerik dan label format tampilan.
    """
    if prev_val == 0 or prev_val is None:
        return 0.0, "0,0%"
    delta = ((current_val - prev_val) / prev_val) * 100
    sign = "+" if delta > 0 else ""
    formatted = f"{delta:.1f}".replace(".", ",")
    return delta, f"{sign}{formatted}%"

def get_recommendation_action(reason_text: str) -> dict:
    """
    Mesin Rekomendasi Tindakan: Mengembalikan analisis akar masalah dan saran taktis
    berdasarkan alasan penolakan teratas dari data PostgreSQL.
    """
    recommendations = {
        "Partner is unresponsive": {
            "root_cause": "Entitas mitra (Host LC atau Opportunity Provider luar negeri) tidak memberikan respons atau lambat meninjau lamaran peserta.",
            "action": "Terapkan Service Level Agreement (SLA) tindak lanjut maksimal 3 hari kerja bersama Host LC mitra, serta prioritaskan aliansi kemitraan dengan Host LC yang memiliki riwayat respons cepat (fast-response entities)."
        },
        "Required citizenship not matching": {
            "root_cause": "Ketidakcocokan paspor atau kewarganegaraan peserta dengan regulasi izin kerja, visa magang, atau ketentuan khusus di negara tujuan.",
            "action": "Pasang filter validasi kewarganegaraan dan matriks persyaratan visa negara pada tahap konsultasi awal sebelum peserta mengajukan aplikasi di portal EXPA."
        },
        "Position is filled": {
            "root_cause": "Kuota posisi magang atau proyek relawan pada entitas terkait telah terpenuhi oleh kandidat dari negara lain lebih awal.",
            "action": "Dorong peserta untuk mengajukan aplikasi di awal periode rekrutmen (Early Bird Application) dan berikan alternatif opportunity serupa yang masih terbuka dalam kurun waktu 24 jam."
        },
        "The background is not suitable": {
            "root_cause": "Latar belakang akademik atau jurusan kuliah peserta tidak relevan dengan kebutuhan proyek atau perusahaan mitra.",
            "action": "Wajibkan sesi konsultasi profil dan tinjauan kurikulum vitae bersama manajer program untuk mengarahkan peserta ke proyek yang linear dengan bidang studinya."
        },
        "Skills are not suitable": {
            "root_cause": "Keterampilan teknis (hard skills) atau sertifikasi pelamar belum mencukupi standar minimum penerimaan perusahaan mitra.",
            "action": "Sediakan panduan klinik portofolio dan wawancara, serta verifikasi kelayakan keahlian kandidat secara internal sebelum pengajuan lamaran resmi."
        },
        "Incomplete/low quality of CV/profile": {
            "root_cause": "Profil portal EXPA peserta belum terisi lengkap atau kualitas berkas CV kurang memenuhi standar profesional internasional.",
            "action": "Standarisasi template CV bertaraf internasional dan lakukan kurasi berkas one-on-one sebelum tahap pengiriman lamaran."
        },
        "Poor language proficiency": {
            "root_cause": "Tingkat kemahiran bahasa asing (terutama Bahasa Inggris aktif) belum memenuhi ekspektasi wawancara host provider.",
            "action": "Adakan simulasi wawancara bahasa asing dan tawarkan pembekalan komunikasi profesional kepada calon kandidat."
        },
        "EP is unresponsive": {
            "root_cause": "Calon peserta asal tidak membalas konfirmasi, tidak hadir pada jadwal wawancara, atau kehilangan kontak.",
            "action": "Aktifkan saluran komunikasi berkala melalui pesan pengingat resmi dan tetapkan batas waktu konfirmasi keikutsertaan maksimal 48 jam."
        },
        "Problem with the timeline or realization date": {
            "root_cause": "Jadwal realisasi proyek bertentangan dengan kalender akademik perkuliahan, ujian semester, atau agenda wajib kampus asal.",
            "action": "Sinkronkan kalender pembukaan pendaftaran OGX dengan kalender libur semester Universitas Andalas agar jadwal keberangkatan tidak berbenturan."
        },
        "Lack of professional experience": {
            "root_cause": "Perusahaan mitra Global Talent membutuhkan kandidat dengan rekam jejak pengalaman kerja nyata sebelumnya.",
            "action": "Arahkan mahasiswa tingkat awal ke program Global Volunteer atau Global Teacher terlebih dahulu guna membangun portofolio kepemimpinan."
        },
        "Project is canceled": {
            "root_cause": "Proyek dibatalkan secara sepihak oleh Opportunity Provider di negara tuan rumah akibat perubahan internal organisasi.",
            "action": "Lakukan realokasi instan bagi peserta terdampak ke proyek alternatif di negara lain yang status operasionalnya terverifikasi stabil."
        }
    }
    
    return recommendations.get(
        reason_text,
        {
            "root_cause": "Kendala kesiapan administratif pelamar atau penyesuaian kuota pada entitas penyelenggara program di luar negeri.",
            "action": "Lakukan evaluasi berkala dan pendampingan personal kepada calon peserta guna memitigasi hambatan administratif sedini mungkin."
        }
    )

def render_global_sidebar():
    """
    Merender kontrol penyaringan data global pada bilah sisi (Sidebar)
    Sesuai Kebutuhan Poin 5 (Waktu, Program, Kawasan, Negara, Host LC, Status).
    Tidak menggunakan emotikon sama sekali.
    """
    # Header Identitas Bilah Sisi
    st.sidebar.markdown("""
    <div style="padding-bottom: 12px; margin-bottom: 16px; border-bottom: 1px solid #E2E8F0;">
        <div style="font-size: 20px; font-weight: 900; color: #037EF3; letter-spacing: -0.02em;">ExpaLens</div>
        <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">
            AIESEC in UNAND - OGX BI
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    st.sidebar.markdown("<div style='font-size: 13px; font-weight: 800; color: #0F172A; margin-bottom: 8px;'>Penyaring Data Global</div>", unsafe_allow_html=True)
    
    # Memuat opsi filter berjenjang dari PostgreSQL
    filter_opts = get_filter_options()
    all_regions = filter_opts["regions"]
    countries_by_region = filter_opts["countries_by_region"]
    lcs_by_country = filter_opts["lcs_by_country"]
    
    # 1. Filter Tahun Pendaftaran (2021-2025)
    selected_years = st.sidebar.multiselect(
        "Tahun Pendaftaran",
        options=[2021, 2022, 2023, 2024, 2025],
        default=[2021, 2022, 2023, 2024, 2025],
        help="Menyaring data aplikasi berdasarkan tahun pendaftaran."
    )
    
    # 2. Filter Program Pertukaran
    selected_products = st.sidebar.multiselect(
        "Program Pertukaran",
        options=["GV (New)", "GTa", "GTe"],
        default=["GV (New)", "GTa", "GTe"],
        help="Menyaring data berdasarkan program pertukaran pemuda AIESEC."
    )
    
    # 3. Filter Kawasan Dunia (Region)
    selected_regions = st.sidebar.multiselect(
        "Kawasan Tujuan (Region)",
        options=all_regions,
        default=[],
        help="Menyaring data berdasarkan kawasan geografis dunia."
    )
    
    # Menentukan daftar negara berdasarkan kawasan yang dipilih
    if selected_regions:
        available_countries = []
        for reg in selected_regions:
            available_countries.extend(countries_by_region.get(reg, []))
        available_countries = sorted(list(set(available_countries)))
    else:
        # Jika tidak ada kawasan dipilih, tampilkan seluruh negara mitra
        available_countries = sorted(list(lcs_by_country.keys()))
        
    # 4. Filter Negara Tujuan (Host MC)
    selected_countries = st.sidebar.multiselect(
        "Negara Tujuan (Host MC)",
        options=available_countries,
        default=[],
        help="Menyaring data berdasarkan negara tujuan pertukaran."
    )
    
    # Menentukan daftar Host LC berdasarkan negara yang dipilih
    if selected_countries:
        available_lcs = []
        for mc in selected_countries:
            available_lcs.extend(lcs_by_country.get(mc, []))
        available_lcs = sorted(list(set(available_lcs)))
    else:
        available_lcs = []
        
    # 5. Filter Komite Lokal Tujuan (Host LC)
    selected_lcs = st.sidebar.multiselect(
        "Komite Lokal Tujuan (Host LC)",
        options=available_lcs,
        default=[],
        disabled=(len(available_lcs) == 0),
        help="Pilih negara tujuan terlebih dahulu untuk menyaring komite lokal."
    )
    
    # 6. Filter Status Pendaftaran
    selected_statuses = st.sidebar.multiselect(
        "Status Pendaftaran",
        options=["accepted", "approved", "finished", "rejected"],
        default=["accepted", "approved", "finished", "rejected"],
        help="Menyaring data berdasarkan status akhir seleksi."
    )
    
    st.sidebar.markdown("""
    <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #E2E8F0; font-size: 11px; color: #94A3B8;">
        Versi 1.0 - PostgreSQL aiesec_dw
    </div>
    """, unsafe_allow_html=True)
    
    return {
        "years": selected_years,
        "products": selected_products,
        "regions": selected_regions,
        "countries": selected_countries,
        "host_lcs": selected_lcs,
        "statuses": selected_statuses
    }
