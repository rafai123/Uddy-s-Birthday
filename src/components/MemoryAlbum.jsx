import React, { useState, useRef, useEffect } from 'react';
import { getPhotoUrl, getThumbUrl } from '../data/locations';
import { ffAudio } from '../audio/retroAudio';

export function MemoryAlbum({ location, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [lightboxCaption, setLightboxCaption] = useState('');
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
                    <div className="ff-moment-header">
                      Momen {i + 1} / {location.photos.length}
                    </div>
                    <div
                      onClick={() => {
                        ffAudio.playWindowOpen();
                        setLightboxSrc(getPhotoUrl(location.folder, photo.file));
                        setLightboxCaption(photo.caption);
                      }}
                      className="ff-moment-img-box"
                    >
                      <img
                        src={getPhotoUrl(location.folder, photo.file)}
                        alt={photo.caption}
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
                    <div className="ff-moment-caption-box">
                      <p className="ff-moment-caption">{photo.caption}</p>
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
      {lightboxSrc && (
        <div
          onClick={() => setLightboxSrc(null)}
          className="ff-lightbox-overlay"
        >
          <button
            onClick={() => setLightboxSrc(null)}
            className="ff-btn-close"
            style={{ position: 'absolute', top: 16, right: 16, zIndex: 1100, width: 34, height: 34 }}
          >
            ✕
          </button>
          <div className="ff-lightbox-inner">
            <img src={lightboxSrc} alt="Full view" className="ff-lightbox-img" />
            <p className="ff-lightbox-caption">{lightboxCaption}</p>
          </div>
        </div>
      )}
    </>
  );
}
