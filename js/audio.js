// Romantic Retro 16-Bit Audio Engine (Web Audio API murni)
// Menghasilkan musik latar romantis nostalgia dan efek suara (SFX) retro 16-bit
// Ringan, tanpa file MP3 eksternal, jalan 100% offline & dioptimalkan untuk Android

class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlaying = false;
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.currentTrack = null;
    this.timerId = null;

    // Frekuensi tangga nada romantis (Acoustic / Music Box / Celesta Tone)
    this.noteFreqs = {
      'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
      'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'G6': 1567.98
    };

    // Urutan melodi romantis manis (Anniversary Love Theme)
    this.melodySequence = [
      // Frase 1: Kehangatan Awal (C - G - Am - F)
      { note: 'E5', dur: 0.6, bass: 'C3', arp: ['C4', 'E4', 'G4'] },
      { note: 'G5', dur: 0.4, bass: 'C3', arp: ['E4', 'G4', 'C5'] },
      { note: 'A5', dur: 0.8, bass: 'C3', arp: ['G4', 'C5', 'E5'] },
      { note: 'G5', dur: 0.6, bass: 'G3', arp: ['B3', 'D4', 'G4'] },
      { note: 'D5', dur: 0.6, bass: 'G3', arp: ['D4', 'G4', 'B4'] },
      { note: 'E5', dur: 0.8, bass: 'A3', arp: ['C4', 'E4', 'A4'] },
      { note: 'C5', dur: 0.6, bass: 'F3', arp: ['A3', 'C4', 'F4'] },
      { note: 'D5', dur: 0.6, bass: 'F3', arp: ['C4', 'F4', 'A4'] },

      // Frase 2: Kerinduan & Janji Setia
      { note: 'E5', dur: 0.6, bass: 'C3', arp: ['C4', 'E4', 'G4'] },
      { note: 'G5', dur: 0.4, bass: 'C3', arp: ['E4', 'G4', 'C5'] },
      { note: 'C6', dur: 1.0, bass: 'C3', arp: ['G4', 'C5', 'E5'] },
      { note: 'B5', dur: 0.6, bass: 'G3', arp: ['B3', 'D4', 'G4'] },
      { note: 'A5', dur: 0.6, bass: 'A3', arp: ['C4', 'E4', 'A4'] },
      { note: 'G5', dur: 0.8, bass: 'F3', arp: ['A3', 'C4', 'F4'] },
      { note: 'F5', dur: 0.4, bass: 'F3', arp: ['C4', 'F4', 'A4'] },
      { note: 'E5', dur: 0.8, bass: 'C3', arp: ['E4', 'G4', 'C5'] },

      // Frase 3: Puncak Kebahagiaan Ulang Tahun
      { note: 'A5', dur: 0.6, bass: 'F3', arp: ['C4', 'F4', 'A4'] },
      { note: 'C6', dur: 0.6, bass: 'F3', arp: ['F4', 'A4', 'C5'] },
      { note: 'B5', dur: 0.8, bass: 'G3', arp: ['D4', 'G4', 'B4'] },
      { note: 'G5', dur: 0.6, bass: 'E3', arp: ['B3', 'E4', 'G4'] },
      { note: 'A5', dur: 0.6, bass: 'A3', arp: ['C4', 'E4', 'A4'] },
      { note: 'E5', dur: 0.8, bass: 'A3', arp: ['E4', 'A4', 'C5'] },
      { note: 'F5', dur: 0.6, bass: 'D3', arp: ['F3', 'A3', 'D4'] },
      { note: 'D5', dur: 0.8, bass: 'G3', arp: ['B3', 'D4', 'G4'] },

      // Frase 4: Penutup Manis Menuju Loop
      { note: 'C5', dur: 1.2, bass: 'C3', arp: ['C4', 'E4', 'G4', 'C5'] },
      { note: 'E5', dur: 0.4, bass: 'C3', arp: ['E4', 'G4'] },
      { note: 'D5', dur: 0.6, bass: 'G3', arp: ['D4', 'G4'] },
      { note: 'C5', dur: 1.4, bass: 'C3', arp: ['C4', 'G4', 'C5'] }
    ];

    this.initUserGestureUnlock();
  }

  // Buka AudioContext saat interaksi layar pertama (khusus aturan autoplay Android/Chrome)
  initUserGestureUnlock() {
    const unlock = () => {
      if (!this.ctx) {
        this.initContext();
      } else if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      if (!this.isPlaying && !this.isMuted) {
        this.startBGM();
      }
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
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // BGM Channel Gain
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      // SFX Channel Gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  // Mulai Background Music Romantis
  startBGM() {
    if (!this.ctx) this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying || this.isMuted) return;

    this.isPlaying = true;
    let stepIndex = 0;

    const playNextStep = () => {
      if (!this.isPlaying || this.isMuted || !this.ctx) return;

      const step = this.melodySequence[stepIndex];
      const now = this.ctx.currentTime;
      const dur = step.dur;

      // 1. Nada Utama (Lead: Flute/Celesta Lembut)
      if (step.note && this.noteFreqs[step.note]) {
        this.playSynthesizedTone(this.noteFreqs[step.note], now, dur * 0.9, 'triangle', this.bgmGain, 0.4, true);
      }

      // 2. Nada Bass Hangat
      if (step.bass && this.noteFreqs[step.bass]) {
        this.playSynthesizedTone(this.noteFreqs[step.bass], now, dur * 0.95, 'sine', this.bgmGain, 0.35, false);
      }

      // 3. Arpeggio Akustik Harmoni (Pemetikan nada latar)
      if (step.arp && step.arp.length > 0) {
        step.arp.forEach((arpNote, i) => {
          const arpFreq = this.noteFreqs[arpNote];
          if (arpFreq) {
            const arpTime = now + (i * 0.14);
            this.playSynthesizedTone(arpFreq, arpTime, 0.35, 'sine', this.bgmGain, 0.18, false);
          }
        });
      }

      stepIndex = (stepIndex + 1) % this.melodySequence.length;
      this.timerId = setTimeout(playNextStep, dur * 1000);
    };

    playNextStep();
  }

  // Sintesis Nada dengan Envelope ADSR Lembut
  playSynthesizedTone(freq, startTime, duration, waveType, targetNode, volume = 0.3, addVibrato = false) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = waveType;
    osc.frequency.setValueAtTime(freq, startTime);

    if (addVibrato) {
      // Menambahkan vibrato romantis lembut
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(4.5, startTime); // 4.5 Hz
      lfoGain.gain.setValueAtTime(freq * 0.015, startTime);
      lfo.connect(osc.frequency);
      lfo.start(startTime);
      lfo.stop(startTime + duration);
    }

    // Envelope Lembut (Soft Attack, Decay, Sustain, Release)
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(volume * 0.7, startTime + duration * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(targetNode);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  // Hentikan BGM
  stopBGM() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  // Toggle Mute / Unmute
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
  // EFEK SUARA RETRO (SFX)
  // ==========================================

  // SFX: Tiupan Lilin (Hembusan angin + desis asap)
  playCandleBlow() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // White noise desis tiupan angin
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter bandpass hembusan angin
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.linearRampToValueAtTime(150, now + 0.7);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  // SFX: Ledakan Kembang Api & Confetti
  playFireworkBoom() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Nada boom rendah
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.5);

    // Gemeretak percikan kembang api
    setTimeout(() => {
      this.playSparkleChime();
    }, 120);
  }

  // SFX: Gemerlap Bintang / Kilau
  playSparkleChime() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [1046.50, 1318.51, 1567.98, 2093.00];

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.001, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.3);
    });
  }

  // SFX: Penemuan Lokasi Kenangan (Retro 16-Bit Fanfare)
  playDiscoveryFanfare() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    chords.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square'; // Karakteristik 16-bit retro
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.18, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.45);
    });
  }

  // SFX: Klik Tombol Retro
  playButtonClick() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  // SFX: Langkah Kaki (Soft Footstep)
  playStep() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110 + Math.random() * 20, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }
}

export const retroAudio = new RetroAudioEngine();
