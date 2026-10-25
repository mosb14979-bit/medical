import React from 'react';
import { Language } from '../types';
import { MessageSquare, Microscope, Activity, FileText, Shield, Terminal, ArrowRight, CheckCircle2 } from 'lucide-react';

interface DashboardViewProps {
  language: Language;
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ language, onNavigate }) => {
  const isAr = language === 'ar';

  const modules = [
    {
      id: 'chatbot',
      icon: MessageSquare,
      title: isAr ? 'المساعد الطبي الآلي' : 'Medical Chatbot',
      badge: 'RAG · MedlinePlus',
      desc: isAr
        ? 'استرجاع معلومات موثوقة من MedlinePlus ومنظمة الصحة العالمية مع توثيق المصادر وفرز حالات الطوارئ السريرية.'
        : 'Evidence-grounded health information from MedlinePlus and WHO with working source citations and red-flag emergency screening.',
    },
    {
      id: 'skin',
      icon: Microscope,
      title: isAr ? 'محلل آفات الجلد' : 'Skin Image Analyzer',
      badge: 'ISIC · HAM10000',
      desc: isAr
        ? 'تصنيف الآفات الجلدية وفق 7 فئات سريرية (الميلانوما، سرطان الخلايا القاعدية، الوحمات) مع تحذير من صور الهواتف غير المكبرة.'
        : 'HAM10000 7-class dermatoscopic classification (Melanoma, Basal Cell Carcinoma, Nevi) with mobile camera shift detection.',
    },
    {
      id: 'respiratory',
      icon: Activity,
      title: isAr ? 'محلل الأصوات التنفسية' : 'Respiratory Sound Analyzer',
      badge: 'ICBHI 2017 · 5 Classes',
      desc: isAr
        ? 'تحليل تسجيلات السماعة الطبية لرصد الصفير والفرقعة والصرير مع عرض المخطط الطيفي الترددي.'
        : 'ICBHI 2017 auscultation sound classifier detecting wheezes, crackles, and stridor with log-Mel spectrogram visual analysis.',
    },
    {
      id: 'lab',
      icon: FileText,
      title: isAr ? 'التعرف الضوئي على التحاليل' : 'Laboratory Report OCR',
      badge: 'Tesseract · Regex NLP',
      desc: isAr
        ? 'استخراج آلي لفحوصات الدم والتمثيل الغذائي باللغتين العربية والإنجليزية وتحديد القيم الخارجة عن المعدل الطبيعي.'
        : 'Bilingual English & Arabic OCR for CBC and metabolic panels, parsing values, units, reference intervals, and flags.',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Hero Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
            <span>LOCAL-FIRST MEDICAL INFORMATICS</span>
            <span aria-hidden="true">·</span>
            <span>BILINGUAL EN / AR</span>
            <span aria-hidden="true">·</span>
            <span>WINDOWS 11 READY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {isAr
              ? 'منصة المعلومات والأبحاث الطبية المتقدمة'
              : 'Clinical Information & Research Workspace'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            {isAr
              ? 'نظام معلوماتي طبي محلي يدمج 4 وحدات متخصصة: المساعد الذكي المدعم بالأدلة، محلل تنظير الجلد، مصنف الأصوات التنفسية، ونظام قراءة التقارير المخبرية. مصمم للتشغيل التام دون أي خوادم سحابية خارجية لحماية الخصوصية.'
              : 'A local-first medical informatics platform integrating four specialized modules: Grounded Medical Chatbot, Dermoscopic Skin Analyzer, Respiratory Auscultation Classifier, and Laboratory Report OCR. Designed for zero cloud dependency and strict privacy preservation.'}
          </p>
        </div>

        {/* System Readiness Strip */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-900">
                {isAr ? 'قاعدة بيانات SQLite محلية' : 'Local SQLite Database'}
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                ama_local.sqlite · Parameterized
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-900">
                {isAr ? 'بيئة PyTorch و معالجة الإشارات' : 'PyTorch & DSP Pipelines'}
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                ISIC & ICBHI Model Architectures
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-900">
                {isAr ? 'حزم Tesseract OCR ثنائية اللغة' : 'Bilingual Tesseract OCR'}
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                English (eng) & Arabic (ara) Packs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Module Cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            {isAr ? 'الوحدات التحليلية المتخصصة' : 'Core Analytical Modules'}
          </h2>
          <span className="text-xs font-mono text-slate-500">4 Modules Operational</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => onNavigate(m.id)}
                className="group bg-white border border-slate-200 hover:border-blue-500 rounded-xl p-6 transition-all duration-150 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-slate-100 text-blue-600 group-hover:bg-blue-50 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-slate-900 text-base">{m.title}</h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{m.desc}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                  <span>{isAr ? 'فتح الوحدة وبدء التحليل' : 'Launch Module Workspace'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Windows 11 Deployment Strip */}
      <section className="bg-slate-900 text-white rounded-xl p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-bold">
                {isAr ? 'جاهز للتشغيل على حاسوبك المحمول (Windows 11)' : 'Ready for Windows 11 Laptop Deployment'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isAr
                ? 'تم إنشاء جميع السكربتات المخصصة لويندوز 11 (SETUP.bat و RUN.bat و CHECK_SYSTEM.bat). يمكنك تنزيل المستودع وتشغيله بنقرة واحدة.'
                : 'Automated Windows 11 batch scripts (SETUP.bat, RUN.bat, and CHECK_SYSTEM.bat) are bundled in the repository. One-click setup creates the venv, installs pinned requirements, and launches the local server.'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('deployment')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap self-start md:self-auto cursor-pointer"
          >
            {isAr ? 'عرض ملفات التشغيل والتعليمات' : 'Inspect Windows 11 Scripts'}
          </button>
        </div>
      </section>
    </div>
  );
};
