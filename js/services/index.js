// Registry koneksi. Untuk menambah provider baru (MQTT, Supabase, dll),
// buat file *.service.js dengan fungsi yang sama lalu daftarkan di sini.
//
// Kontrak realtime : init(cfg), subscribe(deviceId, onData, onStatus) -> unsubscribe, sendControl(deviceId, key, value)
// Kontrak storage  : init(cfg), saveReading(payload), getHistory(deviceId, limit)
import * as firebase from "./firebase.service.js";
import * as sheets from "./sheets.service.js";

export const realtimeProviders = { firebase };
export const storageProviders = { sheets };
