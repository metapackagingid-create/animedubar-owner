# Animedubar Owner — Mode Auto-Update (OTA) Tanpa Instal Ulang APK

Dengan konfigurasi ini, Anda cukup **instal APK 1 kali saja**. Setelah itu, setiap ada perubahan tampilan, fitur, pemutar video, maupun perbaikan bug pada **`www/index.html`**, cukup upload/update file di GitHub — dalam **±30 detik** aplikasi di HP langsung berubah otomatis tanpa perlu build atau instal ulang APK lagi!

## Cara Aktivasi (Cukup 1 Kali Saja)

1. Pastikan repositori GitHub berstatus **Public** (agar GitHub Pages gratis aktif) dan di **Settings -> Pages -> Build and deployment -> Source** pilih **GitHub Actions**.
2. Upload seluruh isi ZIP ini ke repositori GitHub Anda (jika `.github/workflows/` tidak ikut naik lewat browser, buat manual 2 file workflow: `deploy-owner-web.yml` dan `build-owner-apk.yml`).
3. Pastikan Secrets (`BACKEND_WEBAPP_URL` dan `ONESIGNAL_OWNER_APP_ID`) sudah terisi di **Settings -> Secrets and variables -> Actions**.
4. Di tab **Actions**:
   * Pastikan workflow **Deploy Live Auto-Update Web & APK Pemilik (GitHub Pages OTA)** bercentang hijau (agar URL live GitHub Pages aktif).
   * Jalankan **Build Animedubar Owner APK (Auto-Update + OneSignal)** 1 kali terakhir, lalu unduh & instal **`Animedubar-Owner-CMS-AutoUpdate.apk`** di HP Anda.
5. **Selesai!** Mulai sekarang, setiap kali ada revisi `www/index.html`, cukup commit di GitHub -> tunggu 30 detik -> tutup & buka ulang aplikasi di HP -> tampilan langsung ter-update otomatis!

*Catatan: Instal ulang APK hanya diperlukan jika suatu saat Anda mengganti ikon aplikasi, nama aplikasi di launcher HP, atau menambah plugin Android native baru.*
