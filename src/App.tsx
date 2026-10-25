/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, HistoryRecord } from './types';
import { Navigation } from './components/Navigation';
import { SafetyBanner } from './components/SafetyBanner';
import { DashboardView } from './components/DashboardView';
import { ChatbotView } from './components/ChatbotView';
import { SkinAnalyzerView } from './components/SkinAnalyzerView';
import { RespiratoryView } from './components/RespiratoryView';
import { LabAnalyzerView } from './components/LabAnalyzerView';
import { HistoryView } from './components/HistoryView';
import { ModelCardsView } from './components/ModelCardsView';
import { DeploymentHubView } from './components/DeploymentHubView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [history, setHistory] = useState<HistoryRecord[]>([
    {
      id: 'init-01',
      module: 'lab',
      summary: 'Metropolitan Clinical Laboratory (Synthetic Panel)',
      finding: '4 Out-of-Range Analytes Flagged',
      confidence: 94.8,
      risk_tier: 'Medium',
      timestamp: '2026-10-24 14:30',
    },
    {
      id: 'init-02',
      module: 'chatbot',
      summary: 'Normal blood pressure threshold inquiry',
      finding: 'Grounded Evidence (MedlinePlus)',
      confidence: 90.0,
      risk_tier: 'Low',
      timestamp: '2026-10-24 15:10',
    },
  ]);

  // Synchronize document direction and language on root
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const handleAddHistory = (item: {
    module: 'chatbot' | 'skin' | 'respiratory' | 'lab';
    summary: string;
    finding: string;
    confidence?: number;
    risk_tier?: string;
  }) => {
    const newRecord: HistoryRecord = {
      id: String(Date.now()),
      module: item.module,
      summary: item.summary,
      finding: item.finding,
      confidence: item.confidence,
      risk_tier: item.risk_tier,
      timestamp: new Date().toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setHistory((prev) => [newRecord, ...prev]);
  };

  const handleDeleteHistoryRecord = (id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearAllHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Prominent Clinical Safety Notice */}
      <SafetyBanner language={language} />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {currentTab === 'dashboard' && (
          <DashboardView language={language} onNavigate={setCurrentTab} />
        )}
        {currentTab === 'chatbot' && (
          <ChatbotView language={language} onAddHistory={handleAddHistory} />
        )}
        {currentTab === 'skin' && (
          <SkinAnalyzerView language={language} onAddHistory={handleAddHistory} />
        )}
        {currentTab === 'respiratory' && (
          <RespiratoryView language={language} onAddHistory={handleAddHistory} />
        )}
        {currentTab === 'lab' && (
          <LabAnalyzerView language={language} onAddHistory={handleAddHistory} />
        )}
        {currentTab === 'history' && (
          <HistoryView
            language={language}
            history={history}
            onDeleteRecord={handleDeleteHistoryRecord}
            onClearAll={handleClearAllHistory}
          />
        )}
        {currentTab === 'models' && <ModelCardsView language={language} />}
        {currentTab === 'deployment' && <DeploymentHubView language={language} />}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-slate-700">AI Medical Assistant (AMA)</span>
            <span className="mx-2">·</span>
            <span>{language === 'ar' ? 'منصة بحثية ثنائية اللغة' : 'Bilingual Local-First Research Platform'}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('models')}
              className="hover:text-slate-900 cursor-pointer"
            >
              {language === 'ar' ? 'بطاقات النماذج' : 'Model Registry'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentTab('history')}
              className="hover:text-slate-900 cursor-pointer"
            >
              {language === 'ar' ? 'الخصوصية والسجل' : 'Privacy & History'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentTab('deployment')}
              className="hover:text-slate-900 cursor-pointer"
            >
              {language === 'ar' ? 'تشغيل ويندوز 11' : 'Windows 11 Guide'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
