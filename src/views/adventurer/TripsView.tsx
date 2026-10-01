import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TripCard } from '../../components/adventurer/TripCard';
import { GOVERNORATES, NATURE_CATEGORIES_INFO } from '../../data/mockData';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  Calendar,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const TripsView: React.FC = () => {
  const { trips, pageParams } = useApp();

  const [searchText, setSearchText] = useState(pageParams.search || '');
  const [selectedFromGovs, setSelectedFromGovs] = useState<string[]>([]);
  const [selectedToGovs, setSelectedToGovs] = useState<string[]>([]);
  const [selectedNatures, setSelectedNatures] = useState<string[]>(
    pageParams.nature ? [pageParams.nature] : []
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(
    pageParams.difficulty || ''
  );
  const [onlyOffers, setOnlyOffers] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(350000);
  const [sortOption, setSortOption] = useState<'soonest' | 'cheapest' | 'highest_rated' | 'newest'>('soonest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Toggle helpers
  const toggleFromGov = (govId: string) => {
    setSelectedFromGovs(prev =>
      prev.includes(govId) ? prev.filter(id => id !== govId) : [...prev, govId]
    );
  };

  const toggleToGov = (govId: string) => {
    setSelectedToGovs(prev =>
      prev.includes(govId) ? prev.filter(id => id !== govId) : [...prev, govId]
    );
  };

  const toggleNature = (catId: string) => {
    setSelectedNatures(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const resetAllFilters = () => {
    setSearchText('');
    setSelectedFromGovs([]);
    setSelectedToGovs([]);
    setSelectedNatures([]);
    setSelectedDifficulty('');
    setOnlyOffers(false);
    setMaxPrice(350000);
  };

  const hasActiveFilters =
    searchText ||
    selectedFromGovs.length > 0 ||
    selectedToGovs.length > 0 ||
    selectedNatures.length > 0 ||
    selectedDifficulty ||
    onlyOffers ||
    maxPrice < 350000;

  // Filter & Sort Logic
  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      // Search
      if (searchText.trim()) {
        const query = searchText.toLowerCase();
        const matchTitle = trip.title.toLowerCase().includes(query);
        const matchDesc = trip.description.toLowerCase().includes(query);
        const matchOrg = trip.organizerName.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchOrg) return false;
      }

      // From Gov
      if (selectedFromGovs.length > 0 && !selectedFromGovs.includes(trip.fromGovernorateId)) {
        return false;
      }

      // To Gov
      if (selectedToGovs.length > 0 && !selectedToGovs.includes(trip.toGovernorateId)) {
        return false;
      }

      // Nature
      if (selectedNatures.length > 0) {
        const hasMatch = trip.categories.some(c => selectedNatures.includes(c));
        if (!hasMatch) return false;
      }

      // Difficulty
      if (selectedDifficulty && trip.difficulty !== selectedDifficulty) {
        return false;
      }

      // Offers
      if (onlyOffers && !trip.discountPrice) {
        return false;
      }

      // Price
      const effectivePrice = trip.discountPrice || trip.pricePerPerson;
      if (effectivePrice > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Featured priority
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;

      if (sortOption === 'cheapest') {
        const priceA = a.discountPrice || a.pricePerPerson;
        const priceB = b.discountPrice || b.pricePerPerson;
        return priceA - priceB;
      }
      if (sortOption === 'highest_rated') {
        return b.organizerRating - a.organizerRating;
      }
      if (sortOption === 'soonest') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      return 0;
    });
  }, [
    trips,
    searchText,
    selectedFromGovs,
    selectedToGovs,
    selectedNatures,
    selectedDifficulty,
    onlyOffers,
    maxPrice,
    sortOption,
  ]);

  return (
    <div className="flex flex-col gap-6 pb-16 text-right">
      {/* Top Search Bar */}
      <div className="w-full bg-white dark:bg-[#123F49] rounded-2xl border border-[#E4DCCF] dark:border-[#1C4F5B] p-3 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="ابحث باسم الرحلة، المحافظة، أو المنظم..."
            className="w-full h-11 pr-10 pl-4 rounded-xl bg-[#F6F1EA]/60 dark:bg-[#0A2E36]/60 border border-[#E4DCCF] dark:border-[#1C4F5B] text-sm text-[#0A2E36] dark:text-[#F4EFE6] focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
          />
          <Search className="w-5 h-5 text-gray-400 absolute right-3 top-3" />
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden h-11 px-4 rounded-xl bg-[#D9603B] text-white font-bold text-xs flex items-center gap-1.5 shrink-0"
        >
          <Filter className="w-4 h-4" />
          <span>تصفية</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-[#7CFFCB]" />
          )}
        </button>
      </div>

      {/* Main Grid: Filters Sidebar (Desktop) + Results Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* DESKTOP FILTERS SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-5 p-5 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#D9603B]" />
              <h3 className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
                تصفية النتائج
              </h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-[#D9603B] hover:underline"
              >
                مسح الكل
              </button>
            )}
          </div>

          {/* From Governorate (Grid of multi-select buttons) */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-xs text-[#0A2E36] dark:text-[#F4EFE6]">
              من محافظة (الانطلاق):
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
              {GOVERNORATES.map(gov => {
                const active = selectedFromGovs.includes(gov.id);
                return (
                  <button
                    key={gov.id}
                    type="button"
                    onClick={() => toggleFromGov(gov.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#D9603B] text-white shadow-xs'
                        : 'bg-[#F6F1EA] dark:bg-[#0A2E36] text-gray-700 dark:text-gray-300 hover:bg-[#E4DCCF]'
                    }`}
                  >
                    {gov.nameAr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* To Governorate (Grid of multi-select buttons) */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60">
            <span className="font-bold text-xs text-[#0A2E36] dark:text-[#F4EFE6]">
              إلى محافظة (الوجهة):
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
              {GOVERNORATES.map(gov => {
                const active = selectedToGovs.includes(gov.id);
                return (
                  <button
                    key={gov.id}
                    type="button"
                    onClick={() => toggleToGov(gov.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#D9603B] text-white shadow-xs'
                        : 'bg-[#F6F1EA] dark:bg-[#0A2E36] text-gray-700 dark:text-gray-300 hover:bg-[#E4DCCF]'
                    }`}
                  >
                    {gov.nameAr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nature Categories */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60">
            <span className="font-bold text-xs text-[#0A2E36] dark:text-[#F4EFE6]">
              نوع الطبيعة:
            </span>
            <div className="flex flex-col gap-1.5">
              {NATURE_CATEGORIES_INFO.map(cat => (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedNatures.includes(cat.id)}
                    onChange={() => toggleNature(cat.id)}
                    className="w-3.5 h-3.5 rounded text-[#D9603B] accent-[#D9603B]"
                  />
                  <span>{cat.nameAr}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60">
            <span className="font-bold text-xs text-[#0A2E36] dark:text-[#F4EFE6]">
              الصعوبة:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: '', label: 'الكل' },
                { id: 'easy', label: 'سهل' },
                { id: 'medium', label: 'متوسط' },
                { id: 'hard', label: 'صعب' },
              ].map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDifficulty(d.id)}
                  className={`py-1 text-xs rounded-lg font-bold border transition-colors ${
                    selectedDifficulty === d.id
                      ? 'border-[#D9603B] bg-[#D9603B] text-white'
                      : 'border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA] dark:bg-[#0A2E36] text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6]">أقصى سعر:</span>
              <span className="font-bold text-[#D9603B] tabular-nums">
                {maxPrice.toLocaleString()} ل.س
              </span>
            </div>
            <input
              type="range"
              min={50000}
              max={350000}
              step={10000}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              aria-label="أقصى سعر بالليرة السورية"
              className="w-full accent-[#D9603B] cursor-pointer"
            />
          </div>

          {/* Only Offers Switch */}
          <div className="pt-2 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60">
            <label className="flex items-center gap-2 text-xs font-bold text-[#0A2E36] dark:text-[#F4EFE6] cursor-pointer">
              <input
                type="checkbox"
                checked={onlyOffers}
                onChange={e => setOnlyOffers(e.target.checked)}
                className="w-4 h-4 rounded text-[#D9603B] accent-[#D9603B]"
              />
              <span>عرض الرحلات المخفضة فقط (🔥)</span>
            </label>
          </div>
        </aside>

        {/* RESULTS AREA */}
        <main className="lg:col-span-3 flex flex-col gap-4">
          {/* Active Chips & Sort Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#0A2E36] dark:text-[#F4EFE6]">
                النتائج ({filteredTrips.length} رحلة)
              </span>

              {/* Chips */}
              {selectedDifficulty && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#D9603B]/10 text-[#D9603B] font-bold">
                  <span>الصعوبة: {selectedDifficulty}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDifficulty('')} />
                </span>
              )}

              {onlyOffers && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#7CFFCB]/20 text-emerald-800 dark:text-[#7CFFCB] font-bold">
                  <span>عروض فقط</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setOnlyOffers(false)} />
                </span>
              )}

              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-[#D9603B] hover:underline mr-1"
                >
                  مسح الكل
                </button>
              )}
            </div>

            {/* Sort Options verbatim from D6 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 shrink-0">الترتيب:</span>
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value as any)}
                aria-label="ترتيب النتائج"
                className="h-8 px-2.5 text-xs font-bold rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA] dark:bg-[#0A2E36] text-[#0A2E36] dark:text-[#F4EFE6] focus:outline-none"
              >
                <option value="soonest">الأقرب موعداً</option>
                <option value="cheapest">الأرخص</option>
                <option value="highest_rated">الأعلى تقييماً</option>
                <option value="newest">الأحدث</option>
              </select>
            </div>
          </div>

          {/* Cards Grid: 3 columns on desktop, 1 column on mobile */}
          {filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            /* Friendly Empty State with Contour Illustration verbatim */
            <div className="relative p-10 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] text-center flex flex-col items-center justify-center gap-4 overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-[#D9603B]/10 text-[#D9603B] flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-cairo font-bold text-lg text-[#0A2E36] dark:text-[#F4EFE6]">
                  «لا توجد رحلات مطابقة.»
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mt-1">
                  جرب تغيير خيارات التصفية أو توسيع نطاق البحث في محافظات أخرى للاستمتاع برحلات استكشافية جديدة.
                </p>
              </div>
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-5 py-2.5 rounded-xl bg-[#D9603B] text-white font-bold text-xs shadow-sm hover:bg-[#C04E2B] transition-colors"
              >
                مسح جميع الفلاتر وعرض الكل
              </button>
            </div>
          )}

          {/* Load More Button (Section 7.2) */}
          {filteredTrips.length > 0 && (
            <div className="mt-4 flex flex-col items-center justify-center gap-2">
              <p className="text-xs text-gray-500">
                عرض {filteredTrips.length} من {trips.length} رحلة
              </p>
              <button
                type="button"
                className="px-6 py-2 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-white dark:bg-[#123F49] hover:bg-gray-50 dark:hover:bg-[#0A2E36] text-xs font-bold text-[#0A2E36] dark:text-[#F4EFE6] transition-colors"
              >
                عرض المزيد من الرحلات
              </button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM SHEET FOR FILTERS */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-h-[85vh] bg-white dark:bg-[#123F49] rounded-t-2xl p-6 overflow-y-auto flex flex-col gap-5 text-right animate-in slide-in-from-bottom-8 duration-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCF] dark:border-[#1C4F5B]">
              <h3 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
                تصفية الرحلات
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* From Governorate */}
            <div className="flex flex-col gap-2">
              <span className="font-bold text-xs text-[#0A2E36] dark:text-[#F4EFE6]">
                من محافظة:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {GOVERNORATES.map(gov => (
                  <button
                    key={gov.id}
                    type="button"
                    onClick={() => toggleFromGov(gov.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      selectedFromGovs.includes(gov.id)
                        ? 'bg-[#D9603B] text-white'
                        : 'bg-[#F6F1EA] dark:bg-[#0A2E36] text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {gov.nameAr}
                  </button>
                ))}
              </div>
            </div>

            {/* To Governorate */}
            <div className="flex flex-col gap-2">
              <span className="font-bold text-xs text-[#0A2E36] dark:text-[#F4EFE6]">
                إلى محافظة:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {GOVERNORATES.map(gov => (
                  <button
                    key={gov.id}
                    type="button"
                    onClick={() => toggleToGov(gov.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      selectedToGovs.includes(gov.id)
                        ? 'bg-[#D9603B] text-white'
                        : 'bg-[#F6F1EA] dark:bg-[#0A2E36] text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {gov.nameAr}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 pt-3 border-t border-[#E4DCCF] dark:border-[#1C4F5B]">
              <button
                type="button"
                onClick={resetAllFilters}
                className="w-1/3 h-11 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] text-xs font-bold text-gray-600 dark:text-gray-300"
              >
                مسح الكل
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-2/3 h-11 rounded-xl bg-[#D9603B] text-white font-bold text-sm shadow-md"
              >
                تطبيق النتائج ({filteredTrips.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
