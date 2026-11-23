# CLAUDE.md

Aturan kerja untuk proyek website portofolio. Komunikasi dengan user dalam **bahasa Indonesia**; kode, identifier, dan commit message dalam bahasa Inggris.

## Proyek

- Stack: **Vite + React + Tailwind CSS**. Motion: CSS (transition/keyframes) dan Framer Motion (`motion/react`) bila perlu.
- **Dilarang**: Three.js, WebGL, shader, atau 3D berat. Efek "berdimensi" dibuat dengan CSS transform.
- Jangan menambah dependency tanpa alasan jelas. Tanya user dulu.
- Arsip skill di `C:\Users\sarif\arsip-skills\` (`ecc`, `ui-ux-pro-max-skill`, `taste-skill`, `impeccable`, `andrej-karpathy-skills`) hanya **referensi**. Baca bagian yang relevan saat dibutuhkan, jangan disalin atau dipasang ke proyek.

## 1. Disiplin kerja

**Pikir dulu.** Nyatakan asumsi. Jika ada beberapa tafsir, sajikan, jangan pilih diam-diam. Jika ada cara yang lebih sederhana, katakan. Jika ambigu, berhenti dan tanya.

**Sederhana dulu.** Kode minimum yang menyelesaikan masalah. Tidak ada fitur, abstraksi, atau "fleksibilitas" yang tidak diminta. Jika 200 baris bisa jadi 50, tulis ulang.

**Surgical changes.** Sentuh hanya yang perlu.
- Setiap baris yang berubah harus bisa ditelusuri langsung ke permintaan user.
- Jangan "memperbaiki" kode, komentar, atau format di sekitarnya. Jangan refactor yang tidak rusak.
- Ikuti gaya yang sudah ada, walau Anda akan menulisnya berbeda.
- Dead code lama: laporkan, jangan hapus. Hapus hanya import/variabel/fungsi yang **jadi yatim karena perubahan Anda**.

**Berbasis tujuan.** Ubah tugas jadi kriteria yang bisa diverifikasi. Untuk tugas multi-langkah, tulis rencana singkat:
```
1. [Langkah] → verify: [cek]
2. [Langkah] → verify: [cek]
```
Jangan klaim selesai sebelum build/lint lolos dan hasil visual dicek di browser (desktop dan lebar mobile). Laporkan hasil apa adanya, termasuk yang gagal.

**Sesi terbatas.** Kerjakan hanya cakupan sesi. Jangan init, scaffold, atau menulis kode di luar yang diminta.

## 2. Hindari tampilan generik ("AI slop")

Tolok ukur: tampak dirancang untuk **satu orang ini**, bukan dari template.

- **Satu sistem desain**: token warna, tipografi, spasi, radius, dan easing didefinisikan sekali di Tailwind theme/CSS variable. Tidak ada nilai acak di komponen.
- **Tipografi punya karakter**: jangan default ke font sistem/Inter tanpa alasan. Pilih sepasang font dan pertahankan. Font maksimal 4 file, `font-display: swap`.
- **Warna terkendali**: satu aksen. Hindari gradien ungu/biru-neon, cyan-di-atas-hitam, glow berlebihan, glassmorphism sebagai dekorasi, gradient text.
- **Hindari pola klise**: grid kartu identik (ikon + judul + teks), hero-metric, kartu bersarang, eyebrow di atas heading, nomor seksi 01/02/03, emoji sebagai ikon, border satu sisi pada kotak bulat.
- **Copy lugas dan spesifik**: tanpa lorem ipsum, tanpa klise ("passionate", "crafting digital experiences"), tanpa hedging. Jangan mengarang klaim, klien, testimoni, atau angka. Pakai placeholder yang jelas bertanda bila konten asli belum ada.
- **Tata letak**: satu ide per layar, tepi konten kiri dan kanan sejajar, ruang napas konsisten. Tanpa caption di bawah gambar kecuali memang perlu.
- **Setiap elemen harus punya alasan.** Tidak ada ornamen demi ornamen.

## 3. Performa dan gerak ringan

- Animasikan **hanya `transform` dan `opacity`** (warna boleh). Jangan menganimasikan `width`, `height`, `top`, `left`, `margin`, `padding`.
- **Satu momen fokus** per halaman (mis. entrance hero, 500–800 ms). Jangan reveal-on-scroll berulang di tiap seksi.
- Durasi: 100–150 ms feedback, 150–300 ms perubahan state, 300–500 ms overlay/transisi, entrance utama ≤ 800 ms. Keluar lebih cepat dari masuk.
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`. Tanpa bounce/elastic.
- Hover: elemen yang di-hover diam, **anak** yang bergerak (hindari flicker di tepi). Hover kartu ≈ naik 2px, foto zoom 1.02–1.03 di dalam frame.
- `will-change` hanya selama animasi berjalan.
- Satu loop `requestAnimationFrame` per efek. **Pause** saat tab hidden dan saat elemen di luar layar (`IntersectionObserver`/`visibilitychange`).
- Wajib jalur **`prefers-reduced-motion`** untuk setiap animasi: kurangi gerak spasial, pertahankan perubahan opacity/warna yang bermakna. Loop dan partikel berhenti, tampilkan state akhir.
- Konten harus terlihat walau JS animasi gagal (jangan `opacity: 0` sebagai state awal tanpa fallback).
- Gambar: AVIF/WebP, `srcset`, `loading="lazy"` di bawah fold, dimensi eksplisit. Target: CLS < 0.1, Lighthouse performance ≥ 90.
- Efek berat (canvas) maksimal **satu**, terisolasi di komponennya, dan bisa dimatikan lewat satu prop/flag.

## 4. Elemen visual proyek

Ketiga elemen ini **pengecualian yang disengaja** dari preferensi `taste-skill` (yang melarang carousel, scramble, dan efek kursor). Keputusan user menang, tetapi tetap subtil dan terkendali.

1. **Curved carousel** (ref: mathiasadolfsson.dev). Item tersusun pada busur memakai `perspective`, `rotateY`, `translateZ`, `scale`, dan `opacity` berdasarkan jarak dari tengah. Hanya transform/opacity. Tanpa auto-advance. Sediakan kontrol prev/next dan keyboard. Di reduced-motion: tampilan datar tanpa rotasi.
2. **Text scramble hover** (ref: astapable.com) pada tombol navbar. Karakter diacak dari set terbatas lalu resolve kiri→kanan sekitar 300–500 ms, hanya saat hover/focus. Lebar dikunci agar tidak ada layout shift. Pertahankan teks asli untuk aksesibilitas (`aria-label` atau teks tersembunyi). Reduced-motion: tampilkan teks final tanpa acak. Jangan dipakai di luar navbar tanpa persetujuan.
3. **Background responsif kursor**: cahaya gradien lembut yang mengikuti kursor (CSS variable `--x`/`--y` dengan rAF + lerp) dan partikel debu halus di **satu `<canvas>` 2D** (kira-kira 40–80 partikel, DPR dibatasi, opasitas rendah). Bukan "glowing particles" neon. Nonaktif di perangkat sentuh (`pointer: coarse`) dan reduced-motion. Pause saat hidden/offscreen.

## 5. Struktur dan konvensi

```
src/
  components/   komponen UI kecil dan dapat dipakai ulang
  effects/      CurvedCarousel, ScrambleText, CursorBackdrop (terisolasi, bisa dimatikan)
  sections/     Hero, Work, About, Contact, dst. (satu seksi per file)
  hooks/        useX.js/ts (mis. useReducedMotion, usePointer)
  lib/          util murni tanpa React
  styles/       index.css, token/theme
  assets/       gambar, font
public/
```
- Satu komponen per file, **PascalCase**; hook diawali `use`; util dan aset huruf kecil dengan tanda hubung.
- Tailwind utility + token theme. Hindari inline style acak kecuali nilai dinamis (mis. `--x`/`--y`).
- Semantic HTML dulu, ARIA hanya pelengkap. Fokus keyboard terlihat. Kontras WCAG 2.1 AA (dicek, bukan ditebak).
- Responsif mobile-first. Uji di lebar 390, 768, 1024, 1440.
- Commit kecil dan terfokus, satu tujuan per commit. Jangan commit rahasia (`.env`).
- Jangan buat file dokumentasi atau komentar berlebihan. Komentar hanya untuk "mengapa" yang tidak jelas dari kode.
