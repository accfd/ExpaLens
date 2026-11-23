import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import Overview from './pages/Overview';
import ApplicationTrends from './pages/ApplicationTrends';
import ConversionFunnel from './pages/ConversionFunnel';
import Destinations from './pages/Destinations';
import Rejections from './pages/Rejections';
import ErrorBoundary from './components/ErrorBoundary';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    years: [],
    products: [],
    regions: [],
    countries: [],
    host_lcs: []
  });

  const [filterOptions, setFilterOptions] = useState({
    years: [2021, 2022, 2023, 2024, 2025],
    products: ['GTa', 'GTe', 'GV (New)'],
    regions: [],
    countries_by_region: {},
    lcs_by_country: {}
  });

  // State Data Tiap Halaman
  const [pageData, setPageData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDbConnected, setIsDbConnected] = useState(true);

  // PWA States
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstallPwa, setCanInstallPwa] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Setup PWA Install Prompt & Network Listeners
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstallPwa(false);
      setDeferredPrompt(null);
    }
  };

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

  // Fetch Data sesuai Halaman Aktif & Filter Slicer
  const loadActivePageData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const endpointMap = {
      overview: '/api/overview',
      trends: '/api/trends',
      funnel: '/api/funnel',
      destinations: '/api/destinations',
      rejections: '/api/rejections'
    };

    const endpoint = endpointMap[activeTab] || '/api/overview';

    try {
      const res = await axios.post(endpoint, filters);
      setPageData(prev => ({ ...prev, [activeTab]: res.data }));
      setIsDbConnected(true);
    } catch (err) {
      console.error(`Koneksi kueri ${activeTab} gagal:`, err);
      if (pageData[activeTab]) {
        console.info('Menggunakan data tersimpan dari cache lokal.');
      } else {
        setError('Gagal memuat data dari PostgreSQL aiesec_dw. Pastikan peladen FastAPI dan PostgreSQL aktif.');
        setIsDbConnected(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, filters]);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadActivePageData();
  }, [loadActivePageData]);

  // Hitung jumlah filter aktif
  const activeFiltersCount = 
    (filters.years?.length || 0) +
    (filters.products?.length || 0) +
    (filters.regions?.length || 0) +
    (filters.countries?.length || 0) +
    (filters.host_lcs?.length || 0);

  // Handler reset semua filter
  const handleResetFilters = () => {
    setFilters({
      years: [],
      products: [],
      regions: [],
      countries: [],
      host_lcs: []
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-['Lato',sans-serif] text-slate-800">
      {/* BILAH SISI (SIDEBAR) MURNI NAVIGASI - BISA DIBUKA / DITUTUP */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full">
        <Header
          activeTab={activeTab}
          isDbConnected={isDbConnected}
          onRefresh={loadActivePageData}
          isLoading={isLoading}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
          onInstallPwa={handleInstallPwa}
          canInstallPwa={canInstallPwa}
          isOffline={isOffline}
          onOpenFilter={() => setIsFilterModalOpen(true)}
          activeFiltersCount={activeFiltersCount}
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3 text-rose-800 text-xs sm:text-sm font-medium">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* MODAL PENYARING DATA (DIBUKA LEWAT TOMBOL DI SEBELAH REFRESH) */}
          <FilterBar
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            filters={filters}
            setFilters={setFilters}
            filterOptions={filterOptions}
            onResetFilters={handleResetFilters}
          />

          {activeTab === 'overview' && (
            <Overview data={pageData.overview} isLoading={isLoading} />
          )}

          {activeTab === 'trends' && (
            <ApplicationTrends data={pageData.trends} isLoading={isLoading} />
          )}

          {activeTab === 'funnel' && (
            <ConversionFunnel data={pageData.funnel} isLoading={isLoading} />
          )}

          {activeTab === 'destinations' && (
            <ErrorBoundary>
              <Destinations data={pageData.destinations} isLoading={isLoading} />
            </ErrorBoundary>
          )}

          {activeTab === 'rejections' && (
            <Rejections data={pageData.rejections} isLoading={isLoading} />
          )}
        </main>
      </div>
    </div>
  );
}
