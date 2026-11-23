import React from 'react';
import {
  CheckCircle2,
  FileCheck2,
  Plane,
  Award
} from 'lucide-react';

const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('id-ID');
};

const formatPercent = (num, decimals = 1) => {
  if (num === null || num === undefined) return '0,0%';
  return Number(num).toFixed(decimals).replace('.', ',') + '%';
};

export default function Overview({ data, isLoading }) {
  if (isLoading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500">
        <div className="w-8 h-8 border-4 border-[#037EF3] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold">Memuat data analitik...</p>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const totalApps = kpis.total_applications || kpis.total_applied || 0;
  const totalAccepted = kpis.total_accepted || 0;
  const totalApproved = kpis.total_approved || 0;
  const totalRealized = kpis.total_realized || 0;
  const totalFinished = kpis.total_finished || 0;

  const productBreakdown = data?.product_breakdown || [];

  // Funnel 5 Tahapan Resmi AIESEC
  const funnelSteps = [
    {
      stageNumber: 1,
      stageName: 'Applied',
      stageLabel: 'Pendaftaran Awal',
      count: totalApps,
      retention: 100.0,
      widthPercent: 100,
      bgColor: 'bg-[#037EF3]',
      textColor: 'text-[#037EF3]',
      borderColor: 'border-blue-300',
      dropOff: totalApps > 0 ? ((totalApps - totalAccepted) / totalApps) * 100 : 0
    },
    {
      stageNumber: 2,
      stageName: 'Accepted',
      stageLabel: 'Lulus Seleksi Berkas',
      count: totalAccepted,
      retention: totalApps > 0 ? (totalAccepted / totalApps) * 100 : 0,
      widthPercent: 78,
      bgColor: 'bg-[#0A8EA0]',
      textColor: 'text-[#0A8EA0]',
      borderColor: 'border-teal-300',
      dropOff: totalAccepted > 0 ? ((totalAccepted - totalApproved) / totalAccepted) * 100 : 0
    },
    {
      stageNumber: 3,
      stageName: 'Approved',
      stageLabel: 'Penandatanganan Kontrak',
      count: totalApproved,
      retention: totalApps > 0 ? (totalApproved / totalApps) * 100 : 0,
      widthPercent: 62,
      bgColor: 'bg-[#F48924]',
      textColor: 'text-[#F48924]',
      borderColor: 'border-orange-300',
      dropOff: totalApproved > 0 ? ((totalApproved - totalRealized) / totalApproved) * 100 : null
    },
    {
      stageNumber: 4,
      stageName: 'Realized',
      stageLabel: 'Berangkat ke Negara Mitra',
      count: totalRealized,
      retention: totalApps > 0 ? (totalRealized / totalApps) * 100 : 0,
      widthPercent: 48,
      bgColor: 'bg-purple-600',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-300',
      dropOff: totalRealized > 0 ? ((totalRealized - totalFinished) / totalRealized) * 100 : null
    },
    {
      stageNumber: 5,
      stageName: 'Finished',
      stageLabel: 'Menyelesaikan Program',
      count: totalFinished,
      retention: totalApps > 0 ? (totalFinished / totalApps) * 100 : 0,
      widthPercent: 36,
      bgColor: 'bg-emerald-600',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-300',
      dropOff: null
    }
  ];

  return (
    <div className="space-y-3.5">
      {/* BARIS 1: HERO CARD & CUSTOMER FUNNEL */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Kolom Kiri: Hero Card Midnight Navy */}
        <div className="lg:col-span-4 bg-[#0A2540] text-white rounded-xl p-4 shadow-xs border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                TOTAL PENDAFTARAN
              </span>
            </div>

            <div className="mt-2.5">
              <div className="text-3xl lg:text-4xl font-black tracking-tight text-white">
                {formatNumber(totalApps)}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Seluruh aplikasi pelamar pertukaran pemuda yang terekam pada sistem CRM Expa.
              </p>
            </div>
          </div>

          {/* Tabel Rincian Program */}
          <div className="mt-3 pt-3 border-t border-slate-700/80">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Distribusi Volume Program
            </h4>
            <div className="space-y-1.5">
              {productBreakdown.map((item, idx) => {
                const prodName = item.product_name || item.product || '';
                const count = item.total_apps || item.count || 0;
                const pct = totalApps > 0 ? (count / totalApps) * 100 : 0;

                let badgeColor = 'bg-slate-700 text-slate-200';
                let accentColor = '#0A8EA0';
                if (prodName.includes('GTa') || prodName.includes('Talent')) {
                  badgeColor = 'bg-[#0A8EA0]/20 text-[#0A8EA0] border border-[#0A8EA0]/30';
                  accentColor = '#0A8EA0';
                } else if (prodName.includes('GTe') || prodName.includes('Teacher')) {
                  badgeColor = 'bg-[#F48924]/20 text-[#F48924] border border-[#F48924]/30';
                  accentColor = '#F48924';
                } else if (prodName.includes('GV') || prodName.includes('Volunteer')) {
                  badgeColor = 'bg-[#F85A40]/20 text-[#F85A40] border border-[#F85A40]/30';
                  accentColor = '#F85A40';
                }

                return (
                  <div key={idx} className="flex items-center justify-between bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accentColor }}></span>
                      <span className="text-xs font-bold text-slate-200">{prodName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">{formatNumber(count)}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${badgeColor}`}>
                        {formatPercent(pct)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Customer Funnel Visual */}
        <div className="lg:col-span-8 bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Distribusi Peserta pada Tahapan Seleksi (Customer Funnel)
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
              Alur retensi peserta dari pendaftaran awal hingga menyelesaikan masa program.
            </p>
          </div>

          {/* Symmetrical Centered Funnel Tiers */}
          <div className="my-1.5 flex flex-col items-center space-y-0.5 w-full">
            {funnelSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                {/* Funnel Stage Bar */}
                <div
                  style={{ width: `${step.widthPercent}%` }}
                  className="transition-all duration-500 min-w-[240px]"
                >
                  <div className={`
                    rounded-lg px-2.5 py-1.5 border shadow-xs flex items-center justify-between transition-transform hover:scale-[1.01]
                    ${step.stageNumber === 1 ? 'bg-blue-50/90 border-blue-200' : 'bg-slate-50 border-slate-200'}
                  `}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-md ${step.bgColor} text-white flex items-center justify-center text-[10px] font-black shadow-xs shrink-0`}>
                        {step.stageNumber}
                      </div>
                      <div className="relative group">
                        <span className="text-xs font-bold text-slate-900 cursor-help">
                          {step.stageName}
                        </span>
                        {/* Tooltip Hover/Fokus Penjelasan Tahap */}
                        <div className="absolute left-0 bottom-full mb-1 hidden group-hover:flex items-center z-20 whitespace-nowrap bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-lg pointer-events-none transition-opacity">
                          {step.stageLabel}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xs font-black text-slate-900">
                          {formatNumber(step.count)} <span className="text-[9px] font-semibold text-slate-400">Peserta</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        step.stageNumber === 1 
                          ? 'bg-[#037EF3] text-white border-[#037EF3]' 
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}>
                        {formatPercent(step.retention)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Downward Connector with Callout */}
                {idx < funnelSteps.length - 1 && (
                  <div className="flex items-center justify-center gap-1.5 py-0">
                    <div className="h-1.5 w-0.5 bg-slate-300"></div>
                    {step.dropOff !== null && step.dropOff > 0 ? (
                      <span className="text-[8px] font-bold text-rose-600 bg-rose-50 px-1 py-0 rounded border border-rose-200">
                        -{formatPercent(step.dropOff)} Penurunan
                      </span>
                    ) : (
                      <span className="text-[8px] font-semibold text-slate-500 bg-slate-100 px-1 py-0 rounded border border-slate-200">
                        Kelanjutan Tahap
                      </span>
                    )}
                    <div className="h-1.5 w-0.5 bg-slate-300"></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* BARIS 2: 4 MILESTONE UTAMA SELEKSI (ACCEPTED, APPROVED, REALIZED, FINISHED) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Kartu 1: Total Accepted */}
        <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              TOTAL ACCEPTED
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#037EF3] flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {formatNumber(totalAccepted)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Lolos Seleksi Berkas & Wawancara
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#037EF3] bg-blue-50 px-1.5 py-0.5 rounded">
              Tahap 2 Seleksi
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {formatPercent(totalApps > 0 ? (totalAccepted / totalApps) * 100 : 0)} dari Applied
            </span>
          </div>
        </div>

        {/* Kartu 2: Total Approved */}
        <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              TOTAL APPROVED
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0A8EA0] flex items-center justify-center">
              <FileCheck2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {formatNumber(totalApproved)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pembayaran Biaya & TTD Kontrak
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#0A8EA0] bg-teal-50 px-1.5 py-0.5 rounded">
              Tahap 3 Kontrak
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {formatPercent(totalAccepted > 0 ? (totalApproved / totalAccepted) * 100 : 0)} dari Accepted
            </span>
          </div>
        </div>

        {/* Kartu 3: Total Realized */}
        <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              TOTAL REALIZED
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Plane className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {formatNumber(totalRealized)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Peserta Berangkat ke Luar Negeri
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
              Tahap 4 Realisasi
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {formatPercent(totalApproved > 0 ? (totalRealized / totalApproved) * 100 : 0)} dari Approved
            </span>
          </div>
        </div>

        {/* Kartu 4: Total Finished */}
        <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              TOTAL FINISHED
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {formatNumber(totalFinished)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Menyelesaikan Masa Program
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Kelulusan Akhir
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {formatPercent(totalRealized > 0 ? (totalFinished / totalRealized) * 100 : 0)} dari Realized
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
