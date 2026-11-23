# Kontrak Antarmuka Pemrograman Aplikasi (API Contract) ExpaLens BI
## Spesifikasi REST API antara Peladen Backend (FastAPI) dan Klien Antarmuka (React)

**Sistem:** ExpaLens Business Intelligence  
**Organisasi:** Departemen Outgoing Exchange (OGX) AIESEC in Universitas Andalas  
**Basis Data:** PostgreSQL Data Mart (`aiesec_dw`)  
**Format Pertukaran:** JSON (`application/json`)  
**Base URL:** `http://127.0.0.1:8000/api`  
**Versi Kontrak:** 1.0  
**Tanggal:** 23 November 2026  

---

## 1. Skema Global Payload Penyaring (Filter Payload)

Seluruh endpoint analitik menerima payload penyaring yang seragam melalui metode `POST`. Jika array bernilai kosong `[]` atau bernilai `null`, peladen menganggap tidak ada filter aktif (menampilkan seluruh data akumulatif).

```json
{
  "years": [2021, 2022, 2023, 2024, 2025],
  "products": ["GTa", "GTe", "GV (New)"],
  "regions": ["Asia Pacific"],
  "countries": ["Malaysia"],
  "host_lcs": ["AIESEC in UNMC"],
  "statuses": ["accepted", "approved", "finished", "rejected"]
}
```

### Definisi Tipe Data (Pydantic Model):
* `years`: `Optional[List[int]]` - Tahun aplikasi pendaftaran (`dim_date.year`).
* `products`: `Optional[List[str]]` - Nama lini program pertukaran (`dim_product.product_name`).
* `regions`: `Optional[List[str]]` - Kawasan geografis global (`dim_host.host_region`).
* `countries`: `Optional[List[str]]` - Negara komite tujuan (`dim_host.host_mc`).
* `host_lcs`: `Optional[List[str]]` - Komite lokal atau kampus mitra tujuan (`dim_host.host_lc`).
* `statuses`: `Optional[List[str]]` - Status seleksi pendaftaran (`fact_exchange_application.status`).

---

## 2. Endpoint Sistem & Penyaring Dinamis

### 2.1 Pemeriksaan Kesehatan Peladen (Health Check)
* **Endpoint:** `GET /health`
* **Deskripsi:** Memeriksa kesiapan peladen backend FastAPI.
* **Format Respons (200 OK):**
```json
{
  "status": "ok",
  "service": "ExpaLens BI Backend"
}
```

### 2.2 Opsi Penyaring Berjenjang (Dynamic Filter Slicers)
* **Endpoint:** `GET /filters`
* **Deskripsi:** Mengambil daftar opsi filter yang tersedia di basis data, termasuk pemetaan relasional negara per kawasan (*countries by region*) dan komite lokal per negara (*LCs by country*).
* **Format Respons (200 OK):**
```json
{
  "years": [2021, 2022, 2023, 2024, 2025],
  "products": ["GV (New)", "GTa", "GTe"],
  "statuses": ["accepted", "approved", "finished", "rejected"],
  "regions": ["Americas", "Asia Pacific", "Europe", "Middle East and Africa"],
  "countries_by_region": {
    "Asia Pacific": ["India", "Malaysia", "Taiwan", "Thailand", "Vietnam"]
  },
  "lcs_by_country": {
    "Malaysia": ["AIESEC in Taylor's", "AIESEC in UNMC", "AIESEC in UPM"]
  }
}
```

---

## 3. Spesifikasi Endpoint 5 Halaman Dashboard

### 3.1 Halaman 1: Ringkasan Utama (Overview)
* **Endpoint:** `POST /overview` (dan `GET /overview`)
* **Deskripsi:** Melayani kebutuhan informasi Poin 1 s/d 5 (Scorecard KPI, Hero Card breakdown, Customer Funnel, Capaian Program, Finish Rate Gauge, dan YoY).
* **Format Respons (200 OK):**
```json
{
  "kpis": {
    "total_applications": 75520,
    "total_accepted": 1553,
    "total_approved": 786,
    "total_realized": 418,
    "total_finished": 642,
    "total_rejected": 72658,
    "avg_days_to_accept": 70.8,
    "finish_rate": 41.3
  },
  "product_breakdown": [
    { "product_name": "GTa", "total_apps": 53237 },
    { "product_name": "GTe", "total_apps": 12025 },
    { "product_name": "GV (New)", "total_apps": 10258 }
  ],
  "achievements": [
    {
      "product_name": "GTa",
      "accepted": 839,
      "approved": 328,
      "realized": 182,
      "finished": 268
    },
    {
      "product_name": "GTe",
      "accepted": 196,
      "approved": 88,
      "realized": 49,
      "finished": 62
    },
    {
      "product_name": "GV (New)",
      "accepted": 518,
      "approved": 370,
      "realized": 187,
      "finished": 312
    }
  ],
  "yoy": {
    "current_year": 2024,
    "prev_year": 2023,
    "current_val": 15441,
    "prev_val": 6206,
    "yoy_pct": 148.8,
    "is_positive": true
  }
}
```

---

### 3.2 Halaman 2: Tren Pendaftaran (Application Trends)
* **Endpoint:** `POST /trends`
* **Deskripsi:** Melayani kebutuhan informasi Poin 6 s/d 10 (Line chart bulanan, Stacked area status, Pertumbuhan tahunan produk, Matriks heatmap musim puncak, dan 100% stacked bar metode/durasi).
* **Format Respons (200 OK):**
```json
{
  "monthly_trend": [
    { "year_month": "2024-01", "total_apps": 1420 },
    { "year_month": "2024-02", "total_apps": 1680 }
  ],
  "status_dynamics": [
    {
      "year_month": "2024-01",
      "accepted": 45,
      "finished": 18,
      "rejected": 1357
    }
  ],
  "product_yearly": [
    {
      "year": 2024,
      "GTa": 11022,
      "GTe": 2340,
      "GV": 2079
    }
  ],
  "seasonality_matrix": [
    { "year": 2024, "month": 1, "month_name": "Jan", "total_apps": 1420 },
    { "year": 2024, "month": 5, "month_name": "May", "total_apps": 2450 }
  ],
  "preference_method": [
    {
      "product_name": "GTa",
      "semi_remote_pct": 35.4,
      "onsite_pct": 64.6,
      "short_term_pct": 20.0,
      "long_term_pct": 80.0
    }
  ]
}
```

---

### 3.3 Halaman 3: Tahapan Seleksi dan Kelulusan (Conversion Funnel)
* **Endpoint:** `POST /funnel`
* **Deskripsi:** Melayani kebutuhan informasi Poin 11 s/d 14 (Rasio konversi langkah-ke-langkah, Durasi hari proses per produk, Analisis tahap penolakan, dan Scatter chart kecepatan negara tujuan).
* **Format Respons (200 OK):**
```json
{
  "funnel_rates": [
    { "stage": "Applied to Accepted", "from_count": 75520, "to_count": 1553, "conversion_rate": 2.1, "drop_rate": 97.9 },
    { "stage": "Accepted to Approved", "from_count": 1553, "to_count": 786, "conversion_rate": 50.6, "drop_rate": 49.4 },
    { "stage": "Approved to Realized", "from_count": 786, "to_count": 418, "conversion_rate": 53.2, "drop_rate": 46.8 },
    { "stage": "Realized to Finished", "from_count": 418, "to_count": 642, "conversion_rate": 153.6, "drop_rate": 0.0 }
  ],
  "avg_processing_days": [
    {
      "product_name": "GTa",
      "days_to_accept": 74.2,
      "days_to_approve": 28.5,
      "days_to_realize": 62.1,
      "days_to_finish": 180.4
    }
  ],
  "rejection_stages": [
    {
      "product_name": "GTa",
      "pre_accepted": 51200,
      "post_accepted": 850,
      "post_approved": 608
    }
  ],
  "country_speed_scatter": [
    {
      "country": "Malaysia",
      "total_apps": 12450,
      "avg_days_to_accept": 14.2,
      "region": "Asia Pacific"
    }
  ]
}
```

---

### 3.4 Halaman 4: Peta dan Negara Tujuan (Destinations)
* **Endpoint:** `POST /destinations`
* **Deskripsi:** Melayani kebutuhan informasi Poin 15 s/d 16 (Choropleth world map, Peringkat Top 10 Host MC, dan Drill-down matriks performa Host LC).
* **Format Respons (200 OK):**
```json
{
  "choropleth_map": [
    { "country_code_iso3": "MYS", "country_name": "Malaysia", "total_apps": 12450 },
    { "country_code_iso3": "IND", "country_name": "India", "total_apps": 8320 }
  ],
  "top_host_mcs": [
    { "country_name": "Malaysia", "total_apps": 12450, "accepted": 320, "finished": 140 }
  ],
  "host_lc_drilldown": [
    {
      "country_name": "Malaysia",
      "host_lc": "AIESEC in UNMC",
      "total_apps": 3240,
      "accepted": 92,
      "approved": 54,
      "finished": 48,
      "finish_rate": 52.2
    }
  ]
}
```

---

### 3.5 Halaman 5: Alasan Penolakan Peserta (Rejections)
* **Endpoint:** `POST /rejections`
* **Deskripsi:** Melayani kebutuhan informasi Poin 17 s/d 19 (Peringkat alasan penolakan, Sebaran per produk, Tren fluktuasi waktu, dan Rekomendasi tindakan perbaikan).
* **Format Respons (200 OK):**
```json
{
  "top_rejection_reasons": [
    { "rank": 1, "reason_text": "Company rejected profile", "total_cases": 24150, "percentage": 33.2 },
    { "rank": 2, "reason_text": "EP uncontactable", "total_cases": 18200, "percentage": 25.1 }
  ],
  "reasons_by_product": [
    {
      "reason_text": "Company rejected profile",
      "GTa": 20450,
      "GTe": 3200,
      "GV": 500
    }
  ],
  "rejection_trend": [
    { "year_month": "2024-01", "rejected_cases": 1357 },
    { "year_month": "2024-02", "rejected_cases": 1520 }
  ],
  "recommended_action": {
    "top_reason": "Company rejected profile",
    "affected_percentage": 33.2,
    "priority_level": "Tinggi",
    "action_title": "Standarisasi Curating CV & Portofolio Sebelum Submit ke Opportunity",
    "action_description": "Mayoritas penolakan terjadi karena ketidaksesuaian kualifikasi kandidat dengan standar perusahaan mitra. Disarankan tim OGX mengadakan sesi CV Clinic dan uji simulasi wawancara teknis bagi calon pelamar GTa."
  }
}
```

---

## 4. Penanganan Status Kesalahan (Error Handling Standards)

| Kode Status HTTP | Skenario Kesalahan | Format Respons JSON |
| :---: | :--- | :--- |
| **`400 Bad Request`** | Parameter payload filter tidak valid (misal: tipe tahun bukan integer). | `{"detail": "Tipe data parameter filter tidak sesuai."}` |
| **`500 Internal Error`** | Gangguan koneksi ke PostgreSQL `aiesec_dw`. | `{"detail": "Gagal terhubung ke PostgreSQL aiesec_dw. Periksa koneksi basis data."}` |

---
*Dokumen ini merupakan acuan resmi integrasi data antara tim backend dan frontend ExpaLens BI.*
