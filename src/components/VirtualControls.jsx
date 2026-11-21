import React, { useRef, useState } from 'react';
import { ffAudio } from '../audio/retroAudio';

export function VirtualControls({ onMove, onAction, nearLocation }) {
  const dpadRef = useRef(null);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const centerRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    const rect = dpadRef.current.getBoundingClientRect();
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    updatePosition(e.clientX, e.clientY);
    dpadRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    updatePosition(e.clientX, e.clientY);
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    isDraggingRef.current = false;
    setStickPos({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  const updatePosition = (clientX, clientY) => {
    const dx = clientX - centerRef.current.x;
    const dy = clientY - centerRef.current.y;
    const dist = Math.hypot(dx, dy);
    const maxRadius = 40;

    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, maxRadius);
    const sx = Math.cos(angle) * clampedDist;
    const sy = Math.sin(angle) * clampedDist;

    setStickPos({ x: sx, y: sy });

    if (dist > 6) {
      onMove({ x: Math.cos(angle), y: Math.sin(angle) });
    } else {
      onMove({ x: 0, y: 0 });
    }
  };

  const handleAction = (e) => {
    e.preventDefault();
    ffAudio.playWindowOpen();
    if (navigator.vibrate) navigator.vibrate([25]);
    onAction();
  };

  return (
    <>
      {/* Floating Prompt saat dekat lokasi */}
      {nearLocation && (
        <div
          onClick={handleAction}
          className="ff-window ff-interaction-prompt"
        >
          <span>{nearLocation.id === 6 ? '✨ Buka Our Little Universe! [A]' : `✨ Kenangan ${nearLocation.name} [A]`}</span>
        </div>
      )}

      {/* Kontrol Layar Sentuh Android */}
      <div className="ff-touch-controls">
        {/* Virtual Analog Joystick */}
        <div
          ref={dpadRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="ff-dpad"
        >
          <div className="ff-dpad-base">
            <div className="ff-dpad-arrow up">▲</div>
            <div className="ff-dpad-arrow down">▼</div>
            <div className="ff-dpad-arrow left">◀</div>
            <div className="ff-dpad-arrow right">▶</div>
          </div>
          <div
            className="ff-dpad-stick"
            style={{ transform: `translate(${stickPos.x}px, ${stickPos.y}px)` }}
          />
        </div>

        {/* Tombol Aksi [A] */}
        <div className="ff-action-btn-wrapper">
          <button
            onPointerDown={handleAction}
            className={`ff-action-btn-a ${nearLocation ? 'highlight' : ''}`}
            aria-label="Aksi"
          >
            <span className="ff-a-text">A</span>
          </button>
          <span className="ff-a-sub">AKSI</span>
        </div>
      </div>
    </>
  );
}
