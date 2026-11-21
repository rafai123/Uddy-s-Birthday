// Final Fantasy Style Pixel Art Sprite & Avatar Generator
// Karakter Sang Kekasih: Jilbab Pashmina Hitam, Kacamata Bulat Emas, Senyum Manis

export class FFSpriteManager {
  constructor() {
    this.characterSheets = {}; // [direction][frame]
    this.avatarCanvas = null;
    this.crystalSprites = {};
    this.propSprites = {};
    this.init();
  }

  init() {
    this.generateCharacterSprites();
    this.generateFFAvatarPortrait();
    this.generateFFProps();
  }

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

        this.drawFFCharacterPixel(ctx, dir, frame);
        this.characterSheets[dir].push(canvas);
      });
    });
  }

  drawFFCharacterPixel(ctx, dir, frame) {
    const walkBob = (frame === 1 || frame === 3) ? -1 : 0;
    const legOffset = (frame === 1) ? 2 : (frame === 3) ? -2 : 0;

    // 1. Soft Shadow
    ctx.fillStyle = 'rgba(12, 16, 36, 0.45)';
    ctx.beginPath();
    ctx.ellipse(16, 33, 9, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Kaki & Sepatu
    ctx.fillStyle = '#1e293b'; // Celana gelap
    if (dir === 'down' || dir === 'up') {
      ctx.fillRect(11 + (walkBob !== 0 ? legOffset : 0), 25 + walkBob, 4, 6);
      ctx.fillRect(17 - (walkBob !== 0 ? legOffset : 0), 25 + walkBob, 4, 6);
      ctx.fillStyle = '#f8fafc'; // Sepatu putih
      ctx.fillRect(11 + (walkBob !== 0 ? legOffset : 0), 30 + walkBob, 4, 3);
      ctx.fillRect(17 - (walkBob !== 0 ? legOffset : 0), 30 + walkBob, 4, 3);
    } else {
      const flip = dir === 'left' ? -1 : 1;
      ctx.fillRect(14 + (legOffset * flip), 25 + walkBob, 5, 6);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(14 + (legOffset * flip), 30 + walkBob, 5, 3);
    }

    // 3. Pakaian Petualang Final Fantasy (Jubah / Jaket Hitam-Navy Elegan)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(10, 16 + walkBob, 12, 10);
    // Detail aksen kristal/sabuk FF
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(15, 17 + walkBob, 2, 8);
    ctx.fillStyle = '#fbbf24'; // Gesper emas
    ctx.fillRect(14, 23 + walkBob, 4, 2);

    // Lengan
    ctx.fillStyle = '#1e293b';
    if (dir === 'down') {
      ctx.fillRect(8, 17 + walkBob + (legOffset > 0 ? 1 : 0), 3, 7);
      ctx.fillRect(21, 17 + walkBob - (legOffset < 0 ? 1 : 0), 3, 7);
    } else if (dir === 'up') {
      ctx.fillRect(8, 17 + walkBob, 3, 7);
      ctx.fillRect(21, 17 + walkBob, 3, 7);
    } else if (dir === 'left') {
      ctx.fillRect(10, 17 + walkBob, 4, 7);
    } else if (dir === 'right') {
      ctx.fillRect(18, 17 + walkBob, 4, 7);
    }

    // 4. Jilbab Hitam (Hijab) Khas Sang Kekasih
    ctx.fillStyle = '#090d16'; // Hitam pekat FF
    ctx.fillRect(9, 4 + walkBob, 14, 13);
    ctx.fillRect(10, 2 + walkBob, 12, 3);
    ctx.fillRect(8, 7 + walkBob, 16, 9);

    // Shading lipatan jilbab halus
    ctx.fillStyle = '#334155';
    ctx.fillRect(11, 3 + walkBob, 10, 1);
    ctx.fillRect(8, 9 + walkBob, 1, 6);
    ctx.fillRect(23, 9 + walkBob, 1, 6);

    // 5. Wajah & Kacamata Emas
    if (dir === 'down') {
      // Kulit wajah
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(11, 7 + walkBob, 10, 8);
      ctx.fillRect(12, 14 + walkBob, 8, 2);

      // Kacamata Bingkai Bulat Emas (Sesuai Foto)
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(12, 8 + walkBob, 3, 3);
      ctx.fillRect(17, 8 + walkBob, 3, 3);
      ctx.fillRect(15, 9 + walkBob, 2, 1);

      // Kilau Kaca
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(13, 8 + walkBob, 1, 1);
      ctx.fillRect(18, 8 + walkBob, 1, 1);

      // Mata
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(13, 9 + walkBob, 1, 1);
      ctx.fillRect(18, 9 + walkBob, 1, 1);

      // Blush Pipi Pink
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(11, 11 + walkBob, 2, 1);
      ctx.fillRect(19, 11 + walkBob, 2, 1);

      // Senyum Manis
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(14, 12 + walkBob, 4, 1);
      ctx.fillRect(15, 13 + walkBob, 2, 1);

      // Jilbab menutup leher
      ctx.fillStyle = '#090d16';
      ctx.fillRect(11, 15 + walkBob, 10, 3);
    } else if (dir === 'left' || dir === 'right') {
      const isLeft = dir === 'left';
      const faceX = isLeft ? 10 : 16;
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(faceX, 8 + walkBob, 6, 7);

      ctx.fillStyle = '#f59e0b'; // Kacamata
      ctx.fillRect(isLeft ? 10 : 18, 9 + walkBob, 3, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(isLeft ? 10 : 19, 9 + walkBob, 1, 1);

      ctx.fillStyle = '#1c1917'; // Mata
      ctx.fillRect(isLeft ? 11 : 18, 10 + walkBob, 1, 1);
      ctx.fillStyle = '#f472b6'; // Blush
      ctx.fillRect(isLeft ? 11 : 18, 12 + walkBob, 1, 1);
      ctx.fillStyle = '#e11d48'; // Senyum
      ctx.fillRect(isLeft ? 10 : 19, 13 + walkBob, 2, 1);

      ctx.fillStyle = '#090d16'; // Jilbab belakang
      ctx.fillRect(isLeft ? 16 : 10, 7 + walkBob, 6, 11);
    } else if (dir === 'up') {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(10, 5 + walkBob, 12, 13);
      ctx.fillRect(11, 17 + walkBob, 10, 3);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(15, 7 + walkBob, 2, 10);
    }
  }

  // Portrait Avatar Klasik Final Fantasy Blue Window 64x64
  generateFFAvatarPortrait() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Final Fantasy Classic Gradient Background
    const grad = ctx.createLinearGradient(0, 0, 0, 64);
    grad.addColorStop(0, '#001a70');
    grad.addColorStop(1, '#000830');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    // Frame perak ganda khas Final Fantasy
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(1.5, 1.5, 61, 61);
    ctx.strokeStyle = '#94a3b8';
    ctx.strokeRect(3.5, 3.5, 57, 57);

    // Sudut ornamen FF
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(1, 1, 3, 3);
    ctx.fillRect(60, 1, 3, 3);
    ctx.fillRect(1, 60, 3, 3);
    ctx.fillRect(60, 60, 3, 3);

    // Jilbab Hitam
    ctx.fillStyle = '#090d16';
    ctx.fillRect(14, 12, 36, 44);
    ctx.fillRect(18, 8, 28, 8);
    ctx.fillRect(12, 20, 40, 34);

    // Highlight jilbab
    ctx.fillStyle = '#334155';
    ctx.fillRect(20, 10, 24, 2);
    ctx.fillRect(14, 22, 2, 26);
    ctx.fillRect(48, 22, 2, 26);

    // Wajah
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(20, 18, 24, 22);
    ctx.fillRect(22, 38, 20, 4);
    ctx.fillRect(26, 42, 12, 4);

    // Alis
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(22, 20, 7, 2);
    ctx.fillRect(35, 20, 7, 2);

    // Kacamata Bingkai Emas Cantik
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(21, 23, 9, 8);
    ctx.fillRect(34, 23, 9, 8);
    ctx.fillRect(30, 26, 4, 2);

    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(23, 24, 6, 6);
    ctx.fillRect(35, 24, 6, 6);

    // Mata & Kilau
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(25, 26, 3, 3);
    ctx.fillRect(37, 26, 3, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(25, 26, 1, 1);
    ctx.fillRect(37, 26, 1, 1);
    ctx.fillRect(24, 24, 2, 1);
    ctx.fillRect(36, 24, 2, 1);

    // Blush
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(21, 31, 4, 3);
    ctx.fillRect(39, 31, 4, 3);

    // Senyum Manis
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(28, 35, 8, 3);
    ctx.fillStyle = '#fda4af';
    ctx.fillRect(29, 35, 6, 1);

    // Kerudung dada & Bros Kristal Cinta
    ctx.fillStyle = '#090d16';
    ctx.fillRect(22, 45, 20, 6);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(16, 50, 32, 12);
    ctx.fillStyle = '#38bdf8'; // Crystal brooch
    ctx.fillRect(30, 48, 4, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(31, 49, 2, 2);

    this.avatarCanvas = canvas;
  }

  generateFFProps() {
    // 1. Obor Kastil Final Fantasy
    const torchCanvas = document.createElement('canvas');
    torchCanvas.width = 16;
    torchCanvas.height = 24;
    const tCtx = torchCanvas.getContext('2d');
    tCtx.imageSmoothingEnabled = false;
    tCtx.fillStyle = '#475569';
    tCtx.fillRect(6, 10, 4, 14);
    tCtx.fillStyle = '#cbd5e1';
    tCtx.fillRect(4, 7, 8, 3);
    this.propSprites.torch = torchCanvas;

    // 2. Kuil Kristal Suci (Final Fantasy Crystal Shrine)
    const shrineCanvas = document.createElement('canvas');
    shrineCanvas.width = 40;
    shrineCanvas.height = 46;
    const sCtx = shrineCanvas.getContext('2d');
    sCtx.imageSmoothingEnabled = false;
    // Altar marmer suci
    sCtx.fillStyle = '#1e293b';
    sCtx.fillRect(4, 32, 32, 10);
    sCtx.fillStyle = '#334155';
    sCtx.fillRect(8, 26, 24, 6);
    sCtx.fillStyle = '#64748b';
    sCtx.fillRect(12, 20, 16, 6);
    // Pilar kristal
    sCtx.fillStyle = '#38bdf8';
    sCtx.fillRect(16, 8, 8, 12);
    sCtx.fillStyle = '#ffffff';
    sCtx.fillRect(18, 10, 4, 8);
    this.propSprites.shrine = shrineCanvas;
  }
}

export const ffSprites = new FFSpriteManager();
