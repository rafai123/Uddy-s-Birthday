import React, { useState, useEffect, useCallback } from 'react';
import { OpeningCinematic } from './components/OpeningCinematic';
import { GameWorld } from './components/GameWorld';
import { HUD } from './components/HUD';
import { VirtualControls } from './components/VirtualControls';
import { MemoryAlbum } from './components/MemoryAlbum';
import { MemoryJournal } from './components/MemoryJournal';
import { SecretUniverse } from './components/SecretUniverse';
import { ffAudio } from './audio/retroAudio';

const STORAGE_KEY = 'uddy_ff_progress_v3';

export default function App() {
  const [visitedList, setVisitedList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return [];
  });

  const [introFinished, setIntroFinished] = useState(false);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [journalOpen, setJournalOpen] = useState(false);
  const [secretOpen, setSecretOpen] = useState(false);
  const [nearLocation, setNearLocation] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [moveVector, setMoveVector] = useState({ x: 0, y: 0 });

  const isSecretUnlocked = visitedList.length >= 5;

  // Simpan progres ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visitedList));
    } catch (e) {
      console.warn(e);
    }
  }, [visitedList]);

  // Handle keyboard
  useEffect(() => {
    const keys = new Set();
    const handleKeyDown = (e) => {
      if (activeAlbum || journalOpen || secretOpen || !introFinished) return;
      const k = e.key.toLowerCase();
      keys.add(k);

      if (k === ' ' || k === 'enter' || k === 'e') {
        e.preventDefault();
        triggerAction();
        return;
      }
      if (k === 'm') {
        handleToggleMute();
        return;
      }
      if (k === 'j') {
        setJournalOpen(true);
        return;
      }
      updateKeyMove();
    };

    const handleKeyUp = (e) => {
      keys.delete(e.key.toLowerCase());
      updateKeyMove();
    };

    const updateKeyMove = () => {
      let vx = 0;
      let vy = 0;
      if (keys.has('arrowup') || keys.has('w')) vy -= 1;
      if (keys.has('arrowdown') || keys.has('s')) vy += 1;
      if (keys.has('arrowleft') || keys.has('a')) vx -= 1;
      if (keys.has('arrowright') || keys.has('d')) vx += 1;

      if (vx !== 0 && vy !== 0) {
        vx *= 0.7071;
        vy *= 0.7071;
      }
      setMoveVector({ x: vx, y: vy });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeAlbum, journalOpen, secretOpen, introFinished, nearLocation]);

  const triggerAction = useCallback(() => {
    if (!nearLocation) return;
    if (nearLocation.id === 6) {
      setSecretOpen(true);
    } else {
      setActiveAlbum(nearLocation);
      setVisitedList(prev => {
        if (!prev.includes(nearLocation.id)) {
          return [...prev, nearLocation.id];
        }
        return prev;
      });
    }
  }, [nearLocation]);

  const handleToggleMute = () => {
    const active = ffAudio.toggleMute();
    setIsMuted(!active);
  };

  const handleResetProgress = () => {
    setVisitedList([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* 1. Opening Cinematic */}
      {!introFinished && (
        <OpeningCinematic onComplete={() => setIntroFinished(true)} />
      )}

      {/* 2. Game Canvas World */}
      <GameWorld
        visitedList={visitedList}
        isSecretUnlocked={isSecretUnlocked}
        onNearLocation={(loc) => setNearLocation(loc)}
        onLeaveLocation={() => setNearLocation(null)}
        moveVector={moveVector}
      />

      {/* 3. Final Fantasy HUD */}
      {introFinished && (
        <HUD
          visitedList={visitedList}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenJournal={() => setJournalOpen(true)}
        />
      )}

      {/* 4. Touch Controls for Android */}
      {introFinished && !activeAlbum && !journalOpen && !secretOpen && (
        <VirtualControls
          onMove={setMoveVector}
          onAction={triggerAction}
          nearLocation={nearLocation}
        />
      )}

      {/* 5. Memory Album Modal */}
      {activeAlbum && (
        <MemoryAlbum
          location={activeAlbum}
          onClose={() => setActiveAlbum(null)}
        />
      )}

      {/* 6. Memory Journal Modal */}
      {journalOpen && (
        <MemoryJournal
          visitedList={visitedList}
          onOpenLocation={(loc) => {
            setJournalOpen(false);
            setActiveAlbum(loc);
          }}
          onResetProgress={handleResetProgress}
          onClose={() => setJournalOpen(false)}
        />
      )}

      {/* 7. Secret Area: Our Little Universe */}
      {secretOpen && (
        <SecretUniverse
          isUnlocked={isSecretUnlocked}
          visitedCount={visitedList.length}
          onClose={() => setSecretOpen(false)}
        />
      )}
    </div>
  );
}
