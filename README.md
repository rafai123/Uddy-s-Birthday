# 🎉 Selamat Ulang Tahun ke-24, Sayang ❤️ | Dunia Kenangan Kita

Aplikasi web interaktif spesial perayaan ulang tahun ke-24, dibangun berdasarkan dokumen desain & layout UX [a_detailed_infographic_ux_design_document_layout_o.png](a_detailed_infographic_ux_design_document_layout_o.png).

---

## 🚀 Cara Menjalankan

### Cara Paling Mudah (Windows):
Cukup **klik dua kali file `start.bat`**. 
Script ini akan otomatis menyalakan server lokal dan langsung membuka browser Anda di `http://localhost:8080`.

### Atau Melalui Terminal / Command Prompt:
```bash
python -m http.server 8080
```
Lalu buka browser di: **http://localhost:8080**

*(Catatan: Karena aplikasi menggunakan JavaScript ES Modules modern, aplikasi perlu dijalankan melalui server lokal seperti di atas agar browser dapat memuat modul dan foto dengan sempurna).*

---

## 🌟 Fitur & Alur Sesuai Spesifikasi Desain

### 1. Opening Cinematic (10–15 Detik)
1. **01 Romantic Loading**: Layar gelap bertabur bintang dengan animasi hati berdenyut bercahaya (*pulsing heart glow*) dan kalimat pembuka yang manis.
2. **02 Fireworks Celebration**: Pesta kembang api canvas 2D bermunculan dari berbagai arah dengan partikel bintang dan hati.
3. **03 Birthday Reveal**: Kemunculan teks berkilau:
   - *"Selamat Ulang Tahun ke-24, Sayang ❤️"*
   - *"Hari ini dunia merayakan seseorang yang sangat berarti bagiku."*
   - *"26 NOVEMBER 2026"*
4. **04 Cake & Lilin Interaktif**:
   - Kue ulang tahun dengan angka emas **"24"** dan 24 lilin beranimasi api berkedip.
   - Pilihan: **[Tiup Lilin 🎂]** atau **[Jelajahi Dunia Kita ✨]**.
   - **Interaksi Tiup Lilin**:
     - Zoom-in ke arah kue.
     - Animasi hembusan angin sejuk melintasi layar.
     - 24 lilin padam berurutan dengan suara dan efek kepulan asap kecil.
     - Ledakan confetti penuh warna dan pendaran cahaya hangat.
     - Muncul kartu ucapan romantis berisi doa & harapan tulus.
5. **05 Transition to World**: Portal galeri kosmik spiral terbuka lembut mengantarkan ke dunia permainan.
6. **Tombol "Lewati Intro"**: Tersedia di pojok kanan atas untuk langsung menuju dunia permainan kapan saja.

---

### 2. Dunia Kenangan Kita (Game World 2D)
- **Visual Peta**: Lanskap alam 2D memukau dengan Danau Toba, Pulau Samosir lengkap dengan perahu dan dermaga, perbukitan Sinabung, pantai berpasir dengan ombak bergerak, lembah desa Meat, dan tebing megah Tongging.
- **Karakter Pemain**: Karakter perempuan pixel art imut yang dapat digerakkan ke 4 arah dengan animasi langkah kaki halus.
- **Multiplatform Controls**:
  - **Mobile Touch**: Virtual Joystick analog responsif di kiri bawah + Tombol Aksi **[A]** di kanan bawah.
  - **Tap-to-Walk**: Bisa langsung mengetuk/klik di area peta mana pun dan karakter akan berjalan ke sana.
  - **Desktop Keyboard**: Tombol Panah atau W-A-S-D untuk bergerak, tombol `Space` / `E` / `Enter` untuk aksi.

---

### 3. Eksplorasi 5 Lokasi Kenangan & Foto Nyata
Ketika karakter mendekati setiap titik lokasi (1 s/d 5), tombol interaksi akan menyala:
1. ⛵ **Samosir**: 10 Foto kenangan danau, dermaga, dan perahu.
2. 🏔️ **Sinabung**: 10 Foto pemandangan bukit dan senja pegunungan.
3. 🏖️ **Pantai**: 16 Foto pesona pantai, deburan ombak, dan matahari terbenam.
4. 🌾 **Meat**: 7 Foto keasrian pedesaan, pepohonan, dan senyum manis.
5. 🏞️ **Tongging**: 15 Foto panorama tebing tinggi menghadap danau.

**Fitur Album Foto:**
- Tampilan polaroid vintage dengan teks tanggal dan kutipan puitis.
- Carousel foto dengan tombol navigasi, strip thumbnail, dan gestur geser (*swipe* pada HP).
- Fitur *Lightbox Zoom* (klik foto untuk melihat ukuran besar resolusi penuh).

---

### 4. 📖 Jurnal Kenangan (Memory Journal)
- Menampilkan progres lokasi yang telah dikunjungi (misal: "3 dari 5 Kenangan").
- Membuka album foto lokasi yang sudah ditemukan kapan saja tanpa harus berjalan ke titik tersebut.

---

### 5. 🌌 Area Rahasia: "Our Little Universe"
- Awalnya terkunci dengan gembok misterius di puncak pulau melayang.
- **Terbuka otomatis setelah kelima lokasi kenangan selesai ditemukan!**
- Berisi:
  - Surat cinta istimewa yang panjang dan menyentuh hati.
  - Pesta kembang api spektakuler tanpa henti di langit malam berbintang.

---

### 6. Audio & Persistensi
- **Musik BGM Romantis**: Dihasilkan secara langsung menggunakan Web Audio API (piano & celesta lembut, tanpa perlu unduhan file audio besar, langsung jalan offline).
- **Efek Suara (SFX)**: Tiupan angin, lilin padam, petikan melodi memori, letusan kembang api, dan klik UI.
- **Progress Save**: Progres eksplorasi otomatis tersimpan di `localStorage` peramban.
