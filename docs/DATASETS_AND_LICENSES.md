# Datasets, Provenance & Licensing Manifest

This document outlines the public, legally permissible scientific datasets utilized for training, evaluation, and knowledge retrieval in the AI Medical Assistant (AMA).

---

## 1. HAM10000 / ISIC Archive (Dermatology)

- **Dataset Identifier**: HAM10000 ("Human Against Machine with 10000 training images") / ISIC 2018 Task 3
- **Official Source**: International Skin Imaging Collaboration (ISIC) / Harvard Dataverse
- **DOI / URL**: https://doi.org/10.7910/DVN/DBW86T
- **License**: Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
- **Modality**: High-resolution dermatoscopic clinical photography
- **Sample Count**: 10,015 dermatoscopic images from diverse demographic subsets (Vienna & Queensland cohorts)
- **Target Classes (7)**:
  1. `akiec`: Actinic keratoses and intraepithelial carcinoma
  2. `bcc`: Basal cell carcinoma
  3. `bkl`: Benign keratosis-like lesions (solar lentigines / seborrheic keratoses)
  4. `df`: Dermatofibroma
  5. `mel`: Melanoma
  6. `nv`: Melanocytic nevi
  7. `vasc`: Vascular lesions (angiomas, pyogenic granulomas, hemorrhage)
- **Known Limitations**: Imbalanced class representation (melanocytic nevi constitute ~67% of records); images are obtained exclusively via dermoscopy and do not generalize directly to unmagnified smartphone photographs.

---

## 2. ICBHI 2017 Respiratory Sound Database

- **Dataset Identifier**: International Conference on Biomedical and Health Informatics (ICBHI 2017)
- **Official Source**: Respiratory Sound Database, University of Coimbra & Aristotle University of Thessaloniki
- **URL**: https://bhichallenge.med.auth.gr/
- **License**: Open Access for Academic & Scientific Research (with attribution)
- **Modality**: Digital stethoscope auscultation recordings (.wav) with clinical cycle annotations (.txt)
- **Sample Count**: 920 annotated audio recordings across 126 patients (5.5 hours total duration)
- **Auscultation Classes**:
  1. `Normal`: Clear vesicular breath sounds without adventitious phenomena
  2. `Wheezes`: Continuous, high-pitched musical adventitious sounds
  3. `Crackles`: Discontinuous, explosive, brief adventitious sounds
  4. `Wheeze + Crackle`: Co-occurring continuous and discontinuous sounds
  5. `Stridor`: High-pitched inspiratory sound indicating upper airway obstruction
- **Partitioning Strategy**: Patient-independent splits to guarantee zero identity leakage between train, validation, and test subsets.

---

## 3. Curated Medical Knowledge Base (Chatbot RAG)

- **Official Sources**:
  1. **MedlinePlus**: National Library of Medicine (NLM), United States Government (Public Domain / Free for Public Health Education)
  2. **World Health Organization (WHO)**: Global Health Guidelines and Fact Sheets (Open Access / Non-Commercial Research)
  3. **NHS Health A to Z**: National Health Service UK (Open Government Licence v3.0)
- **Language**: English and verified Arabic medical translations.
- **Coverage**: Chronic disease management, common symptoms, preventive health screenings, laboratory test explanations, and critical emergency red flags.
- **Attribution Policy**: Every RAG generation provides direct attribution to the respective agency publication URL and last reviewed timestamp.
