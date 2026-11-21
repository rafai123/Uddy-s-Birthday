import React, { useRef, useEffect } from 'react';
import { ffSprites } from '../sprites/ffSprites';
import { ffAudio } from '../audio/retroAudio';
import { LOCATIONS_DATA, SECRET_AREA } from '../data/locations';

export function GameWorld({ visitedList, isSecretUnlocked, onNearLocation, onLeaveLocation, moveVector }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    worldWidth: 1200,
    worldHeight: 1650,
    camera: { x: 0, y: 0 },
    player: {
      x: 580,
      y: 720,
      speed: 1.85, // Kecepatan berjalan diperlambat sesuai permintaan agar santai & anggun
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
    tick: 0
  });

  // Inisialisasi partikel ambient alam romantis
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * 1200,
        y: Math.random() * 1650,
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

  // Update input vektor pergerakan joystick
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

  // Canvas loop & render
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
        x: Math.max(30, Math.min(s.worldWidth - 30, screenX + s.camera.x)),
        y: Math.max(30, Math.min(s.worldHeight - 30, screenY + s.camera.y))
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

      // 2. Gerakkan karakter
      s.player.x += s.player.vx;
      s.player.y += s.player.vy;
      s.player.x = Math.max(25, Math.min(s.worldWidth - 25, s.player.x));
      s.player.y = Math.max(25, Math.min(s.worldHeight - 25, s.player.y));

      // 3. Animasi berjalan & SFX langkah kaki
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

      // 4. Smooth Camera follow
      const targetCamX = s.player.x - canvas.width / 2;
      const targetCamY = s.player.y - canvas.height / 2;
      const maxCamX = Math.max(0, s.worldWidth - canvas.width);
      const maxCamY = Math.max(0, s.worldHeight - canvas.height);

      const clampedTargetX = Math.max(0, Math.min(maxCamX, targetCamX));
      const clampedTargetY = Math.max(0, Math.min(maxCamY, targetCamY));

      s.camera.x += (clampedTargetX - s.camera.x) * 0.08;
      s.camera.y += (clampedTargetY - s.camera.y) * 0.08;

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
      // RENDER CANVAS
      // ==========================================
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(-Math.floor(s.camera.x), -Math.floor(s.camera.y));

      // A. Terrain Lanskap Final Fantasy
      // Tanah & Lembah Hijau
      ctx.fillStyle = '#1e3820';
      ctx.fillRect(0, 0, s.worldWidth, s.worldHeight);

      // Tekstur pola rumput FF
      ctx.fillStyle = '#172c18';
      for (let x = 0; x < s.worldWidth; x += 32) {
        for (let y = 0; y < s.worldHeight; y += 32) {
          if ((x + y) % 64 === 0) {
            ctx.fillRect(x + 4, y + 4, 8, 4);
            ctx.fillRect(x + 18, y + 16, 6, 3);
          }
        }
      }

      // Danau Toba (Air Biru Jernih Animasi)
      ctx.fillStyle = '#0f2744';
      ctx.beginPath();
      ctx.ellipse(450, 420, 360, 260, -0.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1e4875';
      ctx.beginPath();
      ctx.ellipse(440, 410, 330, 230, -0.15, 0, Math.PI * 2);
      ctx.fill();

      // Riak air & pantulan cahaya
      ctx.fillStyle = '#38bdf8';
      const wave = Math.sin(s.tick * 0.05) * 5;
      for (let wy = 260; wy <= 540; wy += 45) {
        ctx.fillRect(250 + wave, wy, 70, 2);
        ctx.fillRect(410 - wave, wy + 20, 80, 2);
        ctx.fillRect(540 + wave, wy - 10, 60, 2);
      }

      // Pulau Samosir
      ctx.fillStyle = '#2d4a22';
      ctx.beginPath();
      ctx.ellipse(420, 350, 110, 75, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3a622c';
      ctx.beginPath();
      ctx.ellipse(415, 345, 95, 65, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Perbukitan Sinabung
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(80, 780);
      ctx.lineTo(240, 520);
      ctx.lineTo(390, 780);
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(210, 570);
      ctx.lineTo(240, 520);
      ctx.lineTo(270, 570);
      ctx.fill();

      // Pantai Berpasir Emas
      ctx.fillStyle = '#ca8a04';
      ctx.beginPath();
      ctx.ellipse(980, 360, 200, 140, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.ellipse(990, 350, 170, 110, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Lembah Desa Meat
      ctx.fillStyle = '#14532d';
      ctx.fillRect(440, 950, 320, 180);
      ctx.strokeStyle = '#052e16';
      ctx.lineWidth = 3;
      ctx.strokeRect(460, 970, 280, 50);
      ctx.strokeRect(460, 1030, 280, 60);

      // Tebing Tongging
      ctx.fillStyle = '#334155';
      ctx.fillRect(860, 680, 280, 180);
      ctx.fillStyle = '#475569';
      ctx.fillRect(880, 690, 240, 40);

      // Jalan Batu Setapak Final Fantasy
      ctx.fillStyle = '#713f12';
      ctx.fillRect(540, 660, 80, 280);
      ctx.fillRect(400, 430, 150, 40);
      ctx.fillRect(260, 640, 290, 35);
      ctx.fillRect(610, 430, 340, 35);
      ctx.fillRect(610, 760, 340, 35);
      ctx.fillRect(555, 930, 50, 150);

      // Jembatan Kosmik menuju Area Rahasia
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(560, 1180, 40, 200);

      // Jembatan Kayu Samosir
      ctx.fillStyle = '#451a03';
      ctx.fillRect(400, 420, 80, 50);

      // B. Monumen Kristal Kenangan 5 Lokasi
      LOCATIONS_DATA.forEach((loc, idx) => {
        const isVisited = visitedList.includes(loc.id);
        const x = loc.coords.x;
        const y = loc.coords.y;

        // Aura Kristal Bersinar
        const pWave = Math.sin(s.tick * 0.08 + idx) * 4;
        const grad = ctx.createRadialGradient(x, y, 4, x, y, 35 + pWave);
        grad.addColorStop(0, loc.crystalColor + (isVisited ? 'aa' : '66'));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 35 + pWave, 0, Math.PI * 2);
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

        // Label FF
        ctx.fillStyle = '#ffffff';
        ctx.font = "bold 12px 'Press Start 2P', monospace";
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 4;
        ctx.fillText(`${loc.icon} ${loc.id}`, x, y + 36);
        ctx.font = "9px 'Press Start 2P', monospace";
        ctx.fillStyle = isVisited ? '#fef08a' : '#cbd5e1';
        ctx.fillText(loc.name, x, y + 48);
        ctx.shadowBlur = 0;
      });

      // C. Area Rahasia (Our Little Universe)
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

      // D. Tap Marker
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

      // E. Karakter Pemain (Sang Kekasih)
      const p = s.player;
      const sprite = ffSprites.characterSheets[p.facing]?.[p.frame];
      if (sprite) {
        ctx.drawImage(sprite, Math.floor(p.x - 16), Math.floor(p.y - 30));
      }

      // Nama karakter
      ctx.fillStyle = '#ffffff';
      ctx.font = "8px 'Press Start 2P', monospace";
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText('Udy ❤️', p.x, p.y - 34);
      ctx.shadowBlur = 0;

      // F. Partikel Melayang (Kelopak, Hati, Kunang-kunang)
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
    <div className="game-viewport">
      <canvas ref={canvasRef} className="game-canvas-element" />
    </div>
  );
}
