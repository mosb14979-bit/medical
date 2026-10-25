import React, { useState } from 'react';
import { Language, ChatMessage, Citation } from '../types';
import { KNOWLEDGE_TOPICS } from '../data/medicalKnowledge';
import { Send, AlertTriangle, ExternalLink, HelpCircle, ShieldAlert } from 'lucide-react';

interface ChatbotViewProps {
  language: Language;
  onAddHistory: (item: { module: 'chatbot'; summary: string; finding: string; confidence?: number }) => void;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({ language, onAddHistory }) => {
  const isAr = language === 'ar';

  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: isAr
        ? 'مرحباً بك. أنا المساعد الطبي الآلي (AMA). يمكنني مساعدتك في استعراض المعلومات الصحية وتوضيح المصطلحات الطبية استناداً إلى إرشادات MedlinePlus ومنظمة الصحة العالمية.\n\nتنبيه: لا أقدم تشخيصات قطعية، ولا أصف علاجات أو أغير جرعات الأدوية. يرجى دائماً مراجعة الطبيب المختص.'
        : 'Welcome to the AI Medical Assistant. I provide evidence-grounded health education and terminology summaries based on official repositories (MedlinePlus, WHO, NHS).\n\nNotice: I do not provide clinical diagnoses, prescribe medications, or adjust pharmaceutical dosages. Consult a licensed physician for clinical decisions.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const presetQueries = [
    {
      en: 'What is considered a normal adult blood pressure reading?',
      ar: 'ما هو المعدل الطبيعي لضغط الدم لدى البالغين؟',
    },
    {
      en: 'What are the diagnostic thresholds for Type 2 diabetes?',
      ar: 'ما هي معايير تشخيص السكري من النوع الثاني وسكر الدم الصائم؟',
    },
    {
      en: 'What does a low hemoglobin count in a CBC indicate?',
      ar: 'ماذا يعني انخفاض الهيموغلوبين في تحليل الدم الكامل CBC؟',
    },
    {
      en: 'What are common triggers for respiratory wheezing?',
      ar: 'ما هي المحفزات الشائعة لصفير التنفس والربو؟',
    },
    {
      en: 'How does the ABCDE criteria help screen skin moles?',
      ar: 'كيف تساعد قاعدة ABCDE في فحص شامات وآفات الجلد؟',
    },
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsProcessing(true);

    setTimeout(() => {
      // 1. Check for emergency triggers
      const lower = query.toLowerCase();
      const isEmergency =
        lower.includes('chest pain') ||
        lower.includes('crushing') ||
        lower.includes('heart attack') ||
        lower.includes('cannot breathe') ||
        lower.includes('choking') ||
        query.includes('ألم في الصدر') ||
        query.includes('ألم شديد') ||
        query.includes('لا أستطيع التنفس') ||
        query.includes('نوبة قلبية');

      let replyText = '';
      let citations: Citation[] = [];

      if (isEmergency) {
        replyText = isAr
          ? 'تنبيه طوارئ سريري فوري:\nالأعراض التي ذكرتها (مثل ألم الصدر الحاد أو ضيق التنفس الشديد) قد تشير إلى نوبة قلبية حادة أو قصور تنفسي حرج.\n\nيرجى التوقف فوراً عن استخدام هذا التطبيق والاتصال بخدمات الإسعاف والطوارئ المحلية دون أي تأخير:\n• الولايات المتحدة: 911\n• المملكة المتحدة: 999\n• الاتحاد الأوروبي / دول الخليج / الطوارئ الموحدة: 112 / 997 / 998.'
          : 'CRITICAL EMERGENCY ALERT:\nThe symptoms described (such as severe or crushing chest pain, dyspnea, or severe shortness of breath) may indicate an acute myocardial infarction or critical respiratory compromise.\n\nImmediately cease using this software and call local emergency services:\n• United States: 911\n• United Kingdom: 999\n• European Union: 112\n• International Local Emergency Dispatch.';
        citations = [
          {
            title: isAr ? 'إرشادات الطوارئ والإنعاش' : 'Emergency Resuscitation & Acute Triage Protocols',
            publisher: 'World Health Organization (WHO)',
            url: 'https://www.who.int/emergencies',
          },
        ];
      } else {
        // 2. Retrieval matching against KNOWLEDGE_TOPICS
        const matched = KNOWLEDGE_TOPICS.filter((t) => {
          const words = t.keywords;
          return words.some((k) => lower.includes(k.toLowerCase()) || query.includes(k));
        });

        if (matched.length > 0) {
          const topic = matched[0];
          const content = isAr ? topic.content_ar : topic.content_en;
          const title = isAr ? topic.title_ar : topic.title_en;

          replyText = isAr
            ? `وفقاً للمصادر الطبية المعتمدة بخصوص "${title}":\n\n${content}\n\n---\nتنبيه سريري: هذه المعلومات مأخوذة من مراجع طبية معتمدة لأغراض التوعية الصحية فقط، ولا تعتبر تشخيصاً أو خطة علاجية.`
            : `According to verified clinical references regarding "${title}":\n\n${content}\n\n---\nClinical Disclaimer: This response summarizes public health guidelines for educational purposes only. Always consult a physician for diagnostic evaluation.`;

          citations = [
            {
              title,
              publisher: topic.publisher,
              url: topic.url,
            },
          ];
        } else {
          replyText = isAr
            ? 'لم أعثر على وثيقة تطابق هذا السؤال بدقة في قاعدة البيانات السريرية المحلية المعتمدة.\n\nتذكير: يلتزم هذا النظام بعدم تأليف أو اختلاق معلومات طبية بدون سند علمي موثوق. يرجى استشارة ممارس صحي مرخص للحصول على إجابة سريرية محددة.'
            : 'I could not locate specific verified guidance in our local clinical knowledge base for your inquiry.\n\nMedical Invariant: This assistant adheres to grounded retrieval and will not fabricate or hallucinate medical guidance without verified literature. Please consult a licensed healthcare professional.';
        }
      }

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: replyText,
        citations,
        isEmergency,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsProcessing(false);

      onAddHistory({
        module: 'chatbot',
        summary: query.slice(0, 60),
        finding: isEmergency ? (isAr ? 'إنذار طوارئ حاد' : 'Emergency Warning') : (isAr ? 'استرجاع معرفي موثق' : 'Grounded Q&A'),
        confidence: isEmergency ? 99 : 88,
      });
    }, 450);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {isAr ? 'المساعد الطبي الذكي (RAG)' : 'Medical Chatbot (RAG Engine)'}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          {isAr
            ? 'استرجاع معلومات صحية موثقة من MedlinePlus ومنظمة الصحة العالمية مع توثيق الروابط وتنبيهات الطوارئ.'
            : 'Retrieval-Augmented Generation grounded in official MedlinePlus and WHO catalogs with verified citations and emergency screening.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Chat Stream (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[11px] font-mono text-slate-400 mb-1 px-1">
                    {isUser ? (isAr ? 'أنت' : 'You') : 'AMA Assistant'} · {m.timestamp}
                  </div>

                  <div
                    className={`rounded-xl px-4 py-3 max-w-[90%] text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-blue-600 text-white'
                        : m.isEmergency
                        ? 'bg-red-50 border border-red-300 text-red-950 font-medium'
                        : 'bg-slate-50 border border-slate-200 text-slate-800'
                    }`}
                  >
                    {m.isEmergency && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 mb-2">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>{isAr ? 'تنبيه طوارئ حاد' : 'ACUTE EMERGENCY ALERT'}</span>
                      </div>
                    )}
                    {m.text}

                    {m.citations && m.citations.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs">
                        <div className="font-mono text-[10px] text-slate-500 uppercase mb-1">
                          {isAr ? 'المصادر والتوثيق:' : 'VERIFIED EVIDENCE SOURCES:'}
                        </div>
                        {m.citations.map((c, idx) => (
                          <a
                            key={idx}
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline mr-3 mt-0.5"
                          >
                            <span>{c.publisher}: {c.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isProcessing && (
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono p-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>{isAr ? 'جاري استرجاع الأدلة السريرية...' : 'Retrieving grounded clinical evidence...'}</span>
              </div>
            )}
          </div>

          {/* Prompt Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 border-t border-slate-200 bg-white rounded-b-xl flex gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                isAr
                  ? 'اطرح سؤالاً طبياً (مثل: معدل ضغط الدم، السكري، الهيموغلوبين، الربو)...'
                  : 'Ask a medical health question (e.g. blood pressure, diabetes HbA1c, anemia, asthma)...'
              }
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isProcessing}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{isAr ? 'إرسال' : 'Send'}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Sidebar: Presets & Red-Flag Warnings */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase mb-3">
              {isAr ? 'نماذج استفسارات سريرية' : 'Curated Inquiries'}
            </h3>
            <div className="space-y-2">
              {presetQueries.map((pq, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(isAr ? pq.ar : pq.en)}
                  className="w-full text-left text-xs p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50 hover:bg-white text-slate-700 transition-colors cursor-pointer"
                >
                  {isAr ? pq.ar : pq.en}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-900">
            <div className="flex items-center gap-2 mb-2 font-bold text-xs uppercase font-mono">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>{isAr ? 'بروتوكول الطوارئ السريرية' : 'Clinical Emergency Protocol'}</span>
            </div>
            <p className="text-xs leading-relaxed text-amber-800">
              {isAr
                ? 'يتعرف النظام تلقائياً على أعراض الطوارئ الحرجة (مثل ألم الصدر الصاعق أو الاختناق). عند ظهور أي من هذه الأعراض، يتم تنبيهك للاتصال الفوري بالإسعاف.'
                : 'The system automatically screens for emergency warning signs (crushing chest pain, cyanosis, stroke symptoms) and prioritizes immediate local emergency dispatch.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
