// RumahAnggaran — data rumah tangga contoh (Keluarga Prasetyo, Probolinggo).
// Semua angka adalah contoh realistis yang konsisten satu sama lain:
// pemasukan, anggaran, pengeluaran bulanan Jan–Nov 2026, transaksi November,
// dan target tabungan. Semua tampilan situs menghitung dari data ini,
// jadi mengubah satu angka di sini mengubah seluruh situs secara konsisten.

export const HOUSEHOLD = {
  name: "Keluarga Prasetyo",
  city: "Probolinggo, Jawa Timur",
  members: 4,
  monthLabel: "November 2026",
  currency: "IDR",
};

export const CATEGORIES = [
  { id: "hunian", label: "Hunian", color: "#2f6f5e", icon: "⌂" },
  { id: "pangan", label: "Pangan & Belanja", color: "#c98a2b", icon: "◉" },
  { id: "makan-luar", label: "Makan di Luar", color: "#b4552d", icon: "🍜" },
  { id: "transport", label: "Transportasi", color: "#3a6ea5", icon: "➤" },
  { id: "tagihan", label: "Tagihan & Utilitas", color: "#6a5a8c", icon: "⚡" },
  { id: "pendidikan", label: "Pendidikan", color: "#2b7a78", icon: "✎" },
  { id: "kesehatan", label: "Kesehatan", color: "#a8324a", icon: "+" },
  { id: "hiburan", label: "Hiburan & Langganan", color: "#7a4a8c", icon: "♪" },
  { id: "pakaian", label: "Pakaian", color: "#5b7a3a", icon: "✂" },
  { id: "lainnya", label: "Lainnya", color: "#8a8a7a", icon: "•" },
];

// Anggaran bulanan yang direncanakan keluarga ini (Rp per bulan).
export const BUDGET = {
  hunian: 3200000,
  pangan: 2800000,
  "makan-luar": 650000,
  transport: 1100000,
  tagihan: 850000,
  pendidikan: 750000,
  kesehatan: 400000,
  hiburan: 500000,
  pakaian: 250000,
  lainnya: 300000,
};

// Pemasukan bulanan (Rp). Gaji tetap + usaha sampingan yang bervariasi.
export const MONTHS = [
  { m: "Jan", income: 12500000, spend: { hunian: 3200000, pangan: 2650000, "makan-luar": 720000, transport: 1050000, tagihan: 820000, pendidikan: 700000, kesehatan: 350000, hiburan: 480000, pakaian: 180000, lainnya: 260000 } },
  { m: "Feb", income: 12500000, spend: { hunian: 3200000, pangan: 2720000, "makan-luar": 610000, transport: 1080000, tagihan: 860000, pendidikan: 700000, kesehatan: 420000, hiburan: 520000, pakaian: 320000, lainnya: 290000 } },
  { m: "Mar", income: 13200000, spend: { hunian: 3200000, pangan: 2900000, "makan-luar": 780000, transport: 1120000, tagihan: 880000, pendidikan: 950000, kesehatan: 380000, hiburan: 540000, pakaian: 210000, lainnya: 340000 } },
  { m: "Apr", income: 12500000, spend: { hunian: 3200000, pangan: 2680000, "makan-luar": 590000, transport: 1060000, tagihan: 840000, pendidikan: 700000, kesehatan: 310000, hiburan: 460000, pakaian: 150000, lainnya: 240000 } },
  { m: "Mei", income: 12800000, spend: { hunian: 3200000, pangan: 2750000, "makan-luar": 660000, transport: 1150000, tagihan: 870000, pendidikan: 700000, kesehatan: 460000, hiburan: 510000, pakaian: 280000, lainnya: 310000 } },
  { m: "Jun", income: 14100000, spend: { hunian: 3200000, pangan: 3100000, "makan-luar": 940000, transport: 1280000, tagihan: 910000, pendidikan: 1250000, kesehatan: 520000, hiburan: 680000, pakaian: 540000, lainnya: 480000 } },
  { m: "Jul", income: 12500000, spend: { hunian: 3200000, pangan: 2700000, "makan-luar": 630000, transport: 1090000, tagihan: 850000, pendidikan: 700000, kesehatan: 390000, hiburan: 500000, pakaian: 190000, lainnya: 270000 } },
  { m: "Agu", income: 12700000, spend: { hunian: 3200000, pangan: 2820000, "makan-luar": 700000, transport: 1110000, tagihan: 860000, pendidikan: 700000, kesehatan: 430000, hiburan: 530000, pakaian: 230000, lainnya: 300000 } },
  { m: "Sep", income: 12500000, spend: { hunian: 3200000, pangan: 2660000, "makan-luar": 580000, transport: 1070000, tagihan: 830000, pendidikan: 700000, kesehatan: 360000, hiburan: 470000, pakaian: 160000, lainnya: 250000 } },
  { m: "Okt", income: 13000000, spend: { hunian: 3200000, pangan: 2780000, "makan-luar": 690000, transport: 1130000, tagihan: 880000, pendidikan: 700000, kesehatan: 410000, hiburan: 560000, pakaian: 290000, lainnya: 330000 } },
  { m: "Nov", income: 12500000, spend: { hunian: 3200000, pangan: 2740000, "makan-luar": 640000, transport: 1100000, tagihan: 850000, pendidikan: 750000, kesehatan: 400000, hiburan: 500000, pakaian: 250000, lainnya: 300000 } },
];

// Transaksi November 2026 (Rp). Jumlah per kategori sama dengan MONTHS Nov.
export const TRANSACTIONS = [
  { date: "2026-11-01", desc: "Gaji bulanan — PT Sinar Abadi", cat: "income", amount: 10000000 },
  { date: "2026-11-01", desc: "Cicilan rumah (KPR)", cat: "hunian", amount: -3200000 },
  { date: "2026-11-02", desc: "Belanja mingguan — Pasar Baru", cat: "pangan", amount: -685000 },
  { date: "2026-11-03", desc: "Bensin motor (Pertalite)", cat: "transport", amount: -120000 },
  { date: "2026-11-04", desc: "Listrik PLN (token)", cat: "tagihan", amount: -320000 },
  { date: "2026-11-05", desc: "Makan malam keluarga — warung soto", cat: "makan-luar", amount: -185000 },
  { date: "2026-11-06", desc: "SPP sekolah Azzam", cat: "pendidikan", amount: -450000 },
  { date: "2026-11-07", desc: "Belanja mingguan — supermarket", cat: "pangan", amount: -590000 },
  { date: "2026-11-08", desc: "Langganan streaming film", cat: "hiburan", amount: -65000 },
  { date: "2026-11-09", desc: "Air PDAM", cat: "tagihan", amount: -145000 },
  { date: "2026-11-10", desc: "Jualan kue — order tetangga", cat: "income", amount: 850000 },
  { date: "2026-11-10", desc: "Beli buku & alat tulis", cat: "pendidikan", amount: -300000 },
  { date: "2026-11-11", desc: "Bensin motor (Pertalite)", cat: "transport", amount: -110000 },
  { date: "2026-11-12", desc: "Makan siang — nasi padang", cat: "makan-luar", amount: -95000 },
  { date: "2026-11-13", desc: "Belanja mingguan — Pasar Baru", cat: "pangan", amount: -640000 },
  { date: "2026-11-14", desc: "Servis motor + ganti oli", cat: "transport", amount: -275000 },
  { date: "2026-11-15", desc: "Internet rumah (WiFi)", cat: "tagihan", amount: -250000 },
  { date: "2026-11-16", desc: "Obat & vitamin apotek", cat: "kesehatan", amount: -185000 },
  { date: "2026-11-17", desc: "Belanja mingguan — supermarket", cat: "pangan", amount: -610000 },
  { date: "2026-11-18", desc: "Makan malam — ayam geprek", cat: "makan-luar", amount: -120000 },
  { date: "2026-11-19", desc: "Paket data HP (2 nomor)", cat: "tagihan", amount: -135000 },
  { date: "2026-11-20", desc: "Jualan kue — order kantor", cat: "income", amount: 1650000 },
  { date: "2026-11-20", desc: "Baju anak — diskon akhir pekan", cat: "pakaian", amount: -250000 },
  { date: "2026-11-21", desc: "Belanja mingguan — Pasar Baru", cat: "pangan", amount: -215000 },
  { date: "2026-11-22", desc: "Tiket bioskop keluarga (4 orang)", cat: "hiburan", amount: -220000 },
  { date: "2026-11-23", desc: "Bensin motor (Pertalite)", cat: "transport", amount: -115000 },
  { date: "2026-11-24", desc: "Periksa gigi — puskesmas", cat: "kesehatan", amount: -215000 },
  { date: "2026-11-25", desc: "Makan siang — bakso", cat: "makan-luar", amount: -140000 },
  { date: "2026-11-26", desc: "Langganan musik + game", cat: "hiburan", amount: -215000 },
  { date: "2026-11-26", desc: "Ongkir & parkir", cat: "transport", amount: -480000 },
  { date: "2026-11-26", desc: "Iuran RT + kebersihan", cat: "lainnya", amount: -300000 },
  { date: "2026-11-26", desc: "Makan malam — sate ayam", cat: "makan-luar", amount: -100000 },
];

// Target tabungan keluarga (Rp).
export const GOALS = [
  { id: "darurat", name: "Dana Darurat", target: 30000000, saved: 18500000, note: "6 bulan pengeluaran pokok — pelindung pertama keluarga." },
  { id: "liburan", name: "Liburan Keluarga", target: 8000000, saved: 3200000, note: "Liburan akhir tahun ke Malang — berangkat bila 100%." },
  { id: "motor", name: "DP Motor Baru", target: 12000000, saved: 5000000, note: "Ganti motor lama yang sudah 5 tahun — cicilan ringan." },
  { id: "sekolah", name: "Dana Pendidikan Anak", target: 20000000, saved: 7500000, note: "Tabungan masuk SMP Azzam dua tahun lagi." },
];

// Aturan praktis 50/30/20 untuk panduan.
export const RULE_503020 = [
  { part: "Kebutuhan", pct: 50, desc: "Hunian, pangan, transportasi, tagihan, kesehatan — yang wajib dibayar tiap bulan." },
  { part: "Keinginan", pct: 30, desc: "Makan di luar, hiburan, langganan, pakaian — boleh, tapi dibatasi anggarannya." },
  { part: "Tabungan", pct: 20, desc: "Dana darurat dulu, lalu target lain. Potong di awal gajian, bukan dari sisa." },
];

export const TIPS = [
  { title: "Bayar diri sendiri dulu", body: "Pindahkan tabungan begitu gaji masuk — sebelum belanja apa pun. Keluarga ini menyisihkan Rp 1.700.000 di tanggal 1, dan itulah kenapa dana daruratnya sudah 62%." },
  { title: "Satu dompet untuk jajan", body: "Makan di luar dan hiburan digabung dalam satu amplop Rp 1.140.000/bulan. Kalau amplop habis, jajan berhenti sampai bulan depan — tanpa rasa bersalah, tanpa utang." },
  { title: "Belanja mingguan, bukan harian", body: "Empat kali belanja pasar seminggu sekali lebih murah daripada belanja harian: lebih sedikit jajan impulsif, lebih sedikit makanan terbuang." },
  { title: "Cek tagihan tiap tanggal 15", body: "Listrik, air, internet dan paket data dicek di tengah bulan. Tagihan yang melonjak ketahuan sebelum jatuh tempo — bukan setelah uang habis." },
  { title: "Dana darurat sebelum liburan", body: "Liburan hanya berangkat bila dana darurat sudah penuh. Liburan yang dibayar dari dana darurat berubah jadi utang di bulan berikutnya." },
  { title: "Catat, jangan dihafal", body: "Keluarga ini mencatat 31 transaksi di November. Pengeluaran yang tidak dicatat rata-rata 20% lebih besar dari yang dikira — karena yang kecil-kecil tidak terasa." },
];
