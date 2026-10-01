import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Phone,
  Shield,
  FileText,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';

export const AdminVerificationsView: React.FC = () => {
  const { organizers, approveVerificationAdmin, rejectVerificationAdmin } = useApp();

  const [callCompleted, setCallCompleted] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const pendingOrg = organizers[organizers.length - 1]; // Team to verify

  return (
    <div className="flex flex-col gap-6 text-right pb-16 max-w-4xl">
      <div>
        <h1 className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
          مراجعة طلبات توثيق المنظمين
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          فحص وثائق الهوية الشخصية المشفرة وإثباتات النشاط قبل اعتماد الشارة الموثقة (موثّق ✅).
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-6 text-xs">
        {/* Org header info */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60">
          <div className="flex items-center gap-3">
            <img
              src={pendingOrg.logo}
              alt={pendingOrg.orgName}
              className="w-14 h-14 rounded-2xl object-cover border border-[#D9603B]/30"
            />
            <div>
              <h2 className="font-cairo font-bold text-lg text-[#0A2E36] dark:text-[#F4EFE6]">
                {pendingOrg.orgName}
              </h2>
              <span className="text-gray-500">تاريخ تقديم الطلب: {pendingOrg.joinedDate}</span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            طلب توثيق جديد
          </span>
        </div>

        {/* Description & Contact Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/50 border border-[#E4DCCF] dark:border-[#1C4F5B]">
            <span className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
              النبذة التعريفية:
            </span>
            <p className="leading-relaxed text-gray-600 dark:text-gray-300">
              {pendingOrg.description}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/50 border border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col justify-between">
            <div>
              <span className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                رقم هاتف المنظم الرئيسي:
              </span>
              <span className="font-bold font-mono text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
                +963 988 776 655
              </span>
            </div>

            {/* Checkbox "تمت المكالمة" verbatim from Section 9 */}
            <label className="flex items-center gap-2 mt-3 text-xs font-bold text-[#D9603B] cursor-pointer">
              <input
                type="checkbox"
                checked={callCompleted}
                onChange={e => setCallCompleted(e.target.checked)}
                className="w-4 h-4 rounded text-[#D9603B] accent-[#D9603B]"
              />
              <span>تمت المكالمة الهاتفية مع المنظم للتحقق</span>
            </label>
          </div>
        </div>

        {/* ID Photo with Watermark "للمراجعة فقط" verbatim from Section 9 */}
        <div>
          <span className="font-bold text-gray-700 dark:text-gray-300 block mb-2">
            صورة الهوية الوطنية (خاص ومشفر):
          </span>
          <div className="relative aspect-16/9 max-h-64 rounded-xl overflow-hidden border border-[#E4DCCF] dark:border-[#1C4F5B] bg-black/20 flex items-center justify-center">
            <img
              src="/src/assets/images/syria_damascus_courtyard_1790855748446.jpg"
              alt="National ID"
              className="w-full h-full object-cover blur-xs"
            />
            {/* Watermark "للمراجعة فقط" */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="font-cairo font-bold text-3xl sm:text-4xl text-white/80 tracking-widest rotate-[-12deg] select-none border-2 border-dashed border-white/60 p-4 rounded-xl">
                للمراجعة فقط
              </span>
            </div>
          </div>
        </div>

        {/* Reject form if opened */}
        {showRejectForm && (
          <div className="p-4 rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/20 flex flex-col gap-2">
            <label className="font-bold text-red-700 dark:text-red-300">
              سبب رفض التوثيق (إلزامي):
            </label>
            <input
              type="text"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="مثال: صورة الهوية غير مقروءة، أو رقم الهاتف مغلق..."
              className="w-full h-10 px-3 rounded-lg border border-red-300 bg-white dark:bg-[#123F49] text-xs"
            />
            <button
              onClick={() => {
                if (!rejectReason.trim()) return;
                rejectVerificationAdmin(pendingOrg.id, rejectReason);
              }}
              className="self-end px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-xs"
            >
              تأكيد الرفض مع السبب
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 flex gap-3">
          <button
            onClick={() => setShowRejectForm(true)}
            className="w-1/3 h-11 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs"
          >
            رفض مع ذكر السبب
          </button>
          <button
            onClick={() => approveVerificationAdmin(pendingOrg.id)}
            className="w-2/3 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
          >
            اعتماد التوثيق ومنح الشارة الموثقة (موثّق ✅)
          </button>
        </div>
      </div>
    </div>
  );
};
