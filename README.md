# RumahAnggaran — Household Budget Planner

[![make.fun bounty](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/DLiiMaGaming/household-budget-site-20261126/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/DLiiMaGaming/household-budget-site-20261126/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)

**RumahAnggaran** is a working household budget site for an Indonesian family,
built for make.fun's
[“Make the best household budget site”](https://make.fun/c/best-household-budget-site-20261126-1457)
bounty. It runs entirely offline from static files — no network requests, no
trackers, no cookies. Every figure is computed live from the example
household's data, so editing a budget, adding a transaction, or moving a
slider updates every page.

## What it covers

- **Dasbor** — monthly income vs spending, savings rate, spending donut,
  11-month income-vs-spending bars, cumulative savings line, insights, top
  categories, latest transactions
- **Anggaran** — per-category budget vs actual with editable amounts, live
  totals, over-budget warnings, 50/30/20 comparison
- **Transaksi** — full November ledger (31 transactions), filter by category,
  add-your-own form that recomputes every total
- **Target** — 4 savings goals with progress bars and a contribute form
  (emergency fund, family holiday, new motorbike down payment, school fund)
- **What-If** — sliders that recompute monthly surplus, yearly savings, and
  months until the emergency fund is full, live
- **Panduan** — the 50/30/20 rule computed from the family's real income,
  six budgeting habits that work, a start-this-week checklist
- **Sumber** — where every number comes from and how each figure is computed

## How it works

- Plain static files under `app/` — no build step, no framework, no libraries.
- Charts are drawn on `<canvas>` by `app/charts.js` (donut, grouped bars,
  line) with hover tooltips.
- Hash routing and all interactions in `app/app.js`; pages in `app/views.js`;
  data in `app/data.js`.
- Works on desktop and phone; responsive layout down to small screens.

## Run it locally

```sh
node serve.ts
# open http://localhost:8080
```

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the kit's vendored `vendor/makefun-frontend.ts`.

## License

MIT — see [LICENSE](LICENSE).
