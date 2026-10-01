import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GOVERNORATES, NATURE_CATEGORIES_INFO } from '../../data/mockData';
import {
  Share2,
  Heart,
  Calendar,
  Clock,
  Mountain,
  Users,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  HelpCircle,
  Star,
  Check,
  X,
  AlertCircle,
  Send,
  Lock,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Flame,
} from 'lucide-react';

export const TripDetailView: React.FC = () => {
  const {
    trips,
    pageParams,
    navigate,
    openBookingModal,
    favorites,
    toggleFavorite,
    bookings,
    currentRole,
    openAuthModal,
    submitQuestion,
    showToast,
  } = useApp();

  const tripId = pageParams.id || 'trip-1';
  const trip = trips.find(t => t.id === tripId) || trips[0];

  // Collapsible sections state
  const [programOpen, setProgramOpen] = useState(true);
  const [includedOpen, setIncludedOpen] = useState(true);
  const [whatToBringOpen, setWhatToBringOpen] = useState(false);
  const [cancellationOpen, setCancellationOpen] = useState(true);

  // Q&A input
  const [questionText, setQuestionText] = useState('');

  // Check if current user has confirmed booking for this trip to unlock contact
  const userBooking = bookings.find(
    b => b.tripId === trip.id && (b.status === 'confirmed' || b.status === 'attended')
  );
  const isConfirmedAdventurer = !!userBooking;

  const isFav = favorites.includes(trip.id);
  const fromGov = GOVERNORATES.find(g => g.id === trip.fromGovernorateId)?.nameAr || trip.fromGovernorateId;
  const toGov = GOVERNORATES.find(g => g.id === trip.toGovernorateId)?.nameAr || trip.toGovernorateId;

  const seatsLeft = trip.seatsTotal - trip.seatsTaken;
  const isFull = trip.status === 'full' || seatsLeft <= 0;
  const isCancelled = trip.status === 'cancelled';

  const effectivePrice = trip.discountPrice || trip.pricePerPerson;

  // Share handler
  const handleShare = () => {
    const text = `رحلة ${trip.title} من ${fromGov} إلى ${toGov} بتاريخ ${trip.startDate} بسعر ${effectivePrice.toLocaleString()} ل.س على استكشف`;
    navigator.clipboard.writeText(`${text} - ${window.location.href}`);
    showToast('«تم نسخ الرابط.» مع نص المشاركة الجاهز.', 'success');
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole === 'guest') {
      openAuthModal('login');
      return;
    }
    if (!questionText.trim()) return;
    submitQuestion(trip.id, questionText);
    setQuestionText('');
  };

  return (
    <div className="flex flex-col gap-8 pb-24 text-right">
      {/* Cancelled Banner if applicable (Section 7.3 & E4) */}
      {isCancelled && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-800 dark:text-red-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
            <p className="font-bold">
              «تم إلغاء الرحلة لعدم اكتمال العدد الأدنى. سيُعاد إليك العربون كاملاً.»
            </p>
          </div>
          <button
            onClick={() => navigate('trips')}
            className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs"
          >
            استعراض رحلات مشابهة
          </button>
        </div>
      )}

      {/* 1. Image Gallery: Mobile Carousel / Desktop Grid (Section 7.3) */}
      <section className="w-full">
        {/* Desktop Grid Layout (1 large + 4 small) */}
        <div className="hidden sm:grid grid-cols-4 gap-3 rounded-2xl overflow-hidden aspect-21/9 max-h-[460px]">
          <div className="col-span-3 relative h-full bg-[#0A2E36] overflow-hidden group">
            <img
              src={trip.images[0]}
              alt={trip.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
          </div>
          <div className="col-span-1 flex flex-col gap-3 h-full">
            <div className="flex-1 relative bg-[#0A2E36] overflow-hidden rounded-r-xl">
              <img
                src={trip.images[1] || trip.images[0]}
                alt={trip.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 relative bg-[#0A2E36] overflow-hidden rounded-r-xl">
              <img
                src={trip.images[0]}
                alt={trip.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs bg-black/40">
                + معرض الصور
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Single Card Carousel */}
        <div className="sm:hidden relative aspect-16/10 rounded-2xl overflow-hidden bg-[#0A2E36]">
          <img
            src={trip.images[0]}
            alt={trip.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Main Content Layout: Details (Col 1-2) + Desktop Sticky Booking Card (Col 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Trip Information */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* 2. Title, Verified Badge, Share & Favorite */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#D9603B]">
                  من {fromGov} إلى {toGov}
                </span>
                <span>·</span>
                <span className="text-xs text-gray-500">{trip.durationText}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-white dark:bg-[#123F49] text-gray-700 dark:text-gray-200 hover:text-[#D9603B] transition-colors"
                  title="مشاركة الرحلة"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(trip.id)}
                  className={`p-2 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-white dark:bg-[#123F49] transition-colors ${
                    isFav ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'
                  }`}
                  title="إضافة إلى المفضلة"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            <h1 className="font-cairo font-bold text-2xl sm:text-3xl text-[#0A2E36] dark:text-[#F4EFE6] leading-tight">
              {trip.title}
            </h1>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {trip.description}
            </p>
          </div>

          {/* 3. Quick Summary Card (Destination, Date, Duration, Difficulty, Age Group, Participants Counter) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36] text-[#D9603B] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-gray-500 block">الوجهة</span>
                <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6]">{toGov}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36] text-[#D9603B] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-gray-500 block">تاريخ الانطلاق</span>
                <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6]">{trip.startDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36] text-[#D9603B] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-gray-500 block">المدة</span>
                <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6]">{trip.durationText}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36] text-[#D9603B] flex items-center justify-center shrink-0">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-gray-500 block">مستوى الصعوبة</span>
                <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6]">
                  {trip.difficulty === 'easy' ? 'سهل' : trip.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36] text-[#D9603B] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-gray-500 block">الفئة العمرية</span>
                <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6]">
                  {trip.minAge} - {trip.maxAge} سنة
                </span>
              </div>
            </div>

            {/* Participants counter verbatim: «الحد الأدنى: 8، المسجلون: 5» */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36] text-[#1F8F68] dark:text-[#7CFFCB] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-gray-500 block">المشاركون</span>
                <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6]">
                  الحد الأدنى: {trip.minParticipants}، المسجلون: {trip.seatsTaken}
                </span>
              </div>
            </div>
          </div>

          {/* Meeting Point & Transport */}
          <div className="p-4 rounded-xl bg-[#F6F1EA] dark:bg-[#123F49]/40 border border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-[#D9603B]">نقطة الانطلاق: </span>
              <span className="text-gray-700 dark:text-gray-300">{trip.meetingPoint}</span>
            </div>
            <div>
              <span className="font-bold text-[#D9603B]">وسيلة النقل: </span>
              <span className="text-gray-700 dark:text-gray-300">{trip.transportType}</span>
            </div>
          </div>

          {/* 4. Daily Program (Collapsible per day) */}
          <div className="rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] overflow-hidden shadow-xs">
            <button
              onClick={() => setProgramOpen(p => !p)}
              className="w-full p-5 flex items-center justify-between font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <span>برنامج الرحلة المفصل</span>
              {programOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {programOpen && (
              <div className="px-5 pb-5 flex flex-col gap-4 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 pt-4">
                {trip.dailyProgram.map(day => (
                  <div
                    key={day.day}
                    className="p-4 rounded-xl bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/40 border border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#D9603B]">
                        اليوم {day.day}: {day.title}
                      </span>
                      {day.time && (
                        <span className="text-[11px] text-gray-500 font-semibold">{day.time}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {day.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. Included / Not Included (Collapsible) */}
          <div className="rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] overflow-hidden shadow-xs">
            <button
              onClick={() => setIncludedOpen(p => !p)}
              className="w-full p-5 flex items-center justify-between font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <span>مشمول وغير مشمول بالسعر</span>
              {includedOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {includedOpen && (
              <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 pt-4 text-xs">
                {/* Included */}
                <div className="flex flex-col gap-2">
                  <span className="font-bold text-emerald-600 dark:text-[#7CFFCB]">مشمول بالسعر:</span>
                  <ul className="flex flex-col gap-1.5">
                    {trip.included.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Not Included */}
                <div className="flex flex-col gap-2">
                  <span className="font-bold text-red-500">غير مشمول:</span>
                  <ul className="flex flex-col gap-1.5">
                    {trip.notIncluded.map((notInc, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span>{notInc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* 6. What to Bring (Collapsible) */}
          <div className="rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] overflow-hidden shadow-xs">
            <button
              onClick={() => setWhatToBringOpen(p => !p)}
              className="w-full p-5 flex items-center justify-between font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <span>ما يجب إحضاره</span>
              {whatToBringOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {whatToBringOpen && (
              <div className="px-5 pb-5 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 pt-4 text-xs">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {trip.whatToBring.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D9603B]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 7. Organizer Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={trip.images[0]}
                alt={trip.organizerName}
                className="w-14 h-14 rounded-full object-cover border border-[#D9603B]/30"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
                    {trip.organizerName}
                  </span>
                  {trip.organizerVerified && (
                    <span className="inline-flex items-center gap-0.5 text-xs text-emerald-600 dark:text-[#7CFFCB] font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      موثّق
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{trip.organizerTripsCount} رحلة منفذة</span>
                  <span>·</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{trip.organizerRating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('organizer-detail', { id: trip.organizerId })}
              className="px-4 py-2 rounded-xl border border-[#D9603B] text-[#D9603B] font-bold text-xs hover:bg-[#D9603B]/10 transition-colors shrink-0"
            >
              صفحة المنظم
            </button>
          </div>

          {/* 8. Short Cancellation Policy */}
          <div className="rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] overflow-hidden shadow-xs">
            <button
              onClick={() => setCancellationOpen(p => !p)}
              className="w-full p-5 flex items-center justify-between font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <span>سياسة الإلغاء والاسترجاع</span>
              {cancellationOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {cancellationOpen && (
              <div className="px-5 pb-5 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 pt-4 text-xs text-gray-600 dark:text-gray-300 leading-relaxed flex flex-col gap-2">
                <p>
                  • يحق للمغامر إلغاء الحجز واسترداد كامل العربون المدفوع طالما أن الإلغاء يتم قبل أكثر من 48 ساعة من موعد انطلاق الرحلة.
                </p>
                <p className="font-bold text-[#D9603B]">
                  • «لا يمكن إلغاء الحجز قبل موعد الرحلة بأقل من 48 ساعة.»
                </p>
              </div>
            )}
          </div>

          {/* Contact Section after confirmation (Section 7.3 & 7.16) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-3">
            <h3 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
              التواصل مع المنظم ومجموعة الرحلة
            </h3>

            {isConfirmedAdventurer ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                    تم تأكيد حجزك! بيانات التواصل متاحة لك:
                  </span>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    واتساب المنظم: {trip.whatsappNumber}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/${trip.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>افتح واتساب</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/50 border border-[#E4DCCF] dark:border-[#1C4F5B] text-xs text-gray-500 flex items-center gap-3">
                <Lock className="w-5 h-5 text-gray-400 shrink-0" />
                <p>«يظهر رقم المنظم ورابط المجموعة بعد تأكيد الدفع.»</p>
              </div>
            )}
          </div>

          {/* 9. Ratings and Reviews (Section 7.8) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60">
              <h3 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
                تقييمات المغامرين ({trip.ratings.length})
              </h3>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                <Star className="w-4 h-4 fill-current" />
                <span>{trip.organizerRating.toFixed(1)} من 5</span>
              </div>
            </div>

            {trip.ratings.length > 0 ? (
              <div className="flex flex-col gap-3">
                {trip.ratings.map(r => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-xl bg-[#F6F1EA]/40 dark:bg-[#0A2E36]/30 border border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col gap-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6]">{r.userName}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: r.tripStars }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{r.comment}</p>
                    <span className="text-[10px] text-gray-400">{r.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">لا توجد تقييمات منشورة بعد لهذه الرحلة.</p>
            )}
          </div>

          {/* 10. Public Q&A Section (Section 7.8 & 7.15) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4">
            <h3 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
              أسئلة وأجوبة عامة ({trip.questions.length})
            </h3>

            {/* List */}
            {trip.questions.length > 0 ? (
              <div className="flex flex-col gap-3">
                {trip.questions.map(q => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-[#F6F1EA]/40 dark:bg-[#0A2E36]/30 border border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col gap-2.5 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6]">
                        س: {q.question}
                      </span>
                      <span className="text-[10px] text-gray-400">{q.userName} · {q.date}</span>
                    </div>

                    {q.answer ? (
                      <div className="pr-3 border-r-2 border-[#D9603B] text-gray-700 dark:text-gray-300 mt-1">
                        <span className="font-bold text-[#D9603B] block">رد المنظم:</span>
                        <p className="mt-0.5">{q.answer}</p>
                      </div>
                    ) : (
                      <span className="text-[11px] text-amber-600 font-semibold">
                        بانتظار رد المنظم...
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                لا توجد أسئلة بعد. هل لديك أي استفسار حول مسار الرحلة أو المعدات؟
              </p>
            )}

            {/* Ask form */}
            <form onSubmit={handleAskQuestion} className="flex gap-2 pt-2">
              <input
                type="text"
                value={questionText}
                onChange={e => setQuestionText(e.target.value)}
                placeholder={
                  currentRole === 'guest'
                    ? 'سجّل دخولك لتسأل المنظم...'
                    : 'اكتب سؤالك ليجيب المنظم وتظهر الإجابة للجميع...'
                }
                className="flex-1 h-11 px-4 text-xs rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
              />
              <button
                type="submit"
                className="h-11 px-5 rounded-xl bg-[#D9603B] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-[#C04E2B] transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Desktop Sticky Booking Card */}
        <div className="hidden lg:block sticky top-24">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xl flex flex-col gap-5">
            {/* Price Box */}
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">سعر الاشتراك للشخص:</span>
              <div className="flex items-baseline gap-2 mt-1">
                {trip.discountPrice ? (
                  <>
                    <span className="text-sm text-gray-400 line-through tabular-nums">
                      {trip.pricePerPerson.toLocaleString()}
                    </span>
                    <span className="font-cairo font-bold text-3xl text-[#D9603B] tabular-nums">
                      {trip.discountPrice.toLocaleString()} <span className="text-sm font-normal">ل.س</span>
                    </span>
                  </>
                ) : (
                  <span className="font-cairo font-bold text-3xl text-[#0A2E36] dark:text-[#F4EFE6] tabular-nums">
                    {trip.pricePerPerson.toLocaleString()} <span className="text-sm font-normal">ل.س</span>
                  </span>
                )}
              </div>
            </div>

            {/* Deposit & Commission Breakdown */}
            <div className="p-3.5 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/60 border border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span>العربون للمنصة (10%):</span>
                <span className="font-bold text-[#D9603B] tabular-nums">
                  {Math.round(effectivePrice * 0.1).toLocaleString()} ل.س
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span>المتبقي للمنظم مباشرة:</span>
                <span className="font-bold tabular-nums">
                  {Math.round(effectivePrice * 0.9).toLocaleString()} ل.س
                </span>
              </div>
            </div>

            {/* Seats status */}
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-500">المقاعد المتاحة:</span>
              {isFull ? (
                <span className="text-gray-500">مكتملة · 5 بقائمة الانتظار</span>
              ) : (
                <span className="text-emerald-600 dark:text-[#7CFFCB]">
                  متبقي {seatsLeft} من أصل {trip.seatsTotal}
                </span>
              )}
            </div>

            {/* Primary Action Button */}
            {isFull ? (
              <button
                type="button"
                onClick={() => showToast('تمت إضافتك إلى قائمة الانتظار برقم 6. سيتم إشعارك فور توفر مقعد.', 'success')}
                className="w-full h-12 rounded-xl border-2 border-[#D9603B] text-[#D9603B] hover:bg-[#D9603B]/10 font-bold text-sm transition-colors"
              >
                انضم لقائمة الانتظار
              </button>
            ) : isCancelled ? (
              <button
                type="button"
                onClick={() => navigate('trips')}
                className="w-full h-12 rounded-xl bg-gray-500 text-white font-bold text-sm cursor-not-allowed"
              >
                الرحلة ملغاة · تصفح بدائل
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openBookingModal(trip)}
                className="w-full h-12 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold text-base shadow-lg transition-transform hover:scale-102"
              >
                احجز مقعدك الآن
              </button>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>استرداد كامل للعربون حتى 48 ساعة قبل الرحلة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Booking Bar (Section 7.3 & 11) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-white/95 dark:bg-[#123F49]/95 backdrop-blur-md border-t border-[#E4DCCF] dark:border-[#1C4F5B] flex items-center justify-between gap-4 shadow-2xl">
        <div>
          <span className="text-[11px] text-gray-500 block">
            {isFull ? 'العدد مكتمل' : `متبقي ${seatsLeft} مقاعد`}
          </span>
          <span className="font-cairo font-bold text-lg text-[#D9603B] tabular-nums">
            {effectivePrice.toLocaleString()} <span className="text-xs font-normal">ل.س</span>
          </span>
        </div>

        {isFull ? (
          <button
            type="button"
            onClick={() => showToast('تمت إضافتك إلى قائمة الانتظار. سيتم إشعارك فور توفر مقعد.', 'success')}
            className="h-11 px-5 rounded-xl border border-[#D9603B] text-[#D9603B] font-bold text-xs"
          >
            انضم لقائمة الانتظار
          </button>
        ) : (
          <button
            type="button"
            onClick={() => openBookingModal(trip)}
            className="h-11 px-6 rounded-xl bg-[#D9603B] text-white font-bold text-sm shadow-md"
          >
            احجز مقعدك
          </button>
        )}
      </div>
    </div>
  );
};
