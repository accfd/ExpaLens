import React from 'react';
import {
  Users,
  CheckCircle2,
  Plane,
  Award,
  Clock,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart2,
  Filter,
  Info
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

// Helper pemformat angka lokal Indonesia
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
        <p className="text-sm font-semibold">Memuat data dari PostgreSQL aiesec_dw...</p>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const totalApps = kpis.total_applications || kpis.total_applied || 0;
  const totalAccepted = kpis.total_accepted || 0;
  const totalApproved = kpis.total_approved || 0;
  const totalRealized = kpis.total_realized || 0;
  const totalFinished = kpis.total_finished || 0;
  const finishRate = kpis.finish_rate || (totalAccepted > 0 ? (totalFinished / totalAccepted) * 100 : 0);
  const avgDays = kpis.avg_days_to_accept || 0;

  const productBreakdown = data?.product_breakdown || [];
  const programPerformance = data?.achievements || [];
  const yoy = data?.yoy || {
    yoy_pct: 0,
    current_year: 2024,
    prev_year: 2023,
    is_positive: true
  };

  // Funnel 5 Tahapan Resmi AIESEC: Applied -> Accepted -> Approved -> Realized -> Finished
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
      widthPercent: 60,
      bgColor: 'bg-[#F48924]',
      textColor: 'text-[#F48924]',
      borderColor: 'border-orange-300',
      dropOff: totalApproved > 0 ? ((totalApproved - totalRealized) / totalApproved) * 100 : 0
    },
    {
      stageNumber: 4,
      stageName: 'Realized',
      stageLabel: 'Berangkat ke Negara Mitra',
      count: totalRealized,
      retention: totalApps > 0 ? (totalRealized / totalApps) * 100 : 0,
      widthPercent: 44,
      bgColor: 'bg-purple-600',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-300',
      dropOff: null,
      note: 'Stempel tanggal berangkat diisi Host LC'
    },
    {
      stageNumber: 5,
      stageName: 'Finished',
      stageLabel: 'Menyelesaikan Program',
      count: totalFinished,
      retention: totalApps > 0 ? (totalFinished / totalApps) * 100 : 0,
      widthPercent: 48,
      bgColor: 'bg-emerald-600',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-300',
      dropOff: null,
      note: 'Termasuk proyek semi-remote & evaluasi akhir'
    }
  ];

  // Hitung sudut jarum speedometer gauge
  const clampedFinishRate = Math.min(Math.max(finishRate, 0), 100);
  const gaugeAngle = -90 + (clampedFinishRate / 100) * 180;

  return (
    <div className="space-y-6">
      {/* BARIS 1: HERO CARD & CUSTOMER FUNNEL */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Hero Card Midnight Navy */}
        <div className="lg:col-span-4 bg-[#0A2540] text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                TOTAL PENDAFTARAN
              </span>
              <span className="text-[10px] font-semibold bg-blue-500/20 text-[#037EF3] px-2 py-0.5 rounded-full border border-blue-400/30">
                fact_exchange_application
              </span>
            </div>

            <div className="mt-5">
              <div className="text-4xl lg:text-5xl font-black tracking-tight text-white">
                {formatNumber(totalApps)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Seluruh aplikasi pelamar pertukaran pemuda yang terekam pada sistem CRM Expa.
              </p>
            </div>
          </div>

          {/* Tabel Rincian Program */}
          <div className="mt-8 pt-5 border-t border-slate-700/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Distribusi Volume Program
            </h4>
            <div className="space-y-2.5">
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
                  <div key={idx} className="flex items-center justify-between bg-slate-900/60 px-3.5 py-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
                      <span className="text-xs font-bold text-slate-200">{prodName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">{formatNumber(count)}</span>
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

        {/* Kolom Kanan: Customer Funnel Visual (Lengkap 5 Tahap AIESEC) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Distribusi Peserta pada Tahapan Seleksi (Customer Funnel)
              </h3>
              <p className="text-xs text-slate-500">
                Alur resmi 5 tahapan AIESEC: Applied, Accepted, Approved, Realized, dan Finished.
              </p>
            </div>
            <span className="text-xs font-bold text-[#037EF3] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Poin 2: Funnel Chart
            </span>
          </div>

          {/* Symmetrical Centered Funnel Tiers */}
          <div className="my-4 flex flex-col items-center space-y-1.5 w-full">
            {funnelSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                {/* Funnel Stage Bar */}
                <div
                  style={{ width: `${step.widthPercent}%` }}
                  className="transition-all duration-500 min-w-[280px]"
                >
                  <div className={`
                    rounded-xl p-3 border shadow-xs flex items-center justify-between transition-transform hover:scale-[1.01]
                    ${step.stageNumber === 1 ? 'bg-blue-50/90 border-blue-200' : 'bg-slate-50 border-slate-200'}
                  `}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-lg ${step.bgColor} text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0`}>
                        {step.stageNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900">{step.stageName}</span>
                          <span className="text-[10px] text-slate-500 hidden sm:inline">({step.stageLabel})</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900">
                          {formatNumber(step.count)} <span className="text-[10px] font-semibold text-slate-400">Peserta</span>
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
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
                  <div className="flex items-center justify-center gap-2 py-0.5">
                    <div className="h-3 w-0.5 bg-slate-300"></div>
                    {step.dropOff !== null && step.dropOff > 0 ? (
                      <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                        -{formatPercent(step.dropOff)} Penurunan
                      </span>
                    ) : idx === 3 ? (
                      <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200" title="Host LC langsung menandai Finished pada proyek semi-remote tanpa mencatat tanggal Realized">
                        Fase Penyelesaian Program
                      </span>
                    ) : null}
                    <div className="h-3 w-0.5 bg-slate-300"></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Catatan Transparansi Data CRM */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Info className="w-3.5 h-3.5 text-[#037EF3] shrink-0" />
              <span>Realized (418) mencatat stempel tanggal keberangkatan fisik; Finished (642) mencakup proyek semi-remote.</span>
            </div>
            <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[10px]">
              Drop-off terbesar: Applied ke Accepted (-97,9%)
            </span>
          </div>
        </div>
      </section>

      {/* BARIS 2: KARTU INDIKATOR KINERJA UTAMA & YOY */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Kartu 1: Total Realized */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              TOTAL REALIZED
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {formatNumber(totalRealized)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Peserta Berangkat ke Luar Negeri
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              Realisasi Aktif
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {formatPercent(totalApps ? (totalRealized / totalApps) * 100 : 0)} konversi
            </span>
          </div>
        </div>

        {/* Kartu 2: Total Finished */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              TOTAL FINISHED
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {formatNumber(totalFinished)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Peserta Menyelesaikan Program
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Kelulusan Evaluasi
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {formatPercent(totalApps ? (totalFinished / totalApps) * 100 : 0)} kelulusan
            </span>
          </div>
        </div>

        {/* Kartu 3: Finish Rate */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              FINISH RATE
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#037EF3] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-[#037EF3] tracking-tight">
              {formatPercent(finishRate)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Rasio Kelulusan dari Peserta Diterima
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#037EF3] bg-blue-50 px-2 py-0.5 rounded">
              Target Departemen: 50,0%
            </span>
            <span className={`text-xs font-bold ${finishRate >= 50 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {finishRate >= 50 ? 'Tercapai' : 'Perlu Perhatian'}
            </span>
          </div>
        </div>

        {/* Kartu 4: Rata-Rata Waktu Seleksi */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              WAKTU PROSES SELEKSI
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {Number(avgDays).toFixed(1).replace('.', ',')} <span className="text-lg font-bold text-slate-500">Hari</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Rata-rata Durasi Applied ke Accepted
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              Days to Accept
            </span>
            {yoy?.yoy_pct !== undefined ? (
              <span className={`text-xs font-bold flex items-center gap-1 ${yoy.yoy_pct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {yoy.yoy_pct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {yoy.yoy_pct >= 0 ? '+' : ''}{formatPercent(yoy.yoy_pct)} YoY
              </span>
            ) : (
              <span className="text-xs text-slate-400">Baseline 2021</span>
            )}
          </div>
        </div>
      </section>

      {/* BARIS 3: CAPAIAN PROGRAM & GAUGE CHART KELULUSAN */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Clustered Column Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Capaian Tahapan Seleksi Berdasarkan Jenis Program
              </h3>
              <p className="text-xs text-slate-500">
                Perbandingan volume peserta Accepted, Approved, Realized, dan Finished per program pertukaran.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
              Poin 3: Clustered Column
            </span>
          </div>

          <div className="h-80 w-full mt-4">
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
            <span className="font-semibold text-slate-700">Sumber: fact_exchange_application</span>
          </div>
        </div>

        {/* Kolom Kanan: Radial Gauge Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Tingkat Keberhasilan Program (Finish Rate)
              </h3>
              <p className="text-xs text-slate-500">
                Persentase peserta menyelesaikan program dibandingkan yang diterima.
              </p>
            </div>
            <span className="text-xs font-bold text-[#037EF3] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Poin 4: Gauge Visual
            </span>
          </div>

          {/* Semi-circle Speedometer SVG Gauge */}
          <div className="my-4 flex flex-col items-center justify-center">
            <div className="relative w-72 h-40 overflow-hidden flex items-end justify-center">
              <svg viewBox="0 0 200 110" className="w-full h-full">
                {/* Zona Merah: 0% - 30% */}
                <path
                  d="M 20 100 A 80 80 0 0 1 35.2 53"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                {/* Zona Kuning: 30% - 60% */}
                <path
                  d="M 35.2 53 A 80 80 0 0 1 124.7 23.9"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="18"
                />
                {/* Zona Hijau: 60% - 100% */}
                <path
                  d="M 124.7 23.9 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="18"
                  strokeLinecap="round"
                />

                {/* Garis Ambang Batas Target di 50% */}
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="20"
                  stroke="#334155"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                />

                {/* Jarum Indikator AIESEC Blue */}
                <g transform={`rotate(${gaugeAngle}, 100, 100)`}>
                  <polygon
                    points="97,100 103,100 100,28"
                    fill="#037EF3"
                  />
                  <circle cx="100" cy="100" r="7" fill="#0A2540" />
                  <circle cx="100" cy="100" r="3" fill="#FFFFFF" />
                </g>
              </svg>
            </div>

            {/* Nilai Utama Gauge */}
            <div className="text-center mt-2">
              <div className="text-4xl font-black text-slate-900 tracking-tight">
                {formatPercent(finishRate)}
              </div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {formatNumber(totalFinished)} Selesai dari {formatNumber(totalAccepted)} Diterima
              </p>
            </div>

            {/* Zona Semantik Legend */}
            <div className="grid grid-cols-3 gap-2 w-full mt-4 text-[11px] text-center">
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-1.5">
                <span className="block font-bold text-rose-700">0% - 30%</span>
                <span className="text-rose-600 text-[10px]">Di Bawah Standar</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-1.5">
                <span className="block font-bold text-amber-700">30% - 60%</span>
                <span className="text-amber-600 text-[10px]">Sedang / Waspada</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-1.5">
                <span className="block font-bold text-emerald-700">60% - 100%</span>
                <span className="text-emerald-600 text-[10px]">Memenuhi Target</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Formula: (SUM(is_finished) / SUM(is_accepted)) * 100%</span>
            <span className="font-semibold text-slate-700">Garis putus-putus: Target 50,0%</span>
          </div>
        </div>
      </section>
    </div>
  );
}
