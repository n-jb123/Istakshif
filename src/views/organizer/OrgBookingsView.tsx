import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Phone, Calendar, Search, Filter } from 'lucide-react';

export const OrgBookingsView: React.FC = () => {
  const { bookings, trips } = useApp();
  const [selectedTripFilter, setSelectedTripFilter] = useState<string>('all');
  const [searchName, setSearchName] = useState<string>('');

  const filtered = bookings.filter(b => {
    if (selectedTripFilter !== 'all' && b.tripId !== selectedTripFilter) return false;
    if (searchName.trim()) {
      const matchTrip = b.tripTitle.toLowerCase().includes(searchName.toLowerCase());
      const matchComp = b.companions.some(c => c.name.toLowerCase().includes(searchName.toLowerCase()));
      if (!matchTrip && !matchComp) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 text-right pb-16">
      <div>
        <h1 className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
          سجل الحجوزات والمشاركين
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          تفاصيل المغامرين والمرافقين المسجلين في رحلاتك وأرقام التواصل المؤكدة.
        </p>
      </div>

      {/* Filter bar */}
      <div className="p-3 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col sm:flex-row items-center gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            placeholder="ابحث باسم المشترك أو اسم الرحلة..."
            className="w-full h-10 pr-9 pl-3 rounded-xl bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 border border-[#E4DCCF] dark:border-[#1C4F5B] focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedTripFilter}
            onChange={e => setSelectedTripFilter(e.target.value)}
            aria-label="اختر الرحلة"
            className="w-full h-10 px-3 rounded-xl bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 border border-[#E4DCCF] dark:border-[#1C4F5B] font-bold focus:outline-none"
          >
            <option value="all">كافة الرحلات</option>
            {trips.map(t => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table / Cards */}
      <div className="rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 flex items-center justify-between text-xs font-bold">
          <span>قائمة المسجلين ({filtered.length} حجز)</span>
          <span className="text-[#D9603B]">
            إجمالي المقاعد: {filtered.reduce((acc, c) => acc + c.seatsCount, 0)} مقعد
          </span>
        </div>

        <div className="divide-y divide-[#E4DCCF]/60 dark:divide-[#1C4F5B]/60">
          {filtered.map(b => (
            <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
                    {b.companions[0]?.name || 'المغامر'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D9603B]/10 text-[#D9603B]">
                    {b.seatsCount} مقاعد
                  </span>
                  <span className="text-gray-400 font-mono text-[11px]">#{b.id}</span>
                </div>

                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  الرحلة: {b.tripTitle}
                </span>

                {/* Companions details with ages */}
                <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 pt-1">
                  <span>المرافقون:</span>
                  {b.companions.map((comp, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#F6F1EA] dark:bg-[#0A2E36] text-gray-700 dark:text-gray-300">
                      {comp.name} ({comp.age} سنة)
                    </span>
                  ))}
                </div>
              </div>

              {/* Status and Phone */}
              <div className="flex sm:flex-col sm:items-end justify-between items-center gap-1.5 shrink-0">
                <span className="font-bold text-emerald-600 dark:text-[#7CFFCB]">
                  المتبقي للدفع باليد: {b.remainingToOrganizer.toLocaleString()} ل.س
                </span>
                <span className="text-[11px] text-gray-500 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>0988776655</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
