import React from 'react';
import {
  RefreshCw,
  Menu,
  Download,
  WifiOff
} from 'lucide-react';

const PAGE_META = {
  overview: {
    title: 'Ringkasan Utama Kinerja Outgoing Exchange',
    desc: 'Tinjauan performa pendaftaran, distribusi tahapan seleksi peserta, capaian program, dan tingkat kelulusan peserta pertukaran pemuda internasional.'
  },
  trends: {
    title: 'Tren Pendaftaran dan Musim Puncak',
    desc: 'Analisis deret waktu pendaftaran bulanan, dinamika status peserta, pola musim puncak (peak seasons), dan preferensi durasi program.'
  },
  funnel: {
    title: 'Tahapan Seleksi dan Efisiensi Konversi',
    desc: 'Evaluasi rasio perpindahan peserta antartahap, rata-rata hari pemrosesan, titik terjadinya penolakan, dan perbandingan kecepatan antarnegara mitra.'
  },
  destinations: {
    title: 'Peta dan Sebaran Negara Tujuan',
    desc: 'Sebaran geografis negara tujuan pelamar Universitas Andalas dan performa komite lokal/universitas mitra di seluruh dunia.'
  },
  rejections: {
    title: 'Analisis Penolakan dan Rekomendasi Solusi',
    desc: 'Identifikasi akar penyebab penolakan aplikasi pelamar dan rekomendasi tindakan perbaikan bagi tim Customer Experience.'
  }
};

export default function Header({
  activeTab,
  onRefresh,
  isLoading,
  onToggleMobileMenu,
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
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {meta.title}
              </h1>
              <p className="text-xs text-slate-600 mt-1 hidden sm:block">
                {meta.desc}
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3 self-end lg:self-center">
            {/* PWA Install Button */}
            {canInstallPwa && (
              <button
                onClick={onInstallPwa}
                className="flex items-center gap-1.5 bg-[#0A2540] hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] cursor-pointer shadow-xs"
                title="Pasang Aplikasi ExpaLens BI di Perangkat Anda"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Pasang Aplikasi</span>
              </button>
            )}

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 transition-colors cursor-pointer disabled:opacity-50 min-h-[40px]"
              title="Segarkan Data Kueri"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#037EF3]' : ''}`} />
              <span className="hidden sm:inline">Segarkan Data</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
