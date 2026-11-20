// Opening Cinematic Controller: Romantic Loading, Fireworks, Cake, Blowing Candles, Portal Transition
import { audio } from "./audio.js";
import { storage } from "./storage.js";

export class CinematicController {
  constructor({ onComplete }) {
    this.onComplete = onComplete;
    this.container = document.getElementById("cinematic-layer");
    this.canvas = document.getElementById("cinematic-canvas");
    this.ctx = this.canvas.getContext("2d");
    
    // Screens / phases
    this.screenLoading = document.getElementById("screen-loading");
    this.screenFireworks = document.getElementById("screen-fireworks");
    this.screenReveal = document.getElementById("screen-reveal");
    this.screenCake = document.getElementById("screen-cake");
    this.screenTransition = document.getElementById("screen-transition");
    this.btnSkip = document.getElementById("btn-skip-intro");

    // Cake elements
    this.cakeContainer = document.getElementById("cake-container");
    this.cakeStage = document.getElementById("cake-stage");
    this.btnBlow = document.getElementById("btn-blow-candles");
    this.btnExploreDirect = document.getElementById("btn-explore-direct");
    this.windEffect = document.getElementById("wind-effect");
    this.heartMessage = document.getElementById("heart-message-box");
    this.btnExploreAfterBlow = document.getElementById("btn-explore-after-blow");

    // Particle pool for fireworks & confetti
    this.particles = [];
    this.particlePool = [];
    this.rockets = [];
    this.confetti = [];
    this.isRunning = true;
    this.animationId = null;

    this.candleCount = 24;
    this.candleElements = [];

    this.initCanvasSize();
    window.addEventListener("resize", () => this.initCanvasSize());
  }

  initCanvasSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start() {
    this.renderCandles();
    this.bindEvents();
    this.startLoop();
    this.runSequence();
  }

  bindEvents() {
    this.btnSkip.addEventListener("click", () => {
      audio.unlock();
      audio.playClick();
      this.finishCinematic();
    });

    this.btnBlow.addEventListener("click", () => {
      audio.unlock();
      this.handleBlowCandles();
    });

    this.btnExploreDirect.addEventListener("click", () => {
      audio.unlock();
      audio.playClick();
      this.triggerWorldTransition();
    });

    this.btnExploreAfterBlow.addEventListener("click", () => {
      audio.unlock();
      audio.playClick();
      this.triggerWorldTransition();
    });
  }

  // Render 24 Lilin di kue ulang tahun (SVG/DOM)
  renderCandles() {
    const candlesRow = document.getElementById("candles-row");
    candlesRow.innerHTML = "";
    this.candleElements = [];

    for (let i = 0; i < this.candleCount; i++) {
      const candle = document.createElement("div");
      candle.className = "candle";
      candle.dataset.index = i;

      // Candle body + wick + flame + smoke
      candle.innerHTML = `
        <div class="candle-flame">
          <div class="flame-core"></div>
        </div>
        <div class="candle-smoke"></div>
        <div class="candle-wick"></div>
        <div class="candle-stick" style="background: hsl(${(i * 15) % 360}, 85%, 72%)"></div>
      `;
      candlesRow.appendChild(candle);
      this.candleElements.push(candle);
    }
  }

  // Timeline Alur Sinematik Otomatis
  runSequence() {
    // 01. Romantic Loading (3.5s)
    this.showScreen(this.screenLoading);

    setTimeout(() => {
      if (!this.isRunning) return;
      // 02. Fireworks Celebration
      this.showScreen(this.screenFireworks);
      this.launchCelebrationFireworks(12);

      setTimeout(() => {
        if (!this.isRunning) return;
        // 03. Birthday Reveal
        this.showScreen(this.screenReveal);
        this.launchCelebrationFireworks(6);

        setTimeout(() => {
          if (!this.isRunning) return;
          // 04. Cake & Choices
          this.showScreen(this.screenCake);
          this.cakeContainer.classList.add("appear");
        }, 4000);
      }, 4500);
    }, 3200);
  }

  showScreen(targetScreen) {
    [this.screenLoading, this.screenFireworks, this.screenReveal, this.screenCake, this.screenTransition].forEach((s) => {
      if (s) {
        s.classList.remove("active");
        s.style.opacity = "0";
        s.style.pointerEvents = "none";
      }
    });

    if (targetScreen) {
      targetScreen.classList.add("active");
      targetScreen.style.opacity = "1";
      targetScreen.style.pointerEvents = "auto";
    }
  }

  // Interaksi Tiup Lilin
  handleBlowCandles() {
    this.btnBlow.disabled = true;
    this.btnBlow.style.opacity = "0.5";
    audio.playBlowSound();

    // A. Zoom ke Kue
    this.cakeStage.classList.add("zoom-in");

    // B. Tiupan Angin (hembusan dari kiri ke kanan)
    this.windEffect.classList.add("active");

    // C. Lilin padam berurutan dari kiri ke kanan
    const delayPerCandle = 90; // ms
    this.candleElements.forEach((candle, idx) => {
      setTimeout(() => {
        const flame = candle.querySelector(".candle-flame");
        const smoke = candle.querySelector(".candle-smoke");
        if (flame) flame.classList.add("extinguished");
        if (smoke) smoke.classList.add("puff");
        if (idx % 3 === 0) audio.playExtinguish();
      }, 400 + idx * delayPerCandle);
    });

    // D. Confetti, Cahaya & Pesan Hati setelah semua lilin padam
    const totalTime = 400 + this.candleCount * delayPerCandle + 300;
    setTimeout(() => {
      storage.setCandlesBlown(true);
      this.windEffect.classList.remove("active");
      this.cakeStage.classList.add("glow-soft");
      
      // Ledakan Confetti
      this.spawnConfettiBurst();
      audio.playChime();

      // Tampilkan Pesan Hati
      setTimeout(() => {
        this.heartMessage.classList.add("visible");
      }, 700);
    }, totalTime);
  }

  // 05. Portal Transisi ke Game World
  triggerWorldTransition() {
    this.showScreen(this.screenTransition);
    audio.playChime();

    const portal = document.getElementById("portal-vortex");
    if (portal) portal.classList.add("expand");

    setTimeout(() => {
      this.finishCinematic();
    }, 2200);
  }

  finishCinematic() {
    this.isRunning = false;
    storage.setIntroWatched(true);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.container.classList.add("fade-out");
    setTimeout(() => {
      this.container.style.display = "none";
      if (this.onComplete) {
        this.onComplete();
      }
    }, 1000);
  }

  // Kembang Api Canvas 2D
  launchCelebrationFireworks(count = 8) {
    let fired = 0;
    const interval = setInterval(() => {
      if (!this.isRunning || fired >= count) {
        clearInterval(interval);
        return;
      }
      const x = Math.random() * (this.canvas.width * 0.8) + this.canvas.width * 0.1;
      const targetY = Math.random() * (this.canvas.height * 0.45) + this.canvas.height * 0.15;
      this.rockets.push(new Rocket(x, this.canvas.height, targetY, () => {
        this.createExplosion(x, targetY);
        audio.playFirework();
      }));
      fired++;
    }, 400);
  }

  createExplosion(x, y) {
    const colors = ["#ff3366", "#ff9933", "#ffff33", "#33ccff", "#cc33ff", "#ff66cc", "#ffeedd"];
    const particleCount = 65;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = Math.random() * 4.5 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const isHeart = Math.random() < 0.25;

      let p = this.particlePool.pop();
      if (!p) {
        p = new Particle();
      }
      p.init(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, isHeart);
      this.particles.push(p);
    }
  }

  spawnConfettiBurst() {
    const colors = ["#ff3b69", "#ffaa00", "#ffd700", "#00d2ff", "#b026ff", "#00f0aa", "#ffffff"];
    for (let i = 0; i < 140; i++) {
      this.confetti.push({
        x: this.canvas.width / 2 + (Math.random() * 80 - 40),
        y: this.canvas.height * 0.65,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 14 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 15,
        alpha: 1
      });
    }
  }

  // Loop requestAnimationFrame
  startLoop() {
    const loop = () => {
      if (!this.isRunning) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Render Rockets
      for (let i = this.rockets.length - 1; i >= 0; i--) {
        const r = this.rockets[i];
        r.update();
        r.draw(this.ctx);
        if (r.dead) {
          this.rockets.splice(i, 1);
        }
      }

      // Render Explosion Particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.update();
        p.draw(this.ctx);
        if (p.dead) {
          this.particles.splice(i, 1);
          if (this.particlePool.length < 200) {
            this.particlePool.push(p);
          }
        }
      }

      // Render Confetti
      for (let i = this.confetti.length - 1; i >= 0; i--) {
        const c = this.confetti[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.28; // gravity
        c.vx *= 0.98;
        c.rotation += c.vRot;
        c.alpha -= 0.007;

        if (c.alpha <= 0 || c.y > this.canvas.height + 20) {
          this.confetti.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, c.alpha);
        this.ctx.translate(c.x, c.y);
        this.ctx.rotate((c.rotation * Math.PI) / 180);
        this.ctx.fillStyle = c.color;
        this.ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
        this.ctx.restore();
      }

      this.animationId = requestAnimationFrame(loop);
    };

    this.animationId = requestAnimationFrame(loop);
  }
}

// Helper Class: Rocket
class Rocket {
  constructor(x, y, targetY, onExplode) {
    this.x = x;
    this.y = y;
    this.targetY = targetY;
    this.vy = -Math.random() * 3 - 9;
    this.dead = false;
    this.onExplode = onExplode;
  }

  update() {
    this.y += this.vy;
    if (this.y <= this.targetY) {
      this.dead = true;
      if (this.onExplode) this.onExplode();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "#fff8db";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Spark trail
    ctx.strokeStyle = "rgba(255, 200, 100, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + 12);
    ctx.stroke();
    ctx.restore();
  }
}

// Helper Class: Particle
class Particle {
  init(x, y, vx, vy, color, isHeart = false) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.isHeart = isHeart;
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.012;
    this.size = Math.random() * 3.5 + 2;
    this.gravity = 0.09;
    this.dead = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.98;
    this.alpha -= this.decay;
    if (this.alpha <= 0) {
      this.dead = true;
    }
  }

  draw(ctx) {
    if (this.dead) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;

    if (this.isHeart) {
      // Draw tiny heart shape
      ctx.translate(this.x, this.y);
      ctx.beginPath();
      const s = this.size * 0.8;
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s, -s, -s * 2, s / 3, 0, s * 1.6);
      ctx.bezierCurveTo(s * 2, s / 3, s, -s, 0, 0);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
