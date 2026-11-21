// Opening Cinematic 5-Step Experience (Persis Dokumen Desain UX Infografis)
// 01 Romantic Loading -> 02 Fireworks -> 03 Birthday Reveal -> 04 Cake & Choice -> 05 Transition to World

import { retroAudio } from "./audio.js";
import { storage } from "./storage.js";

export class CinematicIntro {
  constructor({ onComplete }) {
    this.onComplete = onComplete;
    this.container = document.getElementById("cinematic-layer");
    this.btnSkip = document.getElementById("btn-skip-intro");
    this.canvas = document.getElementById("cinematic-canvas");
    this.ctx = this.canvas.getContext("2d");

    // Layar-layar Cinematic
    this.screenLoading = document.getElementById("screen-loading");
    this.screenFireworks = document.getElementById("screen-fireworks");
    this.screenReveal = document.getElementById("screen-reveal");
    this.screenCake = document.getElementById("screen-cake");
    this.screenTransition = document.getElementById("screen-transition");

    // Elemen Interaksi Kue & Lilin
    this.cakeStage = document.getElementById("cake-stage");
    this.candlesRow = document.getElementById("candles-row");
    this.btnBlow = document.getElementById("btn-blow-candles");
    this.btnExploreDirect = document.getElementById("btn-explore-direct");
    this.btnExploreAfterBlow = document.getElementById("btn-explore-after-blow");
    this.windEffect = document.getElementById("wind-effect");
    this.heartMessageBox = document.getElementById("heart-message-box");
    this.cakeChoices = document.querySelector(".cake-choices");

    // Partikel Kembang Api & Bintang
    this.particles = [];
    this.fireworks = [];
    this.animId = null;
    this.isActive = true;
    this.timers = [];

    this.candles = [];
    this.currentStep = 1;

    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.initEvents();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initEvents() {
    // Tombol Lewati Intro
    this.btnSkip.addEventListener("click", () => {
      retroAudio.playButtonClick();
      this.finishIntro();
    });

    // Pilihan 1: Tiup Lilin
    this.btnBlow.addEventListener("click", () => {
      this.handleBlowCandles();
    });

    // Pilihan 2: Langsung Masuk ke Dunia
    this.btnExploreDirect.addEventListener("click", () => {
      retroAudio.playButtonClick();
      this.playTransitionToWorld();
    });

    // Tombol Jelajah setelah Lilin Ditiup
    this.btnExploreAfterBlow.addEventListener("click", () => {
      retroAudio.playButtonClick();
      this.playTransitionToWorld();
    });
  }

  start() {
    this.isActive = true;
    this.container.classList.add("active");
    this.createCandles(24);
    this.startCanvasLoop();

    // Jalankan Alur 5 Tahap Sesuai Infografis
    this.step01_RomanticLoading();
  }

  // 01. Romantic Loading (3-4 detik)
  step01_RomanticLoading() {
    this.showScreen(this.screenLoading);

    const timer = setTimeout(() => {
      if (!this.isActive) return;
      this.step02_FireworksCelebration();
    }, 3500);
    this.timers.push(timer);
  }

  // 02. Fireworks Celebration (4-5 detik)
  step02_FireworksCelebration() {
    this.showScreen(this.screenFireworks);

    // Luncurkan pesta kembang api retro berkilau
    let count = 0;
    const fwInterval = setInterval(() => {
      if (!this.isActive || count > 8) {
        clearInterval(fwInterval);
        return;
      }
      this.spawnFirework();
      retroAudio.playFireworkBoom();
      count++;
    }, 450);

    const timer = setTimeout(() => {
      if (!this.isActive) return;
      this.step03_BirthdayReveal();
    }, 4800);
    this.timers.push(timer);
  }

  // 03. Birthday Reveal (3-4 detik)
  step03_BirthdayReveal() {
    this.showScreen(this.screenReveal);
    retroAudio.playSparkleChime();

    // Taburkan partikel hati melayang
    for (let i = 0; i < 20; i++) {
      this.spawnHeartSparkle(
        Math.random() * this.canvas.width,
        Math.random() * this.canvas.height
      );
    }

    const timer = setTimeout(() => {
      if (!this.isActive) return;
      this.step04_CakeAndChoices();
    }, 4200);
    this.timers.push(timer);
  }

  // 04. Cake & Interactive Choices (Interaktif Lilin)
  step04_CakeAndChoices() {
    this.showScreen(this.screenCake);
  }

  // Interaksi Tiup Lilin (A, B, C, D, E per Dokumen Desain)
  handleBlowCandles() {
    this.btnBlow.disabled = true;
    this.btnExploreDirect.disabled = true;

    // A. Kamera Mendekat (Zoom in ke kue)
    this.cakeStage.classList.add("zoomed");

    // B. Tiupan Angin & SFX
    retroAudio.playCandleBlow();
    this.windEffect.classList.add("active");

    // C. 24 Lilin Padam Berurutan dengan Efek Asap Kecil
    let delay = 200;
    this.candles.forEach((candle, idx) => {
      setTimeout(() => {
        candle.extinguish();
      }, delay + (idx * 55));
    });

    // D. Confetti, Bintang & Kilau Cahaya Lembut
    setTimeout(() => {
      this.windEffect.classList.remove("active");
      retroAudio.playFireworkBoom();

      // Ledakan confetti warna-warni
      const cakeRect = this.cakeStage.getBoundingClientRect();
      const originX = cakeRect.left + cakeRect.width / 2;
      const originY = cakeRect.top + cakeRect.height / 2;
      this.spawnConfettiBurst(originX, originY, 80);

      // E. Pesan Hati Muncul
      storage.markCandlesBlown();
      this.cakeChoices.style.display = "none";
      this.heartMessageBox.classList.add("visible");
    }, delay + (this.candles.length * 55) + 400);
  }

  // 05. Transition to World (2-3 detik)
  playTransitionToWorld() {
    this.showScreen(this.screenTransition);
    retroAudio.playSparkleChime();

    // Mulai musik BGM petualangan romantis sekarang
    retroAudio.startBGM();

    setTimeout(() => {
      this.finishIntro();
    }, 2400);
  }

  finishIntro() {
    this.isActive = false;
    this.clearAllTimers();
    storage.markIntroWatched();

    // Sembunyikan layer intro dengan transisi lembut
    this.container.classList.remove("active");
    this.container.style.opacity = "0";
    setTimeout(() => {
      this.container.style.display = "none";
      if (this.animId) cancelAnimationFrame(this.animId);
      if (this.onComplete) this.onComplete();
    }, 500);
  }

  showScreen(screenEl) {
    [
      this.screenLoading,
      this.screenFireworks,
      this.screenReveal,
      this.screenCake,
      this.screenTransition
    ].forEach((s) => s.classList.remove("active"));

    screenEl.classList.add("active");
  }

  createCandles(count) {
    this.candlesRow.innerHTML = "";
    this.candles = [];

    for (let i = 0; i < count; i++) {
      const candleEl = document.createElement("div");
      candleEl.className = "pixel-candle";

      const flameEl = document.createElement("div");
      flameEl.className = "candle-flame";

      const smokeEl = document.createElement("div");
      smokeEl.className = "candle-smoke";

      candleEl.appendChild(flameEl);
      candleEl.appendChild(smokeEl);
      this.candlesRow.appendChild(candleEl);

      this.candles.push({
        element: candleEl,
        flame: flameEl,
        smoke: smokeEl,
        extinguish: () => {
          flameEl.classList.add("out");
          smokeEl.classList.add("puff");
        }
      });
    }
  }

  clearAllTimers() {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
  }

  // ==========================================
  // PARTIKEL KEMBANG API & CONFETTI CANVAS
  // ==========================================
  spawnFirework() {
    const x = Math.random() * (this.canvas.width * 0.7) + (this.canvas.width * 0.15);
    const y = Math.random() * (this.canvas.height * 0.45) + (this.canvas.height * 0.1);
    const colors = ["#f43f5e", "#fbbf24", "#38bdf8", "#ec4899", "#a855f7", "#34d399"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = Math.random() * 5 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        alpha: 1.0,
        decay: Math.random() * 0.02 + 0.015,
        size: Math.random() * 3 + 2,
        isHeart: Math.random() < 0.25
      });
    }
  }

  spawnConfettiBurst(x, y, count) {
    const colors = ["#f43f5e", "#fbbf24", "#38bdf8", "#ec4899", "#ffffff", "#34d399"];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3, // Dorongan ke atas
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        decay: Math.random() * 0.015 + 0.01,
        size: Math.random() * 4 + 3,
        gravity: 0.15,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10
      });
    }
  }

  spawnHeartSparkle(x, y) {
    this.particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -Math.random() * 2 - 0.5,
      color: "#f43f5e",
      alpha: 1.0,
      decay: 0.01,
      size: 16,
      isHeart: true
    });
  }

  startCanvasLoop() {
    const render = () => {
      if (!this.isActive) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.gravity) p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = p.alpha;
        if (p.isHeart) {
          this.ctx.fillStyle = p.color;
          this.ctx.font = `${p.size}px sans-serif`;
          this.ctx.textAlign = "center";
          this.ctx.fillText("♥", p.x, p.y);
        } else {
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        this.ctx.restore();
      }

      this.animId = requestAnimationFrame(render);
    };

    render();
  }
}
