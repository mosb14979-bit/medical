import React from 'react';
import { Language } from '../types';

interface SafetyBannerProps {
  language: Language;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ language }) => {
  const isAr = language === 'ar';

  return (
    <aside
      role="alert"
      className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs sm:text-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 uppercase shrink-0">
          {isAr ? 'أبحاث وتعليم طبي' : 'RESEARCH & EDUCATION ONLY'}
        </span>
        <p className="leading-snug text-amber-800">
          {isAr
            ? 'المساعد الطبي (AMA) ليس جهازاً تشخيصياً معتمداً ولا يصف أدوية أو يحدد جرعات. في حال وجود ألم صدري حاد، ضيق تنفس شديد، أو أعراض طارئة، اتصل فوراً بالإسعاف (911 / 999 / 112).'
            : 'AMA is not a clinically validated diagnostic device. It does not prescribe medications, calculate individual dosages, or replace licensed physician care. For acute chest pain, severe dyspnea, or emergencies, call local emergency services (911 / 999 / 112) immediately.'}
        </p>
      </div>
    </aside>
  );
};
