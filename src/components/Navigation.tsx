import React from 'react';
import { Language } from '../types';

interface NavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
  onToggleLanguage: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
}) => {
  const isAr = language === 'ar';

  const navItems = [
    { id: 'dashboard', label: isAr ? 'لوحة التحكم' : 'Dashboard' },
    { id: 'chatbot', label: isAr ? 'المساعد' : 'Chatbot' },
    { id: 'skin', label: isAr ? 'الجلد' : 'Skin' },
    { id: 'respiratory', label: isAr ? 'التنفس' : 'Respiratory' },
    { id: 'lab', label: isAr ? 'التحاليل' : 'Labs' },
    { id: 'history', label: isAr ? 'السجل' : 'History' },
    { id: 'models', label: isAr ? 'النماذج' : 'Model Cards' },
    { id: 'deployment', label: isAr ? 'ويندوز 11' : 'Windows 11' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">
        {/* Zone 1: Brand title, one line */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 text-left cursor-pointer"
        >
          AI Medical Assistant
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600 overflow-x-auto py-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-blue-600 font-semibold'
                    : 'hover:text-slate-900 text-slate-600'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleLanguage}
            className="px-3 py-1.5 text-xs font-semibold rounded border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            aria-label="Toggle language between English and Arabic"
          >
            {isAr ? 'English' : 'العربية (RTL)'}
          </button>
        </div>
      </div>

      {/* Mobile Secondary Scroll Bar */}
      <div className="lg:hidden flex items-center gap-3 overflow-x-auto px-4 py-2 border-t border-slate-100 text-xs font-medium text-slate-600 bg-slate-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded transition-colors ${
              currentTab === item.id
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
