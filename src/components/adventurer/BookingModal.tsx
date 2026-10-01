import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GOVERNORATES } from '../../data/mockData';
import {
  X,
  Check,
  Upload,
  Copy,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Users,
  CreditCard,
  FileText,
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    bookingModalTrip,
    closeBookingModal,
    submitBooking,
    user,
    settings,
    navigate,
    showToast,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [seatsCount, setSeatsCount] = useState<number>(1);
  const [companions, setCompanions] = useState<{ name: string; age: number }[]>([
    { name: user.name || 'المسجل الرئيسي', age: 26 },
  ]);
  const [ageError, setAgeError] = useState<string | null>(null);

  const [agreedTerms, setAgreedTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'sham_cash' | 'syriatel_cash'>('sham_cash');
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  if (!bookingModalTrip) return null;

  const trip = bookingModalTrip;
  const pricePerSeat = trip.discountPrice || trip.pricePerPerson;
  const depositPercent = settings.commissionPercent / 100;
  const depositPerSeat = Math.round(pricePerSeat * depositPercent);
  const depositTotal = depositPerSeat * seatsCount;
  const remainingTotal = (pricePerSeat - depositPerSeat) * seatsCount;

  const handleSeatsChange = (num: number) => {
    setSeatsCount(num);
    setCompanions(prev => {
      const next = [...prev];
      while (next.length < num) {
        next.push({ name: '', age: 22 });
      }
      return next.slice(0, num);
    });
  };

  const handleCompanionChange = (index: number, field: 'name' | 'age', value: any) => {
    setCompanions(prev => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: field === 'age' ? Number(value) : value,
      };
      return next;
    });
    setAgeError(null);
  };

  const validateAges = () => {
    for (let i = 0; i < companions.length; i++) {
      const c = companions[i];
      if (!c.name.trim()) {
        setAgeError(`يرجى إدخال اسم المرافق للمقعد رقم ${i + 1}.`);
        return false;
      }
      if (c.age < trip.minAge || c.age > trip.maxAge) {
        setAgeError(`عمرك أو عمر المرافق (${c.age} سنة) لا يناسب الفئة العمرية المحددة للرحلة (${trip.minAge} إلى ${trip.maxAge} سنة).`);
        return false;
      }
    }
    setAgeError(null);
    return true;
  };

  const handleProceedToSummary = () => {
    if (validateAges()) {
      setStep(3);
    }
  };

  const handleConfirmAndPay = () => {
    if (!transactionRef.trim()) {
      showToast('يرجى كتابة رقم العملية المدون في إشعار التحويل.', 'warning');
      return;
    }

    const fromGov = GOVERNORATES.find(g => g.id === trip.fromGovernorateId)?.nameAr || trip.fromGovernorateId;
    const toGov = GOVERNORATES.find(g => g.id === trip.toGovernorateId)?.nameAr || trip.toGovernorateId;

    const newBooking = submitBooking({
      tripId: trip.id,
      tripTitle: trip.title,
      tripImage: trip.images[0],
      fromGovernorate: fromGov,
      toGovernorate: toGov,
      startDate: trip.startDate,
      seatsCount,
      companions,
      pricePerSeat,
      depositPerSeat,
      depositTotal,
      remainingToOrganizer: remainingTotal,
      status: 'payment_review',
      paymentMethod,
      transactionRef,
      receiptPath: trip.images[0], // Mock receipt image
    });

    setCreatedBookingId(newBooking.id);
    setStep(5);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('تم نسخ رقم الحساب بنجاح.', 'success');
  };

  const walletAccount =
    paymentMethod === 'sham_cash'
      ? settings.walletShamCash
      : settings.walletSyriatelCash;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-2xl max-h-[92vh] flex flex-col bg-white dark:bg-[#123F49] rounded-t-2xl sm:rounded-2xl border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-2xl text-right overflow-hidden animate-in slide-in-from-bottom-6 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with Step Progress */}
        <div className="p-4 sm:p-5 border-b border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 flex items-center justify-between bg-[#F6F1EA]/60 dark:bg-[#0A2E36]/40">
          <div>
            <span className="text-xs font-bold text-[#D9603B]">
              خطوة {step} من 5
            </span>
            <h3 className="font-cairo font-bold text-base sm:text-lg text-[#0A2E36] dark:text-[#F4EFE6] truncate max-w-sm sm:max-w-md">
              حجز: {trip.title}
            </h3>
          </div>
          <button
            onClick={closeBookingModal}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper indicator line */}
        <div className="h-1 w-full bg-[#E4DCCF] dark:bg-[#1C4F5B]">
          <div
            className="h-full bg-[#D9603B] transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Body content with scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {/* STEP 1: Choose Seats */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h4 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
                  كم مقعداً ترغب في حجزه؟
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  الحد الأقصى لكل حجز هو {settings.maxSeatsPerBooking} مقاعد مع ضرورة ذكر أسماء وأعمار جميع المرافقين.
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSeatsChange(num)}
                    className={`py-3.5 px-4 rounded-xl border text-center font-cairo font-bold text-lg transition-all ${
                      seatsCount === num
                        ? 'border-[#D9603B] bg-[#D9603B] text-white shadow-md'
                        : 'border-[#E4DCCF] dark:border-[#1C4F5B] bg-white dark:bg-[#0A2E36] text-[#0A2E36] dark:text-[#F4EFE6] hover:border-[#D9603B]/60'
                    }`}
                  >
                    {num} {num === 1 ? 'مقعد' : 'مقاعد'}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/60 border border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col gap-2 text-xs">
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span>سعر المقعد الواحد:</span>
                  <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6] tabular-nums">
                    {pricePerSeat.toLocaleString()} ل.س
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span>العربون المطلوب دفعه الآن للمنصة ({settings.commissionPercent}%):</span>
                  <span className="font-bold text-[#D9603B] tabular-nums">
                    {depositTotal.toLocaleString()} ل.س
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span>المتبقي للمنظم عند بدء الرحلة:</span>
                  <span className="font-bold tabular-nums">
                    {remainingTotal.toLocaleString()} ل.س
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full h-11 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold text-sm shadow-md transition-colors"
              >
                التالي: بيانات المرافقين
              </button>
            </div>
          )}

          {/* STEP 2: Companions info & Age validation */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <h4 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
                  بيانات المشتركين والمرافقين
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  الفئة العمرية المقبولة لهذه الرحلة هي بين{' '}
                  <span className="font-bold text-[#D9603B]">{trip.minAge}</span> و{' '}
                  <span className="font-bold text-[#D9603B]">{trip.maxAge}</span> سنة.
                </p>
              </div>

              {ageError && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{ageError}</p>
                </div>
              )}

              <div className="flex flex-col gap-4">
                {companions.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/30 dark:bg-[#0A2E36]/30 flex flex-col gap-3"
                  >
                    <span className="text-xs font-bold text-[#D9603B]">
                      المقعد {idx + 1} {idx === 0 && '(المسجل الرئيسي)'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                          الاسم الثلاثي <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={comp.name}
                          onChange={e => handleCompanionChange(idx, 'name', e.target.value)}
                          placeholder="الاسم الكامل للمشارك"
                          className="w-full h-10 px-3 text-xs rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-white dark:bg-[#123F49] focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                          العمر بالسنوات <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="90"
                          required
                          value={comp.age}
                          onChange={e => handleCompanionChange(idx, 'age', e.target.value)}
                          className="w-full h-10 px-3 text-xs rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-white dark:bg-[#123F49] focus:outline-none focus:ring-2 focus:ring-[#D9603B] tabular-nums"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 h-11 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-black/5"
                >
                  السابق
                </button>
                <button
                  type="button"
                  onClick={handleProceedToSummary}
                  className="w-2/3 h-11 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold text-sm shadow-md transition-colors"
                >
                  التالي: مراجعة الحجز والشروط
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Summary and Terms Acceptance */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div>
                <h4 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
                  ملخص الحجز وتوزيع الدفعات
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  يرجى قراءة سياسة الإلغاء وتأكيد الموافقة قبل الانتقال للدفع.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA] dark:bg-[#0A2E36]/60 flex flex-col gap-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[#E4DCCF] dark:border-[#1C4F5B]">
                  <span className="font-medium text-gray-600 dark:text-gray-300">الرحلة:</span>
                  <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6]">{trip.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">عدد المقاعد:</span>
                  <span className="font-bold">{seatsCount} مقاعد</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">إجمالي قيمة الرحلة:</span>
                  <span className="font-bold tabular-nums">{(pricePerSeat * seatsCount).toLocaleString()} ل.س</span>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col gap-2">
                  <div className="flex justify-between items-center font-bold text-[#D9603B]">
                    <span>العربون المستحق الآن (عمولة المنصة):</span>
                    <span className="text-sm tabular-nums">{depositTotal.toLocaleString()} ل.س</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                    <span>المبلغ المتبقي (يُدفع للمنظم مباشرة يوم الرحلة):</span>
                    <span className="font-bold tabular-nums">{remainingTotal.toLocaleString()} ل.س</span>
                  </div>
                </div>
              </div>

              {/* Cancellation policy reminder verbatim */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex flex-col gap-1.5 leading-relaxed">
                <p className="font-bold">سياسة الإلغاء الرسمية المنظمة:</p>
                <p>• يحق لك إلغاء الحجز واسترجاع كامل العربون حتى 48 ساعة قبل موعد انطلاق الرحلة.</p>
                <p>• «لا يمكن إلغاء الحجز قبل موعد الرحلة بأقل من 48 ساعة»، ويبقى العربون للمنصة في حال عدم الحضور.</p>
              </div>

              {/* Acceptance checkbox */}
              <label className="flex items-start gap-2.5 text-xs font-semibold text-[#0A2E36] dark:text-[#F4EFE6] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={e => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#D9603B] focus:ring-[#D9603B] accent-[#D9603B]"
                />
                <span>أوافق على الشروط وسياسة الإلغاء، وأتعهد بصحة بيانات المرافقين.</span>
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 h-11 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-black/5"
                >
                  السابق
                </button>
                <button
                  type="button"
                  disabled={!agreedTerms}
                  onClick={() => setStep(4)}
                  className={`w-2/3 h-11 rounded-xl font-bold text-sm shadow-md transition-colors ${
                    agreedTerms
                      ? 'bg-[#D9603B] hover:bg-[#C04E2B] text-white'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  التالي: دفع العربون
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment - Sham Cash or Syriatel Cash & Receipt Upload */}
          {step === 4 && (
            <div className="flex flex-col gap-5">
              <div>
                <h4 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
                  تحويل العربون ({depositTotal.toLocaleString()} ل.س)
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  «مقعدك محجوز لمدة 24 ساعة بانتظار تأكيد الدفع». يرجى التحويل ثم إرفاق الإشعار.
                </p>
              </div>

              {/* Choose payment method */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('sham_cash')}
                  className={`p-3.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'sham_cash'
                      ? 'border-[#D9603B] bg-[#D9603B]/10 text-[#D9603B]'
                      : 'border-[#E4DCCF] dark:border-[#1C4F5B] bg-white dark:bg-[#0A2E36] text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#D9603B]" />
                  <span>شام كاش (Sham Cash)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('syriatel_cash')}
                  className={`p-3.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'syriatel_cash'
                      ? 'border-[#D9603B] bg-[#D9603B]/10 text-[#D9603B]'
                      : 'border-[#E4DCCF] dark:border-[#1C4F5B] bg-white dark:bg-[#0A2E36] text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#D9603B]" />
                  <span>سيرياتيل كاش (Syriatel Cash)</span>
                </button>
              </div>

              {/* Receiving account box with copy button */}
              <div className="p-4 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/60 border border-[#E4DCCF] dark:border-[#1C4F5B] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gray-500 block">
                    حساب استقبال الدفعات المعتمد:
                  </span>
                  <span className="font-cairo font-bold text-lg text-[#0A2E36] dark:text-[#F4EFE6] tabular-nums">
                    {walletAccount}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(walletAccount)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] text-xs font-bold text-[#D9603B] flex items-center gap-1 hover:bg-gray-50"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ</span>
                </button>
              </div>

              {/* Receipt screenshot mock upload */}
              <div>
                <label className="block text-xs font-bold text-[#0A2E36] dark:text-[#F4EFE6] mb-1.5">
                  ارفع صورة الإشعار <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => setReceiptUploaded(true)}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                    receiptUploaded
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-[#E4DCCF] dark:border-[#1C4F5B] hover:border-[#D9603B]'
                  }`}
                >
                  {receiptUploaded ? (
                    <div className="flex flex-col items-center gap-1.5 text-emerald-600 dark:text-[#7CFFCB]">
                      <CheckCircle2 className="w-7 h-7" />
                      <span className="text-xs font-bold">تم اختيار صورة الإشعار بنجاح (receipt.jpg)</span>
                      <span className="text-[11px] text-gray-500">انقر للتغيير</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-gray-500">
                      <Upload className="w-6 h-6 text-[#D9603B]" />
                      <span className="text-xs font-bold">انقر أو اسحب لرفع لقطة شاشة إشعار التحويل</span>
                      <span className="text-[11px]">PNG, JPG بحد أقصى 5 ميجابايت</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction reference number */}
              <div>
                <label className="block text-xs font-bold text-[#0A2E36] dark:text-[#F4EFE6] mb-1.5">
                  رقم العملية المدون في الإشعار <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={transactionRef}
                  onChange={e => setTransactionRef(e.target.value)}
                  placeholder="مثال: SHAM-994821 أو SYR-88319"
                  className="w-full h-11 px-3.5 text-xs rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-white dark:bg-[#123F49] focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-1/3 h-11 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-black/5"
                >
                  السابق
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAndPay}
                  className="w-2/3 h-11 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold text-sm shadow-md transition-colors"
                >
                  تأكيد الحجز وإرسال الإشعار
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Success & Next Steps */}
          {step === 5 && (
            <div className="flex flex-col items-center text-center gap-5 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#7CFFCB] flex items-center justify-center">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-cairo font-bold text-xl text-[#0A2E36] dark:text-[#F4EFE6]">
                  تم استلام طلب الحجز بنجاح!
                </h4>
                <p className="text-xs text-gray-500 mt-1 max-w-md">
                  تم حجز مقاعدك وإرسال إشعار الدفع لمشرفي المنصة للمطابقة والتحقق.
                </p>
              </div>

              {/* Timeline verbatim from 7.5 */}
              <div className="w-full p-4 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA] dark:bg-[#0A2E36]/60 text-xs flex flex-col gap-3">
                <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6] text-right">
                  ماذا يحدث الآن؟
                </span>
                <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                  <div className="flex flex-col items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-[#D9603B] text-white flex items-center justify-center text-[10px]">1</span>
                    <span>مراجعة الدفع</span>
                  </div>
                  <span className="text-gray-400">←</span>
                  <div className="flex flex-col items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-[#D9603B] text-white flex items-center justify-center text-[10px]">2</span>
                    <span>التأكيد التلقائي</span>
                  </div>
                  <span className="text-gray-400">←</span>
                  <div className="flex flex-col items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">3</span>
                    <span>ظهور رقم المنظم ورابط المجموعة</span>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col sm:flex-row gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    closeBookingModal();
                    navigate('booking-detail', { id: createdBookingId });
                  }}
                  className="flex-1 h-11 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold text-sm shadow-md transition-colors"
                >
                  عرض تفاصيل الحجز
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeBookingModal();
                    navigate('home');
                  }}
                  className="flex-1 h-11 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-black/5"
                >
                  العودة للرئيسية
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
