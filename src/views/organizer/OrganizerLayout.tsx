import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  CalendarCheck,
  CheckSquare,
  DollarSign,
  HelpCircle,
  Eye,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  ChevronLeft,
} from 'lucide-react';

interface OrganizerLayoutProps {
  children: React.ReactNode;
}

export const OrganizerLayout: React.FC<OrganizerLayoutProps> = ({ children }) => {
  const {
    currentPage,
    navigate,
    theme,
    toggleTheme,
    setCurrentRole,
    organizers,
    user,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Current organizer profile
  const myOrg = organizers[0];

  const menuItems = [
    { id: 'org-overview', label: 'نظرة عامة', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'org-trips', label: 'رحلاتي', icon: <Compass className="w-4 h-4" /> },
    { id: 'org-create-trip', label: 'إنشاء رحلة جديدة', icon: <PlusCircle className="w-4 h-4 text-[#D9603B]" />, highlight: true },
    { id: 'org-bookings', label: 'الحجوزات', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'org-attendance', label: 'تسجيل الحضور والغياب', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'org-earnings', label: 'كشف الأرباح والمبالغ', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'org-questions', label: 'الأسئلة والاستفسارات', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'org-public-page', label: 'تعديل صفحتي العامة', icon: <Eye className="w-4 h-4" /> },
    { id: 'org-warnings', label: 'تحذيراتي والاستئناف', icon: <AlertTriangle className="w-4 h-4 text-amber-500" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#0A2E36] text-[#0A2E36] dark:text-[#F4EFE6] text-right flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 h-16 border-b border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/95 dark:bg-[#0A2E36]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="القائمة الجانبية"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-[#D9603B] text-white flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-cairo font-bold text-lg leading-none">استكشف</span>
              <span className="text-[10px] text-[#D9603B] font-bold mt-0.5">لوحة تحكم المنظم</span>
            </div>
          </button>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Back to adventurer view verbatim link */}
          <button
            onClick={() => {
              setCurrentRole('adventurer');
              navigate('home');
            }}
            className="px-3 py-1.5 rounded-lg border border-[#D9603B] text-[#D9603B] hover:bg-[#D9603B]/10 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">العودة إلى واجهة المغامر</span>
            <span className="sm:hidden">واجهة المغامر</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#0A2E36] dark:text-[#F4EFE6]"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#7CFFCB]" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto flex">
        {/* Desktop Fixed Side Menu */}
        <aside className="hidden lg:flex flex-col w-64 p-4 border-l border-[#E4DCCF] dark:border-[#1C4F5B] bg-white/50 dark:bg-[#123F49]/40 shrink-0 min-h-[calc(100vh-4rem)]">
          {/* Organizer Card in Sidebar */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] flex items-center gap-3 mb-4 shadow-xs">
            <img
              src={myOrg.logo}
              alt={myOrg.orgName}
              className="w-10 h-10 rounded-full object-cover border border-[#D9603B]/40"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="font-cairo font-bold text-xs truncate">{myOrg.orgName}</span>
              <span className="text-[10px] text-emerald-600 dark:text-[#7CFFCB] font-bold">
                {myOrg.verified ? 'موثّق رسمي ✅' : 'قيد المراجعة'}
              </span>
            </div>
          </div>

          {/* Menu links */}
          <div className="flex flex-col gap-1 flex-1">
            {menuItems.map(item => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-right ${
                    active
                      ? 'bg-[#D9603B] text-white shadow-xs'
                      : item.highlight
                      ? 'bg-[#D9603B]/10 text-[#D9603B] hover:bg-[#D9603B]/20'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Strikes quick indicator in sidebar */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-200 mt-4 flex items-center justify-between">
            <span>التحذيرات (السترايك):</span>
            <span className="font-bold">{myOrg.strikesCount} / 3</span>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-64 max-w-[80vw] h-full bg-[#F6F1EA] dark:bg-[#0A2E36] p-4 flex flex-col gap-2 z-10 shadow-2xl border-l border-[#E4DCCF] dark:border-[#1C4F5B]">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCF] dark:border-[#1C4F5B]">
                <span className="font-cairo font-bold text-sm">لوحة المنظم</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex flex-col gap-1 mt-2 flex-1 overflow-y-auto">
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-right ${
                      currentPage === item.id
                        ? 'bg-[#D9603B] text-white'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-black/5'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
