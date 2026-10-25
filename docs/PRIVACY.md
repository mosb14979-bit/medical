# Privacy & Data Retention Specification

## 1. Zero Cloud Exfiltration Architecture
The fundamental architectural thesis of AMA is **strict local execution**. No medical telemetry, personal identifier, uploaded laboratory sheet, dermoscopic photograph, or auscultation audio clip is ever transmitted to remote commercial APIs or external analytics trackers.

---

## 2. Ephemeral In-Memory Processing & Auto-Purging
- **Temporary Uploads**: When a user submits an image, PDF, or audio file, it is processed via temporary secure buffers.
- **Immediate Cleanup**: Once feature extraction or OCR parsing terminates, the file is unlinked from storage.
- **Opt-In Historical Logging**: Storing analysis metadata in the local SQLite database is governed by a user setting. Users may toggle this off entirely in the interface.

---

## 3. History Purging & Local Scrubbing
Users can:
1. View all past queries, timestamps, and extracted laboratory flags.
2. Delete individual analysis records permanently with immediate cascading cleanup.
3. Perform a **Full History Wipe**, which executes a `PRAGMA incremental_vacuum` on the SQLite database and overwrites any residual temporary buffers.

---

## 4. De-identification of Medical Documents
Laboratory reports frequently contain patient names, national IDs, and clinic addresses. The OCR parsing engine extracts exclusively:
- Test Nomenclature (e.g., Hemoglobin, Fasting Glucose)
- Numerical Values & Units (e.g., 14.2 g/dL)
- Reference Intervals (e.g., 13.5 - 17.5 g/dL)

Patient identity headers, doctor signatures, and hospital letterhead metadata are excluded from the parsed record.
