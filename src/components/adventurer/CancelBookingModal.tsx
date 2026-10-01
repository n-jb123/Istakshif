import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, AlertTriangle, ShieldCheck } from 'lucide-react';

export const CancelBookingModal: React.FC = () => {
  const { cancelModalBooking, closeCancelModal, cancelSeat, navigate } = useApp();
  const [reason, setReason] = useState('');
  const [selectedSeatCount, setSelectedSeatCount] = useState<number>(1);

  if (!cancelModalBooking) return null;

  const booking = cancelModalBooking;
  // Calculate if within 48 hours: for mock demonstration we allow cancellation unless trip is within 2 days
  const isWithin48Hours = booking.id === 'bk-1001'; // Mock rule: bk-1001 is within 48h to demonstrate E2!
  const refundablePerSeat = booking.depositPerSeat;
  const totalRefund = refundablePerSeat * selectedSeatCount;

  const handleConfirmCancel = () => {
    cancelSeat(booking.id, totalRefund);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-lg bg-white dark:bg-[#123F49] rounded-t-2xl sm:rounded-2xl border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-2xl p-6 flex flex-col gap-5 text-right animate-in slide-in-from-bottom-6 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCF]/50 dark:border-[#1C4F5B]/50">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-cairo font-bold text-lg text-[#0A2E36] dark:text-[#F4EFE6]">
              إلغاء حجز المقاعد
            </h3>
          </div>
          <button
            onClick={closeCancelModal}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 48-hour condition alert */}
        {isWithin48Hours ? (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-800 dark:text-red-300 flex flex-col gap-2">
            <p className="font-bold text-sm">
              «لا يمكن إلغاء الحجز قبل موعد الرحلة بأقل من 48 ساعة.»
            </p>
            <p>
              لقد دخلت الرحلة في نافذة الإغلاق النهائي ولا يمكن استرجاع العربون المنصوص عليه. في حال وجود ظرف طارئ قاهر، يمكنك التواصل مع فريق الدعم والمساعدة لمراجعة حالتك.
            </p>
            <button
              type="button"
              onClick={() => {
                closeCancelModal();
                navigate('contact');
              }}
              className="mt-2 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs"
            >
              تواصل مع الدعم الفني
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-xs">
            <div>
              <p className="font-bold text-[#0A2E36] dark:text-[#F4EFE6] text-sm">
                رحلة: {booking.tripTitle}
              </p>
              <p className="text-gray-500 mt-0.5">
                تاريخ الرحلة: {booking.startDate} (يمكنك الإلغاء الآن واسترداد كامل العربون).
              </p>
            </div>

            {/* Select seats to cancel */}
            {booking.seatsCount > 1 && (
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                  كم مقعداً ترغب في إلغائه؟
                </label>
                <div className="flex gap-2">
                  {Array.from({ length: booking.seatsCount }, (_, i) => i + 1).map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedSeatCount(num)}
                      className={`px-4 py-2 rounded-lg border font-bold ${
                        selectedSeatCount === num
                          ? 'border-[#D9603B] bg-[#D9603B] text-white'
                          : 'border-[#E4DCCF] dark:border-[#1C4F5B] bg-white dark:bg-[#0A2E36]'
                      }`}
                    >
                      {num} {num === 1 ? 'مقعد' : 'مقاعد'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Refund summary box */}
            <div className="p-3.5 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/60 border border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span>المبلغ المسترد (كامل العربون للمقاعد المحددة):</span>
                <span className="font-bold text-emerald-600 dark:text-[#7CFFCB] tabular-nums">
                  {totalRefund.toLocaleString()} ل.س
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-gray-500">
                <span>طريقة الإرجاع:</span>
                <span>نفس المحفظة المستخدمة ({booking.paymentMethod === 'sham_cash' ? 'شام كاش' : 'سيرياتيل كاش'})</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-gray-500">
                <span>المدة المتوقعة للمعالجة:</span>
                <span>خلال 24-48 ساعة عمل</span>
              </div>
            </div>

            {/* Optional Reason */}
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                سبب الإلغاء (اختياري لتحسين الخدمة):
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="اذكر سبب الإلغاء إذا رغبت..."
                rows={2}
                className="w-full p-2.5 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-white dark:bg-[#123F49] focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={closeCancelModal}
                className="w-1/3 h-10 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] font-bold text-gray-600 dark:text-gray-300"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="w-2/3 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md transition-colors"
              >
                تأكيد الإلغاء واسترجاع العربون
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
