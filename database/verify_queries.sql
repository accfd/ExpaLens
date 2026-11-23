-- ==============================================================================
-- KUERI VERIFIKASI & REKONSILIASI DATA MART POSTGRESQL (aiesec_dw)
-- Sesuai Catatan Validasi: PRD.md Bab 4.3 & Pipeline_ETL.ipynb Cell 22
-- ==============================================================================

-- 1. Pengecekan Jumlah Baris Seluruh Tabel
SELECT 'fact_exchange_application' AS table_name, COUNT(*) AS row_count, 'Target: ~75,520 - 75,522 baris' AS status FROM fact_exchange_application
UNION ALL
SELECT 'dim_participant', COUNT(*), 'Target: ~3,703 - 3,704 baris' FROM dim_participant
UNION ALL
SELECT 'dim_host', COUNT(*), 'Target: 491 baris' FROM dim_host
UNION ALL
SELECT 'dim_product', COUNT(*), 'Target: 3 baris (GV, GTa, GTe)' FROM dim_product
UNION ALL
SELECT 'dim_rejection_reason', COUNT(*), 'Target: 13 baris (12 Alasan + Not Rejected)' FROM dim_rejection_reason
UNION ALL
SELECT 'dim_date', COUNT(*), 'Target: 2,557 baris (2020-2026)' FROM dim_date;

-- 2. Pengecekan Integritas Kunci Asing (Foreign Key Orphan Check)
SELECT 'Orphan Participant FK' AS check_name, COUNT(*) AS invalid_count
FROM fact_exchange_application f
LEFT JOIN dim_participant d ON f.ep_id = d.ep_id
WHERE d.ep_id IS NULL
UNION ALL
SELECT 'Orphan Host FK', COUNT(*)
FROM fact_exchange_application f
LEFT JOIN dim_host d ON f.host_lc = d.host_lc
WHERE d.host_lc IS NULL
UNION ALL
SELECT 'Orphan Product FK', COUNT(*)
FROM fact_exchange_application f
LEFT JOIN dim_product d ON f.product_id = d.product_id
WHERE d.product_id IS NULL
UNION ALL
SELECT 'Orphan Reason FK', COUNT(*)
FROM fact_exchange_application f
LEFT JOIN dim_rejection_reason d ON f.reason_id = d.reason_id
WHERE d.reason_id IS NULL
UNION ALL
SELECT 'Orphan Date FK', COUNT(*)
FROM fact_exchange_application f
LEFT JOIN dim_date d ON f.applied_date_id = d.date_id
WHERE d.date_id IS NULL;
