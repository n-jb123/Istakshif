import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GOVERNORATES } from '../../data/mockData';
import {
  Briefcase,
  Upload,
  CheckCircle2,
  AlertCircle,
  Shield,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const UpgradeOrganizerView: React.FC = () => {
  const { user, submitUpgradeOrganizer, navigate } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Info
  const [orgName, setOrgName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGovs, setSelectedGovs] = useState<string[]>(['damascus', 'rif_dimashq']);

  // Step 2: Verification
  const [contactPhone, setContactPhone] = useState(user.phone || '0988776655');
  const [socialLink, setSocialLink] = useState('');
  const [idUploaded, setIdUploaded] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);

  // Step 3: Terms
  const [termsAccepted, setTermsAccepted] = useState(false);

  const toggleGov = (id: string) => {
    setSelectedGovs(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitUpgradeOrganizer({
      orgName: orgName || 'فريق استكشاف الشام',
      description: description || 'تنظيم رحلات ومسارات جبلية واستكشافية.',
      phone: contactPhone,
      governorates: selectedGovs,
    });
    setStep(4);
  };

  return (
    <div className="flex flex-col gap-6 pb-20 text-right max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCF] dark:border-[#1C4F5B]">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#D9603B] text-white flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-cairo font-bold text-xl text-[#0A2E36] dark:text-[#F4EFE6]">
              ترقية الحساب إلى منظم رحلات
            </h1>
            <span className="text-[11px] text-gray-500">
              انضم لشبكة منظمي الرحلات المعتمدين وانشر رحلاتك لآلاف المغامرين.
            </span>
          </div>
        </div>

        {step < 4 && (
          <span className="text-xs font-bold text-[#D9603B]">
            الخطوة {step} من 3
          </span>
        )}
      </div>

      {/* Stepper Progress */}
      {step < 4 && (
        <div className="h-1.5 w-full bg-[#E4DCCF] dark:bg-[#1C4F5B] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D9603B] transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      )}

      {/* STEP 1: Organization Info */}
      {step === 1 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-5 text-xs">
          <h2 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
            1. بيانات الفريق أو الجهة المنظمة
          </h2>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
              اسم الفريق أو المؤسسة المنظمة <span className="text-red-500">*</span>:
            </label>
            <input
              type="text"
              required
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              placeholder="مثال: فريق قاسيون للمغامرات"
              className="w-full h-11 px-3.5 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
              نبذة تعريفية عن نشاطكم وخبرتكم <span className="text-red-500">*</span>:
            </label>
            <textarea
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="اكتب نبذة عن تاريخ تأسيس الفريق، نوع الرحلات التي تنظمونها (هايكنج، أثرية، بحرية...)"
              className="w-full p-3 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-200 mb-2">
              المحافظات التي تنشطون فيها (يمكن اختيار أكثر من محافظة) <span className="text-red-500">*</span>:
            </label>
            <div className="flex flex-wrap gap-2">
              {GOVERNORATES.map(gov => {
                const active = selectedGovs.includes(gov.id);
                return (
                  <button
                    key={gov.id}
                    type="button"
                    onClick={() => toggleGov(gov.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      active
                        ? 'bg-[#D9603B] text-white shadow-xs'
                        : 'bg-[#F6F1EA] dark:bg-[#0A2E36] text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {gov.nameAr}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-[#D9603B] text-white font-bold hover:bg-[#C04E2B] transition-colors"
            >
              التالي: التحقق والوثائق
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Verification Documents */}
      {step === 2 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-5 text-xs">
          <h2 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
            2. إثبات الهوية والنشاط السابق
          </h2>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
              رقم هاتف المنظم الرئيسي (للتواصل مع الإدارة) <span className="text-red-500">*</span>:
            </label>
            <input
              type="tel"
              required
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B] tabular-nums"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
              رابط صفحة الفريق السابقة على فيسبوك أو إنستغرام:
            </label>
            <input
              type="url"
              value={socialLink}
              onChange={e => setSocialLink(e.target.value)}
              placeholder="https://facebook.com/your-team"
              className="w-full h-11 px-3.5 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
            />
          </div>

          {/* ID photo with hint verbatim */}
          <div>
            <label className="block font-bold text-[#0A2E36] dark:text-[#F4EFE6] mb-1">
              صورة الهوية الشخصية <span className="text-red-500">*</span>:
            </label>
            <p className="text-[11px] text-gray-500 mb-2">
              «تظهر للأدمن فقط ولا تُعرض لأي مستخدم.»
            </p>
            <div
              onClick={() => setIdUploaded(true)}
              className={`p-5 rounded-xl border-2 border-dashed text-center cursor-pointer transition-colors ${
                idUploaded
                  ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-[#E4DCCF] dark:border-[#1C4F5B] hover:border-[#D9603B]'
              }`}
            >
              {idUploaded ? (
                <div className="flex flex-col items-center gap-1 text-emerald-600 dark:text-[#7CFFCB]">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="font-bold">تم رفع صورة الهوية (national_id.jpg)</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-gray-500">
                  <Upload className="w-6 h-6 text-[#D9603B]" />
                  <span className="font-bold">انقر أو اسحب لرفع صورة الهوية</span>
                </div>
              )}
            </div>
          </div>

          {/* Activity Proofs */}
          <div>
            <label className="block font-bold text-[#0A2E36] dark:text-[#F4EFE6] mb-1">
              صور من رحلات سابقة نفذها الفريق:
            </label>
            <div
              onClick={() => setProofUploaded(true)}
              className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition-colors ${
                proofUploaded
                  ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-[#E4DCCF] dark:border-[#1C4F5B] hover:border-[#D9603B]'
              }`}
            >
              {proofUploaded ? (
                <span className="font-bold text-emerald-600 dark:text-[#7CFFCB]">
                  تم اختيار 3 صور لأنشطة سابقة
                </span>
              ) : (
                <span className="text-gray-500">انقر لاختيار صور تثبت نشاط الفريق</span>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] font-bold text-gray-600"
            >
              السابق
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-[#D9603B] text-white font-bold hover:bg-[#C04E2B] transition-colors"
            >
              التالي: الشروط والإرسال
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review and Acceptance */}
      {step === 3 && (
        <form onSubmit={handleFinalSubmit} className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-5 text-xs">
          <h2 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6]">
            3. مراجعة الطلب والموافقة على ميثاق المنظمين
          </h2>

          <div className="p-4 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/50 border border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col gap-2">
            <p className="font-bold text-[#0A2E36] dark:text-[#F4EFE6]">قواعد وشروط عمل المنظم في استكشف:</p>
            <p>• تخضع أول 3 رحلات ينشئها المنظم الجديد لمراجعة إدارة المنصة وتأكيدها قبل النشر.</p>
            <p>• يحصل المنظم على الشارة الموثقة (موثّق ✅) تلقائياً بعد تنفيذ أول 3 رحلات ناجحة بدون سترايك.</p>
            <p>• إلغاء الرحلة من قبل المنظم يترتب عليه تسجيل تحذير (سترايك)، وعند الوصول إلى 3 تحذيرات يتم حظر الحساب.</p>
            <p>• يلتزم المنظم بالسلامة الميدانية للمشاركين وحسن معاملة المغامرين والالتزام بمواعيد البرنامج المعلن.</p>
          </div>

          <label className="flex items-start gap-2.5 font-bold text-[#0A2E36] dark:text-[#F4EFE6] cursor-pointer">
            <input
              type="checkbox"
              required
              checked={termsAccepted}
              onChange={e => setTermsAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#D9603B] accent-[#D9603B]"
            />
            <span>أوافق على ميثاق المنظمين وشروط المنصة وأتعهد بصحة الوثائق المرفوعة.</span>
          </label>

          <div className="flex justify-between pt-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] font-bold text-gray-600"
            >
              السابق
            </button>
            <button
              type="submit"
              disabled={!termsAccepted}
              className={`px-6 py-2.5 rounded-xl font-bold transition-colors ${
                termsAccepted
                  ? 'bg-[#D9603B] text-white hover:bg-[#C04E2B]'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              إرسال طلب التوثيق للمراجعة
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Under Review Status Screen (Section 8.1 verbatim) */}
      {step === 4 && (
        <div className="p-8 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs text-center flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
            <Clock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-cairo font-bold text-xl text-[#0A2E36] dark:text-[#F4EFE6]">
              «حسابك قيد المراجعة. سنراسلك بعد التحقق.»
            </h2>
            <p className="text-xs text-gray-500 max-w-md mt-2 leading-relaxed">
              يقوم فريق إدارة استكشف بمطابقة صورة الهوية والأوراق ومراجعة صفحات النشاط السابق للتأكد من السلامة والمصداقية. ستتلقى إشعاراً خلال 24 ساعة.
            </p>
          </div>

          <div className="flex gap-3 mt-3">
            <button
              onClick={() => navigate('profile')}
              className="px-5 py-2.5 rounded-xl bg-[#D9603B] text-white font-bold text-xs"
            >
              العودة إلى الملف الشخصي
            </button>
            <button
              onClick={() => navigate('home')}
              className="px-5 py-2.5 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] text-xs font-bold text-gray-600 dark:text-gray-300"
            >
              تصفح المنصة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
