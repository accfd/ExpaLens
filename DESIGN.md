# Design System & UI/UX Guidelines: ExpaLens

**Sistem Business Intelligence & Analytics Kinerja Outgoing Exchange**  
**Organisasi:** AIESEC in Universitas Andalas (UNAND)  
**Departemen:** Outgoing Exchange (OGX)  
**Warna Utama:** AIESEC Blue (`#037EF3`)  
**Versi Dokumen:** 1.0  
**Tanggal:** 23 November 2026  

---

## 1. Filosofi Desain & Identitas Visual

ExpaLens dirancang dengan pendekatan **Executive Modern Dashboard**, memadukan identitas resmi organisasi pemuda global **AIESEC** dengan prinsip antarmuka analitik modern: *Clean, High-Contrast, Data-Dense yet Breathable, dan Action-Oriented*.

### 1.1 Prinsip Desain Utama
1. **Human-Centric & Professional:** Tampilan yang ramah pengguna namun tetap berwibawa untuk kebutuhan rapat evaluasi dewan pengurus (*Executive Board*) dan pemangku kepentingan.
2. **Visual Hierarchy yang Tegas:** Pemanfaatan kontras warna yang kuat untuk membedakan antara angka ringkasan utama (*Hero KPI*), grafik tren analitik, dan tabel detail transaksi.
3. **Card-Based Modular Layout:** Seluruh visualisasi, metrik, dan tabel dibungkus dalam kontainer kartu (*cards*) dengan sudut membulat (*rounded corners*) dan bayangan lembut (*subtle shadows*), mengadopsi struktur dashboard eksekutif modern (seperti pada referensi layout dashboard).
4. **Zero Visual Noise:** Meminimalkan garis batas yang kaku, mengganti warna latar belakang abu-abu berat dengan warna putih bersih dan latar *off-white* netral, serta memastikan teks selalu mudah dibaca (*accessible contrast ratio* WCAG AA).

---

## 2. Palet Warna Resmi (AIESEC Brand Color Palette)

Sistem warna ExpaLens berpusat pada **AIESEC Blue (`#037EF3`)** yang dikombinasikan dengan warna aksen gelap untuk kontras eksekutif, warna latar lembut untuk kartu metrik, serta palet warna khas program pertukaran AIESEC (GV, GTa, GTe).

### 2.1 Warna Utama & Turunan (Primary & Accents)

| Nama Token Warna | Kode HEX | Preview | Peruntukan & Kegunaan |
| :--- | :---: | :---: | :--- |
| **AIESEC Blue (Primary)** | `#037EF3` | ![#037EF3](https://via.placeholder.com/15/037EF3/000000?text=+) | Warna identitas utama AIESEC, tombol aksi primer, garis tren utama Plotly, indikator aktif, dan aksen visual penting. |
| **Midnight Navy (Hero Dark)** | `#0A2540` | ![#0A2540](https://via.placeholder.com/15/0A2540/000000?text=+) | Kartu metrik utama (*Hero Card / Dark Accent Container*), teks judul halaman, dan header tabel navigasi eksekutif. |
| **Deep Blue (Hover / Shade)** | `#0263C4` | ![#0263C4](https://via.placeholder.com/15/0263C4/000000?text=+) | Status *hover* pada tombol, bar charts interaktif, dan status fokus elemen input. |
| **Ice Blue Tint (Light Surface)** | `#F0F6FF` | ![#F0F6FF](https://via.placeholder.com/15/F0F6FF/000000?text=+) | Latar belakang kartu metrik sekunder (*Sparkline Metric Cards*), filter aktif, dan *callout box* informasi. |
| **Soft Blue Border** | `#D4E5FB` | ![#D4E5FB](https://via.placeholder.com/15/D4E5FB/000000?text=+) | Garis tepi (*border*) kartu metrik ringan dan pembatas antar-komponen visual. |

---

### 2.2 Warna Lini Produk AIESEC (Official Product Colors)

Untuk menjaga konsistensi dengan identitas produk global AIESEC, visualisasi program wajib menggunakan kode warna baku berikut:

| Produk Pertukaran | Kode HEX | Preview | Karakter & Kegunaan Visual |
| :--- | :---: | :---: | :--- |
| **Global Volunteer (GV)** | `#F85A40` | ![#F85A40](https://via.placeholder.com/15/F85A40/000000?text=+) | *AIESEC Coral Red*: Mewakili kerelawanan sosial berdampak (SDGs). Digunakan pada bar chart GV dan penanda kategori GV. |
| **Global Talent (GTa)** | `#0CB9C1` | ![#0CB9C1](https://via.placeholder.com/15/0CB9C1/000000?text=+) | *AIESEC Teal Cyan*: Mewakili profesionalisme dan magang korporat global. Digunakan pada bar chart GTa dan elemen GTa. |
| **Global Teacher (GTe)** | `#F48924` | ![#F48924](https://via.placeholder.com/15/F48924/000000?text=+) | *AIESEC Gold Orange*: Mewakili pendidikan formal dan pengajaran internasional. Digunakan pada bar chart GTe. |

---

### 2.3 Warna Semantik & Status (Feedback & Funnel Stages)

| Status Analitik | Kode HEX | Preview | Kegunaan pada Funnel & Notifikasi |
| :--- | :---: | :---: | :--- |
| **Success / Finished** | `#10B981` | ![#10B981](https://via.placeholder.com/15/10B981/000000?text=+) | Peserta lulus program (*Finished*), delta positif YoY, status aman. |
| **Approved / In Progress** | `#037EF3` | ![#037EF3](https://via.placeholder.com/15/037EF3/000000?text=+) | Peserta disetujui administrasi (*Approved*), status konfirmasi. |
| **Accepted / Pending** | `#F59E0B` | ![#F59E0B](https://via.placeholder.com/15/F59E0B/000000?text=+) | Peserta diterima tahap awal (*Accepted*), peringatan durasi menengah. |
| **Rejected / Critical** | `#EF4444` | ![#EF4444](https://via.placeholder.com/15/EF4444/000000?text=+) | Peserta ditolak (*Rejected*), delta negatif YoY, peringatan kegagalan. |

---

### 2.4 Warna Netral & Latar Belakang (Neutrals & Backgrounds)

| Elemen Antarmuka | Kode HEX | Kegunaan |
| :--- | :---: | :--- |
| **Main Canvas Background** | `#F8FAFC` | Latar belakang seluruh halaman aplikasi (Slate-50: bersih, nyaman di mata). |
| **Card / Surface Background** | `#FFFFFF` | Latar belakang kontainer kartu visualisasi, tabel, dan grafik Plotly. |
| **Sidebar Background** | `#FFFFFF` | Latar bilah samping dengan pembatas border kanan `#E2E8F0`. |
| **Text Primary (Headings)** | `#0F172A` | Warna judul halaman, angka metrik besar, dan label utama (Slate-900). |
| **Text Secondary (Subtitles)** | `#475569` | Deskripsi sub-judul, teks panduan, dan nama kolom tabel (Slate-600). |
| **Text Muted / Captions** | `#94A3B8` | Label tanggal, satuan waktu, dan *footnote* grafik (Slate-400). |
| **Card Borders / Dividers** | `#E2E8F0` | Garis tepi kontainer kartu standar (Slate-200). |

---

## 3. Tipografi & Skala Hirarki Teks

ExpaLens menggunakan font standar sans-serif modern (`Inter`, `Plus Jakarta Sans`, atau `system-ui`) yang memiliki keterbacaan tinggi pada angka numerik:

| Tingkatan Teks | Ukuran Font | Berat (Weight) | Contoh Penggunaan |
| :--- | :---: | :---: | :--- |
| **Page Title (H1)** | 28px – 32px | Bold (700) | Judul Halaman (cth: "Welcome back, Olivia", "Ringkasan Utama (Overview)") |
| **Section Subtitle** | 14px – 15px | Regular (400) | Deskripsi konteks di bawah judul halaman |
| **Hero KPI Value** | 32px – 38px | ExtraBold (800) | Angka metrik utama pada Hero Card gelap (cth: "75,520", "64.2%") |
| **Card KPI Value** | 24px – 28px | Bold (700) | Angka metrik pada kartu standar (cth: "1,240", "14.5 Hari") |
| **Chart / Card Title** | 16px – 18px | SemiBold (600) | Judul grafik kontainer kartu (cth: "Monthly Application Trend") |
| **Body / Table Text** | 13px – 14px | Regular (400) | Isi teks tabel, label sumbu grafik, dan penjelasan rekomendasi |
| **Badge / Caption** | 11px – 12px | Medium (500) | Tag status, delta persentase YoY (+12.4%), dan legenda kecil |

---

## 4. Bedah Arsitektur Komponen UI (Executive Layout Structure)

Mengacu pada komposisi antarmuka referensi yang terbukti efektif, setiap halaman dashboard ExpaLens disusun menggunakan grid terstruktur:

```
+----------------------------------------------------------------------------------------------------+
| [HEADER SECTION]                                                                                   |
| Welcome back, OGX Team                                                                             |
| Pemantauan kinerja aplikasi pertukaran peserta AIESEC in UNAND secara komprehensif dan interaktif. |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
| +-----------------------------+  +---------------------------------------------------------------+ |
| | [LEFT COLUMN: 30% WIDTH]    |  | [RIGHT COLUMN: 70% WIDTH]                                     | |
| |                             |  |                                                               | |
| | +-------------------------+ |  | +-----------------------------------------------------------+ | |
| | | HERO METRIC CARD (DARK) | |  | | PRIMARY ANALYTIC CARD (WHITE CONTAINER)                   | | |
| | | Warna: #0A2540 (Navy)   | |  | | Total Nilai / Volume: 75,520                              | | |
| | | Nilai Besar: 75,520 Apps| |  | | Grafik Garis Utama / Funnel Interaktif (AIESEC Blue)      | | |
| | | Breakdown Mini Table:   | |  | | Legenda & Kontrol di Atas                                 | | |
| | | - GV   : 42,150         | |  | +-----------------------------------------------------------+ | |
| | | - GTa  : 21,300         | |  |                                                               | |
| | | - GTe  : 12,070         | |  | +--------------------+ +--------------------+ +-----------------+ | |
| | +-------------------------+ |  | | SPARKLINE METRIC 1 | | SPARKLINE METRIC 2 | | SPARKLINE METRIC| | |
| |                             |  | | Accepted Rate      | | Avg Process Time   | | Finish Rate     | | |
| | +-------------------------+ |  | | 64.2%              | | 14.2 Hari          | | 52.8%           | | |
| | | DUAL KPI CARDS          | |  | | [Mini Sparkline]   | | [Mini Sparkline]   | | [Mini Sparkline]| | |
| | | YoY Growth: +14.2%      | |  | +--------------------+ +--------------------+ +-----------------+ | |
| | | Rejection Rate: 28.5%   | |  |                                                               | |
| | +-------------------------+ |  | +-----------------------------------------------------------+ | |
| |                             |  | | DETAILED DATA MATRIX / TABLE CARD                         | | |
| | +-------------------------+ |  | | Tabel Rincian Data Interaktif (Sticky Header)             | | |
| | | SIDEBAR / BREAKDOWN BAR | |  | | Search, Filter, Sortable Columns, Clean Zebra Rows         | | |
| | | Komposisi Hari / Produk | |  | +-----------------------------------------------------------+ | |
| | +-------------------------+ |  +---------------------------------------------------------------+ |
| +-----------------------------+                                                                    |
+----------------------------------------------------------------------------------------------------+
```

### 4.1 Spesifikasi Setiap Komponen

#### 1. Header Section
* **Struktur:** Menampilkan salam/judul halaman yang personal dan profesional (*"Welcome back, OGX Team"* atau nama halaman aktif), disertai satu paragraf penjelasan peran halaman tersebut.
* **Styling:** Margin bawah 20px, font 28px bold warna `#0F172A`, deskripsi font 14px warna `#475569`.

#### 2. Hero Metric Card (Dark Container - Mirip Referensi Kiri Atas)
* **Warna Latar:** Gradien gelap atau solid Midnight Navy (`#0A2540` / `#001F3F`).
* **Warna Teks:** Putih (`#FFFFFF`) dengan label aksen Ice Blue (`#93C5FD`).
* **Komposisi:**
  * Label Atas: Nama Metrik Induk (misal: *"Total Applications"*).
  * Nilai Utama: Font 36px ExtraBold putih (`75,520`).
  * Mini Breakdown Table: Menampilkan tabel ringkasan 3 lini produk (GV, GTa, GTe) dengan volume saat ini vs tahun sebelumnya.
* **Border Radius:** 16px, padding 24px, bayangan lembut `0 10px 15px -3px rgba(0,0,0,0.1)`.

#### 3. Sparkline Metric Cards (Deretan Kartu Metrik dengan Grafik Mini)
* **Warna Latar:** Putih (`#FFFFFF`) atau Ice Blue Tint (`#F0F6FF`).
* **Komposisi:**
  * Judul metrik kecil (13px, `#475569`).
  * Nilai metrik tebal (26px, warna hijau semantik `#10B981` atau AIESEC Blue `#037EF3`).
  * Grafik sparkline mini di bagian bawah kartu (garis tren mini tanpa sumbu untuk visualisasi dinamika 6 bulan terakhir).
* **Border Radius:** 12px, border tipis `#E2E8F0` atau `#D4E5FB`.

#### 4. Primary Analytic Chart Container
* **Warna Latar:** Putih murni (`#FFFFFF`).
* **Header Kontainer:** Judul grafik di kiri atas (16px semi-bold), legenda interaktif horizontal di kanan atas.
* **Area Visual:** Canvas Plotly interaktif dengan kurva halus (*spline smoothing*), hover tooltip kustom berwarna navy gelap dengan teks putih.
* **Garis Kisi (Gridlines):** Abu-abu sangat tipis (`#F1F5F9`) pada sumbu Y, sumbu X tanpa garis vertikal berlebih.

#### 5. Detailed Data Matrix / Table Card
* **Warna Latar:** Putih (`#FFFFFF`), sudut membulat 12px.
* **Header Tabel:** Latar `#F8FAFC`, teks tebal 13px warna `#475569`, border bawah `#E2E8F0`.
* **Baris Data:** Font 13px reguler, *hover effect* baris berwarna `#F0F6FF` (Ice Blue lembut), penataan teks angka rata kanan (*align right*) dan teks kategori rata kiri (*align left*).

---

## 5. Konfigurasi Tema Plotly Resmi (`expalens_theme`)

Seluruh visualisasi Plotly pada 5 halaman dashboard wajib mengadopsi template konfigurasi Python berikut agar seragam dengan identitas AIESEC Blue:

```python
import plotly.graph_objects as go
import plotly.express as px

# PALET WARNA RESMI EXPALLENS
AIESEC_BLUE = "#037EF3"      # Biru Utama AIESEC
MIDNIGHT_NAVY = "#0A2540"    # Navy Gelap untuk Judul & Hero Card
ICE_BLUE_BG = "#F0F6FF"      # Ice Blue Latar Kartu
BORDER_BLUE = "#D4E5FB"      # Garis Pembatas
SLATE_TEXT = "#0F172A"       # Teks Utama
MUTED_TEXT = "#64748B"       # Teks Sekunder
GRID_COLOR = "#F1F5F9"       # Garis Kisi

# WARNA PRODUK AIESEC
PRODUCT_COLORS = {
    "GV (New)": "#F85A40",   # AIESEC Red (Volunteer)
    "GTa": "#0CB9C1",        # AIESEC Teal (Talent)
    "GTe": "#F48924"         # AIESEC Orange (Teacher)
}

# TEMA GLOBAL PLOTLY
EXPALENS_PLOTLY_THEME = {
    "layout": go.Layout(
        font=dict(family="Inter, sans-serif", color=SLATE_TEXT),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        colorway=[AIESEC_BLUE, "#0CB9C1", "#F85A40", "#F48924", "#6366F1"],
        margin=dict(t=40, r=20, b=40, l=40),
        xaxis=dict(
            showgrid=False,
            linecolor="#E2E8F0",
            tickfont=dict(size=12, color=MUTED_TEXT),
            titlefont=dict(size=13, color=SLATE_TEXT)
        ),
        yaxis=dict(
            showgrid=True,
            gridcolor=GRID_COLOR,
            linecolor="rgba(0,0,0,0)",
            tickfont=dict(size=12, color=MUTED_TEXT),
            titlefont=dict(size=13, color=SLATE_TEXT)
        ),
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1,
            font=dict(size=12, color=MUTED_TEXT)
        ),
        hoverlabel=dict(
            bgcolor=MIDNIGHT_NAVY,
            font_size=12,
            font_family="Inter, sans-serif",
            font_color="#FFFFFF"
        )
    )
}
```

---

## 6. Blueprint Desain untuk 5 Halaman Dashboard

Menerapkan struktur layout eksekutif (kolom kiri + kanan) pada kelima halaman dashboard yang telah dirumuskan pada PRD:

### 6.1 Halaman 1: Ringkasan Utama (Overview)
* **Header:** *"Welcome back, OGX Team"* | *"Tinjauan performa kumulatif program pertukaran AIESEC in UNAND periode 2021–2025."*
* **Kolom Kiri (30%):**
  * **Hero Dark Card (`#0A2540`):**
    * Judul: *"Total Applications"*
    * Angka Utama: `75,520`
    * Breakdown Table: Menampilkan tabel ringkasan per program (GV: 42.150 | GTa: 21.300 | GTe: 12.070).
  * **Dual KPI Cards:**
    * *YoY Growth Rate:* `+14.2%` (Badge Hijau `#10B981`)
    * *Overall Process Time:* `14.5 Hari` (Aksen Biru `#037EF3`)
  * **Visual No. 4:** *Finish Rate Gauge Chart* (Speedometer jarum Plotly dengan target ≥ 70%).
* **Kolom Kanan (70%):**
  * **Visual No. 2 (Primary Analytic Card):** *Overall Customer Funnel Chart* (Plotly Funnel bertingkat dari *Applied* hingga *Finished* berbalut AIESEC Blue).
  * **Visual No. 3:** *Clustered Column Chart* capaian tahapan (*Accepted, Approved, Finished*) dikelompokkan berdasarkan warna produk AIESEC (Merah GV, Toska GTa, Oranye GTe).

---

### 6.2 Halaman 2: Tren Pendaftaran (Application Trends)
* **Header:** *"Application Trends & Seasonality Analysis"* | *"Analisis dinamika volume pendaftaran bulanan, status kelulusan, dan siklus musim puncak."*
* **Kolom Kiri (30%):**
  * **Hero Dark Card:** Total Pendaftar Tahun Berjalan vs Target Tahunan.
  * **Visual No. 10 (100% Stacked Bar):** Proporsi preferensi peserta (*Semi-Remote vs On-site* dan *Short vs Long-term*).
* **Kolom Kanan (70%):**
  * **Visual No. 6 (Top Big Card - Line Chart):** Grafik garis tren pendaftaran bulanan (2021–2025) menggunakan kurva *spline* halus warna `#037EF3` dengan penanda titik puncak (*peak markers*).
  * **Visual No. 7 & 8 (Dual Cards):**
    * *Visual No. 7:* Stacked Area Chart sebaran status bulanan (*Accepted, Finished, Rejected*).
    * *Visual No. 8:* Clustered Column Chart pertumbuhan volume tahunan per produk.
  * **Visual No. 9 (Bottom Card):** *Seasonality Heatmap* (Matriks 12 Bulan × 5 Tahun dengan skala gradasi AIESEC Blue untuk mendeteksi *Summer Peak* dan *Winter Peak*).

---

### 6.3 Halaman 3: Tahapan Seleksi dan Kelulusan (Conversion Funnel)
* **Header:** *"Conversion Funnel & Operational Efficiency"* | *"Evaluasi rasio konversi antar-tahap dan analisis kecepatan waktu pemrosesan aplikasi."*
* **Top Metric Row (4 Sparkline Cards):**
  * *Avg Days to Accept* (Card Ice Blue) | *Avg Days to Approve* | *Avg Days to Realize* | *Avg Days to Finish*
* **Kolom Kiri (35%):**
  * **Visual No. 11:** *Step-by-Step Funnel Chart* dilengkapi persentase penurunan peserta (*drop-off rate*) di setiap tahapan.
  * **Visual No. 13:** *Rejection Stage Stacked Bar* (Titik terjadinya penolakan: *Pre-Accepted*, *Post-Accepted*, *Post-Approved*).
* **Kolom Kanan (65%):**
  * **Visual No. 12:** *Clustered Horizontal Bar Chart* rata-rata durasi hari per program (GV vs GTa vs GTe).
  * **Visual No. 14 (Bottom Scatter Plot):** *Scatter Plot Speed vs Volume* (Sumbu X: Durasi Hari, Sumbu Y: Total Aplikasi, Gelembung: Negara Tujuan *Host MC*).

---

### 6.4 Halaman 4: Peta dan Negara Tujuan (Destinations)
* **Header:** *"Global Destinations & Entity Performance"* | *"Persebaran geografis mitra global dan penelusuran mendalam performa komite lokal."*
* **Visual Utama (Top Wide Card - Visual No. 15):**
  * *Global Choropleth Map (Plotly)* interaktif berskala dunia dengan gradasi warna AIESEC Blue (`#037EF3`).
  * Hover tooltip memuat: Negara, Total Aplikasi, Diterima, dan Lulus.
* **Kolom Kiri (40% - Visual No. 16A):**
  * *Top 10 Host MC Bar Chart* (Peringkat 10 negara tujuan terpopuler asal UNAND).
* **Kolom Kanan (60% - Visual No. 16B & 16C):**
  * *Host LC Drill-Down Selector & Matrix:* Dropdown dinamis memilih negara → Tabel interaktif rincian komite universitas mitra (*Host LC*) lengkap dengan *Finish Rate* dan durasi rata-rata hari.

---

### 6.5 Halaman 5: Alasan Penolakan Peserta (Rejections)
* **Header:** *"Rejections Analysis & Tactical Action Engine"* | *"Identifikasi akar masalah kegagalan seleksi dan rekomendasi solusi taktis terotomatisasi."*
* **Kolom Kiri (40%):**
  * **Visual No. 17:** *Top Rejection Reasons Horizontal Bar Chart* (Peringkat alasan penolakan terbanyak di luar label `'Not Rejected'`).
  * **Visual No. 18A:** *Rejections by Product Clustered Bar* (Penyebab utama penolakan pada GV vs GTa vs GTe).
* **Kolom Kanan (60%):**
  * **Visual No. 18B:** *Monthly Rejection Trend Line Chart* (Memantau dinamika penurunan angka penolakan antartahun).
  * **Visual No. 19 (Dynamic Action Engine Box):**
    * Kartu rekomendasi cerdas berlatar Ice Blue (`#F0F6FF`) dengan border AIESEC Blue (`#037EF3`).
    * Menampilkan badge: *"Top Root Cause Detected"* + Saran operasional konkret untuk tim QA & Customer Experience.

---

## 7. Implementasi Custom CSS Streamlit (`custom.css`)

Untuk menghasilkan tampilan kartu modern berlatar belakang bersih dan bayangan halus seperti pada referensi UI, kode CSS berikut diinjeksikan ke dalam aplikasi Streamlit:

```css
/* ========================================================
   EXPALLENS STREAMLIT THEME (AIESEC BLUE #037EF3)
   ======================================================== */

/* Latar Belakang Aplikasi Utama */
.stApp {
    background-color: #F8FAFC;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Sidebar Styling */
section[data-testid="stSidebar"] {
    background-color: #FFFFFF;
    border-right: 1px solid #E2E8F0;
}

/* Header Section */
.header-container {
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #E2E8F0;
}
.header-title {
    font-size: 28px;
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 4px;
}
.header-subtitle {
    font-size: 14px;
    color: #64748B;
}

/* Hero Metric Card (Dark Navy #0A2540) */
.hero-card {
    background: linear-gradient(135deg, #0A2540 0%, #001F3F 100%);
    border-radius: 16px;
    padding: 24px;
    color: #FFFFFF;
    box-shadow: 0 10px 15px -3px rgba(10, 37, 64, 0.2);
    margin-bottom: 20px;
}
.hero-card-title {
    font-size: 14px;
    color: #93C5FD;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.hero-card-value {
    font-size: 38px;
    font-weight: 800;
    color: #FFFFFF;
    margin: 8px 0 16px 0;
}

/* Sparkline / Standard Metric Card */
.metric-card {
    background-color: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 14px;
    padding: 18px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(3, 126, 243, 0.08);
    border-color: #D4E5FB;
}
.metric-card-label {
    font-size: 13px;
    color: #64748B;
    font-weight: 500;
}
.metric-card-num {
    font-size: 26px;
    font-weight: 700;
    color: #0F172A;
    margin-top: 4px;
}

/* Card Visual Chart Container */
.chart-container {
    background-color: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
}
.chart-title {
    font-size: 16px;
    font-weight: 600;
    color: #0F172A;
    margin-bottom: 12px;
}

/* Action Recommendation Box (Halaman 5) */
.action-box {
    background-color: #F0F6FF;
    border-left: 4px solid #037EF3;
    border-radius: 0 12px 12px 0;
    padding: 20px;
    margin-top: 15px;
}
.action-box-title {
    font-size: 15px;
    font-weight: 700;
    color: #0A2540;
    margin-bottom: 6px;
}
.action-box-desc {
    font-size: 13px;
    color: #334155;
    line-height: 1.5;
}
```

---

## 8. Panduan Eksekusi Desain (Design Checklist)

Sebelum merilis halaman dashboard Streamlit, pastikan poin verifikasi visual berikut terpenuhi:
* [x] Seluruh elemen interaktif dan aksen primer menggunakan kode warna resmi **AIESEC Blue (`#037EF3`)**.
* [x] Warna produk pertukaran konsisten: **GV (`#F85A40`)**, **GTa (`#0CB9C1`)**, dan **GTe (`#F48924`)**.
* [x] Menggunakan container kartu (*card-based layout*) dengan `border-radius: 12px–16px` dan border halus `#E2E8F0`.
* [x] Hero card pada ringkasan utama memanfaatkan kontras gelap Midnight Navy (`#0A2540`).
* [x] Grafik Plotly memiliki latar belakang transparan (`rgba(0,0,0,0)`), tanpa bingkai luar yang kaku, dan garis kisi sumbu Y sangat tipis (`#F1F5F9`).
* [x] Tooltip hover Plotly menggunakan font sans-serif putih dengan latar kontainer gelap (`#0A2540`).
* [x] Seluruh penamaan halaman dan metrik selaras 100% dengan **PRD.md** dan **Tabel 3 Milestone 2**.

---
*Dokumen DESIGN.md ini menjadi panduan visual baku bagi pengembangan front-end dashboard ExpaLens.*
