# Security Architecture & Hardening Guide

## 1. Threat Model & Defenses

| Threat Vector | Attack Vector | AMA Defense Mechanism |
| :--- | :--- | :--- |
| **Path Traversal** | Malicious filenames (e.g. `../../windows/system32/cmd.exe`) in multipart upload | `werkzeug.utils.secure_filename` combined with UUID hex prefixing and absolute directory boundary enforcement. |
| **Arbitrary Code Execution** | Uploading `.exe`, `.bat`, `.py`, or `.sh` disguised as images | MIME type inspection via `magic` bytes, file extension whitelisting (`.png`, `.jpg`, `.jpeg`, `.pdf`, `.wav`, `.mp3`), and image header validation via Pillow/soundfile. |
| **Resource Exhaustion (DoS)** | 500 MB ZIP bombs or infinite audio streams | Hard upload size cap (16 MB via `MAX_CONTENT_LENGTH`), multi-page PDF limit (maximum 5 pages parsed per upload), and audio length restriction ($\le 60\text{ seconds}$). |
| **SQL Injection** | Injecting SQL syntax through search queries or chatbot inputs | Strict parameterized queries across all database operations (`sqlite3.Cursor.execute(query, (params,))`). Zero string interpolation. |
| **Cross-Site Scripting (XSS)** | Injection of `<script>` tags inside report notes or prompts | Automatic Jinja2 HTML escaping on all rendered parameters; client-side `textContent` insertion instead of `innerHTML` for dynamic fields. |

---

## 2. Secure Local Server Defaults
- Flask binds by default to `127.0.0.1` (loopback only). It does NOT listen on `0.0.0.0` to prevent exposure across local area networks.
- Cross-Origin Resource Sharing (CORS) is restricted to the local origin.
- Session cookies use `SameSite=Lax` and `HttpOnly` attributes.
