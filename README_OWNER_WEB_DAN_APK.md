# Animedubar Owner OS — Aplikasi Android (APK) + Web Panel Pemilik

Paket 2-in-1 khusus **Pemilik & Admin Animedubar** (100% terpisah dari Aplikasi Pelanggan):
- **Package ID Android:** `com.animedubar.owner` (bisa diinstal berdampingan dengan APK Pelanggan `com.animedubar.app` di HP yang sama!).
- **Web Panel Pemilik (HTTPS):** Responsif penuh — tampilan Sidebar Pro di Laptop/PC dan Bottom Bar di HP, otomatis live di **GitHub Pages**.
- **Backend:** Terhubung langsung ke **`animedubar_backend_appscript_Code_v4.js`**.

## Cara Pasang Web Pemilik + Build APK Otomatis (100% Gratis di GitHub)

1. Buat repositori GitHub baru (misalnya: **`animedubar-owner`** — boleh diset Private/Public).
2. Ekstrak file ZIP ini lalu upload seluruh isinya (`package.json`, `capacitor.config.json`, `scripts/`, `www/`, dan folder `.github/workflows/`).
   * *Catatan jika upload lewat browser HP/Laptop dan folder `.github` tidak ikut terupload:* buat manual lewat **Add file -> Create new file** untuk `.github/workflows/build-owner-apk.yml` dan `.github/workflows/deploy-owner-web.yml`.
3. Isi **Secrets** di repositori (`Settings -> Secrets and variables -> Actions -> New repository secret`):
   * `BACKEND_WEBAPP_URL` = URL Web App Google Apps Script v4 Anda (`https://script.google.com/macros/s/.../exec`)
   * `ONESIGNAL_OWNER_APP_ID` = (Opsional) App ID OneSignal khusus HP Pemilik
4. **Aktifkan Web Pemilik (GitHub Pages):**
   * Buka **Settings -> Pages -> Build and deployment -> Source** -> pilih **GitHub Actions**.
   * Jalankan workflow **Deploy Web Panel Pemilik** di tab **Actions** -> link Web Pemilik Anda (`https://metapackagingid-create.github.io/animedubar-owner/`) langsung aktif!
5. **Download APK Android Pemilik:**
   * Buka tab **Actions** -> pilih **Build Animedubar Owner APK** -> **Run workflow** -> setelah hijau, unduh **`Animedubar-Owner-CMS.apk`** pada bagian **Artifacts** dan instal di HP Anda.
