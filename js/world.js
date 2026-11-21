// Dunia Kenangan Kita - Retro 16-Bit Forgotten Warrior Canvas Engine
// Layout Peta Persis Sesuai Infografis: a_detailed_infographic_ux_design_document_layout_o.png
// Dioptimalkan untuk Android (Smooth 60FPS, Touch Gestures, Tap-to-walk, Dynamic Ambient Lighting)

import { LOCATIONS_DATA, SECRET_AREA } from "./data.js";
import { spriteManager } from "./sprites.js";
import { storage } from "./storage.js";
import { retroAudio } from "./audio.js";

export class RetroWorld {
  constructor({ canvas, onNearLocation, onLeaveLocation }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.onNearLocation = onNearLocation;
    this.onLeaveLocation = onLeaveLocation;

    // Dimensi Virtual Peta (Sesuai Layout Infografis 1200 x 1650)
    this.worldWidth = 1200;
    this.worldHeight = 1650;

    // Kamera Game (Viewport Smooth Follow)
    this.camera = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Karakter Pemain (Representasi Sang Kekasih: Jilbab Hitam + Kacamata Manis)
    this.player = {
      x: 580,
      y: 720, // Titik persimpangan tengah romantis
      speed: 3.6,
      vx: 0,
      vy: 0,
      facing: "down",
      isMoving: false,
      frame: 0,
      animTimer: 0,
      stepSoundTimer: 0
    };

    // Target Tap-to-Walk
    this.targetPos = null;
    this.targetMarkerPulse = 0;

    // Objek Interaktif (5 Lokasi Kenangan + 1 Area Rahasia)
    this.locations = LOCATIONS_DATA;
    this.secretArea = SECRET_AREA;
    this.currentNear = null;

    // Partikel Alam Romantis (Kelopak Bunga Sakura, Hati Melayang & Kunang-kunang)
    this.ambientParticles = [];
    this.initAmbientParticles(50);

    // Animasi Obor & Air
    this.tick = 0;
    this.isRunning = false;
    this.animFrameId = null;

    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.setupTapToWalk();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.imageSmoothingEnabled = false;
  }

  initAmbientParticles(count) {
    this.ambientParticles = [];
    for (let i = 0; i < count; i++) {
      this.ambientParticles.push({
        x: Math.random() * this.worldWidth,
        y: Math.random() * this.worldHeight,
        vx: (Math.random() - 0.5) * 0.6 + 0.3,
        vy: Math.random() * 0.5 + 0.3,
        size: Math.random() * 3 + 2,
        alpha: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * Math.PI * 2,
        type: Math.random() < 0.5 ? "petal" : (Math.random() < 0.8 ? "firefly" : "heart")
      });
    }
  }

  setupTapToWalk() {
    const handleTap = (screenX, screenY) => {
      const worldPos = this.screenToWorld(screenX, screenY);
      this.targetPos = {
        x: Math.max(30, Math.min(this.worldWidth - 30, worldPos.x)),
        y: Math.max(30, Math.min(this.worldHeight - 30, worldPos.y))
      };
      this.targetMarkerPulse = 1.0;
      retroAudio.playStep();
    };

    this.canvas.addEventListener("pointerdown", (e) => {
      // Abaikan jika sedang interaksi dengan elemen UI overlay
      if (e.target !== this.canvas) return;
      handleTap(e.clientX, e.clientY);
    });
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  setMovement(vx, vy) {
    // Jika ada input dari D-Pad / Joystick, batalkan tap-to-walk manual
    if (vx !== 0 || vy !== 0) {
      this.targetPos = null;
      this.player.vx = vx;
      this.player.vy = vy;
      this.player.isMoving = true;

      if (Math.abs(vx) > Math.abs(vy)) {
        this.player.facing = vx > 0 ? "right" : "left";
      } else {
        this.player.facing = vy > 0 ? "down" : "up";
      }
    } else if (!this.targetPos) {
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.isMoving = false;
    }
  }

  screenToWorld(screenX, screenY) {
    return {
      x: screenX + this.camera.x,
      y: screenY + this.camera.y
    };
  }

  update() {
    this.tick++;

    // 1. Logika Tap-to-Walk
    if (this.targetPos) {
      const dx = this.targetPos.x - this.player.x;
      const dy = this.targetPos.y - this.player.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 6) {
        this.player.vx = (dx / dist) * this.player.speed;
        this.player.vy = (dy / dist) * this.player.speed;
        this.player.isMoving = true;

        if (Math.abs(dx) > Math.abs(dy)) {
          this.player.facing = dx > 0 ? "right" : "left";
        } else {
          this.player.facing = dy > 0 ? "down" : "up";
        }
      } else {
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.isMoving = false;
        this.targetPos = null;
      }
    }

    // 2. Gerakkan Pemain & Batasi Di Area Peta
    this.player.x += this.player.vx;
    this.player.y += this.player.vy;
    this.player.x = Math.max(25, Math.min(this.worldWidth - 25, this.player.x));
    this.player.y = Math.max(25, Math.min(this.worldHeight - 25, this.player.y));

    // 3. Efek Suara Langkah Kaki saat Berjalan
    if (this.player.isMoving) {
      this.player.stepSoundTimer++;
      if (this.player.stepSoundTimer % 24 === 0) {
        retroAudio.playStep();
      }
      this.player.animTimer++;
      if (this.player.animTimer % 7 === 0) {
        this.player.frame = (this.player.frame + 1) % 4;
      }
    } else {
      this.player.frame = 0;
      this.player.animTimer = 0;
    }

    // 4. Kamera Halus (Smooth Lerp Mengikuti Pemain)
    const targetCamX = this.player.x - this.canvas.width / 2;
    const targetCamY = this.player.y - this.canvas.height / 2;
    const maxCamX = Math.max(0, this.worldWidth - this.canvas.width);
    const maxCamY = Math.max(0, this.worldHeight - this.canvas.height);

    const clampedTargetX = Math.max(0, Math.min(maxCamX, targetCamX));
    const clampedTargetY = Math.max(0, Math.min(maxCamY, targetCamY));

    this.camera.x += (clampedTargetX - this.camera.x) * 0.1;
    this.camera.y += (clampedTargetY - this.camera.y) * 0.1;

    // 5. Cek Kedekatan Dengan Lokasi Kenangan
    this.checkLocationProximity();

    // 6. Update Partikel Melayang
    this.updateAmbientParticles();
  }

  checkLocationProximity() {
    let near = null;
    const triggerRadius = 75; // Jarak interaksi responsif di layar mobile

    // Periksa 5 Lokasi Normal
    for (const loc of this.locations) {
      const dist = Math.hypot(loc.coords.x - this.player.x, loc.coords.y - this.player.y);
      if (dist < triggerRadius) {
        near = loc;
        break;
      }
    }

    // Periksa Area Rahasia jika belum dekat dengan yang lain
    if (!near) {
      const distSecret = Math.hypot(this.secretArea.coords.x - this.player.x, this.secretArea.coords.y - this.player.y);
      if (distSecret < triggerRadius + 15) {
        near = this.secretArea;
      }
    }

    if (near !== this.currentNear) {
      this.currentNear = near;
      if (near) {
        if (this.onNearLocation) this.onNearLocation(near);
      } else {
        if (this.onLeaveLocation) this.onLeaveLocation();
      }
    }
  }

  updateAmbientParticles() {
    for (const p of this.ambientParticles) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.05;

      // Loop ulang jika keluar batas
      if (p.x > this.worldWidth) p.x = 0;
      if (p.x < 0) p.x = this.worldWidth;
      if (p.y > this.worldHeight) p.y = 0;
    }
  }

  // ==========================================
  // RENDER GRAFIK RETRO (Forgotten Warrior Style)
  // ==========================================
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    // Geser kanvas sesuai posisi kamera
    ctx.translate(-Math.floor(this.camera.x), -Math.floor(this.camera.y));

    // 1. Gambar Dasar Tanah, Danau & Lanskap Peta
    this.renderRetroTerrain(ctx);

    // 2. Gambar Jalan Setapak & Jembatan Kayu
    this.renderPathwaysAndBridges(ctx);

    // 3. Gambar 5 Lokasi Kenangan & Monumen Kuil Retro
    this.renderLocationMonuments(ctx);

    // 4. Gambar Area Rahasia "Our Little Universe"
    this.renderSecretCosmicIsland(ctx);

    // 5. Gambar Target Tap-to-Walk
    if (this.targetPos) {
      this.renderTargetMarker(ctx);
    }

    // 6. Gambar Karakter Pemain (Sang Kekasih)
    this.renderPlayer(ctx);

    // 7. Partikel Alam Melayang (Bunga Sakura, Hati, Kunang-kunang)
    this.renderAmbientParticles(ctx);

    // 8. Efek Pencahayaan Retro Malam Romantis (Torchlights & Vignette)
    this.renderRetroLighting(ctx);

    ctx.restore();
  }

  // Menggambar lanskap retro: Danau Toba, Bukit Sinabung, Pantai, Lembah Meat, Tebing Tongging
  renderRetroTerrain(ctx) {
    // 1. Dasar Rumput Lembah Hijau Khas Forgotten Warrior (#2d5a27)
    ctx.fillStyle = "#2d5a27";
    ctx.fillRect(0, 0, this.worldWidth, this.worldHeight);

    // Pola tekstur rumput pixel-art
    ctx.fillStyle = "#24491f";
    for (let x = 0; x < this.worldWidth; x += 32) {
      for (let y = 0; y < this.worldHeight; y += 32) {
        if ((x + y) % 64 === 0) {
          ctx.fillRect(x + 4, y + 4, 8, 4);
          ctx.fillRect(x + 20, y + 16, 6, 3);
        }
      }
    }

    // 2. Danau Toba (Air Biru Jernih di Kiri Atas & Tengah)
    ctx.fillStyle = "#1e3a8a"; // Biru Danau Dalam
    ctx.beginPath();
    ctx.ellipse(450, 420, 360, 260, -0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#2563eb"; // Permukaan Air Berkilau
    ctx.beginPath();
    ctx.ellipse(440, 410, 330, 230, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // Garis riak ombak air bergerak
    ctx.fillStyle = "#60a5fa";
    const waveShift = Math.sin(this.tick * 0.05) * 6;
    for (let wy = 260; wy <= 540; wy += 45) {
      ctx.fillRect(250 + waveShift, wy, 80, 3);
      ctx.fillRect(400 - waveShift, wy + 20, 90, 3);
      ctx.fillRect(550 + waveShift, wy - 10, 70, 3);
    }

    // Pulau Samosir di tengah danau
    ctx.fillStyle = "#365314";
    ctx.beginPath();
    ctx.ellipse(420, 350, 110, 75, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4d7c0f";
    ctx.beginPath();
    ctx.ellipse(415, 345, 95, 65, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // 3. Pegunungan Sinabung (Kiri Tengah / Bawah)
    ctx.fillStyle = "#1f2937"; // Puncak Gunung Gelap
    ctx.beginPath();
    ctx.moveTo(80, 780);
    ctx.lineTo(240, 520);
    ctx.lineTo(390, 780);
    ctx.fill();
    // Salju/kabut di puncak gunung
    ctx.fillStyle = "#cbd5e1";
    ctx.beginPath();
    ctx.moveTo(210, 570);
    ctx.lineTo(240, 520);
    ctx.lineTo(270, 570);
    ctx.fill();

    // 4. Kawasan Pantai Berpasir Emas (Kanan Atas)
    ctx.fillStyle = "#ca8a04"; // Pasir pantai hangat
    ctx.beginPath();
    ctx.ellipse(980, 360, 200, 140, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#eab308";
    ctx.beginPath();
    ctx.ellipse(990, 350, 170, 110, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Ombak pantai berbuih putih
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(860, 310 + Math.sin(this.tick * 0.06) * 4, 30, 2);
    ctx.fillRect(910, 380 - Math.sin(this.tick * 0.06) * 4, 40, 2);

    // 5. Lembah Pedesaan Meat (Tengah Bawah)
    ctx.fillStyle = "#166534"; // Terasering hijau asri
    ctx.fillRect(440, 950, 320, 180);
    // Pematang sawah
    ctx.strokeStyle = "#14532d";
    ctx.lineWidth = 3;
    ctx.strokeRect(460, 970, 280, 50);
    ctx.strokeRect(460, 1030, 280, 60);

    // 6. Tebing Tongging Megah (Kanan Tengah / Bawah)
    ctx.fillStyle = "#475569"; // Batu tebing terjal
    ctx.fillRect(860, 680, 280, 180);
    ctx.fillStyle = "#64748b"; // Lapisan atas tebing
    ctx.fillRect(880, 690, 240, 40);
    // Railing dek pemandangan tebing
    ctx.fillStyle = "#78350f";
    ctx.fillRect(880, 730, 180, 5);
    for (let rx = 880; rx <= 1060; rx += 25) {
      ctx.fillRect(rx, 730, 4, 15);
    }
  }

  // Menggambar jalan batu kuno & jembatan kayu penghubung
  renderPathwaysAndBridges(ctx) {
    // Jalur batu utama Forgotten Warrior (#78543e)
    ctx.fillStyle = "#854d0e";
    // Jalur tengah persimpangan
    ctx.fillRect(540, 660, 80, 280);
    // Jalur menuju Samosir & Danau
    ctx.fillRect(400, 430, 150, 40);
    // Jalur menuju Sinabung
    ctx.fillRect(260, 640, 290, 35);
    // Jalur menuju Pantai
    ctx.fillRect(610, 430, 340, 35);
    // Jalur menuju Tongging
    ctx.fillRect(610, 760, 340, 35);
    // Jalur menuju Desa Meat
    ctx.fillRect(555, 930, 50, 150);
    // Jalur jembatan kosmik menuju Area Rahasia
    ctx.fillStyle = "#312e81";
    ctx.fillRect(560, 1180, 40, 200);

    // Jembatan Kayu Menuju Pulau Samosir (Melintasi Air)
    ctx.fillStyle = "#78350f";
    ctx.fillRect(400, 420, 80, 50);
    ctx.fillStyle = "#451a03";
    for (let bx = 405; bx < 480; bx += 14) {
      ctx.fillRect(bx, 418, 3, 54);
    }

    // Perahu kayu bersandar di dermaga Samosir
    ctx.fillStyle = "#9a3412";
    ctx.beginPath();
    ctx.ellipse(370, 450, 26, 10, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(368, 440, 3, 12); // Tiang layar
    ctx.fillStyle = "#fda4af"; // Layar pink romantis
    ctx.beginPath();
    ctx.moveTo(371, 440);
    ctx.lineTo(385, 446);
    ctx.lineTo(371, 450);
    ctx.fill();
  }

  // Menggambar monumen kristal & ikon 5 lokasi kenangan
  renderLocationMonuments(ctx) {
    this.locations.forEach((loc, index) => {
      const isVisited = storage.isLocationVisited(loc.id);
      const isCurrentNear = this.currentNear && this.currentNear.id === loc.id;
      const x = loc.coords.x;
      const y = loc.coords.y;

      // 1. Bayangan & Lingkaran Cahaya Magis
      const pulse = Math.sin(this.tick * 0.08 + index) * 5;
      const radius = 28 + (isCurrentNear ? 6 : 0) + pulse * 0.5;

      const grad = ctx.createRadialGradient(x, y, 5, x, y, radius + 15);
      grad.addColorStop(0, loc.themeColor + (isVisited ? "aa" : "66"));
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius + 15, 0, Math.PI * 2);
      ctx.fill();

      // 2. Monumen Batu Kuno Pixel
      ctx.drawImage(spriteManager.propSprites.shrine, x - 18, y - 22);

      // 3. Kristal / Permata Mengambang di Atas Monumen
      const floatY = y - 35 + Math.sin(this.tick * 0.08 + index * 1.5) * 4;
      ctx.fillStyle = loc.themeColor;
      ctx.beginPath();
      ctx.moveTo(x, floatY - 10);
      ctx.lineTo(x + 9, floatY);
      ctx.lineTo(x, floatY + 10);
      ctx.lineTo(x - 9, floatY);
      ctx.closePath();
      ctx.fill();
      // Kilau kristal
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x - 2, floatY - 4, 4, 4);

      // 4. Nomor & Ikon Lokasi
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.shadowColor = "#000000";
      ctx.shadowBlur = 6;
      ctx.fillText(`${loc.icon} ${loc.id}`, x, y + 36);
      ctx.shadowBlur = 0;

      // Label Nama Tempat
      ctx.font = "10px 'Press Start 2P', monospace";
      ctx.fillStyle = isVisited ? "#fef08a" : "#cbd5e1";
      ctx.fillText(loc.name, x, y + 50);

      // Centang jika sudah dikunjungi
      if (isVisited) {
        ctx.fillStyle = "#4ade80";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText("✓ SELESAI", x, y + 64);
      }
    });
  }

  // Menggambar Area Rahasia: "Our Little Universe" (Pulau Kosmik Terapung)
  renderSecretCosmicIsland(ctx) {
    const secret = this.secretArea;
    const isUnlocked = storage.isSecretUnlocked();
    const x = secret.coords.x;
    const y = secret.coords.y;

    // 1. Aura Kosmik Nebula Ungu-Emas Berdenyut
    const pulse = Math.sin(this.tick * 0.06) * 10;
    const grad = ctx.createRadialGradient(x, y, 20, x, y, 140 + pulse);
    grad.addColorStop(0, isUnlocked ? "rgba(236, 72, 153, 0.7)" : "rgba(88, 28, 135, 0.5)");
    grad.addColorStop(0.6, isUnlocked ? "rgba(245, 158, 11, 0.4)" : "rgba(30, 27, 75, 0.4)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, 140 + pulse, 0, Math.PI * 2);
    ctx.fill();

    // 2. Pulau Batu Kosmik Terapung
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    ctx.ellipse(x, y, 110, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#312e81";
    ctx.beginPath();
    ctx.ellipse(x, y - 5, 95, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bintang-bintang kecil di pulau
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(x - 50, y - 15, 2, 2);
    ctx.fillRect(x + 40, y - 10, 2, 2);
    ctx.fillRect(x - 20, y + 15, 3, 3);
    ctx.fillRect(x + 30, y + 18, 2, 2);

    // 3. Gapura Gerbang Kosmik (Portal Gate)
    ctx.drawImage(spriteManager.propSprites.cosmicGate, x - 22, y - 50);

    // 4. Status Kunci / Portal Terbuka
    if (isUnlocked) {
      // Portal Bintang Terbuka & Bersinar Memukau
      const portalGrad = ctx.createRadialGradient(x, y - 25, 2, x, y - 25, 22);
      portalGrad.addColorStop(0, "#ffffff");
      portalGrad.addColorStop(0.4, "#ec4899");
      portalGrad.addColorStop(1, "transparent");
      ctx.fillStyle = portalGrad;
      ctx.beginPath();
      ctx.arc(x, y - 25, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 11px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.fillText("✨ TERBUKA! ✨", x, y + 35);
      ctx.fillStyle = "#ffffff";
      ctx.font = "9px 'Press Start 2P', monospace";
      ctx.fillText("Our Little Universe", x, y + 50);
    } else {
      // Gembok Emas Misterius Terkunci
      ctx.fillStyle = "#f59e0b";
      ctx.font = "26px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🔒", x, y - 16);

      ctx.font = "9px 'Press Start 2P', monospace";
      ctx.fillStyle = "#f43f5e";
      ctx.fillText("TERKUNCI", x, y + 25);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "8px 'Press Start 2P', monospace";
      ctx.fillText(`(${storage.getVisitedCount()}/5 Kenangan Ditemukan)`, x, y + 40);
    }
  }

  // Menggambar Karakter Pemain (Representasi Sang Kekasih)
  renderPlayer(ctx) {
    const p = this.player;
    const sprite = spriteManager.characterSheets[p.facing][p.frame];

    if (sprite) {
      // Gambar sprite karakter (ukuran 32x36 diproyeksikan proporsional)
      ctx.drawImage(sprite, Math.floor(p.x - 16), Math.floor(p.y - 30));
    }

    // Nama karakter kecil & hati di atas kepala
    ctx.fillStyle = "#ffffff";
    ctx.font = "8px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 4;
    ctx.fillText("Udy ❤️", p.x, p.y - 34);
    ctx.shadowBlur = 0;
  }

  // Menggambar Target Tap-to-Walk Marker
  renderTargetMarker(ctx) {
    const t = this.targetPos;
    const pulse = (Math.sin(this.tick * 0.15) + 1) * 3;

    ctx.strokeStyle = "#ec4899";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(t.x, t.y, 10 + pulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#f43f5e";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("💖", t.x, t.y + 5);
  }

  // Menggambar partikel alam (Kelopak Sakura, Hati Kecil, Kunang-kunang)
  renderAmbientParticles(ctx) {
    for (const p of this.ambientParticles) {
      const alpha = Math.sin(p.pulse) * 0.2 + p.alpha;
      ctx.save();
      ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));

      if (p.type === "petal") {
        ctx.fillStyle = "#fbcfe8"; // Kelopak bunga merah muda lembut
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size, p.size * 0.6, p.pulse, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === "heart") {
        ctx.fillStyle = "#f43f5e";
        ctx.font = `${Math.floor(p.size * 2.5)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("♥", p.x, p.y);
      } else {
        // Kunang-kunang kuning keemasan bersinar
        ctx.fillStyle = "#fef08a";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Menggambar tata cahaya retro & obor menyala di sepanjang jalur
  renderRetroLighting(ctx) {
    // Obor-obor penerang jalan Forgotten Warrior
    const torchPositions = [
      { x: 520, y: 680 },
      { x: 640, y: 680 },
      { x: 520, y: 880 },
      { x: 640, y: 880 },
      { x: 380, y: 400 },
      { x: 480, y: 400 },
      { x: 920, y: 740 },
      { x: 540, y: 1140 }
    ];

    torchPositions.forEach((tp) => {
      // Gambar tiang obor
      ctx.drawImage(spriteManager.propSprites.torch, tp.x - 8, tp.y - 12);

      // Api obor retro berkedip
      const flameFlicker = Math.sin(this.tick * 0.2 + tp.x) * 2;
      const flameGrad = ctx.createRadialGradient(tp.x, tp.y - 10, 2, tp.x, tp.y - 10, 26 + flameFlicker);
      flameGrad.addColorStop(0, "rgba(251, 191, 36, 0.7)");
      flameGrad.addColorStop(0.5, "rgba(249, 115, 22, 0.3)");
      flameGrad.addColorStop(1, "transparent");

      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.arc(tp.x, tp.y - 10, 26 + flameFlicker, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.render();
    this.animFrameId = requestAnimationFrame(() => this.loop());
  }
}
