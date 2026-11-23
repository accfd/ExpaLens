# Product Requirements Document (PRD): ExpaLens

**Sistem Business Intelligence & Analytics Kinerja Outgoing Exchange**  
**Organisasi:** AIESEC in Universitas Andalas (UNAND)  
**Departemen:** Outgoing Exchange (OGX)  
**Versi Dokumen:** 1.0  
**Tanggal:** 23 November 2026  
**Status:** Baseline Reference Architecture & Technical Specification  

---

## 1. Ringkasan Produk (ExpaLens)

### 1.1 Identitas & Deskripsi Produk
* **Nama Sistem:** **ExpaLens** (*Expa Analytics & Performance Lens*)
* **Definisi Singkat:** Platform *Business Intelligence* (BI) analitik berbasis web yang dirancang khusus untuk mengolah, menganalisis, dan memvisualisasikan data historis pendaftaran peserta pertukaran internasional dari sistem CRM Expa AIESEC. ExpaLens mentransformasi puluhan ribu baris data transaksional mentah menjadi wawasan strategis interaktif menggunakan arsitektur modern berbasis Python (*Pandas*, *NumPy*, *SQLAlchemy*, *Psycopg2*), Data Mart PostgreSQL (*Star Schema*), serta antarmuka web interaktif berbasis *Streamlit* dan *Plotly*.

### 1.2 Latar Belakang Masalah (Problem Statement)
Departemen Outgoing Exchange (OGX) AIESEC in UNAND bertanggung jawab memfasilitasi pemuda dan mahasiswa Universitas Andalas untuk mengikuti program pertukaran dan magang global, yang terbagi dalam tiga produk utama:
1. **Global Volunteer (GV):** Program kerelawanan sosial berdampak berbasis *Sustainable Development Goals* (SDGs).
2. **Global Talent (GTa):** Program magang profesional di perusahaan dan korporasi global.
3. **Global Teacher (GTe):** Program magang pengajaran bahasa dan pendidikan formal di institusi internasional.

Seluruh data pendaftaran dan interaksi peserta (*Exchange Participants* / EP) dicatat dalam sistem CRM global AIESEC bernama **Expa**. Namun, CRM Expa dirancang murni untuk kebutuhan operasional transaksional harian, bukan untuk kebutuhan pelaporan analitik strategis. Hal ini menimbulkan tantangan operasional yang signifikan:
* **Pelaporan Manual yang Tidak Efisien:** Pengurus departemen harus mengunduh berkas CSV mentah berisi >115.000 baris, kemudian membuka dan mengolahnya secara manual di Microsoft Excel atau Google Sheets. Proses ini memakan waktu 3–5 hari kerja setiap periode pelaporan berkala.
* **Tingginya Risiko Human Error:** Pembersihan data manual, inkonsistensi rumus spreadsheet, dan tidak adanya standarisasi perhitungan menghasilkan laporan yang rentan bias dan duplikasi.
* **Ketiadaan Visibilitas Kecepatan Seleksi (*Bottleneck*):** Sistem CRM Expa tidak mengkalkulasi durasi waktu perpindahan peserta antartahapan (*days to convert*). Akibatnya, tim manajemen tidak dapat mendeteksi tahapan seleksi mana yang mengalami hambatan atau keterlambatan pemrosesan.
* **Kurangnya Wawasan Pola Penolakan (*Rejection Blind Spot*):** Tidak ada pelaporan terstruktur mengenai penyebab utama penolakan aplikasi oleh entitas luar negeri (*Host LC*), sehingga pengurus terlambat memitigasi kendala peserta (misalnya kendala visa, ketidakcocokan profil, atau keterlambatan respons).

### 1.3 Tujuan Utama Sistem (Objectives & Scope)
ExpaLens dibangun untuk memecahkan kendala di atas dengan menghadirkan:
1. **Automated End-to-End Data Pipeline:** Pipeline ETL terotomatisasi yang mengekstraksi data mentah Expa, melakukan pembersihan data (*cleansing triage*), menangani *noise*, serta memuat data ke Data Mart secara konsisten.
2. **Centralized Dimensional Data Mart:** Penyimpanan data terpusat pada basis data PostgreSQL (`aiesec_dw`) dengan model *Star Schema* (pendekatan Ralph Kimball) untuk menjamin integritas data, kueri cepat, dan efisiensi analitik.
3. **Interactive Multi-page BI Web Application:** Dashboard interaktif 5 halaman berbasis *Streamlit* dan visualisasi dinamis *Plotly* yang terhubung langsung ke PostgreSQL tanpa ketergantungan pada lisensi perangkat lunak berbayar (*free & open-source stack*).
4. **Data-Driven Decision Making:** Memberikan visibilitas menyeluruh terhadap performa program, konversi *funnel*, kecepatan proses, persebaran geografis, serta rekomendasi tindakan preventif berbasis alasan penolakan.

---

## 2. Pengguna & Kebutuhan Bisnis

Sistem ExpaLens dirancang untuk melayani tiga peran fungsional utama di Departemen Outgoing Exchange AIESEC in UNAND:

```
+------------------------------------------------------------------------------------+
|                                 PENGGUNA EXPALLENS                                 |
+------------------------------------+-----------------------------------------------+
| Peran                              | Fokus & Tanggung Jawab                        |
+------------------------------------+-----------------------------------------------+
| 1. LCVP Outgoing Exchange          | Performa makro, pencapaian target, tren YoY   |
| 2. Manajer Program (GV, GTa, GTe)  | Eksekusi program, preferensi durasi & metode  |
| 3. Tim QA & Customer Experience    | Kelancaran funnel, bottleneck durasi, reject  |
+------------------------------------+-----------------------------------------------+
```

### 2.1 Matriks Peran, Pertanyaan Bisnis, dan Indikator Kinerja Utama (KPI)

| Peran Pengguna | Pertanyaan Bisnis Utama | Informasi yang Dibutuhkan | Key Performance Indicators (KPI) Utama |
| :--- | :--- | :--- | :--- |
| **Local Committee Vice President (LCVP) OGX** | 1. Bagaimana performa pendaftaran secara keseluruhan, dan apakah bertumbuh dibandingkan tahun lalu (YoY)?<br>2. Program mana di antara GV, GTa, dan GTe yang memiliki tingkat penyelesaian terbaik?<br>3. Kapan periode puncak (*peak season*) pendaftaran terjadi untuk alokasi sumber daya promosi? | • Jumlah seluruh pendaftar kumulatif.<br>• Rekapitulasi peserta di tiap tahap funnel.<br>• Tren pertumbuhan pendaftaran tahunan.<br>• Persentase keberhasilan per program.<br>• Indeks musiman pendaftaran bulanan. | • **Total Applications** (Volume Pendaftaran)<br>• **YoY Growth Rate (%)** (Pertumbuhan Tahunan)<br>• **Program Finish Rate (%)** ($\text{Finished} \div \text{Accepted}$)<br>• **Overall Avg Process Time** (Rata-rata Durasi Hari)<br>• **Seasonal Peak Index** (Summer & Winter Peak Volume) |
| **Manajer Program Pertukaran (GV, GTa, GTe)** | 1. Berapa kontribusi volume pendaftaran masing-masing program terhadap total aplikasi?<br>2. Apakah peserta lebih meminati metode pelaksanaan *Semi-Remote* atau *On-site*?<br>3. Apakah tren durasi program condong ke *Short-term* atau *Long-term*?<br>4. Negara mana yang paling banyak diminati pendaftar program tertentu? | • Komposisi pendaftaran per produk (GV, GTa, GTe).<br>• Sebaran metode pelaksanaan (*is_remote*).<br>• Sebaran durasi program (*duration_type*).<br>• Matriks negara tujuan berdasarkan produk. | • **Applications per Program** (Volume per Produk)<br>• **Remote vs On-site Ratio (%)**<br>• **Short-term vs Long-term Ratio (%)**<br>• **Product Conversion Rate (%)** |
| **Tim Quality Assurance & Customer Experience (QA & CX)** | 1. Seberapa lancar peserta berpindah antar tahapan (*Applied* $\rightarrow$ *Finished*), dan di mana titik penurunan terbesar (*drop-off*)?<br>2. Berapa rata-rata lama waktu pemrosesan pada masing-masing tahapan seleksi?<br>3. Negara atau *Host LC* mana yang memiliki waktu proses tercepat vs terlambat?<br>4. Apa alasan penolakan yang paling sering terjadi, dan perbaikan operasional apa yang perlu segera dilakukan? | • Persentase konversi tiap tahapan *customer funnel*.<br>• Rata-rata hari pada tahapan *Accept*, *Approve*, *Realize*, *Finish*, dan *Reject*.<br>• Hubungan volume vs kecepatan proses per negara mitra.<br>• Peringkat alasan penolakan dan tren bulanannya.<br>• Rekomendasi tindakan dinamis. | • **Funnel Stage Conversion Rate (%)** (App-to-Acc, Acc-to-Appr, Appr-to-Real, Real-to-Fin)<br>• **Average Days to Convert** (`days_to_accept`, `days_to_approve`, `days_to_realize`, `days_to_finish`, `days_to_reject`)<br>• **Country Avg Process Speed (Days)**<br>• **Top Rejection Reasons Count & Share (%)**<br>• **Rejection Rate by Stage (%)** |

---

## 3. Arsitektur & Infrastruktur Teknis

ExpaLens mengadopsi arsitektur *Business Intelligence modern berbasis kode* (**Code-First & Fully Open-Source**) yang meniadakan ketergantungan pada alat visualisasi komersial berlisensi tertutup seperti Power BI. Arsitektur ini menjamin portabilitas, keamanan data, fleksibilitas integrasi, dan biaya implementasi nol rupiah ($0 software license).

### 3.1 Diagram Alur Data Arsitektur (End-to-End Workflow)

```
[Sumber Data Mentah]
  CRM Expa AIESEC Global (Export: Data Compile Final.csv / Data Compile.xlsx)
  - 115.537 baris x 39 kolom
              │
              ▼
[Pipeline ETL Python (Google Colab / Local Script)]
  ├── Ekstraksi: Pandas, NumPy
  ├── Transformasi:
  │     ├── Filter Entitas: Home LC = 'UNAND' & Home MC = 'INDONESIA'
  │     ├── Eliminasi Atribut Tak Relevan (Drop 13-19 kolom)
  │     ├── Noise Handling: Hapus pendaftaran tanpa progres & Status 'open'
  │     ├── Standardisasi Teks: str.strip() pada seluruh kolom string
  │     ├── Standardisasi Waktu: Ekstraksi tanggal murni (date-only)
  │     ├── Feature Engineering: Indikator funnel (is_*) & Durasi hari (days_to_*)
  │     └── Pemetaan Dimensi & Foreign Key (Surrogate Key generation)
  └── Pemuatan (Load): SQLAlchemy + Psycopg2 Engine
              │
              ▼
[Data Mart Terpusat: PostgreSQL (aiesec_dw)]
  Penyimpanan Relasional Berbasis Star Schema (Ralph Kimball Approach):
  ├── fact_exchange_application (75.520 transaksi bersih)
  ├── dim_participant (3.703 / 3.704 entitas pendaftar unik)
  ├── dim_host (491 komite lokal / universitas mitra)
  ├── dim_product (3 program: GV (New), GTa, GTe)
  ├── dim_rejection_reason (13 kategori alasan penolakan)
  └── dim_date (2.557 hari kalender kontinu 2020–2026)
              │
              ▼
[Lapisan Antarmuka & Analitik: Streamlit + Plotly]
  Aplikasi Web Interaktif Multi-halaman (Port 8501):
  ├── Database Connection Caching: @st.cache_resource & @st.cache_data
  ├── Global Slicers: Filter Tahun, Produk, Negara, Host LC, Status
  └── 5 Halaman Dashboard Interaktif Plotly:
        1. Overview (Ringkasan Utama & Pertumbuhan YoY)
        2. Application Trends (Tren Pendaftaran, Status, & Seasonality)
        3. Conversion Funnel (Rasio Konversi, Durasi Proses, & Scatter Matrix)
        4. Destinations (Choropleth Map Global & Drill-Down Host LC)
        5. Rejections (Analisis Penolakan & Rekomendasi Tindakan Dinamis)
```

### 3.2 Pemilihan Teknologi & Alasan Tanpa Power BI

| Komponen Arsitektur | Teknologi Terpilih | Justifikasi Teknis & Keunggulan Dibandingkan Power BI |
| :--- | :--- | :--- |
| **Bahasa Pemrograman** | Python 3.10+ | Standar industri analitik data, ekosistem pustaka lengkap, kemampuan manipulasi data tak terbatas melalui skrip modular. |
| **ETL & Data Wrangling** | *Pandas*, *NumPy* | Mampu memproses 115.000+ baris data mentah dalam hitungan detik di memori; penanganan vektorisasi tanggal dan kalkulasi hari yang cepat. |
| **Database Connector** | *SQLAlchemy*, *Psycopg2* | *Object Relational Engine* yang aman, mendukung koneksi *connection pool*, transaksi ACID, serta pemuatan *bulk loading* per batch (*chunksize=2000* s/d *5000*). |
| **Penyimpanan Data Mart** | *PostgreSQL 15+* (`aiesec_dw`) | RDBMS open-source tangguh dengan performa indexing tinggi, dukungan kueri analitik relasional kompleks, serta kompatibel penuh dengan berbagai sistem operasional. |
| **Framework Dashboard Web** | *Streamlit* | **Menggantikan Power BI Desktop & Power BI Service.** Meniadakan lisensi berbayar (Power BI Pro), bebas dari keterbatasan komputasi cloud proprietary Microsoft, mendukung kustomisasi layout berbasis Python murni, mudah di-deploy via Docker/VPS/Localhost. |
| **Mesin Visualisasi** | *Plotly Graph Objects & Express* | **Menggantikan Visual Native Power BI & DAX.** Menghasilkan visualisasi HTML5 interaktif (hover, zoom, pan, tooltip dinamis), peta koroplet global akurat berbasis ISO-3, funnel charts responsif, serta styling visual modern yang konsisten. |

---

## 4. Spesifikasi Data Mart & ETL

### 4.1 Ringkasan Aturan Pembersihan & Transformasi Data
Berdasarkan dokumen Milestone 3 (Tabel 4.12) dan implementasi pada `Pipeline_ETL.ipynb`, transformasi data mengikuti 14 tahapan baku:
1. **Pembersihan Spasi Nama Kolom:** Menghapus *leading/trailing whitespace* pada seluruh nama kolom dataset mentah menggunakan `df.columns.str.strip()`.
2. **Penyaringan Entitas Internal:** Memfilter baris agar hanya mencakup `Home LC == 'UNAND'` dan `Home MC == 'INDONESIA'`.
3. **Reduksi Kolom Tidak Relevan:** Menghapus 13–19 kolom atribut pelengkap yang tidak memiliki nilai analitik (antara lain: parameter UTM, `SDG Goal`, `SDG Target`, `Slot Name`, `Slot Start Date`, `Slot End Date`, `Campaign ID`, `Tags`, `Branch Name`, `Created At`, `Updated At`, `Backgrounds`, `Skills`, `Languages`, `Nationalities`).
4. **Pembersihan Spasi Nilai String:** Menerapkan fungsi `.str.strip()` pada seluruh kolom bertipe data teks/object untuk menstandarisasi variasi penulisan.
5. **Penanganan Baris Tanpa Progres Lanjutan:** Menghapus rekaman aplikasi yang tidak memiliki tanggal pada ketiga kolom kunci secara bersamaan (`Date Approved`, `Date Accepted`, dan `Date Rejected` semuanya *null/empty*), yang mengindikasikan aplikasi terbengkalai tanpa interaksi lanjutan.
6. **Eliminasi Aplikasi Berstatus 'open':** Menghapus aplikasi dengan status `open` karena proses seleksinya belum selesai sehingga belum dapat diukur hasil akhirnya.
7. **Standarisasi Kolom Tanggal (Date-Only Extraction):** Mengonversi kolom waktu (`Date Applied`, `Date Accepted`, `Date Approved`, `Date Realized`, `Date Finished`, `Date Rejected`) menjadi format tanggal standar tanpa komponen jam-menit-detik (`.dt.date`).
8. **Pembentukan Indikator Biner Funnel (*is_\**):**
   * `is_applied = 1` (seluruh transaksi masuk tahap pendaftaran)
   * `is_accepted = 1` jika `Date Accepted` terisi, selain itu `0`
   * `is_approved = 1` jika `Date Approved` terisi, selain itu `0`
   * `is_realized = 1` jika `Date Realized` terisi, selain itu `0`
   * `is_finished = 1` jika `Date Finished` terisi, selain itu `0`
   * `is_rejected = 1` jika `Date Rejected` terisi, selain itu `0`
9. **Kalkulasi Metrik Durasi Tahapan (*days_to_\**):**
   * $\text{days\_to\_accept} = \text{Date Accepted} - \text{Date Applied}$
   * $\text{days\_to\_approve} = \text{Date Approved} - \text{Date Accepted}$
   * $\text{days\_to\_realize} = \text{Date Approved} - \text{Date Realized}$ (atau sebaliknya sesuai kelogisan selisih hari $\ge 0$)
   * $\text{days\_to\_finish} = \text{Date Finished} - \text{Date Realized}$
   * $\text{days\_to\_reject} = \text{Date Rejected} - \text{Date Applied}$  
   *(Catatan: Nilai selisih negatif atau null akibat tanggal tidak lengkap diset menjadi `None`/`NULL`).*
10. **Standarisasi Kategori Remote:** Menilai kolom `Semi-Remote OP` untuk menghasilkan flag boolean `is_remote` (`True` jika memuat kata "remote", selain itu `False`).
11. **Imputasi Nilai Alasan Penolakan:** Nilai kosong (*null/NaN*) pada kolom `Rejection reason` diisi (*imputed*) dengan teks standar `'Not Rejected'` untuk aplikasi yang diterima/lolos.
12. **Konstruksi Dimensi & Surrogate Key:** Membentuk 5 tabel dimensi unik dengan kunci primer terisolasi.
13. **Relasi Foreign Key:** Memetakan foreign key pada data transaksi menggunakan ID dimensi yang telah terbentuk (`product_id`, `reason_id`, `applied_date_id`).
14. **Deduplikasi & Validasi Kunci Primer:** Memastikan kolom `apl_id` unik dan tidak bernilai kosong (*null*).

### 4.2 Struktur Tabel Star Schema Data Mart (`aiesec_dw`)

```
                          +------------------------+
                          |        dim_date        |
                          +------------------------+
                          | PK: date_id (INT/DATE) |
                          | full_date              |
                          | day, week, month       |
                          | quarter, year          |
                          | month_name, day_of_week|
                          | is_weekend             |
                          +-----------+------------+
                                      │ 1
                                      │
                                      │ * (applied_date_id)
+-----------------------+     +-------▼-------------------------+     +--------------------------+
|    dim_participant    |     |    fact_exchange_application   |     |         dim_host         |
+-----------------------+     +---------------------------------+     +--------------------------+
| PK: ep_id (VARCHAR)   |1   *| PK: apl_id (BIGINT)             |*   1| PK: host_lc (VARCHAR)    |
| home_lc               ├─────┤ FK: ep_id (VARCHAR)             ├─────┤ host_mc                  |
| home_mc               |     | FK: host_lc (VARCHAR)           |     | host_region              |
| home_region           |     | FK: product_id (INT)            |     +--------------------------+
+-----------------------+     | FK: reason_id (INT)             |
                              | FK: applied_date_id (INT/DATE)  |
                              | status                          |
                              | is_applied, is_accepted, ...    |
                              | days_to_accept, days_to_appr... |
                              +-------▲-------------------------+
                                      │ *
                                      │
                        +-------------┴-------------+
                        │ 1                         │ 1
              +---------┴----------+      +---------┴--------------+
              |     dim_product    |      |  dim_rejection_reason  |
              +--------------------+      +------------------------+
              | PK: product_id     |      | PK: reason_id (INT)    |
              | product_name       |      | reason_text            |
              | duration_type      |      +------------------------+
              +--------------------+
```

#### Spesifikasi Detail 5 Tabel Dimensi & 1 Tabel Fakta

| Nama Tabel | Tipe | Kunci Primer (PK) | Atribut Lainnya | Deskripsi & Target Data |
| :--- | :--- | :--- | :--- | :--- |
| **`dim_participant`** | Dimensi | `ep_id` (VARCHAR) | `home_lc`, `home_mc`, `home_region` | Menyimpan profil peserta unik asal UNAND Indonesia. Target: **3.703 – 3.704 baris**. |
| **`dim_host`** | Dimensi | `host_lc` (VARCHAR) | `host_mc`, `host_region` | Menyimpan entitas komite lokal dan negara tujuan pertukaran di seluruh dunia. Target: **491 baris**. |
| **`dim_product`** | Dimensi | `product_id` (INT) / `product` | `product_name`, `duration_type` | Menyimpan kategori program pertukaran: GV (New), GTa, dan GTe. Target: **3 baris**. |
| **`dim_rejection_reason`** | Dimensi | `reason_id` (INT/SERIAL) | `reason_text` | Menyimpan taksonomi alasan penolakan aplikasi (termasuk label 'Not Rejected'). Target: **13 kategori** (atau 12 alasan penolakan murni). |
| **`dim_date`** | Dimensi | `date_id` (INT YYYYMMDD / DATE) | `full_date`, `day`, `week`, `month`, `quarter`, `year`, `month_name`, `day_of_week`, `is_weekend` | Kalender harian kontinu dari 1 Januari 2020 s/d 31 Desember 2026. Target: **2.557 baris**. |
| **`fact_exchange_application`** | Fakta | `apl_id` (BIGINT) | `ep_id`, `host_lc`, `product_id`, `reason_id`, `applied_date_id`, `status`, `is_applied`, `is_accepted`, `is_approved`, `is_realized`, `is_finished`, `is_rejected`, `days_to_accept`, `days_to_approve`, `days_to_realize`, `days_to_finish`, `days_to_reject` | Menyimpan setiap transaksi aplikasi pertukaran individual beserta metrik biner tahapan dan durasi hari. Target: **75.520 – 75.522 baris**. |

### 4.3 Catatan Rekonsiliasi & Penyelarasan Notebook vs Dokumen Milestone
Terdapat beberapa perbedaan minor antara naskah Milestone 2–3 dengan kode implementasi di `Pipeline_ETL.ipynb`. PRD ini menetapkan standardisasi resmi untuk implementasi aplikasi Streamlit:
1. **Jumlah Baris Tabel Fakta:**
   * *Naskah Milestone:* Menyebutkan **75.522 baris**.
   * *Output Notebook Colab:* Menghasilkan **75.520 baris** (selisih 2 baris akibat variasi penanganan null string `'nan'` vs `np.nan` pada filter baris tanpa progres: 39.986 vs 39.988 baris dibuang).
   * *Ketentuan:* Rentang **75.520 – 75.522 baris** dinyatakan **VALID & IDENTIK SECARA ANALITIK** (tingkat presisi >99,997%).
2. **Jumlah Baris `dim_participant`:**
   * *Naskah Milestone:* Menyebutkan **3.704 peserta**.
   * *Output Notebook:* Menghasilkan **3.703 peserta** (selisih 1 peserta karena 2 baris fakta yang tereliminasi di notebook). Keduanya berada dalam toleransi target resmi naskah (~3.695 – 3.704).
3. **Kunci Primer `dim_product`:**
   * *Milestone 3 (Tabel 4.6):* Menggunakan teks string `product` (`VARCHAR(50)`) sebagai PK.
   * *Notebook ETL:* Menggunakan integer surrogate key `product_id` (1, 2, 3) dan atribut `product_name` (`GV (New)`, `GTa`, `GTe`).
   * *Ketentuan Standar:* Mengadopsi pendekatan Notebook (`product_id` INTEGER), karena penggunaan integer ID lebih efisien dalam performa *join* di PostgreSQL dan pemodelan dimensional Kimball.
4. **Kunci Tanggal `dim_date` & Tabel Fakta:**
   * *Milestone 3:* Menyebutkan format `DATE` murni (`YYYY-MM-DD`).
   * *Notebook ETL:* Membentuk integer `date_id` berformat integer `YYYYMMDD` (misal: `20210515`) pada `dim_date` dan `applied_date_id` pada tabel fakta, serta menyediakan kolom `full_date` bertipe `DATE`.
   * *Ketentuan Standar:* Penggunaan integer `YYYYMMDD` adalah *best-practice* standar industri data warehouse untuk kunci surrogate tanggal karena mengoptimalkan partisi dan indeks basis data.
5. **Jumlah Kategori Alasan Penolakan (`dim_rejection_reason`):**
   * *Naskah Milestone:* Menyebutkan **12 alasan**.
   * *Notebook Colab:* Menghasilkan **13 record**, karena mencakup 12 alasan penolakan eksplisit ditambah 1 kategori penanda keberhasilan yaitu `'Not Rejected'`.
   * *Ketentuan Standar:* Tetap menggunakan **13 record** agar integritas referensial tabel fakta tidak melanggar batasan relasi (*foreign key constraint*) bagi peserta yang tidak pernah ditolak.

---

## 5. Spesifikasi 5 Halaman Dashboard (Sesuai Bab 4.3.4 Milestone 2)

Aplikasi dashboard ExpaLens dibangun menggunakan struktur *multi-page app* Streamlit dengan pustaka grafik interaktif *Plotly*. Seluruh halaman dilengkapi dengan filter global dinamis yang diletakkan pada bilah samping (*Sidebar*).

### 5.1 Komponen Bilah Sisi (Global Sidebar Filters)
Bilah samping memuat filter global yang terhubung secara reaktif ke kueri data:
* **Rentang Tahun (Year Filter):** Multiselect tahun (2021, 2022, 2023, 2024, 2025). Default: *Select All*.
* **Program Pertukaran (Product Filter):** Multiselect program (`GV (New)`, `GTa`, `GTe`). Default: *Select All*.
* **Kawasan Global (Host Region Filter):** Multiselect kawasan benua tujuan (Asia Pacific, Europe, Americas, MEA).
* **Negara Tujuan (Host MC Filter):** Multiselect negara mitra tujuan. Opsi disaring dinamis berdasarkan kawasan yang dipilih.
* **Status Aplikasi (Status Filter):** Multiselect status akhir (*accepted*, *approved*, *finished*, *rejected*).

---

### 5.2 Halaman 1: Ringkasan Utama (Overview)
* **Tujuan Halaman:** Memberikan visibilitas instan kepada LCVP dan jajaran pimpinan mengenai kesehatan operasional program OGX secara agregat, tren pertumbuhan pendaftaran, serta persentase penyelesaian akhir.

```
+------------------------------------------------------------------------------------+
|                               HALAMAN 1: OVERVIEW                                  |
+------------------------------------------------------------------------------------+
| [KPI Cards]                                                                        |
| Total Applications | Total Accepted | Total Finished | Finish Rate | YoY Growth    |
+----------------------------------+-------------------------------------------------+
| [Visual 1: Funnel Chart]         | [Visual 2: Clustered Column Chart]              |
| Overall Customer Funnel Progress | Stage Achievement by Product (GV, GTa, GTe)    |
| (Applied -> Finished)            |                                                 |
+----------------------------------+-------------------------------------------------+
| [Visual 3: Gauge Chart]                                                            |
| Program Finish Rate (%) Gauge (Finished ÷ Accepted) with target benchmark          |
+------------------------------------------------------------------------------------+
```

* **Rincian Metrik & Komponen Visual:**
  1. **Top KPI Scorecard Cards (`st.metric`):**
     * *Total Applications:* Total pendaftaran (`COUNT(apl_id)`).
     * *Accepted Participants:* Total peserta diterima (`SUM(is_accepted)`).
     * *Approved Participants:* Total dokumen disetujui (`SUM(is_approved)`).
     * *Finished Participants:* Total alumni program (`SUM(is_finished)`).
     * *Overall Finish Rate (%):* Rasio kelulusan ($\sum \text{is\_finished} \div \sum \text{is\_accepted} \times 100\%$).
     * *YoY Application Growth (%):* Persentase kenaikan/penurunan pendaftaran dibanding tahun kalender sebelumnya.
  2. **Visual 1: Overall Customer Funnel Chart (Plotly `go.Funnel`):**
     * Menampilkan volume peserta dan persentase retensi kumulatif dari tahap *Applied* (100%) $\rightarrow$ *Accepted* $\rightarrow$ *Approved* $\rightarrow$ *Realized* $\rightarrow$ *Finished*.
     * Menampilkan jumlah peserta yang gugur/tereliminasi pada setiap transisi tahapan.
  3. **Visual 2: Clustered Column Chart - Capaian Tahapan per Program (Plotly `px.bar` barmode='group'):**
     * Sumbu X: Jenis Produk (`GV (New)`, `GTa`, `GTe`).
     * Sumbu Y: Jumlah Peserta.
     * Bar Series: *Accepted*, *Approved*, *Finished*.
  4. **Visual 3: Finish Rate Gauge Chart (Plotly `go.Indicator` gauge):**
     * Menampilkan jarum speedometer performa penyelesaian program dengan skala 0–100%, dilengkapi ambang batas target organisasi (hijau $\ge 70\%$, kuning $50-69\%$, merah $<50\%$).
* **Perilaku Dinamis:**
  * Bila pengguna memilih satu program tertentu pada filter, seluruh kartu KPI dan Funnel Chart otomatis menghitung ulang nilai khusus program tersebut.

---

### 5.3 Halaman 2: Tren Pendaftaran (Application Trends)
* **Tujuan Halaman:** Menganalisis dinamika volume pendaftaran peserta dari waktu ke waktu, mendeteksi pola musiman (*summer peak* & *winter peak*), serta mengevaluasi preferensi metode program (*remote vs on-site*).

```
+------------------------------------------------------------------------------------+
|                         HALAMAN 2: APPLICATION TRENDS                              |
+------------------------------------------------------------------------------------+
| [Visual 1: Monthly Trend Line Chart]                                               |
| Perkembangan Jumlah Aplikasi Pendaftaran Tiap Bulan (2021-2025)                    |
+----------------------------------+-------------------------------------------------+
| [Visual 2: Stacked Area Chart]   | [Visual 3: Grouped Bar Chart]                   |
| Komposisi Status Bulanan         | Tren Tahunan Volume per Program                 |
| (Accepted, Finished, Rejected)   | (GV, GTa, GTe per Tahun)                        |
+----------------------------------+-------------------------------------------------+
| [Visual 4: Seasonality Heatmap]  | [Visual 5: 100% Stacked Bar Chart]              |
| Matriks Bulan vs Tahun           | Preferensi Durasi & Pelaksanaan                 |
| (Intensitas Warna Aplikasi)      | (Remote vs On-site & Short vs Long-term)        |
+------------------------------------------------------------------------------------+
```

* **Rincian Metrik & Komponen Visual:**
  1. **Visual 1: Monthly Application Volume Line Chart (Plotly `px.line`):**
     * Sumbu X: Garis waktu berkesinambungan (Tahun-Bulan).
     * Sumbu Y: Jumlah Pendaftaran (`apl_id`).
     * Dilengkapi garis rata-rata bulanan dan penanda titik lonjakan (*peak markers*).
  2. **Visual 2: Monthly Funnel Status Composition Stacked Area Chart (Plotly `px.area`):**
     * Menampilkan volume bulanan yang terbagi secara proporsional berdasarkan tiga status akhir: *Accepted*, *Finished*, dan *Rejected*.
  3. **Visual 3: Yearly Product Growth Clustered Column Chart (Plotly `px.bar`):**
     * Sumbu X: Tahun (2021–2025).
     * Sumbu Y: Volume Aplikasi.
     * Kelompok Bar: Produk GV, GTa, GTe untuk melihat tren pergeseran minat produk antar-tahun.
  4. **Visual 4: Seasonality Application Heatmap Matrix (Plotly `go.Heatmap`):**
     * Sumbu X: Bulan kalender (Januari s/d Desember).
     * Sumbu Y: Tahun (2021 s/d 2025).
     * Skala Warna (Color Scale): Mengindikasikan intensitas kepadatan aplikasi. Visual ini memvalidasi periode *Summer Peak* (Mei–Juli) dan *Winter Peak* (November–Januari).
  5. **Visual 5: Program Execution & Duration 100% Stacked Bar Chart (Plotly `px.bar` barmode='relative'):**
     * Menampilkan proporsi persentase peserta yang memilih metode *Semi-Remote* vs *On-site*, serta tipe durasi *Short-term* vs *Long-term* di tiap lini produk.

---

### 5.4 Halaman 3: Tahapan Seleksi & Kelulusan (Conversion Funnel)
* **Tujuan Halaman:** Mengidentifikasi titik kebocoran seleksi (*funnel leakages*), mengukur efisiensi durasi waktu pemrosesan (*process speed*), serta menemukan anomali durasi pada negara tertentu.

```
+------------------------------------------------------------------------------------+
|                          HALAMAN 3: CONVERSION FUNNEL                              |
+------------------------------------------------------------------------------------+
| [KPI Cards: Average Conversion Times]                                              |
| Avg Days to Accept | Avg Days to Approve | Avg Days to Realize | Avg Days to Finish|
+----------------------------------+-------------------------------------------------+
| [Visual 1: Step-by-Step Funnel]  | [Visual 2: Clustered Horizontal Bar Chart]      |
| Conversion Rate Antartahapan     | Rata-rata Durasi Hari per Tahapan & per Program |
| (Drop-off Rate di Setiap Tahap)  | (Days to Accept/Approve/Realize/Finish/Reject)  |
+----------------------------------+-------------------------------------------------+
| [Visual 3: Rejection Stage Stacked Bar]                                            |
| Titik Terjadinya Penolakan (Pre-Accepted, Post-Accepted, Post-Approved)            |
+------------------------------------------------------------------------------------+
| [Visual 4: Country Process Speed vs Application Volume Scatter Plot]               |
| Sumbu X: Rata-rata Hari Pemrosesan | Sumbu Y: Total Aplikasi | Bubble: Host MC     |
+------------------------------------------------------------------------------------+
```

* **Rincian Metrik & Komponen Visual:**
  1. **Top Metric Cards - Rata-rata Durasi Proses (`st.metric`):**
     * *Avg Days to Accept:* Rata-rata hari dari *Applied* ke *Accepted*.
     * *Avg Days to Approve:* Rata-rata hari penyelesaian berkas administrasi.
     * *Avg Days to Realize:* Rata-rata masa tunggu keberangkatan ke luar negeri.
     * *Avg Days to Finish:* Rata-rata durasi aktual pelaksanaan proyek hingga kepulangan.
     * *Avg Days to Reject:* Rata-rata hari hingga diterbitkannya surat penolakan.
  2. **Visual 1: Funnel Conversion & Drop-off Chart (Plotly `go.Funnel`):**
     * Menghitung rasio konversi antar-tahap langsung (*step conversion rate*):
       * $\text{App-to-Acc} = \text{Accepted} \div \text{Applied}$
       * $\text{Acc-to-Appr} = \text{Approved} \div \text{Accepted}$
       * $\text{Appr-to-Real} = \text{Realized} \div \text{Approved}$
       * $\text{Real-to-Fin} = \text{Finished} \div \text{Realized}$
  3. **Visual 2: Average Process Time by Product Clustered Bar Chart (Plotly `px.bar`):**
     * Membandingkan durasi rata-rata hari pada masing-masing tahapan untuk mengevaluasi apakah program GTa/GTe (profesional/pengajar) membutuhkan waktu verifikasi berkas lebih lama dibandingkan GV (volunteer).
  4. **Visual 3: Rejection Stage Analysis Stacked Column Chart (Plotly `px.bar`):**
     * Mengelompokkan waktu penolakan aplikasi:
       * *Stage 1 Rejection (Pre-Accepted):* Ditolak sebelum sempat diterima seleksi awal.
       * *Stage 2 Rejection (Post-Accepted):* Ditolak setelah diterima (gagal berkas/wawancara lanjut).
       * *Stage 3 Rejection (Post-Approved):* Ditolak setelah disetujui (kendala visa atau pembatalan mendadak).
  5. **Visual 4: Process Speed vs Volume Scatter Plot (Plotly `px.scatter`):**
     * Sumbu X: Rata-rata durasi penerimaan dalam hari (`AVG(days_to_accept)`).
     * Sumbu Y: Total pendaftaran ke negara tersebut (`COUNT(apl_id)`).
     * Titik Gelembung (*Bubble*): Negara Tujuan (*Host MC*), dengan ukuran gelembung proporsional terhadap jumlah aplikasi.
     * Kegunaan: Mengidentifikasi kuadran negara "Favorit & Cepat", "Favorit tapi Lambat", atau "Jarang Dilirik tapi Sangat Cepat".

---

### 5.5 Halaman 4: Peta & Negara Tujuan (Destinations)
* **Tujuan Halaman:** Menyajikan persebaran geografis peserta pertukaran ke seluruh dunia serta menyediakan fitur penelusuran berjenjang (*drill-down*) dari level negara (*Host MC*) hingga level komite universitas mitra (*Host LC*).

```
+------------------------------------------------------------------------------------+
|                            HALAMAN 4: DESTINATIONS                                 |
+------------------------------------------------------------------------------------+
| [Visual 1: Global Choropleth Map (Plotly)]                                         |
| Peta Dunia Berdasarkan Kepadatan Pendaftaran Peserta (ISO-3 Code Mapping)          |
| Tooltip: Nama Negara, Total Pendaftar, Jumlah Diterima, Jumlah Selesai             |
+----------------------------------+-------------------------------------------------+
| [Visual 2: Top 10 Host MC Bar]   | [Interactivity: Host LC Drill-down Selector]    |
| Peringkat Negara Terpopuler      | Pilih Negara -> Tampilkan Kinerja Komite Lokal  |
+----------------------------------+-------------------------------------------------+
| [Visual 3: Host LC Drill-Down Data Table / Matrix]                                 |
| Tabel Rincian Kinerja Host LC di Negara Terpilih:                                  |
| Host LC Name | Total Apps | Accepted | Approved | Finished | Finish Rate | Avg Days|
+------------------------------------------------------------------------------------+
```

* **Rincian Metrik & Komponen Visual:**
  1. **Visual 1: Interactive Global Choropleth Map (Plotly `px.choropleth`):**
     * Pemetaan geografis menggunakan kode negara standar dunia (ISO Alpha-3).
     * Skala Warna (*Color Gradient*): Menunjukkan volume pendaftaran (`Total Applications`).
     * Hover Tooltip Kustom: Menampilkan nama negara, total pendaftar, jumlah peserta diterima (*Accepted*), dan jumlah alumni lulus (*Finished*).
     * Proyeksi Peta: Natural Earth / Robinson interaktif (dapat digeser, diputar, dan di-zoom).
  2. **Visual 2: Top 10 Destination Countries Horizontal Bar Chart (Plotly `px.bar`):**
     * Peringkat 10 negara mitra dengan volume pendaftar tertinggi asal UNAND.
  3. **Visual 3 & Komponen Interaktif: Host LC Drill-Down Matrix (`st.selectbox` + `st.dataframe` / Plotly Bar):**
     * Pengguna dapat memilih satu negara mitra dari *dropdown* interaktif atau mengklik bar chart negara.
     * Sistem secara dinamis memuat tabel rincian komite lokal/universitas mitra (*Host LC*) di negara tersebut, menampilkan:
       * Nama Komite Lokal (*Host LC*)
       * Total Aplikasi Masuk
       * Jumlah Peserta Diterima & Disetujui
       * Jumlah Peserta Menyelesaikan Program
       * Rasio Penyelesaian (*Finish Rate %*)
       * Rata-rata Durasi Pemrosesan (*Avg Days to Accept*)
     * Manfaat: Membantu tim OGX memilih mitra universitas luar negeri yang paling responsif dan berkinerja tinggi untuk kerja sama jangka panjang (*partnership matching*).

---

### 5.6 Halaman 5: Alasan Penolakan Peserta (Rejections)
* **Tujuan Halaman:** Memberikan pemahaman mendalam mengenai faktor penyebab kegagalan aplikasi pendaftaran dan menyajikan rekomendasi tindakan taktis (*Actionable Recommendations*) secara otomatis melalui logika cerdas Python.

```
+------------------------------------------------------------------------------------+
|                             HALAMAN 5: REJECTIONS                                  |
+------------------------------------------------------------------------------------+
| [Visual 1: Top Rejection Reasons Bar Chart]                                        |
| Peringkat Alasan Penolakan Berdasarkan Frekuensi Kasus                             |
+----------------------------------+-------------------------------------------------+
| [Visual 2: Rejections by Product]| [Visual 3: Monthly Rejection Trend Line]        |
| Komposisi Alasan per GV/GTa/GTe  | Tren Penolakan dari Waktu ke Waktu              |
+----------------------------------+-------------------------------------------------+
| [Dynamic Recommendation Engine: Card Visual & Dynamic Action Box]                 |
| Mengidentifikasi Rejection Reason Terbanyak pada Filter Terpilih                   |
| -> Menampilkan Ringkasan Akar Masalah (Root Cause Analysis)                        |
| -> Menghasilkan Rekomendasi Solusi Operasional Konkret untuk Tim CX/QA            |
+------------------------------------------------------------------------------------+
```

* **Rincian Metrik & Komponen Visual:**
  1. **Visual 1: Top Rejection Reasons Ranked Horizontal Bar Chart (Plotly `px.bar`):**
     * Menampilkan urutan frekuensi alasan penolakan dari yang paling sering terjadi (di luar kategori `'Not Rejected'`), dilengkapi jumlah kasus dan persentase kontribusi terhadap total penolakan.
  2. **Visual 2: Rejections by Exchange Product Clustered Bar Chart (Plotly `px.bar`):**
     * Membandingkan penyebab penolakan utama pada program GV (faktor umum/komitmen), GTa (kualifikasi keterampilan profesional/resume), dan GTe (kemahiran bahasa asing/latar belakang edukasi).
  3. **Visual 3: Monthly Rejection Trend Line Chart (Plotly `px.line`):**
     * Menampilkan grafik garis fluktuasi jumlah penolakan setiap bulan untuk memantau apakah program intervensi perbaikan berkas di bulan tertentu berhasil menurunkan angka penolakan.
  4. **Komponen Cerdas: Dynamic Recommendation Engine (`st.info` / `st.warning` / Custom HTML Card):**
     * Berdasarkan alasan penolakan urutan pertama (*Top 1 Reason*) pada dataset yang sedang difilter, engine logika Python secara otomatis merender rekomendasi operasional terstruktur:

| Alasan Penolakan Teratas (*Top Rejection Reason*) | Analisis Masalah Pokok | Rekomendasi Tindakan Dinamis untuk Tim QA & Customer Experience |
| :--- | :--- | :--- |
| **Did not show up for interview / unresponsive** | Calon peserta tidak hadir wawancara atau hilang kontak (*ghosting*). | • Bentuk sistem pengingat otomatis (*WhatsApp/Email automated reminder*) H-1 dan H-2 jam sebelum jadwal wawancara.<br>• Terapkan kebijakan konfirmasi kehadiran ulang (*re-confirmation form*) sebelum jadwal ditetapkan resmi. |
| **Does not match opportunity requirements / skills** | Peserta melamar pada proyek yang kualifikasinya tidak sesuai dengan latar belakangnya. | • Perkuat sesi *Consultation & Profile Review* sebelum peserta melakukan submit aplikasi ke CRM Expa.<br>• Buat panduan kurasi CV khusus sesuai standar industri negara tujuan (terutama program GTa & GTe). |
| **Visa / Passport issues** | Peserta terkendala masa berlaku paspor, izin orang tua, atau penolakan visa kedutaan. | • Tetapkan syarat kepemilikan paspor aktif minimal 6 bulan sebelum peserta diizinkan mendaftar ke tahapan seleksi.<br>• Sediakan *Country Visa Briefing Kit* dan pendampingan dokumen legalitas seawal mungkin. |
| **Financial / Budget constraints** | Peserta mengundurkan diri karena kendala biaya tiket penerbangan atau biaya hidup di luar negeri. | • Berikan transparansi simulasi rincian biaya hidup (*cost of living breakdown*) di awal proses konsultasi program.<br>• Jalin kemitraan dengan penyedia beasiswa atau sponsor lokal untuk skema subsidi dana keberangkatan. |
| **Selected another opportunity** | Peserta lebih memilih proyek lain atau magang alternatif di dalam negeri. | • Percepat durasi pemrosesan seleksi (*fast-track review*) agar peserta memperoleh kepastian status sebelum menerima tawaran lain. |

---

## 6. Rencana Struktur Folder & Daftar Penyesuaian M1–M3

### 6.1 Usulan Struktur Folder Proyek ExpaLens

Struktur folder dirancang modular, rapi, dan memisahkan antara data mentah, skrip pemrosesan database, logika aplikasi dashboard Streamlit, serta dokumentasi:

```
ExpaLens/
├── PRD.md                                 # Dokumen Spesifikasi Produk Resmi (File ini)
├── README.md                              # Panduan Instalasi, Setup Lingkungan, & Menjalankan Dashboard
├── requirements.txt                       # Dependensi Python (streamlit, plotly, pandas, sqlalchemy, psycopg2)
├── .env.example                           # Template variabel lingkungan (DB_USER, DB_PASS, DB_HOST, DB_NAME)
├── .gitignore                             # Berkas yang diabaikan Git (venv, data mentah besar, cache)
│
├── data/                                  # Penyimpanan Berkas Data (Dataset)
│   ├── raw/                               # Data Mentah Asli CRM Expa (Data Compile 2021-2025.csv / .xlsx)
│   └── processed_csv/                     # Cadangan Ekspor CSV Bersih Hasil ETL (output_clean_csv/)
│       ├── dim_date.csv
│       ├── dim_participant.csv
│       ├── dim_host.csv
│       ├── dim_product.csv
│       ├── dim_rejection_reason.csv
│       └── fact_exchange_application.csv
│
├── database/                              # Skrip Basis Data PostgreSQL
│   ├── schema_ddl.sql                     # Skrip DDL Pembuatan Tabel Star Schema (Tabel Dimensi & Fakta)
│   └── verify_queries.sql                 # Kueri Pengujian Integritas, Pengecekan Baris, & Rekonsiliasi
│
├── notebooks/                             # Lingkungan Eksplorasi & Pipeline ETL
│   └── Pipeline_ETL.ipynb                 # Notebook Utama Pembersihan Data, Transformasi, & Load ke PostgreSQL
│
├── src/                                   # Kode Sumber Aplikasi Web Dashboard (Streamlit)
│   ├── app.py                             # Entry Point Utama Aplikasi Streamlit (Halaman Beranda & Navigasi)
│   ├── config.py                          # Konfigurasi Koneksi PostgreSQL, Tema Warna, & Parameter Global
│   ├── db_connection.py                   # Modul Pengambilan Data dari PostgreSQL dengan Caching Teroptimasi
│   ├── utils.py                           # Fungsi Pembantu (Kalkulasi YoY, Format Angka, Engine Rekomendasi)
│   │
│   └── pages/                             # 5 Halaman Dashboard Interaktif Multi-page
│       ├── 1_Overview.py                  # Halaman 1: Ringkasan Utama & Status Funnel
│       ├── 2_Application_Trends.py        # Halaman 2: Tren Bulanan, Status, & Heatmap Musiman
│       ├── 3_Conversion_Funnel.py         # Halaman 3: Rasio Konversi, Rata-rata Durasi Hari, & Scatter
│       ├── 4_Destinations.py              # Halaman 4: Peta Koroplet Dunia & Drill-Down Host LC
│       └── 5_Rejections.py                # Halaman 5: Peringkat Alasan Penolakan & Rekomendasi Taktis
│
└── docs/                                  # Dokumentasi Akademik & Laporan Proyek
    ├── Milestone 1 - Justification & Planning Kelompok 3.md
    ├── Milestone 2 - Business Analysis Kelompok 3.md
    └── Milestone 3 - Design Kelompok 3.md
```

---

### 6.2 Daftar Bagian Milestone 1–3 yang Perlu Disesuaikan

Meskipun naskah Milestone 1–3 telah mencantumkan Streamlit dan Plotly, beberapa bagian di dokumen konseptual masih menggunakan istilah atau pola yang berasal dari Power BI atau membutuhkan sinkronisasi dengan implementasi teknis aktual:

| Dokumen | Bagian / Bab | Uraian Teks / Kondisi Saat Ini | Penyesuaian yang Diperlukan ke Streamlit + Plotly |
| :--- | :--- | :--- | :--- |
| **Milestone 1** | Bab 4.2.1.1 (Tabel 2 - Technical Infrastructure) | Kolom implementasi masih mencantumkan terminologi *hardware/software client* generik. | Tegaskan bahwa antarmuka tidak memerlukan instalasi desktop client berlisensi (seperti Power BI Desktop), melainkan dijalankan melalui peramban web (*web browser*) berbasis *Streamlit server* lokal atau cloud. |
| **Milestone 2** | Bab 4.3.4 (Tabel 3 - Dashboard Requirements) | Masih menggunakan istilah visual khas Power BI seperti: `Card Visual`, `KPI Visual`, `Slicer`, `Matrix Visual`, dan `Clustered Column Chart`. | Sesuaikan terminologi visual dengan komponen Streamlit dan Plotly:<br>• `Card Visual` $\rightarrow$ `st.metric` Scorecard Component.<br>• `Slicer / Filter Visual` $\rightarrow$ `st.sidebar.selectbox` / `st.sidebar.multiselect`.<br>• `Clustered Column Chart` $\rightarrow$ Plotly `px.bar` (dengan argumen `barmode='group'`).<br>• `Matrix Heatmap` $\rightarrow$ Plotly `go.Heatmap`.<br>• `Matrix Visual / Table Drill-down` $\rightarrow$ `st.dataframe` interaktif dengan filter dinamis. |
| **Milestone 2** | Bab 4.3.4 (Halaman 5 - No. 19) | Masih menyebutkan wadah teks rekomendasi sebagai `Text Box Dinamis`. | Sesuaikan dengan komponen notifikasi interaktif Streamlit (`st.info`, `st.warning`, atau `st.container` kustom berbasis HTML/CSS) yang dihubungkan langsung ke fungsi logika Python evaluasi alasan penolakan. |
| **Milestone 3** | Bab 4.4.1.2 (Tabel 4.2 - Arsitektur Fisik) | Menjelaskan alur fisik pemuatan data ke PostgreSQL dan konsumsi ke Streamlit. | Tambahkan catatan bahwa konektivitas Streamlit ke PostgreSQL memanfaatkan fitur `@st.cache_data(ttl=3600)` dan `@st.cache_resource` untuk mencegah kueri berulang (*query overhead*) ke basis data saat pengguna berinteraksi dengan slider filter. |
| **Milestone 3** | Bab 4.4.2.3 & 4.4.2.4 (Tabel 4.6 & 4.10) | Tabel 4.6 mencantumkan `product` (`VARCHAR`) sebagai Primary Key, dan Tabel 4.10 mencantumkan `product` sebagai Foreign Key. Selain itu, Tabel 4.9 mencantumkan `date_id` bertipe `DATE`. | Selaraskan dengan implementasi riil `Pipeline_ETL.ipynb`:<br>1. Gunakan `product_id` bertipe integer sebagai PK `dim_product` dan FK di `fact_exchange_application`.<br>2. Gunakan integer `YYYYMMDD` untuk `date_id` dan `applied_date_id`.<br>3. Catat bahwa kolom `company_name` di Tabel 4.10 bersifat opsional/dihapus pada data bersih karena tingginya nilai kosong pada dataset mentah. |
| **Milestone 3** | Bab 4.4.2.4 & 4.4.3 (Tabel 4.10, Bab Load & Verify) | Teks menyebutkan jumlah baris fakta **75.522 baris** dan peserta unik **3.704**. | Tambahkan catatan rekonsiliasi bahwa pada notebook implementasi diperoleh **75.520 baris** fakta dan **3.703 peserta unik** akibat variasi penanganan representasi string kosong (`'nan'`) vs nilai null murni pada tahapan pembersihan baris tanpa progres, dengan tingkat presisi >99,99%. |

---

## 7. Rencana Implementasi & Langkah Selanjutnya (Next Steps)

1. **Penyusunan Kode DDL Database (`database/schema_ddl.sql`):** Menyiapkan skrip pembentukan skema basis data PostgreSQL resmi dengan indeks pada kolom-kolom filter kunci (`apl_id`, `product_id`, `host_lc`, `applied_date_id`, `reason_id`).
2. **Penyempurnaan Skrip Pipeline ETL (`notebooks/Pipeline_ETL.ipynb`):** Memastikan pipeline dapat dieksekusi secara berulang (*idempotent*) dengan penanganan koneksi lokal PostgreSQL yang stabil.
3. **Pengembangan Aplikasi Streamlit (`src/app.py` & `src/pages/`):** Mengimplementasikan kode Python untuk 5 halaman dashboard interaktif lengkap dengan visualisasi Plotly dan penanganan filter reaktif.
4. **Verifikasi & Validasi:** Melakukan *cross-checking* antara angka agregasi pada dashboard Streamlit dengan kueri SQL langsung pada PostgreSQL untuk memastikan akurasi data 100%.

---
*Dokumen ini menjadi acuan tunggal (Single Source of Truth) untuk seluruh tahapan pengembangan teknis dan evaluasi sistem ExpaLens.*
