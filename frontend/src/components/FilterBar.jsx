import React, { useState } from 'react';
import {
  Filter,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';

export default function FilterBar({
  filters,
  setFilters,
  filterOptions,
  onResetFilters
}) {
  const [isOpen, setIsOpen] = useState(true);

  const handleYearToggle = (year) => {
    const current = filters.years || [];
    const updated = current.includes(year)
      ? current.filter(y => y !== year)
      : [...current, year];
    setFilters(prev => ({ ...prev, years: updated }));
  };

  const handleProductToggle = (prod) => {
    const current = filters.products || [];
    const updated = current.includes(prod)
      ? current.filter(p => p !== prod)
      : [...current, prod];
    setFilters(prev => ({ ...prev, products: updated }));
  };

  const handleStatusToggle = (status) => {
    const current = filters.statuses || [];
    const updated = current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status];
    setFilters(prev => ({ ...prev, statuses: updated }));
  };

  const handleRegionChange = (e) => {
    const val = e.target.value;
    const updated = val ? [val] : [];
    setFilters(prev => ({ ...prev, regions: updated, countries: [], host_lcs: [] }));
  };

  const handleCountryChange = (e) => {
    const val = e.target.value;
    const updated = val ? [val] : [];
    setFilters(prev => ({ ...prev, countries: updated, host_lcs: [] }));
  };

  // Determine available countries based on selected regions
  const availableCountries = filters.regions && filters.regions.length > 0
    ? (filterOptions.countries_by_region?.[filters.regions[0]] || [])
    : Object.keys(filterOptions.lcs_by_country || {}).sort();

  // Determine available LCs based on selected country
  const availableLcs = filters.countries && filters.countries.length > 0
    ? (filterOptions.lcs_by_country?.[filters.countries[0]] || [])
    : [];

  const activeFiltersCount = 
    (filters.years?.length || 0) +
    (filters.products?.length || 0) +
    (filters.regions?.length || 0) +
    (filters.countries?.length || 0) +
    (filters.host_lcs?.length || 0) +
    (filters.statuses?.length || 0);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="px-6 py-4 flex items-center justify-between bg-slate-50/70 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#037EF3] flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Penyaring Data & Parameter Analisis (Slicers)
              </h3>
              <span className="text-[10px] font-bold text-[#037EF3] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Poin 5
              </span>
              {activeFiltersCount > 0 && (
                <span className="text-[10px] font-extrabold text-white bg-[#037EF3] px-2 py-0.5 rounded-full">
                  {activeFiltersCount} Aktif
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Saring metrik berdasarkan waktu, jenis program, kawasan, negara, komite lokal, dan status aplikasi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#037EF3] px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Reset Semua Penyaring"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={() => setIsOpen(prev => !prev)}
            className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <span>{isOpen ? 'Sembunyikan' : 'Buka Penyaring'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Slicers Grid Container */}
      {isOpen && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* 1. Slicer Tahun Pendaftaran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Tahun Pendaftaran
            </label>
            <div className="grid grid-cols-5 gap-1">
              {[2021, 2022, 2023, 2024, 2025].map(year => {
                const active = (filters.years || []).includes(year);
                return (
                  <button
                    key={year}
                    onClick={() => handleYearToggle(year)}
                    className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                      active
                        ? 'bg-[#037EF3] text-white border-[#037EF3] shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Slicer Program Pertukaran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Program Pertukaran
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'GTa', label: 'GTa', color: '#0A8EA0' },
                { id: 'GTe', label: 'GTe', color: '#F48924' },
                { id: 'GV (New)', label: 'GV', color: '#F85A40' }
              ].map(prod => {
                const active = (filters.products || []).includes(prod.id);
                return (
                  <button
                    key={prod.id}
                    onClick={() => handleProductToggle(prod.id)}
                    className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      active
                        ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: prod.color }}></span>
                    <span>{prod.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Slicer Kawasan Tujuan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Kawasan Tujuan
            </label>
            <select
              value={filters.regions?.[0] || ''}
              onChange={handleRegionChange}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Kawasan</option>
              {(filterOptions.regions || []).map(reg => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>
          </div>

          {/* 4. Slicer Negara Tujuan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Negara Tujuan (Host MC)
            </label>
            <select
              value={filters.countries?.[0] || ''}
              onChange={handleCountryChange}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Negara</option>
              {availableCountries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* 5. Slicer Komite Lokal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Komite Lokal (Host LC)
            </label>
            <select
              value={filters.host_lcs?.[0] || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, host_lcs: e.target.value ? [e.target.value] : [] }))}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={availableLcs.length === 0}
            >
              <option value="">{availableLcs.length > 0 ? 'Semua Komite Lokal' : 'Pilih Negara Dulu'}</option>
              {availableLcs.map(lc => (
                <option key={lc} value={lc}>{lc}</option>
              ))}
            </select>
          </div>

          {/* 6. Slicer Status Pendaftaran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Status Pendaftaran
            </label>
            <div className="grid grid-cols-2 gap-1">
              {[
                { id: 'accepted', label: 'Accepted' },
                { id: 'approved', label: 'Approved' },
                { id: 'finished', label: 'Finished' },
                { id: 'rejected', label: 'Rejected' },
              ].map(st => {
                const active = (filters.statuses || []).includes(st.id);
                return (
                  <button
                    key={st.id}
                    onClick={() => handleStatusToggle(st.id)}
                    className={`py-1 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                      active
                        ? 'bg-blue-50 text-[#037EF3] border-blue-300 font-extrabold'
                        : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
