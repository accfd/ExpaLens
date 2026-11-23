import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './pages/Overview';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    years: [],
    products: [],
    regions: [],
    countries: [],
    host_lcs: [],
    statuses: []
  });

  const [filterOptions, setFilterOptions] = useState({
    years: [2021, 2022, 2023, 2024, 2025],
    products: ['GTa', 'GTe', 'GV (New)'],
    regions: [],
    countries_by_region: {},
    lcs_by_country: {},
    statuses: ['accepted', 'approved', 'finished', 'rejected']
  });

  const [overviewData, setOverviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDbConnected, setIsDbConnected] = useState(true);

  // Fetch Opsi Filter dari Backend
  const loadFilterOptions = async () => {
    try {
      const res = await axios.get('/api/filters');
      if (res.data) {
        setFilterOptions(res.data);
      }
    } catch (err) {
      console.warn('Gagal memuat opsi filter dinamis:', err.message);
    }
  };

  // Fetch Data Overview sesuai Slicer
  const loadOverviewData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/overview', filters);
      setOverviewData(res.data);
      setIsDbConnected(true);
    } catch (err) {
      console.error('Koneksi kueri gagal:', err);
      setError('Gagal memuat data dari PostgreSQL aiesec_dw. Pastikan server backend FastAPI dan PostgreSQL aktif.');
      setIsDbConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadOverviewData();
  }, [loadOverviewData]);

  // Handler reset semua filter
  const handleResetFilters = () => {
    setFilters({
      years: [],
      products: [],
      regions: [],
      countries: [],
      host_lcs: [],
      statuses: []
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-['Lato',sans-serif] text-slate-800">
      {/* BILAH SISI (SIDEBAR) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
        onResetFilters={handleResetFilters}
      />

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          totalRecords={overviewData?.kpis?.total_applied || 0}
          isDbConnected={isDbConnected}
          onRefresh={loadOverviewData}
          isLoading={isLoading}
        />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3 text-rose-800 text-sm font-medium">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'overview' && (
            <Overview data={overviewData} isLoading={isLoading} />
          )}

          {activeTab !== 'overview' && (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Modul Halaman Sedang Disiapkan
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Halaman Ringkasan Utama telah terhubung secara penuh ke database PostgreSQL aiesec_dw. Modul navigasi ini siap diintegrasikan pada langkah berikutnya.
              </p>
              <button
                onClick={() => setActiveTab('overview')}
                className="mt-5 px-4 py-2 bg-[#037EF3] hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Kembali ke Ringkasan Utama
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
