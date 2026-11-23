import React from 'react';
import { Database, ShieldCheck, RefreshCw } from 'lucide-react';

export default function Header({ totalRecords, isDbConnected, onRefresh, isLoading }) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-20 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#037EF3] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Halaman 1
            </span>
            <span className="text-xs font-medium text-slate-500">
              Departemen Outgoing Exchange AIESEC in Universitas Andalas
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Ringkasan Utama: Kinerja Departemen Outgoing Exchange
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Tinjauan komprehensif performa pendaftaran, distribusi tahapan seleksi peserta, capaian program, dan tingkat kelulusan peserta pertukaran pemuda internasional.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>PostgreSQL aiesec_dw Terhubung</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 transition-colors cursor-pointer disabled:opacity-50"
            title="Segarkan Data Kueri"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#037EF3]' : ''}`} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>
    </header>
  );
}
