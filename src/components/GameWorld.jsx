import React, { useRef, useEffect } from 'react';
import { ffSprites } from '../sprites/ffSprites';
import { tileEngine } from '../sprites/tileEngine';
import { ffAudio } from '../audio/retroAudio';
import { LOCATIONS_DATA, SECRET_AREA } from '../data/locations';

export function GameWorld({ visitedList, isSecretUnlocked, onNearLocation, onLeaveLocation, moveVector }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    tileSize: 32, // 32x32 px (1 Meter = 1 Blok)
    cols: 40,     // 40 blok = 1280px lebar
    rows: 52,     // 52 blok = 1664px tinggi
    worldWidth: 1280,
    worldHeight: 1664,
    camera: { x: 0, y: 0 },
    player: {
      x: 640,
      y: 740,
      speed: 1.85, // Kecepatan santai & anggun
      vx: 0,
      vy: 0,
      facing: 'down',
      isMoving: false,
      frame: 0,
      animTimer: 0,
      stepTimer: 0
    },
    targetPos: null,
    currentNear: null,
    ambientParticles: [],
    treeLocations: [
      { x: 180, y: 380 }, { x: 260, y: 320 }, { x: 580, y: 280 }, { x: 680, y: 320 },
      { x: 140, y: 920 }, { x: 220, y: 980 }, { x: 740, y: 950 }, { x: 820, y: 1020 },
      { x: 380, y: 1120 }, { x: 720, y: 1140 }, { x: 480, y: 680 }, { x: 780, y: 680 }
    ],
    tick: 0
  });

  // Partikel ambient romantis
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * 1280,
        y: Math.random() * 1664,
        vx: (Math.random() - 0.5) * 0.4 + 0.2,
        vy: Math.random() * 0.4 + 0.2,
        size: Math.random() * 2.5 + 1.5,
        alpha: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * Math.PI * 2,
        type: Math.random() < 0.5 ? 'petal' : (Math.random() < 0.8 ? 'firefly' : 'heart')
      });
    }
    stateRef.current.ambientParticles = particles;
  }, []);

  // Update joystick / keyboard movement
  useEffect(() => {
    const s = stateRef.current;
    if (moveVector.x !== 0 || moveVector.y !== 0) {
      s.targetPos = null;
      s.player.vx = moveVector.x * s.player.speed;
      s.player.vy = moveVector.y * s.player.speed;
      s.player.isMoving = true;

      if (Math.abs(moveVector.x) > Math.abs(moveVector.y)) {
        s.player.facing = moveVector.x > 0 ? 'right' : 'left';
      } else {
        s.player.facing = moveVector.y > 0 ? 'down' : 'up';
      }
    } else if (!s.targetPos) {
      s.player.vx = 0;
      s.player.vy = 0;
      s.player.isMoving = false;
    }
  }, [moveVector]);

  // Main canvas loop & render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.imageSmoothingEnabled = false;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Tap to walk
    const handleTap = (e) => {
      if (e.target !== canvas) return;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      const s = stateRef.current;
      s.targetPos = {
        x: Math.max(32, Math.min(s.worldWidth - 32, screenX + s.camera.x)),
        y: Math.max(32, Math.min(s.worldHeight - 32, screenY + s.camera.y))
      };
      ffAudio.playStep();
    };

    canvas.addEventListener('pointerdown', handleTap);

    let animId;
    const loop = () => {
      const s = stateRef.current;
      s.tick++;

      // 1. Logika Tap to walk
      if (s.targetPos) {
        const dx = s.targetPos.x - s.player.x;
        const dy = s.targetPos.y - s.player.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 5) {
          s.player.vx = (dx / dist) * s.player.speed;
          s.player.vy = (dy / dist) * s.player.speed;
          s.player.isMoving = true;

          if (Math.abs(dx) > Math.abs(dy)) {
            s.player.facing = dx > 0 ? 'right' : 'left';
          } else {
            s.player.facing = dy > 0 ? 'down' : 'up';
          }
        } else {
          s.player.vx = 0;
          s.player.vy = 0;
          s.player.isMoving = false;
          s.targetPos = null;
        }
      }

      // 2. Gerakkan pemain
      s.player.x += s.player.vx;
      s.player.y += s.player.vy;
      s.player.x = Math.max(32, Math.min(s.worldWidth - 32, s.player.x));
      s.player.y = Math.max(32, Math.min(s.worldHeight - 32, s.player.y));

      // 3. Animasi berjalan
      if (s.player.isMoving) {
        s.player.stepTimer++;
        if (s.player.stepTimer % 28 === 0) {
          ffAudio.playStep();
        }
        s.player.animTimer++;
        if (s.player.animTimer % 8 === 0) {
          s.player.frame = (s.player.frame + 1) % 4;
        }
      } else {
        s.player.frame = 0;
        s.player.animTimer = 0;
      }

      // 4. Smooth Camera follow (Responsif Desktop & Mobile)
      let targetCamX = s.player.x - canvas.width / 2;
      let targetCamY = s.player.y - canvas.height / 2;

      // Jika layar desktop lebih lebar dari peta (misal 1920x1080), pusatkan peta secara otomatis
      if (canvas.width > s.worldWidth) {
        targetCamX = -(canvas.width - s.worldWidth) / 2;
      } else {
        targetCamX = Math.max(0, Math.min(s.worldWidth - canvas.width, targetCamX));
      }

      if (canvas.height > s.worldHeight) {
        targetCamY = -(canvas.height - s.worldHeight) / 2;
      } else {
        targetCamY = Math.max(0, Math.min(s.worldHeight - canvas.height, targetCamY));
      }

      s.camera.x += (targetCamX - s.camera.x) * 0.08;
      s.camera.y += (targetCamY - s.camera.y) * 0.08;

      // 5. Cek Proximity lokasi
      let near = null;
      for (const loc of LOCATIONS_DATA) {
        const d = Math.hypot(loc.coords.x - s.player.x, loc.coords.y - s.player.y);
        if (d < 75) {
          near = loc;
          break;
        }
      }
      if (!near) {
        const dSecret = Math.hypot(SECRET_AREA.coords.x - s.player.x, SECRET_AREA.coords.y - s.player.y);
        if (dSecret < 90) {
          near = SECRET_AREA;
        }
      }

      if (near !== s.currentNear) {
        s.currentNear = near;
        if (near) onNearLocation(near);
        else onLeaveLocation();
      }

      // 6. Update Ambient Particles
      for (const p of s.ambientParticles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.04;
        if (p.x > s.worldWidth) p.x = 0;
        if (p.x < 0) p.x = s.worldWidth;
        if (p.y > s.worldHeight) p.y = 0;
      }

      // ==========================================
      // RENDER TILES 8-BIT / 16-BIT (1 Meter = 1 Blok 32x32)
      // ==========================================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Latar belakang kosmik retro jika di layar monitor lebar
      ctx.fillStyle = '#060b18';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(-Math.floor(s.camera.x), -Math.floor(s.camera.y));

      const T = s.tileSize; // 32px

      // A. Gambar Seluruh Grid Rumput Bertekstur (Bukan Rumput Polos!)
      for (let c = 0; c < s.cols; c++) {
        for (let r = 0; r < s.rows; r++) {
          const x = c * T;
          const y = r * T;

          // Pola variasi rumput alami (rumput tebal, bunga liar, semanggi)
          const seed = (c * 17 + r * 31) % 10;
          let grassTile = tileEngine.tiles.grass1;
          if (seed === 0) grassTile = tileEngine.tiles.grass2; // Bunga liar
          else if (seed === 1) grassTile = tileEngine.tiles.grass3; // Semanggi

          ctx.drawImage(grassTile, x, y);
        }
      }

      // B. Kawasan Danau Toba (Air Biru Berombak & Berkilau)
      // Koordinat danau sekitar c: 8..28, r: 8..24
      for (let c = 8; c <= 26; c++) {
        for (let r = 7; r <= 20; r++) {
          const dx = (c - 17);
          const dy = (r - 13.5);
          if ((dx * dx) / 80 + (dy * dy) / 38 < 1.0) {
            const isDeep = (dx * dx) / 50 + (dy * dy) / 22 < 1.0;
            const wTile = isDeep ? tileEngine.tiles.waterDeep : tileEngine.tiles.waterShallow;
            ctx.drawImage(wTile, c * T, r * T);
          }
        }
      }

      // C. Pulau Samosir di Tengah Danau
      for (let c = 11; c <= 17; c++) {
        for (let r = 9; r <= 13; r++) {
          const dx = (c - 14);
          const dy = (r - 11);
          if ((dx * dx) / 8 + (dy * dy) / 3.5 < 1.0) {
            ctx.drawImage(tileEngine.tiles.grass1, c * T, r * T);
          }
        }
      }

      // Jembatan & Dermaga Kayu Samosir
      for (let c = 12; c <= 15; c++) {
        ctx.drawImage(tileEngine.tiles.wood, c * T, 13 * T);
      }

      // D. Perbukitan & Tebing Sinabung (Batu Cadas Berlapis)
      for (let c = 4; c <= 13; c++) {
        for (let r = 18; r <= 23; r++) {
          if (c + r > 24 && c - r < -7) {
            ctx.drawImage(tileEngine.tiles.cliff, c * T, r * T);
          }
        }
      }

      // E. Pantai Pasir Keemasan (Kanan Atas)
      for (let c = 27; c <= 37; c++) {
        for (let r = 8; r <= 17; r++) {
          const dx = (c - 32);
          const dy = (r - 12);
          if ((dx * dx) / 26 + (dy * dy) / 20 < 1.0) {
            ctx.drawImage(tileEngine.tiles.sand, c * T, r * T);
          }
        }
      }

      // F. Lembah Sawah Desa Meat (Terasering Hijau Asri)
      for (let c = 14; c <= 26; c++) {
        for (let r = 30; r <= 36; r++) {
          ctx.drawImage(tileEngine.tiles.grass2, c * T, r * T);
          // Batas petak sawah
          ctx.strokeStyle = '#14532d';
          ctx.lineWidth = 2;
          ctx.strokeRect(c * T, r * T, T, T);
        }
      }

      // G. Tebing Tinggi Tongging (Batu Cadas Kanan Tengah)
      for (let c = 27; c <= 36; c++) {
        for (let r = 22; r <= 27; r++) {
          ctx.drawImage(tileEngine.tiles.cliff, c * T, r * T);
        }
      }

      // H. Jalur Batu Setapak Cobblestone (3D Chiseled Blocks)
      // Jalur vertikal tengah
      for (let r = 20; r <= 30; r++) {
        ctx.drawImage(tileEngine.tiles.path, 19 * T, r * T);
        ctx.drawImage(tileEngine.tiles.path, 20 * T, r * T);
      }
      // Cabang ke Samosir
      for (let c = 13; c <= 20; c++) {
        ctx.drawImage(tileEngine.tiles.path, c * T, 14 * T);
      }
      // Cabang ke Sinabung
      for (let c = 8; c <= 19; c++) {
        ctx.drawImage(tileEngine.tiles.path, c * T, 20 * T);
      }
      // Cabang ke Pantai
      for (let c = 20; c <= 30; c++) {
        ctx.drawImage(tileEngine.tiles.path, c * T, 13 * T);
      }
      // Cabang ke Tongging
      for (let c = 20; c <= 30; c++) {
        ctx.drawImage(tileEngine.tiles.path, c * T, 24 * T);
      }
      // Jalur jembatan kosmik ke Area Rahasia
      for (let r = 36; r <= 44; r++) {
        ctx.drawImage(tileEngine.tiles.wood, 19 * T, r * T);
      }

      // I. Pohon-Pohon Rindang Final Fantasy (48x64 px)
      s.treeLocations.forEach(tl => {
        ctx.drawImage(tileEngine.tiles.tree, tl.x, tl.y);
      });

      // J. 5 Monumen Kristal Kenangan (Sacred Crystal Altars)
      LOCATIONS_DATA.forEach((loc, idx) => {
        const isVisited = visitedList.includes(loc.id);
        const x = loc.coords.x;
        const y = loc.coords.y;

        // Aura Kristal
        const pWave = Math.sin(s.tick * 0.08 + idx) * 4;
        const grad = ctx.createRadialGradient(x, y, 4, x, y, 36 + pWave);
        grad.addColorStop(0, loc.crystalColor + (isVisited ? 'aa' : '66'));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 36 + pWave, 0, Math.PI * 2);
        ctx.fill();

        // Altar Batu
        ctx.drawImage(ffSprites.propSprites.shrine, x - 20, y - 23);

        // Kristal Melayang
        const floatY = y - 36 + Math.sin(s.tick * 0.08 + idx * 1.5) * 4;
        ctx.fillStyle = loc.crystalColor;
        ctx.beginPath();
        ctx.moveTo(x, floatY - 10);
        ctx.lineTo(x + 8, floatY);
        ctx.lineTo(x, floatY + 10);
        ctx.lineTo(x - 8, floatY);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x - 2, floatY - 4, 4, 4);

        // Label Ikon & Nama
        ctx.fillStyle = '#ffffff';
        ctx.font = "bold 12px 'Press Start 2P', monospace";
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 4;
        ctx.fillText(`${loc.icon} ${loc.id}`, x, y + 36);
        ctx.font = "9px 'Press Start 2P', monospace";
        ctx.fillStyle = isVisited ? '#fef08a' : '#cbd5e1';
        ctx.fillText(loc.name, x, y + 50);
        ctx.shadowBlur = 0;
      });

      // K. Area Rahasia: Our Little Universe (Pulau Terapung Kosmik)
      const secX = SECRET_AREA.coords.x;
      const secY = SECRET_AREA.coords.y;
      const secPulse = Math.sin(s.tick * 0.06) * 10;
      const sGrad = ctx.createRadialGradient(secX, secY, 20, secX, secY, 130 + secPulse);
      sGrad.addColorStop(0, isSecretUnlocked ? 'rgba(236, 72, 153, 0.7)' : 'rgba(88, 28, 135, 0.5)');
      sGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sGrad;
      ctx.beginPath();
      ctx.arc(secX, secY, 130 + secPulse, 0, Math.PI * 2);
      ctx.fill();

      // Pulau Terapung
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.ellipse(secX, secY, 110, 55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#312e81';
      ctx.beginPath();
      ctx.ellipse(secX, secY - 5, 95, 45, 0, 0, Math.PI * 2);
      ctx.fill();

      if (isSecretUnlocked) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = "bold 11px 'Press Start 2P', monospace";
        ctx.textAlign = 'center';
        ctx.fillText('✨ TERBUKA! ✨', secX, secY + 30);
      } else {
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔒', secX, secY - 14);
        ctx.font = "8px 'Press Start 2P', monospace";
        ctx.fillStyle = '#f43f5e';
        ctx.fillText('TERKUNCI', secX, secY + 22);
      }

      // L. Tap-to-walk Marker
      if (s.targetPos) {
        const pulse = (Math.sin(s.tick * 0.15) + 1) * 3;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(s.targetPos.x, s.targetPos.y, 10 + pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💖', s.targetPos.x, s.targetPos.y + 5);
      }

      // M. Karakter Pemain (Sang Kekasih)
      const p = s.player;
      const sprite = ffSprites.characterSheets[p.facing]?.[p.frame];
      if (sprite) {
        ctx.drawImage(sprite, Math.floor(p.x - 16), Math.floor(p.y - 30));
      }

      // Nama karakter di atas kepala
      ctx.fillStyle = '#ffffff';
      ctx.font = "8px 'Press Start 2P', monospace";
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText('Udy ❤️', p.x, p.y - 34);
      ctx.shadowBlur = 0;

      // N. Partikel Melayang (Kelopak Sakura, Hati, Kunang-kunang)
      for (const pt of s.ambientParticles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, pt.alpha));
        if (pt.type === 'petal') {
          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath();
          ctx.ellipse(pt.x, pt.y, pt.size, pt.size * 0.6, pt.pulse, 0, Math.PI * 2);
          ctx.fill();
        } else if (pt.type === 'heart') {
          ctx.fillStyle = '#f43f5e';
          ctx.font = `${Math.floor(pt.size * 2.5)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('♥', pt.x, pt.y);
        } else {
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.restore();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', handleTap);
    };
  }, [visitedList, isSecretUnlocked, onNearLocation, onLeaveLocation]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', imageRendering: 'pixelated' }} />
    </div>
  );
}
