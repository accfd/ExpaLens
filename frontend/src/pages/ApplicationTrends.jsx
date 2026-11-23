import React from 'react';
import {
  TrendingUp,
  Calendar,
  Layers,
  Clock,
  Users
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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

export default function ApplicationTrends({ data, isLoading }) {
  if (isLoading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500">
        <div className="w-8 h-8 border-4 border-[#037EF3] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold">Memuat analisis tren pendaftaran...</p>
      </div>
    );
  }

  const monthlyTrend = data?.monthly_trend || [];
  const statusDynamics = data?.status_dynamics || [];
  const productYearly = data?.product_yearly || [];
  const seasonalityMatrix = data?.seasonality_matrix || [];
  const preferenceMethod = data?.preference_method || [];

  // 1. Perhitungan 4 Kartu Sorotan Tren
  const totalApplicants = monthlyTrend.reduce((sum, item) => sum + (item.total_apps || 0), 0);
  
  const peakMonth = monthlyTrend.reduce((max, item) => {
    return (item.total_apps || 0) > (max?.total_apps || 0) ? item : max;
  }, null);

  const topProduct = preferenceMethod.reduce((max, item) => {
    return (item.total_apps || 0) > (max?.total_apps || 0) ? item : max;
  }, null);
  const topProductShare = totalApplicants > 0 && topProduct 
    ? (topProduct.total_apps / totalApplicants) * 100 
    : 0;

  const totalShortTerm = preferenceMethod.reduce((sum, item) => sum + (item.short_term_count || 0), 0);
  const totalLongTerm = preferenceMethod.reduce((sum, item) => sum + (item.long_term_count || 0), 0);
  const totalDuration = totalShortTerm + totalLongTerm;
  const shortTermPct = totalDuration > 0 ? (totalShortTerm / totalDuration) * 100 : 0;

  // 2. Heatmap Matriks Seasonality
  const maxSeasonalityVal = seasonalityMatrix.reduce((max, cur) => Math.max(max, cur.total_apps || 0), 1);
  const matrixYears = Array.from(new Set(seasonalityMatrix.map(m => m.year))).sort();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  const getHeatmapColor = (val) => {
    if (!val || val === 0) return 'bg-slate-50 text-slate-300';
    const ratio = val / maxSeasonalityVal;
    if (ratio > 0.75) return 'bg-[#037EF3] text-white font-black';
    if (ratio > 0.50) return 'bg-blue-400 text-white font-bold';
    if (ratio > 0.25) return 'bg-blue-200 text-blue-900 font-semibold';
    return 'bg-blue-50 text-blue-800';
  };

  return (
    <div className="space-y-5">
      {/* =========================================================================
          BARIS 1: KARTU SOROTAN METRIK TREN (QUICK HIGHLIGHTS - 4 KARTU)
      ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kartu 1: Total Pendaftar Terdata */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              TOTAL PENDAFTAR TERDATA
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#037EF3] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {formatNumber(totalApplicants)}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kumulatif Aplikasi Periode 2021–2025
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#037EF3] bg-blue-50 px-2 py-0.5 rounded">
              Basis CRM Expa
            </span>
            <span className="text-xs font-semibold text-slate-500">
              5 Tahun Rekaman
            </span>
          </div>
        </div>

        {/* Kartu 2: Bulan Puncak Tertinggi */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              BULAN PUNCAK TERTINGGI
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0A8EA0] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {peakMonth ? `${peakMonth.month_name} ${peakMonth.year}` : '-'}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              All-Time Peak Volume Pendaftaran
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#0A8EA0] bg-teal-50 px-2 py-0.5 rounded">
              Rekor Bulanan
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {peakMonth ? `${formatNumber(peakMonth.total_apps)} Pelamar` : '-'}
            </span>
          </div>
        </div>

        {/* Kartu 3: Produk Terbesar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              PRODUK DENGAN VOLUME TERBESAR
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#F48924] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {topProduct?.product_name || 'Global Talent'}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Program Pertukaran Terfavorit
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#F48924] bg-orange-50 px-2 py-0.5 rounded">
              Pangsa Minat
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {formatPercent(topProductShare)} Total Aplikasi
            </span>
          </div>
        </div>

        {/* Kartu 4: Preferensi Durasi Utama */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              PREFERENSI DURASI UTAMA
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#0A2540] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Short-Term
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Durasi Program Kurang dari 12 Minggu
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              Mayoritas
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {formatPercent(shortTermPct)} Dominasi
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BARIS 2: DINAMIKA DERET WAKTU (TIME-SERIES DYNAMICS - BERDAMPINGAN)
      ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Kolom Kiri (Lebar 7/12): Tren Pendaftaran Bulanan */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Tren Pendaftaran Bulanan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kurva dinamika volume pendaftar pertukaran pemuda periode 2021–2025.
            </p>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="year_month"
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [formatNumber(value) + ' Pendaftar', 'Total']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total_apps"
                  stroke="#037EF3"
                  strokeWidth={3}
                  dot={{ r: 2, fill: '#037EF3' }}
                  activeDot={{ r: 6, fill: '#0A2540' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Menangkap tren makro kenaikan dan penurunan minat pelamar.</span>
            <span className="font-semibold text-slate-700">Sumbu X: Tahun-Bulan</span>
          </div>
        </div>

        {/* Kolom Kanan (Lebar 5/12): Dinamika Komposisi Status Peserta */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Dinamika Komposisi Status Peserta
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Perbandingan bulanan peserta Accepted, Finished, dan Rejected.
            </p>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statusDynamics} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="year_month" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={{ stroke: '#CBD5E1' }} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val, name) => [formatNumber(val) + ' Peserta', name]}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="accepted" name="Accepted" stackId="1" stroke="#037EF3" fill="#BFDBFE" />
                <Area type="monotone" dataKey="finished" name="Finished" stackId="1" stroke="#10B981" fill="#A7F3D0" />
                <Area type="monotone" dataKey="rejected" name="Rejected" stackId="1" stroke="#EF4444" fill="#FECDD3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>Memantau rasio keberhasilan seleksi terhadap penolakan.</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BARIS 3: PERTUMBUHAN TAHUNAN & PREFERENSI DURASI PROGRAM
      ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Kolom Kiri (Lebar 7/12): Clustered Column Pertumbuhan Tahunan */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Pertumbuhan Pendaftaran Tahunan per Program
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Perbandingan volume tahunan program GTa, GTe, dan GV (2021–2025).
            </p>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productYearly} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: '#334155', fontSize: 12, fontWeight: 'bold' }} axisLine={{ stroke: '#CBD5E1' }} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(val, name) => [formatNumber(val) + ' Pendaftar', name]} contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="GTa" name="Global Talent (GTa)" fill="#0A8EA0" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="GTa" position="top" style={{ fontSize: '9px', fill: '#0A8EA0', fontWeight: 'bold' }} />
                </Bar>
                <Bar dataKey="GTe" name="Global Teacher (GTe)" fill="#F48924" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="GTe" position="top" style={{ fontSize: '9px', fill: '#F48924', fontWeight: 'bold' }} />
                </Bar>
                <Bar dataKey="GV (New)" name="Global Volunteer (GV)" fill="#F85A40" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="GV (New)" position="top" style={{ fontSize: '9px', fill: '#F85A40', fontWeight: 'bold' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>GTa mencatatkan volume tertinggi secara konsisten.</span>
            <span className="font-semibold text-slate-700">Tahun 2021–2025</span>
          </div>
        </div>

        {/* Kolom Kanan (Lebar 5/12): Preferensi Tipe Durasi Program */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Preferensi Durasi Program
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Komparasi durasi Short-term vs Long-term pada setiap produk.
            </p>
          </div>

          <div className="my-4 space-y-3.5">
            {preferenceMethod.map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-800">{item.product_name}</span>
                  <span className="text-slate-500">Total: {formatNumber(item.total_apps)}</span>
                </div>
                <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${item.short_term_pct}%` }}
                    className="bg-[#037EF3] h-full flex items-center justify-center text-[9px] text-white font-extrabold"
                    title={`Short-term: ${item.short_term_pct}%`}
                  >
                    {item.short_term_pct > 15 ? formatPercent(item.short_term_pct) : ''}
                  </div>
                  <div
                    style={{ width: `${item.long_term_pct}%` }}
                    className="bg-[#0A2540] h-full flex items-center justify-center text-[9px] text-white font-extrabold"
                    title={`Long-term: ${item.long_term_pct}%`}
                  >
                    {item.long_term_pct > 15 ? formatPercent(item.long_term_pct) : ''}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] mt-1.5 text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#037EF3]"></span>
                    <span>Short-term: {formatNumber(item.short_term_count)} ({formatPercent(item.short_term_pct)})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0A2540]"></span>
                    <span>Long-term: {formatNumber(item.long_term_count)} ({formatPercent(item.long_term_pct)})</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>Durasi: Short-term (&lt; 12 minggu), Long-term (&gt;= 12 minggu).</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BARIS 4: MATRIX HEATMAP SEASONALITY (LEBAR PENUH 12/12)
      ========================================================================= */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200">
        <div className="pb-3 border-b border-slate-100 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Pola Musim Puncak Aktivitas Pendaftaran (Seasonality Heatmap)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifikasi periode puncak pendaftaran pertukaran pemuda (Summer Peak & Winter Peak).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
              Summer Peak: Mei–Juli
            </span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
              Winter Peak: Nov–Jan
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-2.5 px-3 text-left font-bold text-slate-700 bg-slate-50 rounded-l-lg">Tahun</th>
                {monthNames.map((m, idx) => (
                  <th key={idx} className="py-2.5 px-2 font-bold text-slate-600 bg-slate-50">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrixYears.map((yr) => (
                <tr key={yr} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 text-left font-black text-slate-900">{yr}</td>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((mNum) => {
                    const cell = seasonalityMatrix.find(s => s.year === yr && s.month === mNum);
                    const val = cell ? cell.total_apps : 0;
                    return (
                      <td key={mNum} className="p-1">
                        <div
                          className={`py-2 px-1 rounded-lg transition-all ${getHeatmapColor(val)}`}
                          title={`Tahun ${yr}, Bulan ${monthNames[mNum - 1]}: ${formatNumber(val)} Pendaftar`}
                        >
                          {val > 0 ? formatNumber(val) : '-'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-slate-100 mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Gradasi warna menunjukkan konsentrasi intensitas pendaftar pada bulan tersebut.</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">Rendah</span>
            <div className="flex gap-1">
              <span className="w-3.5 h-3.5 rounded bg-blue-50 border border-blue-200"></span>
              <span className="w-3.5 h-3.5 rounded bg-blue-200"></span>
              <span className="w-3.5 h-3.5 rounded bg-blue-400"></span>
              <span className="w-3.5 h-3.5 rounded bg-[#037EF3]"></span>
            </div>
            <span className="text-[10px] text-slate-700 font-bold">Puncak</span>
          </div>
        </div>
      </section>
    </div>
  );
}
