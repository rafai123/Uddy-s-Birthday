import React, { useRef, useEffect } from 'react';
import { SECRET_AREA } from '../data/locations';
import { ffAudio } from '../audio/retroAudio';

export function SecretUniverse({ isUnlocked, visitedCount, onClose }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!isUnlocked) {
      ffAudio.playCursorMove();
      return;
    }

    ffAudio.playCrystalFanfare();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animId;
    let tick = 0;

    const spawnBurst = () => {
      const x = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
      const y = Math.random() * (canvas.height * 0.45) + canvas.height * 0.1;
      const colors = ['#fbbf24', '#f43f5e', '#ec4899', '#38bdf8', '#a855f7', '#ffffff'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      for (let i = 0; i < 40; i++) {
        const angle = (Math.PI * 2 * i) / 40;
        const spd = Math.random() * 4 + 1.5;
        particlesRef.current.push({
          x, y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          color,
          alpha: 1.0,
          size: Math.random() * 3 + 2,
          decay: Math.random() * 0.015 + 0.01
        });
      }
      ffAudio.playFirework();
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;

      if (tick % 50 === 0) {
        spawnBurst();
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animId);
  }, [isUnlocked]);

  return (
    <div className="ff-modal-overlay">
      {isUnlocked && (
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
        />
      )}

      <div className="ff-window ff-modal-content" style={{ zIndex: 10, maxWidth: 500 }}>
        <div className="ff-modal-header">
          <h2 className="ff-modal-title">🌌 Our Little Universe</h2>
          <button
            onClick={() => {
              ffAudio.playCursorMove();
              onClose();
            }}
            className="ff-btn-close"
          >
            ✕
          </button>
        </div>

        <div className="ff-modal-body">
          {!isUnlocked ? (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
              <h3 style={{ fontFamily: 'var(--font-retro)', fontSize: 11, color: '#f43f5e', marginBottom: 10 }}>
                Area Rahasia Masih Terkunci
              </h3>
              <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>
                Temukan seluruh 5 kenangan kita di peta terlebih dahulu untuk membuka portal bintang ini! ({visitedCount}/5 Terkumpul) 💖
              </p>
            </div>
          ) : (
            <div style={{
              background: 'rgba(0, 15, 55, 0.75)', border: '1px solid #38bdf8',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)', padding: 20, borderRadius: 6
            }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: '#fbbf24', textAlign: 'center', marginBottom: 16 }}>
                {SECRET_AREA.letterTitle}
              </h3>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: '#f1f5f9', whiteSpace: 'pre-line' }}>
                {SECRET_AREA.letterBody}
              </div>
              <div style={{
                textAlign: 'right', marginTop: 18, fontFamily: 'var(--font-serif)',
                fontSize: 14, color: '#fda4af'
              }}>
                Selalu mencintaimu,<br />
                {SECRET_AREA.date}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
