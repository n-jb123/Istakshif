import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckSquare, Clock, AlertTriangle, Check, X, ShieldAlert } from 'lucide-react';

export const OrgAttendanceView: React.FC = () => {
  const { trips, bookings, updateAttendanceOrganizer, showToast } = useApp();

  // Pick finished trip
  const finishedTrip = trips[0];
  const tripBookings = bookings.filter(b => b.tripId === finishedTrip.id);

  // No-show ids state
  const [noShows, setNoShows] = useState<string[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const toggleAttendance = (bookingId: string) => {
    setNoShows(prev =>
      prev.includes(bookingId) ? prev.filter(id => id !== bookingId) : [...prev, bookingId]
    );
  };

  const handleSaveAttendance = () => {
    updateAttendanceOrganizer(finishedTrip.id, noShows);
    setConfirmModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 text-right pb-16 max-w-4xl">
      <div>
        <h1 className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
          تسجيل الحضور والغياب للرحلات المنتهية
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          «يعتبر جميع المشتركين المؤكدين حاضرين تلقائياً»، يمكنك فقط تحديد الغائبين الذين لم يحضروا.
        </p>
      </div>

      {/* Countdown Card verbatim from Section 8.6 */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold block">
              «متبقي 18 ساعة لتسجيل الغياب» لرحلة {finishedTrip.title}
            </span>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
              تغلق إمكانية التعديل تلقائياً بعد انقضاء نافذة الـ 24 ساعة من انتهاء الرحلة.
            </p>
          </div>
        </div>
      </div>

      {/* Adventurers List Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 font-bold">
          <span className="text-[#0A2E36] dark:text-[#F4EFE6] text-sm">
            قائمة المشاركين في الرحلة ({tripBookings.length} حجز)
          </span>
          <span className="text-gray-500">
            تم تحديد {noShows.length} كغائبين
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {tripBookings.map(b => {
            const isNoShow = noShows.includes(b.id);
            return (
              <div
                key={b.id}
                className="p-3.5 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/40 dark:bg-[#0A2E36]/40 flex items-center justify-between gap-3"
              >
                <div>
                  <span className="font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6] block">
                    {b.companions[0]?.name || 'المشارك'}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    عدد المقاعد: {b.seatsCount} · العربون: {b.depositTotal.toLocaleString()} ل.س
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleAttendance(b.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isNoShow
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-emerald-600 text-white shadow-xs'
                  }`}
                >
                  {isNoShow ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>تم تسجيله: لم يحضر</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>حضر الرحلة (افتراضي)</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 flex justify-end">
          <button
            type="button"
            onClick={() => setConfirmModalOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold text-sm shadow-md transition-colors"
          >
            حفظ سجل الحضور والغياب
          </button>
        </div>
      </div>

      {/* Confirmation Modal verbatim from Section 8.6 */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#123F49] rounded-2xl p-6 border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-2xl flex flex-col gap-4 text-right">
            <div className="flex items-center gap-2 text-amber-600">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="font-cairo font-bold text-lg text-[#0A2E36] dark:text-[#F4EFE6]">
                تأكيد تسجيل الغياب
              </h3>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              تنبيه: «المغامر المسجل كغائب لا يمكنه تقييم الرحلة ويبقى العربون للمنصة». هل أنت متأكد من تثبيت الحضور والغياب؟
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="w-1/3 h-10 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] font-bold text-gray-600 dark:text-gray-300 text-xs"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleSaveAttendance}
                className="w-2/3 h-10 rounded-xl bg-[#D9603B] text-white font-bold text-xs shadow-md"
              >
                تأكيد وحفظ السجل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
