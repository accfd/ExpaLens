# ExpaLens: Outgoing Exchange Business Intelligence & Analytics PWA

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19+-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4+-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-037EF3?style=flat&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![AIESEC Brand](https://img.shields.io/badge/Brand-AIESEC%20Blue%20%23037EF3-037EF3?style=flat)](https://aiesec.org)

**ExpaLens** adalah sistem *Business Intelligence* (BI) analitik eksekutif modern berstandar *Progressive Web App* (PWA) yang dibangun untuk Departemen Outgoing Exchange (OGX) AIESEC in Universitas Andalas (UNAND). Platform ini mengintegrasikan data historis pendaftaran pertukaran pemuda (CRM Expa AIESEC 2021–2025) ke dalam *Data Mart* terpusat (PostgreSQL *Star Schema*), dan menyajikan visualisasi data responsif berkinerja tinggi melalui backend REST API FastAPI serta frontend React + Vite + Tailwind CSS.

---

## Struktur Direktori Proyek

```text
ExpaLens/
├── PRD.md                             # Dokumen Spesifikasi Kebutuhan Produk (PRD)
├── DESIGN.md                          # Panduan Desain UI/UX & AIESEC Blue Tone System
├── API_CONTRACT.md                    # Dokumentasi Endpoint REST API FastAPI & Payload
├── README.md                          # Panduan Resmi & Dokumentasi Arsitektur Sistem
├── Logo.jpeg                          # Aset Logo Resmi AIESEC in Universitas Andalas
├── requirements.txt                   # Dependensi Pustaka Python Backend
├── run_app.bat                        # Skrip Otomatis Menjalankan Backend & Frontend
├── .env.example                       # Templat Konfigurasi Variabel Lingkungan
├── .env                               # Konfigurasi Lingkungan Lokal (Database)
├── .gitignore                         # Pengabaian Berkas Cache & Node Modules
│
├── backend/                           # Layanan REST API Analitik (FastAPI)
│   ├── main.py                        # Entry Point API, CORS Middleware, & Routing
│   └── database.py                    # Agregasi Kueri Analitik SQL & Koneksi Engine
│
├── frontend/                          # Antarmuka Pengguna Responsif & PWA (React + Vite)
│   ├── index.html                     # Entry HTML, Font Lato, & Konfigurasi Favicon
│   ├── vite.config.js                 # Konfigurasi Bundler Vite & Service Worker PWA
│   ├── package.json                   # Dependensi Node.js & Skrip Build Frontend
│   │
│   ├── public/                        # Aset Statis Publik & Ikon PWA Standar
│   │   ├── logo.png                   # Logo Resolusi Tinggi
│   │   ├── favicon.ico                # Favicon Multi-resolusi Tab Peramban
│   │   ├── apple-touch-icon.png       # Ikon Beranda iOS (180x180)
│   │   ├── pwa-192x192.png            # Ikon Instalasi PWA (192x192)
│   │   ├── pwa-512x512.png            # Ikon Instalasi PWA (512x512)
│   │   └── countries-110m.json        # Topologi Peta Dunia Vektor
│   │
│   └── src/                           # Komponen & Logika Halaman Antarmuka
│       ├── main.jsx                   # React Root Mounting
│       ├── App.jsx                    # Root Shell, State Management, & Routing Tab
│       ├── index.css                  # Tailwind CSS & Font Styling
│       │
│       ├── assets/                    # Aset Gambar & GeoJSON Terbundel
│       │   ├── logo.png               # Logo Aplikasi
│       │   └── countries-110m.json    # Data Topologi Peta Dunia
│       │
│       ├── components/                # Komponen Antarmuka Terisolasi
│       │   ├── Header.jsx             # Bilah Header, Tombol PWA, & Segarkan Data
│       │   ├── Sidebar.jsx            # Bilah Sisi Navigasi Lipat (Collapsible Drawer)
│       │   ├── FilterBar.jsx          # Panel Slicer Global (Tahun, Program, Kawasan, LC)
│       │   └── ErrorBoundary.jsx      # Penanganan Galat Antarmuka (Error Boundary)
│       │
│       └── pages/                     # 5 Modul Analitik Sesuai DESIGN.md
│           ├── Overview.jsx           # Halaman 1: Ringkasan Utama, Funnel, YoY, & Speedometer
│           ├── ApplicationTrends.jsx  # Halaman 2: Tren Bulanan, Status, & Matriks Musim Puncak
│           ├── ConversionFunnel.jsx   # Halaman 3: Rasio Konversi, Waktu Proses, & Titik Gugur
│           ├── Destinations.jsx       # Halaman 4: Peta Datar Leaflet & Matriks Komite Mitra
│           └── Rejections.jsx         # Halaman 5: Analisis Penolakan & Rekomendasi CX
│
├── data/                              # Repositori Dataset
│   ├── raw/                           # Dataset Mentah Expa (Data Compile 2021-2025.csv)
│   └── processed_csv/                 # Cadangan Ekspor CSV Bersih (.gitkeep)
│
├── database/                          # Skrip Basis Data PostgreSQL (Data Mart)
│   ├── schema_ddl.sql                 # Skrip DDL Star Schema (aiesec_dw)
│   └── verify_queries.sql             # Kueri Pengujian & Validasi Baris Data Mart
│
├── docs/                              # Dokumen Akademik & Pedoman Organisasi
│   ├── Milestone 1 - Justification & Planning Kelompok 3.md
│   ├── Milestone 2 - Business Analysis Kelompok 3.md
│   ├── Milestone 3 - Design Kelompok 3.md
│   └── AIESEC+Brand+Guidelines+[Blue+Book].pdf
│
└── notebooks/                         # Pipeline Data Science & ETL
    └── Pipeline_ETL.ipynb             # Ekstraksi, Transformasi, & Pemuatan Data
```

---

## Panduan Instalasi & Menjalankan Aplikasi

### 1. Prasyarat Sistem
* Python 3.10 atau versi yang lebih baru
* Node.js v18+ dan npm
* PostgreSQL 14/15/16 terpasang dengan basis data `aiesec_dw`
* Git

---

### 2. Konfigurasi Basis Data PostgreSQL & Lingkungan (.env)
1. Buat basis data bernama `aiesec_dw` di PostgreSQL:
   ```sql
   CREATE DATABASE aiesec_dw;
   ```
2. Jalankan skrip DDL skema bintang:
   ```bash
   psql -U postgres -d aiesec_dw -f database/schema_ddl.sql
   ```
3. Salin berkas `.env.example` menjadi `.env` di folder utama:
   ```ini
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=aiesec_dw
   DB_USER=postgres
   DB_PASSWORD=
   ```

---

### 3. Setup & Menjalankan Backend (FastAPI)
Buka terminal baru di folder utama proyek:
```powershell
# Buat dan aktifkan virtual environment (opsional/disarankan)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Pasang pustaka dependensi Python
pip install -r requirements.txt

# Jalankan server backend FastAPI
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```
Dokumentasi interaktif Swagger UI otomatis dapat diakses di: `http://localhost:8000/docs`.

---

### 4. Setup & Menjalankan Frontend (React + Vite PWA)
Buka terminal baru di folder `frontend/`:
```powershell
cd frontend

# Pasang dependensi npm
npm install

# Jalankan server pengembang Vite
npm run dev
```
Aplikasi web analitik ExpaLens dapat diakses melalui peramban di: `http://localhost:5173`.

---

### 5. Cara Cepat: Menjalankan Sekaligus via Batch Script
Anda dapat langsung menjalankan seluruh sistem (backend dan frontend secara bersamaan) dengan mengklik ganda berkas `run_app.bat` atau mengeksekusinya via terminal:
```powershell
.\run_app.bat
```

---

## 5 Modul Analitik Eksekutif

1. **Ringkasan Utama (Overview):**
   * *Hero Card* total pendaftaran (75.520 pelamar) dan distribusi volume per lini produk.
   * *Customer Funnel Chart* 5 tingkat yang mengerucut secara konsisten: `Applied >= Accepted >= Approved >= Realized >= Finished`.
   * 4 Kartu KPI: Total Realized, Total Finished, Pertumbuhan Tahunan (YoY Growth $+148,8\%$), dan Rata-rata Durasi Seleksi (70,8 hari).
   * *Clustered Bar Chart* perbandingan pencapaian antarprogram dan *Radial Speedometer Gauge* tingkat kelulusan (*Finish Rate*).

2. **Tren Pendaftaran (Application Trends):**
   * Grafik tren deret waktu bulanan aplikasi (2021–2025).
   * Grafik dinamika status peserta dan perbandingan volume produk tahunan.
   * Matriks Musim Puncak (*Seasonality Heatmap Matrix*) 12 bulan $\times$ 5 tahun untuk mengidentifikasi lonjakan pendaftaran.
   * Preferensi durasi program (*Short-term* vs *Long-term*).

3. **Tahapan Seleksi (Conversion Funnel):**
   * Metrik rasio perpindahan langkah-ke-langkah (*step-to-step conversion*) dan analisis titik penurunan terbesar (*drop-off*).
   * Rata-rata durasi pemrosesan seleksi dalam hari (*Days to Accept, Days to Approve, Days to Realize, Days to Finish*).
   * Tahap terjadinya penolakan peserta (*Pre-Accepted, Post-Accepted, Post-Approved*).
   * Kecepatan proses seleksi rata-rata per negara tujuan.

4. **Negara Tujuan (Destinations):**
   * **Peta Datar Interaktif (*Flat Interactive World Map*):** Peta geografis dunia berbasis *React Leaflet* dengan ubin CartoDB Positron dan *Circle Bubble Markers* berwarna gradasi AIESEC Blue yang proporsional terhadap volume pelamar.
   * *Hover Tooltip & Click-to-Filter:* Mengklik penanda negara langsung menyaring tabel matriks di bawahnya.
   * Peringkat 10 besar negara tujuan terfavorit (*Clustered Horizontal Bar Chart*).
   * Matriks rincian performa komite lokal mitra (*Host LC Drill-down Table*) dilengkapi kolom pencarian dan kontrol paginasi.

5. **Alasan Penolakan (Rejections):**
   * Kartu Rekomendasi Tindakan Operasional CX otomatis berdasarkan temuan akar masalah penolakan pendaftar.
   * Peringkat 10 besar alasan penolakan aplikasi pelamar.
   * Sebaran proporsi alasan penolakan pada tiap produk pertukaran (GTa, GTe, GV).
   * Tren fluktuasi penolakan pendaftaran per bulan.

---

## Identitas Desain & Brand Guidelines

Sistem visual ExpaLens mengacu secara ketat pada **AIESEC Brand Guidelines [Blue Book]**:
* **Harmonized AIESEC Blue Tone System:**
  * Warna Utama: AIESEC Blue (`#037EF3`)
  * Warna Kontras Tinggi: Midnight Navy (`#0A2540`)
  * Warna Latar Netral: Kanvas `#F8FAFC`, Kartu Putih `#FFFFFF`, Garis Tepi `#E2E8F0`
* **Identitas Warna Produk Resmi:**
  * Global Talent (GTa): `#0A8EA0` (AIESEC Dark Teal)
  * Global Teacher (GTe): `#F48924` (AIESEC Orange)
  * Global Volunteer (GV): `#F85A40` (AIESEC Coral Red)
* **Tipografi Baku:** Seluruh teks antarmuka menggunakan keluarga font resmi **Lato** (Light 300, Regular 400, Bold 700, Black 900).
* **Standar Kebersihan Antarmuka:** Bebas dari segala bentuk karakter emotikon/emoji, menyajikan Bahasa Indonesia formal baku, dan pemformatan angka baku (titik untuk ribuan, koma untuk desimal).

---

## Tim Pengembang (Kelompok 3)

* **Nayla Puspita Sari** (2411521007)
* **Zilfa Julyafitri** (2411521013)
* **Fuadi Dhiyaulhaq** (2411522001)
* **Adinda Queen Salsabilla** (2411522008)
* **Dosen Pengampu:** Rahmatika Pratama Santi, S.Si., M.T.
