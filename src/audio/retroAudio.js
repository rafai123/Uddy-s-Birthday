// 🎹 River Flows in You – Yiruma | Slow Romantic Piano Synthesis
// Sintesis piano akustik grand murni (Web Audio API) tanpa file eksternal
// Dilengkapi: Concert hall reverb, multi-harmonic strings, sustain pedal simulation

class RomanticPianoAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlaying = false;
    this.masterGain = null;
    this.pianoGain = null;
    this.sfxGain = null;
    this.reverbNode = null;
    this.timerId = null;

    // Frekuensi piano lengkap
    this.notes = {
      'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31,
      'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
      'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56,
      'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00,
      'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
      'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
      'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
      'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
      'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25,
      'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99,
      'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
      'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51
    };

    // ================================================================
    // 🎵 RIVER FLOWS IN YOU – Yiruma
    // Tempo sangat slow & romantis (rubato feel)
    // Format: { right: [...melodi], left: [...bass arpeggio], dur: detik, vel: 0-1 }
    // ================================================================
    this.score = [
      // --- Intro: lembut dan mengambang ---
      { right: ['A4'],        left: ['F#2','C#3','F#3'], dur: 0.9, vel: 0.55 },
      { right: ['B4'],        left: [],                  dur: 0.9, vel: 0.6  },
      { right: ['C#5'],       left: ['A2','E3','A3'],    dur: 1.4, vel: 0.7  },
      { right: ['B4'],        left: [],                  dur: 0.7, vel: 0.58 },
      { right: ['A4'],        left: ['F#2','C#3','F#3'], dur: 0.7, vel: 0.6  },
      { right: ['G#4'],       left: [],                  dur: 0.8, vel: 0.52 },
      { right: ['A4'],        left: ['D2','A2','D3'],    dur: 1.5, vel: 0.65 },
      { right: ['E4'],        left: ['F#3','A3'],        dur: 1.8, vel: 0.5  },

      // --- Frase 2: mengalir lebih lembut ---
      { right: ['A4'],        left: ['A2','E3','A3'],    dur: 0.8, vel: 0.6  },
      { right: ['B4'],        left: [],                  dur: 0.8, vel: 0.65 },
      { right: ['C#5'],       left: ['C#3','E3','G#3'],  dur: 1.0, vel: 0.72 },
      { right: ['B4'],        left: [],                  dur: 0.6, vel: 0.6  },
      { right: ['A4'],        left: ['A2','A3'],         dur: 0.7, vel: 0.62 },
      { right: ['B4'],        left: ['E2','B2','E3'],    dur: 0.7, vel: 0.68 },
      { right: ['C#5'],       left: [],                  dur: 0.7, vel: 0.72 },
      { right: ['D5'],        left: ['G#3','B3'],        dur: 0.7, vel: 0.78 },
      { right: ['C#5'],       left: [],                  dur: 0.6, vel: 0.68 },
      { right: ['B4'],        left: ['E3','G#3'],        dur: 1.6, vel: 0.6  },

      // --- Frase 3: variasi naik ---
      { right: ['A4'],        left: ['F#2','C#3','F#3'], dur: 0.8, vel: 0.65 },
      { right: ['B4'],        left: [],                  dur: 0.8, vel: 0.7  },
      { right: ['C#5'],       left: ['A2','E3','A3'],    dur: 1.1, vel: 0.78 },
      { right: ['B4'],        left: [],                  dur: 0.6, vel: 0.65 },
      { right: ['A4'],        left: ['F#2','C#3','F#3'], dur: 0.7, vel: 0.65 },
      { right: ['G#4'],       left: [],                  dur: 0.7, vel: 0.58 },
      { right: ['A4'],        left: ['D2','A2','D3'],    dur: 1.2, vel: 0.7  },
      { right: ['E4'],        left: ['D3','F#3'],        dur: 1.6, vel: 0.55 },

      // --- Chorus: puncak emosional slow ---
      { right: ['E5'],        left: ['F#2','C#3','A3'],  dur: 1.0, vel: 0.82 },
      { right: ['D5'],        left: [],                  dur: 0.7, vel: 0.72 },
      { right: ['C#5'],       left: ['C#4'],             dur: 0.9, vel: 0.78 },
      { right: ['D5'],        left: [],                  dur: 0.7, vel: 0.72 },
      { right: ['C#5'],       left: ['D2','A2','F#3'],   dur: 1.0, vel: 0.80 },
      { right: ['B4'],        left: [],                  dur: 0.7, vel: 0.68 },
      { right: ['A4'],        left: ['A2','E3','A3'],    dur: 1.6, vel: 0.72 },

      { right: ['E5'],        left: ['A2','E3','C#4'],   dur: 1.0, vel: 0.85 },
      { right: ['D5'],        left: [],                  dur: 0.7, vel: 0.72 },
      { right: ['C#5'],       left: ['E4'],              dur: 0.9, vel: 0.80 },
      { right: ['D5'],        left: [],                  dur: 0.7, vel: 0.72 },
      { right: ['C#5'],       left: ['E2','B2','G#3'],   dur: 1.0, vel: 0.82 },
      { right: ['B4'],        left: [],                  dur: 0.7, vel: 0.68 },
      { right: ['C#5'],       left: ['B3','E3'],         dur: 1.8, vel: 0.75 },

      // --- Outro: turun lembut, damai ---
      { right: ['A4','C#5'],  left: ['F#2','C#3','A3'],  dur: 2.0, vel: 0.7  },
      { right: ['F#4','A4'],  left: ['D2','A2','F#3'],   dur: 2.0, vel: 0.65 },
      { right: ['E4','A4'],   left: ['A2','E3','C#4'],   dur: 2.2, vel: 0.68 },
      { right: ['E4','G#4'],  left: ['E2','B2','G#3'],   dur: 2.5, vel: 0.55 },
    ];

    this.initUnlock();
  }

  // Auto-unlock AudioContext saat interaksi pertama (browser policy)
  initUnlock() {
    const unlock = () => {
      if (!this.ctx) this.initContext();
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      if (!this.isPlaying && !this.isMuted) this.startBGM();
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
      this.masterGain.gain.setValueAtTime(0.72, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Concert Hall Reverb
      this.createReverb();

      this.pianoGain = this.ctx.createGain();
      this.pianoGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.pianoGain.connect(this.masterGain);

      if (this.reverbNode) {
        const reverbSend = this.ctx.createGain();
        reverbSend.gain.setValueAtTime(0.38, this.ctx.currentTime);
        this.pianoGain.connect(reverbSend);
        reverbSend.connect(this.reverbNode);
        this.reverbNode.connect(this.masterGain);
      }

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    } catch (e) {
      console.warn('Web Audio not supported', e);
    }
  }

  // Reverb ruang konser halus (~2 detik ekor)
  createReverb() {
    if (!this.ctx) return;
    try {
      const sr = this.ctx.sampleRate;
      const len = sr * 2.4;
      const buf = this.ctx.createBuffer(2, len, sr);
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < len; i++) {
          d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sr * 0.8));
        }
      }
      this.reverbNode = this.ctx.createConvolver();
      this.reverbNode.buffer = buf;
    } catch (e) {}
  }

  // ================================================================
  // Sintesis nada piano akustik grand (multi-harmonik + hammer strike)
  // ================================================================
  playPianoNote(freq, startTime, duration = 1.5, velocity = 0.75) {
    if (!this.ctx || !this.pianoGain) return;

    // Harmonik senar piano akustik
    const harmonics = [
      { ratio: 1.0, gain: 1.0,  decay: 2.2 },
      { ratio: 2.0, gain: 0.5,  decay: 1.3 },
      { ratio: 3.0, gain: 0.22, decay: 0.8 },
      { ratio: 4.0, gain: 0.10, decay: 0.5 },
      { ratio: 5.0, gain: 0.04, decay: 0.3 },
    ];

    // Low-pass filter: tuts felt hangat lembut
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const cutoff = Math.min(5800, freq * 4.0 + velocity * 1600);
    filter.frequency.setValueAtTime(cutoff, startTime);
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(400, freq * 1.4), startTime + Math.min(duration, 0.5)
    );

    const noteGain = this.ctx.createGain();
    const vol = velocity * 0.26;

    harmonics.forEach(h => {
      // Pasangan osilator ± 1.2 cent → efek unison senar piano
      [-1.2, 1.2].forEach(det => {
        const osc = this.ctx.createOscillator();
        const hg  = this.ctx.createGain();
        osc.type = h.ratio === 1 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq * h.ratio, startTime);
        osc.detune.setValueAtTime(det, startTime);

        const hVol = vol * h.gain * 0.5;
        const decT = Math.min(duration * 1.6, h.decay * 1.8);

        hg.gain.setValueAtTime(0.0001, startTime);
        hg.gain.linearRampToValueAtTime(hVol, startTime + 0.005); // attack sangat cepat
        hg.gain.exponentialRampToValueAtTime(hVol * 0.42, startTime + 0.14);
        hg.gain.exponentialRampToValueAtTime(0.00001, startTime + decT);

        osc.connect(hg);
        hg.connect(filter);
        osc.start(startTime);
        osc.stop(startTime + decT + 0.05);
      });
    });

    // Hammer transient (sentuhan palu felt lembut)
    const thud = this.ctx.createOscillator();
    const thudG = this.ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(95, startTime);
    thud.frequency.exponentialRampToValueAtTime(40, startTime + 0.022);
    thudG.gain.setValueAtTime(vol * 0.15, startTime);
    thudG.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.025);
    thud.connect(thudG);
    thudG.connect(filter);
    thud.start(startTime);
    thud.stop(startTime + 0.03);

    filter.connect(noteGain);
    noteGain.connect(this.pianoGain);
  }

  // ================================================================
  // Loop pemutar BGM
  // ================================================================
  startBGM() {
    if (!this.ctx) this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    if (this.isPlaying || this.isMuted) return;

    this.isPlaying = true;
    let step = 0;

    const tick = () => {
      if (!this.isPlaying || this.isMuted || !this.ctx) return;
      const item = this.score[step];
      const now  = this.ctx.currentTime;
      const dur  = item.dur;
      const vel  = item.vel ?? 0.72;

      // Tangan kanan: melodi
      if (item.right?.length > 0) {
        item.right.forEach(n => {
          const f = this.notes[n];
          if (f) this.playPianoNote(f, now, dur * 1.8, vel);
        });
      }

      // Tangan kiri: bass + arpeggio (menyusul dengan interval kecil)
      if (item.left?.length > 0) {
        const gap = item.left.length > 1 ? (dur * 0.6) / item.left.length : 0;
        item.left.forEach((n, i) => {
          const f = this.notes[n];
          if (f) this.playPianoNote(f, now + i * gap, dur * 2.2, vel * 0.72);
        });
      }

      step = (step + 1) % this.score.length;
      this.timerId = setTimeout(tick, dur * 1000);
    };

    tick();
  }

  stopBGM() {
    this.isPlaying = false;
    if (this.timerId) { clearTimeout(this.timerId); this.timerId = null; }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
      if (this.masterGain && this.ctx)
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    } else {
      if (this.masterGain && this.ctx)
        this.masterGain.gain.setValueAtTime(0.72, this.ctx.currentTime);
      this.startBGM();
    }
    return !this.isMuted;
  }

  // ================================================================
  // SFX Romantis
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
    // Arpeggio A Mayor romantis
    [440.00, 554.37, 659.25, 880.00, 1108.73].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const g   = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      g.gain.setValueAtTime(0.2, now + i * 0.08);
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

  playFirework() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const sr = this.ctx.sampleRate;

    // 1. Dentuman Sub-Bass Kembang Api (Low Punch Boom)
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(140 + Math.random() * 25, now);
    boomOsc.frequency.exponentialRampToValueAtTime(28, now + 0.42);
    boomGain.gain.setValueAtTime(0.48, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
    boomOsc.connect(boomGain);
    boomGain.connect(this.sfxGain);
    boomOsc.start(now);
    boomOsc.stop(now + 0.5);

    // 2. Ledakan Kembang Api Udara (Burst Noise + Lowpass Whoosh)
    const noiseLen = Math.floor(sr * 0.55);
    const noiseBuf = this.ctx.createBuffer(1, noiseLen, sr);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sr * 0.13));
    }
    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(950 + Math.random() * 350, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(120, now + 0.5);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.38, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noiseSrc.start(now);

    // 3. Gemerlap Percikan Bintang Kembang Api (Crackling Pops)
    for (let k = 0; k < 5; k++) {
      const popDelay = 0.07 + k * (0.05 + Math.random() * 0.04);
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(550 + Math.random() * 650, now + popDelay);
      popGain.gain.setValueAtTime(0.14, now + popDelay);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + popDelay + 0.035);
      popOsc.connect(popGain);
      popGain.connect(this.sfxGain);
      popOsc.start(now + popDelay);
      popOsc.stop(now + popDelay + 0.04);
    }
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
