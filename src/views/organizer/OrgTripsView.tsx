import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trip, TripStatus } from '../../types';
import {
  PlusCircle,
  MoreVertical,
  Edit,
  Copy,
  Users,
  Eye,
  AlertTriangle,
  ArrowUpCircle,
  Calendar,
  Search,
} from 'lucide-react';

export const OrgTripsView: React.FC = () => {
  const { trips, organizers, navigate, showToast } = useApp();

  const myOrg = organizers[0];
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'pending_review' | 'published' | 'completed' | 'cancelled'>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const myTrips = trips.filter(t => t.organizerId === myOrg.id);

  const filteredTrips = myTrips.filter(t => {
    if (activeTab === 'all') return true;
    return t.status === activeTab;
  });

  const getStatusBadge = (status: TripStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-[#7CFFCB]">
            منشورة للجمهور
          </span>
        );
      case 'pending_review':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            قيد المراجعة
          </span>
        );
      case 'draft':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            مسودة
          </span>
        );
      case 'full':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            مكتملة العدد
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300">
            ملغاة
          </span>
        );
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700">مكتملة</span>;
    }
  };

  const handleCopyTrip = (trip: Trip) => {
    showToast(`تم نسخ بيانات رحلة "${trip.title}" كقالب لرحلة جديدة.`, 'success');
    navigate('org-create-trip');
  };

  const handleCancelTrip = (trip: Trip) => {
    showToast(
      'تحذير: إلغاء الرحلة يترتب عليه تسجيل تحذير (سترايك) واسترجاع العربون كاملاً للمشتركين.',
      'danger'
    );
  };

  const handleRequestSeatIncrease = (trip: Trip) => {
    showToast('تم إرسال طلب زيادة سعة المقاعد للإشعار.', 'success');
  };

  return (
    <div className="flex flex-col gap-6 text-right pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
            إدارة رحلاتي
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            استعراض حالة الرحلات، تعديل المسارات، والاطلاع على أعداد المسجلين.
          </p>
        </div>

        <button
          onClick={() => navigate('org-create-trip')}
          className="h-11 px-5 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إنشاء رحلة جديدة</span>
        </button>
      </div>

      {/* Tabs verbatim from Section 8.3 */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#E4DCCF] dark:border-[#1C4F5B] pb-2 text-xs font-bold scrollbar-none">
        {[
          { id: 'all', label: 'الكل' },
          { id: 'draft', label: 'مسودات' },
          { id: 'pending_review', label: 'قيد المراجعة' },
          { id: 'published', label: 'منشورة' },
          { id: 'completed', label: 'مكتملة' },
          { id: 'cancelled', label: 'ملغاة' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-[#D9603B] text-white shadow-xs'
                : 'bg-white dark:bg-[#123F49] text-gray-600 dark:text-gray-300 border border-[#E4DCCF] dark:border-[#1C4F5B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs overflow-hidden">
        <table className="w-full text-right text-xs">
          <thead className="bg-[#F6F1EA] dark:bg-[#0A2E36] border-b border-[#E4DCCF] dark:border-[#1C4F5B] text-gray-600 dark:text-gray-300 font-bold">
            <tr>
              <th className="p-4">الرحلة</th>
              <th className="p-4">التاريخ</th>
              <th className="p-4">الحالة</th>
              <th className="p-4">المقاعد / الحد الأدنى</th>
              <th className="p-4">السعر</th>
              <th className="p-4 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4DCCF]/60 dark:divide-[#1C4F5B]/60">
            {filteredTrips.map(trip => (
              <tr key={trip.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={trip.images[0]}
                    alt={trip.title}
                    className="w-12 h-12 rounded-lg object-cover border border-[#E4DCCF] dark:border-[#1C4F5B]"
                  />
                  <div>
                    <span className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6] block">
                      {trip.title}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {trip.difficulty === 'easy' ? 'سهل' : trip.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-300 font-semibold">{trip.startDate}</td>
                <td className="p-4">{getStatusBadge(trip.status)}</td>
                <td className="p-4">
                  <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6]">
                    {trip.seatsTaken} من {trip.seatsTotal}
                  </span>
                  <span className="text-[11px] text-gray-500 block">
                    الحد الأدنى: {trip.minParticipants}
                  </span>
                </td>
                <td className="p-4 font-bold tabular-nums">
                  {trip.pricePerPerson.toLocaleString()} ل.س
                </td>
                <td className="p-4 text-center relative">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => navigate('trip-detail', { id: trip.id })}
                      className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"
                      title="معاينة الصفحة العامة"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopyTrip(trip)}
                      className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"
                      title="نسخ كقالب"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRequestSeatIncrease(trip)}
                      className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-[#D9603B]"
                      title="طلب زيادة المقاعد"
                    >
                      <ArrowUpCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCancelTrip(trip)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                      title="إلغاء الرحلة"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden flex flex-col gap-3">
        {filteredTrips.map(trip => (
          <div
            key={trip.id}
            className="p-4 rounded-xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col gap-3 text-xs"
          >
            <div className="flex items-start gap-3">
              <img
                src={trip.images[0]}
                alt={trip.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  {getStatusBadge(trip.status)}
                  <span className="font-bold tabular-nums">{trip.pricePerPerson.toLocaleString()} ل.س</span>
                </div>
                <h3 className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6] mt-1">
                  {trip.title}
                </h3>
                <span className="text-[11px] text-gray-500">{trip.startDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60">
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                المقاعد: {trip.seatsTaken} / {trip.seatsTotal} (الحد الأدنى: {trip.minParticipants})
              </span>
              <button
                onClick={() => navigate('trip-detail', { id: trip.id })}
                className="text-xs font-bold text-[#D9603B]"
              >
                معاينة الرحلة ←
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
