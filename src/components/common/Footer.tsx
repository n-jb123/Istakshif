import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle, Mail, Send, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="w-full bg-[#EFE9DF] dark:bg-[#072329] border-t border-[#E4DCCF] dark:border-[#1C4F5B] text-[#0A2E36] dark:text-[#F4EFE6] transition-colors duration-200 mt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Wordmark & Social */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D9603B] text-white flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-cairo font-bold text-xl tracking-tight">استكشف</span>
            </div>
            <p className="text-xs text-[#0A2E36]/70 dark:text-[#F4EFE6]/70 leading-relaxed">
              المنصة السورية الأولى للربط بين منظمي الرحلات والمغامرين الشباب عبر كافة المحافظات السورية.
            </p>
            {/* Social channels (placeholders) */}
            <div className="flex items-center gap-3 pt-2 text-[#0A2E36]/70 dark:text-[#F4EFE6]/70">
              <a
                href="#whatsapp"
                onClick={(e) => { e.preventDefault(); }}
                className="w-9 h-9 rounded-lg bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] flex items-center justify-center hover:text-[#D9603B] transition-colors"
                title="واتساب"
                aria-label="واتساب"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="#telegram"
                onClick={(e) => { e.preventDefault(); }}
                className="w-9 h-9 rounded-lg bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] flex items-center justify-center hover:text-[#D9603B] transition-colors"
                title="تيليغرام"
                aria-label="تيليغرام"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="#email"
                onClick={(e) => { e.preventDefault(); }}
                className="w-9 h-9 rounded-lg bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] flex items-center justify-center hover:text-[#D9603B] transition-colors"
                title="البريد الإلكتروني"
                aria-label="البريد الإلكتروني"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
              روابط سريعة
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              <button
                onClick={() => navigate('trips')}
                className="text-right text-[#0A2E36]/70 dark:text-[#F4EFE6]/70 hover:text-[#D9603B] transition-colors"
              >
                استكشف الرحلات
              </button>
              <button
                onClick={() => navigate('organizers')}
                className="text-right text-[#0A2E36]/70 dark:text-[#F4EFE6]/70 hover:text-[#D9603B] transition-colors"
              >
                دليل المنظمين الموثقين
              </button>
              <button
                onClick={() => navigate('upgrade-organizer')}
                className="text-right text-[#D9603B] font-bold hover:underline"
              >
                أصبح منظماً معنا
              </button>
            </div>
          </div>

          {/* Col 3: Support & Help */}
          <div className="flex flex-col gap-3">
            <h4 className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
              الدعم والمساعدة
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              <button
                onClick={() => navigate('faq')}
                className="text-right text-[#0A2E36]/70 dark:text-[#F4EFE6]/70 hover:text-[#D9603B] transition-colors"
              >
                الأسئلة الشائعة
              </button>
              <button
                onClick={() => navigate('contact')}
                className="text-right text-[#0A2E36]/70 dark:text-[#F4EFE6]/70 hover:text-[#D9603B] transition-colors"
              >
                تواصل معنا
              </button>
              <button
                onClick={() => navigate('cancellation')}
                className="text-right text-[#0A2E36]/70 dark:text-[#F4EFE6]/70 hover:text-[#D9603B] transition-colors"
              >
                سياسة الإلغاء والاسترجاع
              </button>
            </div>
          </div>

          {/* Col 4: Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="font-cairo font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
              السياسات والشروط
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              <button
                onClick={() => navigate('terms')}
                className="text-right text-[#0A2E36]/70 dark:text-[#F4EFE6]/70 hover:text-[#D9603B] transition-colors"
              >
                الشروط والأحكام
              </button>
              <button
                onClick={() => navigate('privacy')}
                className="text-right text-[#0A2E36]/70 dark:text-[#F4EFE6]/70 hover:text-[#D9603B] transition-colors"
              >
                سياسة الخصوصية
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#E4DCCF] dark:border-[#1C4F5B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#0A2E36]/60 dark:text-[#F4EFE6]/60">
          <p>جميع الحقوق محفوظة © استكشف 2026. طين وبترول ونبض الوطن.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              منصة سورية مستقلة 100%
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
