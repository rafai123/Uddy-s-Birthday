import React from 'react';
import { LOCATIONS_DATA } from '../data/locations';
import { ffAudio } from '../audio/retroAudio';

export function MemoryJournal({ visitedList, onOpenLocation, onResetProgress, onClose }) {
  const visitedCount = visitedList.length;

  return (
    <div className="ff-modal-overlay">
      <div className="ff-window ff-modal-content" style={{ maxWidth: 480 }}>
        <div className="ff-modal-header">
          <h2 className="ff-modal-title">📖 Jurnal Kenangan Petualangan</h2>
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
          {/* Progress Tracker */}
          <div style={{
            background: 'rgba(0, 12, 45, 0.7)', border: '1px solid rgba(255,255,255,0.2)',
            padding: 12, borderRadius: 6, marginBottom: 14
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-retro)', fontSize: 9, marginBottom: 8 }}>
              <span>Progres Eksplorasi:</span>
              <span style={{ color: '#fbbf24' }}>{visitedCount} / 5 Kenangan</span>
            </div>
            <div style={{ width: '100%', height: 10, background: '#020617', borderRadius: 5, overflow: 'hidden', border: '1px solid #38bdf8' }}>
              <div style={{
                width: `${(visitedCount / 5) * 100}%`, height: '100%',
                background: 'linear-gradient(90deg, #38bdf8, #ec4899)', transition: 'width 0.4s'
              }} />
            </div>
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8, lineHeight: 1.4 }}>
              Temukan seluruh 5 kenangan untuk membuka segel portal <strong>"Our Little Universe"</strong> 🌌
            </p>
          </div>

          {/* Daftar Lokasi */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
            {LOCATIONS_DATA.map((loc) => {
              const isVisited = visitedList.includes(loc.id);
              return (
                <div
                  key={loc.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: 10,
                    background: isVisited ? 'rgba(0, 20, 70, 0.7)' : 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid', borderColor: isVisited ? '#38bdf8' : '#334155',
                    borderRadius: 6
                  }}
                >
                  <div style={{ fontSize: 24 }}>{loc.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-retro)', fontSize: 9, color: isVisited ? '#fef08a' : '#cbd5e1' }}>
                      {loc.id}. {loc.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                      {isVisited ? `✨ Terbuka (${loc.photos.length} Momen)` : '🔒 Belum Dikunjungi di Peta'}
                    </div>
                  </div>
                  {isVisited && (
                    <button
                      onClick={() => {
                        ffAudio.playWindowOpen();
                        onOpenLocation(loc);
                      }}
                      className="ff-btn"
                      style={{ fontSize: 8, padding: '6px 10px' }}
                    >
                      Buka
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              if (confirm("Reset ulang progres eksplorasi? (Foto tetap aman)")) {
                onResetProgress();
              }
            }}
            style={{
              background: 'transparent', border: '1px dashed #64748b', color: '#94a3b8',
              padding: 8, borderRadius: 4, fontFamily: 'var(--font-retro)', fontSize: 8, cursor: 'pointer'
            }}
          >
            ↺ Reset Progres
          </button>
        </div>
      </div>
    </div>
  );
}
