import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  Mail,
  MessageCircle,
  FileText,
  Shield,
  RotateCcw,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface StaticPagesProps {
  pageType: 'faq' | 'contact' | 'terms' | 'privacy' | 'cancellation';
}

export const StaticPagesView: React.FC<StaticPagesProps> = ({ pageType }) => {
  const { showToast, settings } = useApp();

  // FAQ state
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const faqs = [
    {
      q: 'كيف يعمل نظام الدفع وحجز المقاعد في منصة استكشف؟',
      a: 'الدفع الإلكتروني عبر المنصة يقتصر على العربون فقط (وهو مساوٍ لعمولة المنصة 10%) ويتم تحويله عبر شام كاش أو سيرياتيل كاش مع رفع صورة الإشعار. باقي سعر الرحلة (90%) يدفعه المغامر مباشرة للمنظم يوم انطلاق الرحلة.',
    },
    {
      q: 'ما هي سياسة إلغاء الحجز واسترجاع العربون للمغامر؟',
      a: 'يحق للمغامر إلغاء الحجز واسترجاع كامل العربون المدفوع طالما تم الإلغاء قبل أكثر من 48 ساعة من موعد انطلاق الرحلة. ولا يمكن الإلغاء قبل أقل من 48 ساعة حيث يعتبر العربون غير مسترد.',
    },
    {
      q: 'ماذا يحدث إذا لم يكتمل الحد الأدنى للمشاركين في الرحلة؟',
      a: 'إذا لم يكتمل الحد الأدنى للمشاركين حتى الموعد المحدد (قبل 72 ساعة)، يتم إلغاء الرحلة تلقائياً ويسترجع جميع المشتركين كامل العربون فوراً دون أن يترتب أي تحذير (سترايك) على المنظم.',
    },
    {
      q: 'متى تظهر لي بيانات التواصل مع المنظم ورابط مجموعة الواتساب؟',
      a: 'تظهر بيانات التواصل ورقم هاتف المنظم ورابط المجموعة فور قيام المشرف بمراجعة وتأكيد إشعار الدفع الخاص بك.',
    },
    {
      q: 'كيف تتم ترقية الحساب إلى منظم رحلات معتمد؟',
      a: 'من خلال الضغط على زر "ترقية إلى منظم" في الملف الشخصي وتعبئة استمارة التوثيق ورفع صورة الهوية وإثباتات النشاط السابق. بعد مراجعة الإدارة والموافقة، يمكنك البدء بإنشاء ونشر رحلاتك.',
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('شكراً لتواصلك! تم استلام رسالتك وسيرد فريق الدعم خلال ساعات.', 'success');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <div className="flex flex-col gap-8 pb-20 text-right max-w-3xl mx-auto">
      {/* FAQ PAGE */}
      {pageType === 'faq' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D9603B] text-white flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
                الأسئلة الشائعة
              </h1>
              <p className="text-xs text-gray-500">
                إجابات شاملة حول طرق الدفع، الإلغاء، والانضمام كمنظم.
              </p>
            </div>
          </div>

          {/* Search FAQ */}
          <div className="relative">
            <input
              type="text"
              value={faqSearch}
              onChange={e => setFaqSearch(e.target.value)}
              placeholder="ابحث في الأسئلة الشائعة..."
              className="w-full h-11 pr-10 pl-4 text-xs rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-white dark:bg-[#123F49] focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
          </div>

          <div className="flex flex-col gap-3">
            {faqs
              .filter(f => f.q.includes(faqSearch) || f.a.includes(faqSearch))
              .map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-white dark:bg-[#123F49] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 flex items-center justify-between text-xs font-bold text-[#0A2E36] dark:text-[#F4EFE6] text-right"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#D9603B]" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-[#E4DCCF]/50 dark:border-[#1C4F5B]/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* CONTACT PAGE */}
      {pageType === 'contact' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D9603B] text-white flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
                تواصل معنا
              </h1>
              <p className="text-xs text-gray-500">
                فريق دعم استكشف جاهز لمساعدتكم والإجابة على أي استفسارات.
              </p>
            </div>
          </div>

          {/* WhatsApp Direct Support Box */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                  دعم واتساب المباشر
                </span>
                <span className="text-gray-600 dark:text-gray-300 text-[11px]">
                  متاح يومياً من 09:00 ص حتى 09:00 م: {settings.supportWhatsapp}
                </span>
              </div>
            </div>
            <a
              href="https://wa.me/963988776655"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
            >
              مراسلة عبر واتساب
            </a>
          </div>

          {/* Form */}
          <form
            onSubmit={handleContactSubmit}
            className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4 text-xs"
          >
            <h3 className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
              أرسل رسالة لفريق المنصة
            </h3>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                الاسم الكامل <span className="text-red-500">*</span>:
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                البريد الإلكتروني <span className="text-red-500">*</span>:
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
                نص الرسالة أو الشكوى <span className="text-red-500">*</span>:
              </label>
              <textarea
                required
                value={contactMessage}
                onChange={e => setContactMessage(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-lg border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold text-sm shadow-md transition-colors"
            >
              إرسال الرسالة
            </button>
          </form>
        </div>
      )}

      {/* TERMS OF USE */}
      {pageType === 'terms' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4 text-xs leading-relaxed">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E4DCCF] dark:border-[#1C4F5B]">
            <FileText className="w-5 h-5 text-[#D9603B]" />
            <h1 className="font-cairo font-bold text-xl text-[#0A2E36] dark:text-[#F4EFE6]">
              الشروط والأحكام
            </h1>
          </div>
          <p>
            أهلاً بكم في منصة "استكشف". تُعد المنصة وسيطاً تقنياً ينظم ويربط بين منظمي الرحلات الموثقين والشباب الراغبين في استكشاف المحافظات السورية.
          </p>
          <h4 className="font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">1. مسؤولية السلامة</h4>
          <p>
            يتحمل المنظم كامل المسؤولية الميدانية والتنظيمية عن سلامة المغامرين والالتزام بمسار الرحلة وتوفير أدوات الإسعاف الأولي والإرشاد اللازم.
          </p>
          <h4 className="font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">2. الحجوزات والعربون</h4>
          <p>
            تعتبر حجوزات المقاعد مؤكدة فقط بعد دفع العربون عبر المحافظ المعتمدة ومطابقة الإشعار من قبل الإدارة.
          </p>
          <h4 className="font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">3. السلوك العام</h4>
          <p>
            يُمنع أي سلوك مخل أو مسيء للبيئة أو المعالم الأثرية، وتلتزم المجموعات بالمحافظة على نظافة الأماكن الطبيعية في سوريا.
          </p>
        </div>
      )}

      {/* PRIVACY POLICY */}
      {pageType === 'privacy' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4 text-xs leading-relaxed">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E4DCCF] dark:border-[#1C4F5B]">
            <Shield className="w-5 h-5 text-[#D9603B]" />
            <h1 className="font-cairo font-bold text-xl text-[#0A2E36] dark:text-[#F4EFE6]">
              سياسة الخصوصية
            </h1>
          </div>
          <p>
            نحرص في "استكشف" على حماية سرية بيانات المستخدمين والمغامرين والمنظمين وفق أعلى معايير الأمان الرقمي.
          </p>
          <h4 className="font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">1. وثائق الهوية الشخصية</h4>
          <p>
            تُحفظ صور الهويات الشخصية في مساحات تخزين خاصة ومشفرة، وتظهر حصرياً لمشرفي المنصة لأغراض التحقق والتوثيق، ولا تُعرض لأي طرف ثالث.
          </p>
          <h4 className="font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">2. أرقام الهواتف والتواصل</h4>
          <p>
            لا تظهر أرقام الهواتف الخاصة بالمنظمين أو المغامرين في الصفحات العامة للموقع، وتُفتح بيانات التواصل فقط بين الطرفين بعد تأكيد الحجز الرسمي.
          </p>
        </div>
      )}

      {/* CANCELLATION & REFUND POLICY */}
      {pageType === 'cancellation' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-4 text-xs leading-relaxed">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E4DCCF] dark:border-[#1C4F5B]">
            <RotateCcw className="w-5 h-5 text-[#D9603B]" />
            <h1 className="font-cairo font-bold text-xl text-[#0A2E36] dark:text-[#F4EFE6]">
              سياسة الإلغاء والاسترجاع
            </h1>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 font-bold text-[#D9603B]">
            قاعدة الـ 48 ساعة الثابتة لضمان حقوق المنظمين والمغامرين على حد سواء.
          </div>
          <h4 className="font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">1. إلغاء المغامر</h4>
          <p>
            • إذا قام المغامر بإلغاء الحجز قبل أكثر من 48 ساعة من موعد انطلاق الرحلة، يسترد كامل مبلغ العربون المدفوع عبر نفس المحفظة التي حول منها خلال 24-48 ساعة.
          </p>
          <p>
            • «لا يمكن إلغاء الحجز قبل موعد الرحلة بأقل من 48 ساعة»، وفي هذه الحالة يبقى العربون للمنصة كتعويض لحجز المقعد.
          </p>
          <h4 className="font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">2. إلغاء المنظم</h4>
          <p>
            • إذا قام المنظم بإلغاء الرحلة، يسترد جميع المغامرين كامل مبالغ العربون فوراً بنسبة 100%، ويحصل المنظم على تحذير (سترايك).
          </p>
          <p>
            • في حالات القوة القاهرة (ظروف جوية قاهرة، انقطاع طرق)، يرفع المنظم الإثباتات لإدارة المنصة لإسقاط السترايك.
          </p>
          <h4 className="font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">3. عدم اكتمال العدد الأدنى</h4>
          <p>
            • في حال عدم بلوغ الحد الأدنى للمشاركين عند الموعد المحدد (قبل 72 ساعة)، تُعلق الرحلة وتُرد العرابين كاملة بدون تسجيل أي سترايك على المنظم.
          </p>
        </div>
      )}
    </div>
  );
};
