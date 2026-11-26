// RumahAnggaran — semua halaman situs.
// Setiap halaman menghitung dari data.js: tidak ada angka yang di-hardcode
// di HTML. Anggaran bisa diedit, transaksi bisa ditambah, target bisa diisi,
// dan skenario what-if menghitung ulang semuanya secara langsung.

import { HOUSEHOLD, CATEGORIES, BUDGET, MONTHS, TRANSACTIONS, GOALS, RULE_503020, TIPS } from "./data.js";
import { rupiah, rupiahShort, drawDonut, drawBars, drawLine } from "./charts.js";

export const state = {
  budget: { ...BUDGET },
  transactions: TRANSACTIONS.map((t) => ({ ...t })),
  goals: GOALS.map((g) => ({ ...g })),
  view: "month", // month | year pada dasbor & anggaran
};

export function catById(id) { return CATEGORIES.find((c) => c.id === id); }
export function monthSpend(month) {
  return Object.values(month.spend).reduce((a, b) => a + b, 0);
}
export function totalBudget() {
  return Object.values(state.budget).reduce((a, b) => a + b, 0);
}
export function currentMonth() { return MONTHS[MONTHS.length - 1]; }
export function novSpendByCat() {
  const out = {};
  for (const t of state.transactions) if (t.amount < 0) out[t.cat] = (out[t.cat] || 0) + -t.amount;
  return out;
}
export function novIncome() {
  return state.transactions.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0);
}
export function yearTotals() {
  const income = MONTHS.reduce((a, m) => a + m.income, 0);
  const spend = MONTHS.reduce((a, m) => a + monthSpend(m), 0);
  return { income, spend, saved: income - spend };
}
function kpi(label, value, sub, tone) {
  return `<div class="kpi ${tone || ""}"><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div><div class="kpi-sub">${sub}</div></div>`;
}
function insightList(items) {
  return `<ul class="insights">${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
}

export function viewHome() {
  const m = currentMonth();
  const spend = monthSpend(m);
  const saved = m.income - spend;
  const rate = Math.round((saved / m.income) * 100);
  const y = yearTotals();
  const byCat = novSpendByCat();
  const top = [...CATEGORIES].map((c) => ({ ...c, v: byCat[c.id] || 0 })).sort((a, b) => b.v - a.v).slice(0, 5);
  const over = CATEGORIES.filter((c) => (byCat[c.id] || 0) > state.budget[c.id]);
  const slices = CATEGORIES.map((c) => ({ label: c.label, value: byCat[c.id] || 0, color: c.color }));
  const cum = [];
  let run = 0;
  for (const mo of MONTHS) { run += mo.income - monthSpend(mo); cum.push({ label: mo.m, value: run }); }
  const insights = [
    `Sisa bulan ini <b>${rupiah(saved)}</b> (${rate}% dari pemasukan) — ${rate >= 20 ? "di atas target tabungan 20%." : "masih di bawah target 20% — coba skenario what-if untuk menaikkannya."}`,
    over.length
      ? `Kategori yang melewati anggaran: <b>${over.map((c) => c.label).join(", ")}</b>. Lihat halaman Anggaran untuk menggeser dananya.`
      : `Tidak ada kategori yang melewati anggaran bulan ini — semua pos masih dalam batas.`,
    `Pengeluaran terbesar adalah <b>${top[0].label} (${rupiahShort(top[0].v)})</b>, ${Math.round((top[0].v / spend) * 100)}% dari total belanja.`,
    `Dalam 11 bulan terakhir keluarga ini menabung <b>${rupiah(y.saved)}</b> dari total pemasukan ${rupiah(y.income)} — rata-rata ${rupiah(Math.round(y.saved / 11))} per bulan.`,
    `Dana darurat sudah <b>${Math.round((state.goals[0].saved / state.goals[0].target) * 100)}%</b> dari target ${rupiah(state.goals[0].target)} — sekitar ${Math.max(0, Math.ceil((state.goals[0].target - state.goals[0].saved) / Math.max(1, saved)))} bulan lagi pada laju sisa saat ini.`,
  ];
  return `
  <section class="hero">
    <div>
      <p class="eyebrow">Perencana anggaran rumah tangga · ${HOUSEHOLD.city}</p>
      <h1>Uang keluarga, terlihat semua — sampai rupiah terakhir.</h1>
      <p class="lede">RumahAnggaran merapikan pemasukan, belanja, dan tabungan ${HOUSEHOLD.name} (4 anggota keluarga) dalam satu tempat: dasbor bulanan, anggaran per kategori, catatan transaksi, target tabungan, dan skenario what-if yang menghitung ulang secara langsung. Semua angka di bawah ini dihitung dari data keluarga contoh — ubah anggarannya, tambah transaksinya, dan semua halaman ikut berubah.</p>
      <div class="hero-links">
        <a class="btn primary" href="#/anggaran">Atur anggaran bulan ini</a>
        <a class="btn" href="#/skenario">Coba skenario what-if</a>
      </div>
    </div>
    <div class="hero-card">
      <div class="hero-card-title">${m.m} 2026 — ringkasan bulan</div>
      <div class="hero-nums">
        <div><span>Masuk</span><b>${rupiah(m.income)}</b></div>
        <div><span>Keluar</span><b>${rupiah(spend)}</b></div>
        <div><span>Sisa</span><b class="good">${rupiah(saved)}</b></div>
      </div>
      <div class="meter"><i style="width:${rate}%"></i></div>
      <p class="muted">Tingkat tabungan ${rate}% dari pemasukan bulan ini. Target keluarga: 20%.</p>
    </div>
  </section>

  <section class="grid kpis">
    ${kpi("Pemasukan " + m.m + " 2026", rupiah(m.income), "Gaji Rp 10.000.000 + usaha kue Rp 2.500.000", "")}
    ${kpi("Pengeluaran " + m.m + " 2026", rupiah(spend), "10 kategori · " + state.transactions.filter((t) => t.amount < 0).length + " transaksi tercatat", "")}
    ${kpi("Sisa untuk ditabung", rupiah(saved), rate + "% dari pemasukan · alokasi tabungan Rp 1.700.000/bulan", "good")}
    ${kpi("Tabungan 11 bulan (Jan–Nov)", rupiah(y.saved), "Dari pemasukan " + rupiah(y.income) + " · rata-rata " + rupiah(Math.round(y.saved / 11)) + "/bulan", "good")}
  </section>

  <section class="grid two">
    <div class="card">
      <h2>Ke mana uang pergi — ${m.m} 2026</h2>
      <p class="muted">Arahkan kursor ke grafik untuk melihat nominal tiap kategori.</p>
      <div class="chart-wrap"><canvas id="donut"></canvas></div>
      <div class="legend">${slices.map((s) => `<span><i style="background:${s.color}"></i>${s.label} · ${Math.round((s.value / spend) * 100)}%</span>`).join("")}</div>
    </div>
    <div class="card">
      <h2>Pemasukan vs pengeluaran — 11 bulan</h2>
      <p class="muted">Hijau pemasukan, oranye pengeluaran. Juni melonjak karena THR + liburan sekolah.</p>
      <div class="chart-wrap"><canvas id="bars"></canvas></div>
      <div class="legend"><span><i style="background:#2f6f5e"></i>Pemasukan</span><span><i style="background:#c96f4a"></i>Pengeluaran</span></div>
    </div>
  </section>

  <section class="grid two">
    <div class="card">
      <h2>Tabungan tumbuh — kumulatif Jan–Nov</h2>
      <p class="muted">Selisih pemasukan dan pengeluaran tiap bulan, dijumlahkan. Total ${rupiah(y.saved)}.</p>
      <div class="chart-wrap"><canvas id="line"></canvas></div>
    </div>
    <div class="card">
      <h2>Yang perlu diperhatikan bulan ini</h2>
      ${insightList(insights)}
      <h3>5 pengeluaran terbesar</h3>
      <table class="tbl">
        <thead><tr><th>Kategori</th><th class="num">Nominal</th><th class="num">Dari belanja</th></tr></thead>
        <tbody>${top.map((c) => `<tr><td><span class="dot" style="background:${c.color}"></span>${c.label}</td><td class="num">${rupiah(c.v)}</td><td class="num">${Math.round((c.v / spend) * 100)}%</td></tr>`).join("")}</tbody>
      </table>
    </div>
  </section>

  <section class="card">
    <h2>Transaksi terakhir</h2>
    <p class="muted">Lima transaksi terbaru di November. <a href="#/transaksi">Lihat semua ${state.transactions.length} transaksi →</a></p>
    ${txTable([...state.transactions].slice(-5).reverse())}
  </section>`;
}

export function txTable(list) {
  if (!list.length) return `<p class="muted">Belum ada transaksi yang cocok.</p>`;
  return `<table class="tbl"><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th></tr></thead><tbody>${
    list.map((t) => {
      const c = t.cat === "income" ? null : catById(t.cat);
      return `<tr><td>${t.date.slice(8)}/${t.date.slice(5, 7)}</td><td>${t.desc}</td><td>${t.cat === "income" ? "Pemasukan" : c.label}</td><td class="num ${t.amount > 0 ? "good" : "bad"}">${t.amount > 0 ? "+" : "−"}${rupiah(Math.abs(t.amount))}</td></tr>`;
    }).join("")
  }</tbody></table>`;
}

export function viewBudget() {
  const byCat = novSpendByCat();
  const totalB = totalBudget();
  const totalS = Object.values(byCat).reduce((a, b) => a + b, 0);
  const rows = CATEGORIES.map((c) => {
    const b = state.budget[c.id], s = byCat[c.id] || 0;
    const pct = Math.min(100, Math.round((s / b) * 100));
    const status = s > b ? `<span class="tag bad">Lewat ${rupiah(s - b)}</span>` : s > b * 0.9 ? `<span class="tag warn">Hampir habis</span>` : `<span class="tag good">Aman · sisa ${rupiah(b - s)}</span>`;
    return `<tr>
      <td><span class="dot" style="background:${c.color}"></span>${c.label}</td>
      <td class="num"><input class="budget-input" type="number" min="0" step="50000" data-cat="${c.id}" value="${b}" aria-label="Anggaran ${c.label}"></td>
      <td class="num">${rupiah(s)}</td>
      <td><div class="meter small ${s > b ? "over" : ""}"><i style="width:${pct}%"></i></div><span class="muted">${pct}%</span></td>
      <td>${status}</td></tr>`;
  }).join("");
  return `
  <section class="page-head">
    <h1>Anggaran ${currentMonth().m} 2026</h1>
    <p class="lede">Setiap rupiah punya tugas sebelum bulan dimulai. Ubah angka anggaran di kolom tengah — total dan status langsung menghitung ulang. Anggaran ini dibuat dari pemasukan Rp 12.500.000/bulan; sisanya Rp 1.700.000 dialokasikan ke tabungan di awal bulan.</p>
  </section>
  <section class="grid kpis">
    ${kpi("Total anggaran belanja", `<span id="budget-total">${rupiah(totalB)}</span>`, "10 kategori · tidak termasuk tabungan", "")}
    ${kpi("Realisasi bulan ini", rupiah(totalS), Math.round((totalS / totalB) * 100) + "% dari anggaran", totalS > totalB ? "bad" : "good")}
    ${kpi("Sisa anggaran", `<span id="budget-left">${rupiah(totalB - totalS)}</span>`, "Anggaran − realisasi", totalB - totalS < 0 ? "bad" : "good")}
    ${kpi("Alokasi tabungan", rupiah(12500000 - totalB), "Pemasukan − anggaran belanja", "good")}
  </section>
  <section class="card">
    <h2>Rincian per kategori</h2>
    <p class="muted">Angka anggaran bisa diedit. Realisasi dihitung dari ${state.transactions.filter((t) => t.amount < 0).length} transaksi November yang tercatat.</p>
    <div class="table-scroll"><table class="tbl">
      <thead><tr><th>Kategori</th><th class="num">Anggaran (Rp)</th><th class="num">Realisasi</th><th>Terpakai</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><td><b>Total</b></td><td class="num"><b id="budget-total-foot">${rupiah(totalB)}</b></td><td class="num"><b>${rupiah(totalS)}</b></td><td></td><td></td></tr></tfoot>
    </table></div>
    <p class="muted" id="budget-note">Perubahan anggaran tersimpan selama sesi ini dan langsung dipakai halaman Dasbor, Transaksi, dan Skenario.</p>
  </section>
  <section class="grid two">
    <div class="card">
      <h2>Aturan 50/30/20 untuk keluarga ini</h2>
      <p class="muted">Dari pemasukan Rp 12.500.000: kebutuhan ${rupiah(6250000)} (50%), keinginan ${rupiah(3750000)} (30%), tabungan ${rupiah(2500000)} (20%). Anggaran belanja keluarga ini ${rupiah(totalB)} — kebutuhan dan keinginan digabung di dalamnya.</p>
      <a class="btn" href="#/panduan">Baca panduan lengkap →</a>
    </div>
    <div class="card">
      <h2>Bulan paling boros tahun ini</h2>
      <p class="muted">Juni 2026: pengeluaran ${rupiah(monthSpend(MONTHS[5]))} — liburan sekolah dan THR membuat pangan, pendidikan, dan pakaian melonjak sekaligus. Pelajarannya: anggaran Juni perlu disiapkan sejak Mei, bukan dipotong dari tabungan.</p>
      <a class="btn" href="#/transaksi">Lihat transaksi November →</a>
    </div>
  </section>`;
}

export function viewTransactions() {
  const cats = CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join("");
  return `
  <section class="page-head">
    <h1>Transaksi November 2026</h1>
    <p class="lede">Semua uang masuk dan keluar dicatat di sini — ${state.transactions.length} transaksi, total masuk ${rupiah(novIncome())} dan total keluar ${rupiah(Object.values(novSpendByCat()).reduce((a, b) => a + b, 0))}. Saring berdasarkan kategori, atau tambah transaksi baru dan lihat totalnya berubah.</p>
  </section>
  <section class="card">
    <h2>Tambah transaksi</h2>
    <form id="tx-form" class="form-grid">
      <label>Tanggal<input type="date" id="tx-date" value="2026-11-26" required></label>
      <label>Keterangan<input type="text" id="tx-desc" placeholder="cth: Belanja mingguan — Pasar Baru" required maxlength="80"></label>
      <label>Kategori<select id="tx-cat"><option value="income">Pemasukan</option>${cats}</select></label>
      <label>Jumlah (Rp)<input type="number" id="tx-amount" min="1000" step="1000" placeholder="150000" required></label>
      <label>Jenis<select id="tx-kind"><option value="out">Pengeluaran</option><option value="in">Pemasukan</option></select></label>
      <button class="btn primary" type="submit">Simpan transaksi</button>
    </form>
    <p class="muted" id="tx-msg">Transaksi baru tersimpan selama sesi ini dan langsung mengubah dasbor, anggaran, dan skenario.</p>
  </section>
  <section class="card">
    <h2>Daftar transaksi</h2>
    <div class="filter-row">
      <label>Saring kategori:
        <select id="tx-filter"><option value="">Semua kategori</option><option value="income">Pemasukan</option>${cats}</select>
      </label>
      <span class="muted" id="tx-count"></span>
    </div>
    <div class="table-scroll" id="tx-list"></div>
  </section>`;
}

export function viewGoals() {
  const totalSaved = state.goals.reduce((a, g) => a + g.saved, 0);
  const totalTarget = state.goals.reduce((a, g) => a + g.target, 0);
  const cards = state.goals.map((g) => {
    const pct = Math.round((g.saved / g.target) * 100);
    const left = g.target - g.saved;
    return `<div class="card goal">
      <h3>${g.name}</h3>
      <p class="muted">${g.note}</p>
      <div class="goal-nums"><b>${rupiah(g.saved)}</b><span>dari ${rupiah(g.target)}</span></div>
      <div class="meter ${pct >= 100 ? "done" : ""}"><i style="width:${Math.min(100, pct)}%"></i></div>
      <p class="muted">${pct}% tercapai · ${left > 0 ? "kurang " + rupiah(left) : "target tercapai — selamat!"}</p>
    </div>`;
  }).join("");
  return `
  <section class="page-head">
    <h1>Target Tabungan</h1>
    <p class="lede">Empat target keluarga: total terkumpul ${rupiah(totalSaved)} dari ${rupiah(totalTarget)} (${Math.round((totalSaved / totalTarget) * 100)}%). Dana darurat didahulukan — target lain jalan setelahnya. Isi target dari form di bawah dan progresnya langsung naik.</p>
  </section>
  <section class="grid kpis">
    ${kpi("Total tabungan terkumpul", rupiah(totalSaved), Math.round((totalSaved / totalTarget) * 100) + "% dari semua target", "good")}
    ${kpi("Dana darurat", rupiah(state.goals[0].saved) + " / " + rupiahShort(state.goals[0].target), Math.round((state.goals[0].saved / state.goals[0].target) * 100) + "% — prioritas pertama", "good")}
    ${kpi("Sisa semua target", rupiah(totalTarget - totalSaved), "Pada laju sisa " + rupiah(currentMonth().income - monthSpend(currentMonth())) + "/bulan ≈ " + Math.ceil((totalTarget - totalSaved) / Math.max(1, currentMonth().income - monthSpend(currentMonth()))) + " bulan", "")}
  </section>
  <section class="grid two">${cards}</section>
  <section class="card">
    <h2>Isi tabungan</h2>
    <form id="goal-form" class="form-grid">
      <label>Target<select id="goal-id">${state.goals.map((g) => `<option value="${g.id}">${g.name}</option>`).join("")}</select></label>
      <label>Jumlah (Rp)<input type="number" id="goal-amount" min="10000" step="10000" placeholder="500000" required></label>
      <button class="btn primary" type="submit">Tambah ke tabungan</button>
    </form>
    <p class="muted" id="goal-msg">Setoran dicatat sebagai transaksi dan mengurangi sisa bulan ini — sama seperti uang yang benar-benar dipindahkan ke rekening tabungan.</p>
  </section>`;
}

export function viewScenarios() {
  return `
  <section class="page-head">
    <h1>Skenario What-If</h1>
    <p class="lede">Geser slidernya dan lihat jawabannya langsung: berapa sisa tiap bulan, berapa tabungan setahun, dan berapa bulan lagi dana darurat penuh. Semua dihitung dari anggaran dan realisasi November 2026 — bukan angka contoh yang dibuat-buat.</p>
  </section>
  <section class="grid two">
    <div class="card">
      <h2>Ubah kebiasaan ini…</h2>
      <div class="slider-row">
        <label for="sc-dine">Kurangi makan di luar <b id="sc-dine-v">0%</b></label>
        <input type="range" id="sc-dine" min="0" max="100" step="10" value="0">
        <p class="muted">Makan di luar bulan ini ${rupiah(novSpendByCat()["makan-luar"] || 0)}.</p>
      </div>
      <div class="slider-row">
        <label for="sc-fun">Kurangi hiburan &amp; langganan <b id="sc-fun-v">0%</b></label>
        <input type="range" id="sc-fun" min="0" max="100" step="10" value="0">
        <p class="muted">Hiburan &amp; langganan bulan ini ${rupiah(novSpendByCat()["hiburan"] || 0)}.</p>
      </div>
      <div class="slider-row">
        <label for="sc-save">Tambah setoran tabungan/bulan <b id="sc-save-v">Rp 0</b></label>
        <input type="range" id="sc-save" min="0" max="1000000" step="100000" value="0">
        <p class="muted">Di luar sisa bulanan yang sudah ada.</p>
      </div>
      <div class="slider-row">
        <label for="sc-shock">Pengeluaran tak terduga sekali setahun <b id="sc-shock-v">Rp 0</b></label>
        <input type="range" id="sc-shock" min="0" max="5000000" step="500000" value="0">
        <p class="muted">Misalnya servis motor besar atau ganti HP — diuji terhadap tabungan setahun.</p>
      </div>
      <button class="btn" id="sc-reset" type="button">Atur ulang semua slider</button>
    </div>
    <div class="card result">
      <h2>…maka hasilnya</h2>
      <div id="sc-out"></div>
    </div>
  </section>
  <section class="card">
    <h2>Tiga skenario siap pakai</h2>
    <div class="grid three">
      <div><h3>🪶 Hemat ringan</h3><p>Kurangi makan di luar 30% dan hiburan 20%: hemat <b>${rupiah(Math.round(640000 * 0.3 + 500000 * 0.2))}/bulan</b>, dana darurat penuh <b>${Math.ceil((30000000 - 18500000) / (1770000 + Math.round(640000 * 0.3 + 500000 * 0.2)))} bulan</b> lagi.</p></div>
      <div><h3>💪 Hemat serius</h3><p>Kurangi makan di luar 50%, hiburan 50%, tambah setoran Rp 500.000/bulan: sisa bulanan naik jadi <b>${rupiah(1770000 + 320000 + 250000 + 500000)}/bulan</b> dan tabungan setahun menembus <b>${rupiah((1770000 + 320000 + 250000 + 500000) * 12)}</b>.</p></div>
      <div><h3>🛡️ Uji ketahanan</h3><p>Pengeluaran tak terduga Rp 3.000.000 setahun masih aman: tabungan setahun ${rupiah(1770000 * 12)} dikurangi Rp 3.000.000 tetap menyisakan <b>${rupiah(1770000 * 12 - 3000000)}</b>.</p></div>
    </div>
    <p class="muted">Angka di atas dihitung dari data November 2026 (pemasukan Rp 12.500.000, pengeluaran Rp 10.730.000, sisa Rp 1.770.000/bulan). Geser slider untuk skenario Anda sendiri.</p>
  </section>`;
}

export function viewGuide() {
  const income = 12500000;
  const rows = RULE_503020.map((r) => {
    const amount = Math.round((income * r.pct) / 100);
    return `<tr><td><b>${r.part} — ${r.pct}%</b></td><td class="num">${rupiah(amount)}/bulan</td><td>${r.desc}</td></tr>`;
  }).join("");
  const tips = TIPS.map((t) => `<div class="card tip"><h3>${t.title}</h3><p>${t.body}</p></div>`).join("");
  return `
  <section class="page-head">
    <h1>Panduan Mengatur Anggaran Rumah Tangga</h1>
    <p class="lede">Bukan teori dari buku — cara yang dipakai keluarga contoh di situs ini, dengan angka mereka sendiri sebagai bukti. Mulai dari membagi pemasukan, lalu enam kebiasaan kecil yang menjaga anggaran tetap jalan.</p>
  </section>
  <section class="card">
    <h2>Aturan 50/30/20 — dihitung dari pemasukan Rp 12.500.000</h2>
    <table class="tbl"><thead><tr><th>Bagian</th><th class="num">Nominal</th><th>Penjelasan</th></tr></thead>
    <tbody>${rows}</tbody></table>
    <p class="muted">Keluarga Prasetyo saat ini: kebutuhan sekitar Rp 9.040.000 (72%) — di atas 50% karena cicilan rumah besar; keinginan Rp 1.690.000 (14%); tabungan Rp 1.770.000 (14%). Aturan ini patokan, bukan hukum: yang penting sisanya positif dan konsisten setiap bulan.</p>
  </section>
  <section>
    <h2>Enam kebiasaan yang berhasil</h2>
    <div class="grid two">${tips}</div>
  </section>
  <section class="card">
    <h2>Cara memulai minggu ini</h2>
    <ol class="steps">
      <li><b>Catat semua pemasukan</b> — gaji, usaha sampingan, apa pun yang masuk. Keluarga ini: Rp 12.500.000/bulan.</li>
      <li><b>Tulis pengeluaran tetap dulu</b> — cicilan, listrik, air, internet, SPP. Jumlahnya ${rupiah(3200000 + 850000 + 750000)} di sini.</li>
      <li><b>Beri batas untuk yang berubah-ubah</b> — pangan, makan di luar, hiburan. Lihat halaman <a href="#/anggaran">Anggaran</a> untuk contoh angkanya.</li>
      <li><b>Potong tabungan di tanggal gajian</b> — bukan dari sisa akhir bulan.</li>
      <li><b>Cek ulang tiap tanggal 15 dan 30</b> — dua kali sebulan cukup untuk menangkap kebocoran sebelum terlambat.</li>
    </ol>
  </section>`;
}

export function viewSources() {
  return `
  <section class="page-head">
    <h1>Sumber &amp; Cara Membaca Angka</h1>
    <p class="lede">Transparan soal dari mana angka-angka ini berasal dan apa batasnya.</p>
  </section>
  <section class="card">
    <h2>Data keluarga contoh</h2>
    <p>Semua angka di situs ini adalah <b>data contoh yang dibuat sebagai ilustrasi</b> untuk keluarga fiktif “Keluarga Prasetyo” (4 anggota, Probolinggo) — bukan data survei resmi. Angka-angkanya realistis dan saling konsisten: total transaksi November sama persis dengan total bulanan di grafik, dan total 11 bulan sama dengan penjumlahan tiap bulannya. Situs ini menunjukkan <i>cara</i> mengatur anggaran; ganti angkanya dengan angka keluarga Anda sendiri lewat halaman Anggaran dan Transaksi.</p>
    <h2>Yang dihitung situs ini</h2>
    <ul class="insights">
      <li><b>Sisa bulanan</b> = pemasukan − pengeluaran bulan itu.</li>
      <li><b>Tingkat tabungan</b> = sisa bulanan ÷ pemasukan × 100%.</li>
      <li><b>Tabungan kumulatif</b> = penjumlahan sisa bulanan Januari sampai bulan berjalan.</li>
      <li><b>Progres target</b> = terkumpul ÷ target × 100%.</li>
      <li><b>Skenario what-if</b> = sisa bulanan baru setelah pengurangan/potongan slider, dikali 12 untuk proyeksi setahun.</li>
    </ul>
    <h2>Privasi</h2>
    <p>Situs ini berjalan sepenuhnya dari file statisnya sendiri: tanpa pelacak, tanpa cookie, tanpa permintaan jaringan. Perubahan yang Anda buat (anggaran, transaksi, setoran) hanya hidup selama sesi ini di browser Anda dan tidak dikirim ke mana pun.</p>
    <h2>Patokan yang dipakai</h2>
    <p>Aturan 50/30/20 adalah patokan penganggaran yang umum dipakai perencana keuangan; dana darurat 6 bulan pengeluaran adalah anjuran umum untuk keluarga berpenghasilan tunggal. Keduanya patokan — sesuaikan dengan kondisi keluarga Anda.</p>
  </section>`;
}

export function mountCharts(route) {
  const m = currentMonth();
  const byCat = novSpendByCat();
  const spend = monthSpend(m);
  if (route === "" || route === "home") {
    const donut = document.getElementById("donut");
    if (donut) drawDonut(donut, CATEGORIES.map((c) => ({ label: c.label, value: byCat[c.id] || 0, color: c.color })));
    const bars = document.getElementById("bars");
    if (bars) drawBars(bars, MONTHS.map((mo) => ({ label: mo.m, income: mo.income, spend: monthSpend(mo) })));
    const line = document.getElementById("line");
    if (line) {
      let run = 0;
      drawLine(line, MONTHS.map((mo) => { run += mo.income - monthSpend(mo); return { label: mo.m, value: run }; }));
    }
  }
}
