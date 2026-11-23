import React from 'react';
import {
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

export default function Rejections({ data, isLoading }) {
  if (isLoading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500">
        <div className="w-8 h-8 border-4 border-[#037EF3] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold">Memuat analisis alasan penolakan peserta...</p>
      </div>
    );
  }

  const topRejectionReasons = data?.top_rejection_reasons || [];
  const reasonsByProduct = data?.reasons_by_product || [];
  const rejectionTrend = data?.rejection_trend || [];
  const recommendedAction = data?.recommended_action || {
    top_reason: 'Tidak ada penolakan terdeteksi',
    affected_percentage: 0,
    priority_level: 'Rendah',
    action_title: 'Monitoring Terjadwal',
    action_description: 'Pantau secara berkala proses seleksi pelamar.'
  };

  return (
    <div className="space-y-6">
      {/* BARIS 1: POIN 19 - DYNAMIC RECOMMENDED ACTION CARD */}
      <section className="bg-[#F0F6FF] rounded-2xl p-6 border-l-4 border-[#037EF3] border-y border-r border-blue-200/60 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-[#037EF3] px-2.5 py-0.5 rounded-full border border-blue-200">
                Poin 19: Rekomendasi Tindakan Operasional Terotomatisasi
              </span>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Prioritas: {recommendedAction.priority_level}
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {recommendedAction.action_title}
            </h3>
            <p className="text-xs text-slate-700 mt-2 leading-relaxed max-w-4xl">
              {recommendedAction.action_description}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-blue-200 text-center shrink-0 min-w-36">
            <span className="text-[10px] font-bold uppercase text-slate-400">Kasus Dominan</span>
            <div className="text-2xl font-black text-[#037EF3] mt-1">
              {formatPercent(recommendedAction.affected_percentage)}
            </div>
            <span className="text-[10px] font-bold text-slate-600 block mt-0.5 truncate max-w-32" title={recommendedAction.top_reason}>
              {recommendedAction.top_reason}
            </span>
          </div>
        </div>
      </section>

      {/* BARIS 2: POIN 17 - TOP REJECTION REASONS BAR CHART */}
      <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Peringkat Alasan Penolakan Peserta (Top Rejection Reasons)
            </h3>
            <p className="text-xs text-slate-500">
              Distribusi 10 alasan penolakan aplikasi pelamar paling sering terjadi di CRM Expa.
            </p>
          </div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 self-start sm:self-auto">
            dim_rejection_reason
          </span>
        </div>

        <div className="h-80 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={topRejectionReasons}
              margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="reason_text"
                tick={{ fill: '#334155', fontSize: 11, fontWeight: 'bold' }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
              />
              <Tooltip formatter={(val) => [formatNumber(val) + ' Kasus', 'Jumlah']} contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
              <Bar dataKey="total_cases" name="Kasus Penolakan" fill="#EF4444" radius={[0, 4, 4, 0]}>
                <LabelList dataKey="total_cases" position="right" style={{ fontSize: '10px', fill: '#EF4444', fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* BARIS 3: POIN 18A - SEBARAN PER PRODUK & POIN 18B - TREN FLUKTUASI BULANAN */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Poin 18A: Alasan Penolakan per Program */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Penyebab Penolakan Berdasarkan Program Pertukaran
              </h3>
              <p className="text-xs text-slate-500">
                Komposisi kasus per lini produk (GTa, GTe, GV).
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md self-start sm:self-auto">
              Stacked Column
            </span>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reasonsByProduct} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="reason_text"
                  tick={{ fill: '#334155', fontSize: 10, fontWeight: 'bold' }}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tickLine={false}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(val, name) => [formatNumber(val) + ' Kasus', name]} contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="GTa" name="Global Talent (GTa)" stackId="a" fill="#0A8EA0" />
                <Bar dataKey="GTe" name="Global Teacher (GTe)" stackId="a" fill="#F48924" />
                <Bar dataKey="GV (New)" name="Global Volunteer (GV)" stackId="a" fill="#F85A40" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>GTa memiliki kasus terbanyak akibat kriteria kualifikasi profil perusahaan mitra.</span>
          </div>
        </div>

        {/* Poin 18B: Tren Fluktuasi Penolakan Bulanan */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Fluktuasi Penolakan Bulanan
              </h3>
              <p className="text-xs text-slate-500">
                Tren jumlah penolakan aplikasi dari waktu ke waktu.
              </p>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 self-start sm:self-auto">
              Trend Line
            </span>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rejectionTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="year_month" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={{ stroke: '#CBD5E1' }} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(val) => [formatNumber(val) + ' Penolakan', 'Jumlah']} contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                <Line type="monotone" dataKey="rejected_cases" stroke="#EF4444" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>Peningkatan penolakan berbanding lurus dengan musim puncak pendaftaran (Peak).</span>
          </div>
        </div>
      </section>
    </div>
  );
}
