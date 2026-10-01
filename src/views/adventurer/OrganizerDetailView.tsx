import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TripCard } from '../../components/adventurer/TripCard';
import { GOVERNORATES } from '../../data/mockData';
import {
  CheckCircle2,
  Star,
  Calendar,
  MapPin,
  Flag,
  ArrowRight,
  Shield,
  Compass,
} from 'lucide-react';

export const OrganizerDetailView: React.FC = () => {
  const { organizers, trips, pageParams, navigate, showToast } = useApp();

  const orgId = pageParams.id || 'org-1';
  const organizer = organizers.find(o => o.id === orgId) || organizers[0];

  const [activeTab, setActiveTab] = useState<'trips' | 'ratings'>('trips');

  // Trips by this organizer
  const orgTrips = trips.filter(t => t.organizerId === organizer.id);

  return (
    <div className="flex flex-col gap-6 pb-20 text-right">
      {/* Back button */}
      <button
        onClick={() => navigate('organizers')}
        className="flex items-center gap-1 text-xs font-bold text-[#D9603B] hover:underline self-start"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة لدليل المنظمين</span>
      </button>

      {/* Organizer Header Card */}
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs">
        {/* Cover with topographic overlay */}
        <div className="relative h-44 sm:h-56 w-full bg-[#0A2E36] overflow-hidden">
          {organizer.coverImage ? (
            <img
              src={organizer.coverImage}
              alt={organizer.orgName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full contour-pattern-dark opacity-30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Small Report Button (Section 7.10) */}
          <button
            onClick={() => showToast('تم إرسال بلاغك لمراجعة إدارة المنصة.', 'warning')}
            className="absolute top-4 left-4 p-2 rounded-xl bg-black/40 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-xs text-xs flex items-center gap-1 transition-colors"
            title="أبلغ عن هذا المنظم"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">إبلاغ الإدارة</span>
          </button>
        </div>

        {/* Profile info section */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 sm:-mt-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white dark:bg-[#123F49] p-1 shadow-lg shrink-0">
              <img
                src={organizer.logo}
                alt={organizer.orgName}
                className="w-full h-full rounded-xl object-cover"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="font-cairo font-bold text-xl sm:text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
                  {organizer.orgName}
                </h1>
                {organizer.verified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-[#7CFFCB]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    موثّق رسمياً
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-500">
                    غير موثّق
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed mt-1">
                {organizer.description}
              </p>
            </div>
          </div>
        </div>

        {/* Numbers Strip verbatim from Section 7.10 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 p-4 text-xs text-center divide-x divide-x-reverse divide-[#E4DCCF]/60 dark:divide-[#1C4F5B]/60 bg-[#F6F1EA]/40 dark:bg-[#0A2E36]/30">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-gray-500">التقييم العام</span>
            <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span>{organizer.rating.toFixed(1)} / 5</span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-gray-500">الرحلات المنفذة</span>
            <span className="font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6] tabular-nums">
              {organizer.tripsCount} رحلة
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-gray-500">نطاق المحافظات</span>
            <span className="font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6] tabular-nums">
              {organizer.governorates.length} محافظات
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-gray-500">تاريخ الانضمام</span>
            <span className="font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
              {organizer.joinedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs: الرحلات القادمة / التقييمات */}
      <div className="flex items-center gap-2 border-b border-[#E4DCCF] dark:border-[#1C4F5B] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('trips')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'trips'
              ? 'bg-[#D9603B] text-white shadow-xs'
              : 'bg-white dark:bg-[#123F49] text-gray-600 dark:text-gray-300'
          }`}
        >
          الرحلات القادمة ({orgTrips.length})
        </button>
        <button
          onClick={() => setActiveTab('ratings')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'ratings'
              ? 'bg-[#D9603B] text-white shadow-xs'
              : 'bg-white dark:bg-[#123F49] text-gray-600 dark:text-gray-300'
          }`}
        >
          تقييمات المغامرين
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'trips' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {orgTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col gap-4 text-xs">
          <h3 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
            آراء المغامرين الذين شاركوا مع هذا المنظم
          </h3>
          <div className="p-4 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/40 border border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6]">عمر التاجي</span>
              <div className="flex text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              «فريق محترف ودقيق جداً في المواعيد، الإسعافات الأولية كانت جاهزة والاهتمام بجميع المشاركين ملموس طوال الرحلة.»
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
