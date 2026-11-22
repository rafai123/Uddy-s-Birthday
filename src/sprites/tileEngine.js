// Engine Grafis RPG Atmosferik (Gaya 2D-HD Serene Night & Octopath Traveler)
// Tekstur dunia tenang, elegan, dan alami: Rumput zamrud rimbun, pasir pantai lembut, dan air danau sapphire tenang

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
    // 1. Rumput Hijau Zamrud Rimbun & Natural (Calm Emerald RPG Grass)
    this.tiles.grass1 = this.makeGrassTile(1);
    this.tiles.grass2 = this.makeGrassTile(2); // dengan bunga padang rumput lembut
    this.tiles.grass3 = this.makeGrassTile(3); // dengan semanggi & lumut hutan

    // 2. Pasir Pantai Bersih Lembut (Soft Moonlit Sand)
    this.tiles.whiteSand = this.makeWhiteSandTile();

    // 3. Air Danau & Laut Sapphire Tenang (Deep Serene Sapphire Water)
    this.tiles.oceanDeep = this.makeWaterTile('#071529', '#0d223f', '#16355d');
    this.tiles.oceanMid = this.makeWaterTile('#0d223f', '#16355d', '#254e85');
    this.tiles.oceanShallow = this.makeWaterTile('#16355d', '#254e85', '#3b74b8');

    // 4. Jalan Batu Cobblestone Alami (Natural Slate Cobblestone)
    this.tiles.path = this.makeCobblestoneTile();

    // 5. Kayu Dermaga & Jembatan
    this.tiles.wood = this.makeWoodTile();

    // 6. Batuan Tebing Karang Alami (Natural Cliff Rock)
    this.tiles.cliff = this.makeCliffTile();
  }

  // 1. Rumput Natural Elegan: Hijau zamrud lembut tanpa warna terlalu silau
  makeGrassTile(variant = 1) {
    const c = document.createElement('canvas');
    c.width = 32; c.height = 32;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Latar dasar hijau zamrud alami
    ctx.fillStyle = '#1c3818';
    ctx.fillRect(0, 0, 32, 32);

    // Variasi helai rumput gelap
    ctx.fillStyle = '#142a12';
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

    // Mid tone hijau hutan
    ctx.fillStyle = '#295424';
    blades.forEach(([bx, by]) => {
      ctx.fillRect(bx, by, 2, 5);
      ctx.fillRect(bx + 1, by - 1, 2, 3);
    });

    // Highlight hijau teduh
    ctx.fillStyle = '#3c7535';
    blades.forEach(([bx, by]) => {
      ctx.fillRect(bx, by - 1, 2, 2);
    });

    // Pucuk rumput lembut
    ctx.fillStyle = '#559c4a';
    blades.forEach(([bx, by]) => {
      ctx.fillRect(bx + 1, by - 2, 1, 1);
    });

    if (variant === 2) {
      // Bunga padang rumput lembut (putih melati & kuning lembut)
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(7, 10, 2, 2);
      ctx.fillRect(8, 9, 1, 4);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(8, 10, 1, 1);

      // Bunga mentega kecil
      ctx.fillStyle = '#fde047';
      ctx.fillRect(21, 18, 2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(22, 18, 1, 1);
    } else if (variant === 3) {
      // Semanggi & lumut rimbun
      ctx.fillStyle = '#275e20';
      ctx.fillRect(14, 6, 4, 4);
      ctx.fillStyle = '#448c37';
      ctx.fillRect(15, 7, 2, 2);
      // Titik bunga liar putih mungil
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(24, 8, 2, 2);
    }

    return c;
  }

  // 2. Pasir Pantai Lembut Tenang (Moonlit Natural Sand)
  makeWhiteSandTile() {
    const c = document.createElement('canvas');
    c.width = 32; c.height = 32;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Pasir lembut netral (tidak kuning menyala)
    ctx.fillStyle = '#d1d8e0';
    ctx.fillRect(0, 0, 32, 32);

    // Butiran pasir hangat
    ctx.fillStyle = '#c0c9d3';
    for (let x = 0; x < 32; x += 4) {
      for (let y = 0; y < 32; y += 4) {
        if ((x * 13 + y * 7) % 4 === 0) {
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }

    // Riak pasir halus
    ctx.fillStyle = '#b1bcc8';
    ctx.fillRect(3, 7, 12, 1);
    ctx.fillRect(16, 17, 14, 1);
    ctx.fillRect(5, 25, 10, 1);

    // Kerang laut putih mutiara
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(20, 9, 2, 2);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(9, 19, 2, 1);

    return c;
  }

  // 3. Tile Air Sapphire Tenang & Jernih
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

    // Buih dan kilau air lembut
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(5, 7, 2, 1);
    ctx.fillRect(21, 15, 2, 1);
    // Refleksi cahaya lembut
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fillRect(10, 2, 1, 1);
    ctx.fillRect(25, 10, 1, 1);
    ctx.fillRect(3, 18, 1, 1);

    return c;
  }

  // 4. Cobblestone Jalan Batu Alami (Slate Stone Path)
  makeCobblestoneTile() {
    const c = document.createElement('canvas');
    c.width = 32; c.height = 32;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 32, 32);

    const stones = [
      { x: 1, y: 1, w: 14, h: 14 },
      { x: 17, y: 1, w: 14, h: 13 },
      { x: 1, y: 17, w: 13, h: 14 },
      { x: 16, y: 16, w: 15, h: 15 }
    ];

    stones.forEach(s => {
      ctx.fillStyle = '#334155';
      ctx.fillRect(s.x, s.y, s.w, s.h);
      ctx.fillStyle = '#475569';
      ctx.fillRect(s.x, s.y, s.w - 1, 2);
      ctx.fillRect(s.x, s.y, 2, s.h - 1);
      ctx.fillStyle = '#1e293b';
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

    ctx.fillStyle = '#3b2314';
    ctx.fillRect(0, 0, 32, 32);

    for (let py = 1; py < 32; py += 10) {
      ctx.fillStyle = '#54341f';
      ctx.fillRect(0, py, 32, 8);
      ctx.fillStyle = '#6e4429';
      ctx.fillRect(0, py, 32, 2);
      ctx.fillStyle = '#3b2314';
      ctx.fillRect(0, py + 6, 32, 2);
      ctx.fillStyle = '#946648';
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

    // Tebing batu cadas alami
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#334155';
    ctx.fillRect(2, 2, 28, 13);
    ctx.fillRect(2, 17, 28, 13);
    ctx.fillStyle = '#475569';
    ctx.fillRect(2, 2, 28, 2);
    ctx.fillRect(2, 17, 28, 2);
    // Lumut alami
    ctx.fillStyle = '#22471b';
    ctx.fillRect(4, 12, 6, 2);
    ctx.fillRect(18, 15, 8, 2);
    return c;
  }

  // ==========================================
  // PROPERTI DUNIA: RUMAH DESA, KINCIR ANGIN, POHON
  // ==========================================
  createPropTiles() {
    // 1. Rumah Pedesaan Meat (Rumah Kayu Klasik 64x64 px)
    this.props.cottage = this.createCottageSprite();

    // 2. Kincir Angin Tongging (Windmill Tower 50x70 px)
    this.props.windmillTower = this.createWindmillTower();

    // 3. Pohon Rindang 32-Bit Alami
    this.props.tree = this.createTreeSprite();

    // 4. Perahu Samosir dengan Layar Elegan
    this.props.boat = this.createBoatSprite();
  }

  createCottageSprite() {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Bayangan dasar rumah lembut
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(32, 58, 28, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dinding kayu pedesaan hangat
    ctx.fillStyle = '#78350f';
    ctx.fillRect(10, 26, 44, 32);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(12, 26, 40, 2);

    // Garis balok kayu dinding
    ctx.fillStyle = '#451a03';
    ctx.fillRect(10, 36, 44, 2);
    ctx.fillRect(10, 46, 44, 2);

    // Pintu kayu pedesaan
    ctx.fillStyle = '#3a1804';
    ctx.fillRect(26, 38, 12, 20);
    ctx.fillStyle = '#fbbf24'; // Gagang pintu kuningan
    ctx.fillRect(35, 48, 2, 2);

    // Jendela hangat berpendar lentera malam
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(14, 34, 8, 8);
    ctx.fillRect(42, 34, 8, 8);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(17, 34, 2, 8);
    ctx.fillRect(14, 37, 8, 2);
    ctx.fillRect(45, 34, 2, 8);
    ctx.fillRect(42, 37, 8, 2);

    // Atap Rumah Jerami/Rumbia Alami
    ctx.fillStyle = '#6b360a';
    ctx.beginPath();
    ctx.moveTo(32, 4);
    ctx.lineTo(60, 28);
    ctx.lineTo(4, 28);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#854d0e';
    ctx.beginPath();
    ctx.moveTo(32, 6);
    ctx.lineTo(56, 26);
    ctx.lineTo(8, 26);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#a16207';
    ctx.beginPath();
    ctx.moveTo(32, 9);
    ctx.lineTo(50, 24);
    ctx.lineTo(14, 24);
    ctx.closePath();
    ctx.fill();

    // Cerobong asap batu
    ctx.fillStyle = '#475569';
    ctx.fillRect(44, 8, 6, 12);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(43, 6, 8, 3);

    return c;
  }

  createWindmillTower() {
    const c = document.createElement('canvas');
    c.width = 50; c.height = 70;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Menara kincir angin batu cadas
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(18, 16);
    ctx.lineTo(32, 16);
    ctx.lineTo(38, 68);
    ctx.lineTo(12, 68);
    ctx.closePath();
    ctx.fill();

    // Highlight dinding menara
    ctx.fillStyle = '#475569';
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

    // Atap kubah menara kincir angin batu
    ctx.fillStyle = '#1e293b';
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

    // Badan perahu kayu alami
    ctx.fillStyle = '#54321d';
    ctx.beginPath();
    ctx.ellipse(22, 26, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6e4429';
    ctx.beginPath();
    ctx.ellipse(22, 25, 15, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tiang layar
    ctx.fillStyle = '#3a1804';
    ctx.fillRect(21, 6, 3, 20);

    // Layar putih bersih
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.moveTo(23, 7);
    ctx.lineTo(38, 16);
    ctx.lineTo(23, 22);
    ctx.closePath();
    ctx.fill();

    return c;
  }

  createTreeSprite() {
    const c = document.createElement('canvas');
    c.width = 48; c.height = 64;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Batang pohon alami
    ctx.fillStyle = '#451a03';
    ctx.fillRect(20, 42, 8, 18);
    ctx.fillStyle = '#5c2707';
    ctx.fillRect(21, 42, 4, 18);

    // Daun bertingkat hijau rimbun
    ctx.fillStyle = '#112c0e';
    ctx.beginPath();
    ctx.arc(24, 38, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#194514';
    ctx.beginPath();
    ctx.arc(23, 35, 17, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#265e1f';
    ctx.beginPath();
    ctx.arc(24, 24, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#397830';
    ctx.beginPath();
    ctx.arc(22, 18, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4f9644';
    ctx.beginPath();
    ctx.arc(20, 14, 8, 0, Math.PI * 2);
    ctx.fill();

    return c;
  }
}

export const tileEngine = new TileEngine();
