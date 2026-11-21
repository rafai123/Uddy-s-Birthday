// Final Fantasy Style Audio Synthesizer (Web Audio API murni)
// Melodi romantis nostalgia bertema Prelude / Theme of Love + Efek Suara Ikonik FF

class FinalFantasyAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlaying = false;
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.timerId = null;

    // Frekuensi tangga nada Final Fantasy (Harp Arpeggio & Sweet Celesta)
    this.notes = {
      'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
      'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'G6': 1567.98
    };

    // Melodi Final Fantasy Romantic Anniversary Theme
    this.melodySequence = [
      // Frase 1: Prelude Harp Arpeggio Intro
      { lead: 'E5', bass: 'C3', harp: ['C4', 'E4', 'G4', 'C5', 'E5', 'G5'], dur: 1.2 },
      { lead: 'D5', bass: 'G3', harp: ['G3', 'B3', 'D4', 'G4', 'B4', 'D5'], dur: 1.2 },
      { lead: 'C5', bass: 'A3', harp: ['A3', 'C4', 'E4', 'A4', 'C5', 'E5'], dur: 1.2 },
      { lead: 'D5', bass: 'F3', harp: ['F3', 'A3', 'C4', 'F4', 'A4', 'C5'], dur: 1.2 },

      // Frase 2: Theme of Love Melody
      { lead: 'G5', bass: 'C3', harp: ['C4', 'G4', 'C5', 'E5'], dur: 1.0 },
      { lead: 'A5', bass: 'C3', harp: ['E4', 'A4', 'C5'], dur: 0.8 },
      { lead: 'G5', bass: 'G3', harp: ['D4', 'G4', 'B4'], dur: 0.8 },
      { lead: 'E5', bass: 'A3', harp: ['C4', 'E4', 'A4'], dur: 1.0 },
      { lead: 'F5', bass: 'F3', harp: ['A3', 'C4', 'F4'], dur: 0.8 },
      { lead: 'D5', bass: 'G3', harp: ['B3', 'D4', 'G4'], dur: 1.2 },

      // Frase 3: Puncak Romantis Menuju Kristal Abadi
      { lead: 'C6', bass: 'C3', harp: ['C4', 'E4', 'G4', 'C5'], dur: 1.2 },
      { lead: 'B5', bass: 'G3', harp: ['G3', 'B3', 'D4', 'G4'], dur: 0.8 },
      { lead: 'A5', bass: 'F3', harp: ['F3', 'A3', 'C4', 'F4'], dur: 1.0 },
      { lead: 'G5', bass: 'E3', harp: ['E3', 'G3', 'B3', 'E4'], dur: 0.8 },
      { lead: 'A5', bass: 'A3', harp: ['A3', 'C4', 'E4'], dur: 0.8 },
      { lead: 'D5', bass: 'G3', harp: ['G3', 'B3', 'D4'], dur: 1.0 },
      { lead: 'C5', bass: 'C3', harp: ['C4', 'E4', 'G4', 'C5', 'G4', 'E4'], dur: 1.6 }
    ];

    this.initUnlock();
  }

  initUnlock() {
    const unlock = () => {
      if (!this.ctx) this.initContext();
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      if (!this.isPlaying && !this.isMuted) this.startBGM();

      ['click', 'touchstart', 'touchend', 'keydown'].forEach(evt => {
        window.removeEventListener(evt, unlock);
      });
    };

    ['click', 'touchstart', 'touchend', 'keydown'].forEach(evt => {
      window.addEventListener(evt, unlock, { once: true, passive: true });
    });
  }

  initContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.32, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    } catch (e) {
      console.warn("Web Audio not supported", e);
    }
  }

  startBGM() {
    if (!this.ctx) this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    if (this.isPlaying || this.isMuted) return;

    this.isPlaying = true;
    let step = 0;

    const tick = () => {
      if (!this.isPlaying || this.isMuted || !this.ctx) return;

      const item = this.melodySequence[step];
      const now = this.ctx.currentTime;
      const dur = item.dur;

      // 1. Lead Melody (Sweet Chiptune Flute with vibrato)
      if (item.lead && this.notes[item.lead]) {
        this.playTone(this.notes[item.lead], now, dur * 0.88, 'triangle', this.bgmGain, 0.35, true);
      }

      // 2. Warm Bass
      if (item.bass && this.notes[item.bass]) {
        this.playTone(this.notes[item.bass], now, dur * 0.95, 'sine', this.bgmGain, 0.3, false);
      }

      // 3. Final Fantasy Iconic Harp Arpeggio
      if (item.harp && item.harp.length > 0) {
        const interval = (dur * 0.8) / item.harp.length;
        item.harp.forEach((noteName, i) => {
          const freq = this.notes[noteName];
          if (freq) {
            this.playTone(freq, now + i * interval, 0.45, 'sine', this.bgmGain, 0.16, false);
          }
        });
      }

      step = (step + 1) % this.melodySequence.length;
      this.timerId = setTimeout(tick, dur * 1000);
    };

    tick();
  }

  playTone(freq, start, duration, type, target, vol = 0.3, vibrato = false) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);

    if (vibrato) {
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(4.8, start);
      lfoGain.gain.setValueAtTime(freq * 0.018, start);
      lfo.connect(osc.frequency);
      lfo.start(start);
      lfo.stop(start + duration);
    }

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.04);
    gain.gain.exponentialRampToValueAtTime(vol * 0.7, start + duration * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(target);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  }

  stopBGM() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
    } else {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      }
      this.startBGM();
    }
    return !this.isMuted;
  }

  // ==========================================
  // EFEK SUARA (SFX) FINAL FANTASY
  // ==========================================

  // SFX: Kursor Menu Klasik Final Fantasy (Iconic Cursor Beep)
  playCursorMove() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // SFX: Buka Window Final Fantasy (Confirm / Select)
  playWindowOpen() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    [523.25, 783.99].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.25, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.14);
    });
  }

  // SFX: Kristal Suci / Fanfare Singkat (Crystal Chime)
  playCrystalFanfare() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.18, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.4);
    });
  }

  // SFX: Tiupan Lilin & Desis Angin
  playCandleBlow() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.7;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.linearRampToValueAtTime(180, now + 0.6);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);
  }

  // SFX: Kembang Api / Confetti
  playFirework() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.42);
  }

  // SFX: Langkah Kaki Halus (Soft Step)
  playStep() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90 + Math.random() * 15, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.04);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const ffAudio = new FinalFantasyAudio();
