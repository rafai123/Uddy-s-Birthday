// Engine Tile 8-Bit / 16-Bit Klasik Final Fantasy & Chrono Trigger
// Ukuran Blok: 32x32 pixel (1 Meter = 1 Blok)
// Tekstur Rumput Kaya Pola, Batu Berundak, Ombak Pantai, Pasir & Tebing Bergradasi

export class TileEngine {
  constructor() {
    this.tileSize = 32; // 32x32 px per blok (1 meter = 1 blok)
    this.tiles = {};
    this.initTiles();
  }

  initTiles() {
    this.tiles.grass1 = this.createGrassTile(1); // Rumput rimbun bertekstur
    this.tiles.grass2 = this.createGrassTile(2); // Rumput dengan bunga liar merah muda & kuning
    this.tiles.grass3 = this.createGrassTile(3); // Rumput dengan lumut & semanggi
    this.tiles.path = this.createCobblestoneTile(); // Jalur batu bertekstur 3D
    this.tiles.sand = this.createSandTile(); // Pasir pantai beriak
    this.tiles.waterDeep = this.createWaterTile('#0c2340', '#184275'); // Air danau dalam
    this.tiles.waterShallow = this.createWaterTile('#184275', '#2563eb'); // Air dangkal berkilau
    this.tiles.wood = this.createWoodPlankTile(); // Jembatan & dermaga kayu
    this.tiles.cliff = this.createCliffTile(); // Tebing batu cadas
    this.tiles.tree = this.createTreeSprite(); // Pohon rimbun 48x64
  }

  // 1. Tile Rumput 8-Bit / 16-Bit Bertekstur (Bukan Rumput Polos!)
  createGrassTile(variant = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Warna dasar hijau daun tua
    ctx.fillStyle = '#22471b';
    ctx.fillRect(0, 0, 32, 32);

    // Lapisan bayangan rumput (Dark Green Shading)
    ctx.fillStyle = '#163311';
    for (let x = 0; x < 32; x += 4) {
      for (let y = 0; y < 32; y += 4) {
        if ((x * 7 + y * 13) % 5 === 0) {
          ctx.fillRect(x, y, 3, 2);
        }
      }
    }

    // Lapisan helai rumput hijau sedang (Mid Grass Blades)
    ctx.fillStyle = '#2e5e24';
    const bladeOffsets = [
      [2, 3], [7, 8], [14, 5], [21, 10], [28, 4],
      [4, 18], [11, 23], [19, 17], [26, 25], [15, 29]
    ];
    bladeOffsets.forEach(([bx, by]) => {
      ctx.fillRect(bx, by, 2, 4);
      ctx.fillRect(bx + 1, by - 1, 2, 2);
    });

    // Ujung helai rumput bercahaya (Sunlit Green Tips)
    ctx.fillStyle = '#4c8a38';
    bladeOffsets.forEach(([bx, by]) => {
      ctx.fillRect(bx, by - 1, 2, 1);
    });
    ctx.fillStyle = '#6cb54c';
    ctx.fillRect(6, 6, 2, 1);
    ctx.fillRect(20, 14, 2, 1);
    ctx.fillRect(12, 24, 2, 1);

    // Varian 2: Bunga liar padang rumput (Bunga pink & emas kecil)
    if (variant === 2) {
      // Bunga pink manis
      ctx.fillStyle = '#fda4af';
      ctx.fillRect(8, 12, 3, 3);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(9, 13, 1, 1);

      // Bunga kuning cerah
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(22, 20, 3, 3);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(23, 21, 1, 1);
    }

    // Varian 3: Semanggi & lumut tebal
    if (variant === 3) {
      ctx.fillStyle = '#559c3f';
      ctx.fillRect(16, 8, 4, 3);
      ctx.fillRect(17, 7, 2, 5);
      ctx.fillStyle = '#82cf65';
      ctx.fillRect(17, 8, 2, 2);
    }

    return canvas;
  }

  // 2. Tile Jalan Batu Kuno (Cobblestone) dengan Detail 3D Chiseled
  createCobblestoneTile() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Tanah dasar di sela bebatuan
    ctx.fillStyle = '#3a2012';
    ctx.fillRect(0, 0, 32, 32);

    // 4 Batu blok per tile 32x32
    const stones = [
      { x: 1, y: 1, w: 14, h: 14 },
      { x: 17, y: 1, w: 14, h: 13 },
      { x: 1, y: 17, w: 13, h: 14 },
      { x: 16, y: 16, w: 15, h: 15 }
    ];

    stones.forEach(s => {
      // Warna badan batu
      ctx.fillStyle = '#6b4f3b';
      ctx.fillRect(s.x, s.y, s.w, s.h);

      // Highlight atas & kiri batu (Cahaya)
      ctx.fillStyle = '#9c775d';
      ctx.fillRect(s.x, s.y, s.w - 1, 2);
      ctx.fillRect(s.x, s.y, 2, s.h - 1);

      // Bayangan bawah & kanan batu
      ctx.fillStyle = '#4a3324';
      ctx.fillRect(s.x + 1, s.y + s.h - 2, s.w - 1, 2);
      ctx.fillRect(s.x + s.w - 2, s.y + 1, 2, s.h - 1);

      // Tekstur bintik batu alami
      ctx.fillStyle = '#85634c';
      ctx.fillRect(s.x + 4, s.y + 4, 2, 2);
      ctx.fillRect(s.x + s.w - 6, s.y + s.h - 6, 2, 2);
    });

    return canvas;
  }

  // 3. Tile Air Danau Berombak 8-Bit / 16-Bit
  createWaterTile(baseColor, lightColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 32, 32);

    // Garis riak gelombang air
    ctx.fillStyle = lightColor;
    ctx.fillRect(2, 6, 12, 2);
    ctx.fillRect(18, 14, 10, 2);
    ctx.fillRect(4, 22, 14, 2);
    ctx.fillRect(20, 28, 8, 2);

    // Kilau pantulan cahaya matahari pada air
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(5, 7, 4, 1);
    ctx.fillRect(21, 15, 3, 1);
    ctx.fillRect(7, 23, 4, 1);

    return canvas;
  }

  // 4. Tile Pasir Pantai Hangat
  createSandTile() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Warna pasir dasar
    ctx.fillStyle = '#d99b3b';
    ctx.fillRect(0, 0, 32, 32);

    // Garis riak angin di pasir
    ctx.fillStyle = '#eab308';
    ctx.fillRect(4, 8, 14, 2);
    ctx.fillRect(14, 18, 15, 2);
    ctx.fillRect(2, 26, 12, 2);

    // Bintik butiran pasir halus & kerang kecil
    ctx.fillStyle = '#b47721';
    ctx.fillRect(8, 14, 2, 1);
    ctx.fillRect(24, 6, 2, 1);
    ctx.fillRect(20, 24, 2, 1);

    // Kerang putih mungil
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(18, 10, 2, 2);

    return canvas;
  }

  // 5. Tile Kayu Dermaga / Jembatan (Wood Planks)
  createWoodPlankTile() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#3e1c0c'; // Sela kayu gelap
    ctx.fillRect(0, 0, 32, 32);

    // 3 Papan kayu horizontal
    for (let py = 1; py < 32; py += 10) {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, py, 32, 8);

      // Serat kayu & highlight atas
      ctx.fillStyle = '#9a4714';
      ctx.fillRect(0, py, 32, 2);
      ctx.fillRect(6, py + 3, 12, 1);
      ctx.fillRect(20, py + 5, 8, 1);

      // Bayangan bawah papan
      ctx.fillStyle = '#451a03';
      ctx.fillRect(0, py + 6, 32, 2);

      // Paku besi di ujung papan
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(3, py + 3, 2, 2);
      ctx.fillRect(27, py + 3, 2, 2);
    }

    return canvas;
  }

  // 6. Tile Tebing Cadas / Batuan Gunung (Cliff Rock)
  createCliffTile() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#1e293b'; // Bayangan batu
    ctx.fillRect(0, 0, 32, 32);

    // Lapisan batuan cadas berlapis (Strata)
    ctx.fillStyle = '#334155';
    ctx.fillRect(2, 2, 28, 13);
    ctx.fillRect(2, 17, 28, 13);

    // Highlight tajam sudut batu
    ctx.fillStyle = '#64748b';
    ctx.fillRect(2, 2, 28, 2);
    ctx.fillRect(2, 17, 28, 2);
    ctx.fillRect(2, 2, 2, 13);
    ctx.fillRect(2, 17, 2, 13);

    // Retakan batu cadas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(12, 4, 2, 8);
    ctx.fillRect(20, 19, 2, 9);

    return canvas;
  }

  // 7. Sprite Pohon Rindang Final Fantasy (48x64 px)
  createTreeSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Batang pohon & akar
    ctx.fillStyle = '#451a03';
    ctx.fillRect(20, 42, 8, 18);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(21, 42, 4, 18); // Highlight batang
    ctx.fillStyle = '#2b1002';
    ctx.fillRect(17, 56, 5, 4); // Akar kiri
    ctx.fillRect(26, 56, 5, 4); // Akar kanan

    // Rimbunan daun tingkat bawah (Lebar)
    ctx.fillStyle = '#163812';
    ctx.beginPath();
    ctx.arc(24, 38, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#22551c';
    ctx.beginPath();
    ctx.arc(23, 35, 17, 0, Math.PI * 2);
    ctx.fill();

    // Rimbunan daun tingkat tengah
    ctx.fillStyle = '#2d6a25';
    ctx.beginPath();
    ctx.arc(24, 24, 16, 0, Math.PI * 2);
    ctx.fill();

    // Rimbunan daun tingkat atas & highlight matahari
    ctx.fillStyle = '#3d8833';
    ctx.beginPath();
    ctx.arc(22, 18, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#5db04e';
    ctx.beginPath();
    ctx.arc(19, 14, 8, 0, Math.PI * 2);
    ctx.fill();

    return canvas;
  }
}

export const tileEngine = new TileEngine();
