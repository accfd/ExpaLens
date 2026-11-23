import React, { useState, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip as LeafletTooltip
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Globe2,
  Building2,
  Search,
  Award,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Users,
  Percent,
  FilterX
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
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
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const choroplethMap = data?.choropleth_map || [];
  const topHostMcs = data?.top_host_mcs || [];
  const hostLcDrilldown = data?.host_lc_drilldown || [];

  // Filter interaktif Host LC berdasarkan pencarian dan negara yang diklik di peta
  const filteredLcs = useMemo(() => {
    return hostLcDrilldown.filter(item => {
      const matchSearch =
        item.host_lc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.country_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchSelectedCountry = selectedCountry 
        ? item.country_name.toLowerCase() === selectedCountry.toLowerCase()
        : true;

      return matchSearch && matchSelectedCountry;
    });
  }, [hostLcDrilldown, searchTerm, selectedCountry]);

  // Radius lingkaran proporsional terhadap logaritma volume pendaftar
  const getMarkerRadius = (totalApps) => {
    if (!totalApps || totalApps <= 0) return 4;
    if (totalApps > 7500) return 26; // Turkey
    if (totalApps > 2500) return 18; // Germany, Vietnam, Malaysia
    if (totalApps > 1000) return 14;
    if (totalApps > 300) return 10;
    return 7;
  };

  // Skema Warna Gradasi AIESEC Blue Tone System
  const getMarkerColor = (totalApps) => {
    if (totalApps > 7500) return '#0A2540'; // Sangat Tinggi (> 7.500): Midnight Navy
    if (totalApps > 2500) return '#037EF3'; // Tinggi (2.501 - 7.500): AIESEC Blue
    if (totalApps > 500) return '#60A5FA';  // Sedang (501 - 2.500): Light Blue
    return '#93C5FD';                       // Rendah (1 - 500): Soft Ice Blue
  };

  if (isLoading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500">
        <div className="w-8 h-8 border-4 border-[#037EF3] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold">Memuat data sebaran negara dan komite tujuan...</p>
      </div>
    );
  }

  // Paginasi tabel
  const totalPages = Math.ceil(filteredLcs.length / itemsPerPage) || 1;
  const paginatedLcs = filteredLcs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* BARIS 1: FLAT INTERACTIVE WORLD MAP (REACT LEAFLET) */}
      <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Peta Persebaran Global Negara Tujuan Pendaftar
              </h3>
              {selectedCountry && (
                <span className="text-xs font-bold bg-blue-50 text-[#037EF3] px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                  Filter: {selectedCountry}
                  <button 
                    onClick={() => setSelectedCountry(null)}
                    className="hover:text-rose-600 cursor-pointer ml-1"
                    title="Hapus Filter Negara"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Peta datar interaktif sebaran volume pelamar mahasiswa Universitas Andalas ke berbagai negara mitra dunia.
            </p>
          </div>

          {selectedCountry && (
            <button
              onClick={() => setSelectedCountry(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-center"
              title="Tampilkan Semua Negara"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Tampilkan Semua Negara</span>
            </button>
          )}
        </div>

        {/* Wadah Kanvas Leaflet Map Datar */}
        <div className="relative mt-4 rounded-xl border border-slate-200 overflow-hidden h-[420px] w-full z-10">
          <MapContainer
            center={[25, 30]}
            zoom={2}
            minZoom={2}
            maxZoom={8}
            scrollWheelZoom={true}
            attributionControl={false}
            className="w-full h-full"
            style={{ width: '100%', height: '100%', background: '#F8FAFC' }}
          >
            {/* Tile Layer Peta Datar Asli Bebas Watermark (OpenStreetMap) */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {/* Circle Markers untuk setiap negara tujuan */}
            {choroplethMap.map((country, idx) => {
              if (!country.lat || !country.lng || (country.lat === 0 && country.lng === 0)) return null;
              const isSelected = selectedCountry && 
                selectedCountry.toLowerCase() === country.country_name.toLowerCase();
              const radius = getMarkerRadius(country.total_apps);
              const color = isSelected ? '#F48924' : getMarkerColor(country.total_apps);

              return (
                <CircleMarker
                  key={idx}
                  center={[country.lat, country.lng]}
                  radius={radius}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.85,
                    color: isSelected ? '#C2410C' : '#FFFFFF',
                    weight: isSelected ? 3 : 1.5
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedCountry(prev => 
                        prev === country.country_name ? null : country.country_name
                      );
                      setCurrentPage(1);
                    }
                  }}
                >
                  <LeafletTooltip direction="top" offset={[0, -radius]} opacity={0.95}>
                    <div className="font-sans text-xs">
                      <div className="font-extrabold text-slate-900 flex items-center justify-between gap-3">
                        <span>{country.country_name}</span>
                        <span className="text-[10px] bg-[#037EF3] text-white px-1.5 py-0.2 rounded font-mono">
                          {country.country_code_iso3}
                        </span>
                      </div>
                      <div className="mt-1 text-slate-600 font-semibold">
                        {formatNumber(country.total_apps)} Pendaftar
                      </div>
                    </div>
                  </LeafletTooltip>

                  <Popup>
                    <div className="p-1 font-sans text-xs min-w-[190px]">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                        <span className="font-extrabold text-slate-900 text-sm">{country.country_name}</span>
                        <span className="font-bold text-[10px] bg-blue-100 text-[#037EF3] px-1.5 py-0.5 rounded">
                          {country.country_code_iso3}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1 text-slate-600">
                        <div className="flex justify-between">
                          <span>Total Pendaftar:</span>
                          <span className="font-black text-slate-900">{formatNumber(country.total_apps)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Diterima (Accepted):</span>
                          <span className="font-bold text-[#037EF3]">{formatNumber(country.accepted)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Selesai (Finished):</span>
                          <span className="font-bold text-emerald-600">{formatNumber(country.finished)}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-100 font-bold">
                          <span>Finish Rate:</span>
                          <span className="text-[#0A2540]">{formatPercent(country.finish_rate)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCountry(country.country_name);
                          setCurrentPage(1);
                        }}
                        className="mt-2.5 w-full bg-[#037EF3] hover:bg-blue-600 text-white py-1 rounded-lg text-[11px] font-bold text-center transition-colors cursor-pointer block"
                      >
                        Saring Komite Lokal
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* Legenda Skema Warna AIESEC Blue Tone */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 shadow-md text-[10px] z-[1000] pointer-events-auto">
            <span className="font-bold text-slate-700 block mb-1.5">Intensitas Pendaftar:</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#93C5FD] border border-white"></span>
                <span className="text-slate-600">1 - 500</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#60A5FA] border border-white"></span>
                <span className="text-slate-600">501 - 2.5K</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-[#037EF3] border border-white"></span>
                <span className="text-slate-600">2.5K - 7.5K</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-[#0A2540] border border-white"></span>
                <span className="text-slate-600">&gt; 7.5K</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BARIS 2: POIN 16A - PERINGKAT 10 BESAR NEGARA TUJUAN (CLUSTERED BAR CHART) */}
      <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div className="pb-3 border-b border-slate-100 mb-4">
          <h3 className="text-base font-bold text-slate-900">
            Peringkat 10 Besar Negara Tujuan Terfavorit
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Perbandingan volume pendaftar total, peserta diterima (Accepted), dan kelulusan program (Finished).
          </p>
        </div>

        <div className="h-80 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={topHostMcs.slice(0, 10)} 
              layout="vertical"
              margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis 
                type="category" 
                dataKey="country_name" 
                tick={{ fill: '#0F172A', fontSize: 12, fontWeight: 'bold' }} 
                axisLine={{ stroke: '#CBD5E1' }} 
                tickLine={false}
                width={100}
              />
              <RechartsTooltip 
                formatter={(val, name) => [formatNumber(val) + ' Peserta', name]} 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  borderRadius: '12px', 
                  border: '1px solid #E2E8F0', 
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="total_apps" name="Total Pendaftar" fill="#94A3B8" radius={[0, 4, 4, 0]}>
                <LabelList dataKey="total_apps" position="right" formatter={formatNumber} style={{ fontSize: '10px', fill: '#64748B', fontWeight: 'bold' }} />
              </Bar>
              <Bar dataKey="accepted" name="Accepted (Diterima)" fill="#037EF3" radius={[0, 4, 4, 0]} />
              <Bar dataKey="finished" name="Finished (Selesai)" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* BARIS 3: POIN 16B - RINCIAN PERFORMA KAMPUS & KOMITE LOKAL (HOST LC DRILL-DOWN MATRIX) */}
      <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Rincian Performa Komite Lokal & Kampus Mitra Tujuan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Data terperinci volume aplikasi, penerimaan, dan tingkat kelulusan per komite lokal mitra di seluruh dunia.
            </p>
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari komite / negara..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#037EF3] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Tabel Data Drill-Down */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-3">Komite Lokal (Host LC)</th>
                <th className="py-3 px-3">Negara Tujuan</th>
                <th className="py-3 px-3 text-right">Pendaftar</th>
                <th className="py-3 px-3 text-right">Accepted</th>
                <th className="py-3 px-3 text-right">Approved</th>
                <th className="py-3 px-3 text-right">Finished</th>
                <th className="py-3 px-3 text-center">Finish Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLcs.length > 0 ? (
                paginatedLcs.map((lc, idx) => {
                  const rate = lc.finish_rate || 0;
                  return (
                    <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-3 font-extrabold text-slate-900 max-w-[200px] truncate" title={lc.host_lc}>
                        {lc.host_lc}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-semibold">{lc.country_name}</td>
                      <td className="py-3 px-3 text-right font-black text-slate-900">{formatNumber(lc.total_apps)}</td>
                      <td className="py-3 px-3 text-right font-bold text-[#037EF3]">{formatNumber(lc.accepted)}</td>
                      <td className="py-3 px-3 text-right font-bold text-amber-600">{formatNumber(lc.approved)}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-600">{formatNumber(lc.finished)}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${rate >= 50 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                              style={{ width: `${Math.min(rate, 100)}%` }}
                            ></div>
                          </div>
                          <span className="font-extrabold text-slate-800 text-[11px] min-w-[36px] text-right">
                            {formatPercent(rate)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">
                    Tidak ada komite lokal yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Kontrol Paginasi */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <span>
            Menampilkan {filteredLcs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredLcs.length)} dari {filteredLcs.length} komite lokal
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-bold"
            >
              Sebelumnya
            </button>
            <span className="px-3 py-1 font-extrabold text-slate-900">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-bold"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
