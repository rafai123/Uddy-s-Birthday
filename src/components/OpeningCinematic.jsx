import React, { useState, useEffect, useRef } from 'react';
import { ffAudio } from '../audio/retroAudio';

export function OpeningCinematic({ onComplete }) {
  const [step, setStep] = useState(1); // 1: Loading, 2: Fireworks, 3: Reveal, 4: Cake, 5: Transition
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [windActive, setWindActive] = useState(false);
  const [blownList, setBlownList] = useState([]);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  // Loop partikel kembang api & confetti canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.gravity) p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        if (p.isHeart) {
          ctx.fillStyle = p.color;
          ctx.font = `${p.size}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('♥', p.x, p.y);
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Alur otomatis per tahap sinematik
  useEffect(() => {
    if (step === 1) {
      const t = setTimeout(() => {
        setStep(2);
      }, 3500);
      return () => clearTimeout(t);
    } else if (step === 2) {
      // Pesta kembang api
      let count = 0;
      const interval = setInterval(() => {
        if (count > 7) {
          clearInterval(interval);
          return;
        }
        spawnFirework();
        ffAudio.playFirework();
        count++;
      }, 450);

      const t = setTimeout(() => {
        setStep(3);
      }, 4800);
      return () => {
        clearInterval(interval);
        clearTimeout(t);
      };
    } else if (step === 3) {
      ffAudio.playCrystalFanfare();
      const t = setTimeout(() => {
        setStep(4);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const spawnFirework = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const x = Math.random() * (canvas.width * 0.7) + canvas.width * 0.15;
    const y = Math.random() * (canvas.height * 0.45) + canvas.height * 0.1;
    const colors = ['#f43f5e', '#fbbf24', '#38bdf8', '#ec4899', '#a855f7', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 45; i++) {
      const angle = (Math.PI * 2 * i) / 45;
      const speed = Math.random() * 5 + 2;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        alpha: 1.0,
        decay: Math.random() * 0.02 + 0.015,
        size: Math.random() * 3 + 2,
        isHeart: Math.random() < 0.2
      });
    }
  };

  const spawnConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const originX = canvas.width / 2;
    const originY = canvas.height / 2;
    const colors = ['#f43f5e', '#fbbf24', '#38bdf8', '#ec4899', '#ffffff'];

    for (let i = 0; i < 70; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      particlesRef.current.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        decay: 0.012,
        size: Math.random() * 4 + 3,
        gravity: 0.15
      });
    }
  };

  const handleBlowCandles = () => {
    setZoomed(true);
    setWindActive(true);
    ffAudio.playCandleBlow();

    // 24 lilin padam berurutan
    for (let i = 0; i < 24; i++) {
      setTimeout(() => {
        setBlownList(prev => [...prev, i]);
      }, 200 + i * 50);
    }

    setTimeout(() => {
      setWindActive(false);
      ffAudio.playFirework();
      spawnConfetti();
      setCandlesBlown(true);
    }, 200 + 24 * 50 + 400);
  };

  const handleProceedToWorld = () => {
    ffAudio.playCursorMove();
    setStep(5);
    ffAudio.startBGM();
    setTimeout(() => {
      onComplete();
    }, 2200);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#040714', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />

      <button
        onClick={() => {
          ffAudio.playCursorMove();
          ffAudio.startBGM();
          onComplete();
        }}
        style={{
          position: 'absolute', top: 16, right: 16, zIndex: 30,
          fontFamily: 'var(--font-retro)', fontSize: 9, padding: '8px 12px',
          background: 'rgba(0, 15, 60, 0.85)', color: '#fbbf24', border: '1px solid #ffffff',
          borderRadius: 4, cursor: 'pointer'
        }}
      >
        Lewati Intro ⏩
      </button>

      {/* 01. Romantic Loading */}
      {step === 1 && (
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 64, marginBottom: 20, animation: 'pulseBeat 1.2s infinite alternate' }}>
            💖
          </div>
          <p style={{ fontFamily: 'var(--font-retro)', fontSize: 11, color: '#93c5fd', lineHeight: 1.8, maxWidth: 360 }}>
            Tunggu bentar, masih loading ya udyy sayang...
          </p>
        </div>
      )}

      {/* 02. Fireworks Celebration */}
      {step === 2 && (
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 16px' }}>
          <h2 style={{
            fontFamily: 'var(--font-retro)',
            fontSize: 'clamp(12px, 4vw, 18px)',
            color: '#fbbf24',
            marginBottom: 12,
            lineHeight: 1.5,
            textShadow: '0 0 16px rgba(251,191,36,0.8)'
          }}>
            ✨ Selamat Ulang Tahun Sayang ✨
          </h2>
          <p style={{ fontFamily: 'var(--font-retro)', fontSize: 10, color: '#f472b6' }}>
            Langit malam mulai bersinar untukmu...
          </p>
        </div>
      )}

      {/* 03. Birthday Reveal */}
      {step === 3 && (
        <div className="ff-window" style={{ position: 'relative', zIndex: 10, padding: '28px 24px', maxWidth: 440, width: '90%', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: '#fda4af', marginBottom: 12, lineHeight: 1.4 }}>
            Selamat Ulang Tahun<br />ke-24, Sayang ❤️
          </h1>
          <p style={{ fontSize: 14, color: '#e2e8f0', marginBottom: 16 }}>
            Hari ini dunia merayakan seseorang yang sangat berarti bagiku.
          </p>
          <div style={{ fontFamily: 'var(--font-retro)', fontSize: 11, color: '#fbbf24', letterSpacing: 2 }}>
            26 NOVEMBER 2026
          </div>
        </div>
      )}

      {/* 04. Cake & Lilin Interaktif */}
      {step === 4 && (
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 400, width: '90%' }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20,
            transform: zoomed ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            <div style={{ fontFamily: 'var(--font-retro)', fontSize: 24, color: '#fbbf24', marginBottom: 6 }}>
              24
            </div>

            {/* 24 Lilin */}
            <div style={{ display: 'flex', gap: 3, maxWidth: 260, justifyContent: 'center', marginBottom: 4 }}>
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} style={{ width: 5, height: 18, background: '#fdf2f8', borderTop: '2px solid #fda4af', position: 'relative' }}>
                  {!blownList.includes(i) ? (
                    <div style={{
                      position: 'absolute', top: -7, left: 0, width: 5, height: 7,
                      background: '#f59e0b', borderRadius: '50% 50% 20% 20%', boxShadow: '0 0 6px #f59e0b'
                    }} />
                  ) : (
                    <div style={{
                      position: 'absolute', top: -10, left: 0, width: 5, height: 8,
                      background: 'rgba(200,200,220,0.6)', borderRadius: '50%'
                    }} />
                  )}
                </div>
              ))}
            </div>

            {/* Kue Retro */}
            <div style={{ width: 200, height: 60, display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 16, background: '#f472b6', borderRadius: '6px 6px 0 0', borderBottom: '2px dashed #db2777' }} />
              <div style={{ height: 24, background: '#451a03' }} />
              <div style={{ height: 20, background: '#fbcfe8', borderRadius: '0 0 6px 6px' }} />
            </div>
            <div style={{ width: 220, height: 8, background: '#94a3b8', borderRadius: 4, marginTop: 2 }} />
          </div>

          {!candlesBlown ? (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={handleBlowCandles} className="ff-btn primary">
                Tiup Lilin 🎂
              </button>
              <button onClick={handleProceedToWorld} className="ff-btn">
                Jelajahi Dunia Kita ✨
              </button>
            </div>
          ) : (
            <div className="ff-window" style={{ padding: 18, textAlign: 'center', maxWidth: 360 }}>
              <p style={{ fontSize: 14, color: '#f1f5f9', lineHeight: 1.6, marginBottom: 14 }}>
                "Semoga semua harapan baikmu dikabulkan. Aku berharap bisa terus menemanimu merayakan banyak ulang tahun berikutnya. ❤️"
              </p>
              <button onClick={handleProceedToWorld} className="ff-btn gold">
                Jelajahi Dunia Kita ✨
              </button>
            </div>
          )}
        </div>
      )}

      {/* 05. Transition to World */}
      {step === 5 && (
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div style={{
            width: 120, height: 120, borderRadius: '50%', border: '4px dashed #38bdf8',
            boxShadow: '0 0 40px #38bdf8, inset 0 0 30px #f43f5e',
            animation: 'spinPortal 1.5s infinite linear', margin: '0 auto'
          }} />
          <p style={{ fontFamily: 'var(--font-retro)', fontSize: 10, color: '#fbbf24', marginTop: 24, letterSpacing: 2 }}>
            MEMASUKI DUNIA KENANGAN KITA...
          </p>
        </div>
      )}
    </div>
  );
}
