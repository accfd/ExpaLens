# ExpaLens: Outgoing Exchange BI & Analytics Platform

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.30+-FF4B4B?style=flat&logo=streamlit&logoColor=white)](https://streamlit.io/)
[![Plotly](https://img.shields.io/badge/Plotly-5.18+-3F4F75?style=flat&logo=plotly&logoColor=white)](https://plotly.com/)
[![AIESEC Brand](https://img.shields.io/badge/Brand-AIESEC%20Blue%20%23037EF3-037EF3?style=flat)](https://aiesec.org)

**ExpaLens** adalah sistem *Business Intelligence* (BI) analitik berbasis web yang dirancang untuk Departemen Outgoing Exchange (OGX) AIESEC in Universitas Andalas (UNAND). Platform ini mengolah data historis aplikasi pertukaran peserta dari CRM Expa AIESEC (2021–2025) ke dalam *Data Mart* terpusat (PostgreSQL *Star Schema*), dan menyajikan wawasan analitik interaktif melalui 5 halaman dashboard berbasis Streamlit dan Plotly.

---

## 📁 Struktur Direktori Proyek

```text
ExpaLens/
├── PRD.md                             # Dokumen Spesifikasi Kebutuhan Produk (PRD)
├── DESIGN.md                          # Pedoman Desain UI/UX & AIESEC Brand Guidelines
├── README.md                          # Dokumentasi & Panduan Menjalankan Proyek
├── requirements.txt                   # Dependensi Pustaka Python
├── .env.example                       # Template Konfigurasi Environment Variable
├── .gitignore                         # Pengabaian Berkas Cache & Data Sementara
│
├── data/
│   ├── raw/                           # Dataset Mentah Expa (Data Compile 2021-2025.csv)
│   └── processed_csv/                 # Cadangan Ekspor CSV Bersih (.gitkeep)
│
├── database/
│   ├── schema_ddl.sql                 # Skrip DDL Star Schema PostgreSQL (aiesec_dw)
│   └── verify_queries.sql             # Kueri Pengujian & Validasi Baris Data Mart
│
├── docs/                              # Laporan Akademik & Panduan Brand
│   ├── Milestone 1 - Justification & Planning Kelompok 3.md
│   ├── Milestone 2 - Business Analysis Kelompok 3.md
│   ├── Milestone 3 - Design Kelompok 3.md
│   └── AIESEC+Brand+Guidelines+[Blue+Book].pdf
│
├── notebooks/
│   └── Pipeline_ETL.ipynb             # Pipeline Ekstraksi, Transformasi, & Load Data
│
└── src/                               # Kode Sumber Aplikasi Web Dashboard
    ├── app.py                         # Entry Point Utama Streamlit
    ├── config.py                      # Konfigurasi Tema AIESEC Blue Book & Palet Plotly
    ├── db_connection.py               # Engine Koneksi Database & Caching
    ├── utils.py                       # Fungsi Utilitas, Format Numerik, & Rekomendasi
    ├── styles.css                     # Custom CSS Eksekutif Dashboard (Font Lato)
    └── pages/                         # 5 Halaman Dashboard Multi-page
        ├── 1_Overview.py              # Halaman 1: Ringkasan Utama & Status Funnel
        ├── 2_Application_Trends.py    # Halaman 2: Tren Pendaftaran & Musim Puncak
        ├── 3_Conversion_Funnel.py     # Halaman 3: Tahapan Seleksi & Waktu Proses
        ├── 4_Destinations.py          # Halaman 4: Peta & Komite Mitra Global
        └── 5_Rejections.py            # Halaman 5: Alasan Penolakan & Rekomendasi
```

---

## 🚀 Panduan Memulai (Quickstart)

### 1. Prasyarat Sistem
* Python 3.10 atau versi yang lebih baru
* PostgreSQL 14/15/16 terinstal secara lokal dengan database `aiesec_dw`
* Git

### 2. Kloning Repositori & Setup Lingkungan Virtual
```bash
# Kloning repositori
git clone https://github.com/accfd/ExpaLens.git
cd ExpaLens

# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Linux / macOS:
source venv/bin/activate

# Instal dependensi
pip install -r requirements.txt
```

### 3. Konfigurasi Lingkungan (.env)
Salin berkas `.env.example` menjadi `.env`, lalu sesuaikan kredensial PostgreSQL Anda:
```bash
cp .env.example .env
```
Isi konfigurasi dalam file `.env`:
```ini
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aiesec_dw
DB_USER=postgres
DB_PASSWORD=admin123
```

### 4. Eksekusi Skrip Database & ETL
1. Buat skema tabel Data Mart di PostgreSQL dengan mengeksekusi `database/schema_ddl.sql` via pgAdmin atau psql.
2. Jalankan notebook `notebooks/Pipeline_ETL.ipynb` untuk memproses data mentah di `data/raw/` dan memuatnya ke basis data `aiesec_dw`.
3. Validasi hasil pemuatan menggunakan `database/verify_queries.sql`.

### 5. Menjalankan Dashboard Streamlit
```bash
streamlit run src/app.py
```
Aplikasi web akan berjalan pada peramban di alamat `http://localhost:8501`.

---

## 🎨 Identitas Desain & Brand
Sistem visual ExpaLens mengacu pada **AIESEC Brand Guidelines [Blue Book]**:
* **Warna Utama:** AIESEC Blue (`#037EF3`)
* **Lini Produk:**
  * Global Volunteer (GV): `#F85A40` (AIESEC Coral Red)
  * Global Talent (GTa): `#0A8EA0` (AIESEC Dark Teal)
  * Global Teacher (GTe): `#F48924` (AIESEC Orange)
* **Tipografi Resmi:** Font **Lato** dari Google Fonts.
* Panduan visual lengkap dapat dilihat pada [DESIGN.md](file:///d:/SEMESTER%205/ExpaLens/DESIGN.md).

---

## 👥 Tim Penyusun (Kelompok 3)
* Nayla Puspita Sari (2411521007)
* Zilfa Julyafitri (2411521013)
* Fuadi Dhiyaulhaq (2411522001)
* Adinda Queen Salsabilla (2411522008)
* **Dosen Pengampu:** Rahmatika Pratama Santi, S.Si., M.T.
