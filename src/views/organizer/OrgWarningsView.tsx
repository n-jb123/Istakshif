import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, ShieldAlert, Upload, CheckCircle2, FileText, Send } from 'lucide-react';

export const OrgWarningsView: React.FC = () => {
  const { organizers, showToast } = useApp();
  const org = organizers[0];

  const [appealReason, setAppealReason] = useState('');
  const [appealFileUploaded, setAppealFileUploaded] = useState(false);
  const [appealSubmitted, setAppealSubmitted] = useState(false);

  const strikes = [
    {
      id: 'st-1',
      reason: 'إلغاء رحلة مسار قلعة الحصن بعد تثبيت حجوزات المشتركين',
      date: '2026-08-14',
      tripTitle: 'مسار حصن الفرسان الشامخ',
      status: 'active',
    },
  ];

  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealReason.trim()) return;
    setAppealSubmitted(true);
    showToast('تم إرسال طلب استئناف التحذير وإثباتات القوة القاهرة للإدارة.', 'success');
  };

  return (
    <div className="flex flex-col gap-6 text-right pb-16 max-w-3xl">
      <div>
        <h1 className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
          تحذيراتي وسجل المخالفات
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          متابعة التحذيرات المسجلة على الحساب، وإمكانية تقديم إثباتات القوة القاهرة لإسقاطها.
        </p>
      </div>

      {/* Prominent Strike Status Bar */}
      <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/60 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
            {org.strikesCount} / 3
          </div>
          <div>
            <h3 className="font-cairo font-bold text-sm text-amber-900 dark:text-amber-200">
              «لديك {org.strikesCount} تحذير من 3.»
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-[11px] mt-0.5">
              إذا وصل الحساب إلى 3 تحذيرات، يتم إيقاف حساب المنظم تلقائياً وإلغاء صلاحية نشر الرحلات.
            </p>
          </div>
        </div>

        {org.strikesCount === 2 && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse shrink-0">
            «تحذير أخير قبل الحظر.»
          </span>
        )}
      </div>

      {/* Warnings List */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4 text-xs">
        <h2 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
          التحذيرات النشطة
        </h2>

        {strikes.map(st => (
          <div
            key={st.id}
            className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-[#F6F1EA]/40 dark:bg-[#0A2E36]/30 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#D9603B]">{st.reason}</span>
              <span className="text-[10px] text-gray-500">{st.date}</span>
            </div>
            <span className="text-[11px] text-gray-500">الرحلة المرتبطة: {st.tripTitle}</span>
            <div className="flex items-center justify-between pt-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                تحذير سارٍ
              </span>
              <span className="text-[11px] text-gray-400">إلغاء مباشر من المنظم</span>
            </div>
          </div>
        ))}
      </div>

      {/* Force Majeure Appeal Form (Section 8.10) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4 text-xs">
        <h2 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
          طلب إسقاط التحذير (إثبات ظرف قاهر)
        </h2>
        <p className="text-gray-500 text-[11px]">
          إذا كان سبب الإلغاء يعود لظروف قاهرة خارجة عن الإرادة (أحوال جوية خطرة، انقطاع طرق، ظروف أمنية طارئة)، يرجى كتابة التوضيح وإرفاق الإثبات لمراجعته من قبل إدارة استكشف.
        </p>

        {appealSubmitted ? (
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>طلب الاستئناف قيد المراجعة لدى الأدمن. ستتلقى النتيجة في الإشعارات.</span>
          </div>
        ) : (
          <form onSubmit={handleAppealSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                شرح أسباب القوة القاهرة <span className="text-red-500">*</span>:
              </label>
              <textarea
                required
                value={appealReason}
                onChange={e => setAppealReason(e.target.value)}
                placeholder="اشرح بالتفصيل الظرف القاهر الذي اضطركم لإلغاء الرحلة..."
                rows={3}
                className="w-full p-3 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                إرفاق الوثائق أو الصور الداعمة:
              </label>
              <div
                onClick={() => setAppealFileUploaded(true)}
                className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer ${
                  appealFileUploaded
                    ? 'border-emerald-500 bg-emerald-50/30'
                    : 'border-[#E4DCCF] dark:border-[#1C4F5B]'
                }`}
              >
                {appealFileUploaded ? (
                  <span className="font-bold text-emerald-600">تم إرفاق إثبات الأحوال الجوية (weather_report.jpg)</span>
                ) : (
                  <span className="text-gray-500">انقر لرفع تقرير أو صور توثق الظرف القاهر</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 self-start px-6 py-2.5 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold text-xs shadow-md transition-colors"
            >
              إرسال طلب إسقاط التحذير
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
