// RumahAnggaran — grafik canvas tanpa pustaka luar.
// Tiga jenis grafik, semuanya digambar dari angka yang dihitung situs:
// donut (porsi pengeluaran), bars (pemasukan vs pengeluaran per bulan),
// line (saldo tabungan kumulatif). Tooltip mengikuti kursor.

export function rupiah(n) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}
export function rupiahShort(n) {
  if (Math.abs(n) >= 1e9) return "Rp " + (n / 1e9).toFixed(1).replace(".", ",") + " M";
  if (Math.abs(n) >= 1e6) return "Rp " + (n / 1e6).toFixed(1).replace(".", ",") + " jt";
  if (Math.abs(n) >= 1e3) return "Rp " + Math.round(n / 1e3) + " rb";
  return rupiah(n);
}
function setupCanvas(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  canvas.width = w * dpr;
  canvas.height = height * dpr;
  canvas.style.height = height + "px";
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  return { ctx, w, h: height };
}
function tooltip(canvas, text, x, y) {
  let tip = canvas.parentElement.querySelector(".chart-tip");
  if (!tip) {
    tip = document.createElement("div");
    tip.className = "chart-tip";
    canvas.parentElement.appendChild(tip);
  }
  tip.textContent = text;
  tip.style.display = "block";
  tip.style.left = Math.min(x + 12, canvas.clientWidth - 170) + "px";
  tip.style.top = Math.max(y - 14, 4) + "px";
}
function hideTip(canvas) {
  const tip = canvas.parentElement.querySelector(".chart-tip");
  if (tip) tip.style.display = "none";
}

export function drawDonut(canvas, slices) {
  const { ctx, w, h } = setupCanvas(canvas, 240);
  const total = slices.reduce((s, x) => s + x.value, 0);
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 14, inner = r * 0.58;
  let a = -Math.PI / 2;
  const arcs = [];
  for (const s of slices) {
    const sweep = (s.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a, a + sweep);
    ctx.closePath();
    ctx.fillStyle = s.color;
    ctx.fill();
    arcs.push({ a0: a, a1: a + sweep, ...s });
    a += sweep;
  }
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath(); ctx.arc(cx, cy, inner, 0, Math.PI * 2); ctx.fill();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#1d2b26";
  ctx.font = "700 15px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Total belanja", cx, cy - 4);
  ctx.font = "700 17px system-ui, sans-serif";
  ctx.fillText(rupiahShort(total), cx, cy + 18);
  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - cx, y = e.clientY - rect.top - cy;
    const d = Math.hypot(x, y);
    if (d < inner || d > r) { hideTip(canvas); return; }
    let ang = Math.atan2(y, x);
    if (ang < -Math.PI / 2) ang += Math.PI * 2;
    const hit = arcs.find((s) => ang >= s.a0 && ang < s.a1);
    if (hit) tooltip(canvas, hit.label + ": " + rupiah(hit.value) + " (" + Math.round((hit.value / total) * 100) + "%)", e.clientX - rect.left, e.clientY - rect.top);
    else hideTip(canvas);
  };
  canvas.onmouseleave = () => hideTip(canvas);
}

export function drawBars(canvas, rows) {
  // rows: [{label, income, spend}]
  const { ctx, w, h } = setupCanvas(canvas, 260);
  const max = Math.max(...rows.map((r) => Math.max(r.income, r.spend))) * 1.08;
  const padL = 58, padB = 26, padT = 12;
  const plotW = w - padL - 8, plotH = h - padT - padB;
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = "#5c6b64";
  ctx.textAlign = "right";
  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i;
    const y = padT + plotH - (plotH * v) / max;
    ctx.fillText(rupiahShort(v), padL - 6, y + 4);
    ctx.strokeStyle = "#e3e8e4";
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - 8, y); ctx.stroke();
  }
  const slot = plotW / rows.length;
  const bw = Math.min(16, slot / 3.4);
  const zones = [];
  rows.forEach((r, i) => {
    const x0 = padL + i * slot + slot / 2;
    const ih = (plotH * r.income) / max, sh = (plotH * r.spend) / max;
    ctx.fillStyle = "#2f6f5e";
    ctx.fillRect(x0 - bw - 2, padT + plotH - ih, bw, ih);
    ctx.fillStyle = "#c96f4a";
    ctx.fillRect(x0 + 2, padT + plotH - sh, bw, sh);
    ctx.fillStyle = "#3c4a44";
    ctx.textAlign = "center";
    ctx.fillText(r.label, x0, h - 8);
    zones.push({ x0: x0 - bw - 2, x1: x0 + bw + 2, ...r });
  });
  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const hit = zones.find((z) => x >= z.x0 - 4 && x <= z.x1 + 4);
    if (hit) tooltip(canvas, hit.label + " — Masuk: " + rupiah(hit.income) + " · Keluar: " + rupiah(hit.spend) + " · Sisa: " + rupiah(hit.income - hit.spend), x, e.clientY - rect.top);
    else hideTip(canvas);
  };
  canvas.onmouseleave = () => hideTip(canvas);
}

export function drawLine(canvas, points) {
  // points: [{label, value}]
  const { ctx, w, h } = setupCanvas(canvas, 240);
  const min = Math.min(0, ...points.map((p) => p.value));
  const max = Math.max(...points.map((p) => p.value)) * 1.05;
  const padL = 58, padB = 26, padT = 14;
  const plotW = w - padL - 10, plotH = h - padT - padB;
  const X = (i) => padL + (plotW * i) / (points.length - 1);
  const Y = (v) => padT + plotH - ((v - min) / (max - min)) * plotH;
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = "#5c6b64";
  ctx.textAlign = "right";
  for (let i = 0; i <= 4; i++) {
    const v = min + ((max - min) / 4) * i;
    ctx.fillText(rupiahShort(v), padL - 6, Y(v) + 4);
    ctx.strokeStyle = "#e3e8e4";
    ctx.beginPath(); ctx.moveTo(padL, Y(v)); ctx.lineTo(w - 10, Y(v)); ctx.stroke();
  }
  ctx.strokeStyle = "#2f6f5e";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  points.forEach((p, i) => (i ? ctx.lineTo(X(i), Y(p.value)) : ctx.moveTo(X(i), Y(p.value))));
  ctx.stroke();
  ctx.fillStyle = "#2f6f5e";
  points.forEach((p, i) => {
    ctx.beginPath(); ctx.arc(X(i), Y(p.value), 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#3c4a44";
    ctx.textAlign = "center";
    ctx.fillText(p.label, X(i), h - 8);
    ctx.fillStyle = "#2f6f5e";
  });
  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let best = 0, bd = 1e9;
    points.forEach((p, i) => { const d = Math.abs(X(i) - x); if (d < bd) { bd = d; best = i; } });
    if (bd < 22) tooltip(canvas, points[best].label + ": tabungan kumulatif " + rupiah(points[best].value), x, e.clientY - rect.top);
    else hideTip(canvas);
  };
  canvas.onmouseleave = () => hideTip(canvas);
}
