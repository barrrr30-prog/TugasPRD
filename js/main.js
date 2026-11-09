import { CONFIG } from "./config.js";
import { realtimeProviders, storageProviders } from "./services/index.js";
import * as ui from "./ui/dashboard.js";

ui.init(CONFIG.deviceId);

const rt = realtimeProviders[CONFIG.modules.realtime];
const store = storageProviders[CONFIG.modules.storage];
let latest = null;

if (!rt || !store) {
  ui.setStatus(false, "Provider tidak ditemukan");
} else if (CONFIG.firebase.apiKey.startsWith("ISI")) {
  ui.setStatus(false, "Isi js/config.js dulu");
} else {
  try {
    rt.init(CONFIG);
    store.init(CONFIG);

    rt.subscribe(CONFIG.deviceId,
      (data) => { latest = data; ui.renderData(data); },
      (ok, msg) => ui.setStatus(ok, ok ? "Terhubung" : msg || "Terputus"));

    ui.onControl((key, value) =>
      rt.sendControl(CONFIG.deviceId, key, value).catch((e) => ui.toast("Gagal kirim: " + e.message)));

    ui.onSave(() => save(true));
    ui.onLoad(loadHistory);
    if (CONFIG.autoLogMs > 0) setInterval(() => save(false), CONFIG.autoLogMs);
  } catch (e) {
    ui.setStatus(false, "Error: " + e.message);
  }
}

async function save(manual) {
  const s = latest?.sensors;
  if (!s) return manual && ui.toast("Belum ada data sensor untuk disimpan");
  ui.busy("#btnSave", true);
  try {
    await store.saveReading({ deviceId: CONFIG.deviceId, temperature: s.temperature, humidity: s.humidity });
    if (manual) ui.toast("Tersimpan ke Google Sheets");
  } catch (e) { ui.toast(e.message); }
  ui.busy("#btnSave", false);
}

async function loadHistory() {
  ui.busy("#btnLoad", true);
  try { ui.renderHistory(await store.getHistory(CONFIG.deviceId, CONFIG.historyLimit)); }
  catch (e) { ui.toast(e.message); }
  ui.busy("#btnLoad", false);
}
