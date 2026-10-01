import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HelpCircle, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const OrgQuestionsView: React.FC = () => {
  const { trips, answerQuestion } = useApp();

  const [activeTab, setActiveTab] = useState<'unanswered' | 'answered'>('unanswered');
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  // Flatten all questions with their trip info
  const allQuestions = trips.flatMap(t =>
    t.questions.map(q => ({
      ...q,
      tripTitle: t.title,
    }))
  );

  const unanswered = allQuestions.filter(q => !q.answer);
  const answered = allQuestions.filter(q => !!q.answer);

  const displayList = activeTab === 'unanswered' ? unanswered : answered;

  const handleSendReply = (tripId: string, questionId: string) => {
    const text = replyTexts[questionId];
    if (!text || !text.trim()) return;
    answerQuestion(tripId, questionId, text);
    setReplyTexts(prev => ({ ...prev, [questionId]: '' }));
  };

  return (
    <div className="flex flex-col gap-6 text-right pb-16 max-w-4xl">
      <div>
        <h1 className="font-cairo font-bold text-2xl text-[#0A2E36] dark:text-[#F4EFE6]">
          الأسئلة والاستفسارات العامة
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          «سيظهر جوابك لجميع الزوار» على صفحة الرحلة. تنبيه: يُمنع كتابة أرقام الهواتف أو الروابط الخارجية.
        </p>
      </div>

      {/* Warning banner verbatim from Section 8.8 */}
      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          تنبيه المنصة: تجنب كتابة أرقام الهواتف في الإجابات؛ تظهر بيانات التواصل تلقائياً للمغامرين بعد تأكيد دفع العربون.
        </span>
      </div>

      {/* Tabs: بلا رد (default) / تمت الإجابة */}
      <div className="flex items-center gap-2 border-b border-[#E4DCCF] dark:border-[#1C4F5B] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('unanswered')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'unanswered'
              ? 'bg-[#D9603B] text-white shadow-xs'
              : 'bg-white dark:bg-[#123F49] text-gray-600 dark:text-gray-300'
          }`}
        >
          بلا رد ({unanswered.length})
        </button>
        <button
          onClick={() => setActiveTab('answered')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'answered'
              ? 'bg-[#D9603B] text-white shadow-xs'
              : 'bg-white dark:bg-[#123F49] text-gray-600 dark:text-gray-300'
          }`}
        >
          تمت الإجابة ({answered.length})
        </button>
      </div>

      {/* Questions list */}
      <div className="flex flex-col gap-4 text-xs">
        {displayList.length > 0 ? (
          displayList.map(q => (
            <div
              key={q.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] shadow-xs flex flex-col gap-3"
            >
              <div className="flex items-start justify-between pb-2 border-b border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60">
                <div>
                  <span className="font-bold text-[#D9603B] block">الرحلة: {q.tripTitle}</span>
                  <span className="text-[11px] text-gray-400">
                    السائل: {q.userName} · {q.date}
                  </span>
                </div>
                {!q.answer && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                    بانتظار الرد
                  </span>
                )}
              </div>

              <div className="font-bold text-sm text-[#0A2E36] dark:text-[#F4EFE6]">
                س: {q.question}
              </div>

              {q.answer ? (
                <div className="p-3 rounded-xl bg-[#F6F1EA] dark:bg-[#0A2E36]/40 border border-[#E4DCCF] dark:border-[#1C4F5B]">
                  <span className="font-bold text-[#D9603B] block mb-1">إجابتك المنشورة للجميع:</span>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{q.answer}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <textarea
                    value={replyTexts[q.id] || ''}
                    onChange={e =>
                      setReplyTexts(prev => ({ ...prev, [q.id]: e.target.value }))
                    }
                    placeholder="اكتب إجابتك الشافية للمغامر..."
                    rows={2}
                    className="w-full p-3 rounded-xl border border-[#E4DCCF] dark:border-[#1C4F5B] bg-[#F6F1EA]/40 dark:bg-[#0A2E36]/40 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
                  />
                  <button
                    onClick={() => handleSendReply(q.tripId, q.id)}
                    className="self-end px-5 py-2 rounded-xl bg-[#D9603B] hover:bg-[#C04E2B] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>نشر الإجابة</span>
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-10 rounded-2xl bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] text-center flex flex-col items-center justify-center gap-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            <span className="font-bold">لا توجد أسئلة في هذا القسم حالياً!</span>
          </div>
        )}
      </div>
    </div>
  );
};
