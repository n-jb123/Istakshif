import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GOVERNORATES } from '../../data/mockData';
import {
  Search,
  CheckCircle2,
  Star,
  Compass,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const OrganizersView: React.FC = () => {
  const { organizers, navigate } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedGov, setSelectedGov] = useState('');

  const filteredOrganizers = organizers.filter(org => {
    if (searchTerm.trim()) {
      const matchName = org.orgName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDesc = org.description.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchName && !matchDesc) return false;
    }
    if (verifiedOnly && !org.verified) return false;
    if (selectedGov && !org.governorates.includes(selectedGov)) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 pb-16 text-right">
      <div>
        <h1 className="font-cairo font-bold text-2xl sm:text-3xl text-[#0A2E36] dark:text-[#F4EFE6]">
          دليل منظمي الرحلات
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          فرق ومجموعات سياحية مرخصة وموثقة لتنظيم المسارات والمغامرات في المحافظات السورية.
        </p>
      </div>

      {/* Filters bar */}
      <div className="p-3 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ابحث باسم الفريق أو المنظم..."
            className="w-full h-10 pr-9 pl-4 text-xs rounded-xl bg-[#F6F1EA]/60 dark:bg-[#0A2E36]/60 border border-[#E4DCCF] dark:border-[#1C4F5B] focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={selectedGov}
            onChange={e => setSelectedGov(e.target.value)}
            aria-label="اختر المحافظة"
            className="w-full h-10 px-3 text-xs font-semibold rounded-xl bg-[#F6F1EA]/60 dark:bg-[#0A2E36]/60 border border-[#E4DCCF] dark:border-[#1C4F5B] focus:outline-none"
          >
            <option value="">كافة المحافظات</option>
            {GOVERNORATES.map(gov => (
              <option key={gov.id} value={gov.id}>
                {gov.nameAr}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-xs font-bold text-[#0A2E36] dark:text-[#F4EFE6] cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={e => setVerifiedOnly(e.target.checked)}
            className="w-4 h-4 rounded text-[#D9603B] accent-[#D9603B]"
          />
          <span>الموثقون فقط (✅)</span>
        </label>
      </div>

      {/* 3 Columns Desktop, 1 Column Mobile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrganizers.map(org => (
          <div
            key={org.id}
            onClick={() => navigate('organizer-detail', { id: org.id })}
            className="p-5 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs hover:border-[#D9603B] hover:shadow-md transition-all flex flex-col justify-between gap-4 cursor-pointer"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={org.logo}
                  alt={org.orgName}
                  className="w-14 h-14 rounded-full object-cover border border-[#D9603B]/30 shrink-0"
                />
                <div className="flex flex-col overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6] truncate">
                      {org.orgName}
                    </h3>
                    {org.verified ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#7CFFCB] shrink-0" />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold shrink-0">غير موثّق</span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500 mt-0.5">
                    {org.tripsCount} رحلة منفذة
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                {org.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {org.governorates.slice(0, 3).map(gid => (
                  <span
                    key={gid}
                    className="px-2 py-0.5 rounded text-[10px] bg-[#F6F1EA] dark:bg-[#0A2E36] text-gray-600 dark:text-gray-300 font-semibold"
                  >
                    {GOVERNORATES.find(g => g.id === gid)?.nameAr}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span>{org.rating.toFixed(1)}</span>
              </div>
              <span className="text-[#D9603B] hover:underline">
                استعراض الرحلات ←
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
