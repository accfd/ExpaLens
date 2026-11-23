import React from 'react';
import {
  RotateCcw,
  SlidersHorizontal,
  X,
  Check
} from 'lucide-react';

export default function FilterBar({
  isOpen,
  onClose,
  filters,
  setFilters,
  filterOptions,
  onResetFilters
}) {
  if (!isOpen) return null;

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

  const handleLcChange = (e) => {
    const val = e.target.value;
    const updated = val ? [val] : [];
    setFilters(prev => ({ ...prev, host_lcs: updated }));
  };

  const availableCountries = filters.regions && filters.regions.length > 0
    ? (filterOptions.countries_by_region?.[filters.regions[0]] || [])
    : Object.keys(filterOptions.lcs_by_country || {}).sort();

  const availableLcs = filters.countries && filters.countries.length > 0
    ? (filterOptions.lcs_by_country?.[filters.countries[0]] || [])
    : [];

  const activeFiltersCount = 
    (filters.years?.length || 0) +
    (filters.products?.length || 0) +
    (filters.regions?.length || 0) +
    (filters.countries?.length || 0) +
    (filters.host_lcs?.length || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-6 py-4 flex items-center justify-between bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#037EF3] flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Penyaring Data & Parameter Analisis
                </h3>
                {activeFiltersCount > 0 && (
                  <span className="text-[10px] font-extrabold text-white bg-[#037EF3] px-2 py-0.5 rounded-full">
                    {activeFiltersCount} Aktif
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Pilih parameter waktu, program, kawasan, dan negara tujuan analitik.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
            aria-label="Tutup Penyaring"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Isi Filter (5 Kolom Seimbang) */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[70vh] overflow-y-auto">
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
                    className={`py-1.5 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                      active
                        ? 'bg-[#037EF3] text-white border-[#037EF3] shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
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
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'GTa', label: 'GTa', color: 'bg-[#0A8EA0]' },
                { id: 'GTe', label: 'GTe', color: 'bg-[#F48924]' },
                { id: 'GV (New)', label: 'GV', color: 'bg-[#F85A40]' },
              ].map(prod => {
                const active = (filters.products || []).includes(prod.id);
                return (
                  <button
                    key={prod.id}
                    onClick={() => handleProductToggle(prod.id)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      active
                        ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${prod.color}`}></span>
                    {prod.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Slicer Kawasan Global */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Kawasan Tujuan
            </label>
            <select
              value={filters.regions?.[0] || ''}
              onChange={handleRegionChange}
              className="w-full text-xs font-semibold py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#037EF3]"
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
              className="w-full text-xs font-semibold py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#037EF3]"
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
              onChange={handleLcChange}
              disabled={!filters.countries || filters.countries.length === 0}
              className="w-full text-xs font-semibold py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#037EF3] disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">
                {filters.countries && filters.countries.length > 0 ? 'Semua Komite Lokal' : 'Pilih Negara Dulu'}
              </option>
              {availableLcs.map(lc => (
                <option key={lc} value={lc}>{lc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer Tombol Aksi */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onResetFilters}
            disabled={activeFiltersCount === 0}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Semua Filter</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-[#037EF3] hover:bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan Parameter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
