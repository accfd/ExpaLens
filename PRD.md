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

Dashboard Business Intelligence dirancang menggunakan bahasa pemrograman Python dengan *framework* Streamlit dan pustaka grafik interaktif Plotly untuk membantu pengurus Departemen Outgoing Exchange AIESEC in UNAND memahami performa pendaftaran peserta secara cepat. Informasi yang sebelumnya harus dihitung dan direkap secara manual disajikan dalam bentuk angka, grafik, tabel, dan peta yang saling terhubung dalam lima halaman utama:
1. **Halaman 1: Ringkasan Utama (Overview)**
2. **Halaman 2: Tren Pendaftaran (Application Trends)**
3. **Halaman 3: Tahapan Seleksi dan Kelulusan (Conversion Funnel)**
4. **Halaman 4: Peta dan Negara Tujuan (Destinations)**
5. **Halaman 5: Alasan Penolakan Peserta (Rejections)**

Setiap halaman dilengkapi visualisasi yang disesuaikan dengan kebutuhan informasi dan filter interaktif untuk memilih waktu, jenis program, negara tujuan, kampus atau komite lokal tujuan, serta status pendaftaran.

---

### 5.1 Matriks Kebutuhan Informasi & Dashboard (Tabel 3 Milestone 2)

Berikut adalah tabel rujukan kebutuhan informasi, cakupan data, jenis visualisasi, dan tujuan analitik untuk seluruh visual pada dashboard ExpaLens:

#### **Tabel 3. Analisis Kebutuhan Informasi dan Dashboard**

| No | Kebutuhan Informasi | Data yang Dibutuhkan | Jenis Visualisasi | Tujuan Analisis |
| :---: | :--- | :--- | :--- | :--- |
| **Halaman 1: Ringkasan Utama (Overview)** | | | | |
| 1 | Ringkasan indikator kinerja utama dan perbandingan pertumbuhan pendaftaran dibandingkan tahun sebelumnya (Year-over-Year / YoY). | `fact_exchange_application` (`apl_id`, `is_accepted`, `is_approved`, `is_finished`, `is_rejected`, `days_to_accept`) dan `dim_date` (`year`). | Card Visual dan KPI Visual. | Menampilkan jumlah seluruh pendaftaran, jumlah peserta yang mencapai setiap tahapan utama, rata-rata waktu pemrosesan, serta persentase kenaikan atau penurunan jumlah pendaftaran dibandingkan tahun sebelumnya. |
| 2 | Distribusi jumlah peserta pada setiap tahapan seleksi (customer funnel). | `fact_exchange_application` (`is_applied`, `is_accepted`, `is_approved`, `is_finished`, `is_rejected`). | Funnel Chart. | Mengetahui jumlah peserta yang berhasil mencapai setiap tahapan, mulai dari pendaftaran hingga selesai program, serta melihat penurunan jumlah peserta pada setiap tahapannya. |
| 3 | Perbandingan pencapaian setiap tahapan seleksi berdasarkan jenis program pertukaran. | `fact_exchange_application` (`is_accepted`, `is_approved`, `is_finished`) dan `dim_product` (`product`). | Clustered Column Chart. | Membandingkan jumlah peserta yang diterima, disetujui, dan menyelesaikan program GV, GTa, dan GTe untuk mengetahui program dengan hasil terbaik. |
| 4 | Persentase keberhasilan penyelesaian program berdasarkan jumlah peserta yang telah diterima (Finish Rate). | `fact_exchange_application` (`is_accepted`, `is_finished`) dan `dim_product` (`product`). | Gauge Chart. | Mengetahui persentase peserta yang berhasil menyelesaikan program dibandingkan dengan seluruh peserta yang telah diterima pada masing-masing program. |
| 5 | Penyaringan data berdasarkan waktu, program, negara tujuan, kampus atau komite lokal tujuan, dan status pendaftaran. | `dim_date` (`year`), `dim_product` (`product`), `dim_host` (`host_mc`, `host_lc`), dan `fact_exchange_application` (`status`). | Slicer dan Filter Visual. | Memudahkan pengguna memilih data berdasarkan kebutuhan tertentu sehingga seluruh grafik pada dashboard dapat menampilkan informasi yang lebih spesifik. |
| **Halaman 2: Tren Pendaftaran (Application Trends)** | | | | |
| 6 | Perkembangan jumlah pendaftaran peserta setiap bulan. | `fact_exchange_application` (`apl_id`) dan `dim_date` (`year`, `month`, `month_name`). | Line Chart. | Mengetahui perubahan jumlah pendaftaran setiap bulan serta melihat kapan jumlah pendaftar mengalami kenaikan atau penurunan. |
| 7 | Perubahan jumlah peserta pada setiap status utama, yaitu Accepted, Finished, dan Rejected, setiap bulan. | `fact_exchange_application` (`is_accepted`, `is_finished`, `is_rejected`) dan `dim_date` (`year`, `month`). | Stacked Area Chart. | Membandingkan perkembangan jumlah peserta yang diterima, menyelesaikan program, dan ditolak dari bulan ke bulan. |
| 8 | Perbandingan perkembangan jumlah pendaftaran setiap program dari tahun ke tahun. | `fact_exchange_application` (`apl_id`), `dim_product` (`product`), dan `dim_date` (`year`). | Clustered Column Chart. | Mengetahui program GV, GTa, atau GTe yang mengalami peningkatan maupun penurunan jumlah pendaftar setiap tahunnya. |
| 9 | Pola kenaikan dan penurunan aktivitas pendaftaran berdasarkan bulan dan tahun (Seasonality). | `fact_exchange_application` (`apl_id`, indikator tahapan funnel) dan `dim_date` (`year`, `month_name`). | Matrix Heatmap. | Mengidentifikasi bulan dengan jumlah pendaftaran tertinggi dan terendah pada setiap tahun, termasuk periode puncak summer peak dan winter peak. |
| 10 | Perbandingan metode pelaksanaan program (Semi-Remote dan On-site) serta tipe durasi program (Short-term dan Long-term). | `fact_exchange_application` (`apl_id`) dan `dim_product` (`product`, `is_remote`, `duration_type`). | 100% Stacked Bar Chart. | Mengetahui metode pelaksanaan dan tipe durasi program yang paling banyak dipilih peserta serta membandingkan preferensinya pada setiap program. |
| **Halaman 3: Tahapan Seleksi dan Kelulusan (Conversion Funnel)** | | | | |
| 11 | Persentase perpindahan peserta dari satu tahapan seleksi ke tahapan berikutnya (conversion rate). | `fact_exchange_application` (`is_applied`, `is_accepted`, `is_approved`, `is_realized`, `is_finished`). | Funnel Chart. | Mengukur persentase peserta yang berhasil melanjutkan ke setiap tahapan seleksi, mulai dari Applied hingga Finished, serta mengetahui tahapan dengan penurunan jumlah peserta terbesar. |
| 12 | Rata-rata waktu yang dibutuhkan peserta pada setiap tahapan seleksi berdasarkan jenis program. | `fact_exchange_application` (`days_to_accept`, `days_to_approve`, `days_to_realize`, `days_to_finish`) dan `dim_product` (`product`). | Clustered Bar Chart. | Membandingkan rata-rata jumlah hari yang dibutuhkan pada setiap tahapan seleksi untuk mengetahui bagian proses yang membutuhkan waktu paling lama. |
| 13 | Perbandingan tahapan terjadinya penolakan peserta berdasarkan jenis program (Rejection Stage Analysis). | `fact_exchange_application` (`is_rejected` dan tanggal setiap tahapan seleksi) serta `dim_product` (`product`). | Stacked Column Chart. | Mengetahui pada tahapan mana peserta paling banyak mengalami penolakan, baik sebelum Accepted, setelah Accepted, maupun setelah Approved, serta membandingkannya antarprogram. |
| 14 | Perbandingan kecepatan proses seleksi antarnegara tujuan dan hubungannya dengan jumlah pendaftaran. | `fact_exchange_application` (`apl_id`, `days_to_accept`) dan `dim_host` (`host_mc`). | Scatter Chart. | Mengetahui negara tujuan dengan proses seleksi paling cepat atau paling lambat serta melihat apakah jumlah pendaftaran yang tinggi berhubungan dengan lamanya waktu pemrosesan. |
| **Halaman 4: Peta dan Negara Tujuan (Destinations)** | | | | |
| 15 | Persebaran jumlah pendaftaran peserta berdasarkan negara tujuan di berbagai wilayah dunia. | `fact_exchange_application` (`apl_id`, indikator tahapan funnel) dan `dim_host` (`host_mc`, `host_region`). | Choropleth Map (Plotly). | Menampilkan persebaran negara tujuan berdasarkan jumlah pendaftaran sehingga pengguna dapat mengetahui negara yang paling banyak diminati peserta. |
| 16 | Peringkat negara tujuan berdasarkan jumlah pendaftaran serta rincian performa kampus atau komite lokal tujuan (Host LC Drill-down). | `fact_exchange_application` (`apl_id`, `is_accepted`, `is_approved`, `is_finished`) dan `dim_host` (`host_mc`, `host_lc`). | Clustered Bar Chart dan Drill-down Matrix. | Mengetahui negara tujuan dengan jumlah pendaftar terbanyak serta melihat rincian jumlah pendaftaran dan keberhasilan program pada masing-masing kampus atau komite lokal di negara tersebut. |
| **Halaman 5: Alasan Penolakan Peserta (Rejections)** | | | | |
| 17 | Distribusi dan peringkat alasan penolakan peserta berdasarkan jumlah kasus (Top Rejection Reasons). | `fact_exchange_application` (`apl_id`, `is_rejected`) dan `dim_rejection_reason` (`reason_text`). | Clustered Bar Chart. | Mengetahui alasan penolakan yang paling sering terjadi sehingga tim dapat menentukan masalah utama yang perlu diperhatikan. |
| 18 | Perbandingan alasan penolakan berdasarkan jenis program dan perkembangan jumlah penolakan dari waktu ke waktu. | `fact_exchange_application` (`apl_id`, `is_rejected`), `dim_rejection_reason` (`reason_text`), `dim_product` (`product`), dan `dim_date` (`year`, `month`). | Stacked Column Chart dan Line Chart. | Membandingkan penyebab penolakan pada program GV, GTa, dan GTe serta mengetahui perubahan jumlah penolakan setiap bulan dan tahun. |
| 19 | Rekomendasi tindakan perbaikan berdasarkan alasan penolakan yang paling banyak terjadi (Recommended Action). | `dim_rejection_reason` (`reason_text`) dan fungsi logika Python dinamis untuk menghasilkan teks rekomendasi. | Card Visual dan Text Box Dinamis. | Menampilkan saran tindakan yang dapat dilakukan tim Customer Experience berdasarkan alasan penolakan terbanyak yang sedang dipilih pada dashboard sehingga tim dapat menentukan langkah perbaikan yang sesuai. |

---

### 5.2 Komponen Bilah Sisi (Global Sidebar Filters - Sesuai Kebutuhan No. 5)
Bilah samping (*Sidebar*) memuat kontrol penyaringan data global yang secara reaktif memperbarui kueri data pada seluruh halaman dashboard:
* **Rentang Waktu / Tahun (`dim_date.year`):** Komponen `st.sidebar.multiselect` untuk memilih tahun pendaftaran (2021, 2022, 2023, 2024, 2025). Default: *Semua Tahun*.
* **Program Pertukaran (`dim_product.product`):** Komponen `st.sidebar.multiselect` untuk memilih program (`GV (New)`, `GTa`, `GTe`). Default: *Semua Program*.
* **Kawasan Tujuan (`dim_host.host_region`):** Komponen `st.sidebar.multiselect` untuk memilih kawasan dunia (Asia Pacific, Europe, Americas, MEA).
* **Negara Tujuan (`dim_host.host_mc`):** Komponen `st.sidebar.multiselect` negara mitra, disaring dinamis sesuai kawasan yang dipilih.
* **Komite Lokal Tujuan (`dim_host.host_lc`):** Komponen `st.sidebar.multiselect` universitas mitra, disaring dinamis sesuai negara yang dipilih.
* **Status Pendaftaran (`fact_exchange_application.status`):** Komponen `st.sidebar.multiselect` status akhir (*accepted*, *approved*, *finished*, *rejected*).

---

### 5.3 Halaman 1: Ringkasan Utama (Overview)
* **Tujuan Halaman:** Memberikan visibilitas instan kepada LCVP dan jajaran pimpinan mengenai kesehatan operasional program OGX secara agregat, tren pertumbuhan pendaftaran, serta persentase penyelesaian akhir.

```
+------------------------------------------------------------------------------------+
|                         HALAMAN 1: RINGKASAN UTAMA (OVERVIEW)                      |
+------------------------------------------------------------------------------------+
| [No. 1: Card Visual & KPI Visual]                                                  |
| Total Applications | Total Accepted | Total Finished | Finish Rate | YoY Growth    |
+------------------------------------+-----------------------------------------------+
| [No. 2: Funnel Chart]              | [No. 3: Clustered Column Chart]               |
| Distribusi Jumlah Peserta Funnel   | Capaian Tahapan Seleksi per Program           |
| (Applied -> Finished)              | (GV, GTa, GTe: Accepted, Approved, Finished)  |
+------------------------------------+-----------------------------------------------+
| [No. 4: Gauge Chart]                                                               |
| Persentase Keberhasilan Penyelesaian Program (Finish Rate = Finished ÷ Accepted)   |
+------------------------------------------------------------------------------------+
| [No. 5: Slicer dan Filter Visual (Sidebar Global)]                                 |
+------------------------------------------------------------------------------------+
```

* **Spesifikasi Detail Komponen Visual:**
  1. **No. 1: Ringkasan indikator kinerja utama dan perbandingan pertumbuhan pendaftaran dibandingkan tahun sebelumnya (Year-over-Year / YoY)**
     * *Jenis Visualisasi:* Card Visual dan KPI Visual (Diimplementasikan dengan `st.metric`).
     * *Data yang Dibutuhkan:* `fact_exchange_application` (`apl_id`, `is_accepted`, `is_approved`, `is_finished`, `is_rejected`, `days_to_accept`) dan `dim_date` (`year`).
     * *Metrik:* Total Applications (`COUNT(apl_id)`), Accepted (`SUM(is_accepted)`), Approved (`SUM(is_approved)`), Finished (`SUM(is_finished)`), Rejected (`SUM(is_rejected)`), Overall Avg Process Time (`AVG(days_to_accept)`), serta delta persentase pertumbuhan pendaftaran YoY terhadap tahun kalender sebelumnya.
  2. **No. 2: Distribusi jumlah peserta pada setiap tahapan seleksi (customer funnel)**
     * *Jenis Visualisasi:* Funnel Chart (Diimplementasikan dengan Plotly `go.Funnel`).
     * *Data yang Dibutuhkan:* `fact_exchange_application` (`is_applied`, `is_accepted`, `is_approved`, `is_finished`, `is_rejected`).
     * *Tujuan Analisis:* Menampilkan volume absolut dan persentase retensi kumulatif dari tahap *Applied* (100%) $\rightarrow$ *Accepted* $\rightarrow$ *Approved* $\rightarrow$ *Realized* $\rightarrow$ *Finished*, serta memperlihatkan jumlah peserta yang gugur di tiap tahap.
  3. **No. 3: Perbandingan pencapaian setiap tahapan seleksi berdasarkan jenis program pertukaran**
     * *Jenis Visualisasi:* Clustered Column Chart (Diimplementasikan dengan Plotly `px.bar` dengan `barmode='group'`).
     * *Data yang Dibutuhkan:* `fact_exchange_application` (`is_accepted`, `is_approved`, `is_finished`) dan `dim_product` (`product`).
     * *Tujuan Analisis:* Membandingkan perolehan peserta diterima, disetujui, dan menyelesaikan program pada GV, GTa, dan GTe untuk mengidentifikasi lini produk dengan performa terbaik.
  4. **No. 4: Persentase keberhasilan penyelesaian program berdasarkan jumlah peserta yang telah diterima (Finish Rate)**
     * *Jenis Visualisasi:* Gauge Chart (Diimplementasikan dengan Plotly `go.Indicator` mode gauge).
     * *Data yang Dibutuhkan:* `fact_exchange_application` (`is_accepted`, `is_finished`) dan `dim_product` (`product`).
     * *Tujuan Analisis:* Menampilkan rasio kelulusan ($\sum \text{is\_finished} \div \sum \text{is\_accepted} \times 100\%$) dengan rentang gauge 0–100% dan indikator ambang batas keberhasilan departemen (Merah: $<50\%$, Kuning: $50-69\%$, Hijau: $\ge 70\%$).
  5. **No. 5: Penyaringan data berdasarkan waktu, program, negara tujuan, kampus atau komite lokal tujuan, dan status pendaftaran**
     * *Jenis Visualisasi:* Slicer dan Filter Visual (Disediakan pada Bilah Sisi Global Streamlit).

---

### 5.4 Halaman 2: Tren Pendaftaran (Application Trends)
* **Tujuan Halaman:** Menganalisis dinamika volume pendaftaran peserta dari waktu ke waktu, mendeteksi pola musiman (*summer peak* & *winter peak*), serta mengevaluasi preferensi metode dan durasi program.

```
+------------------------------------------------------------------------------------+
|                    HALAMAN 2: TREN PENDAFTARAN (APPLICATION TRENDS)                |
+------------------------------------------------------------------------------------+
| [No. 6: Line Chart]                                                                |
| Perkembangan Jumlah Pendaftaran Peserta Setiap Bulan (2021-2025)                   |
+------------------------------------+-----------------------------------------------+
| [No. 7: Stacked Area Chart]        | [No. 8: Clustered Column Chart]               |
| Perubahan Komposisi Status Bulanan | Perbandingan Perkembangan Jumlah Pendaftaran  |
| (Accepted, Finished, Rejected)     | Setiap Program dari Tahun ke Tahun            |
+------------------------------------+-----------------------------------------------+
| [No. 9: Matrix Heatmap]            | [No. 10: 100% Stacked Bar Chart]              |
| Pola Aktivitas Musiman Pendaftaran | Perbandingan Metode (Semi-Remote vs On-site)  |
| (Bulan vs Tahun - Seasonality)     | dan Tipe Durasi Program (Short vs Long-term)  |
+------------------------------------------------------------------------------------+
```

* **Spesifikasi Detail Komponen Visual:**
  1. **No. 6: Perkembangan jumlah pendaftaran peserta setiap bulan**
     * *Jenis Visualisasi:* Line Chart (Diimplementasikan dengan Plotly `px.line`).
     * *Data yang Dibutuhkan:* `fact_exchange_application` (`apl_id`) dan `dim_date` (`year`, `month`, `month_name`).
     * *Tujuan Analisis:* Mengamati fluktuasi pendaftaran bulanan secara kontinu dan mengidentifikasi titik waktu terjadinya lonjakan atau penurunan minat pendaftar.
  2. **No. 7: Perubahan jumlah peserta pada setiap status utama, yaitu Accepted, Finished, dan Rejected, setiap bulan**
     * *Jenis Visualisasi:* Stacked Area Chart (Diimplementasikan dengan Plotly `px.area`).
     * *Data yang Dibutuhkan:* `fact_exchange_application` (`is_accepted`, `is_finished`, `is_rejected`) dan `dim_date` (`year`, `month`).
     * *Tujuan Analisis:* Membandingkan proporsi dan volume peserta yang diterima, menyelesaikan program, dan ditolak secara kumulatif dari bulan ke bulan.
  3. **No. 8: Perbandingan perkembangan jumlah pendaftaran setiap program dari tahun ke tahun**
     * *Jenis Visualisasi:* Clustered Column Chart (Diimplementasikan dengan Plotly `px.bar` dengan `barmode='group'`).
     * *Data yang Dibutuhkan:* `fact_exchange_application` (`apl_id`), `dim_product` (`product`), dan `dim_date` (`year`).
     * *Tujuan Analisis:* Membandingkan pertumbuhan tahunan antarprogram untuk mengetahui program mana yang mengalami kenaikan tren peminat secara konsisten.
  4. **No. 9: Pola kenaikan dan penurunan aktivitas pendaftaran berdasarkan bulan dan tahun (Seasonality)**
     * *Jenis Visualisasi:* Matrix Heatmap (Diimplementasikan dengan Plotly `go.Heatmap`).
     * *Data yang Dibutuhkan:* `fact_exchange_application` (`apl_id`, indikator tahapan funnel) dan `dim_date` (`year`, `month_name`).
     * *Tujuan Analisis:* Memetakan intensitas kepadatan aplikasi pada matriks 12 bulan $\times$ 5 tahun kalender guna mengidentifikasi secara presisi periode puncak pendaftaran pertukaran: *Summer Peak* (Mei–Juli) dan *Winter Peak* (November–Januari).
  5. **No. 10: Perbandingan metode pelaksanaan program (Semi-Remote dan On-site) serta tipe durasi program (Short-term dan Long-term)**
     * *Jenis Visualisasi:* 100% Stacked Bar Chart (Diimplementasikan dengan Plotly `px.bar` dengan `barmode='relative'`).
     * *Data yang Dibutuhkan:* `fact_exchange_application` (`apl_id`) dan `dim_product` (`product`, `is_remote`, `duration_type`).
     * *Tujuan Analisis:* Mengevaluasi preferensi pendaftar terhadap opsi pelaksanaan program (Semi-Remote vs On-site) serta durasi program (Short-term vs Long-term) di setiap program pertukaran.

---

### 5.5 Halaman 3: Tahapan Seleksi dan Kelulusan (Conversion Funnel)
* **Tujuan Halaman:** Mengukur efisiensi pergerakan peserta antartahapan, mendeteksi titik penurunan peserta (*drop-off*), mengukur durasi waktu pemrosesan (*process speed*), serta menemukan anomali kecepatan proses antarnegara.

```
+------------------------------------------------------------------------------------+
|             HALAMAN 3: TAHAPAN SELEKSI DAN KELULUSAN (CONVERSION FUNNEL)           |
+------------------------------------------------------------------------------------+
| [Top KPI Metrics: Rata-Rata Waktu Pemrosesan dalam Hari]                           |
| Avg Days to Accept | Avg Days to Approve | Avg Days to Realize | Avg Days to Finish|
+------------------------------------+-----------------------------------------------+
| [No. 11: Funnel Chart]             | [No. 12: Clustered Bar Chart]                 |
| Persentase Perpindahan Peserta     | Rata-rata Waktu yang Dibutuhkan Peserta pada  |
| Antartahapan (Conversion Rate)     | Setiap Tahapan Seleksi berdasarkan Program    |
+------------------------------------+-----------------------------------------------+
| [No. 13: Stacked Column Chart]                                                     |
| Perbandingan Tahapan Terjadinya Penolakan Peserta (Rejection Stage Analysis)       |
+------------------------------------------------------------------------------------+
| [No. 14: Scatter Chart]                                                            |
| Perbandingan Kecepatan Proses Seleksi Antarnegara Tujuan vs Jumlah Pendaftaran     |
+------------------------------------------------------------------------------------+
```

* **Spesifikasi Detail Komponen Visual:**
  1. **No. 11: Persentase perpindahan peserta dari satu tahapan seleksi ke tahapan berikutnya (conversion rate)**
     * *Jenis Visualisasi:* Funnel Chart (Diimplementasikan dengan Plotly `go.Funnel`).
     * *Data yang Dibutuhkan:* `fact_exchange_application` (`is_applied`, `is_accepted`, `is_approved`, `is_realized`, `is_finished`).
     * *Tujuan Analisis:* Menghitung rasio konversi per tahapan transisi langsung:
       * $\text{Applied} \rightarrow \text{Accepted} = \sum \text{is\_accepted} \div \sum \text{is\_applied}$
       * $\text{Accepted} \rightarrow \text{Approved} = \sum \text{is\_approved} \div \sum \text{is\_accepted}$
       * $\text{Approved} \rightarrow \text{Realized} = \sum \text{is\_realized} \div \sum \text{is\_approved}$
       * $\text{Realized} \rightarrow \text{Finished} = \sum \text{is\_finished} \div \sum \text{is\_realized}$
       Serta mendeteksi titik hambatan (*bottleneck*) dengan penurunan peserta terbesar.
  2. **No. 12: Rata-rata waktu yang dibutuhkan peserta pada setiap tahapan seleksi berdasarkan jenis program**
     * *Jenis Visualisasi:* Clustered Bar Chart (Diimplementasikan dengan Plotly `px.bar` horizontal/clustered).
     * *Data yang Dibutuhkan:* `fact_exchange_application` (`days_to_accept`, `days_to_approve`, `days_to_realize`, `days_to_finish`) dan `dim_product` (`product`).
     * *Tujuan Analisis:* Membandingkan rata-rata durasi hari di tiap tahap seleksi pada masing-masing program GV, GTa, dan GTe untuk menemukan proses yang paling memakan waktu.
  3. **No. 13: Perbandingan tahapan terjadinya penolakan peserta berdasarkan jenis program (Rejection Stage Analysis)**
     * *Jenis Visualisasi:* Stacked Column Chart (Diimplementasikan dengan Plotly `px.bar`).
     * *Data yang Dibutuhkan:* `fact_exchange_application` (`is_rejected` dan tanggal setiap tahapan seleksi) serta `dim_product` (`product`).
     * *Tujuan Analisis:* Mengetahui fase terjadinya penolakan peserta: *Pre-Accepted* (sebelum seleksi awal lolos), *Post-Accepted* (setelah diterima namun gagal di dokumen/wawancara lanjutan), atau *Post-Approved* (setelah disetujui namun gagal berangkat).
  4. **No. 14: Perbandingan kecepatan proses seleksi antarnegara tujuan dan hubungannya dengan jumlah pendaftaran**
     * *Jenis Visualisasi:* Scatter Chart (Diimplementasikan dengan Plotly `px.scatter`).
     * *Data yang Dibutuhkan:* `fact_exchange_application` (`apl_id`, `days_to_accept`) dan `dim_host` (`host_mc`).
     * *Tujuan Analisis:* Memetakan hubungan korelasi antara tingginya volume pendaftaran ke suatu negara mitra dengan rata-rata kecepatan durasi penerimaan seleksi (`AVG(days_to_accept)`).

---

### 5.6 Halaman 4: Peta dan Negara Tujuan (Destinations)
* **Tujuan Halaman:** Menyajikan persebaran geografis peserta pertukaran internasional serta menyediakan fitur analisis penelusuran berjenjang (*drill-down*) dari level negara hingga entitas komite lokal universitas mitra (*Host LC*).

```
+------------------------------------------------------------------------------------+
|                   HALAMAN 4: PETA DAN NEGARA TUJUAN (DESTINATIONS)                 |
+------------------------------------------------------------------------------------+
| [No. 15: Choropleth Map (Plotly)]                                                  |
| Persebaran Jumlah Pendaftaran Peserta Berdasarkan Negara Tujuan di Wilayah Dunia   |
| (Tooltip: Host MC, Total Aplikasi, Accepted, Finished)                             |
+------------------------------------+-----------------------------------------------+
| [No. 16A: Clustered Bar Chart]     | [No. 16B: Interaktivitas Pemilih Host MC]     |
| Peringkat Negara Tujuan Berdasarkan| Pilih Negara Tujuan -> Tampilkan Rincian      |
| Jumlah Pendaftaran (Top 10 Host MC)| Kinerja Kampus/Komite Lokal Tujuan            |
+------------------------------------+-----------------------------------------------+
| [No. 16C: Drill-down Matrix / Data Table]                                          |
| Rincian Performa Kampus atau Komite Lokal Tujuan (Host LC Drill-Down):             |
| Host LC | Total Apps | Accepted | Approved | Finished | Finish Rate | Avg Days Acc |
+------------------------------------------------------------------------------------+
```

* **Spesifikasi Detail Komponen Visual:**
  1. **No. 15: Persebaran jumlah pendaftaran peserta berdasarkan negara tujuan di berbagai wilayah dunia**
     * *Jenis Visualisasi:* Choropleth Map (Plotly) (Diimplementasikan dengan Plotly `px.choropleth`).
     * *Data yang Dibutuhkan:* `fact_exchange_application` (`apl_id`, indikator tahapan funnel) dan `dim_host` (`host_mc`, `host_region`).
     * *Tujuan Analisis:* Menampilkan peta tematik dunia berbasis kode ISO-3 yang mencerminkan intensitas volume pendaftaran, dilengkapi tooltip detail jumlah peserta diterima dan selesai di setiap negara.
  2. **No. 16: Peringkat negara tujuan berdasarkan jumlah pendaftaran serta rincian performa kampus atau komite lokal tujuan (Host LC Drill-down)**
     * *Jenis Visualisasi:* Clustered Bar Chart dan Drill-down Matrix (Diimplementasikan dengan kombinasi Plotly `px.bar` peringkat Top 10 Host MC dan tabel interaktif `st.dataframe` / `st.selectbox`).
     * *Data yang Dibutuhkan:* `fact_exchange_application` (`apl_id`, `is_accepted`, `is_approved`, `is_finished`) dan `dim_host` (`host_mc`, `host_lc`).
     * *Tujuan Analisis:* Mengidentifikasi 10 negara tujuan terpopuler, kemudian memungkinkan pengguna melakukan *drill-down* memilih satu negara untuk melihat daftar lengkap universitas/komite lokal mitra (*Host LC*) di negara tersebut beserta metrik jumlah aplikasi, peserta lulus, rasio penyelesaian, dan kecepatan waktu proses.

---

### 5.7 Halaman 5: Alasan Penolakan Peserta (Rejections)
* **Tujuan Halaman:** Menganalisis penyebab kegagalan aplikasi pendaftaran dan menyajikan rekomendasi tindakan taktis (*Actionable Recommendations*) secara otomatis melalui logika cerdas Python.

```
+------------------------------------------------------------------------------------+
|                  HALAMAN 5: ALASAN PENOLAKAN PESERTA (REJECTIONS)                  |
+------------------------------------------------------------------------------------+
| [No. 17: Clustered Bar Chart]                                                      |
| Distribusi dan Peringkat Alasan Penolakan Peserta (Top Rejection Reasons)          |
+------------------------------------+-----------------------------------------------+
| [No. 18A: Stacked Column Chart]    | [No. 18B: Line Chart]                         |
| Perbandingan Alasan Penolakan      | Perkembangan Jumlah Penolakan dari Waktu      |
| Berdasarkan Jenis Program          | ke Waktu (Monthly Rejection Trend)            |
+------------------------------------+-----------------------------------------------+
| [No. 19: Card Visual dan Text Box Dinamis]                                         |
| Rekomendasi Tindakan Perbaikan Berdasarkan Alasan Penolakan Terbanyak (Recommended |
| Action Engine Berbasis Logika Python Dinamis untuk Tim CX & QA)                    |
+------------------------------------------------------------------------------------+
```

* **Spesifikasi Detail Komponen Visual:**
  1. **No. 17: Distribusi dan peringkat alasan penolakan peserta berdasarkan jumlah kasus (Top Rejection Reasons)**
     * *Jenis Visualisasi:* Clustered Bar Chart (Diimplementasikan dengan Plotly `px.bar` horizontal).
     * *Data yang Dibutuhkan:* `fact_exchange_application` (`apl_id`, `is_rejected`) dan `dim_rejection_reason` (`reason_text`).
     * *Tujuan Analisis:* Mengurutkan alasan penolakan pendaftaran dari frekuensi tertinggi hingga terendah (tidak termasuk kategori `'Not Rejected'`) untuk menemukan sumber masalah utama kegagalan peserta.
  2. **No. 18: Perbandingan alasan penolakan berdasarkan jenis program dan perkembangan jumlah penolakan dari waktu ke waktu**
     * *Jenis Visualisasi:* Stacked Column Chart dan Line Chart (Diimplementasikan dengan Plotly `px.bar` komposisi alasan per produk dan Plotly `px.line` tren waktu penolakan).
     * *Data yang Dibutuhkan:* `fact_exchange_application` (`apl_id`, `is_rejected`), `dim_rejection_reason` (`reason_text`), `dim_product` (`product`), dan `dim_date` (`year`, `month`).
     * *Tujuan Analisis:* Mengetahui variasi kendala penolakan antarprogram (GV vs GTa vs GTe) dan memantau apakah angka penolakan mengalami tren penurunan setelah dilakukan langkah perbaikan.
  3. **No. 19: Rekomendasi tindakan perbaikan berdasarkan alasan penolakan yang paling banyak terjadi (Recommended Action)**
     * *Jenis Visualisasi:* Card Visual dan Text Box Dinamis (Diimplementasikan dengan fungsi logika Python dinamis dan wadah notifikasi visual `st.info` / `st.warning` / custom UI container).
     * *Data yang Dibutuhkan:* `dim_rejection_reason` (`reason_text`) dan fungsi logika Python dinamis untuk menghasilkan teks rekomendasi.
     * *Tujuan Analisis:* Menampilkan saran tindakan konkret yang dapat segera dieksekusi oleh tim Customer Experience & Quality Assurance berdasarkan alasan penolakan peringkat pertama yang terdeteksi pada filter aktif.

#### Matriks Engine Rekomendasi Tindakan Dinamis (Recommended Action Engine)

| Alasan Penolakan Teratas (*Top Rejection Reason*) | Identifikasi Akar Masalah | Rekomendasi Tindakan Operasional untuk Tim CX & QA |
| :--- | :--- | :--- |
| **Did not show up for interview / unresponsive** | Calon peserta tidak menghadiri sesi wawancara atau hilang kontak (*ghosting*). | • Implementasikan sistem pengingat pesan otomatis (*WhatsApp/Email reminder*) H-1 dan H-2 jam sebelum jadwal wawancara.<br>• Terapkan formulir konfirmasi kehadiran ulang (*re-confirmation form*) minimal 6 jam sebelum sesi wawancara dimulai. |
| **Does not match opportunity requirements / skills** | Profil keterampilan atau jurusan peserta tidak selaras dengan kualifikasi proyek tujuan. | • Wajibkan sesi *Consultation & Profile Review* bersama Manajer Program sebelum calon peserta mengajukan aplikasi resmi di portal CRM Expa.<br>• Buat panduan kurasi CV/Resume standar internasional yang disesuaikan dengan negara tujuan. |
| **Visa / Passport issues** | Terkendala masa berlaku paspor kedaluwarsa atau penolakan pengajuan visa kedutaan. | • Tetapkan syarat administratif wajib paspor aktif minimal 6 bulan sejak hari pendaftaran.<br>• Terbitkan *Country Visa Kit* dan berikan asistensi pengurusan berkas legalitas sejak tahap *Accepted*. |
| **Financial / Budget constraints** | Peserta membatalkan keikutsertaan akibat kendala biaya tiket pesawat atau biaya hidup di negara tujuan. | • Berikan simulasi rincian estimasi biaya hidup (*cost of living breakdown*) secara transparan pada awal proses konsultasi.<br>• Bangun kemitraan dengan sponsor atau penyedia beasiswa lokal untuk skema subsidi parsial. |
| **Selected another opportunity** | Peserta beralih ke program alternatif atau peluang magang lain di dalam negeri. | • Percepat waktu respon seleksi (*fast-track application review*) agar kepastian status peserta diberikan sebelum mereka memilih tawaran lain. |

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
