// Generator Sprite & Avatar Karakter 32-Bit (Gaya Pixel Art High-Detail RPG)
// Disesuaikan persis dengan foto asli: Jilbab Hitam Manis, Kacamata Emas Bulat, Rona Pipi Manis

export class FFSpriteManager {
  constructor() {
    this.characterSheets = {}; // [direction][frame]
    this.avatarCanvas = null;
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
        canvas.width = 36;
        canvas.height = 40;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        this.draw32BitCharacter(ctx, dir, frame);
        this.characterSheets[dir].push(canvas);
      });
    });
  }

  draw32BitCharacter(ctx, dir, frame) {
    const walkBob = (frame === 1 || frame === 3) ? -1 : 0;
    const legOffset = (frame === 1) ? 2 : (frame === 3) ? -2 : 0;

    // 1. Bayangan Halus (Ambient Shadow)
    ctx.fillStyle = 'rgba(8, 12, 28, 0.45)';
    ctx.beginPath();
    ctx.ellipse(18, 36, 11, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Kaki & Sepatu (Sneakers Putih Bersih)
    ctx.fillStyle = '#1e293b'; // Celana denim gelap
    if (dir === 'down' || dir === 'up') {
      ctx.fillRect(12 + (walkBob !== 0 ? legOffset : 0), 27 + walkBob, 5, 8);
      ctx.fillRect(19 - (walkBob !== 0 ? legOffset : 0), 27 + walkBob, 5, 8);
      // Lipatan celana
      ctx.fillStyle = '#334155';
      ctx.fillRect(12, 30 + walkBob, 5, 1);
      ctx.fillRect(19, 30 + walkBob, 5, 1);
      // Sepatu sneakers
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(12 + (walkBob !== 0 ? legOffset : 0), 33 + walkBob, 5, 4);
      ctx.fillRect(19 - (walkBob !== 0 ? legOffset : 0), 33 + walkBob, 5, 4);
      ctx.fillStyle = '#38bdf8'; // Garis aksen sepatu
      ctx.fillRect(12, 35 + walkBob, 5, 1);
      ctx.fillRect(19, 35 + walkBob, 5, 1);
    } else {
      const flip = dir === 'left' ? -1 : 1;
      const baseX = dir === 'left' ? 15 : 16;
      ctx.fillRect(baseX + (legOffset * flip), 27 + walkBob, 6, 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(baseX + (legOffset * flip), 33 + walkBob, 6, 4);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(baseX + (legOffset * flip), 35 + walkBob, 6, 1);
    }

    // 3. Badan & Jaket Traveler Elegan (Hitam / Navy dengan Shading Halus)
    ctx.fillStyle = '#0f172a'; // Warna luar
    ctx.fillRect(11, 17 + walkBob, 14, 11);
    ctx.fillStyle = '#1e293b'; // Shading terang
    ctx.fillRect(12, 18 + walkBob, 12, 2);
    // Garis resleting aqua
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(17, 18 + walkBob, 2, 9);
    // Tas selempang manis
    ctx.fillStyle = '#78350f';
    ctx.fillRect(13, 20 + walkBob, 2, 8);

    // Lengan Jaket
    ctx.fillStyle = '#090d16';
    if (dir === 'down') {
      ctx.fillRect(9, 18 + walkBob + (legOffset > 0 ? 1 : 0), 3, 8);
      ctx.fillRect(24, 18 + walkBob - (legOffset < 0 ? 1 : 0), 3, 8);
      ctx.fillStyle = '#fed7aa'; // Ujung tangan
      ctx.fillRect(9, 25 + walkBob, 3, 2);
      ctx.fillRect(24, 25 + walkBob, 3, 2);
    } else if (dir === 'up') {
      ctx.fillRect(9, 18 + walkBob, 3, 8);
      ctx.fillRect(24, 18 + walkBob, 3, 8);
    } else if (dir === 'left') {
      ctx.fillRect(12, 18 + walkBob, 4, 8);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(12, 25 + walkBob, 3, 2);
    } else if (dir === 'right') {
      ctx.fillRect(20, 18 + walkBob, 4, 8);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(21, 25 + walkBob, 3, 2);
    }

    // 4. Jilbab Hitam Sutra (Hijab) 32-Bit
    ctx.fillStyle = '#050811'; // Hitam pekat dasar
    ctx.fillRect(10, 5 + walkBob, 16, 14);
    ctx.fillRect(12, 3 + walkBob, 12, 3);
    ctx.fillRect(9, 8 + walkBob, 18, 10);

    // Sorotan lembut lipatan jilbab pashmina
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(12, 4 + walkBob, 12, 1);
    ctx.fillRect(9, 10 + walkBob, 1, 7);
    ctx.fillRect(26, 10 + walkBob, 1, 7);
    ctx.fillStyle = '#334155';
    ctx.fillRect(14, 5 + walkBob, 8, 1);

    // 5. Wajah Cantik Manis
    if (dir === 'down') {
      // Kulit wajah hangat natural
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(12, 8 + walkBob, 12, 9);
      ctx.fillRect(13, 16 + walkBob, 10, 2);

      // Kacamata Bingkai Bulat Emas (Sesuai Foto)
      ctx.fillStyle = '#f59e0b';
      // Lensa kiri & kanan
      ctx.fillRect(13, 9 + walkBob, 4, 4);
      ctx.fillRect(19, 9 + walkBob, 4, 4);
      ctx.fillRect(17, 10 + walkBob, 2, 1); // Jembatan

      // Kilau lensa kaca
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(14, 9 + walkBob, 1, 1);
      ctx.fillRect(20, 9 + walkBob, 1, 1);

      // Mata indah berbinar
      ctx.fillStyle = '#090d16';
      ctx.fillRect(14, 10 + walkBob, 2, 2);
      ctx.fillRect(20, 10 + walkBob, 2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(14, 10 + walkBob, 1, 1);
      ctx.fillRect(20, 10 + walkBob, 1, 1);

      // Rona Pipi Manis (Blush Pink)
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(12, 13 + walkBob, 3, 2);
      ctx.fillRect(21, 13 + walkBob, 3, 2);

      // Senyum Manis
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(16, 14 + walkBob, 4, 1);
      ctx.fillRect(17, 15 + walkBob, 2, 1);

      // Ujung jilbab menutupi leher
      ctx.fillStyle = '#050811';
      ctx.fillRect(12, 17 + walkBob, 12, 3);
    } else if (dir === 'left' || dir === 'right') {
      const isLeft = dir === 'left';
      const faceX = isLeft ? 11 : 18;

      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(faceX, 9 + walkBob, 7, 8);

      // Kacamata samping
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(isLeft ? 11 : 20, 10 + walkBob, 4, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(isLeft ? 11 : 21, 10 + walkBob, 1, 1);

      // Mata & Senyum
      ctx.fillStyle = '#090d16';
      ctx.fillRect(isLeft ? 12 : 20, 11 + walkBob, 2, 2);
      ctx.fillStyle = '#f472b6'; // Blush
      ctx.fillRect(isLeft ? 12 : 20, 14 + walkBob, 2, 1);
      ctx.fillStyle = '#e11d48'; // Senyum
      ctx.fillRect(isLeft ? 11 : 21, 15 + walkBob, 2, 1);

      // Jilbab belakang menjuntai
      ctx.fillStyle = '#050811';
      ctx.fillRect(isLeft ? 18 : 11, 7 + walkBob, 7, 12);
    } else if (dir === 'up') {
      ctx.fillStyle = '#050811';
      ctx.fillRect(11, 6 + walkBob, 14, 14);
      ctx.fillRect(12, 19 + walkBob, 12, 3);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(17, 8 + walkBob, 2, 12);
    }
  }

  // Portrait Avatar Klasik 64x64 HD Final Fantasy
  generateFFAvatarPortrait() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Final Fantasy Classic Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 64);
    grad.addColorStop(0, '#001a70');
    grad.addColorStop(1, '#000830');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    // Border perak & emas
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(1.5, 1.5, 61, 61);
    ctx.strokeStyle = '#94a3b8';
    ctx.strokeRect(3.5, 3.5, 57, 57);

    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(1, 1, 3, 3);
    ctx.fillRect(60, 1, 3, 3);
    ctx.fillRect(1, 60, 3, 3);
    ctx.fillRect(60, 60, 3, 3);

    // Jilbab Hitam Elegan
    ctx.fillStyle = '#050811';
    ctx.fillRect(14, 12, 36, 44);
    ctx.fillRect(18, 8, 28, 8);
    ctx.fillRect(12, 20, 40, 34);

    // Shading jilbab
    ctx.fillStyle = '#334155';
    ctx.fillRect(20, 10, 24, 2);
    ctx.fillRect(14, 22, 2, 26);
    ctx.fillRect(48, 22, 2, 26);

    // Wajah
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(20, 18, 24, 22);
    ctx.fillRect(22, 38, 20, 4);
    ctx.fillRect(26, 42, 12, 4);

    // Alis rapi
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(22, 20, 7, 2);
    ctx.fillRect(35, 20, 7, 2);

    // Kacamata Bingkai Bulat Emas
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(21, 23, 9, 8);
    ctx.fillRect(34, 23, 9, 8);
    ctx.fillRect(30, 26, 4, 2);

    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(23, 24, 6, 6);
    ctx.fillRect(35, 24, 6, 6);

    // Mata berbinar
    ctx.fillStyle = '#090d16';
    ctx.fillRect(25, 26, 3, 3);
    ctx.fillRect(37, 26, 3, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(25, 26, 1, 1);
    ctx.fillRect(37, 26, 1, 1);
    ctx.fillRect(24, 24, 2, 1);
    ctx.fillRect(36, 24, 2, 1);

    // Blush Pink Manis
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(21, 31, 4, 3);
    ctx.fillRect(39, 31, 4, 3);

    // Senyum Manis
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(28, 35, 8, 3);
    ctx.fillStyle = '#fda4af';
    ctx.fillRect(29, 35, 6, 1);

    // Bros Kristal Cinta
    ctx.fillStyle = '#050811';
    ctx.fillRect(22, 45, 20, 6);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(16, 50, 32, 12);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(30, 48, 4, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(31, 49, 2, 2);

    this.avatarCanvas = canvas;
  }

  generateFFProps() {
    // Altar Kristal Suci
    const shrineCanvas = document.createElement('canvas');
    shrineCanvas.width = 40;
    shrineCanvas.height = 46;
    const sCtx = shrineCanvas.getContext('2d');
    sCtx.imageSmoothingEnabled = false;

    sCtx.fillStyle = '#1e293b';
    sCtx.fillRect(4, 32, 32, 10);
    sCtx.fillStyle = '#334155';
    sCtx.fillRect(8, 26, 24, 6);
    sCtx.fillStyle = '#64748b';
    sCtx.fillRect(12, 20, 16, 6);

    sCtx.fillStyle = '#38bdf8';
    sCtx.fillRect(16, 8, 8, 12);
    sCtx.fillStyle = '#ffffff';
    sCtx.fillRect(18, 10, 4, 8);
    this.propSprites.shrine = shrineCanvas;
  }
}

export const ffSprites = new FFSpriteManager();
