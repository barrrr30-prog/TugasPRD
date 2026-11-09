// ===== SATU-SATUNYA FILE YANG PERLU DIEDIT UNTUK KONEKSI =====
export const CONFIG = {
  deviceId: "esp32-01",

  // Firebase Console > Project settings > Your apps > Web app
  firebase: {
    apiKey: "ISI_API_KEY",
    authDomain: "PROJECT_ID.firebaseapp.com",
    databaseURL: "https://PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "PROJECT_ID",
    appId: "ISI_APP_ID"
  },

  // Apps Script > Deploy > Web app > URL berakhiran /exec
  appsScriptUrl: "https://script.google.com/macros/s/ISI_DEPLOYMENT_ID/exec",

  // Pilih provider. Nama harus ada di js/services/index.js
  modules: { realtime: "firebase", storage: "sheets" },

  autoLogMs: 0,      // simpan otomatis ke Sheets tiap N ms (0 = mati, contoh 60000)
  historyLimit: 20
};
