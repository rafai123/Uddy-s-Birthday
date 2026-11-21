// Generator Sprite & Avatar Pixel Art Bergaya Retro (Forgotten Warrior Aesthetic)
// Karakter disesuaikan dengan foto: Jilbab hitam manis, kacamata bingkai bulat, senyum hangat

export class SpriteManager {
  constructor() {
    this.characterSheets = {}; // [direction][frame]
    this.avatarCanvas = null;
    this.shrineSprites = {};
    this.propSprites = {};
    this.init();
  }

  init() {
    this.generateCharacterSprites();
    this.generateAvatarPortrait();
    this.generatePropSprites();
  }

  // Membuat sprite karakter pixel art 32x32 dalam 4 arah dan 4 frame berjalan
  generateCharacterSprites() {
    const directions = ['down', 'up', 'left', 'right'];
    const frames = [0, 1, 2, 3];

    directions.forEach(dir => {
      this.characterSheets[dir] = [];
      frames.forEach(frame => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 36;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        this.drawCharacterPixel(ctx, dir, frame);
        this.characterSheets[dir].push(canvas);
      });
    });
  }

  // Menggambar pixel karakter 16-bit
  drawCharacterPixel(ctx, dir, frame) {
    // Offset langkah kaki untuk animasi berjalan
    const walkBob = (frame === 1 || frame === 3) ? -1 : 0;
    const legOffset = (frame === 1) ? 2 : (frame === 3) ? -2 : 0;

    // 1. Bayangan Karakter (Shadow)
    ctx.fillStyle = 'rgba(10, 10, 20, 0.45)';
    ctx.beginPath();
    ctx.ellipse(16, 33, 9, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Kaki & Sepatu
    ctx.fillStyle = '#2d3748'; // Celana biru gelap / denim
    if (dir === 'down' || dir === 'up') {
      ctx.fillRect(11 + (walkBob !== 0 ? legOffset : 0), 25 + walkBob, 4, 6);
      ctx.fillRect(17 - (walkBob !== 0 ? legOffset : 0), 25 + walkBob, 4, 6);
      // Sepatu putih/sneakers
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(11 + (walkBob !== 0 ? legOffset : 0), 30 + walkBob, 4, 3);
      ctx.fillRect(17 - (walkBob !== 0 ? legOffset : 0), 30 + walkBob, 4, 3);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(11, 32 + walkBob, 4, 1);
      ctx.fillRect(17, 32 + walkBob, 4, 1);
    } else {
      // Profil samping (kiri / kanan)
      const flip = dir === 'left' ? -1 : 1;
      const baseX = dir === 'left' ? 14 : 14;
      ctx.fillRect(baseX + (legOffset * flip), 25 + walkBob, 5, 6);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(baseX + (legOffset * flip), 30 + walkBob, 5, 3);
    }

    // 3. Badan / Baju (Hoodie / Jaket Hitam-Navy Elegan)
    ctx.fillStyle = '#1e293b'; // Jaket luar
    ctx.fillRect(10, 16 + walkBob, 12, 10);
    // Detail resleting / list putih/emas
    ctx.fillStyle = '#38bdf8'; // Aksen biru muda
    ctx.fillRect(15, 17 + walkBob, 2, 8);
    // Lengan jaket
    ctx.fillStyle = '#0f172a';
    if (dir === 'down') {
      ctx.fillRect(8, 17 + walkBob + (legOffset > 0 ? 1 : 0), 3, 7);
      ctx.fillRect(21, 17 + walkBob - (legOffset < 0 ? 1 : 0), 3, 7);
    } else if (dir === 'up') {
      ctx.fillRect(8, 17 + walkBob, 3, 7);
      ctx.fillRect(21, 17 + walkBob, 3, 7);
    } else if (dir === 'left') {
      ctx.fillRect(14 - 4, 17 + walkBob, 4, 7);
    } else if (dir === 'right') {
      ctx.fillRect(14 + 4, 17 + walkBob, 4, 7);
    }

    // 4. Jilbab Hitam (Hijab) & Kepala
    // Pola jilbab pashmina hitam rapi khas foto sang kekasih
    ctx.fillStyle = '#0f172a'; // Hitam pekat dasar hijab
    ctx.fillRect(9, 4 + walkBob, 14, 13);
    ctx.fillRect(10, 2 + walkBob, 12, 3);
    ctx.fillRect(8, 7 + walkBob, 16, 9);

    // Sorotan lipatan kain jilbab
    ctx.fillStyle = '#334155';
    ctx.fillRect(11, 3 + walkBob, 10, 1);
    ctx.fillRect(8, 9 + walkBob, 1, 6);
    ctx.fillRect(23, 9 + walkBob, 1, 6);

    // 5. Wajah (Tampak Depan / Samping)
    if (dir === 'down') {
      // Kulit wajah
      ctx.fillStyle = '#fed7aa'; // Warna kulit hangat natural
      ctx.fillRect(11, 7 + walkBob, 10, 8);
      ctx.fillRect(12, 14 + walkBob, 8, 2);

      // Kacamata Emas / Wireframe Bulat (Sesuai Foto)
      ctx.fillStyle = '#f59e0b'; // Bingkai kacamata emas
      // Lensa kiri & kanan
      ctx.strokeRect ? null : null;
      ctx.fillRect(12, 8 + walkBob, 3, 3);
      ctx.fillRect(17, 8 + walkBob, 3, 3);
      // Jembatan kacamata
      ctx.fillRect(15, 9 + walkBob, 2, 1);
      // Kilau kaca
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(13, 8 + walkBob, 1, 1);
      ctx.fillRect(18, 8 + walkBob, 1, 1);

      // Mata di balik kacamata
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(13, 9 + walkBob, 1, 1);
      ctx.fillRect(18, 9 + walkBob, 1, 1);

      // Rona Pipi Manis (Blush Pink)
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(11, 11 + walkBob, 2, 1);
      ctx.fillRect(19, 11 + walkBob, 2, 1);

      // Senyum Manis
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(14, 12 + walkBob, 4, 1);
      ctx.fillRect(15, 13 + walkBob, 2, 1);

      // Ujung jilbab menutupi leher dan dada
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(11, 15 + walkBob, 10, 3);
      ctx.fillRect(13, 17 + walkBob, 6, 2);
    } else if (dir === 'left' || dir === 'right') {
      const isLeft = dir === 'left';
      const faceX = isLeft ? 10 : 16;
      // Profil wajah
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(faceX, 8 + walkBob, 6, 7);

      // Kacamata profil
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(isLeft ? 10 : 18, 9 + walkBob, 3, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(isLeft ? 10 : 19, 9 + walkBob, 1, 1);

      // Mata & Senyum profil
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(isLeft ? 11 : 18, 10 + walkBob, 1, 1);
      ctx.fillStyle = '#f472b6'; // Blush
      ctx.fillRect(isLeft ? 11 : 18, 12 + walkBob, 1, 1);
      ctx.fillStyle = '#e11d48'; // Senyum
      ctx.fillRect(isLeft ? 10 : 19, 13 + walkBob, 2, 1);

      // Jilbab belakang menjuntai
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(isLeft ? 16 : 10, 7 + walkBob, 6, 11);
    } else if (dir === 'up') {
      // Tampak belakang jilbab hitam rapi
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(10, 5 + walkBob, 12, 13);
      ctx.fillRect(11, 17 + walkBob, 10, 3);
      // Detail lipatan jilbab
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(15, 7 + walkBob, 2, 10);
    }
  }

  // Membuat Avatar Portrait 64x64 HD Pixel Art untuk HUD & Dialog
  generateAvatarPortrait() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Background lingkaran kosmik retro
    const grad = ctx.createLinearGradient(0, 0, 64, 64);
    grad.addColorStop(0, '#3b1d40');
    grad.addColorStop(1, '#1e1026');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    // Bingkai ganda retro emas & kayu (Forgotten Warrior style)
    ctx.strokeStyle = '#c28544';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 62, 62);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.strokeRect(3, 3, 58, 58);

    // Sudut ornamen emas
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(2, 2, 4, 4);
    ctx.fillRect(58, 2, 4, 4);
    ctx.fillRect(2, 58, 4, 4);
    ctx.fillRect(58, 58, 4, 4);

    // Bintang-bintang kecil di latar belakang
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(10, 12, 2, 2);
    ctx.fillRect(50, 14, 2, 2);
    ctx.fillRect(12, 48, 1, 1);
    ctx.fillRect(52, 45, 1, 1);

    // Jilbab Hitam (Hijab) Elegan
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(14, 12, 36, 44);
    ctx.fillRect(18, 8, 28, 8);
    ctx.fillRect(12, 20, 40, 34);

    // Sorotan lipatan kain jilbab hitam
    ctx.fillStyle = '#334155';
    ctx.fillRect(20, 10, 24, 2);
    ctx.fillRect(14, 22, 2, 26);
    ctx.fillRect(48, 22, 2, 26);

    // Wajah Cantik Manis
    ctx.fillStyle = '#fed7aa'; // Skin tone
    ctx.fillRect(20, 18, 24, 22);
    ctx.fillRect(22, 38, 20, 4);
    ctx.fillRect(26, 42, 12, 4);

    // Alis rapi
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(22, 20, 7, 2);
    ctx.fillRect(35, 20, 7, 2);

    // Kacamata Emas / Wireframe Bulat Khas Sang Kekasih
    ctx.fillStyle = '#f59e0b';
    // Lensa kiri (outer)
    ctx.fillRect(21, 23, 9, 8);
    // Lensa kanan (outer)
    ctx.fillRect(34, 23, 9, 8);
    // Jembatan tengah
    ctx.fillRect(30, 26, 4, 2);

    // Lensa dalam (bening dengan kilau)
    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(23, 24, 6, 6);
    ctx.fillRect(35, 24, 6, 6);

    // Mata indah berbinar
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(25, 26, 3, 3);
    ctx.fillRect(37, 26, 3, 3);
    // Kilau mata
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(25, 26, 1, 1);
    ctx.fillRect(37, 26, 1, 1);
    ctx.fillRect(24, 24, 2, 1);
    ctx.fillRect(36, 24, 2, 1);

    // Hidung mancung halus
    ctx.fillStyle = '#fdba74';
    ctx.fillRect(31, 31, 2, 3);

    // Rona Pipi Manis (Blush Pinkish)
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(21, 31, 4, 3);
    ctx.fillRect(39, 31, 4, 3);

    // Bibir & Senyum Manis
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(28, 35, 8, 3);
    ctx.fillStyle = '#fda4af';
    ctx.fillRect(29, 35, 6, 1); // Highlight bibir

    // Jilbab di bawah dagu & baju
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(22, 45, 20, 6);
    ctx.fillStyle = '#1e293b'; // Baju
    ctx.fillRect(16, 50, 32, 12);
    // Bros hati emas
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(30, 48, 4, 4);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(31, 49, 2, 2);

    this.avatarCanvas = canvas;
  }

  // Membuat properti retro (obelisk kuil kenangan, obor menyala, perahu, jembatan, peti gembok rahasia)
  generatePropSprites() {
    // 1. Obor Api Retro
    const torchCanvas = document.createElement('canvas');
    torchCanvas.width = 16;
    torchCanvas.height = 24;
    const tCtx = torchCanvas.getContext('2d');
    tCtx.imageSmoothingEnabled = false;
    // Tiang obor
    tCtx.fillStyle = '#78350f';
    tCtx.fillRect(6, 10, 4, 14);
    tCtx.fillStyle = '#451a03';
    tCtx.fillRect(7, 10, 2, 14);
    // Cawan besi
    tCtx.fillStyle = '#475569';
    tCtx.fillRect(4, 8, 8, 3);
    this.propSprites.torch = torchCanvas;

    // 2. Monumen Kristal Kenangan (Memory Shrine)
    const shrineCanvas = document.createElement('canvas');
    shrineCanvas.width = 36;
    shrineCanvas.height = 44;
    const sCtx = shrineCanvas.getContext('2d');
    sCtx.imageSmoothingEnabled = false;
    // Fondasi batu kuno
    sCtx.fillStyle = '#334155';
    sCtx.fillRect(4, 32, 28, 10);
    sCtx.fillStyle = '#64748b';
    sCtx.fillRect(6, 26, 24, 6);
    sCtx.fillStyle = '#94a3b8';
    sCtx.fillRect(10, 20, 16, 6);
    // Pilar kristal bersinar
    sCtx.fillStyle = '#e2e8f0';
    sCtx.fillRect(14, 8, 8, 12);
    sCtx.fillStyle = '#38bdf8';
    sCtx.fillRect(15, 9, 6, 10);
    this.propSprites.shrine = shrineCanvas;

    // 3. Peti Rahasia Kosmik (Our Little Universe Chest/Portal Gate)
    const gateCanvas = document.createElement('canvas');
    gateCanvas.width = 44;
    gateCanvas.height = 48;
    const gCtx = gateCanvas.getContext('2d');
    gCtx.imageSmoothingEnabled = false;
    // Gapura bintang kuno
    gCtx.fillStyle = '#1e1b4b';
    gCtx.fillRect(2, 6, 8, 38);
    gCtx.fillRect(34, 6, 8, 38);
    gCtx.fillRect(2, 2, 40, 8);
    // Ornamen emas kuno
    gCtx.fillStyle = '#f59e0b';
    gCtx.fillRect(0, 0, 44, 3);
    gCtx.fillRect(4, 8, 4, 34);
    gCtx.fillRect(36, 8, 4, 34);
    this.propSprites.cosmicGate = gateCanvas;
  }
}

export const spriteManager = new SpriteManager();
