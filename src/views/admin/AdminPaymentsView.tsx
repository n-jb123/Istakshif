import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  AlertTriangle,
  X,
  Check,
  Search,
} from 'lucide-react';

export const AdminPaymentsView: React.FC = () => {
  const { bookings, confirmPaymentAdmin, rejectPaymentAdmin } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'rejected'>('pending');
  const [methodFilter, setMethodFilter] = useState<'all' | 'sham_cash' | 'syriatel_cash'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'pending' && b.status !== 'payment_review') return false;
    if (activeTab === 'confirmed' && b.status !== 'confirmed') return false;
    if (activeTab === 'rejected' && b.status !== 'pending_payment') return false;
    if (methodFilter !== 'all' && b.paymentMethod !== methodFilter) return false;
    return true;
  });

  const handleAccept = (bookingId: string) => {
    confirmPaymentAdmin(bookingId);
    setSelectedBooking(null);
  };

  const handleReject = (bookingId: string) => {
    if (!rejectReason.trim()) return;
    rejectPaymentAdmin(bookingId, rejectReason);
    setSelectedBooking(null);
    setShowRejectInput(false);
    setRejectReason('');
  };

  return (
    <div className="flex flex-col gap-6 text-right pb-16">
      <div>
        <h1 className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
          مراجعة دفعات العرابين والإشعارات
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          مطابقة إشعارات شام كاش وسيرياتيل كاش المرفوعة مع الحساب البنكي لتأكيد مقاعد المغامرين.
        </p>
      </div>

      {/* Tabs & Method Filters (Section 9) */}
      <div className="p-3 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold">
        <div className="flex items-center gap-2">
          {[
            { id: 'pending', label: 'بانتظار المراجعة' },
            { id: 'confirmed', label: 'مقبولة ومؤكدة' },
            { id: 'rejected', label: 'مرفوضة' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === t.id
                  ? 'bg-[#D9603B] text-white shadow-xs'
                  : 'bg-[#F6F1EA] dark:bg-[#0A2E36] text-gray-600 dark:text-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-[11px]">طريقة الدفع:</span>
          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value as any)}
            aria-label="تصفية حسب طريقة الدفع"
            className="h-8 px-2.5 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA] dark:bg-[#0A2E36] text-xs font-semibold focus:outline-none"
          >
            <option value="all">كافة الطرق</option>
            <option value="sham_cash">شام كاش (Sham Cash)</option>
            <option value="syriatel_cash">سيرياتيل كاش (Syriatel Cash)</option>
          </select>
        </div>
      </div>

      {/* Table of Payments */}
      <div className="rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs overflow-hidden text-xs">
        <table className="w-full text-right">
          <thead className="bg-[#F6F1EA] dark:bg-[#0A2E36] border-b border-[#E4DCCF] dark:border-[#1C4F5B] text-gray-600 dark:text-gray-300 font-bold">
            <tr>
              <th className="p-4">رقم الحجز والمغامر</th>
              <th className="p-4">الرحلة</th>
              <th className="p-4">العربون المستحق</th>
              <th className="p-4">طريقة التحويل</th>
              <th className="p-4">رقم العملية المدون</th>
              <th className="p-4">الحالة</th>
              <th className="p-4 text-center">فحص الإشعار</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4DCCF]/60 dark:divide-[#1C4F5B]/60">
            {filteredBookings.map(b => (
              <tr
                key={b.id}
                onClick={() => setSelectedBooking(b)}
                className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="p-4">
                  <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6] block">
                    {b.companions[0]?.name || 'المشارك'}
                  </span>
                  <span className="font-mono text-[11px] text-gray-400">#{b.id}</span>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-300">{b.tripTitle}</td>
                <td className="p-4 font-bold text-[#D9603B] tabular-nums">
                  {b.depositTotal.toLocaleString()} ل.س
                </td>
                <td className="p-4 font-semibold">
                  {b.paymentMethod === 'sham_cash' ? 'شام كاش' : 'سيرياتيل كاش'}
                </td>
                <td className="p-4 font-mono font-bold">{b.transactionRef || 'غير مدون'}</td>
                <td className="p-4">
                  {b.status === 'confirmed' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      مقبول
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                      قيد المطابقة
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <button
                    type="button"
                    className="p-1.5 rounded-lg bg-[#D9603B]/10 text-[#D9603B] font-bold text-xs hover:bg-[#D9603B]/20"
                  >
                    عرض المطابقة
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SIDE PANEL ON ROW CLICK: RECEIPT IMAGE ENLARGED NEXT TO EXPECTED BOOKING DATA (Section 9 verbatim) */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl h-full bg-white dark:bg-[#123F49] p-6 shadow-2xl flex flex-col gap-5 overflow-y-auto text-right border-r border-[#E4DCCF] dark:border-[#1C4F5B] animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCF] dark:border-[#1C4F5B]">
              <h2 className="font-cairo font-bold text-lg text-[#0A2E36] dark:text-[#F4EFE6]">
                مطابقة إشعار الدفع لحجز #{selectedBooking.id}
              </h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side-by-side verification: Receipt Image vs Expected Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Receipt image */}
              <div className="flex flex-col gap-2">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  صورة الإشعار المرفوعة من المغامر:
                </span>
                <div className="rounded-xl overflow-hidden border border-[#E4DCCF] dark:border-[#1C4F5B] bg-black/10 aspect-3/4 flex items-center justify-center">
                  <img
                    src={selectedBooking.receiptPath || selectedBooking.tripImage}
                    alt="Receipt"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Expected booking data */}
              <div className="flex flex-col gap-3">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  البيانات المتوقعة في النظام:
                </span>

                <div className="p-4 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/50 border border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col gap-2.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">اسم المغامر:</span>
                    <span className="font-bold">{selectedBooking.companions[0]?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">الرحلة:</span>
                    <span className="font-bold">{selectedBooking.tripTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">عدد المقاعد:</span>
                    <span className="font-bold">{selectedBooking.seatsCount} مقاعد</span>
                  </div>
                  <div className="flex justify-between text-[#D9603B] font-bold">
                    <span>مبلغ العربون المطلوب:</span>
                    <span className="tabular-nums">{selectedBooking.depositTotal.toLocaleString()} ل.س</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-gray-500">رقم العملية المدون:</span>
                    <span className="font-bold text-blue-600">{selectedBooking.transactionRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">طريقة الدفع:</span>
                    <span>{selectedBooking.paymentMethod === 'sham_cash' ? 'شام كاش' : 'سيرياتيل كاش'}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>وقت الرفع:</span>
                    <span>{selectedBooking.bookedAt}</span>
                  </div>
                </div>

                {/* Reject Input */}
                {showRejectInput && (
                  <div className="p-3 rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/20 flex flex-col gap-2">
                    <label className="font-bold text-red-700 dark:text-red-300 text-[11px]">
                      سبب الرفض (إلزامي - يظهر للمغامر لإعادة الرفع):
                    </label>
                    <input
                      type="text"
                      required
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="مثال: رقم العملية غير مطابق، أو الصورة غير واضحة..."
                      className="w-full h-9 px-3 rounded-lg border border-red-300 bg-white dark:bg-[#123F49] text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleReject(selectedBooking.id)}
                      className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs"
                    >
                      تأكيد الرفض وإشعار المغامر
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Actions: Accept or Reject */}
            <div className="mt-auto pt-4 border-t border-[#E4DCCF] dark:border-[#1C4F5B] flex gap-3">
              <button
                type="button"
                onClick={() => setShowRejectInput(true)}
                className="w-1/3 h-11 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold text-xs"
              >
                رفض مع ذكر السبب
              </button>
              <button
                type="button"
                onClick={() => handleAccept(selectedBooking.id)}
                className="w-2/3 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
              >
                قبول الإشعار وتأكيد الحجز رسميّاً
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
