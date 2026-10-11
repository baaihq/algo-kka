# 🚀 Ekspedisi Kode: Stasiun Logika

**Game edukasi pemrograman blok (block-based programming)** untuk mata pelajaran **Koding & Kecerdasan Artifisial (KKA)** — SMA/MA **Kelas X**, materi **percabangan (`JIKA–MAKA–SELAIN ITU`)**.

Siswa menyusun blok perintah untuk **"memprogram" robot ALGO** agar berhasil melewati seluruh uji kasus stasiun. Ringan, berjalan langsung di browser HP/laptop, dan **tanpa jaringan (offline-first)**.

> Dikembangkan dengan React + TypeScript + Vite + Tailwind CSS, dibuat di **Google AI Studio**.

---

## 🎮 Sekilas Permainan

Siswa berperan sebagai teknisi muda Stasiun Logika. Tugasnya membantu robot **ALGO** mengambil keputusan dengan menyusun blok:

- **Percabangan 1-arah** → `JIKA … MAKA …`
- **Percabangan 2-arah** → `JIKA … MAKA … SELAIN ITU …`

Program yang disusun diuji otomatis pada beberapa **kasus uji** (data sensor berbeda).
Level dinyatakan **lulus hanya jika seluruh kasus uji benar**.

---

## ✨ Fitur

- 🧱 **Editor blok** — susun program dengan ketuk/seret, ramah untuk HP.
- 📈 **Progression tingkat kesulitan** — Mudah (contoh) → Menengah (kerangka perlu dilengkapi) → Sulit (susun dari nol).
- 🧪 **Evaluasi multi-kasus otomatis** — semua skenario diuji sekaligus + umpan balik per kasus.
- ▶️ **Mode Jalankan** — animasi langkah demi langkah + monitor log eksekusi.
- 🔀 **Varian soal per tim** — soal tiap kelompok berbeda (dipilih deterministik dari nama tim), konsisten & adil.
- 💡 **Petunjuk bertahap** — terbuka otomatis setelah 3× gagal berturut-turut, atau dibuka manual.
- ⭐ **Bintang & Badge** — 6 level × 3 bintang = **18 bintang** total.
- 🏆 **Leaderboard Top 5** — papan peringkat tim (per perangkat).
- 📘 **Tutorial interaktif** — 4 langkah mengenal percabangan sebelum bermain.
- 🔊 **Efek suara sintetis** (Web Audio) + tombol mute.
- 💾 **Autosave** — progres tersimpan otomatis di perangkat.

---

## 🗺️ Alur Permainan

1. **Masuk Tim** — isi nama tim (2–30 karakter).
2. **Peta Stasiun** — buka tutorial atau pilih level (terbuka berurutan).
3. **Editor Level**
   - **Arena** — adegan ALGO + data sensor kasus uji.
   - **Area Program** — bingkai `MULAI … SELESAI` tempat blok disusun.
   - **Palet Blok** — daftar blok perintah yang tersedia untuk level tsb.
4. **▶ Jalankan** untuk melihat alur eksekusi; **🧪 Uji** untuk menguji semua kasus.
5. **Hasil** — bintang + rincian tiap kasus → lanjut **Level Berikutnya**.
6. **Peta** — pantau bintang, badge, dan leaderboard.

---

## 📚 Daftar Level

| # | Level | Konsep | Tingkat | Fokus |
|---|-------|--------|---------|-------|
| 1 | Gerbang Tamu | 1-arah | Mudah | Contoh program; memahami alur `JIKA–MAKA` |
| 2 | Gerbang Tamu — Menengah | 1-arah | Menengah | Lengkapi operator & isi rongga `MAKA` |
| 3 | Gerbang Tamu — Sulit | 1-arah | Sulit | Susun dari nol; teliti batas `>` vs `>=` |
| 4 | Lulus atau Remidi | 2-arah | Mudah | Contoh `JIKA–MAKA–SELAIN ITU` |
| 5 | Lulus atau Remidi — Menengah | 2-arah | Menengah | Operator `<=` + jebakan batas (mis. 51 vs 50) |
| 6 | Lulus atau Remidi — Sulit | 2-arah | Sulit | Dua keputusan berurutan dalam satu alur |

Setiap level memiliki **10 varian** (ditentukan dari hash nama tim, total 60 varian) dan **3–5 kasus uji** (termasuk kasus tepat di ambang batas).

---

## 🧩 Blok & Operator

- **Struktur:** `JIKA … MAKA` · `SELAIN ITU` · `JIKA … MAKA … SELAIN ITU`
- **Aksi:** Izinkan Masuk · Buka Gerbang · Tolak Masuk · Tampilkan Pesan
- **Operator:** `=` · `!=` · `>` · `>=` · `<` · `<=`

---

## 🏆 Penilaian

- **Bintang:** lulus semua kasus → 3 bintang (maks. 18).
- **Badge (5):**

  | Badge | Syarat |
  |---|---|
  | 🤖 Kadet ALGO | Memulai ekspedisi |
  | ⚡ Penyelesai Cepat | Lulus level tanpa memicu bantuan petunjuk |
  | ✨ Logika Sempurna | Lulus level tanpa sekali pun gagal |
  | 🛡️ Ahli Percabangan | Menuntaskan level "Lulus atau Remidi" |
  | 🏆 Inspektur Stasiun | Menuntaskan **semua 6 level** dengan 3 bintang |

- **Leaderboard:** Top 5 tim berdasarkan bintang & badge.

---

## 🚀 Menjalankan Secara Lokal

**Prasyarat:** Node.js 18+

```bash
npm install
npm run dev     # http://localhost:3000
```

Perintah lain:

```bash
npm run build   # build produksi
npm run preview # pratinjau hasil build
npm run lint    # cek tipe (tsc --noEmit)
```

---

## 🛠️ Teknologi

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4**
- `lucide-react` (ikon) · `motion` (animasi) · `canvas-confetti` (efek perayaan)
- **Web Audio API** — efek suara disintesis (tanpa berkas audio)
- **localStorage** — penyimpanan progres (offline, tanpa backend)
- Dibangun di **Google AI Studio**

---

## 📁 Struktur Proyek

```
src/
├── components/            # UI: arena, editor, palet, modal, tutorial
│   ├── ArenaView.tsx
│   ├── ArenaAnimationOverlay.tsx
│   ├── BlockItem.tsx
│   ├── BlockPalette.tsx
│   ├── ProgramArea.tsx
│   ├── RobotAlgo.tsx
│   ├── LevelEditor.tsx
│   ├── StationMap.tsx
│   ├── TeamScreen.tsx
│   ├── TestResultModal.tsx
│   ├── HintModal.tsx
│   ├── BadgeListModal.tsx
│   ├── LeaderboardModal.tsx
│   └── InteractiveTutorial.tsx
├── data/
│   ├── levels.ts          # definisi 6 level + varian + kasus uji
│   └── badges.ts          # definisi badge
├── services/
│   ├── interpreter.ts     # menjalankan program blok → daftar kejadian + jejak
│   ├── evaluator.ts       # membandingkan hasil dengan harapan tiap kasus
│   └── storage.ts         # localStorage: progres, badge, leaderboard, tutorial
├── types/
│   └── game.ts            # tipe data game
├── utils/
│   ├── hash.ts            # pemilih varian tim (deterministik)
│   └── audio.ts           # efek suara Web Audio
├── App.tsx                # alur layar: Masuk Tim → Peta → Editor
├── index.css
└── main.tsx
```

---

## 📝 Catatan

- **Offline-first:** seluruh permainan berjalan tanpa jaringan; data tersimpan di perangkat (`localStorage`).
- **Progres & leaderboard bersifat per perangkat.** Gunakan **Reset** / **Ganti Tim** untuk berganti tim pada perangkat yang sama.
- **Tanpa backend** — papan peringkat menampilkan tim yang bermain di perangkat tersebut.

---

## 👤 Kredit

Materi & pengembangan: **Achmad Baihaqih, S.Si** — MAN Aceh Singkil
Mata pelajaran **Koding & Kecerdasan Artifisial (KKA)**, Kelas X.
