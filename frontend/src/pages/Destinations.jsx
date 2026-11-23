import React, { useState } from 'react';
import {
  Globe2,
  Building2,
  Search,
  Award,
  ChevronRight
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

export default function Destinations({ data, isLoading }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500">
        <div className="w-8 h-8 border-4 border-[#037EF3] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold">Memuat data sebaran negara dan komite tujuan...</p>
      </div>
    );
  }

  const choroplethMap = data?.choropleth_map || [];
  const topHostMcs = data?.top_host_mcs || [];
  const hostLcDrilldown = data?.host_lc_drilldown || [];

  const filteredLcs = hostLcDrilldown.filter(item =>
    item.host_lc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.country_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* BARIS 1: POIN 15 - GEOGRAPHIC DISTRIBUTION SUMMARY */}
      <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Persebaran Global Negara Tujuan Pendaftar (Choropleth Distribution)
            </h3>
            <p className="text-xs text-slate-500">
              Sebaran volume pelamar mahasiswa Universitas Andalas ke berbagai negara mitra dunia.
            </p>
          </div>
          <span className="text-xs font-bold text-[#037EF3] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 self-start sm:self-auto">
            Global Coverage
          </span>
        </div>

        {/* Grid Kartu Negara Utama */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {choroplethMap.slice(0, 6).map((c, idx) => (
            <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-[#037EF3] bg-blue-100/60 px-1.5 py-0.5 rounded">
                  {c.country_code_iso3}
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-2 truncate" title={c.country_name}>
                  {c.country_name}
                </h4>
              </div>
              <div className="mt-3">
                <div className="text-lg font-black text-slate-900">
                  {formatNumber(c.total_apps)}
                </div>
                <div className="text-[10px] text-slate-400">Pendaftar</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BARIS 2: POIN 16A - TOP HOST MCS BAR CHART */}
      <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Peringkat 10 Besar Negara Tujuan Terfavorit (Top Host MC)
            </h3>
            <p className="text-xs text-slate-500">
              Volume pendaftar, jumlah peserta diterima (Accepted), dan kelulusan program (Finished).
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md self-start sm:self-auto">
            dim_host.host_mc
          </span>
        </div>

        <div className="h-80 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topHostMcs.slice(0, 10)} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="country_name"
                tick={{ fill: '#334155', fontSize: 11, fontWeight: 'bold' }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
                angle={-15}
                textAnchor="end"
              />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(val, name) => [formatNumber(val) + ' Peserta', name]} contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="total_apps" name="Total Pendaftar" fill="#037EF3" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="total_apps" position="top" style={{ fontSize: '9px', fill: '#037EF3', fontWeight: 'bold' }} />
              </Bar>
              <Bar dataKey="accepted" name="Accepted" fill="#0A8EA0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="finished" name="Finished" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* BARIS 3: POIN 16B - DRILL-DOWN MATRIKS KOMITE LOKAL TUJUAN */}
      <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Rincian Performa Komite Lokal & Kampus Mitra Tujuan (Host LC Drill-down)
            </h3>
            <p className="text-xs text-slate-500">
              Data terperinci volume aplikasi, penerimaan, dan tingkat kelulusan per kampus mitra.
            </p>
          </div>
          {/* Kotak Pencarian Komite Lokal */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari komite / negara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs font-medium pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tabel Data Drill-down */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider bg-slate-50">
                <th className="py-3 px-4 rounded-l-lg">Komite Lokal (Host LC)</th>
                <th className="py-3 px-3">Negara Tujuan</th>
                <th className="py-3 px-3 text-right">Pendaftar</th>
                <th className="py-3 px-3 text-right">Accepted</th>
                <th className="py-3 px-3 text-right">Approved</th>
                <th className="py-3 px-3 text-right">Finished</th>
                <th className="py-3 px-4 text-right rounded-r-lg">Finish Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLcs.slice(0, 15).map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-900">{row.host_lc}</td>
                  <td className="py-2.5 px-3 text-slate-600">{row.country_name}</td>
                  <td className="py-2.5 px-3 text-right font-black text-slate-900">{formatNumber(row.total_apps)}</td>
                  <td className="py-2.5 px-3 text-right text-[#037EF3] font-bold">{formatNumber(row.accepted)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{formatNumber(row.approved)}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">{formatNumber(row.finished)}</td>
                  <td className="py-2.5 px-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${row.finish_rate >= 50 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {formatPercent(row.finish_rate)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
          <span>Menampilkan {Math.min(filteredLcs.length, 15)} komite lokal teratas</span>
          <span className="font-semibold text-slate-700">Sumber: dim_host</span>
        </div>
      </section>
    </div>
  );
}
