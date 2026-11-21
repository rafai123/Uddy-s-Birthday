import React, { useRef, useEffect } from 'react';
import { ffSprites } from '../sprites/ffSprites';
import { ffAudio } from '../audio/retroAudio';

export function HUD({ visitedList, isMuted, onToggleMute, onOpenJournal }) {
  const avatarCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = avatarCanvasRef.current;
    if (!canvas || !ffSprites.avatarCanvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(ffSprites.avatarCanvas, 0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <div className="ff-hud-top">
      {/* Profil Karakter Final Fantasy */}
      <div className="ff-window ff-hud-profile">
        <canvas ref={avatarCanvasRef} width={40} height={40} className="ff-avatar-canvas" />
        <div className="ff-profile-details">
          <div className="ff-char-name">Udy ❤️</div>
          <div className="ff-char-stats">
            <span>HP 1126/1126</span>
            <span>MP 24/24</span>
          </div>
        </div>
      </div>

      {/* 5 Kristal Memori */}
      <div className="ff-window ff-hud-crystals">
        <div className="ff-crystals-label">Kristal Kenangan</div>
        <div className="ff-crystals-row">
          {[1, 2, 3, 4, 5].map((id) => {
            const isUnlocked = visitedList.includes(id);
            return (
              <span key={id} className={`ff-crystal-node ${isUnlocked ? 'active' : ''}`}>
                {isUnlocked ? '💎' : '⚪'}
              </span>
            );
          })}
        </div>
      </div>

      {/* Tombol Aksi Cepat */}
      <div className="ff-hud-actions">
        <button
          onClick={() => {
            onToggleMute();
          }}
          className="ff-hud-btn"
        >
          {isMuted ? '🔇 Off' : '🎵 On'}
        </button>
        <button
          onClick={() => {
            ffAudio.playCursorMove();
            onOpenJournal();
          }}
          className="ff-hud-btn"
        >
          📖 Jurnal
        </button>
      </div>
    </div>
  );
}
