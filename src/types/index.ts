export type Language = 'en' | 'ar';

export interface Citation {
  id?: string;
  title: string;
  publisher: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: Citation[];
  isEmergency?: boolean;
  timestamp: string;
}

export interface SkinPrediction {
  class_code: string;
  confidence: number;
  description: string;
  risk_tier: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface SkinAnalysisResult {
  primary_class: string;
  primary_confidence: number;
  risk_tier: 'Low' | 'Medium' | 'High' | 'Critical';
  predictions: SkinPrediction[];
  is_dermoscopy_detected: boolean;
  warnings: string[];
  clinical_disclaimer: string;
}

export interface RespiratoryResult {
  sound_class: 'normal' | 'wheeze' | 'crackle' | 'wheeze_crackle' | 'stridor';
  title: string;
  description: string;
  confidence: number;
  metrics: {
    duration_sec: number;
    sample_rate_hz: number;
    dominant_frequency_hz: number;
    spectral_centroid_hz: number;
    rms_energy: number;
  };
  spectrogram_preview: number[];
  clinical_disclaimer: string;
}

export interface LabTestItem {
  test_name: string;
  value: number;
  unit: string;
  reference_interval: string;
  flag: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  requires_review: boolean;
}

export interface LabAnalysisResult {
  parsed_tests: LabTestItem[];
  raw_text: string;
  total_extracted: number;
  abnormal_count: number;
  ocr_confidence: number;
  clinical_disclaimer: string;
}

export interface HistoryRecord {
  id: string;
  module: 'chatbot' | 'skin' | 'respiratory' | 'lab';
  summary: string;
  finding: string;
  confidence?: number;
  risk_tier?: string;
  timestamp: string;
}
