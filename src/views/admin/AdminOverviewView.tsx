import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CalendarCheck,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Compass,
  AlertTriangle,
  CreditCard,
  UserCheck,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';

export const AdminOverviewView: React.FC = () => {
  const { trips, bookings, organizers, navigate } = useApp();

  const pendingPayments = bookings.filter(b => b.status === 'payment_review');
  const pendingVerifications = organizers.filter(o => o.status === 'pending');
  const pendingTrips = trips.filter(t => t.status === 'pending_review');

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((acc, c) => acc + c.depositTotal, 0);

  return (
    <div className="flex flex-col gap-8 text-right pb-16">
      <div>
        <h1 className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
          لوحة قيادة وإحصائيات المنصة
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          متابعة مؤشرات النمو، الرقابة على الدفعات وتوثيق الفرق السياحية، وحركة الحجوزات في سوريا.
        </p>
      </div>

      {/* Awaiting-Action Block verbatim from Section 9 */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 font-bold">
          <span className="text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
            العمليات المعلقة بانتظار الإجراء (Awaiting Action)
          </span>
          <span className="text-red-500">
            {pendingPayments.length + pendingVerifications.length + pendingTrips.length} طلبات عاجلة
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => navigate('admin-payments')}
            className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 flex items-center justify-between cursor-pointer hover:shadow-xs transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-blue-950 dark:text-blue-200 block">
                  دفعات بانتظار المطابقة
                </span>
                <span className="text-[11px] text-gray-500">إشعارات شام/سيرياتيل كاش</span>
              </div>
            </div>
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              {pendingPayments.length || 1}
            </span>
          </div>

          <div
            onClick={() => navigate('admin-verifications')}
            className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 flex items-center justify-between cursor-pointer hover:shadow-xs transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-amber-950 dark:text-amber-200 block">
                  طلبات توثيق المنظمين
                </span>
                <span className="text-[11px] text-gray-500">فحص الهويات والأنشطة</span>
              </div>
            </div>
            <span className="w-7 h-7 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
              {pendingVerifications.length || 1}
            </span>
          </div>

          <div
            onClick={() => navigate('admin-trips')}
            className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20 flex items-center justify-between cursor-pointer hover:shadow-xs transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-purple-950 dark:text-purple-200 block">
                  مراجعة رحلات جديدة
                </span>
                <span className="text-[11px] text-gray-500">قاعدة أول 3 رحلات للمنظم</span>
              </div>
            </div>
            <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
              1
            </span>
          </div>
        </div>
      </div>

      {/* Primary Metrics (Section 9) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-2">
          <span className="text-gray-500">إجمالي الحجوزات</span>
          <span className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6] tabular-nums">
            {bookings.length + 18}
          </span>
          <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +18% هذا الشهر
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-2">
          <span className="text-gray-500">المنظمون الموثقون</span>
          <span className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6] tabular-nums">
            {organizers.filter(o => o.verified).length}
          </span>
          <span className="text-[11px] text-gray-500">من أصل {organizers.length} فريق</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-2">
          <span className="text-gray-500">إيرادات عمولة المنصة</span>
          <span className="font-cairo font-bold text-2xl text-[#D9603B] tabular-nums">
            {totalRevenue.toLocaleString()} ل.س
          </span>
          <span className="text-[11px] text-gray-500">نسبة العمولة: 10%</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-2">
          <span className="text-gray-500">نسبة اكتمال الرحلات</span>
          <span className="font-cairo font-bold text-2xl text-emerald-600 dark:text-[#7CFFCB] tabular-nums">
            94.5%
          </span>
          <span className="text-[11px] text-gray-500">معدل التزام استثنائي</span>
        </div>
      </div>

      {/* Visual Analytics Charts (Section 9) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most active governorates bars */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4 text-xs">
          <h3 className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
            أكثر المحافظات نشاطاً في الرحلات والوجهات
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { gov: 'ريف دمشق (بلودان / معلولا)', pct: 85, count: 28 },
              { gov: 'اللاذقية (رأس البسيط / كسب)', pct: 70, count: 22 },
              { gov: 'حمص (تدمر / قلعة الحصن)', pct: 60, count: 18 },
              { gov: 'طرطوس (مشتى الحلو / أرواد)', pct: 45, count: 14 },
              { gov: 'حلب (القلعة والمدينة القديمة)', pct: 40, count: 11 },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-gray-700 dark:text-gray-300 font-semibold">
                  <span>{item.gov}</span>
                  <span className="tabular-nums">{item.count} رحلة</span>
                </div>
                <div className="h-2.5 w-full bg-[#F6F1EA] dark:bg-[#0A2E36] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D9603B] rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 30-Day Bookings Trend */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col justify-between gap-4 text-xs">
          <div>
            <h3 className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
              تطور الحجوزات خلال آخر 30 يوماً
            </h3>
            <p className="text-[11px] text-gray-500 mt-1">
              مقارنة وتوزيع المقاعد المؤكدة عبر شام كاش وسيرياتيل كاش.
            </p>
          </div>

          <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 pb-2 border-b border-[#E4DCCF] dark:border-[#1C4F5B]">
            {[35, 45, 60, 50, 75, 90, 85, 95, 110, 105, 120, 140].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full bg-[#D9603B] hover:bg-[#C04E2B] rounded-t-sm transition-all group-hover:scale-105"
                  style={{ height: `${(h / 140) * 100}%` }}
                  title={`أسبوع ${i + 1}: ${h} حجز`}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span>بداية الشهر</span>
            <span className="text-[#D9603B] font-bold">ذروة عطلات نهاية الأسبوع</span>
            <span>اليوم</span>
          </div>
        </div>
      </div>
    </div>
  );
};
