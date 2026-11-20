// Audio Manager: Web Audio API Synthesizer & Sound Effects
import { storage } from "./storage.js";

class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = storage.isMuted();
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.externalAudio = null;
    this.hasInteracted = false;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn("AudioContext init error:", e);
    }
  }

  unlock() {
    this.hasInteracted = true;
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    if (!this.isMuted && !this.bgmPlaying) {
      this.startBGM();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    storage.setMuted(this.isMuted);
    if (this.isMuted) {
      this.stopBGM();
    } else {
      if (this.hasInteracted) {
        this.startBGM();
      }
    }
    return this.isMuted;
  }

  // Romantic Synthesizer Piano / Music Box BGM
  startBGM() {
    if (this.bgmPlaying || this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    this.bgmPlaying = true;
    this.playBGMSequence();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  playBGMSequence() {
    if (!this.bgmPlaying || this.isMuted || !this.ctx) return;

    // Romantisme dalam nada: Cmaj7 - Am9 - Fmaj7 - G7sus4 (Tempo 68 BPM)
    const chords = [
      // Chord 1: Cmaj7 (C4, E4, G4, B4, E5)
      { base: 261.63, notes: [261.63, 329.63, 392.00, 493.88, 659.25], duration: 4.0 },
      // Chord 2: Am9 (A3, C4, E4, G4, B4)
      { base: 220.00, notes: [220.00, 261.63, 329.63, 392.00, 493.88], duration: 4.0 },
      // Chord 3: Fmaj7 (F3, A3, C4, E4, A4)
      { base: 174.61, notes: [174.61, 220.00, 261.63, 329.63, 440.00], duration: 4.0 },
      // Chord 4: G7sus4 -> G (G3, D4, F4, G4, B4)
      { base: 196.00, notes: [196.00, 293.66, 349.23, 392.00, 493.88], duration: 4.0 }
    ];

    let timeOffset = 0;
    const now = this.ctx.currentTime + 0.05;

    chords.forEach((chord) => {
      // Bass note
      this.playSynthNote(chord.base / 2, now + timeOffset, chord.duration, "triangle", 0.08, true);

      // Pad chord
      chord.notes.forEach((freq, idx) => {
        this.playSynthNote(freq, now + timeOffset + idx * 0.04, chord.duration * 0.9, "sine", 0.04);
      });

      // Arpeggios / Celesta melody
      const arpNotes = [chord.notes[1], chord.notes[3], chord.notes[4], chord.notes[2], chord.notes[4], chord.notes[3]];
      arpNotes.forEach((freq, step) => {
        const noteTime = now + timeOffset + step * 0.6;
        this.playSynthNote(freq * 2, noteTime, 0.8, "sine", 0.045);
      });

      timeOffset += chord.duration;
    });

    const loopMs = timeOffset * 1000 - 150;
    this.bgmTimer = setTimeout(() => {
      if (this.bgmPlaying) {
        this.playBGMSequence();
      }
    }, loopMs);
  }

  playSynthNote(freq, startTime, duration, type = "sine", volume = 0.05, isBass = false) {
    if (!this.ctx || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      // Warm low-pass filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(isBass ? 400 : 1800, startTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      // Envelope: gentle attack, long warm decay
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } catch (e) {
      // Ignore audio glitches
    }
  }

  // SFX: Tiupan angin (White noise sweep)
  playBlowSound() {
    if (!this.ctx || this.isMuted) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(250, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 1.2);
      filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 2.5);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      noise.stop(this.ctx.currentTime + 2.5);
    } catch (e) {}
  }

  // SFX: Lilin padam lembut
  playExtinguish() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch (e) {}
  }

  // SFX: Magic chime / Harp saat buka memori
  playChime() {
    if (!this.ctx || this.isMuted) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.05, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.85);
      });
    } catch (e) {}
  }

  // SFX: Letusan kembang api
  playFirework() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      // Thump / Boom
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);

      // Sparkles
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const sNow = this.ctx.currentTime;
        const spark = this.ctx.createOscillator();
        const sGain = this.ctx.createGain();
        spark.type = "triangle";
        spark.frequency.setValueAtTime(1200 + Math.random() * 400, sNow);
        sGain.gain.setValueAtTime(0.03, sNow);
        sGain.gain.exponentialRampToValueAtTime(0.001, sNow + 0.2);
        spark.connect(sGain);
        sGain.connect(this.ctx.destination);
        spark.start(sNow);
        spark.stop(sNow + 0.25);
      }, 100);
    } catch (e) {}
  }

  // SFX: UI Click
  playClick() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  }
}

export const audio = new AudioManager();
