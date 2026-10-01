import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Copy,
  MessageCircle,
  ShieldCheck,
  Send,
  Lock,
  ArrowRight,
  X,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';

export const BookingDetailView: React.FC = () => {
  const { bookings, pageParams, navigate, openCancelModal, showToast } = useApp();

  const bookingId = pageParams.id || 'bk-1001';
  const booking = bookings.find(b => b.id === bookingId) || bookings[0];

  const isConfirmed = booking.status === 'confirmed';
  const isPaymentReview = booking.status === 'payment_review';
  const isPendingPayment = booking.status === 'pending_payment';

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    showToast('تم نسخ الرقم بنجاح.', 'success');
  };

  return (
    <div className="flex flex-col gap-6 pb-20 text-right max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('my-bookings')}
        className="flex items-center gap-1 text-xs font-bold text-[#D9603B] hover:underline self-start"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة إلى حجوزاتي</span>
      </button>

      {/* Main Booking Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
        <div className="flex items-start gap-4">
          <img
            src={booking.tripImage}
            alt={booking.tripTitle}
            className="w-20 h-20 rounded-xl object-cover border border-[#E4DCCF] dark:border-[#1C4F5B] shrink-0"
          />
          <div className="flex flex-col gap-1 text-xs">
            <span className="font-mono text-gray-400">رقم الحجز: #{booking.id}</span>
            <h1 className="font-cairo font-bold text-xl text-[#0A2E36] dark:text-[#F4EFE6]">
              {booking.tripTitle}
            </h1>
            <p className="text-gray-500">
              من {booking.fromGovernorate} إلى {booking.toGovernorate} · تاريخ: {booking.startDate}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
          <span className="text-[11px] text-gray-500">حالة الحجز:</span>
          {isConfirmed ? (
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-[#7CFFCB]">
              حجز مؤكد رسمي
            </span>
          ) : isPaymentReview ? (
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
              قيد مراجعة الدفع
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
              بانتظار الدفع
            </span>
          )}
        </div>
      </div>

      {/* Status Timeline (Section 7.7 verbatim) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4">
        <h3 className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
          مراحل الحجز
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-[#7CFFCB]">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">1. حجز المقاعد</span>
            <span className="text-[10px] text-gray-500">{booking.bookedAt}</span>
          </div>

          <div
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl ${
              isConfirmed || isPaymentReview
                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-[#7CFFCB]'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="font-bold">2. مراجعة الدفع</span>
            <span className="text-[10px] text-gray-500">{booking.paymentMethod || 'قيد الرفع'}</span>
          </div>

          <div
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl ${
              isConfirmed
                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-[#7CFFCB]'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="font-bold">3. تأكيد الحجز</span>
            <span className="text-[10px] text-gray-500">{isConfirmed ? 'مكتمل' : 'قيد التدقيق'}</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400">
            <Calendar className="w-5 h-5" />
            <span className="font-bold">4. يوم الرحلة</span>
            <span className="text-[10px] text-gray-500">{booking.startDate}</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">5. التقييم النهائي</span>
            <span className="text-[10px] text-gray-500">خلال 3 أيام بعد الرحلة</span>
          </div>
        </div>
      </div>

      {/* Companions and Seats */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-3">
        <h3 className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
          المقاعد المسجلة ({booking.seatsCount} مقاعد)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {booking.companions.map((comp, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/40 border border-[#E4DCCF] dark:border-[#1C4F5B] flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6] block">
                  {comp.name} {idx === 0 && '(المسجل الرئيسي)'}
                </span>
                <span className="text-[11px] text-gray-500">العمر: {comp.age} سنة</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-white dark:bg-[#123F49] font-bold text-[#D9603B]">
                مقعد {idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Details */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-3 text-xs">
        <h3 className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
          تفاصيل الدفعات المالية
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/40 border border-[#E4DCCF] dark:border-[#1C4F5B]">
            <span className="text-gray-500 block mb-1">العربون المدفوع للمنصة:</span>
            <span className="font-bold text-base text-[#D9603B] tabular-nums">
              {booking.depositTotal.toLocaleString()} ل.س
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/40 border border-[#E4DCCF] dark:border-[#1C4F5B]">
            <span className="text-gray-500 block mb-1">المتبقي للمنظم (يوم الرحلة):</span>
            <span className="font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6] tabular-nums">
              {booking.remainingToOrganizer.toLocaleString()} ل.س
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/40 border border-[#E4DCCF] dark:border-[#1C4F5B]">
            <span className="text-gray-500 block mb-1">رقم العملية / الحوالة:</span>
            <span className="font-bold font-mono text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
              {booking.transactionRef || 'بانتظار الإدخال'}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Section (Locked until confirmation) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4 text-xs">
        <h3 className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
          بيانات التواصل مع المنظم
        </h3>

        {isConfirmed ? (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                رقم واتساب المنظم: {booking.organizerWhatsApp || '+963944112233'}
              </span>
              <p className="text-gray-600 dark:text-gray-300 text-[11px]">
                يمكنك الآن الانضمام لمجموعة الرحلة المخصصة والتواصل مباشرة مع المنظم.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => copyNumber(booking.organizerWhatsApp || '+963944112233')}
                className="px-3 py-2 rounded-lg bg-white dark:bg-[#123F49] border border-emerald-300 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ</span>
              </button>
              <a
                href="https://wa.me/963944112233"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>افتح واتساب</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/40 border border-[#E4DCCF] dark:border-[#1C4F5B] text-gray-500 flex items-center gap-3">
            <Lock className="w-5 h-5 text-gray-400 shrink-0" />
            <p className="font-medium">
              «يظهر رقم المنظم ورابط المجموعة بعد تأكيد الدفع.»
            </p>
          </div>
        )}
      </div>

      {/* Cancellation Action & Support */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={() => openCancelModal(booking)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-red-300 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold text-xs transition-colors"
        >
          طلب إلغاء مقعد / استرجاع العربون
        </button>

        <button
          type="button"
          onClick={() => navigate('contact')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] text-gray-600 dark:text-gray-300 font-bold text-xs hover:bg-black/5"
        >
          الدعم الفني والإبلاغ عن مشكلة
        </button>
      </div>
    </div>
  );
};
