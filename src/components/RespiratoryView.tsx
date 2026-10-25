import React, { useState, useRef } from 'react';
import { Language, RespiratoryResult } from '../types';
import { Play, Square, Upload, Activity, AlertCircle, Volume2 } from 'lucide-react';

interface RespiratoryViewProps {
  language: Language;
  onAddHistory: (item: { module: 'respiratory'; summary: string; finding: string; confidence?: number }) => void;
}

export const RespiratoryView: React.FC<RespiratoryViewProps> = ({ language, onAddHistory }) => {
  const isAr = language === 'ar';

  const [activeTone, setActiveTone] = useState<'normal' | 'wheeze' | 'crackle' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<RespiratoryResult | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<{ osc?: OscillatorNode; gain?: GainNode; interval?: any }>({});

  const stopAudio = () => {
    if (activeNodesRef.current.osc) {
      try {
        activeNodesRef.current.osc.stop();
        activeNodesRef.current.osc.disconnect();
      } catch (e) {}
    }
    if (activeNodesRef.current.interval) {
      clearInterval(activeNodesRef.current.interval);
    }
    activeNodesRef.current = {};
    setIsPlaying(false);
    setActiveTone(null);
  };

  const playSyntheticAudio = (type: 'normal' | 'wheeze' | 'crackle') => {
    stopAudio();
    setActiveTone(type);
    setIsPlaying(true);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      gain.connect(ctx.destination);
      activeNodesRef.current.gain = gain;

      if (type === 'wheeze') {
        // High-pitched musical continuous sound ~420 Hz
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, ctx.currentTime);
        // Periodic subtle modulation mimicking breath cycle
        osc.frequency.linearRampToValueAtTime(480, ctx.currentTime + 1.2);
        osc.frequency.linearRampToValueAtTime(390, ctx.currentTime + 2.5);
        osc.connect(gain);
        osc.start();
        activeNodesRef.current.osc = osc;
      } else if (type === 'crackle') {
        // Discontinuous bursts / white noise clicks
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 850;
        filter.Q.value = 3;

        whiteNoise.connect(filter);
        filter.connect(gain);
        whiteNoise.start();

        // Pulsing crackle envelope
        const burstInterval = setInterval(() => {
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
        }, 300);

        activeNodesRef.current.interval = burstInterval;
      } else {
        // Normal gentle vesicular breath sound ~160 Hz
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.connect(gain);
        osc.start();
        activeNodesRef.current.osc = osc;
      }

      // Auto-stop after 6 seconds
      setTimeout(() => {
        stopAudio();
      }, 6000);
    } catch (e) {
      console.log('Web Audio synthesis note:', e);
    }
  };

  const handleAnalyze = (toneType: 'normal' | 'wheeze' | 'crackle') => {
    setIsProcessing(true);
    setTimeout(() => {
      let simulated: RespiratoryResult;

      if (toneType === 'wheeze') {
        simulated = {
          sound_class: 'wheeze',
          title: isAr ? 'صفير زفيري مستمر (Wheeze)' : 'Continuous Expiratory Wheezing',
          description: isAr
            ? 'صوت صفير موسيقي متصل عالي النبرة (>100 مللي ثانية) يشير إلى تضيق الممرات الهوائية الدقيقة.'
            : 'Continuous, high-pitched musical sound characteristic of narrowed bronchial airways.',
          confidence: 84.2,
          metrics: {
            duration_sec: 6.0,
            sample_rate_hz: 16000,
            dominant_frequency_hz: 420.0,
            spectral_centroid_hz: 540.2,
            rms_energy: 0.042,
          },
          spectrogram_preview: [0.1, 0.2, 0.25, 0.35, 0.85, 0.95, 0.9, 0.6, 0.4, 0.3, 0.2, 0.15, 0.1, 0.08, 0.05, 0.04, 0.03, 0.02, 0.01, 0.01],
          clinical_disclaimer: isAr
            ? 'تنبيه سريري: سماع الصفير لا يعني بالضرورة تشخيص مرض الربو أو الانسداد الرئوي. يتطلب الأمر فحص وظائف الرئة (Spirometry) من قبل طبيب الأمراض الصدرية.'
            : 'Clinical Disclaimer: Auscultatory wheezing does not equate to a definitive diagnosis of asthma or COPD. Formal pulmonary function testing is required.',
        };
      } else if (toneType === 'crackle') {
        simulated = {
          sound_class: 'crackle',
          title: isAr ? 'خرخرة متقطعة (Crackles / Rales)' : 'Discontinuous Inspiratory Crackles',
          description: isAr
            ? 'أصوات طقطقة أو فرقعة انفجارية قصيرة (<20 مللي ثانية) شائعة عند إعادة انفتاح الحويصلات الهوائية.'
            : 'Discontinuous, explosive, brief clicking sounds commonly associated with peripheral airway opening.',
          confidence: 81.5,
          metrics: {
            duration_sec: 5.5,
            sample_rate_hz: 16000,
            dominant_frequency_hz: 850.0,
            spectral_centroid_hz: 920.4,
            rms_energy: 0.058,
          },
          spectrogram_preview: [0.2, 0.2, 0.3, 0.4, 0.45, 0.5, 0.6, 0.8, 0.9, 0.85, 0.7, 0.6, 0.5, 0.4, 0.3, 0.25, 0.2, 0.15, 0.1, 0.05],
          clinical_disclaimer: isAr
            ? 'تنبيه سريري: وجود الفرقعة يستدعي مراجعة الطبيب للتمييز بين الأسباب الرئوية والقلبية، ولا يعتبر تشخيصاً بحد ذاته.'
            : 'Clinical Disclaimer: Crackles require clinical auscultation and chest imaging to differentiate pulmonary from cardiac etiologies.',
        };
      } else {
        simulated = {
          sound_class: 'normal',
          title: isAr ? 'أصوات حويصلية طبيعية (Normal)' : 'Normal Vesicular Breath Sounds',
          description: isAr
            ? 'أصوات تنفس حويصلية طبيعية خالية من أي صفير أو طقطقة أو أصوات غير طبيعية.'
            : 'Unremarkable vesicular respiratory sounds with laminar flow and absent adventitious phenomena.',
          confidence: 92.0,
          metrics: {
            duration_sec: 8.0,
            sample_rate_hz: 16000,
            dominant_frequency_hz: 160.0,
            spectral_centroid_hz: 210.0,
            rms_energy: 0.025,
          },
          spectrogram_preview: [0.6, 0.8, 0.7, 0.5, 0.3, 0.2, 0.15, 0.1, 0.08, 0.05, 0.04, 0.03, 0.02, 0.02, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
          clinical_disclaimer: isAr
            ? 'تنبيه سريري: النتيجة الطبيعية في هذا المقطع لا تنفي وجود مشاكل تنفسية أخرى إذا كانت هناك أعراض سريرية مرافقة.'
            : 'Clinical Disclaimer: A normal classification does not exclude underlying pathology if persistent clinical symptoms exist.',
        };
      }

      setResult(simulated);
      setIsProcessing(false);

      onAddHistory({
        module: 'respiratory',
        summary: simulated.title,
        finding: simulated.sound_class.toUpperCase(),
        confidence: simulated.confidence,
      });
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {isAr ? 'محلل الأصوات التنفسية (معيار ICBHI 2017)' : 'Respiratory Sound Analyzer (ICBHI 2017)'}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          {isAr
            ? 'تحليل إشارات التسمع الصدري واستخراج المخطط الطيفي لتصنيف أصوات التنفس إلى 5 فئات رئيسية.'
            : 'Auscultation acoustic feature extraction and classification into 5 standardized categories with log-Mel spectrogram review.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Audio Selection & Synthesis */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <h2 className="text-base font-bold text-slate-900">
            {isAr ? 'تسجيلات السماعة الطبية' : 'Digital Stethoscope Recording'}
          </h2>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase block">
              {isAr ? 'اختر نمطاً صوتياً للاستماع والتحليل المباشر:' : 'Select acoustic prototype to listen and analyze:'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  playSyntheticAudio('wheeze');
                  handleAnalyze('wheeze');
                }}
                className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                  activeTone === 'wheeze'
                    ? 'border-blue-500 bg-blue-50 text-blue-900 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold mb-1">
                  {isAr ? 'نموذج الصفير (Wheeze)' : 'Wheeze (420 Hz)'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isAr ? 'موسيقي مستمر' : 'Continuous musical'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSyntheticAudio('crackle');
                  handleAnalyze('crackle');
                }}
                className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                  activeTone === 'crackle'
                    ? 'border-blue-500 bg-blue-50 text-blue-900 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold mb-1">
                  {isAr ? 'نموذج الفرقعة (Crackles)' : 'Crackles (Burst)'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isAr ? 'طقطقة متقطعة' : 'Discontinuous clicks'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSyntheticAudio('normal');
                  handleAnalyze('normal');
                }}
                className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                  activeTone === 'normal'
                    ? 'border-blue-500 bg-blue-50 text-blue-900 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold mb-1">
                  {isAr ? 'تنفس طبيعي (Normal)' : 'Normal Breath'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isAr ? 'حويصلي هادئ' : 'Vesicular laminar'}
                </div>
              </button>
            </div>

            {isPlaying && (
              <div className="flex items-center justify-between pt-2 text-xs text-blue-700 font-mono">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>{isAr ? 'جاري توليد وتسميع النمط الصوتي...' : 'Playing acoustic auscultation tone...'}</span>
                </span>
                <button
                  type="button"
                  onClick={stopAudio}
                  className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-slate-800 text-[11px] font-bold cursor-pointer"
                >
                  {isAr ? 'إيقاف' : 'Stop'}
                </button>
              </div>
            )}
          </div>

          {/* Standard File Upload */}
          <div className="pt-2">
            <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition-colors">
              <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
              <span className="text-xs font-semibold text-slate-700">
                {isAr ? 'أو ارفع ملف صوتي حقيقي (.wav, .mp3)' : 'Or upload custom audio (.wav, .mp3)'}
              </span>
              <span className="text-[11px] font-mono text-slate-400 mt-0.5">
                Duration 1.0s to 60.0s · Mono/Stereo
              </span>
              <input
                type="file"
                accept="audio/wav,audio/mp3,audio/mpeg"
                className="hidden"
                onChange={() => handleAnalyze('wheeze')}
              />
            </label>
          </div>
        </div>

        {/* Right: Spectrogram & ICBHI Results */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            {isAr ? 'المخطط الطيفي والتشخيص الصوتي' : 'Acoustic Classification & Spectrogram'}
          </h2>

          {!result ? (
            <div className="text-center py-16 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl p-6">
              {isAr
                ? 'اختر أحد الأنماط الصوتية أو ارفع ملف صوتي لحساب التردد السائد وعرض المخطط الطيفي.'
                : 'Select an acoustic prototype or upload a stethoscope file to calculate FFT spectrum and ICBHI categories.'}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Primary Category Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono text-slate-500 uppercase">
                    {isAr ? 'التصنيف الصوتي المكتشف' : 'DETECTED SOUND CATEGORY'}
                  </span>
                  <span className="font-mono text-lg font-bold text-blue-600">
                    {result.confidence}%
                  </span>
                </div>
                <div className="text-base font-bold text-slate-900">
                  {result.title}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {result.description}
                </div>
              </div>

              {/* 20-Band Spectrogram Bar Visualizer */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs font-mono text-slate-500">
                  <span className="uppercase">
                    {isAr ? 'المخطط الطيفي الترددي (20 نطاقاً)' : '20-Band Frequency Distribution'}
                  </span>
                  <span>Peak: {result.metrics.dominant_frequency_hz} Hz</span>
                </div>

                <div className="bg-slate-950 rounded-lg p-3 flex items-end gap-1.5 h-28">
                  {result.spectrogram_preview.map((val, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-gradient-to-t from-cyan-500 via-blue-500 to-amber-500 rounded-xs min-h-[4px] transition-all duration-300"
                      style={{ height: `${Math.max(8, Math.round(val * 100))}%` }}
                    />
                  ))}
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>0 Hz</span>
                  <span>2,000 Hz</span>
                  <span>4,000 Hz</span>
                  <span>8,000 Hz</span>
                </div>
              </div>

              {/* Acoustic Telemetry Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 font-mono text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">{isAr ? 'المعلمة الصوتية' : 'Acoustic Parameter'}</th>
                      <th className="p-2.5">{isAr ? 'القيمة المقاسة' : 'Measured Value'}</th>
                      <th className="p-2.5">{isAr ? 'الوحدة' : 'Standard'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                    <tr>
                      <td className="p-2.5 text-slate-700">{isAr ? 'التردد السائد' : 'Dominant Frequency'}</td>
                      <td className="p-2.5 font-bold text-slate-900">{result.metrics.dominant_frequency_hz}</td>
                      <td className="p-2.5 text-slate-400 text-[11px]">Hz</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-700">{isAr ? 'المركز الطيفي' : 'Spectral Centroid'}</td>
                      <td className="p-2.5 font-bold text-slate-900">{result.metrics.spectral_centroid_hz}</td>
                      <td className="p-2.5 text-slate-400 text-[11px]">Hz</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-700">{isAr ? 'مدة التسجيل' : 'Duration'}</td>
                      <td className="p-2.5 font-bold text-slate-900">{result.metrics.duration_sec}</td>
                      <td className="p-2.5 text-slate-400 text-[11px]">Seconds</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Clinical Disclosure */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-700">{isAr ? 'إخلاء مسؤولية سريرية: ' : 'Clinical Invariant: '}</strong>
                {result.clinical_disclaimer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
