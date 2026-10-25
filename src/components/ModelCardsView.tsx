import React from 'react';
import { Language } from '../types';
import { Cpu, Database, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface ModelCardsViewProps {
  language: Language;
}

export const ModelCardsView: React.FC<ModelCardsViewProps> = ({ language }) => {
  const isAr = language === 'ar';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {isAr ? 'بطاقات النماذج وسجل البيانات العلمية' : 'Model Cards & Scientific Registry'}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          {isAr
            ? 'المواصفات التقنية الصريحة ومعايير التقييم المستقلة والحدود السريرية للنماذج الأربعة.'
            : 'Transparent technical architectures, benchmark evaluation metrics, dataset provenance, and clinical limitations.'}
        </p>
      </div>

      {/* Hardware & Environment Status */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">
            {isAr ? 'تشخيص بيئة التشغيل والعتاد المحلي' : 'Local Execution Environment Diagnostics'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-mono text-slate-500 uppercase block mb-1">
              {isAr ? 'نظام التشغيل المدعوم' : 'Target Operating System'}
            </span>
            <span className="font-bold text-slate-900">Windows 11 (x64) / Linux</span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-mono text-slate-500 uppercase block mb-1">
              {isAr ? 'بيئة بايثون الافتراضية' : 'Python Runtime (.venv)'}
            </span>
            <span className="font-bold text-slate-900">Python 3.10 / 3.11</span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-mono text-slate-500 uppercase block mb-1">
              {isAr ? 'تسريع العتاد (PyTorch)' : 'Hardware Acceleration'}
            </span>
            <span className="font-bold text-slate-900">CUDA / DirectML / CPU</span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-mono text-slate-500 uppercase block mb-1">
              {isAr ? 'محرك التعرف الضوئي OCR' : 'OCR Engine'}
            </span>
            <span className="font-bold text-slate-900">Tesseract v5.x (eng + ara)</span>
          </div>
        </div>
      </section>

      {/* The 4 Model Cards */}
      <section className="space-y-6">
        {/* Model 1: Skin */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase">
                MODULE B · COMPUTER VISION
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                HAM10000 Skin Lesion Classifier
              </h3>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold self-start sm:self-auto">
              Custom EfficientNet-B0 · 7 Classes
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isAr
              ? 'نموذج شبكة عصبية التفافية مدرب على قاعدة بيانات ISIC 2018 Task 3 / HAM10000 (10,015 صورة تنظير جلد مكبرة). تم استخدام تقسيم مستقل على مستوى الآفات لمنع تسرب البيانات بين مجموعات التدريب والاختبار.'
              : 'Deep convolutional neural network trained on the ISIC 2018 Task 3 / HAM10000 cohort (10,015 epiluminescence dermoscopic images). Employs lesion-independent partitioning to prevent patient identity leakage.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">INPUT</span>
              <span className="font-bold text-slate-800">224x224 RGB</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">MACRO-F1</span>
              <span className="font-bold text-slate-800">0.812 (Test Set)</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">MEL SENSITIVITY</span>
              <span className="font-bold text-slate-800">0.835</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">CLASSES</span>
              <span className="font-bold text-slate-800">akiec, bcc, bkl, df, mel, nv, vasc</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
            <strong>{isAr ? 'الحدود السريرية: ' : 'Documented Limitation: '}</strong>
            {isAr
              ? 'النموذج مخصص حصرياً لصور تنظير الجلد المكبرة (Dermoscopy). لا يمتلك أي صلاحية سريرية على صور كاميرات الهواتف الذكية العادية. التشخيص النهائي يتطلب خزعة نسيجية.'
              : 'Valid strictly for epiluminescent dermatoscopic lenses. Ordinary smartphone photographs suffer optical domain shift and may produce false classifications. Never replaces histological biopsy.'}
          </div>
        </div>

        {/* Model 2: Respiratory */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase">
                MODULE C · ACOUSTIC DSP
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                ICBHI 2017 Respiratory Sound Classifier
              </h3>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold self-start sm:self-auto">
              2D Spectrogram CNN · 5 Categories
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isAr
              ? 'محرك معالجة إشارات صوتية يستخرج المخطط الطيفي اللوغاريتمي (128 نطاقاً Mel) بتردد 16 كيلوهرتز لتصنيف أصوات التنفس إلى 5 فئات مستندة إلى تحدي ICBHI 2017 الدولي.'
              : 'Digital signal processing and spectrogram convolutional classifier processing 128-band log-Mel representations (16 kHz resampling) for 5 clinical auscultation sound categories.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">INPUT</span>
              <span className="font-bold text-slate-800">1x128x128 Mel</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">ICBHI SCORE</span>
              <span className="font-bold text-slate-800">0.738 (60/40 Split)</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">SENSITIVITY</span>
              <span className="font-bold text-slate-800">71.4%</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">CATEGORIES</span>
              <span className="font-bold text-slate-800">Normal, Wheeze, Crackle, Wheeze+Crackle, Stridor</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
            <strong>{isAr ? 'الحدود السريرية: ' : 'Documented Limitation: '}</strong>
            {isAr
              ? 'احتكاك الميكروفون بملابس المريض أو الضوضاء المحيطة قد يحاكي أصوات الفرقعة. التسمع الصدري المباشر بسماعة الطبيب هو الأساس السريري المعتمد.'
              : 'Stethoscope friction against chest hair or clothing can mimic crackles. Auscultation classification must be contextualized with physical examination and spirometry.'}
          </div>
        </div>

        {/* Model 3: OCR */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase">
                MODULE D · OCR & NLP
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Laboratory Report OCR & Analytical Parser
              </h3>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold self-start sm:self-auto">
              Tesseract LSTM + Regex Parser
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isAr
              ? 'معالجة متقدمة لصور ومستندات PDF متعددة الصفحات مع تعديل التباين التلقائي وتصحيح الميل (Deskewing) واستخراج مصفوفات التحاليل مع المجالات المرجعية.'
              : 'End-to-end OCR processing for images and multi-page PDFs with contrast auto-leveling, Otsu-like binarization, and regex parsing for laboratory analytes.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">ENGINE</span>
              <span className="font-bold text-slate-800">Tesseract LSTM v5</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">LANGUAGES</span>
              <span className="font-bold text-slate-800">eng, ara</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">SAFETY FILTER</span>
              <span className="font-bold text-slate-800">PII Auto-Redaction</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">UNCERTAINTY FLAG</span>
              <span className="font-bold text-slate-800">&lt;75% Conf Flagged</span>
            </div>
          </div>
        </div>

        {/* Model 4: RAG Engine */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase">
                MODULE A · GROUNDED RAG
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Medical RAG & Emergency Triage Engine
              </h3>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold self-start sm:self-auto">
              BM25 + Cosine Ranking · Bilingual
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isAr
              ? 'محرك استرجاع معرفي مدعم بالأدلة يستند إلى دلائل MedlinePlus ومنظمة الصحة العالمية وخدمة الصحة البريطانية NHS مع التحقق الصارم من صحة الاقتباسات وروابط المراجع وتصفية طوارئ القلب والتنفس.'
              : 'Grounded retrieval pipeline indexing authoritative health guides from MedlinePlus, WHO, and NHS. Guarantees working source citations, transparent uncertainty disclaimers, and acute emergency red-flag triage.'}
          </p>
        </div>
      </section>
    </div>
  );
};
