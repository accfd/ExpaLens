# Design System & UI/UX Guidelines: ExpaLens
## Berdasarkan AIESEC Brand Guidelines (Blue Book) & Modern Executive Dashboard (React + FastAPI)

**Sistem Business Intelligence & Analytics Kinerja Outgoing Exchange**  
**Organisasi:** AIESEC in Universitas Andalas (UNAND)  
**Departemen:** Outgoing Exchange (OGX)  
**Dokumen Referensi Brand:** *AIESEC Brand Guidelines [Blue Book] Global Toolkit*  
**Palet Utama:** Harmonized AIESEC Blue Tone System  
**Font Utama:** Lato (Official AIESEC Font)  
**Versi Dokumen:** 3.0 (React Full-Stack & 5-Page Analytical Specifications)  
**Tanggal:** 23 November 2026  

---

## 1. Filosofi Desain & Identitas Brand (AIESEC Blue Book)

Sesuai panduan resmi *AIESEC Brand Guidelines [Blue Book]* (Bab 3.2 – Brand Attributes & Voice), identitas visual AIESEC dirancang untuk mencerminkan karakteristik kepemimpinan pemuda:
* **Dynamic:** Antarmuka responsif, interaktif, dan mudah dijelajahi tanpa jeda muat ulang.
* **Impactful:** Menyoroti angka metrik keluaran (KPI) yang bermakna bagi pengambilan keputusan strategis departemen.
* **Global:** Menggambarkan jaringan kemitraan mahasiswa Universitas Andalas dengan entitas AIESEC di seluruh dunia.
* **Youthful & Clean:** Desain bersih, elegan, bersudut membulat modern (14px–16px), tanpa elemen visual yang berlebihan.
* **Passionate:** Sentuhan visual kontras terukur dengan warna identitas yang kuat.

> **Golden Rule AIESEC Blue Book (Halaman 14):**  
> *"If you are not sure what color to choose, make it AIESEC Blue."*

Untuk menjaga konsistensi dan estetika eksekutif tingkat tinggi, dashboard **ExpaLens** menerapkan pendekatan **Harmonized Tone (Warna Senada Berbasis AIESEC Blue)**. Seluruh latar belakang, bilah sisi, kontainer kartu, dan teks berada dalam spektrum biru terpadu (dari biru tua/navy hingga biru es yang lembut), dengan aksen produk hanya digunakan secara spesifik untuk membedakan lini program (GTa, GTe, GV).

---

## 2. Palet Warna Senada AIESEC Blue (Harmonized Color System)

### 2.1 Palet Utama (Blue Spectrum Hierarchy)

| Token Warna | Kode HEX | Nilai RGB | Peran & Penggunaan Antarmuka |
| :--- | :---: | :---: | :--- |
| **AIESEC Blue (Primer)** | `#037EF3` | `3, 126, 243` | Warna jangkar visual utama. Digunakan untuk tombol primer, batas kartu aktif, garis tren utama, jarum gauge, dan navigasi aktif. |
| **Midnight Navy (Hero Dark)** | `#0A2540` | `10, 37, 64` | Warna kontainer kartu metrik utama (*Hero Card*), judul utama, dan bilah navigasi gelap untuk memberikan kedalaman kontras tinggi. |
| **Deep Royal Blue** | `#025CB5` | `2, 92, 181` | Warna hover tombol AIESEC Blue, status aktif sekunder, dan header grafik penting. |
| **Soft Blue Tint (Ice Blue)** | `#F0F6FF` | `240, 246, 255` | Latar belakang elemen filter aktif, baris hover tabel, dan wadah kotak rekomendasi operasional. |
| **Blue Border Accent** | `#BFDBFE` | `191, 219, 254` | Garis pembatas kartu interaktif, badge kategori, dan border fokus form input. |
| **Canvas Background** | `#F8FAFC` | `248, 250, 252` | Latar kanvas aplikasi. Memberikan kenyamanan optik bagi mata pengambil keputusan dalam sesi analisis panjang. |
| **Card White Surface** | `#FFFFFF` | `255, 255, 255` | Permukaan kartu analitik visual, bilah sisi (*Sidebar*), dan wadah grafik Recharts. |
| **Border Neutral Gray** | `#E2E8F0` | `226, 232, 240` | Garis pemisah antar-kartu dan garis kisi sumbu grafik (*gridlines*). |
| **Text Primary (Dark Slate)** | `#0F172A` | `15, 23, 42` | Teks judul kartu, nilai angka KPI besar, dan teks navigasi. |
| **Text Secondary (Slate Muted)**| `#64748B` | `100, 116, 139` | Keterangan sub-judul, satuan metrik, label sumbu X/Y, dan catatan kaki. |

### 2.2 Palet Identitas Produk Pertukaran (Sesuai Blue Book)

Warna program digunakan secara disiplin hanya saat membandingkan ketiga lini produk pertukaran AIESEC:

| Program Pertukaran | Kode Produk | Kode HEX | Nilai RGB | Makna Resmi Blue Book |
| :--- | :---: | :---: | :---: | :--- |
| **Global Talent** | `GTa` | `#0A8EA0` | `10, 142, 160` | **AIESEC Dark Teal:** Mewakili profesionalisme magang korporat dan kemitraan industri. |
| **Global Teacher** | `GTe` | `#F48924` | `244, 137, 36` | **AIESEC Teacher Orange:** Mewakili semangat pengajaran, edukasi, dan kepemimpinan kelas. |
| **Global Volunteer** | `GV` | `#F85A40` | `248, 90, 64` | **AIESEC Coral Red:** Mewakili kontribusi sosial sukarelawan terhadap target SDGs PBB. |

### 2.3 Palet Indikator Semantik Evaluasi

| Kategori Evaluasi | Kode HEX | Peruntukan |
| :--- | :---: | :--- |
| **Selesai / Target Tercapai** | `#10B981` | Tahap *Finished*, pertumbuhan YoY positif (+%), dan zona hijau gauge (≥60%). |
| **Peringatan / Dalam Perhatian** | `#F59E0B` | Zona kuning gauge (30%–60%), drop-off sedang, dan waktu proses ambang batas. |
| **Ditolak / Di Bawah Target** | `#EF4444` | Status *Rejected*, zona merah gauge (<30%), dan delta penurunan performa (-%). |

---

## 3. Sistem Tipografi (Lato Typography System)

Sesuai **AIESEC Blue Book Halaman 15**, jenis huruf **`Lato`** adalah tipografi resmi organisasi yang wajib diaplikasikan secara konsisten:

| Tingkatan Teks | Ukuran Font | Bobot (Weight) | Penerapan pada Antarmuka ExpaLens |
| :--- | :---: | :---: | :--- |
| **Display Title (H1)** | 24px – 28px | Lato Black (900) | Judul Halaman Eksekutif pada Header Utama |
| **Section Subtitle** | 12px – 13px | Lato Regular (400) | Deskripsi ruang lingkup analitik halaman |
| **Hero Metric Number** | 40px – 48px | Lato Black (900) | Angka total pendaftaran pada Hero Card Midnight Navy |
| **Standard KPI Value** | 28px – 32px | Lato Black (900) | Nilai angka pada kartu metrik (Realized, Finished, Finish Rate, Days) |
| **Card / Widget Title**| 15px – 16px | Lato Bold (700) | Judul kartu grafik analitik Recharts |
| **Body & Table Content**| 12px – 13px | Lato Regular / Medium | Isi teks tabel, deskripsi grafik, dan teks bantuan |
| **Badge & Label Small** | 10px – 11px | Lato Bold (700) | Tag status, kode produk, dan persentase YoY |

---

## 4. Arsitektur Tata Letak (Card-Based Executive Layout)

Antarmuka ExpaLens mengadopsi struktur dua panel terpadu:
1. **Bilah Sisi Kiri (Sticky Sidebar - Lebar 280px):**
   - Area Branding ExpaLens & Departemen Outgoing Exchange AIESEC in UNAND.
   - Menu Navigasi 5 Halaman Utama dengan indikator aktif beraksen AIESEC Blue.
   - Panel Slicer & Filter Global Berjenjang (Tahun, Program, Kawasan, Negara, Komite Lokal, Status).
2. **Area Konten Utama (Scrollable Main Viewport):**
   - Header statis di bagian atas dengan indikator koneksi PostgreSQL live dan tombol segarkan data.
   - Kanvas visualisasi berbasis kartu (*modular cards*) dengan sudut membulat 16px, border halus `#E2E8F0`, dan bayangan lembut (*subtle elevation*).

---

## 5. Rincian Kebutuhan Informasi & Spesifikasi Visual 5 Halaman

Berdasarkan **Tabel 3 Analisis Kebutuhan Informasi dan Dashboard**, berikut adalah spesifikasi visual detail untuk seluruh modul analitik:

### 5.1 Halaman 1: Ringkasan Utama (Overview)
* **Tujuan Halaman:** Memberikan tinjauan komprehensif performa pendaftaran, retensi tahapan seleksi peserta, capaian masing-masing produk pertukaran, dan tingkat kelulusan peserta.

| No | Kebutuhan Informasi | Sumber Data | Jenis Visualisasi | Spesifikasi Desain & Tujuan Analisis |
| :---: | :--- | :--- | :--- | :--- |
| **1** | Ringkasan KPI dan perbandingan pertumbuhan tahunan (YoY). | `fact_exchange_application` (`apl_id`, `is_accepted`, `is_approved`, `is_finished`, `days_to_accept`), `dim_date` (`year`). | **Card Visual & KPI Visual** | 4 Kartu Metrik: Total Realized, Total Finished, Finish Rate (41,3%), dan Rata-Rata Waktu Proses (70,8 Hari) lengkap dengan kalkulasi persentase YoY terhadap tahun sebelumnya. |
| **2** | Distribusi jumlah peserta pada setiap tahapan seleksi (Customer Funnel). | `fact_exchange_application` (`is_applied`, `is_accepted`, `is_approved`, `is_realized`, `is_finished`). | **Funnel Chart** | Diagram bertingkat menampilkan retensi peserta: Applied (75.520) -> Accepted (1.553) -> Approved (786) -> Realized (418) -> Finished (642) serta persentase konversi kumulatif. |
| **3** | Perbandingan pencapaian tahapan seleksi berdasarkan jenis program. | `fact_exchange_application` (`is_accepted`, `is_approved`, `is_realized`, `is_finished`), `dim_product` (`product_name`). | **Clustered Column Chart** | Grafik batang berkelompok membandingkan volume Accepted, Approved, Realized, dan Finished untuk GTa (`#0A8EA0`), GTe (`#F48924`), dan GV (`#F85A40`) lengkap dengan label angka di atas batang. |
| **4** | Persentase keberhasilan penyelesaian program (Finish Rate). | `fact_exchange_application` (`is_accepted`, `is_finished`), `dim_product` (`product_name`). | **Radial Gauge Chart** | Semi-circle speedometer (0%–100%) dengan jarum AIESEC Blue, garis putus-putus target 50%, dan zona warna Merah (<30%), Kuning (30%–60%), Hijau (60%–100%). |
| **5** | Penyaringan data berjenjang. | `dim_date` (`year`), `dim_product` (`product_name`), `dim_host` (`host_region`, `host_mc`, `host_lc`), `fact_exchange_application` (`status`). | **Slicer & Filter Visual** | Bilah sisi interaktif dengan penyaring multiselect dinamis yang langsung memperbarui kueri SQL seluruh komponen di layar. |

---

### 5.2 Halaman 2: Tren Pendaftaran (Application Trends)
* **Tujuan Halaman:** Mengetahui dinamika volume pendaftaran bulanan, evolusi status peserta, perbandingan pertumbuhan tahunan antar-produk, serta mendeteksi pola musim puncak (*summer peak* dan *winter peak*).

| No | Kebutuhan Informasi | Sumber Data | Jenis Visualisasi | Spesifikasi Desain & Tujuan Analisis |
| :---: | :--- | :--- | :--- | :--- |
| **6** | Perkembangan jumlah pendaftaran peserta setiap bulan. | `fact_exchange_application` (`apl_id`), `dim_date` (`year`, `month`, `month_name`). | **Line Chart (Smooth Spline)** | Kurva tren halus beraksen AIESEC Blue (`#037EF3`) dengan titik penanda data (*markers*) untuk memperlihatkan fluktuasi pendaftaran bulanan dari tahun 2021 hingga 2025. |
| **7** | Perubahan komposisi status utama (Accepted, Finished, Rejected) setiap bulan. | `fact_exchange_application` (`is_accepted`, `is_finished`, `is_rejected`), `dim_date` (`year`, `month`). | **Stacked Area Chart** | Visualisasi area bertumpuk dengan gradasi warna senada (Biru untuk Accepted, Hijau untuk Finished, Merah untuk Rejected) guna melihat pergeseran proporsi status pendaftaran tiap bulan. |
| **8** | Perbandingan volume pendaftaran tahunan per program pertukaran. | `fact_exchange_application` (`apl_id`), `dim_product` (`product_name`), `dim_date` (`year`). | **Clustered Column Chart** | Batang vertikal perbandingan volume pendaftar tahun 2021–2025 yang dikelompokkan berdasarkan warna identitas produk (GTa, GTe, GV). |
| **9** | Pola kenaikan dan penurunan aktivitas pendaftaran (Seasonality Heatmap). | `fact_exchange_application` (`apl_id`), `dim_date` (`year`, `month_name`). | **Matrix Heatmap** | Matriks 12 Bulan × 5 Tahun dengan skala saturasi warna AIESEC Blue untuk mengidentifikasi periode puncak pendaftaran (*Summer Peak* Mei–Juli dan *Winter Peak* November–Januari). |
| **10** | Preferensi metode pelaksanaan (Semi-Remote vs On-site) dan durasi program. | `fact_exchange_application` (`apl_id`), `dim_product` (`product_name`, `is_remote`, `duration_type`). | **100% Stacked Bar Chart** | Batang horizontal proporsional 100% yang menampilkan perbandingan preferensi peserta terhadap metode pelaksanaan dan durasi (Short-term vs Long-term) pada tiap program. |

---

### 5.3 Halaman 3: Tahapan Seleksi dan Kelulusan (Conversion Funnel)
* **Tujuan Halaman:** Menganalisis efisiensi operasional seleksi peserta, mengidentifikasi tahapan dengan tingkat hambatan (*bottleneck*) tertinggi, serta membandingkan kecepatan pemrosesan antar-negara mitra.

| No | Kebutuhan Informasi | Sumber Data | Jenis Visualisasi | Spesifikasi Desain & Tujuan Analisis |
| :---: | :--- | :--- | :--- | :--- |
| **11** | Rasio perpindahan peserta antartahapan seleksi (Conversion Rate & Drop-off). | `fact_exchange_application` (`is_applied`, `is_accepted`, `is_approved`, `is_realized`, `is_finished`). | **Detailed Funnel Chart** | Visualisasi corong presisi tinggi yang menyajikan rasio konversi tahap-ke-tahap (*step-to-step conversion*) dan menyoroti titik penurunan peserta terbesar (*major drop-off point*). |
| **12** | Rata-rata waktu proses pada setiap tahapan seleksi berdasarkan jenis program. | `fact_exchange_application` (`days_to_accept`, `days_to_approve`, `days_to_realize`, `days_to_finish`), `dim_product` (`product_name`). | **Clustered Bar Chart** | Grafik batang horizontal membandingkan rata-rata hari yang dihabiskan peserta pada tiap fase seleksi antar-produk (GTa, GTe, GV) untuk menemukan proses paling lambat. |
| **13** | Perbandingan tahapan terjadinya penolakan peserta (Rejection Stage Analysis). | `fact_exchange_application` (`is_rejected`, tanggal tahapan), `dim_product` (`product_name`). | **Stacked Column Chart** | Batang bertumpuk yang membedakan persentase penolakan pada tahap *Pre-Accepted*, *Post-Accepted*, dan *Post-Approved* untuk tiap lini program. |
| **14** | Kecepatan proses seleksi antar-negara tujuan vs volume pendaftaran. | `fact_exchange_application` (`apl_id`, `days_to_accept`), `dim_host` (`host_mc`). | **Scatter Chart (Bubble)** | Diagram pencar menghubungkan jumlah pendaftar (sumbu X), rata-rata durasi penerimaan hari (sumbu Y), dan ukuran gelembung volume peserta untuk mengevaluasi efisiensi mitra internasional. |

---

### 5.4 Halaman 4: Peta dan Negara Tujuan (Destinations)
* **Tujuan Halaman:** Menampilkan distribusi geografis kemitraan global AIESEC in Universitas Andalas dan menyediakan penelusuran berjenjang (*drill-down*) hingga tingkat komite lokal/universitas mitra luar negeri.

| No | Kebutuhan Informasi | Sumber Data | Jenis Visualisasi | Spesifikasi Desain & Tujuan Analisis |
| :---: | :--- | :--- | :--- | :--- |
| **15** | Persebaran jumlah pendaftaran peserta di berbagai kawasan dan negara dunia. | `fact_exchange_application` (`apl_id`), `dim_host` (`host_mc`, `host_region`). | **Choropleth World Map** | Peta tematik dunia interaktif dengan gradasi saturasi AIESEC Blue (`#037EF3`) yang memperlihatkan intensitas volume pendaftar ke setiap negara mitra secara visual. |
| **16** | Peringkat negara tujuan teratas dan rincian performa komite lokal (Host LC Drill-down). | `fact_exchange_application` (`apl_id`, `is_accepted`, `is_approved`, `is_finished`), `dim_host` (`host_mc`, `host_lc`). | **Clustered Bar Chart & Drill-down Matrix Table** | Bar chart Top 10 Host MC dipadukan dengan tabel matriks interaktif. Saat pengguna memilih suatu negara, tabel langsung menyajikan rincian komite lokal/universitas tujuan lengkap dengan Finish Rate. |

---

### 5.5 Halaman 5: Alasan Penolakan Peserta (Rejections)
* **Tujuan Halaman:** Menganalisis akar penyebab kegagalan aplikasi pendaftaran dan menyediakan rekomendasi tindakan operasional otomatis bagi tim Customer Experience (CX) Outgoing Exchange.

| No | Kebutuhan Informasi | Sumber Data | Jenis Visualisasi | Spesifikasi Desain & Tujuan Analisis |
| :---: | :--- | :--- | :--- | :--- |
| **17** | Distribusi dan peringkat alasan penolakan peserta (Top Rejection Reasons). | `fact_exchange_application` (`apl_id`, `is_rejected`), `dim_rejection_reason` (`reason_text`). | **Horizontal Bar Chart** | Grafik batang horizontal mengurutkan 10 alasan penolakan paling dominan (di luar status *Not Rejected*) untuk menentukan prioritas mitigasi. |
| **18** | Perbandingan penyebab penolakan per program dan tren fluktuasi waktu. | `fact_exchange_application` (`apl_id`), `dim_rejection_reason` (`reason_text`), `dim_product` (`product_name`), `dim_date` (`year`, `month`). | **Stacked Column Chart & Trend Line** | Analisis ganda: grafik batang bertumpuk alasan penolakan per program (GTa, GTe, GV) serta grafik garis tren penolakan bulanan dari waktu ke waktu. |
| **19** | Rekomendasi tindakan perbaikan operasional otomatis (Recommended Action). | `dim_rejection_reason` (`reason_text`), fungsi logika analitik backend. | **Dynamic Action Card Visual** | Kotak kartu berlatar Ice Blue (`#F0F6FF`) dengan border tebal AIESEC Blue (`#037EF3`) yang menampilkan rekomendasi taktis terotomatisasi berdasarkan alasan penolakan terbanyak yang terpilih pada filter. |

---

## 6. Standar Komponen Kode Antarmuka (React + Tailwind CSS)

### 6.1 Kelas Utilitas Tailwind CSS untuk Elemen Visual

```jsx
// 1. Kontainer Kartu Standar Eksekutif
className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200"

// 2. Kontainer Kartu Utama (Hero Card) Midnight Navy
className="bg-[#0A2540] text-white rounded-2xl p-6 shadow-md border border-slate-800"

// 3. Kartu Metrik Ringkas (KPI Card)
className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 hover:border-[#037EF3] transition-all"

// 4. Tombol Aksi Primer AIESEC Blue
className="bg-[#037EF3] hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"

// 5. Kotak Rekomendasi Tindakan Operasional
className="bg-[#F0F6FF] border-l-4 border-[#037EF3] rounded-r-2xl p-6 border-y border-r border-blue-200/60"
```

### 6.2 Format Angka dan Nilai Baku Indonesia

Seluruh penyajian numerik pada antarmuka mengikuti kaidah notasi resmi Republik Indonesia:
* Pemisah ribuan menggunakan titik (`.`): Contoh `75.520`, `1.553`, `53.237`.
* Pemisah desimal menggunakan koma (`,`): Contoh `41,3%`, `70,8 Hari`, `+148,8%`.
* Tidak ada emotikon apa pun pada kode, label visualisasi, maupun teks narasi antarmuka.

---

## 7. Daftar Periksa Kepatuhan Desain (Design Compliance Checklist)

Sebelum merilis penambahan modul visual baru, pastikan seluruh kriteria berikut terpenuhi:
* [x] **Dominasi Warna Senada:** AIESEC Blue (`#037EF3`) dan Midnight Navy (`#0A2540`) menjadi warna utama antarmuka.
* [x] **Aksen Produk Disiplin:** Warna program hanya digunakan untuk GTa (`#0A8EA0`), GTe (`#F48924`), dan GV (`#F85A40`).
* [x] **Tipografi Resmi:** Font keluarga **Lato** diterapkan secara menyeluruh pada judul, isi, angka metrik, dan sumbu grafik.
* [x] **Tanpa Emotikon:** Seluruh simbol menggunakan ikon garis profesional dari pustaka `lucide-react`.
* [x] **Koneksi Basis Data PostgreSQL:** Seluruh visualisasi terhubung secara reaktif ke basis data `aiesec_dw`.
