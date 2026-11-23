-- ==============================================================================
-- DDL DATA MART STAR SCHEMA - AIESEC in UNAND OUTGOING EXCHANGE (aiesec_dw)
-- Sesuai Spesifikasi: PRD.md Bab 4 & Milestone 3 Design
-- ==============================================================================

-- 1. Tabel Dimensi Waktu (dim_date)
CREATE TABLE IF NOT EXISTS dim_date (
    date_id INT PRIMARY KEY,                 -- Format integer YYYYMMDD (misal: 20210515)
    full_date DATE NOT NULL,                 -- Tanggal kalender riil
    day SMALLINT NOT NULL,                   -- Hari dalam bulan (1-31)
    week SMALLINT NOT NULL,                  -- Minggu ke-n dalam tahun (ISO)
    month SMALLINT NOT NULL,                 -- Angka bulan (1-12)
    quarter SMALLINT NOT NULL,               -- Kuartal (1-4)
    year INT NOT NULL,                       -- Tahun kalender (2020-2026)
    month_name VARCHAR(20) NOT NULL,         -- Nama bulan (January - December)
    day_of_week VARCHAR(20) NOT NULL,        -- Nama hari (Monday - Sunday)
    is_weekend SMALLINT NOT NULL             -- Flag akhir pekan (1 jika Sabtu/Minggu, 0 jika bukan)
);

-- 2. Tabel Dimensi Peserta (dim_participant)
CREATE TABLE IF NOT EXISTS dim_participant (
    ep_id VARCHAR(64) PRIMARY KEY,           -- Exchange Participant ID unik
    home_lc VARCHAR(100) NOT NULL,           -- Komite lokal asal (UNAND)
    home_mc VARCHAR(100) NOT NULL,           -- Komite nasional asal (INDONESIA)
    home_region VARCHAR(100) NOT NULL        -- Kawasan asal (Asia Pacific)
);

-- 3. Tabel Dimensi Komite Mitra & Lokasi Tujuan (dim_host)
CREATE TABLE IF NOT EXISTS dim_host (
    host_lc VARCHAR(200) PRIMARY KEY,        -- Komite lokal / universitas mitra tujuan
    host_mc VARCHAR(100) NOT NULL,           -- Negara tujuan
    host_region VARCHAR(100) NOT NULL        -- Kawasan/benua tujuan
);

-- 4. Tabel Dimensi Program Pertukaran (dim_product)
CREATE TABLE IF NOT EXISTS dim_product (
    product_id INT PRIMARY KEY,              -- ID program (1: GV, 2: GTa, 3: GTe)
    product_name VARCHAR(50) NOT NULL,       -- Nama program (GV (New), GTa, GTe)
    duration_type VARCHAR(50) NOT NULL       -- Kategori durasi (Short-term / Long-term)
);

-- 5. Tabel Dimensi Alasan Penolakan (dim_rejection_reason)
CREATE TABLE IF NOT EXISTS dim_rejection_reason (
    reason_id INT PRIMARY KEY,               -- ID alasan penolakan (1-13)
    reason_text VARCHAR(255) NOT NULL        -- Deskripsi alasan (termasuk 'Not Rejected')
);

-- 6. Tabel Fakta Transaksi Pendaftaran Aplikasi (fact_exchange_application)
CREATE TABLE IF NOT EXISTS fact_exchange_application (
    apl_id BIGINT PRIMARY KEY,               -- Application ID unik
    ep_id VARCHAR(64) NOT NULL,              -- FK ke dim_participant
    host_lc VARCHAR(200) NOT NULL,           -- FK ke dim_host
    product_id INT NOT NULL,                 -- FK ke dim_product
    reason_id INT NOT NULL,                  -- FK ke dim_rejection_reason
    applied_date_id INT NOT NULL,            -- FK ke dim_date(date_id)
    status VARCHAR(50) NOT NULL,             -- Status akhir (accepted, approved, finished, rejected)
    
    -- Indikator Biner Tahapan Seleksi (Funnel Flags: 1 jika tercapai, 0 jika belum)
    is_applied SMALLINT NOT NULL DEFAULT 1,
    is_accepted SMALLINT NOT NULL DEFAULT 0,
    is_approved SMALLINT NOT NULL DEFAULT 0,
    is_realized SMALLINT NOT NULL DEFAULT 0,
    is_finished SMALLINT NOT NULL DEFAULT 0,
    is_rejected SMALLINT NOT NULL DEFAULT 0,
    
    -- Durasi Waktu Pemrosesan Antartahapan (dalam satuan Hari, NULL jika tahap belum tercapai)
    days_to_accept INT,
    days_to_approve INT,
    days_to_realize INT,
    days_to_finish INT,
    days_to_reject INT,
    
    -- Batasan Kunci Asing (Foreign Key Constraints)
    CONSTRAINT fk_fact_participant FOREIGN KEY (ep_id) REFERENCES dim_participant (ep_id) ON DELETE RESTRICT,
    CONSTRAINT fk_fact_host FOREIGN KEY (host_lc) REFERENCES dim_host (host_lc) ON DELETE RESTRICT,
    CONSTRAINT fk_fact_product FOREIGN KEY (product_id) REFERENCES dim_product (product_id) ON DELETE RESTRICT,
    CONSTRAINT fk_fact_rejection FOREIGN KEY (reason_id) REFERENCES dim_rejection_reason (reason_id) ON DELETE RESTRICT,
    CONSTRAINT fk_fact_date FOREIGN KEY (applied_date_id) REFERENCES dim_date (date_id) ON DELETE RESTRICT
);

-- Pembuatan Indeks untuk Kueri Analitik Cepat pada Dashboard
CREATE INDEX IF NOT EXISTS idx_fact_product ON fact_exchange_application(product_id);
CREATE INDEX IF NOT EXISTS idx_fact_host ON fact_exchange_application(host_lc);
CREATE INDEX IF NOT EXISTS idx_fact_applied_date ON fact_exchange_application(applied_date_id);
CREATE INDEX IF NOT EXISTS idx_fact_status ON fact_exchange_application(status);
CREATE INDEX IF NOT EXISTS idx_fact_reason ON fact_exchange_application(reason_id);
