import React, { useState } from 'react';
import { Language, HistoryRecord } from '../types';
import { Trash2, Shield, Filter, AlertCircle } from 'lucide-react';

interface HistoryViewProps {
  language: Language;
  history: HistoryRecord[];
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  language,
  history,
  onDeleteRecord,
  onClearAll,
}) => {
  const isAr = language === 'ar';
  const [selectedModule, setSelectedModule] = useState<string>('all');

  const filteredHistory =
    selectedModule === 'all'
      ? history
      : history.filter((h) => h.module === selectedModule);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isAr ? 'سجل التحاليل والخصوصية المحلية' : 'Analysis History & Local Privacy'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {isAr
              ? 'تخزن السجلات محلياً في قاعدة بيانات SQLite الخاصة بك دون أي اتصال سحابي خارجي.'
              : 'All historical analyses are stored locally in your SQLite database with zero external cloud telemetry.'}
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  isAr
                    ? 'هل أنت متأكد من رغبتك في حذف جميع السجلات المحلية نهائياً؟'
                    : 'Are you sure you want to permanently delete all local history records?'
                )
              ) {
                onClearAll();
              }
            }}
            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'مسح السجل بالكامل' : 'Purge All Records'}</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-3 text-xs font-medium text-slate-600 overflow-x-auto">
        <span className="font-mono text-slate-400 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          <span>{isAr ? 'تصفية:' : 'Filter:'}</span>
        </span>
        {['all', 'chatbot', 'skin', 'respiratory', 'lab'].map((mod) => (
          <button
            key={mod}
            type="button"
            onClick={() => setSelectedModule(mod)}
            className={`px-3 py-1 rounded-md capitalize cursor-pointer transition-colors ${
              selectedModule === mod
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {mod === 'all' ? (isAr ? 'الكل' : 'All') : mod}
          </button>
        ))}
      </div>

      {/* History Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs p-6">
            {isAr
              ? 'لا توجد سجلات محفوظة حالياً في قاعدة البيانات المحلية.'
              : 'No analysis records found in local storage.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 font-mono text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">{isAr ? 'الوقت والتاريخ' : 'Timestamp'}</th>
                  <th className="p-3">{isAr ? 'الوحدة' : 'Module'}</th>
                  <th className="p-3">{isAr ? 'ملخص الإدخال' : 'Input Summary'}</th>
                  <th className="p-3">{isAr ? 'النتيجة الأولية' : 'Primary Finding'}</th>
                  <th className="p-3">{isAr ? 'نسبة الثقة' : 'Confidence'}</th>
                  <th className="p-3 text-right">{isAr ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-mono text-slate-500 whitespace-nowrap">
                      {item.timestamp}
                    </td>
                    <td className="p-3 font-mono uppercase text-slate-700 font-semibold">
                      {item.module}
                    </td>
                    <td className="p-3 text-slate-900 max-w-xs truncate font-medium">
                      {item.summary}
                    </td>
                    <td className="p-3 text-slate-700">{item.finding}</td>
                    <td className="p-3 font-mono tabular-nums text-slate-600">
                      {item.confidence ? `${item.confidence}%` : '-'}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteRecord(item.id)}
                        className="text-red-600 hover:text-red-800 font-semibold text-[11px] cursor-pointer"
                      >
                        {isAr ? 'حذف' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Privacy Guarantee Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 block mb-0.5">
            {isAr ? 'ضمان الخصوصية وعدم التسريب السحابي' : 'Zero-Cloud Exfiltration Guarantee'}
          </strong>
          {isAr
            ? 'لا يتم إرسال أي صور أو تسجيلات صوتية أو تقارير طبية إلى أي خوادم خارجية. يتم حذف الملفات المؤقتة تلقائياً فور انتهاء المعالجة.'
            : 'No medical images, auscultation audio, or clinical sheets are uploaded to commercial third-party endpoints. Temporary scratch buffers are unlinked immediately after inference.'}
        </div>
      </div>
    </div>
  );
};
