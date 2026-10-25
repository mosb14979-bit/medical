/**
 * frontend/static/js/i18n.js
 * Comprehensive English & Arabic localization system for AI Medical Assistant.
 * Switches document direction (dir="rtl" / dir="ltr"), updates labels, and persists preference.
 */

const TRANSLATIONS = {
  en: {
    nav_dashboard: "Dashboard",
    nav_chatbot: "Chatbot",
    nav_skin: "Skin Lesions",
    nav_resp: "Respiratory",
    nav_lab: "Lab Reports",
    nav_history: "History",
    nav_models: "Model Cards",
    disclaimer_badge: "RESEARCH & EDUCATION",
    disclaimer_text: "AMA is not a diagnostic device. It does not prescribe medications or replace clinical evaluation. If experiencing acute chest pain, severe shortness of breath, or emergency symptoms, contact local emergency dispatch (911 / 999 / 112) immediately.",
    hero_title: "Clinical Information & Research Workspace",
    hero_desc: "A local-first medical informatics suite providing evidence-grounded medical Q&A, dermoscopic lesion classification, respiratory auscultation analysis, and bilingual laboratory OCR.",
    sys_inspecting: "Inspecting local environment...",
    mod_chatbot_title: "Medical Chatbot",
    mod_chatbot_desc: "Evidence-based retrieval from MedlinePlus and WHO. Real citation tracking, clinical term explanation, and emergency triage screening.",
    mod_skin_title: "Skin Lesion Analyzer",
    mod_skin_desc: "HAM10000 7-class dermatoscopic evaluation (Melanoma, Basal Cell Carcinoma, Nevi). Includes smartphone camera domain shift warnings.",
    mod_resp_title: "Respiratory Sound Analyzer",
    mod_resp_desc: "ICBHI 2017 auscultation sound classifier. Detects wheezes, crackles, and stridor with log-Mel spectrogram visual analysis.",
    mod_lab_title: "Laboratory Report OCR",
    mod_lab_desc: "Bilingual English & Arabic OCR engine for blood panels and metabolic reports. Extracts values, units, reference intervals, and flags out-of-range metrics.",
    action_launch: "Launch Module →",
    win_deploy_title: "Windows 11 Local Deployment",
    step1_title: "Clone & Extract",
    step1_desc: "Download repository to Windows 11 laptop.",
    step2_title: "Run SETUP.bat",
    step2_desc: "Automated virtualenv creation, pip dependency installation & OCR verification.",
    step3_title: "Run RUN.bat",
    step3_desc: "Spins up local Flask server on 127.0.0.1:5000 and opens default browser.",
    footer_subtext: "Bilingual local-first research platform. Zero external cloud telemetry. Running on local SQLite and PyTorch inference pipelines.",
    footer_model_cards: "Model Registry",
    footer_privacy: "Privacy & Data Purging"
  },
  ar: {
    nav_dashboard: "لوحة التحكم",
    nav_chatbot: "المساعد الطبي",
    nav_skin: "تحليل آفات الجلد",
    nav_resp: "الأصوات التنفسية",
    nav_lab: "تقارير المختبر",
    nav_history: "السجل والخصوصية",
    nav_models: "بطاقات النماذج",
    disclaimer_badge: "أبحاث وتعليم طبي",
    disclaimer_text: "المساعد الطبي (AMA) ليس جهازاً تشخيصياً معتمداً ولا يصف أدوية أو يحدد جرعات. في حال وجود ألم صدري حاد أو ضيق تنفس شديد، يرجى الاتصال فوراً بخدمات الإسعاف والطوارئ المحلية (911 / 999 / 112).",
    hero_title: "منصة المعلومات والأبحاث الطبية السريرية",
    hero_desc: "بيئة معلوماتية طبية محلية تقدم استشارات مدعمة بالأدلة، وتحليلاً لآفات الجلد، وتصنيف أصوات الصدر، وقراءة تقارير المختبر ثنائية اللغة.",
    sys_inspecting: "جاري فحص بيئة التشغيل المحلية...",
    mod_chatbot_title: "المساعد الطبي الآلي",
    mod_chatbot_desc: "استرجاع معرفي مدعم بالأدلة من MedlinePlus ومنظمة الصحة العالمية مع فرز حالات الطوارئ الطبية.",
    mod_skin_title: "محلل آفات الجلد",
    mod_skin_desc: "تصنيف تنظير الجلد وفق معيار HAM10000 لـ 7 فئات سريرية مع تحذير من استخدام صور الهواتف العادية.",
    mod_resp_title: "محلل الأصوات التنفسية",
    mod_resp_desc: "مصنف أصوات الصدر وفق معيار ICBHI 2017 لرصد الصفير والفرقعة والصرير مع مخطط طيفي ترددي.",
    mod_lab_title: "التعرف الضوئي على التحاليل",
    mod_lab_desc: "محرك OCR محلي للتقارير الطبية باللغتين العربية والإنجليزية واستخراج القيم والمجالات المرجعية وتنبيه الحالات غير الطبيعية.",
    action_launch: "فتح الوحدة ←",
    win_deploy_title: "التشغيل المباشر على ويندوز 11",
    step1_title: "التحميل والفك",
    step1_desc: "تنزيل المستودع مباشرة على حاسوبك المحمول الذي يعمل بنظام Windows 11.",
    step2_title: "تشغيل SETUP.bat",
    step2_desc: "إنشاء البيئة الافتراضية وتثبيت المكتبات وفحص حزم Tesseract OCR تلقائياً.",
    step3_title: "تشغيل RUN.bat",
    step3_desc: "تشغيل خادم Flask المحلي على 127.0.0.1:5000 وفتح المتصفح فوراً.",
    footer_subtext: "منصة بحثية ثنائية اللغة تركز على الخصوصية المحلية. بدون أي تسريب للبيانات خارج جهازك.",
    footer_model_cards: "سجل النماذج والبيانات",
    footer_privacy: "الخصوصية ومسح البيانات"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('ama_language') || 'en';
    this.init();
  }

  init() {
    this.applyLanguage(this.currentLang);
    const toggleBtn = document.getElementById('langToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const nextLang = this.currentLang === 'en' ? 'ar' : 'en';
        this.setLanguage(nextLang);
      });
    }
  }

  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('ama_language', lang);
    this.applyLanguage(lang);
  }

  applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    const label = document.getElementById('currentLangLabel');
    if (label) {
      label.textContent = lang === 'en' ? 'العربية' : 'English';
    }

    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
  }
}

window.i18nManager = new I18nManager();
