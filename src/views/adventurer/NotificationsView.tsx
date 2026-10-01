import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, Calendar, CreditCard, AlertTriangle, ArrowRight } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationsAsRead, navigate } = useApp();

  return (
    <div className="flex flex-col gap-6 pb-20 text-right max-w-3xl mx-auto">
      <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCF] dark:border-[#1C4F5B]">
        <div>
          <h1 className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
            الإشعارات
          </h1>
          <span className="text-xs text-gray-500">
            تنبيهات الحجوزات، تأكيدات الدفع، وتحديثات الرحلات.
          </span>
        </div>

        <button
          onClick={markNotificationsAsRead}
          className="text-xs font-bold text-[#D9603B] hover:underline flex items-center gap-1"
        >
          <CheckCheck className="w-4 h-4" />
          <span>تعليم الكل كمقروء</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {notifications.map(notif => (
          <div
            key={notif.id}
            onClick={() => {
              if (notif.linkPage && notif.linkId) {
                navigate(notif.linkPage, { id: notif.linkId });
              }
            }}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
              !notif.read
                ? 'bg-white dark:bg-[#123F49] border-[#D9603B]/60 shadow-xs'
                : 'bg-[#F6F1EA]/50 dark:bg-[#0A2E36]/50 border-[#E4DCCF] dark:border-[#1C4F5B] opacity-80'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                notif.type === 'payment'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                  : notif.type === 'booking'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-[#7CFFCB]'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
              }`}
            >
              {notif.type === 'payment' && <CreditCard className="w-4 h-4" />}
              {notif.type === 'booking' && <Calendar className="w-4 h-4" />}
              {notif.type === 'strike' && <AlertTriangle className="w-4 h-4" />}
              {notif.type === 'system' && <Bell className="w-4 h-4" />}
            </div>

            <div className="flex-1 flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0A2E36] dark:text-[#F4EFE6]">
                  {notif.title}
                </span>
                <span className="text-[10px] text-gray-400">{notif.date}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {notif.body}
              </p>
            </div>

            {!notif.read && (
              <span className="w-2 h-2 rounded-full bg-[#D9603B] shrink-0 mt-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
