import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GOVERNORATES } from '../../data/mockData';
import { Eye, Save, AlertCircle, CheckCircle2, Star } from 'lucide-react';

export const OrgPublicPageView: React.FC = () => {
  const { organizers, showToast } = useApp();
  const org = organizers[0];

  const [name, setName] = useState(org.orgName);
  const [description, setDescription] = useState(org.description);
  const [selectedGovs, setSelectedGovs] = useState<string[]>(org.governorates);

  const toggleGov = (id: string) => {
    setSelectedGovs(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('تم حفظ تحديثات صفحتك العامة بنجاح.', 'success');
  };

  return (
    <div className="flex flex-col gap-6 text-right pb-16">
      <div>
        <h1 className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
          تعديل صفحتي العامة
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          قم بتحديث الوصف والمحافظات وصورة الغلاف لتعزيز ثقة المغامرين بفريقك.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* EDIT FORM */}
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-5 text-xs">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
              اسم الفريق أو الجهة المنظمة:
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
            />
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
              ملاحظة: تعديل اسم الفريق يتطلب مراجعة واعتماد المشرف لحماية المصداقية.
            </p>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
              الوصف التعريفي بالفريق:
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-200 mb-2">
              محافظات النشاط:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {GOVERNORATES.map(gov => (
                <button
                  key={gov.id}
                  type="button"
                  onClick={() => toggleGov(gov.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedGovs.includes(gov.id)
                      ? 'bg-[#D9603B] text-white shadow-xs'
                      : 'bg-[#F6F1EA] dark:bg-[#0A2E36] text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {gov.nameAr}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 mt-2 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold text-sm shadow-md transition-colors"
          >
            حفظ التغييرات
          </button>
        </form>

        {/* LIVE PREVIEW OF PUBLIC PROFILE */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
            <Eye className="w-4 h-4 text-[#D9603B]" />
            <span>معاينة حية كما يراها المغامرون:</span>
          </div>

          <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-lg">
            <div className="h-32 bg-[#0A2E36] relative overflow-hidden">
              {org.coverImage && (
                <img src={org.coverImage} alt="Cover" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="px-5 pb-5 pt-0 -mt-10 relative flex flex-col gap-3 text-xs">
              <div className="flex items-end gap-3">
                <img
                  src={org.logo}
                  alt={name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-[#123F49] shadow-md"
                />
                <div className="mb-1">
                  <h3 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
                    {name}
                  </h3>
                  <span className="text-[11px] text-emerald-600 dark:text-[#7CFFCB] font-bold">
                    موثّق رسمياً ✅
                  </span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                {description}
              </p>

              <div className="pt-2 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{org.rating.toFixed(1)} / 5</span>
                </div>
                <span className="text-gray-500">{org.tripsCount} رحلة منفذة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
