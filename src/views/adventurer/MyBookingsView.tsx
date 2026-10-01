import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingStatus } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Star,
  Users,
  ChevronLeft,
  Flame,
} from 'lucide-react';

export const MyBookingsView: React.FC = () => {
  const {
    bookings,
    navigate,
    openCancelModal,
    openRateModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'past' | 'cancelled' | 'waitlist'>('upcoming');

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'upcoming') {
      return b.status === 'confirmed' || b.status === 'payment_review';
    }
    if (activeTab === 'pending') {
      return b.status === 'pending_payment';
    }
    if (activeTab === 'past') {
      return b.status === 'attended' || b.status === 'no_show';
    }
    if (activeTab === 'cancelled') {
      return (
        b.status === 'cancelled_by_user' ||
        b.status === 'cancelled_by_organizer' ||
        b.status === 'cancelled_auto' ||
        b.status === 'refund_pending' ||
        b.status === 'refunded'
      );
    }
    if (activeTab === 'waitlist') {
      return b.status === 'waitlisted';
    }
    return true;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-[#7CFFCB]">
            مؤكد
          </span>
        );
      case 'payment_review':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
            قيد مراجعة الدفع
          </span>
        );
      case 'pending_payment':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
            بانتظار الدفع
          </span>
        );
      case 'refund_pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300">
            قيد الاسترجاع
          </span>
        );
      case 'attended':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            حضر
          </span>
        );
      case 'no_show':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300">
            لم يحضر
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600">
            ملغي
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-16 text-right">
      {/* Title */}
      <div>
        <h1 className="font-cairo font-bold text-2xl sm:text-3xl text-[#0A2E36] dark:text-[#F4EFE6]">
          حجوزاتي
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          إدارة حجوزاتك، إشعارات الدفع، ومتابعة الرحلات القادمة والسابقة.
        </p>
      </div>

      {/* Prominent Waiting List Seat Claim Banner (Section 7.6) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D9603B]/20 via-[#7CFFCB]/20 to-transparent border border-[#D9603B] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D9603B] text-white flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-[#D9603B] block">
              «تم فتح مقعد لك. احجزه خلال 12 ساعة.»
            </span>
            <p className="text-gray-700 dark:text-gray-300 mt-0.5">
              توفر مقعد في رحلة رأس البسيط والكسب. ينتهي خيار الحجز بعد 09:45:12.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('trip-detail', { id: 'trip-3' })}
          className="px-5 py-2.5 rounded-xl bg-[#D9603B] text-white font-bold hover:bg-[#C04E2B] transition-colors shrink-0"
        >
          احجز مقعدك الآن
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#E4DCCF] dark:border-[#1C4F5B] pb-2 text-xs font-bold scrollbar-none">
        {[
          { id: 'upcoming', label: 'القادمة' },
          { id: 'pending', label: 'بانتظار الدفع' },
          { id: 'past', label: 'السابقة' },
          { id: 'cancelled', label: 'الملغاة' },
          { id: 'waitlist', label: 'قوائم الانتظار' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-[#D9603B] text-white shadow-xs'
                : 'bg-white dark:bg-[#123F49] text-gray-600 dark:text-gray-300 border border-[#E4DCCF] dark:border-[#1C4F5B] hover:text-[#D9603B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredBookings.map(b => (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
            >
              {/* Left/Middle Content */}
              <div className="flex items-start gap-4">
                <img
                  src={b.tripImage}
                  alt={b.tripTitle}
                  className="w-24 h-24 rounded-xl object-cover shrink-0 border border-[#E4DCCF] dark:border-[#1C4F5B]"
                />
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(b.status)}
                    <span className="text-gray-400 font-mono">#{b.id}</span>
                  </div>
                  <h3 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
                    {b.tripTitle}
                  </h3>
                  <div className="flex items-center gap-3 text-gray-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {b.startDate}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {b.seatsCount} {b.seatsCount === 1 ? 'مقعد' : 'مقاعد'}
                    </span>
                  </div>

                  {/* Financial snapshot */}
                  <div className="flex items-center gap-4 text-[11px] pt-1">
                    <span className="text-[#D9603B] font-bold">
                      العربون: {b.depositTotal.toLocaleString()} ل.س
                    </span>
                    <span className="text-gray-500">
                      المتبقي للمنظم: {b.remainingToOrganizer.toLocaleString()} ل.س
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60">
                {b.status === 'pending_payment' && (
                  <button
                    onClick={() => navigate('booking-detail', { id: b.id })}
                    className="px-4 py-2 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    رفع إشعار التحويل
                  </button>
                )}

                {(b.status === 'confirmed' || b.status === 'payment_review') && (
                  <button
                    onClick={() => openCancelModal(b)}
                    className="px-3.5 py-2 rounded-xl border border-red-300 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold text-xs transition-colors"
                  >
                    إلغاء مقعد
                  </button>
                )}

                {b.status === 'attended' && (
                  <button
                    onClick={() => openRateModal(b)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>قيّم الرحلة</span>
                  </button>
                )}

                <button
                  onClick={() => navigate('booking-detail', { id: b.id })}
                  className="px-4 py-2 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] text-[#0A2E36] dark:text-[#F4EFE6] font-bold text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-center"
                >
                  تفاصيل الحجز
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] text-center flex flex-col items-center justify-center gap-3">
          <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600" />
          <h4 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
            لا توجد حجوزات في هذا التبويب
          </h4>
          <p className="text-xs text-gray-500 max-w-sm">
            يمكنك تصفح الرحلات المتاحة وحجز مقعدك لبدء مغامرتك القادمة بين المحافظات.
          </p>
          <button
            onClick={() => navigate('trips')}
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#D9603B] text-white font-bold text-xs shadow-sm hover:bg-[#C04E2B]"
          >
            استكشف الرحلات الآن
          </button>
        </div>
      )}
    </div>
  );
};
