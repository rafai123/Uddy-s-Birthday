// 🎹 River Flows in You – Yiruma | Real Piano Cover MP3 & Firework Audio Engine
// Dioptimalkan khusus untuk web: MP3 piano jernih ringan + Web Audio API buffer untuk ledakan kembang api

class RomanticPianoAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlaying = false;
    this.masterGain = null;
    this.sfxGain = null;
    this.bgmAudio = null;
    this.fireworkBuffer = null;

    this.initAudioElements();
    this.initUnlock();
  }

  initAudioElements() {
    if (typeof Audio !== 'undefined' && !this.bgmAudio) {
      try {
        this.bgmAudio = new Audio('./audio/river_flows_in_you.mp3');
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.75;
      } catch (e) {
        console.warn('HTML5 Audio init:', e);
      }
    }
  }

  // Auto-unlock AudioContext & BGM saat interaksi pertama (browser autoplay policy)
  initUnlock() {
    const unlock = () => {
      this.initAudioElements();
      if (!this.ctx) this.initContext();
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      if (!this.isMuted) this.startBGM();
      ['click','touchstart','touchend','keydown'].forEach(e => window.removeEventListener(e, unlock));
    };
    ['click','touchstart','touchend','keydown'].forEach(e =>
      window.addEventListener(e, unlock, { once: true, passive: true })
    );
  }

  initContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.loadFireworkBuffer();
    } catch (e) {
      console.warn('Web Audio not supported', e);
    }
  }

  // Pre-load file ledakan kembang api ke RAM audio buffer untuk latensi 0ms & multitrack boom
  loadFireworkBuffer() {
    if (!this.ctx || this.fireworkBuffer) return;
    try {
      fetch('./audio/firework_explosion.mp3')
        .then(res => res.arrayBuffer())
        .then(ab => this.ctx.decodeAudioData(ab))
        .then(buf => { this.fireworkBuffer = buf; })
        .catch(e => console.warn('Firework buffer load:', e));
    } catch (e) {}
  }

  // ================================================================
  // Pemutar BGM: River Flows in You (.mp3 Cover Piano)
  // ================================================================
  startBGM() {
    this.initAudioElements();
    if (!this.ctx) this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    if (this.isMuted) return;

    this.isPlaying = true;
    if (this.bgmAudio) {
      this.bgmAudio.play().catch(e => {
        // Akan diputar otomatis saat sentuhan pertama via initUnlock
      });
    }
  }

  stopBGM() {
    this.isPlaying = false;
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgmAudio) {
      this.bgmAudio.muted = this.isMuted;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.75, this.ctx.currentTime);
    }
    if (this.isMuted) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
    return !this.isMuted;
  }

  // ================================================================
  // Sound Effect Ledakan Kembang Api Mantap & Menggelegar
  // ================================================================
  playFirework() {
    if (!this.ctx) this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Audio Buffer Ledakan Kembang Api Asli (.mp3 16KB berlatensi 0ms)
    if (this.fireworkBuffer) {
      try {
        const src = this.ctx.createBufferSource();
        src.buffer = this.fireworkBuffer;
        // Variasi pitch alami antar kembang api (0.92 - 1.08)
        src.playbackRate.setValueAtTime(0.92 + Math.random() * 0.16, now);

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.85 + Math.random() * 0.25, now);
        src.connect(gainNode);
        gainNode.connect(this.sfxGain);
        src.start(now);
      } catch (e) {}
    }

    // 2. Dentuman Sub-Bass Menggelegar (Low Punch Boom)
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(145 + Math.random() * 25, now);
    boomOsc.frequency.exponentialRampToValueAtTime(26, now + 0.55);
    boomGain.gain.setValueAtTime(0.55, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
    boomOsc.connect(boomGain);
    boomGain.connect(this.sfxGain);
    boomOsc.start(now);
    boomOsc.stop(now + 0.6);

    // 3. Layer Percikan & Desisan Udara jika buffer belum selesai dimuat
    if (!this.fireworkBuffer) {
      const sr = this.ctx.sampleRate;
      const noiseLen = Math.floor(sr * 0.5);
      const noiseBuf = this.ctx.createBuffer(1, noiseLen, sr);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < noiseLen; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sr * 0.12));
      }
      const noiseSrc = this.ctx.createBufferSource();
      noiseSrc.buffer = noiseBuf;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(1100 + Math.random() * 300, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(140, now + 0.48);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.42, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      noiseSrc.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noiseSrc.start(now);
    }
  }

  // ================================================================
  // SFX Romantis Lainnya
  // ================================================================
  playCursorMove() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g   = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.05);
    g.gain.setValueAtTime(0.15, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(g); g.connect(this.sfxGain);
    osc.start(now); osc.stop(now + 0.07);
  }

  playWindowOpen() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    [739.99, 1108.73].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const g   = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      g.gain.setValueAtTime(0.18, now + i * 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.18);
      osc.connect(g); g.connect(this.sfxGain);
      osc.start(now + i * 0.05); osc.stop(now + i * 0.05 + 0.2);
    });
  }

  playCrystalFanfare() {
    if (!this.ctx || this.isMuted) return;
    const now   = this.ctx.currentTime;
    [440.00, 554.37, 659.25, 880.00, 1108.73].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const g   = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      g.gain.setValueAtTime(0.18, now + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.5);
      osc.connect(g); g.connect(this.sfxGain);
      osc.start(now + i * 0.08); osc.stop(now + i * 0.08 + 0.55);
    });
  }

  playCandleBlow() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const size = this.ctx.sampleRate * 0.6;
    const buf  = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
    const d    = buf.getChannelData(0);
    for (let i = 0; i < size; i++)
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (size * 0.35));

    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const flt = this.ctx.createBiquadFilter();
    flt.type = 'bandpass';
    flt.frequency.setValueAtTime(600, now);
    flt.frequency.linearRampToValueAtTime(180, now + 0.55);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.28, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
    src.connect(flt); flt.connect(g); g.connect(this.sfxGain);
    src.start(now);
  }

  playStep() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g   = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(95 + Math.random() * 18, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.04);
    g.gain.setValueAtTime(0.055, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(g); g.connect(this.sfxGain);
    osc.start(now); osc.stop(now + 0.05);
  }
}

export const ffAudio = new RomanticPianoAudio();
