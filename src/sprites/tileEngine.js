// Engine Grafis 24-Bit / 32-Bit RPG (Gaya 2D-HD Golden Sun & Octopath Traveler)
// Menyediakan tekstur blok kaya: Rumput halus bergradasi, pasir putih, air laut berombak, rumah desa, dan kincir angin Tongging

export class TileEngine {
  constructor() {
    this.tileSize = 32; // 32x32 px per blok
    this.tiles = {};
    this.props = {};
    this.init();
  }

  init() {
    this.createTerrainTiles();
    this.createPropTiles();
  }

  createTerrainTiles() {
    // 1. Rumput 24-Bit / 32-Bit Rimbun & Halus (Lush RPG Grass)
    this.tiles.grass1 = this.makeGrassTile(1);
    this.tiles.grass2 = this.makeGrassTile(2); // dengan bunga padang rumput
    this.tiles.grass3 = this.makeGrassTile(3); // dengan semanggi & lumut

    // 2. Pasir Putih Bersih (White Sand Beach)
    this.tiles.whiteSand = this.makeWhiteSandTile();

    // 3. Air Danau & Laut Dalam / Dangkal
    this.tiles.oceanDeep = this.makeWaterTile('#0b1d3a', '#10356c', '#1d559e');
    this.tiles.oceanMid = this.makeWaterTile('#10356c', '#1d559e', '#38bdf8');
    this.tiles.oceanShallow = this.makeWaterTile('#1d559e', '#2563eb', '#67e8f9');

    // 4. Jalan Batu Cobblestone 32-Bit Bergradasi Halus
    this.tiles.path = this.makeCobblestoneTile();

    // 5. Kayu Dermaga & Jembatan
    this.tiles.wood = this.makeWoodTile();

    // 6. Batuan Cadas Tebing
    this.tiles.cliff = this.makeCliffTile();
  }

  // 1. Rumput 32-Bit: Shading halus 6 tingkat warna hijau alami
  makeGrassTile(variant = 1) {
    const c = document.createElement('canvas');
    c.width = 32; c.height = 32;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Gradasi dasar hijau zamrud
    ctx.fillStyle = '#1e401b';
    ctx.fillRect(0, 0, 32, 32);

    // Lapisan helai rumput gelap
    ctx.fillStyle = '#153112';
    for (let x = 0; x < 32; x += 4) {
      for (let y = 0; y < 32; y += 4) {
        if ((x * 11 + y * 19) % 3 === 0) {
          ctx.fillRect(x, y, 3, 3);
        }
      }
    }

    // Helai rumput hidup bertingkat
    const blades = [
      [2, 2], [6, 7], [13, 3], [19, 8], [27, 4],
      [4, 15], [10, 21], [17, 14], [25, 20], [8, 27], [22, 26]
    ];

    // Mid tone
    ctx.fillStyle = '#2d6325';
    blades.forEach(([bx, by]) => {
      ctx.fillRect(bx, by, 2, 5);
      ctx.fillRect(bx + 1, by - 1, 2, 3);
    });

    // Highlight hijau muda
    ctx.fillStyle = '#4c8c3a';
    blades.forEach(([bx, by]) => {
      ctx.fillRect(bx, by - 1, 2, 2);
    });

    // Pucuk rumput berkilau cahaya matahari (Sunlit Sparkle)
    ctx.fillStyle = '#72be55';
    blades.forEach(([bx, by]) => {
      ctx.fillRect(bx + 1, by - 2, 1, 1);
    });

    // Varian Bunga Padang Rumput
    if (variant === 2) {
      // Bunga mawar mini pink
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(7, 10, 3, 3);
      ctx.fillRect(8, 9, 1, 5);
      ctx.fillStyle = '#fda4af';
      ctx.fillRect(8, 10, 1, 1);

      // Bunga daisy kuning
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(21, 18, 3, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(22, 19, 1, 1);
    } else if (variant === 3) {
      // Semanggi & lumut tebal
      ctx.fillStyle = '#61b347';
      ctx.fillRect(14, 6, 4, 4);
      ctx.fillStyle = '#8ee070';
      ctx.fillRect(15, 7, 2, 2);
    }

    return c;
  }

  // 2. Pasir Putih Bersih (White Sand Beach)
  makeWhiteSandTile() {
    const c = document.createElement('canvas');
    c.width = 32; c.height = 32;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Pasir putih gading hangat
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, 32, 32);

    // Butiran pasir keemasan lembut
    ctx.fillStyle = '#e5e7eb';
    for (let x = 0; x < 32; x += 4) {
      for (let y = 0; y < 32; y += 4) {
        if ((x * 13 + y * 7) % 4 === 0) {
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }

    // Riak angin halus di pasir
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(3, 7, 12, 1);
    ctx.fillRect(16, 17, 14, 1);
    ctx.fillRect(5, 25, 10, 1);

    // Kerang laut merah muda & mutiara
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(20, 9, 2, 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(9, 19, 2, 1);

    return c;
  }

  // 3. Tile Air Laut & Danau Berombak
  makeWaterTile(cDeep, cMid, cLight) {
    const c = document.createElement('canvas');
    c.width = 32; c.height = 32;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = cDeep;
    ctx.fillRect(0, 0, 32, 32);

    ctx.fillStyle = cMid;
    ctx.fillRect(2, 6, 13, 3);
    ctx.fillRect(18, 14, 11, 3);
    ctx.fillRect(4, 22, 14, 3);

    ctx.fillStyle = cLight;
    ctx.fillRect(4, 7, 6, 1);
    ctx.fillRect(20, 15, 5, 1);
    ctx.fillRect(6, 23, 7, 1);

    // Buih air putih berkilau
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(5, 7, 2, 1);
    ctx.fillRect(21, 15, 2, 1);

    return c;
  }

  // 4. Cobblestone 32-Bit
  makeCobblestoneTile() {
    const c = document.createElement('canvas');
    c.width = 32; c.height = 32;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#2b1b12';
    ctx.fillRect(0, 0, 32, 32);

    const stones = [
      { x: 1, y: 1, w: 14, h: 14 },
      { x: 17, y: 1, w: 14, h: 13 },
      { x: 1, y: 17, w: 13, h: 14 },
      { x: 16, y: 16, w: 15, h: 15 }
    ];

    stones.forEach(s => {
      ctx.fillStyle = '#6e513e';
      ctx.fillRect(s.x, s.y, s.w, s.h);
      ctx.fillStyle = '#9e7b64';
      ctx.fillRect(s.x, s.y, s.w - 1, 2);
      ctx.fillRect(s.x, s.y, 2, s.h - 1);
      ctx.fillStyle = '#483022';
      ctx.fillRect(s.x + 1, s.y + s.h - 2, s.w - 1, 2);
      ctx.fillRect(s.x + s.w - 2, s.y + 1, 2, s.h - 1);
    });

    return c;
  }

  makeWoodTile() {
    const c = document.createElement('canvas');
    c.width = 32; c.height = 32;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#3a1a0c';
    ctx.fillRect(0, 0, 32, 32);

    for (let py = 1; py < 32; py += 10) {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, py, 32, 8);
      ctx.fillStyle = '#9a4714';
      ctx.fillRect(0, py, 32, 2);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(0, py + 6, 32, 2);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(3, py + 3, 2, 2);
      ctx.fillRect(27, py + 3, 2, 2);
    }
    return c;
  }

  makeCliffTile() {
    const c = document.createElement('canvas');
    c.width = 32; c.height = 32;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#334155';
    ctx.fillRect(2, 2, 28, 13);
    ctx.fillRect(2, 17, 28, 13);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(2, 2, 28, 2);
    ctx.fillRect(2, 17, 28, 2);
    return c;
  }

  // ==========================================
  // PROPERTI DUNIA: RUMAH DESA, KINCIR ANGIN, POHON
  // ==========================================
  createPropTiles() {
    // 1. Rumah Pedesaan Meat (Rumah Kayu Asri 64x64 px)
    this.props.cottage = this.createCottageSprite();

    // 2. Kincir Angin Tongging (Windmill Tower 50x70 px)
    this.props.windmillTower = this.createWindmillTower();

    // 3. Pohon Rindang 32-Bit
    this.props.tree = this.createTreeSprite();

    // 4. Perahu Samosir dengan Layar Romantis
    this.props.boat = this.createBoatSprite();
  }

  createCottageSprite() {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Bayangan dasar rumah
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(32, 58, 28, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dinding kayu pedesaan
    ctx.fillStyle = '#78350f';
    ctx.fillRect(10, 26, 44, 32);
    ctx.fillStyle = '#9a4714';
    ctx.fillRect(12, 26, 40, 2);

    // Garis balok kayu dinding
    ctx.fillStyle = '#451a03';
    ctx.fillRect(10, 36, 44, 2);
    ctx.fillRect(10, 46, 44, 2);

    // Pintu kayu pedesaan
    ctx.fillStyle = '#3d1a04';
    ctx.fillRect(26, 38, 12, 20);
    ctx.fillStyle = '#fbbf24'; // Gagang pintu kuningan
    ctx.fillRect(35, 48, 2, 2);

    // Jendela hangat berpendar cahaya
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(14, 34, 8, 8);
    ctx.fillRect(42, 34, 8, 8);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(17, 34, 2, 8);
    ctx.fillRect(14, 37, 8, 2);
    ctx.fillRect(45, 34, 2, 8);
    ctx.fillRect(42, 37, 8, 2);

    // Atap Rumah Jerami/Rumbia Pedesaan (Segitiga Bertingkat)
    ctx.fillStyle = '#854d0e';
    ctx.beginPath();
    ctx.moveTo(32, 4);
    ctx.lineTo(60, 28);
    ctx.lineTo(4, 28);
    ctx.closePath();
    ctx.fill();

    // Shading jerami atap
    ctx.fillStyle = '#a16207';
    ctx.beginPath();
    ctx.moveTo(32, 6);
    ctx.lineTo(56, 26);
    ctx.lineTo(8, 26);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.moveTo(32, 9);
    ctx.lineTo(50, 24);
    ctx.lineTo(14, 24);
    ctx.closePath();
    ctx.fill();

    // Cerobong asap kecil
    ctx.fillStyle = '#64748b';
    ctx.fillRect(44, 8, 6, 12);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(43, 6, 8, 3);

    return c;
  }

  createWindmillTower() {
    const c = document.createElement('canvas');
    c.width = 50; c.height = 70;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Menara kincir angin batu/kayu silinder meruncing
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(18, 16);
    ctx.lineTo(32, 16);
    ctx.lineTo(38, 68);
    ctx.lineTo(12, 68);
    ctx.closePath();
    ctx.fill();

    // Highlight dinding menara
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(20, 16);
    ctx.lineTo(28, 16);
    ctx.lineTo(32, 68);
    ctx.lineTo(16, 68);
    ctx.closePath();
    ctx.fill();

    // Pintu menara
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(22, 54, 8, 14);

    // Atap kubah menara kincir angin
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.ellipse(25, 16, 10, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Poros tengah kincir
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(25, 18, 4, 0, Math.PI * 2);
    ctx.fill();

    return c;
  }

  createBoatSprite() {
    const c = document.createElement('canvas');
    c.width = 44; c.height = 36;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Badan perahu kayu
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(22, 26, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#9a4714';
    ctx.beginPath();
    ctx.ellipse(22, 25, 15, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tiang layar
    ctx.fillStyle = '#451a03';
    ctx.fillRect(21, 6, 3, 20);

    // Layar romantis putih-pink
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(23, 7);
    ctx.lineTo(38, 16);
    ctx.lineTo(23, 22);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fda4af';
    ctx.fillRect(24, 13, 10, 3);

    return c;
  }

  createTreeSprite() {
    const c = document.createElement('canvas');
    c.width = 48; c.height = 64;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Batang
    ctx.fillStyle = '#451a03';
    ctx.fillRect(20, 42, 8, 18);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(21, 42, 4, 18);

    // Daun bertingkat
    ctx.fillStyle = '#143811';
    ctx.beginPath();
    ctx.arc(24, 38, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1d5518';
    ctx.beginPath();
    ctx.arc(23, 35, 17, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#296b22';
    ctx.beginPath();
    ctx.arc(24, 24, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3a8731';
    ctx.beginPath();
    ctx.arc(22, 18, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#59ae4d';
    ctx.beginPath();
    ctx.arc(20, 14, 8, 0, Math.PI * 2);
    ctx.fill();

    return c;
  }
}

export const tileEngine = new TileEngine();
