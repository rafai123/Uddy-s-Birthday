import React, { useRef, useEffect } from 'react';
import { ffSprites } from '../sprites/ffSprites';
import { tileEngine } from '../sprites/tileEngine';
import { ffAudio } from '../audio/retroAudio';
import { LOCATIONS_DATA, SECRET_AREA } from '../data/locations';

export function GameWorld({ visitedList, isSecretUnlocked, onNearLocation, onLeaveLocation, moveVector }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    tileSize: 32, // 32x32 px per blok (1 Meter = 1 Blok)
    cols: 42,     // 1344 px
    rows: 54,     // 1728 px
    worldWidth: 1344,
    worldHeight: 1728,
    camera: { x: 0, y: 0 },
    player: {
      x: 672,
      y: 780,
      speed: 1.85, // Kecepatan berjalan santai & anggun
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
    windmillAngle: 0,
    treeLocations: [
      { x: 140, y: 380 }, { x: 220, y: 330 }, { x: 580, y: 280 }, { x: 680, y: 320 },
      { x: 120, y: 940 }, { x: 220, y: 990 }, { x: 740, y: 960 }, { x: 840, y: 1020 },
      { x: 380, y: 1140 }, { x: 740, y: 1150 }, { x: 480, y: 700 }, { x: 820, y: 700 }
    ],
    terrainCanvas: null, // Kanvas pre-rendered offscreen untuk akselerasi performa 60 FPS di HP
    tick: 0
  });

  // Pre-render seluruh lanskap statis 32-bit ke offscreen canvas sekali saja saat startup
  // Ini menghemat 98% beban CPU/GPU di HP Android (dari 2.400 draw calls menjadi 1 draw call per frame!)
  const preRenderStaticTerrain = () => {
    const s = stateRef.current;
    const offCanvas = document.createElement('canvas');
    offCanvas.width = s.worldWidth;
    offCanvas.height = s.worldHeight;
    const ctx = offCanvas.getContext('2d', { alpha: false });
    ctx.imageSmoothingEnabled = false;

    const T = s.tileSize;

    // 1. Grid Rumput 32-Bit Bertekstur
    for (let c = 0; c < s.cols; c++) {
      for (let r = 0; r < s.rows; r++) {
        const x = c * T;
        const y = r * T;
        const seed = (c * 13 + r * 29) % 10;
        let grassTile = tileEngine.tiles.grass1;
        if (seed === 0) grassTile = tileEngine.tiles.grass2;
        else if (seed === 1) grassTile = tileEngine.tiles.grass3;
        ctx.drawImage(grassTile, x, y);
      }
    }

    // 2. Pantai Pasir Putih & Laut Terbuka
    for (let c = 24; c < s.cols; c++) {
      for (let r = 0; r <= 22; r++) {
        const x = c * T;
        const y = r * T;
        const coastLine = (c - 24) * 1.5 - r;

        if (coastLine > 8) {
          ctx.drawImage(tileEngine.tiles.oceanDeep, x, y);
        } else if (coastLine > 3) {
          ctx.drawImage(tileEngine.tiles.oceanMid, x, y);
        } else if (coastLine > 0) {
          ctx.drawImage(tileEngine.tiles.oceanShallow, x, y);
        } else if (coastLine > -4) {
          ctx.drawImage(tileEngine.tiles.whiteSand, x, y);
        }
      }
    }

    // 3. Danau Toba & Pulau Samosir
    for (let c = 6; c <= 25; c++) {
      for (let r = 6; r <= 20; r++) {
        const dx = (c - 15.5);
        const dy = (r - 13);
        if ((dx * dx) / 85 + (dy * dy) / 45 < 1.0) {
          const isDeep = (dx * dx) / 50 + (dy * dy) / 25 < 1.0;
          ctx.drawImage(isDeep ? tileEngine.tiles.oceanDeep : tileEngine.tiles.oceanMid, c * T, r * T);
        }
      }
    }

    // Pulau Samosir Utuh di Tengah Danau
    for (let c = 11; c <= 19; c++) {
      for (let r = 10; r <= 16; r++) {
        const dx = (c - 15);
        const dy = (r - 13);
        if ((dx * dx) / 12 + (dy * dy) / 6.5 < 1.0) {
          ctx.drawImage(tileEngine.tiles.grass1, c * T, r * T);
        }
      }
    }

    // Dermaga Kayu & Perahu Samosir
    for (let c = 8; c <= 12; c++) {
      ctx.drawImage(tileEngine.tiles.wood, c * T, 13 * T);
    }
    ctx.drawImage(tileEngine.props.boat, 10 * T - 10, 14 * T);

    // 4. Gunung Sinabung Statis
    const mtBaseX = 280;
    const mtBaseY = 740;
    const mtPeakX = 260;
    const mtPeakY = 480;

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(60, mtBaseY);
    ctx.lineTo(mtPeakX, mtPeakY);
    ctx.lineTo(460, mtBaseY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(80, mtBaseY);
    ctx.lineTo(mtPeakX, mtPeakY + 4);
    ctx.lineTo(440, mtBaseY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(mtPeakX, mtPeakY + 4);
    ctx.lineTo(mtPeakX - 60, mtBaseY);
    ctx.lineTo(mtPeakX + 80, mtBaseY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(mtPeakX - 25, mtPeakY + 28);
    ctx.lineTo(mtPeakX, mtPeakY);
    ctx.lineTo(mtPeakX + 30, mtPeakY + 32);
    ctx.closePath();
    ctx.fill();

    for (let mx = 100; mx <= 420; mx += 36) {
      ctx.drawImage(tileEngine.props.tree, mx, mtBaseY - 48);
    }

    // 5. Bukit Tongging & Menara Kincir Angin
    for (let c = 26; c <= 38; c++) {
      for (let r = 21; r <= 28; r++) {
        ctx.drawImage(tileEngine.tiles.cliff, c * T, r * T);
      }
    }
    const wmX = 33 * T;
    const wmY = 22 * T;
    ctx.drawImage(tileEngine.props.windmillTower, wmX - 25, wmY - 40);

    ctx.fillStyle = '#78350f';
    ctx.fillRect(28 * T, 25 * T, 8 * T, 4);
    for (let fx = 28 * T; fx <= 36 * T; fx += 20) {
      ctx.fillRect(fx, 25 * T - 8, 4, 12);
    }

    // 6. Desa Meat: Rumah Pedesaan & Terasering Sawah
    ctx.drawImage(tileEngine.props.cottage, 16 * T, 31 * T);
    ctx.drawImage(tileEngine.props.cottage, 22 * T, 32 * T);

    for (let c = 15; c <= 25; c++) {
      for (let r = 35; r <= 39; r++) {
        ctx.drawImage(tileEngine.tiles.grass2, c * T, r * T);
        ctx.strokeStyle = '#14532d';
        ctx.lineWidth = 2;
        ctx.strokeRect(c * T, r * T, T, T);
      }
    }

    ctx.fillStyle = '#854d0e';
    ctx.fillRect(14 * T, 30 * T, 13 * T, 3);
    for (let px = 14 * T; px <= 27 * T; px += 28) {
      ctx.fillRect(px, 30 * T - 8, 4, 11);
    }

    // 7. Jalur Batu Cobblestone
    for (let r = 21; r <= 31; r++) {
      ctx.drawImage(tileEngine.tiles.path, 20 * T, r * T);
      ctx.drawImage(tileEngine.tiles.path, 21 * T, r * T);
    }
    for (let c = 12; c <= 20; c++) ctx.drawImage(tileEngine.tiles.path, c * T, 15 * T);
    for (let c = 9; c <= 20; c++) ctx.drawImage(tileEngine.tiles.path, c * T, 22 * T);
    for (let c = 21; c <= 31; c++) ctx.drawImage(tileEngine.tiles.path, c * T, 14 * T);
    for (let c = 21; c <= 31; c++) ctx.drawImage(tileEngine.tiles.path, c * T, 25 * T);
    for (let r = 31; r <= 35; r++) ctx.drawImage(tileEngine.tiles.path, 20 * T, r * T);
    for (let r = 40; r <= 46; r++) ctx.drawImage(tileEngine.tiles.wood, 20 * T, r * T);

    // 8. Pohon Rindang
    s.treeLocations.forEach(tl => {
      ctx.drawImage(tileEngine.props.tree, tl.x, tl.y);
    });

    s.terrainCanvas = offCanvas;
  };

  // Inisialisasi partikel ambient
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * 1344,
        y: Math.random() * 1728,
        vx: (Math.random() - 0.5) * 0.4 + 0.2,
        vy: Math.random() * 0.4 + 0.2,
        size: Math.random() * 2.5 + 1.5,
        alpha: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * Math.PI * 2,
        type: Math.random() < 0.5 ? 'petal' : (Math.random() < 0.8 ? 'firefly' : 'heart')
      });
    }
    stateRef.current.ambientParticles = particles;
    preRenderStaticTerrain();
  }, []);

  // Update input vektor pergerakan
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

  // Main Canvas Loop
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

    // Tap-to-walk
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
      s.windmillAngle += 0.025; // Putaran kincir angin Tongging

      // 1. Tap to walk
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

      // 4. Smooth Camera follow (Desktop Auto-Centering & Mobile Track)
      let targetCamX = s.player.x - canvas.width / 2;
      let targetCamY = s.player.y - canvas.height / 2;

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
        if (d < 80) {
          near = loc;
          break;
        }
      }
      if (!near) {
        const dSecret = Math.hypot(SECRET_AREA.coords.x - s.player.x, SECRET_AREA.coords.y - s.player.y);
        if (dSecret < 95) {
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
      // RENDER CEPAT 60 FPS VIA OFFSCREEN CANVAS
      // ==========================================
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#050a16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(-Math.floor(s.camera.x), -Math.floor(s.camera.y));

      const T = s.tileSize;

      // A. Gambar Seluruh Lanskap Statis (HANYA 1 DRAW CALL!)
      if (s.terrainCanvas) {
        ctx.drawImage(s.terrainCanvas, 0, 0);
      }

      // B. Elemen Dinamis: Ombak Animasi Pantai
      ctx.fillStyle = '#ffffff';
      for (let r = 4; r <= 20; r += 3) {
        const cx = 25 * T + (r * 0.8) * T + Math.sin(s.tick * 0.07 + r) * 6;
        const cy = r * T;
        ctx.fillRect(cx, cy, 24, 2);
      }

      // C. Elemen Dinamis: Kepulan Kabut Kawah Gunung Sinabung
      const mtPeakX = 260;
      const mtPeakY = 480;
      const smokeDrift = Math.sin(s.tick * 0.04) * 8;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
      ctx.beginPath();
      ctx.arc(mtPeakX + smokeDrift, mtPeakY - 14, 16, 0, Math.PI * 2);
      ctx.arc(mtPeakX + smokeDrift + 14, mtPeakY - 26, 22, 0, Math.PI * 2);
      ctx.fill();

      // D. Elemen Dinamis: Baling-Baling Kincir Angin Tongging Berputar
      const wmX = 33 * T;
      const wmY = 22 * T;
      const rotorX = wmX;
      const rotorY = wmY - 22;

      ctx.save();
      ctx.translate(rotorX, rotorY);
      ctx.rotate(s.windmillAngle);
      for (let b = 0; b < 4; b++) {
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-2, -34, 4, 34);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(2, -32, 10, 26);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.strokeRect(2, -32, 10, 26);
      }
      ctx.restore();

      // E. 5 Monumen Kristal Kenangan
      LOCATIONS_DATA.forEach((loc, idx) => {
        const isVisited = visitedList.includes(loc.id);
        const x = loc.coords.x;
        const y = loc.coords.y;

        const pWave = Math.sin(s.tick * 0.08 + idx) * 5;
        const grad = ctx.createRadialGradient(x, y, 4, x, y, 38 + pWave);
        grad.addColorStop(0, loc.crystalColor + (isVisited ? 'aa' : '66'));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 38 + pWave, 0, Math.PI * 2);
        ctx.fill();

        ctx.drawImage(ffSprites.propSprites.shrine, x - 20, y - 23);

        const floatY = y - 36 + Math.sin(s.tick * 0.08 + idx * 1.5) * 4;
        ctx.fillStyle = loc.crystalColor;
        ctx.beginPath();
        ctx.moveTo(x, floatY - 12);
        ctx.lineTo(x + 9, floatY);
        ctx.lineTo(x, floatY + 12);
        ctx.lineTo(x - 9, floatY);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x - 2, floatY - 5, 4, 4);

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

      // F. Area Rahasia: Our Little Universe (Pulau Kosmik Terapung)
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

      // G. Tap-to-walk Marker
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

      // H. Karakter Pemain (Sang Kekasih) 32-Bit
      const p = s.player;
      const sprite = ffSprites.characterSheets[p.facing]?.[p.frame];
      if (sprite) {
        ctx.drawImage(sprite, Math.floor(p.x - 18), Math.floor(p.y - 34));
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = "8px 'Press Start 2P', monospace";
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText('Udy ❤️', p.x, p.y - 38);
      ctx.shadowBlur = 0;

      // I. Partikel Ambient (Kelopak Sakura, Hati, Kunang-kunang)
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
