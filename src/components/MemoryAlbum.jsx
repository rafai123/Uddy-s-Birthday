import React, { useState, useRef, useEffect } from 'react';
import { getPhotoUrl, getThumbUrl, formatPhotoDate } from '../data/locations';
import { ffAudio } from '../audio/retroAudio';

export function MemoryAlbum({ location, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxData, setLightboxData] = useState(null);
  const reelRef = useRef(null);

  useEffect(() => {
    ffAudio.playCrystalFanfare();
  }, [location]);

  const handleScroll = () => {
    if (!reelRef.current) return;
    const scrollLeft = reelRef.current.scrollLeft;
    const cardWidth = reelRef.current.offsetWidth * 0.85 + 14;
    const idx = Math.round(scrollLeft / cardWidth);
    if (idx >= 0 && idx < location.photos.length && idx !== currentIndex) {
      setCurrentIndex(idx);
    }
  };

  const scrollToIndex = (idx) => {
    if (!reelRef.current) return;
    setCurrentIndex(idx);
    const cardWidth = reelRef.current.offsetWidth * 0.85 + 14;
    reelRef.current.scrollTo({
      left: idx * cardWidth,
      behavior: 'smooth'
    });
  };

  const handleNav = (dir) => {
    ffAudio.playCursorMove();
    const nextIdx = Math.max(0, Math.min(location.photos.length - 1, currentIndex + dir));
    scrollToIndex(nextIdx);
  };

  return (
    <>
      <div className="ff-modal-overlay">
        <div className="ff-window ff-modal-content">
          <div className="ff-modal-header">
            <h2 className="ff-modal-title">
              {location.icon} {location.name} — {location.subtitle}
            </h2>
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
            <div style={{ fontFamily: 'var(--font-retro)', fontSize: 9, color: '#f59e0b', marginBottom: 6 }}>
              📅 {location.dateText}
            </div>

            {/* Kutipan Singkat & Romantis */}
            <p className="ff-album-quote">
              "{location.quote}"
            </p>

            {/* MODEL SCROLL REEL */}
            <div className="ff-scroll-reel-wrapper">
              <div ref={reelRef} onScroll={handleScroll} className="ff-scroll-reel">
                {location.photos.map((photo, i) => (
                  <div key={i} className="ff-moment-card">
                    <div className="ff-moment-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold' }}>{location.name} - {photo.spot}</span>
                      <span style={{ opacity: 0.75, fontSize: 9 }}>#{i + 1}</span>
                    </div>

                    <div
                      onClick={() => {
                        ffAudio.playWindowOpen();
                        setLightboxData({
                          src: getPhotoUrl(location.folder, photo.file),
                          title: `${location.name} - ${photo.spot}`,
                          date: formatPhotoDate(photo.file),
                          animeQuote: photo.animeQuote
                        });
                      }}
                      className="ff-moment-img-box"
                    >
                      <img
                        src={getPhotoUrl(location.folder, photo.file)}
                        alt={`${location.name} - ${photo.spot}`}
                        loading="lazy"
                        className="ff-moment-img"
                      />
                      <span style={{
                        position: 'absolute', bottom: 6, right: 6,
                        background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 9,
                        padding: '2px 6px', borderRadius: 3
                      }}>
                        🔍 Perbesar
                      </span>
                    </div>

                    <div className="ff-moment-caption-box" style={{ textAlign: 'left', padding: '10px 12px' }}>
                      <div style={{ fontFamily: 'var(--font-retro)', fontSize: 9, color: '#fbbf24', marginBottom: 5 }}>
                        📅 {formatPhotoDate(photo.file)}
                      </div>
                      <div style={{ fontSize: 13, color: '#f8fafc', fontStyle: 'italic', marginBottom: 6, fontWeight: 600 }}>
                        "Lucu juga kita ya wkwk."
                      </div>
                      <div style={{
                        fontSize: 12, color: '#93c5fd', borderTop: '1px dashed rgba(255,255,255,0.2)',
                        paddingTop: 6, lineHeight: 1.4
                      }}>
                        "{photo.animeQuote.quote}"
                        <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: 10, marginTop: 4, fontFamily: 'var(--font-retro)' }}>
                          — by {photo.animeQuote.by}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigasi Bar */}
            <div className="ff-reel-nav">
              <button onClick={() => handleNav(-1)} className="ff-nav-btn">
                ◀ Prev
              </button>
              <span className="ff-counter-badge">
                {currentIndex + 1} / {location.photos.length}
              </span>
              <button onClick={() => handleNav(1)} className="ff-nav-btn">
                Next ▶
              </button>
            </div>

            {/* Filmstrip Thumbnails */}
            <div className="ff-thumbs-strip">
              {location.photos.map((photo, i) => (
                <div
                  key={i}
                  onClick={() => {
                    ffAudio.playCursorMove();
                    scrollToIndex(i);
                  }}
                  className={`ff-thumb-node ${currentIndex === i ? 'active' : ''}`}
                >
                  <img
                    src={getThumbUrl(location.folder, photo.file)}
                    alt="thumb"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxData && (
        <div
          onClick={() => setLightboxData(null)}
          className="ff-lightbox-overlay"
        >
          <button
            onClick={() => setLightboxData(null)}
            className="ff-btn-close"
            style={{ position: 'absolute', top: 16, right: 16, zIndex: 1100, width: 34, height: 34 }}
          >
            ✕
          </button>
          <div className="ff-lightbox-inner" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440, width: '92%' }}>
            <img src={lightboxData.src} alt={lightboxData.title} className="ff-lightbox-img" style={{ maxHeight: '60vh', objectFit: 'contain', borderRadius: 6 }} />
            <div style={{ background: '#020617', padding: '12px 14px', borderRadius: '0 0 6px 6px', border: '1px solid #38bdf8' }}>
              <div style={{ fontFamily: 'var(--font-retro)', fontSize: 11, color: '#38bdf8', marginBottom: 4 }}>
                {lightboxData.title}
              </div>
              <div style={{ fontFamily: 'var(--font-retro)', fontSize: 9, color: '#fbbf24', marginBottom: 6 }}>
                📅 {lightboxData.date}
              </div>
              <div style={{ fontSize: 13, color: '#f8fafc', fontStyle: 'italic', marginBottom: 6, fontWeight: 600 }}>
                "Lucu juga kita ya wkwk."
              </div>
              <div style={{ fontSize: 12, color: '#93c5fd', borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: 6, lineHeight: 1.4 }}>
                "{lightboxData.animeQuote.quote}"
                <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: 10, marginTop: 4, fontFamily: 'var(--font-retro)' }}>
                  — by {lightboxData.animeQuote.by}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
