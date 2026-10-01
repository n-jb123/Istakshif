import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Eye, EyeOff, Lock, Mail, User, Compass } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authMode, closeAuthModal, loginUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(authMode);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(email || 'adventurer@istakshif.sy', 'adventurer');
  };

  const handleGoogleLogin = () => {
    loginUser('google_user@gmail.com', 'adventurer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md bg-white dark:bg-[#123F49] rounded-t-2xl sm:rounded-2xl border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-2xl p-6 sm:p-8 flex flex-col gap-6 animate-in slide-in-from-bottom-6 duration-200 text-right"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCF]/50 dark:border-[#1C4F5B]/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D9603B] text-white flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-cairo font-bold text-lg text-[#0A2E36] dark:text-[#F4EFE6]">
              {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب مغامر جديد'}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google sign in button (most prominent) */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 px-4 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-white dark:bg-[#0A2E36] hover:bg-gray-50 dark:hover:bg-[#072329] text-[#0A2E36] dark:text-[#F4EFE6] font-semibold text-sm flex items-center justify-center gap-3 transition-colors shadow-xs"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.25 21.34 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.13z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.66 1.26 6.58l4.02 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
            />
          </svg>
          <span>المتابعة عبر حساب Google</span>
        </button>

        {/* Separator "أو" */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E4DCCF] dark:border-[#1C4F5B] w-full" />
          <span className="bg-white dark:bg-[#123F49] px-3 text-xs text-gray-500 absolute font-medium">
            أو
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-[#0A2E36] dark:text-[#F4EFE6] mb-1.5">
                الاسم الكامل <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="مثال: كريم العلي"
                  className="w-full h-11 px-3.5 pr-10 text-sm rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
                />
                <User className="w-4 h-4 text-gray-400 absolute right-3 top-3.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#0A2E36] dark:text-[#F4EFE6] mb-1.5">
              البريد الإلكتروني <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 px-3.5 pr-10 text-sm rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#0A2E36] dark:text-[#F4EFE6]">
                كلمة المرور <span className="text-red-500">*</span>
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  className="text-xs text-[#D9603B] hover:underline"
                  onClick={() => alert('رابط إعادة تعيين كلمة المرور أُرسل إلى بريدك.')}
                >
                  نسيت كلمة السر؟
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-3.5 pr-10 pl-10 text-sm rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute left-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {mode === 'register' && (
              <p className="text-[11px] text-gray-500 mt-1">
                رقم الهاتف وتاريخ الميلاد يتم طلبهما فقط عند أول عملية حجز.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-11 mt-2 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold text-sm shadow-md transition-colors"
          >
            {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="pt-2 text-center text-xs text-[#0A2E36]/80 dark:text-[#F4EFE6]/80">
          {mode === 'login' ? (
            <p>
              ليس لديك حساب بعد؟{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-[#D9603B] hover:underline mr-1"
              >
                إنشاء حساب مغامر
              </button>
            </p>
          ) : (
            <p>
              لديك حساب بالفعل؟{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-[#D9603B] hover:underline mr-1"
              >
                تسجيل الدخول
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
