import React from 'react';
import {
  CheckCircle2,
  FileCheck2,
  Plane,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500 font-sans">
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

  // Formula kalkulasi baku: (Total Finished / Total Accepted) * 100
  const finishRate = totalAccepted > 0 ? (totalFinished / totalAccepted) * 100 : 0;

  const productBreakdown = data?.product_breakdown || [];
  const programPerformance = data?.achievements || [];

  // Alur Retensi 5 Tahapan Resmi Funnel
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
      borderColor: 'border-blue-200',
      dropOff: totalApps > 0 ? ((totalApps - totalAccepted) / totalApps) * 100 : 0
    },
    {
      stageNumber: 2,
      stageName: 'Accepted',
      stageLabel: 'Lolos Seleksi Berkas & Wawancara',
      count: totalAccepted,
      retention: totalApps > 0 ? (totalAccepted / totalApps) * 100 : 0,
      widthPercent: 82,
      bgColor: 'bg-[#0A8EA0]',
      textColor: 'text-[#0A8EA0]',
      borderColor: 'border-teal-200',
      dropOff: totalAccepted > 0 ? ((totalAccepted - totalApproved) / totalAccepted) * 100 : 0
    },
    {
      stageNumber: 3,
      stageName: 'Approved',
      stageLabel: 'Pembayaran Biaya & TTD Kontrak',
      count: totalApproved,
      retention: totalApps > 0 ? (totalApproved / totalApps) * 100 : 0,
      widthPercent: 66,
      bgColor: 'bg-[#0A2540]',
      textColor: 'text-[#0A2540]',
      borderColor: 'border-slate-300',
      dropOff: totalApproved > 0 ? ((totalApproved - totalRealized) / totalApproved) * 100 : 0
    },
    {
      stageNumber: 4,
      stageName: 'Realized',
      stageLabel: 'Peserta Berangkat ke Luar Negeri',
      count: totalRealized,
      retention: totalApps > 0 ? (totalRealized / totalApps) * 100 : 0,
      widthPercent: 50,
      bgColor: 'bg-[#F48924]',
      textColor: 'text-[#F48924]',
      borderColor: 'border-orange-200',
      dropOff: totalRealized > 0 ? ((totalRealized - totalFinished) / totalRealized) * 100 : 0
    },
    {
      stageNumber: 5,
      stageName: 'Finished',
      stageLabel: 'Menyelesaikan Masa Program',
      count: totalFinished,
      retention: totalApps > 0 ? (totalFinished / totalApps) * 100 : 0,
      widthPercent: 38,
      bgColor: 'bg-[#10B981]',
      textColor: 'text-[#10B981]',
      borderColor: 'border-emerald-200',
      dropOff: null
    }
  ];

  const clampedFinishRate = Math.min(Math.max(finishRate, 0), 100);
  const gaugeAngle = -90 + (clampedFinishRate / 100) * 180;

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* =========================================================================
          LAYAR PERTAMA (ABOVE THE FOLD): HERO CARD & RETENTION FUNNEL
      ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Kolom Kiri (Lebar 5/12): Hero Card Midnight Navy (#0A2540) */}
        <div className="lg:col-span-5 bg-[#0A2540] text-white rounded-2xl p-5 shadow-xs border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                TOTAL PENDAFTARAN
              </span>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                CRM Expa
              </span>
            </div>

            <div className="mt-3">
              <div className="text-4xl lg:text-5xl font-black tracking-tight text-white">
                {formatNumber(totalApps)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Seluruh aplikasi pelamar pertukaran pemuda terdata pada sistem CRM Expa.
              </p>
            </div>
          </div>

          {/* Rincian Distribusi Volume Program */}
          <div className="mt-4 pt-3.5 border-t border-slate-700/80">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Distribusi Volume Program
            </h4>
            <div className="space-y-1.5">
              {productBreakdown.map((item, idx) => {
                const prodName = item.product_name || item.product || '';
                const count = item.total_apps || item.count || 0;
                const pct = totalApps > 0 ? (count / totalApps) * 100 : 0;

                let badgeColor = 'bg-slate-700 text-slate-200';
                let dotColor = '#0A8EA0';
                if (prodName.includes('GTa') || prodName.includes('Talent')) {
                  badgeColor = 'bg-[#0A8EA0]/20 text-[#0A8EA0] border border-[#0A8EA0]/30';
                  dotColor = '#0A8EA0';
                } else if (prodName.includes('GTe') || prodName.includes('Teacher')) {
                  badgeColor = 'bg-[#F48924]/20 text-[#F48924] border border-[#F48924]/30';
                  dotColor = '#F48924';
                } else if (prodName.includes('GV') || prodName.includes('Volunteer')) {
                  badgeColor = 'bg-[#F85A40]/20 text-[#F85A40] border border-[#F85A40]/30';
                  dotColor = '#F85A40';
                }

                return (
                  <div key={idx} className="flex items-center justify-between bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }}></span>
                      <span className="text-xs font-bold text-slate-200">{prodName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">{formatNumber(count)}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeColor}`}>
                        {formatPercent(pct)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Kolom Kanan (Lebar 7/12): Alur Retensi Seleksi Peserta (Customer Funnel) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Distribusi Peserta pada Tahapan Seleksi
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Alur retensi peserta dari pendaftaran awal hingga menyelesaikan masa program.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              5 Tahap Seleksi
            </span>
          </div>

          {/* Symmetrical Centered Funnel Tiers */}
          <div className="my-2 flex flex-col items-center space-y-1 w-full">
            {funnelSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                {/* Funnel Stage Bar */}
                <div
                  style={{ width: `${step.widthPercent}%` }}
                  className="transition-all duration-500 min-w-[240px]"
                >
                  <div className={`
                    rounded-lg px-3 py-1.5 border shadow-xs flex items-center justify-between transition-transform hover:scale-[1.01]
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
                        {/* Tooltip Hover Keterangan Tahap */}
                        <div className="absolute left-0 bottom-full mb-1 hidden group-hover:flex items-center z-20 whitespace-nowrap bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-lg pointer-events-none">
                          {step.stageLabel}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xs font-black text-slate-900">
                          {formatNumber(step.count)} <span className="text-[10px] font-semibold text-slate-400">Peserta</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        step.stageNumber === 1 
                          ? 'bg-[#037EF3] text-white border-[#037EF3]' 
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}>
                        {formatPercent(step.retention)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Downward Connector with Drop-Off Callout */}
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

      {/* =========================================================================
          BARIS BAWAH LAYAR PERTAMA: 4 KARTU MILESTONE SELEKSI
      ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kartu 1: Total Accepted */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              TOTAL ACCEPTED
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#037EF3] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {formatNumber(totalAccepted)}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Lolos Seleksi Berkas & Wawancara
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#037EF3] bg-blue-50 px-2 py-0.5 rounded">
              Tahap 2 Seleksi
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {formatPercent(totalApps > 0 ? (totalAccepted / totalApps) * 100 : 0)} dari Applied
            </span>
          </div>
        </div>

        {/* Kartu 2: Total Approved */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              TOTAL APPROVED
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0A8EA0] flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {formatNumber(totalApproved)}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pembayaran Biaya & TTD Kontrak
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#0A8EA0] bg-teal-50 px-2 py-0.5 rounded">
              Tahap 3 Kontrak
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {formatPercent(totalAccepted > 0 ? (totalApproved / totalAccepted) * 100 : 0)} dari Accepted
            </span>
          </div>
        </div>

        {/* Kartu 3: Total Realized */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              TOTAL REALIZED
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#F48924] flex items-center justify-center">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {formatNumber(totalRealized)}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Peserta Berangkat ke Luar Negeri
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#F48924] bg-orange-50 px-2 py-0.5 rounded">
              Tahap 4 Realisasi
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {formatPercent(totalApproved > 0 ? (totalRealized / totalApproved) * 100 : 0)} dari Approved
            </span>
          </div>
        </div>

        {/* Kartu 4: Total Finished */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              TOTAL FINISHED
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#10B981] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {formatNumber(totalFinished)}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Menyelesaikan Masa Program
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded">
              Kelulusan Akhir
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {formatPercent(totalRealized > 0 ? (totalFinished / totalRealized) * 100 : 0)} dari Realized
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LAYAR KEDUA (BELOW THE FOLD): GRAFIK KOMPARASI & SPEEDOMETER GAUGE
      ========================================================================= */}
      <section className="pt-8 mt-6 border-t border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Kolom Kiri (Lebar 7/12): Clustered Column Bar Chart */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Capaian Tahapan Seleksi Berdasarkan Jenis Program
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Perbandingan volume peserta Accepted, Approved, Realized, dan Finished.
              </p>
            </div>

            <div className="h-72 sm:h-80 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={programPerformance}
                  margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="product_name"
                    tick={{ fill: '#334155', fontSize: 12, fontWeight: 700 }}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#64748B', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value, name) => [formatNumber(value) + ' Peserta', name]}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                  <Bar dataKey="accepted" name="Accepted (Diterima)" fill="#037EF3" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="accepted" position="top" style={{ fontSize: '10px', fill: '#037EF3', fontWeight: 'bold' }} />
                  </Bar>
                  <Bar dataKey="approved" name="Approved (Disetujui)" fill="#0A8EA0" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="approved" position="top" style={{ fontSize: '10px', fill: '#0A8EA0', fontWeight: 'bold' }} />
                  </Bar>
                  <Bar dataKey="realized" name="Realized (Berangkat)" fill="#F48924" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="realized" position="top" style={{ fontSize: '10px', fill: '#F48924', fontWeight: 'bold' }} />
                  </Bar>
                  <Bar dataKey="finished" name="Finished (Selesai)" fill="#10B981" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="finished" position="top" style={{ fontSize: '10px', fill: '#10B981', fontWeight: 'bold' }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>GTa: Global Talent, GTe: Global Teacher, GV: Global Volunteer</span>
            </div>
          </div>

          {/* Kolom Kanan (Lebar 5/12): Semi-circle Speedometer SVG Gauge */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Tingkat Kelulusan Program
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rasio penyelesaian program terhadap seluruh peserta yang diterima.
              </p>
            </div>

            {/* Speedometer SVG Gauge */}
            <div className="my-4 flex flex-col items-center justify-center">
              <div className="relative w-64 sm:w-72 h-36 sm:h-40 overflow-hidden flex items-end justify-center">
                <svg viewBox="0 0 200 110" className="w-full h-full">
                  {/* Track Latar Belakang */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  {/* Arc Progres AIESEC Blue */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#037EF3"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeDasharray="251.3"
                    strokeDashoffset={251.3 * (1 - clampedFinishRate / 100)}
                    className="transition-all duration-700 ease-out"
                  />

                  {/* Jarum Indikator Midnight Navy (#0A2540) */}
                  <g transform={`rotate(${gaugeAngle}, 100, 100)`}>
                    <polygon
                      points="97,100 103,100 100,28"
                      fill="#0A2540"
                    />
                    <circle cx="100" cy="100" r="7" fill="#0A2540" />
                    <circle cx="100" cy="100" r="3" fill="#FFFFFF" />
                  </g>
                </svg>
              </div>

              {/* Nilai Utama Gauge */}
              <div className="text-center mt-2">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {formatPercent(finishRate)}
                </div>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  {formatNumber(totalFinished)} Selesai dari {formatNumber(totalAccepted)} Diterima
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Formula: (Total Finished / Total Accepted) x 100%</span>
              <span className="font-semibold text-slate-700">Skala 0% - 100%</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
