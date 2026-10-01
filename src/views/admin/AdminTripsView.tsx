import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trip } from '../../types';
import { Compass, CheckCircle2, XCircle, Eye, AlertCircle, Calendar } from 'lucide-react';

export const AdminTripsView: React.FC = () => {
  const { trips, publishTripAdmin, showToast } = useApp();

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  return (
    <div className="flex flex-col gap-6 text-right pb-16">
      <div>
        <h1 className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
          مراجعة وإدارة الرحلات
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          «مراجعة الرحلات الأولى للمنظمين الجدد (أول 3 رحلات)» والتحقق من سلامة المواعيد والمشمولات.
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs overflow-hidden text-xs">
        <table className="w-full text-right">
          <thead className="bg-[#F6F1EA] dark:bg-[#0A2E36] border-b border-[#E4DCCF] dark:border-[#1C4F5B] text-gray-600 dark:text-gray-300 font-bold">
            <tr>
              <th className="p-4">الرحلة</th>
              <th className="p-4">المنظم</th>
              <th className="p-4">التاريخ</th>
              <th className="p-4">السعر</th>
              <th className="p-4">مرحلة المراجعة</th>
              <th className="p-4 text-center">الإجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4DCCF]/60 dark:divide-[#1C4F5B]/60">
            {trips.map(trip => (
              <tr key={trip.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={trip.images[0]}
                    alt={trip.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <span className="font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6] block">
                      {trip.title}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      من {trip.fromGovernorateId} إلى {trip.toGovernorateId}
                    </span>
                  </div>
                </td>
                <td className="p-4 font-semibold">{trip.organizerName}</td>
                <td className="p-4">{trip.startDate}</td>
                <td className="p-4 font-bold tabular-nums">{trip.pricePerPerson.toLocaleString()} ل.س</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D9603B]/10 text-[#D9603B]">
                    الرحلة 1 من 3 للمنظم
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => publishTripAdmin(trip.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                    >
                      نشر الرحلة
                    </button>
                    <button
                      onClick={() => showToast('تم رفض نشر الرحلة وإشعار المنظم للتعديل.', 'warning')}
                      className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 font-bold text-xs hover:bg-red-50"
                    >
                      رفض مع سبب
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
