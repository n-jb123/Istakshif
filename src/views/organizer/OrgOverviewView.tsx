import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  CalendarCheck,
  DollarSign,
  Star,
  AlertTriangle,
  HelpCircle,
  Clock,
  ArrowRight,
  PlusCircle,
  Users,
} from 'lucide-react';

export const OrgOverviewView: React.FC = () => {
  const { trips, bookings, organizers, navigate } = useApp();

  const myOrg = organizers[0];
  const myTrips = trips.filter(t => t.organizerId === myOrg.id);

  // Stats
  const activeTripsCount = myTrips.filter(t => t.status === 'published').length;
  const totalBookings = bookings.length;
  const totalToCollect = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((acc, curr) => acc + curr.remainingToOrganizer, 0);

  return (
    <div className="flex flex-col gap-6 text-right">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
            نظرة عامة على النشاط
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            مرحباً بعودتك! تابع أداء رحلاتك والحجوزات والإجراءات العاجلة المطلوبة.
          </p>
        </div>

        <button
          onClick={() => navigate('org-create-trip')}
          className="h-11 px-5 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إنشاء رحلة جديدة</span>
        </button>
      </div>

      {/* Strike Alert Banner (Section 8.2 & 8.10) */}
      {myOrg.strikesCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">«لديك {myOrg.strikesCount} تحذير من 3.»</p>
              <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                عند الوصول إلى 3 تحذيرات يتم حظر الحساب تلقائياً. يمكنك تقديم إثبات قوة قاهرة لإسقاط التحذير.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('org-warnings')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors shrink-0"
          >
            صفحة التحذيرات
          </button>
        </div>
      )}

      {/* 4 Number Cards (Section 8.2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('org-trips')}
          className="p-5 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col justify-between gap-3 cursor-pointer hover:border-[#D9603B] transition-all"
        >
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold">الرحلات النشطة</span>
            <Compass className="w-5 h-5 text-[#D9603B]" />
          </div>
          <div>
            <span className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6] tabular-nums">
              {activeTripsCount}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-[#7CFFCB] block mt-0.5">
              منشورة للجمهور
            </span>
          </div>
        </div>

        <div
          onClick={() => navigate('org-bookings')}
          className="p-5 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col justify-between gap-3 cursor-pointer hover:border-[#D9603B] transition-all"
        >
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold">الحجوزات الجديدة</span>
            <CalendarCheck className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <span className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6] tabular-nums">
              {totalBookings}
            </span>
            <span className="text-[11px] text-blue-600 block mt-0.5">
              مقاعد محجوزة
            </span>
          </div>
        </div>

        <div
          onClick={() => navigate('org-earnings')}
          className="p-5 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col justify-between gap-3 cursor-pointer hover:border-[#D9603B] transition-all"
        >
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold">المتبقي للتحصيل</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <span className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6] tabular-nums">
              {totalToCollect.toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-500 block mt-0.5">
              ل.س (يُدفع لك باليد يوم الرحلة)
            </span>
          </div>
        </div>

        <div
          onClick={() => navigate('org-public-page')}
          className="p-5 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col justify-between gap-3 cursor-pointer hover:border-[#D9603B] transition-all"
        >
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold">متوسط التقييم</span>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <span className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6] tabular-nums">
              {myOrg.rating.toFixed(1)} / 5
            </span>
            <span className="text-[11px] text-gray-500 block mt-0.5">
              بناءً على تقييمات المغامرين
            </span>
          </div>
        </div>
      </div>

      {/* "تحتاج إجراء" List (Section 8.2 verbatim) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60">
          <h2 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
            قائمة "تحتاج إجراء" (عاجل)
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700">
            3 مهام تتطلب انتباهك
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <div className="p-3.5 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/40 border border-[#E4DCCF] dark:border-[#1C4F5B] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6] block">
                  سؤال جديد بدون إجابة في رحلة مسار قمم بلودان
                </span>
                <span className="text-[11px] text-gray-500">
                  المغامر أحمد يسأل عن مناسبة المسار للمبتدئين.
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('org-questions')}
              className="px-3 py-1.5 rounded-lg bg-[#D9603B] text-white font-bold text-xs"
            >
              الرد الآن
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/40 border border-[#E4DCCF] dark:border-[#1C4F5B] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6] block">
                  رحلة شاطئ رأس البسيط اقتربت من موعد الحسم للعدد الأدنى
                </span>
                <span className="text-[11px] text-gray-500">
                  المسجلون: 30 مقعد (تم بلوغ الحد الأدنى بنجاح).
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('org-trips')}
              className="px-3 py-1.5 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] font-bold text-xs"
            >
              مراجعة الرحلة
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/40 border border-[#E4DCCF] dark:border-[#1C4F5B] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6] block">
                  تسجيل الغياب لرحلة وادي اليرموك المنتهية
                </span>
                <span className="text-[11px] text-gray-500">
                  «متبقي 18 ساعة لتسجيل الغياب» قبل الإغلاق التلقائي.
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('org-attendance')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
            >
              تسجيل الحضور
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Trips Compact Cards */}
      <div className="flex flex-col gap-4">
        <h2 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
          الرحلات القادمة
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {myTrips.slice(0, 2).map(trip => (
            <div
              key={trip.id}
              className="p-4 rounded-xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={trip.images[0]}
                  alt={trip.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
                    {trip.title}
                  </h3>
                  <span className="text-gray-500 text-[11px]">{trip.startDate}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#D9603B] font-bold">
                      {trip.seatsTaken} / {trip.seatsTotal} مقعد محجوز
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('org-bookings')}
                className="px-3 py-1.5 rounded-lg border border-[#D9603B] text-[#D9603B] font-bold text-xs shrink-0"
              >
                قائمة الحجوزات
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
