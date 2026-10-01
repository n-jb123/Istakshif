import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CreditCard,
  UserCheck,
  Compass,
  RotateCcw,
  Users,
  Settings,
  Activity,
  MapPin,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    currentPage,
    navigate,
    theme,
    toggleTheme,
    setCurrentRole,
    bookings,
    organizers,
    trips,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Pending counts for badges
  const pendingPaymentsCount = bookings.filter(b => b.status === 'payment_review').length;
  const pendingVerificationsCount = organizers.filter(o => o.status === 'pending').length;
  const pendingTripsCount = trips.filter(t => t.status === 'pending_review').length;

  return (
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#0A2E36] text-[#0A2E36] dark:text-[#F4EFE6] text-right flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 h-16 border-b border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/95 dark:bg-[#0A2E36]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="القائمة الجانبية للأدمن"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-[#123F49] text-[#7CFFCB] border border-[#1C4F5B] flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-cairo font-bold text-lg leading-none">استكشف</span>
              <span className="text-[10px] text-[#7CFFCB] font-bold mt-0.5">لوحة الإدارة والتحكم (Admin)</span>
            </div>
          </button>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCurrentRole('adventurer');
              navigate('home');
            }}
            className="px-3 py-1.5 rounded-lg border border-[#D9603B] text-[#D9603B] hover:bg-[#D9603B]/10 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">العودة لواجهة الموقع</span>
            <span className="sm:hidden">الموقع</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#0A2E36] dark:text-[#F4EFE6]"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#7CFFCB]" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto flex">
        {/* DESKTOP FIXED SIDE MENU (Grouped with red counters - Section 5.3) */}
        <aside className="hidden lg:flex flex-col w-64 p-4 border-l border-[#E4DCCF] dark:border-[#1C4F5B] bg-white/40 dark:bg-[#123F49]/40 shrink-0 min-h-[calc(100vh-4rem)] text-xs">
          {/* Overview top outside groups */}
          <button
            onClick={() => navigate('admin-overview')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all mb-4 text-right ${
              currentPage === 'admin-overview'
                ? 'bg-[#0A2E36] text-white dark:bg-[#123F49] shadow-xs ring-1 ring-[#1C4F5B]'
                : 'text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#7CFFCB]" />
            <span>نظرة عامة وإحصائيات</span>
          </button>

          <div className="flex flex-col gap-5 flex-1 overflow-y-auto">
            {/* Group 1: الطلبات */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-[#D9603B] px-3 mb-1">
                الطلبات والمراجعات
              </span>

              <button
                onClick={() => navigate('admin-payments')}
                className={`flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === 'admin-payments'
                    ? 'bg-[#D9603B] text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-black/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4" />
                  <span>مراجعة الدفعات</span>
                </div>
                {pendingPaymentsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white font-bold text-[10px] flex items-center justify-center">
                    {pendingPaymentsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate('admin-verifications')}
                className={`flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === 'admin-verifications'
                    ? 'bg-[#D9603B] text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-black/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4" />
                  <span>توثيق المنظمين</span>
                </div>
                {pendingVerificationsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white font-bold text-[10px] flex items-center justify-center">
                    {pendingVerificationsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate('admin-trips')}
                className={`flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === 'admin-trips'
                    ? 'bg-[#D9603B] text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-black/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4" />
                  <span>مراجعة الرحلات</span>
                </div>
                {pendingTripsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white font-bold text-[10px] flex items-center justify-center">
                    {pendingTripsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Group 2: المحتوى والمحافظات */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-gray-500 px-3 mb-1">
                المحتوى والتصنيفات
              </span>

              <button
                onClick={() => navigate('admin-trips')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-black/5"
              >
                <Layers className="w-4 h-4" />
                <span>إدارة الرحلات المنشورة</span>
              </button>

              <button
                onClick={() => navigate('admin-settings')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-black/5"
              >
                <MapPin className="w-4 h-4" />
                <span>المحافظات والتصنيفات</span>
              </button>
            </div>

            {/* Group 3: المستخدمون والإعدادات */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-gray-500 px-3 mb-1">
                المستخدمون والإعدادات
              </span>

              <button
                onClick={() => navigate('admin-settings')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === 'admin-settings'
                    ? 'bg-[#D9603B] text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-black/5'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>إعدادات وحسابات الدفع</span>
              </button>

              <button
                onClick={() => navigate('admin-overview')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-black/5"
              >
                <Activity className="w-4 h-4" />
                <span>سجل النشاط (Audit Log)</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
