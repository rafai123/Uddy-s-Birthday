# 🗡️ Dunia Kenangan Kita - Retro Game Edition (Forgotten Warrior Style)
### Spesial Perayaan Ulang Tahun ke-24 untuk Sayang ❤️ (26 November 2026)

Aplikasi web interaktif bertema retro game klasik (estetika petualangan 16-bit ala *Forgotten Warrior* / game Java J2ME), dibangun sepenuhnya berdasarkan dokumen desain UX & tata letak peta [a_detailed_infographic_ux_design_document_layout_o.png](a_detailed_infographic_ux_design_document_layout_o.png).

---

## ✨ Fitur Utama & Pembaruan

### 1. 🎨 Grafis Retro 16-Bit Ala Forgotten Warrior
- **Visual Retro Nostalgia**: Desain visual klasik dengan tekstur ubin lanskap, bebatuan kuno, danau Danau Toba dengan riak ombak animasi, perahu kayu dermaga Samosir, bukit Sinabung, pantai pasir keemasan, lembah asri desa Meat, dan tebing megah Tongging.
- **Efek Partikel Alam Romantis**: Hembusan kelopak bunga sakura merah muda (*cherry blossom*), partikel hati melayang (*floating romantic hearts*), dan kunang-kunang malam yang bersinar lembut di atas danau.
- **Tata Cahaya Obor & Lentera**: Obor kuno (*torchlights*) berkedip dengan pendar cahaya hangat di sepanjang jalur batu setapak.

### 2. 🧕 Karakter Pemain Sesuai Foto Kekasih
- Karakter pixel art perempuan imut yang dirancang khusus menyerupai foto asli sang kekasih:
  - Mengenakan **jilbab pashmina hitam rapi**.
  - **Kacamata bulat berbingkai emas** yang khas dan manis.
  - Wajah manis dengan senyum hangat dan rona pipi (*blush*).
  - Pakaian petualang hoodie/jaket elegan dan celana santai.
  - Animasi berjalan 4 arah (Depan, Belakang, Kiri, Kanan) dengan langkah kaki halus.
  - **Avatar Portrait 16-Bit** berbingkai ganda kayu & emas retro di sudut HUD atas.

### 3. 📱 Dioptimalkan Penuh untuk Tampilan & Sentuhan Android
- **Virtual D-Pad / Joystick**: Thumb stick analog responsif di pojok kiri bawah layar, dirancang khusus untuk jempol satu tangan di HP.
- **Tombol Aksi [A] Retro**: Tombol arkade tactile besar di kanan bawah dengan efek tekan, pendar cahaya saat dekat lokasi, dan getaran haptic feedback (`vibrate`) di Android.
- **Tap-to-Walk**: Bisa langsung mengetuk area mana pun di peta layar sentuh untuk membuat karakter berjalan ke titik tersebut dengan penanda hati berkilau.
- **Tanpa Python di Website**: 100% menggunakan teknologi web murni JavaScript/HTML5 modern tanpa ketergantungan runtime Python.

### 4. 🖼️ Model Scroll Album Foto & Optimasi Ukuran (Super Ringan)
- **Kompresi Pintar 95.2%**: 58 foto momen perjalanan yang awalnya berukuran total **253.6 MB** telah dioptimalkan secara cerdas menjadi hanya **12.14 MB** (menghemat ~95% bandwidth dan memori HP Android sehingga tidak akan lag ataupun force close).
- **Model Scroll Reel**: Foto-foto ditampilkan dalam format gulungan horizontal (*horizontal scroll reel*) dengan gestur usap (*touch swipe*), magnetik *scroll-snap*, kartu momen vintage, dan tombol navigasi [◀ Prev] [Next ▶].
- **Filmstrip Thumbnail**: Strip pratinjau thumbnail instan di bagian bawah album untuk melompat langsung ke momen tertentu.
- **Fullscreen Lightbox**: Ketuk foto mana pun untuk melihat tampilan penuh yang jernih.

### 5. 🎵 Musik Latar Romantis Retro (Synthesizer Web Audio API)
- Musik latar romantis nostalgia yang disintesis langsung menggunakan Web Audio API (suara celesta/music box manis, melodi suling retro dengan vibrato romantis, dan petikan nada akustik hangat).
- Berjalan 100% offline tanpa perlu mengunduh file MP3 besar.
- Dilengkapi tombol toggle cepat `[🎵 Musik: ON/OFF]` di HUD atas.
- Efek Suara Retro (SFX): Langkah kaki, tiupan angin lilin, kembang api boom, dan denting melodi penemuan kenangan.

### 6. 🎂 Alur Pembuka Sinematik 5 Tahap (10–15 Detik)
1. **01 Romantic Loading**: Layar gelap bertabur bintang dengan detak hati berdenyut bercahaya (*pulsing heart*).
2. **02 Fireworks Celebration**: Pesta kembang api retro warna-warni menyinari malam.
3. **03 Birthday Reveal**: Tulisan emas berkilau: *"Selamat Ulang Tahun ke-24, Sayang ❤️ - 26 NOVEMBER 2026"*.
4. **04 Kue & 24 Lilin Interaktif**:
   - Pilihan: **[Tiup Lilin 🎂]** atau **[Jelajahi Dunia Kita ✨]**.
   - Hembusan angin sejuk meniup padam ke-24 lilin satu per satu dengan efek kepulan asap dan suara desis.
   - Ledakan confetti penuh warna dan kartu pesan cinta yang tulus.
5. **05 Transition to World**: Portal bintang pusaran spiral kosmik mengantarkan ke dunia permainan.
*(Tersedia tombol "Lewati Intro ⏩" di pojok kanan atas kapan saja).*

### 7. 🌌 Area Rahasia: "Our Little Universe"
- Terletak di pulau kosmik terapung di bagian paling bawah peta.
- Terkunci dengan gembok misterius hingga kelima lokasi kenangan selesai ditemukan.
- Setelah terbuka, menampilkan surat cinta yang panjang dan menyentuh hati serta pesta kembang api spektakuler tanpa henti!

---

## 🚀 Cara Menjalankan

### Cara Paling Mudah (Windows):
Cukup **klik dua kali file `start.bat`**.
Script ini otomatis memprioritaskan server modern berbasis Node.js (`server.js`) dan langsung membuka browser Anda di `http://localhost:8080`.

### Melalui Terminal / Command Prompt:
```bash
node server.js
```
atau
```bash
npm start
```
Buka browser di: **http://localhost:8080**

### Untuk Membuka di HP Android:
Pastikan HP Android dan laptop/komputer terhubung ke jaringan Wi-Fi yang sama, lalu buka alamat IP komputer Anda di browser Android (misal: `http://192.168.1.xxx:8080`).

---

Dibuat dengan segenap cinta untuk merayakan hari paling istimewa sang kekasih. ❤️✨
