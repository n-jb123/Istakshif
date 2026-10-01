import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast, theme } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isDanger = toast.type === 'danger';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border transition-all duration-200 transform translate-y-0 ${
              isSuccess
                ? theme === 'dark'
                  ? 'bg-[#123F49] border-[#7CFFCB]/40 text-[#7CFFCB]'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : isDanger
                ? theme === 'dark'
                  ? 'bg-[#123F49] border-[#FF6B6B]/40 text-[#FF6B6B]'
                  : 'bg-red-50 border-red-200 text-red-900'
                : theme === 'dark'
                ? 'bg-[#123F49] border-[#F5A623]/40 text-[#F5A623]'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-current" />}
              {isDanger && <AlertCircle className="w-5 h-5 text-current" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-current" />}
            </div>
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity p-1"
              aria-label="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
