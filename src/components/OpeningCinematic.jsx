import React, { useState, useEffect, useRef } from 'react';
import { ffAudio } from '../audio/retroAudio';

// Komponen Box Loading dari Penuh ke Kosong di bawah Pesan Intro
function IntroProgressBar({ duration, onComplete, label = "MEMPROSES PESAN..." }) {
  const [percent, setPercent] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const left = Math.max(0, 100 - (elapsed / duration) * 100);
      setPercent(left);
      if (elapsed >= duration) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 30);
    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div style={{
      marginTop: 20,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Box Loading Frame */}
      <div style={{
        width: '100%',
        maxWidth: 320,
        height: 12,
        background: 'rgba(2, 6, 23, 0.92)',
        border: '1.5px solid #fbbf24',
        borderRadius: 6,
        padding: 2,
        position: 'relative',
        boxShadow: '0 0 12px rgba(251, 191, 36, 0.35), inset 0 0 6px #000',
        overflow: 'hidden'
      }}>
        {/* Fill bar yang menyusut dari 100% penuh ke 0% kosong */}
        <div style={{
          height: '100%',
          width: `${percent}%`,
          background: 'linear-gradient(90deg, #ec4899, #f59e0b, #fbbf24)',
          borderRadius: 4,
          boxShadow: '0 0 8px #fbbf24',
          transition: 'width 0.05s linear'
        }} />
      </div>

      {/* Label proses & countdown */}
      <div style={{
        marginTop: 6,
        width: '100%',
        maxWidth: 320,
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'var(--font-retro)',
        fontSize: 8,
        color: '#fbbf24',
        letterSpacing: 1
      }}>
        <span>⏳ {label}</span>
        <span>{Math.ceil((percent / 100) * (duration / 1000))}s</span>
      </div>
    </div>
  );
}

export function OpeningCinematic({ onComplete }) {
  const [step, setStep] = useState(1); // 1: Loading, 2: Fireworks, 3: Reveal, 4: Cake, 5: Transition
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [windActive, setWindActive] = useState(false);
  const [blownList, setBlownList] = useState([]);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  // Langsung putar musik River Flows in You slow piano saat intro dimuat
  useEffect(() => {
    ffAudio.startBGM();

    // Browser policy unlock: pastikan BGM langsung berbunyi saat ada interaksi pertama
    const unlockBGM = () => {
      ffAudio.startBGM();
      ['click', 'touchstart', 'touchend', 'keydown'].forEach(e =>
        window.removeEventListener(e, unlockBGM)
      );
    };
    ['click', 'touchstart', 'touchend', 'keydown'].forEach(e =>
      window.addEventListener(e, unlockBGM, { once: true, passive: true })
    );

    return () => {
      ['click', 'touchstart', 'touchend', 'keydown'].forEach(e =>
        window.removeEventListener(e, unlockBGM)
      );
    };
  }, []);

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

  // Di tahap kembang api: ledakkan kembang api secara berkala dengan sound effect ledakan
  useEffect(() => {
    if (step === 2) {
      let count = 0;
      // Langsung ledakkan kembang api pertama
      spawnFirework();
      ffAudio.playFirework();

      const interval = setInterval(() => {
        if (count >= 8) {
          clearInterval(interval);
          return;
        }
        spawnFirework();
        ffAudio.playFirework();
        count++;
      }, 550);

      return () => clearInterval(interval);
    }
  }, [step]);

  const spawnFirework = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const x = Math.random() * (canvas.width * 0.7) + canvas.width * 0.15;
    const y = Math.random() * (canvas.height * 0.45) + canvas.height * 0.1;
    const colors = ['#f43f5e', '#fbbf24', '#38bdf8', '#ec4899', '#a855f7', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 48; i++) {
      const angle = (Math.PI * 2 * i) / 48;
      const speed = Math.random() * 5.5 + 2;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        alpha: 1.0,
        decay: Math.random() * 0.02 + 0.015,
        size: Math.random() * 3 + 2,
        isHeart: Math.random() < 0.25
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
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: 20, maxWidth: 400, width: '90%' }}>
          <div style={{ fontSize: 64, marginBottom: 20, animation: 'pulseBeat 1.2s infinite alternate' }}>
            💖
          </div>
          <p style={{ fontFamily: 'var(--font-retro)', fontSize: 11, color: '#93c5fd', lineHeight: 1.8 }}>
            Tunggu bentar, masih loading ya udyy sayang...
          </p>
          {/* Box loading dari penuh ke kosong */}
          <IntroProgressBar
            duration={3600}
            onComplete={() => setStep(2)}
            label="MEMPROSES..."
          />
        </div>
      )}

      {/* 02. Fireworks Celebration */}
      {step === 2 && (
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 16px', maxWidth: 440, width: '90%' }}>
          <h2 style={{
            fontFamily: 'var(--font-retro)',
            fontSize: 'clamp(13px, 4.2vw, 19px)',
            color: '#fbbf24',
            marginBottom: 12,
            lineHeight: 1.5,
            textShadow: '0 0 16px rgba(251,191,36,0.8)'
          }}>
            ✨ SELAMAT ULANG TAHUN UDY SAYANG ✨
          </h2>
          <p style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(10px, 3.2vw, 13px)', color: '#f472b6', letterSpacing: 1 }}>
            SELAMAT MAKINN TUA WKWK 😜
          </p>
          {/* Box loading dari penuh ke kosong */}
          <IntroProgressBar
            duration={5200}
            onComplete={() => setStep(3)}
            label="MEMPROSES PESAN..."
          />
        </div>
      )}

      {/* 03. Birthday Reveal */}
      {step === 3 && (
        <div className="ff-window" style={{ position: 'relative', zIndex: 10, padding: '28px 24px', maxWidth: 440, width: '90%', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: '#fda4af', marginBottom: 14, lineHeight: 1.4, fontWeight: 'bold' }}>
            SELAMAT ULANG TAHUN KE 24 SAYANGKU ❤️
          </h1>
          <p style={{ fontSize: 14, color: '#e2e8f0', marginBottom: 16, lineHeight: 1.7, fontWeight: 600 }}>
            SEMOGA SEHAT SELALU PANJANG UMUR.<br />
            JANGAN TUKANG EMOSIAN, KALO DIAJAK TUKAR PIKIRAN JANGAN NGAMBEK TERUSS! 😜
          </p>
          <div style={{ fontFamily: 'var(--font-retro)', fontSize: 11, color: '#fbbf24', letterSpacing: 2 }}>
            26 NOVEMBER 2026
          </div>
          {/* Box loading dari penuh ke kosong */}
          <IntroProgressBar
            duration={6200}
            onComplete={() => setStep(4)}
            label="MEMPROSES PESAN..."
          />
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
                JELAJAHI DUNIA KITA ✨
              </button>
            </div>
          ) : (
            <div className="ff-window" style={{ padding: 20, textAlign: 'center', maxWidth: 380 }}>
              <p style={{ fontSize: 15, color: '#fbbf24', fontWeight: 'bold', lineHeight: 1.6, marginBottom: 8 }}>
                "SEMOGA PANJANG UMUR SEHAT SELALU SAYANG"
              </p>
              <p style={{ fontSize: 14, color: '#f1f5f9', lineHeight: 1.6, marginBottom: 16 }}>
                "SEMOGA SEMUA YANG DI HARAPKAN TERKABUL, SEMOGA KITA DI LANCARKAN JUGA ❤️"
              </p>
              <button onClick={handleProceedToWorld} className="ff-btn gold">
                JELAJAHI DUNIA KITA ✨
              </button>
              {/* Box loading dari penuh ke kosong */}
              <IntroProgressBar
                duration={8500}
                onComplete={handleProceedToWorld}
                label="MENUJU DUNIA KITA..."
              />
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
