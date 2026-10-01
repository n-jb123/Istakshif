import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { GOVERNORATES, NATURE_CATEGORIES_INFO } from '../../data/mockData';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Flame,
  Star,
  CheckCircle2,
  Calendar,
  Mountain,
  Compass,
  ArrowRight,
  Landmark,
  Waves,
  Church,
  Tent,
  Theater,
  HandHeart,
  TrendingUp,
  Check,
  X,
  SlidersHorizontal,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { trips, organizers, navigate, openBookingModal } = useApp();

  const [searchText, setSearchText] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedNature, setSelectedNature] = useState<string>('');

  // Dropdown menus state for integrated filter icons
  const [natureMenuOpen, setNatureMenuOpen] = useState(false);
  const [difficultyMenuOpen, setDifficultyMenuOpen] = useState(false);
  const searchBarRef = useRef<HTMLFormElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setNatureMenuOpen(false);
        setDifficultyMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Carousel of Featured & Offers
  const carouselTrips = trips.filter(t => t.isFeatured || t.discountPrice);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (carouselTrips.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % carouselTrips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselTrips.length]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNatureMenuOpen(false);
    setDifficultyMenuOpen(false);
    navigate('trips', {
      search: searchText,
      difficulty: selectedDifficulty,
      nature: selectedNature,
    });
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'mountain':
        return <Mountain className="w-5 h-5" />;
      case 'landmark':
        return <Landmark className="w-5 h-5" />;
      case 'waves':
        return <Waves className="w-5 h-5" />;
      case 'church':
        return <Church className="w-5 h-5" />;
      case 'tent':
        return <Tent className="w-5 h-5" />;
      case 'theater':
        return <Theater className="w-5 h-5" />;
      case 'heart-handshake':
        return <HandHeart className="w-5 h-5" />;
      default:
        return <Compass className="w-5 h-5" />;
    }
  };

  const currentSlideTrip = carouselTrips[activeSlide];

  return (
    <div className="flex flex-col gap-10 sm:gap-12 pb-16 text-right">
      {/* 1. Full-width Search Bar featuring integrated Search icon, Nature icon, and Difficulty icon */}
      <section className="w-full pt-4">
        <form
          ref={searchBarRef}
          onSubmit={handleSearchSubmit}
          className="w-full bg-white dark:bg-[#123F49] rounded-2xl border border-[#E4DCCF] dark:border-[#1C4F5B] p-2 shadow-md flex items-center relative"
        >
          {/* Integrated search input area with search icon and filter icons */}
          <div className="relative flex-1 w-full flex items-center">
            {/* Search Icon on the right (RTL start) - interactive submit affordance */}
            <button
              type="submit"
              className="absolute right-3 text-gray-400 hover:text-[#D9603B] transition-colors flex items-center justify-center cursor-pointer p-1.5 rounded-lg"
              title="بحث"
              aria-label="بحث"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Main Text Input */}
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="ابحث عن رحلة، وجهة، أو منظم..."
              className="w-full h-12 pr-11 pl-28 sm:pl-36 rounded-xl bg-[#F6F1EA]/60 dark:bg-[#0A2E36]/60 border border-[#E4DCCF] dark:border-[#1C4F5B] text-sm text-[#0A2E36] dark:text-[#F4EFE6] focus:outline-none focus:ring-2 focus:ring-[#D9603B] transition-all"
            />

            {/* Integrated Nature and Difficulty Filter Icons on the left of the input */}
            <div className="absolute left-2 flex items-center gap-1.5 z-20">
              {/* Nature Filter Icon Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNatureMenuOpen(prev => !prev);
                    setDifficultyMenuOpen(false);
                  }}
                  className={`h-9 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all border ${
                    selectedNature
                      ? 'bg-[#D9603B] text-white border-[#D9603B] shadow-xs'
                      : natureMenuOpen
                      ? 'bg-[#D9603B]/10 text-[#D9603B] border-[#D9603B]'
                      : 'bg-white dark:bg-[#123F49] text-gray-600 dark:text-gray-300 border-[#E4DCCF] dark:border-[#1C4F5B] hover:text-[#D9603B] hover:border-[#D9603B]/60'
                  }`}
                  title="تصفية حسب تصنيف الطبيعة"
                  aria-label="تصفية حسب تصنيف الطبيعة"
                  aria-expanded={natureMenuOpen}
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline truncate max-w-[80px]">
                    {selectedNature
                      ? NATURE_CATEGORIES_INFO.find(c => c.id === selectedNature)?.nameAr || 'الطبيعة'
                      : 'الطبيعة'}
                  </span>
                  {selectedNature && (
                    <span
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedNature('');
                      }}
                      className="hover:opacity-75 p-0.5 shrink-0"
                      title="إلغاء الفلتر"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  )}
                </button>

                {/* Nature Dropdown Menu */}
                {natureMenuOpen && (
                  <div className="absolute left-0 sm:right-auto sm:left-0 top-full mt-2 w-64 p-2 bg-white dark:bg-[#123F49] rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-2xl z-50 text-right animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-2.5 py-1.5 pb-2 border-b border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 text-xs font-bold text-[#0A2E36] dark:text-[#F4EFE6]">
                      <span className="flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-[#D9603B]" />
                        <span>تصنيف الطبيعة</span>
                      </span>
                      {selectedNature && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedNature('');
                            setNatureMenuOpen(false);
                          }}
                          className="text-[11px] text-[#D9603B] hover:underline"
                        >
                          مسح
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 mt-1.5 max-h-60 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedNature('');
                          setNatureMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          !selectedNature
                            ? 'bg-[#D9603B]/10 text-[#D9603B] font-bold'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-[#F6F1EA] dark:hover:bg-[#0A2E36]'
                        }`}
                      >
                        <span>كافة التصنيفات</span>
                        {!selectedNature && <Check className="w-3.5 h-3.5 text-[#D9603B]" />}
                      </button>

                      {NATURE_CATEGORIES_INFO.map(cat => {
                        const isSelected = selectedNature === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setSelectedNature(cat.id);
                              setNatureMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              isSelected
                                ? 'bg-[#D9603B]/10 text-[#D9603B] font-bold'
                                : 'text-gray-700 dark:text-gray-200 hover:bg-[#F6F1EA] dark:hover:bg-[#0A2E36]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[#D9603B] dark:text-[#7CFFCB]">
                                {getCategoryIcon(cat.iconName)}
                              </span>
                              <span>{cat.nameAr}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#D9603B]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Difficulty Filter Icon Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setDifficultyMenuOpen(prev => !prev);
                    setNatureMenuOpen(false);
                  }}
                  className={`h-9 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all border ${
                    selectedDifficulty
                      ? 'bg-[#D9603B] text-white border-[#D9603B] shadow-xs'
                      : difficultyMenuOpen
                      ? 'bg-[#D9603B]/10 text-[#D9603B] border-[#D9603B]'
                      : 'bg-white dark:bg-[#123F49] text-gray-600 dark:text-gray-300 border-[#E4DCCF] dark:border-[#1C4F5B] hover:text-[#D9603B] hover:border-[#D9603B]/60'
                  }`}
                  title="تصفية حسب مستوى الصعوبة"
                  aria-label="تصفية حسب مستوى الصعوبة"
                  aria-expanded={difficultyMenuOpen}
                >
                  <Mountain className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">
                    {selectedDifficulty === 'easy'
                      ? 'سهل'
                      : selectedDifficulty === 'medium'
                      ? 'متوسط'
                      : selectedDifficulty === 'hard'
                      ? 'صعب'
                      : 'الصعوبة'}
                  </span>
                  {selectedDifficulty && (
                    <span
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedDifficulty('');
                      }}
                      className="hover:opacity-75 p-0.5 shrink-0"
                      title="إلغاء الفلتر"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  )}
                </button>

                {/* Difficulty Dropdown Menu */}
                {difficultyMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-56 p-2 bg-white dark:bg-[#123F49] rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-2xl z-50 text-right animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-2.5 py-1.5 pb-2 border-b border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 text-xs font-bold text-[#0A2E36] dark:text-[#F4EFE6]">
                      <span className="flex items-center gap-1.5">
                        <Mountain className="w-4 h-4 text-[#D9603B]" />
                        <span>مستوى الصعوبة</span>
                      </span>
                      {selectedDifficulty && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDifficulty('');
                            setDifficultyMenuOpen(false);
                          }}
                          className="text-[11px] text-[#D9603B] hover:underline"
                        >
                          مسح
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 mt-1.5">
                      {[
                        { id: '', label: 'كافة المستويات', desc: 'عرض كل درجات الصعوبة' },
                        { id: 'easy', label: 'سهل', desc: 'مسارات مريحة تناسب الجميع' },
                        { id: 'medium', label: 'متوسط', desc: 'مسارات جبلية تتطلب لياقة' },
                        { id: 'hard', label: 'صعب', desc: 'تحديات وتسلق قمم' },
                      ].map(item => {
                        const isSelected = selectedDifficulty === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setSelectedDifficulty(item.id);
                              setDifficultyMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              isSelected
                                ? 'bg-[#D9603B]/10 text-[#D9603B] font-bold'
                                : 'text-gray-700 dark:text-gray-200 hover:bg-[#F6F1EA] dark:hover:bg-[#0A2E36]'
                            }`}
                          >
                            <div className="flex flex-col items-start">
                              <span>{item.label}</span>
                              <span className="text-[10px] text-gray-400">{item.desc}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#D9603B]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </section>

      {/* 2. Offers & Featured Carousel (Section 7.1 - 5 second auto-advance) */}
      {currentSlideTrip && (
        <section className="relative w-full rounded-2xl overflow-hidden bg-[#0A2E36] border border-[#1C4F5B] shadow-xl">
          {/* Main Slide Display */}
          <div className="relative aspect-16/9 md:aspect-21/9 w-full overflow-hidden">
            <img
              src={currentSlideTrip.images[0]}
              alt={currentSlideTrip.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-700"
            />
            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

            {/* Content Over Slide */}
            <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-between">
              {/* Badges on Top */}
              <div className="flex items-center gap-2">
                {currentSlideTrip.discountPrice && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#7CFFCB] text-[#0A2E36] shadow-md">
                    <Flame className="w-4 h-4 text-[#D9603B] fill-current" />
                    عرض خاص
                  </span>
                )}
                {currentSlideTrip.isFeatured && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D9603B] text-white shadow-md">
                    <Star className="w-4 h-4 fill-current" />
                    رحلة مميزة
                  </span>
                )}
              </div>

              {/* Bottom Details & Booking */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 text-xs text-[#7CFFCB] font-bold mb-1">
                    <span>
                      من {GOVERNORATES.find(g => g.id === currentSlideTrip.fromGovernorateId)?.nameAr}
                    </span>
                    <span>←</span>
                    <span>
                      إلى {GOVERNORATES.find(g => g.id === currentSlideTrip.toGovernorateId)?.nameAr}
                    </span>
                    <span>·</span>
                    <span>{currentSlideTrip.startDate}</span>
                  </div>
                  <h2 className="font-cairo font-bold text-xl sm:text-3xl text-white leading-tight">
                    {currentSlideTrip.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 mt-2 leading-relaxed">
                    {currentSlideTrip.description}
                  </p>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end gap-3 shrink-0">
                  <div className="text-right">
                    {currentSlideTrip.discountPrice ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-gray-400 line-through tabular-nums">
                          {currentSlideTrip.pricePerPerson.toLocaleString()}
                        </span>
                        <span className="font-cairo font-bold text-xl sm:text-2xl text-[#7CFFCB] tabular-nums">
                          {currentSlideTrip.discountPrice.toLocaleString()}{' '}
                          <span className="text-xs font-normal text-white">ل.س</span>
                        </span>
                      </div>
                    ) : (
                      <span className="font-cairo font-bold text-xl sm:text-2xl text-white tabular-nums">
                        {currentSlideTrip.pricePerPerson.toLocaleString()}{' '}
                        <span className="text-xs font-normal">ل.س</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate('trip-detail', { id: currentSlideTrip.id })}
                      className="px-4 py-2.5 rounded-xl border border-white/40 hover:bg-white/10 text-white text-xs font-bold transition-colors"
                    >
                      التفاصيل
                    </button>
                    <button
                      type="button"
                      onClick={() => openBookingModal(currentSlideTrip)}
                      className="px-5 py-2.5 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white text-xs font-bold shadow-lg transition-colors"
                    >
                      احجز الآن
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrows */}
            <button
              onClick={() =>
                setActiveSlide(prev => (prev === 0 ? carouselTrips.length - 1 : prev - 1))
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
              aria-label="الشريحة السابقة"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSlide(prev => (prev + 1) % carouselTrips.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
              aria-label="الشريحة التالية"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5">
              {carouselTrips.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeSlide === i ? 'w-6 bg-[#D9603B]' : 'w-2 bg-white/40'
                  }`}
                  aria-label={`انتقل للشريحة ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Nature Categories (7 small cards, horizontal on mobile, full row on desktop) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-cairo font-bold text-lg sm:text-xl text-[#0A2E36] dark:text-[#F4EFE6]">
            التصنيفات حسب الطبيعة
          </h2>
          <button
            onClick={() => navigate('trips')}
            className="text-xs font-bold text-[#D9603B] hover:underline flex items-center gap-1"
          >
            <span>عرض كل الرحلات</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7 cards row */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
          {NATURE_CATEGORIES_INFO.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate('trips', { nature: cat.id })}
              className="snap-start shrink-0 w-32 sm:flex-1 py-4 px-3 rounded-xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] hover:border-[#D9603B] dark:hover:border-[#7CFFCB] hover:shadow-md flex flex-col items-center justify-center gap-2.5 transition-all text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#F6F1EA] dark:bg-[#0A2E36] text-[#D9603B] dark:text-[#7CFFCB] flex items-center justify-center group-hover:scale-110 transition-transform">
                {getCategoryIcon(cat.iconName)}
              </div>
              <span className="font-cairo font-bold text-xs text-[#0A2E36] dark:text-[#F4EFE6] leading-tight">
                {cat.nameAr}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Difficulty Categories (3 cards stacked vertically as in specs 7.1) */}
      <section className="flex flex-col gap-4">
        <h2 className="font-cairo font-bold text-lg sm:text-xl text-[#0A2E36] dark:text-[#F4EFE6]">
          التصنيفات حسب الصعوبة
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'easy',
              nameAr: 'سهل',
              desc: 'مسارات مريحة تناسب العائلات والمبتدئين، مسافات مشي قصيرة',
              icon: (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-[#7CFFCB]">
                  <span className="w-6 h-1 bg-current rounded-full" />
                  <span className="w-2 h-2 rounded-full bg-current" />
                </div>
              ),
            },
            {
              id: 'medium',
              nameAr: 'متوسط',
              desc: 'مسارات جبلية تتطلب لياقة بدنية عامة ومرونة في المشي',
              icon: (
                <div className="flex items-center gap-1 text-amber-500">
                  <span className="w-4 h-1.5 bg-current rounded-full" />
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span className="w-2 h-2 rounded-full bg-current" />
                </div>
              ),
            },
            {
              id: 'hard',
              nameAr: 'صعب',
              desc: 'صعود قمم حادة وتحديات تسلق تتطلب خبرة ومعدات ملائمة',
              icon: (
                <div className="flex items-center gap-1 text-red-500">
                  <Mountain className="w-5 h-5" />
                  <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                </div>
              ),
            },
          ].map(lvl => (
            <button
              key={lvl.id}
              onClick={() => navigate('trips', { difficulty: lvl.id })}
              className="p-4 rounded-xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] hover:border-[#D9603B] hover:shadow-md flex items-center gap-3.5 transition-all text-right group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36] flex items-center justify-center shrink-0">
                {lvl.icon}
              </div>
              <div className="flex flex-col">
                <span className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6] group-hover:text-[#D9603B] transition-colors">
                  مستوى {lvl.nameAr}
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                  {lvl.desc}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 5. Organizers Swiper (Section 7.1) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-cairo font-bold text-lg sm:text-xl text-[#0A2E36] dark:text-[#F4EFE6]">
            المنظمون الموثوقون
          </h2>
          <button
            onClick={() => navigate('organizers')}
            className="text-xs font-bold text-[#D9603B] hover:underline flex items-center gap-1"
          >
            <span>دليل المنظمين</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
          {organizers.map(org => (
            <div
              key={org.id}
              onClick={() => navigate('organizer-detail', { id: org.id })}
              className="snap-start shrink-0 w-64 p-4 rounded-xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] hover:border-[#D9603B] hover:shadow-md flex flex-col gap-3 transition-all cursor-pointer text-right"
            >
              <div className="flex items-center gap-3">
                <img
                  src={org.logo}
                  alt={org.orgName}
                  className="w-12 h-12 rounded-full object-cover border border-[#D9603B]/30"
                />
                <div className="flex flex-col overflow-hidden">
                  <div className="flex items-center gap-1">
                    <span className="font-cairo font-bold text-xs text-[#0A2E36] dark:text-[#F4EFE6] truncate">
                      {org.orgName}
                    </span>
                    {org.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#7CFFCB] shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500">
                    {org.tripsCount} رحلات منظمة
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                {org.description}
              </p>

              <div className="pt-2 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{org.rating.toFixed(1)}</span>
                </div>
                <span className="text-[#D9603B] text-[11px]">زيارة الصفحة ←</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
