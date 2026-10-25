export interface KnowledgeTopic {
  id: string;
  title_en: string;
  title_ar: string;
  publisher: string;
  url: string;
  content_en: string;
  content_ar: string;
  keywords: string[];
}

export const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  {
    id: 'hypertension',
    title_en: 'High Blood Pressure (Hypertension)',
    title_ar: 'ارتفاع ضغط الدم (فرط ضغط الدم)',
    publisher: 'MedlinePlus (US NLM)',
    url: 'https://medlineplus.gov/highbloodpressure.html',
    content_en: 'Normal adult blood pressure is generally under 120/80 mmHg. Elevated is 120-129 systolic with <80 diastolic. Stage 1 hypertension is 130-139 systolic or 80-89 diastolic. Lifestyle modifications include reducing sodium, regular aerobic exercise, stress reduction, and avoiding tobacco.',
    content_ar: 'ضغط الدم الطبيعي للبالغين أقل من 120/80 ملم زئبق. وتعتبر القراءة مرتفعة إذا كان الانقباضي 120-129 مع انبساطي أقل من 80. تشمل تعديلات نمط الحياة تقليل الصوديوم، والتمارين الهوائية، وتجنب التدخين.',
    keywords: ['blood pressure', 'hypertension', '120/80', 'systolic', 'diastolic', 'ضغط الدم', 'فرط ضغط الدم']
  },
  {
    id: 'diabetes_type2',
    title_en: 'Type 2 Diabetes Mellitus',
    title_ar: 'داء السكري من النوع الثاني',
    publisher: 'World Health Organization (WHO)',
    url: 'https://www.who.int/news-room/fact-sheets/detail/diabetes',
    content_en: 'Fasting blood glucose >= 126 mg/dL (7.0 mmol/L) on two separate tests or HbA1c >= 6.5% indicates diabetes. Pre-diabetes is defined as fasting glucose 100-125 mg/dL. Symptoms include increased thirst, frequent urination, fatigue, and blurry vision.',
    content_ar: 'يشير سكر الدم الصائم 126 ملغ/ديسيلتر أو أكثر، أو فحص التراكمي HbA1c بنسبة 6.5% أو أكثر إلى الإصابة بالسكري. تشمل الأعراض العطش الشديد وكثرة التبول والإرهاق.',
    keywords: ['diabetes', 'glucose', 'hba1c', 'blood sugar', 'insulin', 'السكري', 'سكر الدم', 'الأنسولين']
  },
  {
    id: 'cbc_hemoglobin',
    title_en: 'Complete Blood Count (CBC) & Hemoglobin',
    title_ar: 'تعداد الدم الكامل (CBC) والهيموغلوبين',
    publisher: 'MedlinePlus (US NLM)',
    url: 'https://medlineplus.gov/lab-tests/complete-blood-count/',
    content_en: 'Normal adult male hemoglobin typically spans 13.8 to 17.2 g/dL; adult female spans 12.1 to 15.1 g/dL. Low hemoglobin suggests anemia or blood loss, whereas elevated levels may indicate polycythemia or dehydration.',
    content_ar: 'يتراوح الهيموغلوبين الطبيعي للذكور بين 13.8 و17.2 غ/ديسيلتر، وللإناث بين 12.1 و15.1 غ/ديسيلتر. يشير انخفاض الهيموغلوبين إلى فقر الدم، بينما قد يشير ارتفاعه إلى الجفاف.',
    keywords: ['cbc', 'hemoglobin', 'wbc', 'rbc', 'platelets', 'anemia', 'تعداد الدم', 'الهيموغلوبين', 'فقر الدم']
  },
  {
    id: 'asthma_respiratory',
    title_en: 'Asthma and Respiratory Wheezing',
    title_ar: 'الربو والصفير التنفسي',
    publisher: 'NHS Health A to Z (UK)',
    url: 'https://www.nhs.uk/conditions/asthma/',
    content_en: 'Asthma is a chronic condition causing inflammation and narrowing of the airways. Wheezing is a continuous high-pitched musical sound during breathing, particularly expiration. Common triggers include pollen, cold air, dust mites, exercise, and viral infections.',
    content_ar: 'الربو حالة مزمنة تسبب التهاب وتضيق المسالك الهوائية. الصفير هو صوت موسيقي عالي النبرة أثناء التنفس وبخاصة أثناء الزفير. تتضمن المحفزات حبوب اللقاح والهواء البارد والغبار.',
    keywords: ['asthma', 'wheeze', 'wheezing', 'inhaler', 'shortness of breath', 'الربو', 'الصفير', 'ضيق التنفس']
  },
  {
    id: 'skin_mole_abcde',
    title_en: 'Skin Lesion Screening & ABCDE Criteria',
    title_ar: 'فحص الآفات الجلدية ومعايير ABCDE',
    publisher: 'MedlinePlus (US NLM)',
    url: 'https://medlineplus.gov/skincancer.html',
    content_en: 'The ABCDE rule guides dermatological evaluation: A = Asymmetry; B = Border irregularity; C = Color variation (multiple shades of brown, black, red); D = Diameter (>6 mm); E = Evolving (changing size, shape, or color). Suspicious lesions require dermoscopic evaluation and biopsy.',
    content_ar: 'تساعد قاعدة ABCDE في تقييم الشامات: A = عدم التناظر؛ B = عدم انتظام الحواف؛ C = تباين الألوان؛ D = القطر أكبر من 6 ملم؛ E = التغير والتطور في الحجم أو اللون. تتطلب الآفات المشبوهة فحصاً سريرياً وخزعة.',
    keywords: ['mole', 'skin lesion', 'melanoma', 'abcde', 'dermoscopy', 'شامة', 'آفة جلدية', 'الميلانوما']
  }
];

export const SYNTHETIC_LAB_REPORT_EN = `================================================================================
                    METROPOLITAN CLINICAL LABORATORY
                      SYNTHETIC TEST REPORT - RESEARCH USE
================================================================================
PATIENT ID: SYNTH-99420          DATE: 2026-10-24
SPECIMEN: WHOLE BLOOD (EDTA)     STATUS: VERIFIED
--------------------------------------------------------------------------------
TEST NAME                 RESULT      UNITS       REFERENCE INTERVAL    FLAG
--------------------------------------------------------------------------------
Hemoglobin                14.2        g/dL        13.5 - 17.5           NORMAL
Hematocrit                42.0        %           38.8 - 50.0           NORMAL
White Blood Cell (WBC)    7.4         10^3/uL     4.5 - 11.0            NORMAL
Platelet Count            245         10^3/uL     150 - 450             NORMAL
Fasting Glucose           112         mg/dL       70 - 99               HIGH
Creatinine                0.95        mg/dL       0.70 - 1.30           NORMAL
Total Cholesterol         215         mg/dL       < 200                 HIGH
HDL Cholesterol           48          mg/dL       > 40                  NORMAL
LDL Cholesterol           138         mg/dL       < 100                 HIGH
Triglycerides             165         mg/dL       < 150                 HIGH
TSH (Thyroid Stim.)       2.1         uIU/mL      0.40 - 4.00           NORMAL
Alanine Aminotransferase  28          U/L         10 - 40               NORMAL
================================================================================
NOTICE: Artificially generated synthetic test record for OCR pipeline validation.
================================================================================`;

export const SYNTHETIC_LAB_REPORT_AR = `================================================================================
                    مختبر العاصمة للتحاليل الطبية والسريرية
                      تقرير مخبري اصطناعي - لأغراض البحث
================================================================================
رقم العينة: AR-SYNTH-8831        التاريخ: 24-10-2026
نوع العينة: دم كامل (وريدي)     الحالة: تم التحقق
--------------------------------------------------------------------------------
اسم الفحص                النتيجة     الوحدة       المجال المرجعي         الحالة
--------------------------------------------------------------------------------
الهيموغلوبين             13.8        g/dL        13.5 - 17.5            طبيعي
كريات الدم البيضاء       6.8         10^3/uL     4.5 - 11.0             طبيعي
الصفائح الدموية          230         10^3/uL     150 - 450              طبيعي
سكر الدم الصائم          134         mg/dL       70 - 100               مرتفع
الكوليسترول الكلي        228         mg/dL       < 200                  مرتفع
الكوليسترول الجيد HDL    42          mg/dL       > 40                   طبيعي
الكوليسترول الضار LDL    145         mg/dL       < 100                  مرتفع
الكرياتينين              0.88        mg/dL       0.70 - 1.20            طبيعي
إنزيم الكبد ALT          22          U/L         10 - 45                طبيعي
هرمون الغدة الدرقية TSH  1.85        uIU/mL      0.40 - 4.20            طبيعي
================================================================================
تنبيه: هذا التقرير تم توليده اصطناعياً لأغراض التحقق من نظام التعرف الضوئي (OCR).
================================================================================`;
