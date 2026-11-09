# Panel IoT (HTML + CSS + JavaScript)

Web statis modular: **Firebase Realtime Database** (data langsung & kontrol) + **Google Apps Script** (riwayat di Google Sheets). Siap deploy ke **Vercel**.

## Struktur
```
index.html
css/style.css
js/config.js              <- edit koneksi di sini
js/main.js                <- penghubung
js/services/index.js      <- registry provider (modular)
js/services/firebase.service.js
js/services/sheets.service.js
js/ui/dashboard.js
apps-script/Code.gs       <- tempel ke Apps Script
vercel.json
```

## 1. Firebase
1. Buat project di console.firebase.google.com, lalu **Build > Realtime Database > Create**.
2. Project settings > Your apps > tambah **Web app**, salin config ke `js/config.js`.
3. Rules (untuk uji coba; perketat dengan Authentication sebelum produksi):
```json
{ "rules": { "devices": { ".read": true, ".write": true } } }
```
4. Alat (ESP32/ESP8266) menulis ke:
   - `devices/esp32-01/sensors` -> `{ "temperature": 28.5, "humidity": 70, "updatedAt": 1731139200000 }`
   - membaca `devices/esp32-01/controls/relay1` dan `relay2` (true/false)

## 2. Google Apps Script
1. Buat Google Sheet baru > **Extensions > Apps Script**, tempel `apps-script/Code.gs`.
2. **Deploy > New deployment > Web app**: Execute as *Me*, access *Anyone*.
3. Salin URL `/exec` ke `appsScriptUrl` di `js/config.js`. Setelah mengubah kode, buat **New version** pada deployment.

## 3. Deploy ke Vercel
- Via CLI: `npm i -g vercel` lalu `vercel` di folder ini (Framework: Other, tanpa build command).
- Atau push ke GitHub, lalu **Add New Project** di vercel.com dan pilih repo.

## Menambah koneksi baru
Buat `js/services/mqtt.service.js` dengan fungsi yang sama seperti kontrak di `js/services/index.js`, daftarkan di registry, lalu ubah `modules.realtime` di `config.js`. Kode UI tidak perlu diubah.

## Uji lokal
Modul ES butuh server: `npx serve .` atau `python3 -m http.server`.
