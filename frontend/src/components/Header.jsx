import React from 'react';
import {
  Database,
  RefreshCw,
  Menu,
  Filter,
  Download,
  WifiOff
} from 'lucide-react';

const PAGE_META = {
  overview: {
    badge: 'Halaman 1',
    title: 'Ringkasan Utama: Kinerja Departemen Outgoing Exchange',
    desc: 'Tinjauan komprehensif performa pendaftaran, distribusi tahapan seleksi peserta, capaian program, dan tingkat kelulusan peserta pertukaran pemuda internasional.'
  },
  trends: {
    badge: 'Halaman 2',
    title: 'Tren Pendaftaran: Dinamika Waktu dan Musim Puncak',
    desc: 'Analisis deret waktu pendaftaran bulanan, dinamika status peserta, pola musim puncak (peak seasons), dan preferensi durasi program.'
  },
  funnel: {
    badge: 'Halaman 3',
    title: 'Tahapan Seleksi: Efisiensi Konversi dan Hambatan',
    desc: 'Evaluasi rasio perpindahan peserta antartahap, rata-rata hari pemrosesan, titik terjadinya penolakan, dan perbandingan kecepatan antarnegara mitra.'
  },
  destinations: {
    badge: 'Halaman 4',
    title: 'Negara Tujuan: Sebaran Global dan Kemitraan Kampus',
    desc: 'Sebaran geografis negara tujuan pelamar Universitas Andalas dan rincian performa komite lokal/universitas mitra di seluruh dunia.'
  },
  rejections: {
    badge: 'Halaman 5',
    title: 'Alasan Penolakan: Mitigasi Kasus dan Solusi Operasional',
    desc: 'Identifikasi akar penyebab penolakan aplikasi pelamar dan mesin rekomendasi taktis terotomatisasi bagi tim Customer Experience.'
  }
};

export default function Header({
  activeTab,
  isDbConnected,
  onRefresh,
  isLoading,
  onToggleMobileMenu,
  onToggleMobileFilter,
  onInstallPwa,
  canInstallPwa,
  isOffline
}) {
  const meta = PAGE_META[activeTab] || PAGE_META.overview;

  return (
    <>
      {/* Offline Mode Banner */}
      {isOffline && (
        <div className="bg-amber-500 text-slate-900 px-4 py-1.5 text-xs font-bold text-center flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Mode Luring Aktif: Menampilkan data tersimpan dari cache lokal.</span>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-5 sticky top-0 z-20 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0 cursor-pointer"
              title="Buka Menu Navigasi"
              aria-label="Buka Menu Navigasi"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#037EF3] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {meta.badge}
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-slate-500 truncate max-w-xs sm:max-w-none">
                  AIESEC in Universitas Andalas - OGX BI
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                {meta.title}
              </h1>
              <p className="text-xs text-slate-600 mt-0.5 hidden sm:block">
                {meta.desc}
              </p>
            </div>
          </div>

          {/* Action Tools & Status */}
          <div className="flex items-center gap-2 sm:gap-3 self-end lg:self-center">
            {/* Mobile Filter Button */}
            <button
              onClick={onToggleMobileFilter}
              className="lg:hidden flex items-center gap-1.5 bg-[#037EF3] text-white px-3 py-2 rounded-xl text-xs font-bold shadow-xs min-h-[44px] cursor-pointer"
              title="Buka Penyaring Data"
            >
              <Filter className="w-4 h-4" />
              <span>Filter Data</span>
            </button>

            {/* PWA Install Button */}
            {canInstallPwa && (
              <button
                onClick={onInstallPwa}
                className="flex items-center gap-1.5 bg-[#0A2540] hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] cursor-pointer shadow-xs"
                title="Pasang Aplikasi ExpaLens BI di Perangkat Anda"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Pasang Aplikasi</span>
              </button>
            )}

            {/* DB Status Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>PostgreSQL aiesec_dw</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 transition-colors cursor-pointer disabled:opacity-50 min-h-[44px]"
              title="Segarkan Data Kueri"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#037EF3]' : ''}`} />
              <span className="hidden sm:inline">Segarkan</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
