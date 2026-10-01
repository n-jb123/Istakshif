import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TripCard } from '../../components/adventurer/TripCard';
import { GOVERNORATES, NATURE_CATEGORIES_INFO } from '../../data/mockData';
import { Trip, DifficultyLevel, NatureCategory } from '../../types';
import {
  Check,
  Plus,
  Trash2,
  Clock,
  Eye,
  Calendar,
  Save,
  CheckCircle2,
  ArrowRight,
  Upload,
} from 'lucide-react';

export const OrgCreateTripView: React.FC = () => {
  const { createTripOrganizer, navigate, showToast } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Basic Info
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState<NatureCategory[]>(['nature_mountains']);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [fromGov, setFromGov] = useState('damascus');
  const [toGov, setToGov] = useState('latakia');
  const [startDate, setStartDate] = useState('2026-11-15');
  const [endDate, setEndDate] = useState('2026-11-16');
  const [minAge, setMinAge] = useState(16);
  const [maxAge, setMaxAge] = useState(50);

  // Step 2: Program & Details
  const [dailyProgram, setDailyProgram] = useState<{ day: number; title: string; description: string; time?: string }[]>([
    { day: 1, title: 'التجمع والانطلاق والمخيم', description: 'التجمع في الصباح الباكر وبدء المسار الطبيعي.', time: '08:00 ص - 06:00 م' },
  ]);
  const [includedList, setIncludedList] = useState<string[]>(['النقل بباص سياحي مكيف', 'وجبة إفطار قروية', 'دليل مسار ومسعف']);
  const [notIncludedList, setNotIncludedList] = useState<string[]>(['المصاريف الشخصية']);
  const [whatToBringList, setWhatToBringList] = useState<string[]>(['حذاء مشي جبلي مريح', 'جاكيت خفيف']);
  const [meetingPoint, setMeetingPoint] = useState('دمشق - ساحة الأمويين أمام دار الأوبرا');
  const [transportType, setTransportType] = useState('حافلة VIP سياحية حديثة');

  // Step 3: Price & Seats
  const [pricePerPerson, setPricePerPerson] = useState<number>(160000);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [seatsTotal, setSeatsTotal] = useState<number>(25);
  const [minParticipants, setMinParticipants] = useState<number>(12);
  const [minDeadlineHours, setMinDeadlineHours] = useState<number>(72);
  const [whatsappNumber, setWhatsappNumber] = useState('+963944112233');
  const [groupLink, setGroupLink] = useState('https://chat.whatsapp.com/sample-new-trip');

  // New item inputs
  const [newProgramTitle, setNewProgramTitle] = useState('');
  const [newProgramDesc, setNewProgramDesc] = useState('');
  const [newIncItem, setNewIncItem] = useState('');
  const [newNotIncItem, setNewNotIncItem] = useState('');
  const [newBringItem, setNewBringItem] = useState('');

  // Live Trip Preview Object
  const previewTrip: Trip = {
    id: 'preview-trip',
    title: title || 'عنوان الرحلة الاستكشافية الجديدة',
    description: 'استكشاف الطبيعة والمعالم الساحرة بإشراف مرشدين متخصصين ومسارات مجهزة.',
    fromGovernorateId: fromGov,
    toGovernorateId: toGov,
    startDate,
    endDate,
    durationText: 'يومان',
    difficulty,
    categories,
    meetingPoint,
    transportType,
    included: includedList,
    notIncluded: notIncludedList,
    whatToBring: whatToBringList,
    minAge,
    maxAge,
    pricePerPerson: Number(pricePerPerson) || 160000,
    discountPrice: discountPrice ? Number(discountPrice) : undefined,
    seatsTotal: Number(seatsTotal) || 25,
    seatsTaken: 0,
    minParticipants: Number(minParticipants) || 12,
    minDeadlineHours: Number(minDeadlineHours) || 72,
    whatsappNumber,
    groupLink,
    isFeatured: false,
    status: 'published',
    organizerId: 'org-1',
    organizerName: 'فريق بردى للمغامرات الجبلية',
    organizerVerified: true,
    organizerRating: 4.9,
    organizerTripsCount: 24,
    images: ['/src/assets/images/syria_mountains_qalamoun_1790855700994.jpg'],
    dailyProgram,
    ratings: [],
    questions: [],
  };

  const toggleCategory = (cat: NatureCategory) => {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleAddDay = () => {
    if (!newProgramTitle.trim()) return;
    setDailyProgram(prev => [
      ...prev,
      { day: prev.length + 1, title: newProgramTitle, description: newProgramDesc },
    ]);
    setNewProgramTitle('');
    setNewProgramDesc('');
  };

  const handlePublish = () => {
    createTripOrganizer({
      title,
      categories,
      difficulty,
      fromGovernorateId: fromGov,
      toGovernorateId: toGov,
      startDate,
      endDate,
      minAge,
      maxAge,
      pricePerPerson,
      discountPrice,
      seatsTotal,
      minParticipants,
      minDeadlineHours,
      whatsappNumber,
      groupLink,
      meetingPoint,
      transportType,
      included: includedList,
      notIncluded: notIncludedList,
      whatToBring: whatToBringList,
      dailyProgram,
    });
    navigate('org-trips');
  };

  return (
    <div className="flex flex-col gap-6 text-right pb-24">
      {/* Header with Auto-save indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E4DCCF] dark:border-[#1C4F5B] gap-3">
        <div>
          <h1 className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
            إنشاء رحلة جديدة
          </h1>
          <span className="text-[11px] text-emerald-600 dark:text-[#7CFFCB] font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            «تم حفظ المسودة قبل 10 ثواني»
          </span>
        </div>

        <button
          onClick={() => showToast('تم حفظ مسودة الرحلة بنجاح.', 'success')}
          className="px-4 py-2 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-black/5 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>حفظ كمسودة</span>
        </button>
      </div>

      {/* Stepper progress bar */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
        {[
          { num: 1, title: 'المعلومات الأساسية' },
          { num: 2, title: 'البرنامج والتفاصيل' },
          { num: 3, title: 'السعر والمقاعد' },
          { num: 4, title: 'الصور والمراجعة' },
        ].map(s => (
          <button
            key={s.num}
            onClick={() => setStep(s.num as any)}
            className={`p-3 rounded-xl border transition-all text-center flex flex-col items-center gap-1 ${
              step === s.num
                ? 'border-[#D9603B] bg-[#D9603B] text-white shadow-xs'
                : step > s.num
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-[#7CFFCB]'
                : 'border-[#E4DCCF] dark:border-[#1C4F5B] bg-white dark:bg-[#123F49] text-gray-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
              {s.num}
            </span>
            <span className="truncate max-w-full">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Main Grid: Form (2 Cols) + Live Card Preview (1 Col on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* FORM IN MIDDLE */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-5 text-xs">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h2 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
                1. المعلومات الأساسية والوجهة
              </h2>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                  عنوان الرحلة <span className="text-red-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="مثال: مسار قمم بلودان وشلالات الزبداني"
                  className="w-full h-11 px-3.5 text-xs rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
                />
              </div>

              {/* Categories Multiple */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                  تصنيفات الطبيعة (متعدد) <span className="text-red-500">*</span>:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {NATURE_CATEGORIES_INFO.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        categories.includes(cat.id)
                          ? 'bg-[#D9603B] text-white shadow-xs'
                          : 'bg-[#F6F1EA] dark:bg-[#0A2E36] text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {cat.nameAr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                  مستوى الصعوبة <span className="text-red-500">*</span>:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'easy', label: 'سهل' },
                    { id: 'medium', label: 'متوسط' },
                    { id: 'hard', label: 'صعب' },
                  ].map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDifficulty(d.id as any)}
                      className={`py-2 rounded-xl font-bold border transition-colors ${
                        difficulty === d.id
                          ? 'border-[#D9603B] bg-[#D9603B] text-white'
                          : 'border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA] dark:bg-[#0A2E36] text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Governorates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                    محافظة الانطلاق <span className="text-red-500">*</span>:
                  </label>
                  <select
                    value={fromGov}
                    onChange={e => setFromGov(e.target.value)}
                    className="w-full h-11 px-3 text-xs rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none"
                  >
                    {GOVERNORATES.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                    محافظة الوجهة <span className="text-red-500">*</span>:
                  </label>
                  <select
                    value={toGov}
                    onChange={e => setToGov(e.target.value)}
                    className="w-full h-11 px-3 text-xs rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none"
                  >
                    {GOVERNORATES.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates & Age Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                    تاريخ الانطلاق <span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full h-11 px-3 text-xs rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                    الفئة العمرية (من - إلى) <span className="text-red-500">*</span>:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={minAge}
                      onChange={e => setMinAge(Number(e.target.value))}
                      className="w-full h-11 px-3 text-xs rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50"
                    />
                    <span>إلى</span>
                    <input
                      type="number"
                      value={maxAge}
                      onChange={e => setMaxAge(Number(e.target.value))}
                      className="w-full h-11 px-3 text-xs rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full h-11 mt-3 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold transition-colors"
              >
                التالي: البرنامج والتفاصيل
              </button>
            </div>
          )}

          {/* STEP 2: Program & Details */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
                2. البرنامج اليومي والمشمولات
              </h2>

              {/* Meeting Point & Transport */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                    نقطة التجمع والانطلاق <span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={meetingPoint}
                    onChange={e => setMeetingPoint(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                    وسيلة النقل <span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={transportType}
                    onChange={e => setTransportType(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50"
                  />
                </div>
              </div>

              {/* Daily Program list */}
              <div className="flex flex-col gap-2">
                <label className="block font-bold text-[#0A2E36] dark:text-[#F4EFE6]">
                  أيام البرنامج:
                </label>
                {dailyProgram.map((d, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/40 dark:bg-[#0A2E36]/40 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#D9603B] block">اليوم {d.day}: {d.title}</span>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{d.description}</p>
                    </div>
                  </div>
                ))}

                {/* Add day form */}
                <div className="p-3 rounded-xl border border-dashed border-[#D9603B] bg-white dark:bg-[#0A2E36] flex flex-col gap-2 mt-2">
                  <span className="font-bold text-xs text-[#D9603B]">إضافة يوم جديد للبرنامج:</span>
                  <input
                    type="text"
                    value={newProgramTitle}
                    onChange={e => setNewProgramTitle(e.target.value)}
                    placeholder="عنوان اليوم (مثال: وادي القبور ومعبد بل)"
                    className="w-full h-9 px-3 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#123F49]"
                  />
                  <textarea
                    value={newProgramDesc}
                    onChange={e => setNewProgramDesc(e.target.value)}
                    placeholder="وصف الأنشطة ومواعيد الوجبات..."
                    rows={2}
                    className="w-full p-2 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#123F49]"
                  />
                  <button
                    type="button"
                    onClick={handleAddDay}
                    className="self-end px-3 py-1.5 bg-[#D9603B] text-white font-bold rounded-lg text-xs"
                  >
                    + إضافة هذا اليوم
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] font-bold text-gray-600"
                >
                  السابق
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#D9603B] text-white font-bold hover:bg-[#C04E2B] transition-colors"
                >
                  التالي: السعر والمقاعد
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Price & Seats */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h2 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
                3. السعر، المقاعد، وبيانات التواصل
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                    سعر الاشتراك للشخص (ل.س) <span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="number"
                    required
                    value={pricePerPerson}
                    onChange={e => setPricePerPerson(Number(e.target.value))}
                    className="w-full h-11 px-3 text-xs rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                    سعر العرض المخفض (اختياري - يظهر شارة 🔥 عرض):
                  </label>
                  <input
                    type="number"
                    value={discountPrice || ''}
                    onChange={e => setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="مثال: 140000"
                    className="w-full h-11 px-3 text-xs rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                    إجمالي المقاعد <span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="number"
                    value={seatsTotal}
                    onChange={e => setSeatsTotal(Number(e.target.value))}
                    className="w-full h-11 px-3 text-xs rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                    الحد الأدنى للمشاركين <span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="number"
                    value={minParticipants}
                    onChange={e => setMinParticipants(Number(e.target.value))}
                    className="w-full h-11 px-3 text-xs rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                    مهلة الحسم الأدنى (ساعة) <span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="number"
                    value={minDeadlineHours}
                    onChange={e => setMinDeadlineHours(Number(e.target.value))}
                    className="w-full h-11 px-3 text-xs rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                    رقم واتساب المنظم (يظهر بعد تأكيد الدفع) <span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={e => setWhatsappNumber(e.target.value)}
                    className="w-full h-11 px-3 text-xs rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                    رابط مجموعة واتساب للرحلة <span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={groupLink}
                    onChange={e => setGroupLink(e.target.value)}
                    className="w-full h-11 px-3 text-xs rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] font-bold text-gray-600"
                >
                  السابق
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-[#D9603B] text-white font-bold hover:bg-[#C04E2B] transition-colors"
                >
                  التالي: الصور والمراجعة
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review and Publish */}
          {step === 4 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
                4. مراجعة بيانات الرحلة والنشر
              </h2>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-[#7CFFCB] flex flex-col gap-1.5">
                <span className="font-bold">جاهز للنشر للجمهور!</span>
                <p>
                  بما أنك منظم معتمد وموثق، ستُنشر رحلتك فوراً في المنصة وتظهر لجميع المغامرين في دليل الرحلات.
                </p>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] font-bold text-gray-600"
                >
                  السابق
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="px-8 py-3 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold text-sm shadow-lg transition-transform hover:scale-102"
                >
                  نشر الرحلة الآن
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LIVE SIDE PREVIEW OF THE TRIP CARD (Section 8.4) */}
        <div className="hidden lg:flex flex-col gap-3 sticky top-24">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
            <Eye className="w-4 h-4 text-[#D9603B]" />
            <span>معاينة حية لبطاقة الرحلة:</span>
          </div>

          <TripCard trip={previewTrip} />
        </div>
      </div>
    </div>
  );
};
