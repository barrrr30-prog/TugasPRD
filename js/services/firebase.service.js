import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

let db;

export function init(cfg) {
  db = getDatabase(initializeApp(cfg.firebase));
}

// Struktur data: devices/{id}/sensors {temperature, humidity, updatedAt}
//                devices/{id}/controls {relay1, relay2}
export function subscribe(deviceId, onData, onStatus) {
  const offData = onValue(ref(db, `devices/${deviceId}`), (s) => onData(s.val() || {}),
    (err) => onStatus?.(false, err.message));
  const offConn = onValue(ref(db, ".info/connected"), (s) => onStatus?.(!!s.val()));
  return () => { offData(); offConn(); };
}

export function sendControl(deviceId, key, value) {
  return set(ref(db, `devices/${deviceId}/controls/${key}`), value);
}
