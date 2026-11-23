import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Target, 
  Globe2, 
  AlertCircle,
  Filter,
  RotateCcw,
  X
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  filters, 
  setFilters, 
  filterOptions,
  onResetFilters,
  isMobileOpen,
  onCloseMobile
}) {
  const navItems = [
    { id: 'overview', label: 'Ringkasan Utama', icon: LayoutDashboard },
    { id: 'trends', label: 'Tren Pendaftaran', icon: TrendingUp },
    { id: 'funnel', label: 'Tahapan Seleksi', icon: Target },
    { id: 'destinations', label: 'Negara Tujuan', icon: Globe2 },
    { id: 'rejections', label: 'Alasan Penolakan', icon: AlertCircle },
  ];

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

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200 
        flex flex-col shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#037EF3] flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
              E
            </div>
            <div>
              <h1 className="font-black text-xl text-slate-900 tracking-tight leading-none">ExpaLens</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">AIESEC IN UNAND - OGX BI</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="p-4 border-b border-slate-100">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Navigasi Halaman</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all min-h-[44px] cursor-pointer ${
                    isActive 
                      ? 'bg-blue-50 text-[#037EF3] shadow-xs border border-blue-200' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#037EF3]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Slicers & Global Filters */}
        <div className="p-5 flex-1 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-[#037EF3]" />
              <span>Penyaring Data Global</span>
            </div>
            <button 
              onClick={onResetFilters}
              className="text-[11px] text-slate-400 hover:text-[#037EF3] flex items-center gap-1 font-semibold transition-colors cursor-pointer py-1 px-1.5"
              title="Reset Seluruh Filter"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* 1. Filter Tahun */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Tahun Pendaftaran</label>
            <div className="grid grid-cols-5 gap-1">
              {[2021, 2022, 2023, 2024, 2025].map(year => {
                const active = (filters.years || []).includes(year);
                return (
                  <button
                    key={year}
                    onClick={() => handleYearToggle(year)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all min-h-[38px] cursor-pointer ${
                      active
                        ? 'bg-[#037EF3] text-white border-[#037EF3] shadow-xs'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Filter Program */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Program Pertukaran</label>
            <div className="space-y-1.5">
              {[
                { id: 'GTa', name: 'Global Talent', code: 'GTa', color: '#0A8EA0' },
                { id: 'GTe', name: 'Global Teacher', code: 'GTe', color: '#F48924' },
                { id: 'GV (New)', name: 'Global Volunteer', code: 'GV', color: '#F85A40' }
              ].map(prod => {
                const active = (filters.products || []).includes(prod.id);
                return (
                  <button
                    key={prod.id}
                    onClick={() => handleProductToggle(prod.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold border transition-all min-h-[44px] cursor-pointer ${
                      active
                        ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: prod.color }}></span>
                      <span>{prod.name}</span>
                    </span>
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${active ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'}`}>
                      {prod.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Filter Kawasan (Region) */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Kawasan Tujuan (Region)</label>
            <select
              value={filters.regions?.[0] || ''}
              onChange={handleRegionChange}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[42px]"
            >
              <option value="">Semua Kawasan</option>
              {(filterOptions.regions || []).map(reg => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>
          </div>

          {/* 4. Filter Negara Tujuan (Host MC) */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Negara Tujuan (Host MC)</label>
            <select
              value={filters.countries?.[0] || ''}
              onChange={handleCountryChange}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[42px]"
            >
              <option value="">Semua Negara</option>
              {availableCountries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* 5. Filter Komite Lokal Tujuan (Host LC) */}
          {availableLcs.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Komite Lokal (Host LC)</label>
              <select
                value={filters.host_lcs?.[0] || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, host_lcs: e.target.value ? [e.target.value] : [] }))}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[42px]"
              >
                <option value="">Semua Komite Lokal</option>
                {availableLcs.map(lc => (
                  <option key={lc} value={lc}>{lc}</option>
                ))}
              </select>
            </div>
          )}

          {/* 6. Filter Status Pendaftaran */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Status Pendaftaran</label>
            <div className="grid grid-cols-2 gap-1.5">
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
                    className={`py-2 px-2.5 text-xs font-bold rounded-lg border text-center transition-all min-h-[40px] cursor-pointer ${
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

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400 font-medium text-center">
          ExpaLens PWA v2.0
        </div>
      </aside>
    </>
  );
}
