import React from 'react';
import {
  Target,
  Clock,
  AlertTriangle,
  Zap,
  ArrowRight
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
  LabelList,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('id-ID');
};

const formatPercent = (num, decimals = 1) => {
  if (num === null || num === undefined) return '0,0%';
  return Number(num).toFixed(decimals).replace('.', ',') + '%';
};

export default function ConversionFunnel({ data, isLoading }) {
  if (isLoading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500">
        <div className="w-8 h-8 border-4 border-[#037EF3] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold">Memuat analisis tahapan seleksi dan kelulusan...</p>
      </div>
    );
  }

  const funnelRates = data?.funnel_rates || [];
  const avgProcessingDays = data?.avg_processing_days || [];
  const rejectionStages = data?.rejection_stages || [];
  const countrySpeedScatter = data?.country_speed_scatter || [];

  return (
    <div className="space-y-6">
      {/* BARIS 1: POIN 11 - DETAILED CONVERSION RATES & DROP-OFF */}
      <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Rasio Konversi Langkah-ke-Langkah (Step-to-Step Conversion & Drop-off)
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi persentase peserta yang melanjutkan antartahap berurutan dan titik penurunan terbesar.
            </p>
          </div>
          <span className="text-xs font-bold text-[#037EF3] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 self-start sm:self-auto">
            Conversion Rates
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {funnelRates.map((step, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Tahap {idx + 1}
                </div>
                <h4 className="text-sm font-black text-slate-900 mt-0.5">
                  {step.stage}
                </h4>
                <div className="my-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#037EF3]">
                    {formatPercent(step.conversion_rate)}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Konversi
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Dari {formatNumber(step.from_count)}</span>
                  <span className="font-bold text-slate-900">Ke {formatNumber(step.to_count)}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Drop-off:</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded ${step.drop_rate > 50 ? 'bg-rose-50 text-rose-700' : 'bg-slate-200 text-slate-700'}`}>
                    {formatPercent(step.drop_rate)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BARIS 2: POIN 12 - RATA-RATA HARI PROSES & POIN 13 - TAHAP PENOLAKAN */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Poin 12: Rata-Rata Waktu Proses per Produk */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Rata-rata Durasi Pemrosesan (Hari)
              </h3>
              <p className="text-xs text-slate-500">
                Lama hari dari pendaftaran awal hingga tiap tahapan selesai.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md self-start sm:self-auto">
              Satuan Hari
            </span>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgProcessingDays} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="product_name" tick={{ fill: '#334155', fontSize: 12, fontWeight: 'bold' }} axisLine={{ stroke: '#CBD5E1' }} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(val, name) => [Number(val).toFixed(1).replace('.', ',') + ' Hari', name]} contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="days_to_accept" name="To Accept" fill="#037EF3" radius={[4, 4, 0, 0]} />
                <Bar dataKey="days_to_approve" name="To Approve" fill="#0A8EA0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="days_to_realize" name="To Realize" fill="#F48924" radius={[4, 4, 0, 0]} />
                <Bar dataKey="days_to_finish" name="To Finish" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>Fase To Finish memerlukan waktu terlama (mencakup masa penugasan di luar negeri).</span>
          </div>
        </div>

        {/* Poin 13: Tahap Terjadinya Penolakan */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Tahap Terjadinya Penolakan Peserta
              </h3>
              <p className="text-xs text-slate-500">
                Sebaran penolakan: Pre-Accepted, Post-Accepted, Post-Approved.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md self-start sm:self-auto">
              Stacked Column
            </span>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rejectionStages} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="product_name" tick={{ fill: '#334155', fontSize: 12, fontWeight: 'bold' }} axisLine={{ stroke: '#CBD5E1' }} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(val, name) => [formatNumber(val) + ' Kasus', name]} contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="pre_accepted" name="Sebelum Diterima (Pre-Accepted)" stackId="a" fill="#EF4444" />
                <Bar dataKey="post_accepted" name="Setelah Diterima (Post-Accepted)" stackId="a" fill="#F59E0B" />
                <Bar dataKey="post_approved" name="Setelah Disetujui (Post-Approved)" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>Mayoritas penolakan terjadi di fase awal seleksi administrasi berkas.</span>
          </div>
        </div>
      </section>

      {/* BARIS 3: POIN 14 - SCATTER CHART KECEPATAN NEGARA TUJUAN */}
      <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Kecepatan Proses Seleksi vs Volume Pendaftaran Antar-Negara Mitra
            </h3>
            <p className="text-xs text-slate-500">
              Sumbu X: Jumlah Pendaftar | Sumbu Y: Rata-rata Hari ke Accepted (Hari) | Ukuran: Volume Aplikasi
            </p>
          </div>
          <span className="text-xs font-bold text-[#037EF3] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 self-start sm:self-auto">
            Scatter Visual
          </span>
        </div>

        <div className="h-80 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                type="number"
                dataKey="total_apps"
                name="Total Pendaftar"
                tick={{ fill: '#64748B', fontSize: 11 }}
                label={{ value: 'Total Pendaftar (Volume)', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="avg_days_to_accept"
                name="Rata-rata Hari"
                tick={{ fill: '#64748B', fontSize: 11 }}
                label={{ value: 'Hari ke Accepted (Kecepatan)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 11 }}
              />
              <ZAxis type="number" dataKey="total_apps" range={[60, 400]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-md text-xs">
                        <div className="font-black text-slate-900">{d.country}</div>
                        <div className="text-slate-500 mt-1">Kawasan: {d.region}</div>
                        <div className="text-[#037EF3] font-bold mt-0.5">Total Pendaftar: {formatNumber(d.total_apps)}</div>
                        <div className="text-slate-700 font-bold">Waktu Terima: {Number(d.avg_days_to_accept).toFixed(1).replace('.', ',')} Hari</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Negara Mitra" data={countrySpeedScatter} fill="#037EF3" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Negara di kuadran kiri bawah mencatatkan waktu proses tercepat dengan efisiensi tinggi.</span>
          <span className="font-semibold text-slate-700">Sampel 30 Negara Terbesar</span>
        </div>
      </section>
    </div>
  );
}
