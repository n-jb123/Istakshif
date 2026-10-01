import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Star } from 'lucide-react';

export const RateTripModal: React.FC = () => {
  const { rateModalBooking, closeRateModal, submitRating, showToast } = useApp();
  const [tripStars, setTripStars] = useState<number>(5);
  const [orgStars, setOrgStars] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  if (!rateModalBooking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('يرجى كتابة بضع كلمات تصف تجربتك للمساعدة في تحسين الجودة.', 'warning');
      return;
    }
    submitRating(rateModalBooking.tripId, tripStars, orgStars, comment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-lg bg-white dark:bg-[#123F49] rounded-t-2xl sm:rounded-2xl border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-2xl p-6 flex flex-col gap-5 text-right animate-in slide-in-from-bottom-6 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCF]/50 dark:border-[#1C4F5B]/50">
          <div>
            <h3 className="font-cairo font-bold text-lg text-[#0A2E36] dark:text-[#F4EFE6]">
              قيّم الرحلة والتنظيم
            </h3>
            <span className="text-[11px] text-gray-500">
              «ينتهي وقت التقييم بعد 3 أيام من الرحلة»
            </span>
          </div>
          <button
            onClick={closeRateModal}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-xs">
          {/* Trip rating */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-[#0A2E36] dark:text-[#F4EFE6] text-sm">
              قيّم مسار وبرنامج الرحلة:
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setTripStars(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= tripStars ? 'fill-amber-400' : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
              <span className="font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6] mr-2">
                {tripStars} / 5
              </span>
            </div>
          </div>

          {/* Organizer rating */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-[#0A2E36] dark:text-[#F4EFE6] text-sm">
              قيّم أداء والتزام المنظم:
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setOrgStars(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= orgStars ? 'fill-amber-400' : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
              <span className="font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6] mr-2">
                {orgStars} / 5
              </span>
            </div>
          </div>

          {/* Text comment */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-[#0A2E36] dark:text-[#F4EFE6]">
              اكتب تعليقك وتجربتك <span className="text-red-500">*</span>:
            </label>
            <textarea
              required
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="شارك رأيك الصريح حول البرنامج، التنظيم، الطعام، والسلامة..."
              rows={3}
              className="w-full p-3 text-xs rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/40 dark:bg-[#0A2E36]/40 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
            />
          </div>

          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 text-[11px] leading-relaxed">
            • تقييمك يظهر للعامة لمساعدة المغامرين، ولا يمكن للمنظم حذفه أو الرد عليه.
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={closeRateModal}
              className="w-1/3 h-10 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] font-bold text-gray-600 dark:text-gray-300"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="w-2/3 h-10 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold shadow-md transition-colors"
            >
              إرسال التقييم
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
