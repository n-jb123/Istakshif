import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GOVERNORATES } from '../../data/mockData';
import { Settings, DollarSign, CreditCard, Clock, MapPin, Save, Check } from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { settings, updateSettings, showToast } = useApp();

  const [commissionPercent, setCommissionPercent] = useState(settings.commissionPercent);
  const [walletShamCash, setWalletShamCash] = useState(settings.walletShamCash);
  const [walletSyriatelCash, setWalletSyriatelCash] = useState(settings.walletSyriatelCash);
  const [supportWhatsapp, setSupportWhatsapp] = useState(settings.supportWhatsapp);
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [cancelLockHours, setCancelLockHours] = useState(settings.cancelLockHours);
  const [paymentHoldHours, setPaymentHoldHours] = useState(settings.paymentHoldHours);

  // Governorates active states
  const [govStates, setGovStates] = useState<Record<string, boolean>>(
    GOVERNORATES.reduce((acc, g) => ({ ...acc, [g.id]: g.isActive }), {})
  );

  const toggleGov = (id: string) => {
    setGovStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      commissionPercent,
      walletShamCash,
      walletSyriatelCash,
      supportWhatsapp,
      supportEmail,
      cancelLockHours,
      paymentHoldHours,
    });
  };

  return (
    <div className="flex flex-col gap-6 text-right pb-16 max-w-4xl">
      <div>
        <h1 className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
          إعدادات المنصة وحسابات الدفع
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          تعديل نسبة العمولة والعربون، حسابات المحافظ الإلكترونية، ونوافذ المهل الزمنية.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6 text-xs">
        {/* Financial & Wallets */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4">
          <h2 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6] flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#D9603B]" />
            <span>العمولة وحسابات استقبال الدفعات</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                نسبة عمولة المنصة (العربون %):
              </label>
              <input
                type="number"
                value={commissionPercent}
                onChange={e => setCommissionPercent(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 font-bold tabular-nums"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                رقم حساب شام كاش (Sham Cash):
              </label>
              <input
                type="text"
                value={walletShamCash}
                onChange={e => setWalletShamCash(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                رقم حساب سيرياتيل كاش (Syriatel Cash):
              </label>
              <input
                type="text"
                value={walletSyriatelCash}
                onChange={e => setWalletSyriatelCash(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Timings */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4">
          <h2 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6] flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span>المهل الزمنية وقواعد الإلغاء</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                نافذة إغلاق الإلغاء (ساعة قبل الانطلاق):
              </label>
              <input
                type="number"
                value={cancelLockHours}
                onChange={e => setCancelLockHours(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 font-bold tabular-nums"
              />
              <span className="text-[11px] text-gray-500 block mt-1">
                الافتراضي: 48 ساعة (لا يُقبل الإلغاء بعد ذلك).
              </span>
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                مهلة حجز المقعد بانتظار الدفع (ساعة):
              </label>
              <input
                type="number"
                value={paymentHoldHours}
                onChange={e => setPaymentHoldHours(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 font-bold tabular-nums"
              />
              <span className="text-[11px] text-gray-500 block mt-1">
                الافتراضي: 24 ساعة ثم يُلغى الحجز تلقائياً.
              </span>
            </div>
          </div>
        </div>

        {/* Governorates Enable/Disable Switches */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4">
          <h2 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-500" />
            <span>إدارة المحافظات السورية (تفعيل / تعطيل)</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {GOVERNORATES.map(gov => {
              const active = govStates[gov.id] !== false;
              return (
                <div
                  key={gov.id}
                  onClick={() => toggleGov(gov.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    active
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-[#7CFFCB]'
                      : 'border-gray-300 bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}
                >
                  <span className="font-bold">{gov.nameAr}</span>
                  <span className="text-[10px] font-bold">
                    {active ? 'مفعلة' : 'معطلة'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="self-start px-8 py-3 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold text-sm shadow-md transition-colors"
        >
          حفظ جميع إعدادات المنصة
        </button>
      </form>
    </div>
  );
};
