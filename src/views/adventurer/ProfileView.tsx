import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SyriaMap } from '../../components/adventurer/SyriaMap';
import { TripCard } from '../../components/adventurer/TripCard';
import {
  User,
  Phone,
  Calendar,
  Lock,
  Award,
  Heart,
  Briefcase,
  Share2,
  CheckCircle2,
  MapPin,
  Compass,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, trips, favorites, navigate, showToast, pageParams } = useApp();

  const [activeTab, setActiveTab] = useState<'info' | 'achievements' | 'favorites'>(
    pageParams.tab || 'info'
  );

  const [phone, setPhone] = useState(user.phone);
  const [birthDate, setBirthDate] = useState(user.birthDate);
  const [emergencyContact, setEmergencyContact] = useState(user.emergencyContact || '');

  const favoriteTrips = trips.filter(t => favorites.includes(t.id));

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('تم حفظ التعديلات على ملفك الشخصي بنجاح.', 'success');
  };

  const handleShareAchievements = () => {
    navigator.clipboard.writeText(
      `أنا مستكشف سوري زرت ${user.visitedGovernorates.length} محافظات عبر منصة استكشف! 🇸🇾`
    );
    showToast('تم نسخ بطاقة إنجازاتك لمشاركتها مع أصدقائك!', 'success');
  };

  return (
    <div className="flex flex-col gap-6 pb-20 text-right max-w-4xl mx-auto">
      {/* Profile Header Strip */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#D9603B] bg-[#D9603B]/20 flex items-center justify-center text-[#D9603B] text-2xl font-bold">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{user.name.slice(0, 1)}</span>
            )}
          </div>
          <div>
            <h1 className="font-cairo font-bold text-xl text-[#0A2E36] dark:text-[#F4EFE6]">
              {user.name}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D9603B]/10 text-[#D9603B]">
                مغامر نشط
              </span>
            </div>
          </div>
        </div>

        {/* Numbers Strip (trips, governorates, badges) */}
        <div className="flex items-center gap-4 sm:gap-6 text-center text-xs divide-x divide-x-reverse divide-[#E4DCCF] dark:divide-[#1C4F5B]">
          <div className="px-2">
            <span className="font-bold text-lg text-[#0A2E36] dark:text-[#F4EFE6] tabular-nums">4</span>
            <span className="text-[11px] text-gray-500 block">رحلات منفذة</span>
          </div>
          <div className="px-2">
            <span className="font-bold text-lg text-[#D9603B] tabular-nums">
              {user.visitedGovernorates.length} / 14
            </span>
            <span className="text-[11px] text-gray-500 block">محافظات مستكشفة</span>
          </div>
          <div className="px-2">
            <span className="font-bold text-lg text-[#7CFFCB] tabular-nums">
              {user.badges.length}
            </span>
            <span className="text-[11px] text-gray-500 block">أوسمة مكتسبة</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E4DCCF] dark:border-[#1C4F5B] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'info'
              ? 'bg-[#D9603B] text-white shadow-xs'
              : 'bg-white dark:bg-[#123F49] text-gray-600 dark:text-gray-300'
          }`}
        >
          معلوماتي الشخصية
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'achievements'
              ? 'bg-[#D9603B] text-white shadow-xs'
              : 'bg-white dark:bg-[#123F49] text-gray-600 dark:text-gray-300'
          }`}
        >
          إنجازاتي وخريطة سوريا
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'favorites'
              ? 'bg-[#D9603B] text-white shadow-xs'
              : 'bg-white dark:bg-[#123F49] text-gray-600 dark:text-gray-300'
          }`}
        >
          المفضلة ({favoriteTrips.length})
        </button>
      </div>

      {/* TAB 1: Personal Info */}
      {activeTab === 'info' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-6 text-xs">
          <form onSubmit={handleSaveInfo} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                  الاسم الكامل:
                </label>
                <input
                  type="text"
                  disabled
                  value={user.name}
                  className="w-full h-10 px-3 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                  البريد الإلكتروني:
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full h-10 px-3 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                  رقم الهاتف (للتواصل أثناء الحجز):
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="09xxxxxxxx"
                  className="w-full h-10 px-3 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B] tabular-nums"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                  تاريخ الميلاد (للتحقق من الفئات العمرية):
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                  رقم جهة الاتصال في حالات الطوارئ (اختياري):
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={e => setEmergencyContact(e.target.value)}
                  placeholder="مثال: 0944112233 (الأخ أو الوالد)"
                  className="w-full h-10 px-3 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#D9603B] text-white font-bold hover:bg-[#C04E2B] transition-colors"
              >
                حفظ التغييرات
              </button>

              <button
                type="button"
                onClick={() => navigate('upgrade-organizer')}
                className="px-4 py-2.5 rounded-xl border border-[#D9603B] text-[#D9603B] font-bold hover:bg-[#D9603B]/10 transition-colors flex items-center gap-1.5"
              >
                <Briefcase className="w-4 h-4" />
                <span>ترقية حسابي إلى منظم رحلات</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Achievements & Syria Map (Section 7.17) */}
      {activeTab === 'achievements' && (
        <div className="flex flex-col gap-6">
          {/* Syria Map */}
          <SyriaMap visitedGovIds={user.visitedGovernorates} />

          {/* Badges strip */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
                الأوسمة والشارات المكتسبة
              </h3>
              <button
                onClick={handleShareAchievements}
                className="text-xs font-bold text-[#D9603B] hover:underline flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة بطاقة الإنجاز</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {user.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/40 border border-[#E4DCCF] dark:border-[#1C4F5B] flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#D9603B]/10 text-[#D9603B] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6] block">
                      {badge}
                    </span>
                    <span className="text-[10px] text-gray-500">تم الإنجاز بنجاح</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Favorites */}
      {activeTab === 'favorites' && (
        <div>
          {favoriteTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoriteTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] text-center flex flex-col items-center justify-center gap-3 text-xs">
              <Heart className="w-10 h-10 text-gray-300" />
              <h4 className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
                لا توجد رحلات في المفضلة حالياً
              </h4>
              <p className="text-gray-500">
                انقر على أيقونة القلب على أي رحلة لحفظها والرجوع إليها بسهولة.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
