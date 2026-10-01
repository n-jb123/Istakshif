import React from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSign, ArrowDownLeft, ShieldCheck, Users } from 'lucide-react';

export const OrgEarningsView: React.FC = () => {
  const { bookings, trips } = useApp();

  const totalRemainingToCollect = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((acc, c) => acc + c.remainingToOrganizer, 0);

  const totalCommissionPaid = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((acc, c) => acc + c.depositTotal, 0);

  return (
    <div className="flex flex-col gap-6 text-right pb-16">
      <div>
        <h1 className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
          كشف الأرباح والمبالغ المستحقة
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          «كشف معلوماتي»: المبالغ المتبقية للتحصيل باليد من المغامرين، وإجمالي عمولة المنصة المحولة كعربون.
        </p>
      </div>

      {/* Top Numbers verbatim from Section 8.7 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span className="font-bold">المتبقي للتحصيل من الرحلات القادمة</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="font-cairo font-bold text-3xl text-emerald-600 dark:text-[#7CFFCB] tabular-nums">
            {totalRemainingToCollect.toLocaleString()}{' '}
            <span className="text-sm font-normal text-gray-500">ل.س</span>
          </span>
          <span className="text-[11px] text-gray-500">
            يدفعها المغامرون لك مباشرة نقداً يوم انطلاق الرحلة.
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span className="font-bold">إجمالي عمولة المنصة (العرابين المدفوعة)</span>
            <ArrowDownLeft className="w-5 h-5 text-[#D9603B]" />
          </div>
          <span className="font-cairo font-bold text-3xl text-[#D9603B] tabular-nums">
            {totalCommissionPaid.toLocaleString()}{' '}
            <span className="text-sm font-normal text-gray-500">ل.س</span>
          </span>
          <span className="text-[11px] text-gray-500">
            تم تحويلها كعربون إلكتروني مباشر لتثبيت حجز المقاعد.
          </span>
        </div>
      </div>

      {/* Per Trip Detail Table (Section 8.7 verbatim) */}
      <div className="rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs overflow-hidden text-xs">
        <div className="p-4 border-b border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 font-bold text-sm">
          تفاصيل الحجوزات والمبالغ لكل رحلة
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-[#F6F1EA] dark:bg-[#0A2E36] border-b border-[#E4DCCF] dark:border-[#1C4F5B] text-gray-600 dark:text-gray-300 font-bold">
              <tr>
                <th className="p-4">اسم المغامر</th>
                <th className="p-4">الرحلة</th>
                <th className="p-4">المقاعد</th>
                <th className="p-4">العربون للمنصة</th>
                <th className="p-4">المتبقي للتحصيل باليد</th>
                <th className="p-4">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4DCCF]/60 dark:divide-[#1C4F5B]/60">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-[#0A2E36] dark:text-[#F4EFE6]">
                    {b.companions[0]?.name || 'المشارك'}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{b.tripTitle}</td>
                  <td className="p-4 font-semibold">{b.seatsCount} مقاعد</td>
                  <td className="p-4 text-[#D9603B] font-bold tabular-nums">
                    {b.depositTotal.toLocaleString()} ل.س
                  </td>
                  <td className="p-4 text-emerald-600 dark:text-[#7CFFCB] font-bold tabular-nums">
                    {b.remainingToOrganizer.toLocaleString()} ل.س
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      مؤكد
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
