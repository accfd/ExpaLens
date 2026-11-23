import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Target, 
  Globe2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed,
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
        fixed lg:sticky top-0 left-0 z-50 h-screen bg-white border-r border-slate-200 
        flex flex-col shrink-0 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0 shadow-2xl w-64' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between min-h-[72px]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#037EF3] flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20 shrink-0">
              E
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="transition-opacity duration-200 truncate">
                <h1 className="font-black text-lg text-slate-900 tracking-tight leading-none">ExpaLens</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">AIESEC IN UNAND</p>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="p-3 flex-1 overflow-y-auto">
          {(!isCollapsed || isMobileOpen) && (
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Modul Analitik
            </p>
          )}

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={isCollapsed && !isMobileOpen ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all min-h-[44px] cursor-pointer ${
                    isActive 
                      ? 'bg-blue-50 text-[#037EF3] shadow-xs border border-blue-200' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#037EF3]' : 'text-slate-400'}`} />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Toggle Collapse/Expand Button (Desktop Only) */}
        <div className="p-3 border-t border-slate-100 hidden lg:block">
          <button
            onClick={() => setIsCollapsed(prev => !prev)}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors text-xs font-bold cursor-pointer"
            title={isCollapsed ? "Buka Bilah Sisi" : "Tutup Bilah Sisi"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Ciutkan Menu</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Info */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="p-3 text-[10px] text-slate-400 font-medium text-center border-t border-slate-100">
            Departemen Outgoing Exchange
          </div>
        )}
      </aside>
    </>
  );
}
