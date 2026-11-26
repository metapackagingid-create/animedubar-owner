import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const wwwIndex = path.join(root, 'www', 'index.html');

// 1. Inject GitHub Secrets into www/index.html
if (fs.existsSync(wwwIndex)) {
  let html = fs.readFileSync(wwwIndex, 'utf8');
  const backendUrl = (process.env.BACKEND_WEBAPP_URL || '').trim();
  const oneSignalOwnerId = (process.env.ONESIGNAL_OWNER_APP_ID || process.env.ONESIGNAL_APP_ID || '').trim();
  if (backendUrl) {
    html = html.replace(/__BACKEND_WEBAPP_URL__/g, backendUrl);
    console.log('[OK] Injected BACKEND_WEBAPP_URL into www/index.html');
  }
  if (oneSignalOwnerId) {
    html = html.replace(/__ONESIGNAL_OWNER_APP_ID__/g, oneSignalOwnerId);
    console.log('[OK] Injected ONESIGNAL_OWNER_APP_ID into www/index.html');
  }
  fs.writeFileSync(wwwIndex, html, 'utf8');
}

// 2. Patch AndroidManifest.xml (Permissions + Hardware Acceleration)
const manifestPath = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
if (fs.existsSync(manifestPath)) {
  let xml = fs.readFileSync(manifestPath, 'utf8');
  if (!xml.includes('android.permission.POST_NOTIFICATIONS')) {
    xml = xml.replace(
      '<uses-permission android:name="android.permission.INTERNET" />',
      '<uses-permission android:name="android.permission.INTERNET" />\n    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />\n    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />'
    );
  }
  if (!xml.includes('android:usesCleartextTraffic')) {
    xml = xml.replace('<application', '<application android:usesCleartextTraffic="true" android:hardwareAccelerated="true"');
  }
  fs.writeFileSync(manifestPath, xml, 'utf8');
  console.log('[OK] Patched AndroidManifest.xml');
}

// 3. Copy distinct Owner CMS icons into all mipmap folders
const icon512 = path.join(root, 'www', 'icons', 'icon-512.png');
const resDir = path.join(root, 'android', 'app', 'src', 'main', 'res');
if (fs.existsSync(icon512) && fs.existsSync(resDir)) {
  const mipmaps = ['mipmap-mdpi', 'mipmap-hdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi'];
  for (const dir of mipmaps) {
    const target = path.join(resDir, dir);
    if (fs.existsSync(target)) {
      fs.copyFileSync(icon512, path.join(target, 'ic_launcher.png'));
      fs.copyFileSync(icon512, path.join(target, 'ic_launcher_round.png'));
      fs.copyFileSync(icon512, path.join(target, 'ic_launcher_foreground.png'));
    }
  }
  console.log('[OK] Copied Animedubar Owner icons');
}
