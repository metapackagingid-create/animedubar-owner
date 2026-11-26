import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const wwwIndex = path.join(root, 'www', 'index.html');
const capPath = path.join(root, 'capacitor.config.json');

// 1. Resolve Live OTA URL (Secret LIVE_APP_URL -> auto GITHUB_REPOSITORY Pages URL -> default)
let liveUrl = (process.env.LIVE_APP_URL || '').trim();
if (!liveUrl && process.env.GITHUB_REPOSITORY && process.env.GITHUB_REPOSITORY.includes('/')) {
  const [ghOwner, ghRepo] = process.env.GITHUB_REPOSITORY.split('/');
  liveUrl = `https://${ghOwner.toLowerCase()}.github.io/${ghRepo}/`;
}
if (liveUrl && !liveUrl.endsWith('/')) liveUrl += '/';

if (liveUrl && fs.existsSync(capPath)) {
  const cap = JSON.parse(fs.readFileSync(capPath, 'utf8'));
  cap.server = cap.server || {};
  cap.server.url = liveUrl;
  cap.server.cleartext = true;
  cap.server.androidScheme = 'https';
  cap.server.errorPath = 'offline.html';
  fs.writeFileSync(capPath, JSON.stringify(cap, null, 2), 'utf8');
  console.log('[OK] Configured Live OTA Auto-Update server.url =', liveUrl);
}

// Update offline.html retry link too
const offlinePath = path.join(root, 'www', 'offline.html');
if (liveUrl && fs.existsSync(offlinePath)) {
  let offHtml = fs.readFileSync(offlinePath, 'utf8');
  offHtml = offHtml.replace(/window\.location\.href='[^']+'/g, `window.location.href='${liveUrl}'`);
  fs.writeFileSync(offlinePath, offHtml, 'utf8');
}

// 2. Inject GitHub Secrets (BACKEND_WEBAPP_URL & OneSignal App ID) into www/index.html
if (fs.existsSync(wwwIndex)) {
  let html = fs.readFileSync(wwwIndex, 'utf8');
  const backendUrl = (process.env.BACKEND_WEBAPP_URL || '').trim();
  const oneSignalId = (process.env.ONESIGNAL_OWNER_APP_ID || process.env.ONESIGNAL_APP_ID || '').trim();
  if (backendUrl) {
    html = html.replace(/__BACKEND_WEBAPP_URL__/g, backendUrl);
    console.log('[OK] Injected BACKEND_WEBAPP_URL into www/index.html');
  }
  if (oneSignalId) {
    html = html.replace(/__ONESIGNAL_OWNER_APP_ID__/g, oneSignalId);
    console.log('[OK] Injected OneSignal App ID into www/index.html');
  }
  fs.writeFileSync(wwwIndex, html, 'utf8');
}

// 3. Patch AndroidManifest.xml (Permissions + Hardware Accelerated Fullscreen)
const manifestPath = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
if (fs.existsSync(manifestPath)) {
  let xml = fs.readFileSync(manifestPath, 'utf8');
  if (!xml.includes('android.permission.POST_NOTIFICATIONS')) {
    xml = xml.replace(
      '<uses-permission android:name="android.permission.INTERNET" />',
      '<uses-permission android:name="android.permission.INTERNET" />\n    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />\n    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />\n    <uses-permission android:name="android.permission.WAKE_LOCK" />'
    );
  }
  if (!xml.includes('android:usesCleartextTraffic')) {
    xml = xml.replace('<application', '<application android:usesCleartextTraffic="true" android:hardwareAccelerated="true"');
  }
  fs.writeFileSync(manifestPath, xml, 'utf8');
  console.log('[OK] Patched AndroidManifest.xml');
}

// 4. Copy App Launcher Icons into all Android mipmap folders
const icon512 = path.join(root, 'www', 'icons', 'icon-512.png');
const resDir = path.join(root, 'android', 'app', 'src', 'main', 'res');
if (fs.existsSync(icon512) && fs.existsSync(resDir)) {
  const mipmaps = ['mipmap-mdpi', 'mipmap-hdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi'];
  for (const dir of mipmaps) {
    const targetDir = path.join(resDir, dir);
    if (fs.existsSync(targetDir)) {
      fs.copyFileSync(icon512, path.join(targetDir, 'ic_launcher.png'));
      fs.copyFileSync(icon512, path.join(targetDir, 'ic_launcher_round.png'));
      fs.copyFileSync(icon512, path.join(targetDir, 'ic_launcher_foreground.png'));
    }
  }
  console.log('[OK] Copied launcher icons to Android mipmap folders');
}
