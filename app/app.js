// RumahAnggaran — router hash dan pengkabelan interaksi.
// Rute: #/ (dasbor), #/anggaran, #/transaksi, #/target, #/skenario,
// #/panduan, #/sumber. Semua perubahan (anggaran, transaksi, setoran,
// slider) menghitung ulang dari state dan me-render ulang halaman aktif.

import { CATEGORIES, MONTHS } from "./data.js";
import { rupiah } from "./charts.js";
import { state, viewHome, viewBudget, viewTransactions, viewGoals, viewScenarios, viewGuide, viewSources, txTable, mountCharts, monthSpend, currentMonth, novSpendByCat, novIncome, totalBudget } from "./views.js";

const ROUTES = {
  "": { title: "Dasbor", render: viewHome },
  anggaran: { title: "Anggaran", render: viewBudget },
  transaksi: { title: "Transaksi", render: viewTransactions },
  target: { title: "Target Tabungan", render: viewGoals },
  skenario: { title: "Skenario What-If", render: viewScenarios },
  panduan: { title: "Panduan", render: viewGuide },
  sumber: { title: "Sumber", render: viewSources },
};

const app = document.getElementById("app");

function route() {
  const key = location.hash.replace(/^#\/?/, "").split("?")[0];
  const r = ROUTES[key] || ROUTES[""];
  app.innerHTML = r.render();
  document.querySelectorAll("nav a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === "#/" + key || (key === "" && a.getAttribute("href") === "#/"));
  });
  document.title = "RumahAnggaran — " + r.title;
  mountCharts(key);
  wire(key);
  window.scrollTo(0, 0);
}

function wire(key) {
  if (key === "anggaran") wireBudget();
  if (key === "transaksi") wireTransactions();
  if (key === "target") wireGoals();
  if (key === "skenario") wireScenarios();
}

function wireBudget() {
  document.querySelectorAll(".budget-input").forEach((input) => {
    input.addEventListener("change", () => {
      const v = Math.max(0, Math.round(Number(input.value) || 0));
      state.budget[input.dataset.cat] = v;
      input.value = v;
      const byCat = novSpendByCat();
      const totalS = Object.values(byCat).reduce((a, b) => a + b, 0);
      const totalB = totalBudget();
      document.getElementById("budget-total").textContent = rupiah(totalB);
      document.getElementById("budget-total-foot").textContent = rupiah(totalB);
      document.getElementById("budget-left").textContent = rupiah(totalB - totalS);
      document.getElementById("budget-note").textContent =
        "Anggaran " + (input.dataset.cat ? (CATEGORIES.find((c) => c.id === input.dataset.cat) || {}).label : "") +
        " diubah menjadi " + rupiah(v) + ". Total anggaran sekarang " + rupiah(totalB) + ".";
    });
  });
}

function wireTransactions() {
  const listEl = document.getElementById("tx-list");
  const countEl = document.getElementById("tx-count");
  const filterEl = document.getElementById("tx-filter");
  function renderList() {
    const f = filterEl.value;
    const list = [...state.transactions].reverse().filter((t) => !f || t.cat === f);
    listEl.innerHTML = txTable(list);
    const out = list.filter((t) => t.amount < 0).reduce((a, t) => a + -t.amount, 0);
    const inn = list.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0);
    countEl.textContent = list.length + " transaksi · masuk " + rupiah(inn) + " · keluar " + rupiah(out);
  }
  filterEl.addEventListener("change", renderList);
  renderList();
  document.getElementById("tx-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const date = document.getElementById("tx-date").value;
    const desc = document.getElementById("tx-desc").value.trim();
    const cat = document.getElementById("tx-cat").value;
    const amount = Math.round(Number(document.getElementById("tx-amount").value) || 0);
    const kind = document.getElementById("tx-kind").value;
    if (!date || !desc || amount <= 0) return;
    state.transactions.push({ date, desc, cat, amount: kind === "in" ? amount : -amount });
    document.getElementById("tx-msg").textContent =
      "Tersimpan: " + desc + " (" + (kind === "in" ? "+" : "−") + rupiah(amount) + "). Total transaksi sekarang " + state.transactions.length + ".";
    e.target.reset();
    document.getElementById("tx-date").value = "2026-11-26";
    renderList();
  });
}

function wireGoals() {
  document.getElementById("goal-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("goal-id").value;
    const amount = Math.round(Number(document.getElementById("goal-amount").value) || 0);
    if (amount <= 0) return;
    const g = state.goals.find((x) => x.id === id);
    g.saved += amount;
    state.transactions.push({ date: "2026-11-26", desc: "Setoran tabungan — " + g.name, cat: "lainnya", amount: -amount });
    document.getElementById("goal-msg").textContent =
      "Setoran " + rupiah(amount) + " masuk ke " + g.name + " — sekarang " + rupiah(g.saved) + " dari " + rupiah(g.target) +
      " (" + Math.round((g.saved / g.target) * 100) + "%).";
    route();
    document.getElementById("goal-msg").textContent =
      "Setoran " + rupiah(amount) + " masuk ke " + g.name + " — sekarang " + rupiah(g.saved) + " dari " + rupiah(g.target) +
      " (" + Math.round((g.saved / g.target) * 100) + "%).";
  });
}

function wireScenarios() {
  const m = currentMonth();
  const baseSpend = monthSpend(m);
  const baseSaved = m.income - baseSpend;
  const dineBase = novSpendByCat()["makan-luar"] || 0;
  const funBase = novSpendByCat()["hiburan"] || 0;
  const goal = state.goals[0];
  const out = document.getElementById("sc-out");
  function fmt(n) { return rupiah(Math.round(n)); }
  function compute() {
    const dineCut = Number(document.getElementById("sc-dine").value);
    const funCut = Number(document.getElementById("sc-fun").value);
    const extra = Number(document.getElementById("sc-save").value);
    const shock = Number(document.getElementById("sc-shock").value);
    document.getElementById("sc-dine-v").textContent = dineCut + "%";
    document.getElementById("sc-fun-v").textContent = funCut + "%";
    document.getElementById("sc-save-v").textContent = fmt(extra);
    document.getElementById("sc-shock-v").textContent = fmt(shock);
    const savedMonth = baseSaved + (dineBase * dineCut) / 100 + (funBase * funCut) / 100 + extra;
    const savedYear = savedMonth * 12 - shock;
    const monthsToGoal = Math.max(0, Math.ceil((goal.target - goal.saved) / Math.max(1, savedMonth)));
    const rate = Math.round((savedMonth / m.income) * 100);
    out.innerHTML = `
      <div class="sc-result">
        <div><span>Sisa tiap bulan</span><b class="${savedMonth >= baseSaved ? "good" : ""}">${fmt(savedMonth)}</b><span class="muted">sebelumnya ${fmt(baseSaved)} (${savedMonth >= baseSaved ? "+" : ""}${fmt(savedMonth - baseSaved)})</span></div>
        <div><span>Tingkat tabungan</span><b>${rate}%</b><span class="muted">dari pemasukan ${fmt(m.income)} · target 20%</span></div>
        <div><span>Tabungan setahun</span><b>${fmt(savedYear)}</b><span class="muted">12 × sisa bulanan${shock ? " − " + fmt(shock) + " tak terduga" : ""}</span></div>
        <div><span>Dana darurat penuh dalam</span><b>${monthsToGoal} bulan</b><span class="muted">kurang ${fmt(goal.target - goal.saved)} lagi · sekarang ${Math.round((goal.saved / goal.target) * 100)}%</span></div>
      </div>
      <div class="meter big"><i style="width:${Math.min(100, rate * 4)}%"></i></div>
      <p class="muted">Batang di atas: tingkat tabungan terhadap skala 25%. ${rate >= 20 ? "Target 20% tercapai — pertahankan." : "Belum 20% — geser slider hemat sampai batangnya melewati 80%."}</p>`;
  }
  ["sc-dine", "sc-fun", "sc-save", "sc-shock"].forEach((id) => {
    document.getElementById(id).addEventListener("input", compute);
  });
  document.getElementById("sc-reset").addEventListener("click", () => {
    ["sc-dine", "sc-fun", "sc-save", "sc-shock"].forEach((id) => { document.getElementById(id).value = 0; });
    compute();
  });
  compute();
}

window.addEventListener("hashchange", route);
route();
