import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-2xl p-8 border border-rose-200 shadow-sm text-center my-6 max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Terjadi Kendala Memuat Komponen Ini</h3>
            <p className="text-xs text-slate-500 mt-1">
              {this.state.error?.message || 'Silakan muat ulang halaman atau segarkan data.'}
            </p>
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="inline-flex items-center gap-2 bg-[#037EF3] hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Muat Ulang Halaman</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
