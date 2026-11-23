# Design System & UI/UX Guidelines: ExpaLens
## Berdasarkan AIESEC Brand Guidelines (Blue Book) & Executive Dashboard UI

**Sistem Business Intelligence & Analytics Kinerja Outgoing Exchange**  
**Organisasi:** AIESEC in Universitas Andalas (UNAND)  
**Departemen:** Outgoing Exchange (OGX)  
**Dokumen Referensi Brand:** *AIESEC Brand Guidelines [Blue Book] Global Toolkit*  
**Warna Utama:** AIESEC Blue (`#037EF3`)  
**Font Utama:** Lato (Official AIESEC Font)  
**Versi Dokumen:** 2.0 (Blue Book Aligned)  
**Tanggal:** 23 November 2026  

---

## 1. Filosofi Desain & Identitas Brand (AIESEC Blue Book)

Berdasarkan *AIESEC Brand Guidelines [Blue Book]* (Bab 3.2 – Brand Attributes & Voice), seluruh manifestasi visual AIESEC harus mencerminkan lima atribut utama:
* **Dynamic:** Menggambarkan pemuda yang aktif, fleksibel, dan terus bergerak.
* **Impactful:** Berfokus pada hasil nyata, perubahan positif, dan kepemimpinan.
* **Global:** Mewakili jejaring pemuda di lebih dari 120 negara di seluruh dunia.
* **Youthful:** Segar, modern, bersih, dan bersemangat.
* **Passionate:** Memancarkan antusiasme tinggi dalam setiap interaksi dan pengalaman.

Dalam konteks sistem Business Intelligence **ExpaLens**, nilai-nilai ini diwujudkan melalui antarmuka **Executive Modern Dashboard**: tata letak berbasis kartu (*card-based layout*) yang terstruktur rapi, pemanfaatan hierarki visual kontras tinggi, keterbacaan data numerik yang tajam, serta konsistensi 100% terhadap palet warna dan tipografi resmi *AIESEC Blue Book*.

> **Golden Rule AIESEC Blue Book (Page 14):**  
> *"If you are not sure what color to choose, make it AIESEC Blue."*

---

## 2. Palet Warna Resmi AIESEC (Official Color Swatch)

Sistem warna ExpaLens mengadopsi secara ketat **Official Color Swatch** yang tercantum pada *AIESEC Brand Guidelines [Blue Book]* Halaman 14, dipadukan dengan warna netral untuk dashboard analitik:

### 2.1 Palet Inti (AIESEC Official Swatch)

| Nama Warna (Blue Book) | Kode HEX | Nilai RGB | Preview | Peruntukan & Pedoman Penggunaan |
| :--- | :---: | :---: | :---: | :--- |
| **AIESEC Blue** | `#037EF3` | `3, 126, 243` | ![#037EF3](https://via.placeholder.com/15/037EF3/000000?text=+) | **Warna Utama AIESEC.** Digunakan pada tombol aksi primer, garis tren utama Plotly, indikator aktif, aksen navigasi, dan elemen fokus. |
| **AIESEC Dark Teal** | `#0A8EA0` | `10, 142, 160` | ![#0A8EA0](https://via.placeholder.com/15/0A8EA0/000000?text=+) | **Resmi untuk program magang & mitra perusahaan (*Global Talent / GTa*).** Digunakan pada bar chart GTa dan elemen analitik korporat. |
| **AIESEC Red / Orange** | `#F85A40` | `248, 90, 64` | ![#F85A40](https://via.placeholder.com/15/F85A40/000000?text=+) | **Resmi untuk program kesukarelawanan & mitra NGO (*Global Volunteer / GV*).** Digunakan pada bar chart GV dan penanda sosial SDGs. |
| **AIESEC Orange** | `#F48924` | `244, 137, 36` | ![#F48924](https://via.placeholder.com/15/F48924/000000?text=+) | **Resmi untuk program edukasi (*Global Teacher / GTe* & YouthSpeak).** Digunakan pada bar chart GTe dan indikator pembelajaran. |
| **AIESEC Teal** | `#30C39E` | `48, 195, 158` | ![#30C39E](https://via.placeholder.com/15/30C39E/000000?text=+) | Mewakili inovasi dan kewirausahaan global. Digunakan untuk variasi aksen positif dan sub-kategori. |
| **AIESEC Yellow** | `#FFC845` | `255, 200, 69` | ![#FFC845](https://via.placeholder.com/15/FFC845/000000?text=+) | Digunakan untuk status perhatian (*warning*), penanda kuartal, atau sorotan khusus. |
| **AIESEC Light Gray** | `#F3F4F7` | `243, 244, 247` | ![#F3F4F7](https://via.placeholder.com/15/F3F4F7/000000?text=+) | **Warna Latar Belakang Kanvas.** Memberikan suasana bersih, lembut di mata, dan modern untuk canvas aplikasi. |
| **AIESEC Mid Gray** | `#CACCD1` | `202, 204, 209` | ![#CACCD1](https://via.placeholder.com/15/CACCD1/000000?text=+) | Garis batas (*border*) kartu, pemisah kolom (*dividers*), dan garis kisi sekunder. |
| **AIESEC Dark Gray** | `#52565E` | `82, 86, 94` | ![#52565E](https://via.placeholder.com/15/52565E/000000?text=+) | Teks sekunder, label sumbu grafik, satuan metrik, dan keterangan tabel. |

---

### 2.2 Warna Tambahan untuk Kebutuhan Dashboard Eksekutif

Untuk menghadirkan kedalaman visual kontras tinggi sesuai referensi antarmuka dashboard eksekutif:

| Nama Token Warna | Kode HEX | Nilai RGB | Peruntukan Visual |
| :--- | :---: | :---: | :--- |
| **Midnight Navy (Hero Dark)** | `#0A2540` | `10, 37, 64` | Kontainer gelap kartu metrik utama (*Hero Card*), judul header besar, dan tooltip hover Plotly. |
| **Ice Blue Tint** | `#F0F6FF` | `240, 246, 255` | Latar kartu metrik ringan, hover baris tabel, dan wadah rekomendasi taktis. |
| **Success Green** | `#10B981` | `16, 185, 129` | Status peserta lulus (*Finished*), delta positif pertumbuhan YoY (+%). |
| **Critical Red** | `#EF4444` | `239, 68, 68` | Status aplikasi ditolak (*Rejected*), delta penurunan performa (-%). |
| **Pure White** | `#FFFFFF` | `255, 255, 255` | Latar kartu visualisasi grafik Plotly dan bilah samping (*Sidebar*). |
| **Heading Black** | `#0F172A` | `15, 23, 42` | Teks judul utama dan nilai numerik besar (Slate-900). |

---

## 3. Tipografi Resmi AIESEC (Lato Typography System)

Sesuai **Blue Book Halaman 15**, **`Lato`** adalah font resmi (*official font*) AIESEC yang wajib digunakan pada seluruh materi komunikasi, situs web, dan aplikasi resmi AIESEC.

```
+------------------------------------------------------------------------------------+
|                         AIESEC OFFICIAL FONT: LATO                                 |
+------------------------------------------------------------------------------------+
| Lato Light (300)      : Untuk label kecil, sub-keterangan, teks pendukung          |
| Lato Regular (400)    : Untuk isi teks body, penjelasan tabel, deskripsi narasi    |
| Lato Bold (700)       : Untuk judul kartu, label header tabel, nama metrik         |
| Lato Black/Heavy (900): Untuk angka numerik KPI besar (Hero Numbers) & Judul H1   |
+------------------------------------------------------------------------------------+
```

### 3.1 Skala Ukuran Teks (Type Hierarchy Scale)

| Tingkatan Teks | Ukuran Font | Berat (Weight) | Contoh Penggunaan pada ExpaLens |
| :--- | :---: | :---: | :--- |
| **Page Title (H1)** | 28px – 32px | Lato Black (900) | Judul Halaman (cth: "Welcome back, OGX Team", "Ringkasan Utama (Overview)") |
| **Section Subtitle** | 14px – 15px | Lato Regular (400) | Paragraf penjelasan peran halaman di bawah judul utama |
| **Hero KPI Value** | 36px – 40px | Lato Black (900) | Angka metrik utama pada Hero Card gelap (cth: "75,520", "64.2%") |
| **Standard KPI Value**| 24px – 28px | Lato Bold (700) | Angka metrik pada kartu putih standar (cth: "14.5 Hari", "3,703") |
| **Card / Chart Title**| 16px – 18px | Lato Bold (700) | Judul kontainer grafik Plotly (cth: "Perkembangan Jumlah Pendaftaran") |
| **Body & Table Text** | 13px – 14px | Lato Regular (400) | Isi rekaman tabel data, label sumbu grafik, dan penjelasan rekomendasi |
| **Badge / Caption**   | 11px – 12px | Lato Bold (700) | Tag status, delta persentase YoY (+14.2%), dan legenda kecil |

---

## 4. Bedah Arsitektur Komponen UI (Executive Grid Layout)

Mengacu pada referensi dashboard eksekutif yang dibagikan, antarmuka ExpaLens menggunakan sistem grid modular berbasis kartu (*card-based modular layout*):

```
+----------------------------------------------------------------------------------------------------+
| [HEADER SECTION]                                                                                   |
| Welcome back, OGX Team                                                                             |
| Pemantauan kinerja aplikasi pertukaran peserta AIESEC in UNAND secara komprehensif dan interaktif. |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
| +-----------------------------+  +---------------------------------------------------------------+ |
| | [KOLOM KIRI: 30% LEBAR]     |  | [KOLOM KANAN: 70% LEBAR]                                      | |
| |                             |  |                                                               | |
| | +-------------------------+ |  | +-----------------------------------------------------------+ | |
| | | HERO METRIC CARD (DARK) | |  | | PRIMARY ANALYTIC CARD (WHITE CONTAINER)                   | | |
| | | Latar: #0A2540 (Navy)   | |  | | Total Volume: 75,520 Pendaftar                             | | |
| | | Angka: 75,520 (Putih)   | |  | | Grafik Garis Utama / Funnel Interaktif (AIESEC Blue)      | | |
| | | Tabel Mini Breakdown:   | |  | | Legenda & Kontrol Horizontal di Kanan Atas                 | | |
| | | - GV   : 42,150 (#F85A40| |  +-----------------------------------------------------------+ | |
| | | - GTa  : 21,300 (#0A8EA0| |  |                                                               | |
| | | - GTe  : 12,070 (#F48924| |  | +--------------------+ +--------------------+ +-----------------+ | |
| | +-------------------------+ |  | | SPARKLINE METRIC 1 | | SPARKLINE METRIC 2 | | SPARKLINE METRIC| | |
| |                             |  | | Accepted Rate      | | Avg Process Time   | | Finish Rate     | | |
| | +-------------------------+ |  | | 64.2%              | | 14.2 Hari          | | 52.8%           | | |
| | | DUAL KPI CARDS          | |  | | [Mini Sparkline]   | | [Mini Sparkline]   | | [Mini Sparkline]| | |
| | | YoY: +14.2% (Hijau)     | |  | +--------------------+ +--------------------+ +-----------------+ | |
| | | Finish Rate: 64.2%      | |  |                                                               | |
| | +-------------------------+ |  | +-----------------------------------------------------------+ | |
| |                             |  | | DETAILED DATA MATRIX / TABLE CARD                         | | |
| | +-------------------------+ |  | | Tabel Rincian Data Interaktif (Sticky Header)             | | |
| | | GAUGE / BREAKDOWN BAR   | |  | | Search, Filter, Sortable Columns, Clean Zebra Rows         | | |
| | | Indikator Keberhasilan  | |  | +-----------------------------------------------------------+ | |
| | +-------------------------+ |  +---------------------------------------------------------------+ |
| +-----------------------------+                                                                    |
+----------------------------------------------------------------------------------------------------+
```

### 4.1 Spesifikasi Detail Komponen

#### 1. Header Section
* **Konten:** Salam profesional (*"Welcome back, OGX Team"*), identitas Departemen Outgoing Exchange AIESEC in UNAND, dan penjelasan singkat konteks halaman aktif.
* **Styling:** Latar transparan, margin bawah 24px, garis pembatas bawah tipis berwarna `#CACCD1` (AIESEC Mid Gray).

#### 2. Hero Metric Card (Dark Container - Mirip Referensi Kiri Atas)
* **Warna Latar:** Midnight Navy (`#0A2540` / `#001F3F`).
* **Warna Teks:** Angka putih (`#FFFFFF`), judul kecil berwarna AIESEC Blue muda (`#93C5FD`).
* **Fitur Utama:** Angka total pendaftaran ukuran 38px Lato Black, disertai **Mini Breakdown Table** di dalam kartu yang memisahkan volume 3 produk (GV `#F85A40`, GTa `#0A8EA0`, GTe `#F48924`) lengkap dengan perbandingan tahun lalu.
* **Border Radius:** 16px, padding 24px, bayangan halus `0 10px 15px -3px rgba(10, 37, 64, 0.2)`.

#### 3. Sparkline Metric Cards (Deretan Kartu Metrik dengan Garis Tren Mini)
* **Warna Latar:** Putih murni (`#FFFFFF`) dengan border halus `#CACCD1`.
* **Fitur Utama:** Angka metrik tebal 26px, label kecil 13px warna `#52565E`, dan grafik sparkline mini di bagian bawah kartu untuk memperlihatkan arah tren 6 bulan terakhir tanpa sumbu koordinat yang mengganggu.

#### 4. Primary Analytic Chart Container
* **Warna Latar:** Putih murni (`#FFFFFF`), sudut membulat 16px, border halus `#CACCD1`.
* **Header Kontainer:** Judul grafik tebal 16px warna `#0F172A` di kiri atas, legenda interaktif horizontal di kanan atas.
* **Garis Kisi Grafik:** Latar transparan, sumbu X tanpa garis vertikal, sumbu Y dengan garis tipis `#F3F4F7`.
* **Hover Tooltip:** Kotak informasi melayang berlatar Midnight Navy (`#0A2540`) dengan teks putih `Lato` 12px.

#### 5. Interactive Data Table Card
* **Header Tabel:** Latar `#F3F4F7` (AIESEC Light Gray), teks Lato Bold 13px warna `#52565E`, border bawah `#CACCD1`.
* **Isi Baris:** Font 13px Lato Regular, efek *zebra striping* halus, efek *hover* baris berwarna `#F0F6FF` (Ice Blue), angka rata kanan dan teks rata kiri.

---

## 5. Konfigurasi Tema Plotly Resmi (`expalens_theme`)

Seluruh visualisasi grafik Plotly pada kode Python wajib menggunakan konfigurasi tema baku berikut agar selaras dengan *AIESEC Blue Book*:

```python
import plotly.graph_objects as go
import plotly.express as px

# PALET WARNA RESMI AIESEC BLUE BOOK
AIESEC_BLUE = "#037EF3"      # Biru Utama AIESEC
DARK_TEAL = "#0A8EA0"        # Resmi: Global Talent & Perusahaan (Blue Book hal. 14)
CORAL_RED = "#F85A40"        # Resmi: Global Volunteer & NGO (Blue Book hal. 14)
TEACHER_ORANGE = "#F48924"   # Resmi: Global Teacher & Edukasi (Blue Book hal. 14)
AIESEC_TEAL = "#30C39E"      # AIESEC Teal (Blue Book hal. 14)
AIESEC_YELLOW = "#FFC845"    # Aksen Kuning (Blue Book hal. 14)

# WARNA NETRAL RESMI BLUE BOOK
CANVAS_BG = "#F3F4F7"        # Latar Utama (Blue Book hal. 14)
BORDER_GRAY = "#CACCD1"      # Garis Batas / Mid Gray (Blue Book hal. 14)
TEXT_MUTED = "#52565E"       # Teks Sekunder / Dark Gray (Blue Book hal. 14)
MIDNIGHT_NAVY = "#0A2540"    # Navy Gelap untuk Hero Card & Tooltip
HEADING_BLACK = "#0F172A"    # Teks Judul Utama

# PEMETAAN WARNA PRODUK PERTUKARAN AIESEC
PRODUCT_COLOR_MAP = {
    "GV (New)": CORAL_RED,      # #F85A40 (Global Volunteer)
    "GTa": DARK_TEAL,           # #0A8EA0 (Global Talent)
    "GTe": TEACHER_ORANGE       # #F48924 (Global Teacher)
}

# TEMA GLOBAL PLOTLY EXPALLENS
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
            titlefont=dict(size=13, color=HEADING_BLACK, family="Lato, sans-serif")
        ),
        yaxis=dict(
            showgrid=True,
            gridcolor="#EBF0F5",
            linecolor="rgba(0,0,0,0)",
            tickfont=dict(size=12, color=TEXT_MUTED, family="Lato, sans-serif"),
            titlefont=dict(size=13, color=HEADING_BLACK, family="Lato, sans-serif")
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
```

---

## 6. Blueprint Desain untuk 5 Halaman Dashboard

Menerapkan tata letak eksekutif (kolom kiri 30% + kolom kanan 70%) pada kelima halaman dashboard sesuai **Tabel 3 Milestone 2 & PRD.md**:

### 6.1 Halaman 1: Ringkasan Utama (Overview)
* **Header:** *"Welcome back, OGX Team"* | *"Tinjauan kinerja kumulatif pendaftaran program pertukaran AIESEC in UNAND periode 2021–2025."*
* **Kolom Kiri (30% Width):**
  * **Hero Dark Card (`#0A2540`):**
    * Judul: *"Total Applications"*
    * Angka Utama: `75,520` (Lato Black 38px putih)
    * Mini Breakdown Table: Volume pendaftaran per lini produk (GV: 42.150 `#F85A40` | GTa: 21.300 `#0A8EA0` | GTe: 12.070 `#F48924`).
  * **Dual KPI Cards:**
    * *YoY Growth Rate:* `+14.2%` (Badge Hijau `#10B981`)
    * *Overall Process Time:* `14.5 Hari` (Aksen AIESEC Blue `#037EF3`)
  * **No. 4: Gauge Chart:** Indikator kecepatan kelulusan (*Finish Rate %*) dengan jarum penunjuk Plotly dan zona target hijau ≥ 70%.
* **Kolom Kanan (70% Width):**
  * **No. 2: Funnel Chart (Primary Card):** *Overall Customer Funnel* bertingkat dari *Applied* hingga *Finished* berbalut warna utama AIESEC Blue (`#037EF3`).
  * **No. 3: Clustered Column Chart:** Pencapaian tahapan seleksi (*Accepted, Approved, Finished*) dikelompokkan berdasarkan warna resmi produk AIESEC (Merah GV, Dark Teal GTa, Oranye GTe).

---

### 6.2 Halaman 2: Tren Pendaftaran (Application Trends)
* **Header:** *"Application Trends & Seasonality Analysis"* | *"Analisis dinamika volume pendaftaran bulanan, komposisi status akhir, dan siklus musim puncak."*
* **Kolom Kiri (30% Width):**
  * **Hero Dark Card:** Total Pendaftar Tahun Kalender Terpilih vs Tahun Sebelumnya.
  * **No. 10: 100% Stacked Bar Chart:** Perbandingan metode pelaksanaan (*Semi-Remote vs On-site*) dan tipe durasi (*Short-term vs Long-term*).
* **Kolom Kanan (70% Width):**
  * **No. 6: Line Chart (Top Primary Card):** Garis waktu tren pendaftaran bulanan (2021–2025) menggunakan kurva *spline* halus AIESEC Blue `#037EF3` dengan penanda titik puncak (*peak markers*).
  * **No. 7 & 8 (Dual Cards):**
    * *No. 7:* Stacked Area Chart sebaran status bulanan (*Accepted, Finished, Rejected*).
    * *No. 8:* Clustered Column Chart perkembangan volume pendaftaran tahunan per produk.
  * **No. 9: Matrix Heatmap (Bottom Card):** Matriks 12 Bulan × 5 Tahun dengan skala gradasi AIESEC Blue untuk memvalidasi *Summer Peak* (Mei–Juli) dan *Winter Peak* (November–Januari).

---

### 6.3 Halaman 3: Tahapan Seleksi dan Kelulusan (Conversion Funnel)
* **Header:** *"Conversion Funnel & Operational Efficiency"* | *"Evaluasi rasio konversi peserta antartahapan dan analisis durasi waktu pemrosesan aplikasi."*
* **Top Metric Row (4 Sparkline Cards):**
  * *Avg Days to Accept* | *Avg Days to Approve* | *Avg Days to Realize* | *Avg Days to Finish*
* **Kolom Kiri (35% Width):**
  * **No. 11: Funnel Chart:** Rasio konversi antar-tahap bertingkat (*step conversion rate*) disertai angka penurunan peserta (*drop-off*).
  * **No. 13: Stacked Column Chart:** Titik terjadinya penolakan (*Pre-Accepted*, *Post-Accepted*, *Post-Approved*).
* **Kolom Kanan (65% Width):**
  * **No. 12: Clustered Bar Chart:** Rata-rata durasi hari proses per lini produk (GV vs GTa vs GTe).
  * **No. 14: Scatter Chart (Bottom Card):** Hubungan kecepatan seleksi vs volume pendaftaran antarnegara mitra tujuan (*Host MC*).

---

### 6.4 Halaman 4: Peta dan Negara Tujuan (Destinations)
* **Header:** *"Global Destinations & Entity Performance"* | *"Persebaran geografis mitra internasional dan penelusuran berjenjang komite lokal tujuan."*
* **Visual Utama (Top Wide Card - No. 15):**
  * *Choropleth Map (Plotly)* interaktif dunia dengan gradasi warna AIESEC Blue (`#037EF3`), menampilkan intensitas pendaftar ke berbagai belahan dunia.
* **Kolom Kiri (40% Width - No. 16A):**
  * *Top 10 Host MC Bar Chart:* Peringkat 10 negara mitra terfavorit asal UNAND.
* **Kolom Kanan (60% Width - No. 16B & 16C):**
  * *Host LC Drill-Down Selector & Matrix:* Pemilih negara dinamis → Tabel interaktif performa komite lokal/universitas mitra (*Host LC*) lengkap dengan rasio penyelesaian (*Finish Rate*) dan kecepatan waktu respon.

---

### 6.5 Halaman 5: Alasan Penolakan Peserta (Rejections)
* **Header:** *"Rejections Analysis & Tactical Action Engine"* | *"Identifikasi akar masalah penolakan aplikasi dan rekomendasi solusi taktis terotomatisasi."*
* **Kolom Kiri (40% Width):**
  * **No. 17: Clustered Bar Chart:** Peringkat alasan penolakan terbanyak (di luar label `'Not Rejected'`).
  * **No. 18A: Stacked Column Chart:** Sebaran alasan penolakan berdasarkan program pertukaran.
* **Kolom Kanan (60% Width):**
  * **No. 18B: Line Chart:** Fluktuasi tren penolakan bulanan dari waktu ke waktu.
  * **No. 19: Dynamic Recommendation Engine Box:**
    * Kontainer kartu Ice Blue (`#F0F6FF`) dengan border aksen AIESEC Blue (`#037EF3`).
    * Menampilkan badge: *"Top Root Cause Detected"* + Saran operasional taktis untuk tim QA & Customer Experience.

---

## 7. Injeksi Custom CSS Streamlit (`custom.css`)

Untuk menerapkan gaya visual resmi *AIESEC Blue Book* dan layout kartu eksekutif pada Streamlit:

```css
/* ========================================================
   EXPALLENS STREAMLIT THEME (AIESEC BLUE BOOK SPECIFICATION)
   ======================================================== */

/* Impor Font Resmi AIESEC: Lato dari Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400&display=swap');

/* Latar Belakang Kanvas Utama (AIESEC Light Gray #F3F4F7) */
.stApp {
    background-color: #F3F4F7;
    font-family: 'Lato', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Sidebar Styling */
section[data-testid="stSidebar"] {
    background-color: #FFFFFF;
    border-right: 1px solid #CACCD1;
}

/* Header Section */
.header-container {
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #CACCD1;
}
.header-title {
    font-size: 30px;
    font-weight: 900;
    color: #0F172A;
    margin-bottom: 4px;
    font-family: 'Lato', sans-serif;
}
.header-subtitle {
    font-size: 14px;
    color: #52565E;
    font-weight: 400;
}

/* Hero Metric Card (Midnight Navy #0A2540) */
.hero-card {
    background: linear-gradient(135deg, #0A2540 0%, #001F3F 100%);
    border-radius: 16px;
    padding: 24px;
    color: #FFFFFF;
    box-shadow: 0 10px 15px -3px rgba(10, 37, 64, 0.2);
    margin-bottom: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}
.hero-card-title {
    font-size: 13px;
    color: #93C5FD;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.hero-card-value {
    font-size: 38px;
    font-weight: 900;
    color: #FFFFFF;
    margin: 8px 0 16px 0;
    font-family: 'Lato', sans-serif;
}

/* Standard Metric Card */
.metric-card {
    background-color: #FFFFFF;
    border: 1px solid #CACCD1;
    border-radius: 14px;
    padding: 18px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px -2px rgba(3, 126, 243, 0.1);
    border-color: #037EF3;
}
.metric-card-label {
    font-size: 13px;
    color: #52565E;
    font-weight: 700;
}
.metric-card-num {
    font-size: 26px;
    font-weight: 900;
    color: #0F172A;
    margin-top: 4px;
    font-family: 'Lato', sans-serif;
}

/* Card Visual Container untuk Grafik Plotly */
.chart-container {
    background-color: #FFFFFF;
    border: 1px solid #CACCD1;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.03);
}
.chart-title {
    font-size: 16px;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 12px;
    font-family: 'Lato', sans-serif;
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
    font-family: 'Lato', sans-serif;
}
.action-box-desc {
    font-size: 13px;
    color: #334155;
    line-height: 1.5;
}
```

---

## 8. Panduan Verifikasi Desain (Blue Book Checklist)

Sebelum merilis antarmuka dashboard, pastikan seluruh kriteria berikut terpenuhi:
* [x] **Warna Primer:** Menggunakan **AIESEC Blue (`#037EF3`)** sebagai aksen visual utama.
* [x] **Warna Produk Sesuai Blue Book:**
  * Global Volunteer (GV): **`#F85A40`** (AIESEC Red/Orange)
  * Global Talent (GTa): **`#0A8EA0`** (AIESEC Dark Teal - resmi untuk program magang & korporat)
  * Global Teacher (GTe): **`#F48924`** (AIESEC Orange)
* [x] **Warna Netral Sesuai Blue Book:**
  * Latar Aplikasi: **`#F3F4F7`** (AIESEC Light Gray)
  * Garis Batas / Border: **`#CACCD1`** (AIESEC Mid Gray)
  * Teks Deskriptif: **`#52565E`** (AIESEC Dark Gray)
* [x] **Tipografi:** Wajib menggunakan keluarga font **Lato** (`Lato Light`, `Regular`, `Bold`, `Black`).
* [x] **Layout Eksekutif:** Memadukan Hero Card gelap (`#0A2540`) dengan kartu-kartu visualisasi putih membulat (`border-radius: 14px–16px`).
* [x] **Format Bersih:** Bebas dari error LaTeX math mode (`'_' allowed only in math mode`).

---
*Dokumen DESIGN.md ini menjadi rujukan visual resmi berstandar AIESEC Blue Book untuk pengembangan front-end ExpaLens.*
