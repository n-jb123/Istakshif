import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  User,
  CalendarCheck,
  Award,
  Shield,
  Briefcase,
  LogOut,
  ChevronDown,
  CheckCheck,
  Eye,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    theme,
    setTheme,
    toggleTheme,
    currentRole,
    setCurrentRole,
    currentPage,
    navigate,
    user,
    notifications,
    openAuthModal,
    logoutUser,
    markNotificationsAsRead,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'trips', label: 'الرحلات' },
    { id: 'organizers', label: 'المنظمون' },
    { id: 'my-bookings', label: 'حجوزاتي', protected: true },
    { id: 'favorites', label: 'المفضلة', protected: true },
  ];

  const handleNavClick = (id: string, isProtected?: boolean) => {
    if (isProtected && currentRole === 'guest') {
      openAuthModal('login');
      return;
    }
    navigate(id);
    setMobileMenuOpen(false);
  };

  // Mock visitor sample announcements
  const visitorAnnouncements = [
    {
      id: 'v-1',
      title: 'مرحباً بك في منصة استكشف! 🇸🇾',
      body: 'تصفح أروع رحلات ومغامرات الطبيعة والآثار بين جميع المحافظات السورية بأسعار واضحة.',
      date: 'اليوم',
      linkPage: 'trips',
    },
    {
      id: 'v-2',
      title: 'خصم 15% على رحلات نهاية الأسبوع',
      body: 'عروض حصرية على رحلات صيدنايا، معلولا، والساحل السوري متاحة للحجز المباشر.',
      date: 'أمس',
      linkPage: 'trips',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md transition-colors duration-200 border-b border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/95 dark:bg-[#0A2E36]/95">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Right side: Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 group text-right focus:outline-none cursor-pointer"
            aria-label="الصفحة الرئيسية لاستكشف"
          >
            <div className="w-10 h-10 rounded-xl bg-[#D9603B] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col text-right">
              <span className="font-cairo font-bold text-xl sm:text-2xl text-[#0A2E36] dark:text-[#F4EFE6] tracking-tight leading-none">
                استكشف
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-[#D9603B] tracking-wider leading-none mt-1">
                رحلات ومغامرات سوريا
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map(link => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id, link.protected)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#D9603B] bg-[#D9603B]/10 font-bold'
                    : 'text-[#0A2E36]/80 dark:text-[#F4EFE6]/80 hover:text-[#D9603B] dark:hover:text-[#7CFFCB]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Left side: Role Switcher, Notifications, Dark Mode Toggle, Auth / Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Role / Perspective Switcher: includes Visitor (زائر), Adventurer (مغامر), Organizer (منظم), Admin (أدمن) */}
          <div className="hidden md:flex items-center bg-[#E4DCCF]/60 dark:bg-[#123F49] p-0.5 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] text-xs">
            <button
              onClick={() => {
                setCurrentRole('guest');
                navigate('home');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                currentRole === 'guest'
                  ? 'bg-white dark:bg-[#0A2E36] text-[#D9603B] font-bold shadow-xs'
                  : 'text-[#0A2E36]/70 dark:text-[#F4EFE6]/70 hover:text-[#0A2E36] dark:hover:text-white'
              }`}
              title="عرض واجهة الزائر (بدون تسجيل دخول)"
            >
              <Eye className="w-3.5 h-3.5 text-[#D9603B]" />
              <span>زائر</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('adventurer');
                navigate('home');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                currentRole === 'adventurer'
                  ? 'bg-white dark:bg-[#0A2E36] text-[#D9603B] font-bold shadow-xs'
                  : 'text-[#0A2E36]/70 dark:text-[#F4EFE6]/70 hover:text-[#0A2E36] dark:hover:text-white'
              }`}
              title="عرض واجهة المغامر"
            >
              <span>مغامر</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('organizer');
                navigate('org-overview');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                currentRole === 'organizer'
                  ? 'bg-white dark:bg-[#0A2E36] text-[#D9603B] font-bold shadow-xs'
                  : 'text-[#0A2E36]/70 dark:text-[#F4EFE6]/70 hover:text-[#0A2E36] dark:hover:text-white'
              }`}
              title="عرض لوحة تحكم المنظم"
            >
              <span>منظم</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('admin');
                navigate('admin-overview');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-white dark:bg-[#0A2E36] text-[#D9603B] font-bold shadow-xs'
                  : 'text-[#0A2E36]/70 dark:text-[#F4EFE6]/70 hover:text-[#0A2E36] dark:hover:text-white'
              }`}
              title="عرض لوحة تحكم الأدمن"
            >
              <span>أدمن</span>
            </button>
          </div>

          {/* Notifications Dropdown Menu (Always visible for all users & visitors) */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => {
                setNotificationsDropdownOpen(prev => !prev);
                setProfileDropdownOpen(false);
              }}
              className={`relative p-2 rounded-xl transition-all cursor-pointer border ${
                notificationsDropdownOpen
                  ? 'bg-[#D9603B]/10 text-[#D9603B] border-[#D9603B]/30'
                  : 'text-[#0A2E36] dark:text-[#F4EFE6] bg-white/70 dark:bg-[#123F49] border-[#E4DCCF] dark:border-[#1C4F5B] hover:border-[#D9603B]/40'
              }`}
              aria-label="قائمة الإشعارات المنسدلة"
              aria-expanded={notificationsDropdownOpen}
              title="الإشعارات والتنبيهات"
            >
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {currentRole !== 'guest' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D9603B] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#0A2E36] shadow-xs">
                  {unreadCount}
                </span>
              )}
              {currentRole === 'guest' && (
                <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-[#7CFFCB] ring-1 ring-white dark:ring-[#0A2E36]" />
              )}
            </button>

            {/* Notifications Dropdown Menu Popover */}
            {notificationsDropdownOpen && (
              <div className="absolute left-0 sm:left-auto right-auto sm:right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#123F49] shadow-2xl border border-[#E4DCCF] dark:border-[#1C4F5B] py-3 z-50 text-right animate-in fade-in zoom-in-95 duration-150 flex flex-col">
                {/* Header */}
                <div className="px-4 pb-2.5 border-b border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
                      الإشعارات
                    </span>
                    {currentRole !== 'guest' ? (
                      unreadCount > 0 ? (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D9603B] text-white">
                          {unreadCount} جديد
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-[#7CFFCB]">
                          محدّثة
                        </span>
                      )
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D9603B]/10 text-[#D9603B]">
                        تنبيهات المنصة
                      </span>
                    )}
                  </div>
                  {currentRole !== 'guest' && unreadCount > 0 && (
                    <button
                      onClick={() => markNotificationsAsRead()}
                      className="text-[11px] font-bold text-[#D9603B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>تعليم الكل كمقروء</span>
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-[#E4DCCF]/40 dark:divide-[#1C4F5B]/40">
                  {currentRole !== 'guest' ? (
                    notifications.length > 0 ? (
                      notifications.slice(0, 6).map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            if (notif.linkPage && notif.linkId) {
                              navigate(notif.linkPage, { id: notif.linkId });
                            } else {
                              navigate('notifications');
                            }
                            setNotificationsDropdownOpen(false);
                          }}
                          className={`p-3.5 flex items-start gap-3 hover:bg-[#F6F1EA]/70 dark:hover:bg-[#0A2E36]/60 transition-colors cursor-pointer text-xs ${
                            !notif.read ? 'bg-[#D9603B]/5 dark:bg-[#D9603B]/10' : ''
                          }`}
                        >
                          <div className="shrink-0 mt-1">
                            {!notif.read ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#D9603B] block ring-2 ring-white dark:ring-[#123F49]" />
                            ) : (
                              <span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 block" />
                            )}
                          </div>
                          <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6] truncate">
                                {notif.title}
                              </span>
                              <span className="text-[10px] text-gray-400 shrink-0">{notif.date}</span>
                            </div>
                            <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                              {notif.body}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-xs text-gray-500">
                        لا توجد إشعارات حالياً
                      </div>
                    )
                  ) : (
                    // Visitor announcements in dropdown
                    <div className="p-2 space-y-1">
                      {visitorAnnouncements.map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            navigate(item.linkPage);
                            setNotificationsDropdownOpen(false);
                          }}
                          className="p-3 rounded-xl hover:bg-[#F6F1EA] dark:hover:bg-[#0A2E36]/60 transition-colors cursor-pointer text-xs"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6] flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#D9603B]" />
                              {item.title}
                            </span>
                            <span className="text-[10px] text-gray-400">{item.date}</span>
                          </div>
                          <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                            {item.body}
                          </p>
                        </div>
                      ))}

                      <div className="p-2.5 mt-2 bg-[#D9603B]/10 dark:bg-[#D9603B]/20 rounded-xl text-center">
                        <p className="text-xs text-[#0A2E36] dark:text-[#F4EFE6] mb-2 font-medium">
                          سجّل دخولك للحصول على إشعارات الحجز والتحديثات المباشرة
                        </p>
                        <button
                          onClick={() => {
                            openAuthModal('login');
                            setNotificationsDropdownOpen(false);
                          }}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#D9603B] text-white hover:bg-[#C04E2B] transition-colors cursor-pointer shadow-xs"
                        >
                          تسجيل الدخول الآن
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 pt-2.5 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 text-center">
                  <button
                    onClick={() => {
                      if (currentRole === 'guest') {
                        navigate('trips');
                      } else {
                        navigate('notifications');
                      }
                      setNotificationsDropdownOpen(false);
                    }}
                    className="text-xs font-bold text-[#D9603B] hover:underline cursor-pointer"
                  >
                    {currentRole === 'guest' ? 'تصفح الرحلات والعروض ←' : 'عرض كل الإشعارات ←'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle Switch (فاتح / داكن) */}
          <div className="flex items-center bg-white/80 dark:bg-[#123F49] p-0.5 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-[#F6F1EA] text-[#0A2E36] shadow-xs ring-1 ring-[#D9603B]/30'
                  : 'text-[#0A2E36]/60 dark:text-[#F4EFE6]/60 hover:text-[#0A2E36]'
              }`}
              title="تفعيل الوضع الفاتح (Light Mode)"
              aria-label="الوضع الفاتح"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline text-[11px]">فاتح</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#0A2E36] text-[#7CFFCB] shadow-xs ring-1 ring-[#7CFFCB]/40'
                  : 'text-[#0A2E36]/60 dark:text-[#F4EFE6]/60 hover:text-[#7CFFCB]'
              }`}
              title="تفعيل الوضع الداكن (Dark Mode)"
              aria-label="الوضع الداكن"
            >
              <Moon className="w-3.5 h-3.5 text-[#7CFFCB]" />
              <span className="hidden sm:inline text-[11px]">داكن</span>
            </button>
          </div>

          {/* User signed in vs Guest / Visitor */}
          {currentRole !== 'guest' ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setProfileDropdownOpen(prev => !prev);
                  setNotificationsDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-white/70 dark:bg-[#123F49] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                aria-expanded={profileDropdownOpen}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-[#D9603B]/40 bg-[#D9603B]/20 flex items-center justify-center text-[#D9603B] shrink-0 font-bold text-xs">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name.slice(0, 1) || <User className="w-4 h-4" />
                  )}
                </div>
                <span className="hidden md:inline text-xs font-semibold text-[#0A2E36] dark:text-[#F4EFE6] max-w-[90px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#123F49] shadow-2xl border border-[#E4DCCF] dark:border-[#1C4F5B] py-2 z-50 text-right animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-[#E4DCCF]/50 dark:border-[#1C4F5B]/50">
                    <p className="text-xs font-bold text-[#0A2E36] dark:text-[#F4EFE6]">{user.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      navigate('profile');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#0A2E36] dark:text-[#F4EFE6] hover:bg-[#F6F1EA] dark:hover:bg-[#0A2E36] transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#D9603B]" />
                    <span>الملف الشخصي</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('profile', { tab: 'achievements' });
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#0A2E36] dark:text-[#F4EFE6] hover:bg-[#F6F1EA] dark:hover:bg-[#0A2E36] transition-colors cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-[#D9603B]" />
                    <span>إنجازاتي وخريطة سوريا</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('my-bookings');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#0A2E36] dark:text-[#F4EFE6] hover:bg-[#F6F1EA] dark:hover:bg-[#0A2E36] transition-colors cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4 text-[#D9603B]" />
                    <span>حجوزاتي</span>
                  </button>

                  <div className="my-1 border-t border-[#E4DCCF]/50 dark:border-[#1C4F5B]/50" />

                  {/* Switch to Visitor mode directly from menu */}
                  <button
                    onClick={() => {
                      setCurrentRole('guest');
                      setProfileDropdownOpen(false);
                      navigate('home');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#0A2E36] dark:text-[#F4EFE6] hover:bg-[#F6F1EA] dark:hover:bg-[#0A2E36] transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#D9603B]" />
                    <span>تصفح كزائر (Visitor Mode)</span>
                  </button>

                  {currentRole === 'organizer' ? (
                    <button
                      onClick={() => {
                        navigate('org-overview');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#D9603B] hover:bg-[#D9603B]/10 transition-colors cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>لوحة المنظم</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        navigate('upgrade-organizer');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#D9603B] hover:bg-[#D9603B]/10 transition-colors cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>ترقية إلى منظم</span>
                    </button>
                  )}

                  {currentRole === 'admin' && (
                    <button
                      onClick={() => {
                        navigate('admin-overview');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#1F8F68] dark:text-[#7CFFCB] hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors cursor-pointer"
                    >
                      <Shield className="w-4 h-4" />
                      <span>لوحة الأدمن</span>
                    </button>
                  )}

                  <div className="my-1 border-t border-[#E4DCCF]/50 dark:border-[#1C4F5B]/50" />

                  <button
                    onClick={() => {
                      logoutUser();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-[#0A2E36] dark:text-[#F4EFE6] hover:text-[#D9603B] transition-colors cursor-pointer"
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#D9603B] text-white hover:bg-[#C04E2B] transition-colors shadow-xs cursor-pointer"
              >
                حساب جديد
              </button>
            </div>
          )}

          {/* Mobile drawer hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 rounded-xl text-[#0A2E36] dark:text-[#F4EFE6] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer border border-[#E4DCCF] dark:border-[#1C4F5B]"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-[#F6F1EA] dark:bg-[#0A2E36] border-b border-[#E4DCCF] dark:border-[#1C4F5B] shadow-2xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Nav links */}
          <div className="flex flex-col gap-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id, link.protected)}
                className={`text-right px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  currentPage === link.id
                    ? 'bg-[#D9603B] text-white'
                    : 'text-[#0A2E36] dark:text-[#F4EFE6] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Role / Perspective Switcher with Visitor explicitly included */}
          <div className="pt-3 border-t border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col gap-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              تبديل المنظور (اختبار الأدوار):
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => {
                  setCurrentRole('guest');
                  setMobileMenuOpen(false);
                  navigate('home');
                }}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentRole === 'guest'
                    ? 'bg-[#D9603B] text-white shadow-xs'
                    : 'bg-white dark:bg-[#123F49] text-[#0A2E36] dark:text-[#F4EFE6] border border-[#E4DCCF] dark:border-[#1C4F5B]'
                }`}
              >
                🧭 زائر
              </button>
              <button
                onClick={() => {
                  setCurrentRole('adventurer');
                  setMobileMenuOpen(false);
                  navigate('home');
                }}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentRole === 'adventurer'
                    ? 'bg-[#D9603B] text-white shadow-xs'
                    : 'bg-white dark:bg-[#123F49] text-[#0A2E36] dark:text-[#F4EFE6] border border-[#E4DCCF] dark:border-[#1C4F5B]'
                }`}
              >
                🎒 مغامر
              </button>
              <button
                onClick={() => {
                  setCurrentRole('organizer');
                  setMobileMenuOpen(false);
                  navigate('org-overview');
                }}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentRole === 'organizer'
                    ? 'bg-[#D9603B] text-white shadow-xs'
                    : 'bg-white dark:bg-[#123F49] text-[#0A2E36] dark:text-[#F4EFE6] border border-[#E4DCCF] dark:border-[#1C4F5B]'
                }`}
              >
                📋 منظم
              </button>
              <button
                onClick={() => {
                  setCurrentRole('admin');
                  setMobileMenuOpen(false);
                  navigate('admin-overview');
                }}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentRole === 'admin'
                    ? 'bg-[#D9603B] text-white shadow-xs'
                    : 'bg-white dark:bg-[#123F49] text-[#0A2E36] dark:text-[#F4EFE6] border border-[#E4DCCF] dark:border-[#1C4F5B]'
                }`}
              >
                🛡️ أدمن
              </button>
            </div>
          </div>

          {/* Dark Mode switcher for Mobile */}
          <div className="pt-2 border-t border-[#E4DCCF] dark:border-[#1C4F5B] flex items-center justify-between">
            <span className="text-xs font-bold text-[#0A2E36] dark:text-[#F4EFE6]">
              مظهر التطبيق:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-[#0A2E36] border-[#D9603B] shadow-xs'
                    : 'text-gray-500 border-transparent'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>فاتح</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#123F49] text-[#7CFFCB] border-[#7CFFCB] shadow-xs'
                    : 'text-gray-500 border-transparent'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-[#7CFFCB]" />
                <span>داكن</span>
              </button>
            </div>
          </div>

          {/* User status or login buttons */}
          <div className="pt-2 border-t border-[#E4DCCF] dark:border-[#1C4F5B]">
            {currentRole === 'guest' ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 text-center text-sm font-bold border border-[#D9603B] text-[#D9603B] rounded-xl hover:bg-[#D9603B]/10 transition-colors cursor-pointer"
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => {
                    openAuthModal('register');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 text-center text-sm font-bold bg-[#D9603B] text-white rounded-xl hover:bg-[#C04E2B] transition-colors shadow-xs cursor-pointer"
                >
                  حساب جديد
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#D9603B]/20 text-[#D9603B] flex items-center justify-center font-bold">
                    {user.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0A2E36] dark:text-[#F4EFE6]">{user.name}</p>
                    <p className="text-[11px] text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-600 font-bold px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                >
                  خروج
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
