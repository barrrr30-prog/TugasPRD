const $ = (s) => document.querySelector(s);
const buffer = [];

export function init(deviceId) { $("#deviceId").textContent = deviceId; }

export function setStatus(online, text) {
  const el = $("#status");
  el.className = "status " + (online ? "online" : "offline");
  $("#statusText").textContent = text ?? (online ? "Terhubung" : "Terputus");
}

export function renderData(d) {
  const s = d.sensors || {};
  $("#temperature").textContent = fmt(s.temperature);
  $("#humidity").textContent = fmt(s.humidity);
  $("#updatedAt").textContent = s.updatedAt ? "Diperbarui " + new Date(s.updatedAt).toLocaleString("id-ID") : "Belum ada data";
  document.querySelectorAll("[data-control]").forEach((i) => { i.checked = !!(d.controls || {})[i.dataset.control]; });
  if (typeof s.temperature === "number") {
    buffer.push(s.temperature);
    if (buffer.length > 30) buffer.shift();
    drawSpark();
  }
}

function drawSpark() {
  if (buffer.length < 2) return;
  const min = Math.min(...buffer), max = Math.max(...buffer), span = max - min || 1;
  const pts = buffer.map((v, i) => `${(i / (buffer.length - 1)) * 300},${65 - ((v - min) / span) * 60}`).join(" ");
  $("#spark").innerHTML = `<polyline points="${pts}"/>`;
}

export function renderHistory(rows) {
  $("#historyBody").innerHTML = rows.length
    ? rows.map((r) => `<tr><td>${new Date(r.timestamp).toLocaleString("id-ID")}</td><td>${fmt(r.temperature)}</td><td>${fmt(r.humidity)}</td></tr>`).join("")
    : `<tr><td colspan="3" class="empty">Belum ada riwayat tersimpan.</td></tr>`;
}

export function onControl(handler) {
  document.querySelectorAll("[data-control]").forEach((i) =>
    i.addEventListener("change", () => handler(i.dataset.control, i.checked)));
}
export function onSave(fn) { $("#btnSave").addEventListener("click", fn); }
export function onLoad(fn) { $("#btnLoad").addEventListener("click", fn); }
export function busy(id, state) { $(id).disabled = state; }

let t;
export function toast(msg) {
  const el = $("#toast");
  el.textContent = msg; el.classList.add("show");
  clearTimeout(t); t = setTimeout(() => el.classList.remove("show"), 2800);
}

const fmt = (v) => (typeof v === "number" ? v.toFixed(1) : "--");
