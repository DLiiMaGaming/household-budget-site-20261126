// RumahAnggaran — entrypoint penyerahan (program/v1, Node 22, stdlib saja).
//
// Tugas program ini: menyalin situs statis di app/ dan screenshot di
// screenshots/ dari repo ini ke direktori output, lalu menulis
// /output/dossier.json dengan buildDossier dari vendor/makefun-frontend.ts
// (salinan kit yang tidak diubah). Di luar grader, MAKEFUN_OUTPUT_DIR
// menggantikan /output:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Program berjalan dua kali dan kedua hasil harus identik byte per byte,
// jadi tidak ada stempel waktu atau angka acak yang ditulis ke output.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const root = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });
cpSync(join(root, "app"), join(outDir, "app"), { recursive: true });
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(join(root, "screenshots"))) {
  cpSync(join(root, "screenshots"), join(outDir, "screenshots"), { recursive: true });
}

// Batas yang sama dengan gate penilai: teks dossier dibatasi 160 KiB,
// maksimal 4 screenshot @ 256 KiB, app/ maksimal 993 entri / 16 MiB.
writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
