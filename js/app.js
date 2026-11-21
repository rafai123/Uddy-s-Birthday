// Orchestrator Utama Game Web Retro: Dunia Kenangan Kita (Ulang Tahun ke-24 ❤️)
// Menyatukan Sprite, Peta Retro, Kontrol Touch Android, Album Model Scroll & Musik Romantis

import { LOCATIONS_DATA, SECRET_AREA } from "./data.js";
import { spriteManager } from "./sprites.js";
import { retroAudio } from "./audio.js";
import { storage } from "./storage.js";
import { RetroWorld } from "./world.js";
import { ControlsManager } from "./controls.js";
import { AlbumViewer } from "./album.js";
import { CinematicIntro } from "./cinematic.js";

class BirthdayApp {
  constructor() {
    this.world = null;
    this.controls = null;
    this.album = null;
    this.cinematic = null;
    this.nearLocation = null;

    // Elemen HUD
    this.hudContainer = document.getElementById("game-hud");
    this.avatarCanvas = document.getElementById("hud-avatar-canvas");
    this.heartGems = document.querySelectorAll(".heart-gem");
    this.interactionPrompt = document.getElementById("interaction-prompt");
    this.promptText = document.getElementById("prompt-text");
    this.btnMusicToggle = document.getElementById("btn-music-toggle");
    this.btnJournal = document.getElementById("btn-open-journal");

    // Modal Jurnal Kenangan
    this.journalModal = document.getElementById("journal-modal");
    this.journalList = document.getElementById("journal-list");
    this.journalProgressText = document.getElementById("journal-progress-text");
    this.journalProgressBar = document.getElementById("journal-progress-bar");
    this.btnCloseJournal = document.getElementById("btn-close-journal");
    this.btnResetProgress = document.getElementById("btn-reset-progress");

    // Modal Area Rahasia (Our Little Universe)
    this.secretModal = document.getElementById("secret-modal");
    this.secretLockedNotice = document.getElementById("secret-locked-notice");
    this.secretUnlockedContent = document.getElementById("secret-unlocked-content");
    this.secretTitle = document.getElementById("secret-title");
    this.secretBody = document.getElementById("secret-body");
    this.secretDate = document.getElementById("secret-date");
    this.btnCloseSecret = document.getElementById("btn-close-secret");
    this.secretCanvas = document.getElementById("secret-fireworks-canvas");

    this.secretFireworksAnim = null;
    this.secretParticles = [];

    this.init();
  }

  init() {
    // 1. Gambar Avatar Pixel Kekasih ke Kanvas HUD
    this.renderHudAvatar();

    // 2. Inisialisasi Album Viewer
    this.album = new AlbumViewer();

    // 3. Inisialisasi Dunia Game Retro Canvas
    const gameCanvas = document.getElementById("game-canvas");
    this.world = new RetroWorld({
      canvas: gameCanvas,
      onNearLocation: (loc) => this.handleNearLocation(loc),
      onLeaveLocation: () => this.handleLeaveLocation()
    });

    // 4. Inisialisasi Kontrol Mobile (Virtual D-Pad & Tombol [A])
    this.controls = new ControlsManager({
      onMove: (vx, vy) => {
        this.world.setMovement(vx * this.world.player.speed, vy * this.world.player.speed);
      },
      onAction: () => {
        this.handleActionTrigger();
      }
    });

    // 5. Inisialisasi Event HUD & Modal
    this.initHudAndModalEvents();

    // 6. Update Indikator Progres Awal
    this.updateHUDProgress();

    // 7. Mulai Cinematic Intro
    this.cinematic = new CinematicIntro({
      onComplete: () => {
        this.world.start();
        this.hudContainer.classList.add("visible");
        retroAudio.startBGM();
      }
    });
    this.cinematic.start();
  }

  renderHudAvatar() {
    if (!this.avatarCanvas || !spriteManager.avatarCanvas) return;
    const ctx = this.avatarCanvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spriteManager.avatarCanvas, 0, 0, this.avatarCanvas.width, this.avatarCanvas.height);
  }

  initHudAndModalEvents() {
    // Toggle Musik Romantis (Audio Button)
    this.btnMusicToggle.addEventListener("click", () => {
      const isPlaying = retroAudio.toggleMute();
      this.btnMusicToggle.textContent = isPlaying ? "🎵 Musik: ON" : "🔇 Musik: OFF";
      this.btnMusicToggle.classList.toggle("muted", !isPlaying);
    });

    // Buka Jurnal Kenangan
    this.btnJournal.addEventListener("click", () => {
      retroAudio.playButtonClick();
      this.openJournalModal();
    });

    // Tutup Jurnal Kenangan
    this.btnCloseJournal.addEventListener("click", () => {
      retroAudio.playButtonClick();
      this.journalModal.classList.remove("active");
      document.body.classList.remove("modal-open");
    });

    // Reset Progres
    this.btnResetProgress.addEventListener("click", () => {
      if (confirm("Mulai ulang progres petualangan dari awal? (Foto kenangan tetap aman)")) {
        storage.resetProgress();
        this.updateHUDProgress();
        this.renderJournalContent();
        retroAudio.playButtonClick();
      }
    });

    // Tutup Modal Area Rahasia
    this.btnCloseSecret.addEventListener("click", () => {
      retroAudio.playButtonClick();
      this.closeSecretModal();
    });

    // Klik Banner Prompt untuk Interaksi Langsung di HP
    this.interactionPrompt.addEventListener("click", () => {
      this.handleActionTrigger();
    });
  }

  handleNearLocation(loc) {
    this.nearLocation = loc;
    this.controls.highlightActionButton(true);

    if (loc.id === 6) {
      // Area Rahasia
      this.promptText.textContent = storage.isSecretUnlocked()
        ? "✨ Masuk ke Our Little Universe!"
        : "🔒 Area Rahasia (Terkunci)";
    } else {
      // 5 Lokasi Normal
      this.promptText.textContent = `✨ Buka Kenangan ${loc.name}! [A]`;
    }

    this.interactionPrompt.classList.add("visible");
  }

  handleLeaveLocation() {
    this.nearLocation = null;
    this.controls.highlightActionButton(false);
    this.interactionPrompt.classList.remove("visible");
  }

  handleActionTrigger() {
    if (!this.nearLocation) return;

    if (this.nearLocation.id === 6) {
      this.openSecretAreaModal();
    } else {
      this.album.open(this.nearLocation);
      this.updateHUDProgress();
    }
  }

  updateHUDProgress() {
    const visitedCount = storage.getVisitedCount();

    // Update 5 Permata Hati Retro di HUD
    this.heartGems.forEach((gem, idx) => {
      if (idx < visitedCount) {
        gem.classList.add("filled");
        gem.textContent = "💖";
      } else {
        gem.classList.remove("filled");
        gem.textContent = "🖤";
      }
    });

    // Jika seluruh 5 lokasi selesai, rayakan dengan melodi khusus!
    if (visitedCount >= 5 && !storage.data.secretUnlocked) {
      storage.data.secretUnlocked = true;
      storage.save();
      retroAudio.playDiscoveryFanfare();
    }
  }

  // ==========================================
  // JURNAL KENANGAN (MEMORY JOURNAL)
  // ==========================================
  openJournalModal() {
    this.renderJournalContent();
    this.journalModal.classList.add("active");
    document.body.classList.add("modal-open");
  }

  renderJournalContent() {
    const visitedCount = storage.getVisitedCount();
    this.journalProgressText.textContent = `${visitedCount} dari 5 Kenangan Ditemukan`;
    this.journalProgressBar.style.width = `${(visitedCount / 5) * 100}%`;

    this.journalList.innerHTML = "";
    LOCATIONS_DATA.forEach((loc) => {
      const isVisited = storage.isLocationVisited(loc.id);
      const card = document.createElement("div");
      card.className = `journal-item-card ${isVisited ? "visited" : "locked"}`;

      card.innerHTML = `
        <div class="journal-item-icon">${loc.icon}</div>
        <div class="journal-item-info">
          <div class="journal-item-title">${loc.id}. ${loc.name}</div>
          <div class="journal-item-date">${loc.dateText}</div>
          <div class="journal-item-status">${isVisited ? "✨ Terbuka (" + loc.photos.length + " Foto)" : "🔒 Belum Dikunjungi di Peta"}</div>
        </div>
        ${isVisited ? `<button class="btn-journal-view">Buka Album 📖</button>` : ""}
      `;

      if (isVisited) {
        const btnView = card.querySelector(".btn-journal-view");
        btnView.addEventListener("click", () => {
          this.journalModal.classList.remove("active");
          document.body.classList.remove("modal-open");
          this.album.open(loc);
        });
      }

      this.journalList.appendChild(card);
    });
  }

  // ==========================================
  // AREA RAHASIA: OUR LITTLE UNIVERSE
  // ==========================================
  openSecretAreaModal() {
    const isUnlocked = storage.isSecretUnlocked();
    this.secretModal.classList.add("active");
    document.body.classList.add("modal-open");

    if (isUnlocked) {
      this.secretLockedNotice.classList.add("hidden");
      this.secretUnlockedContent.classList.remove("hidden");

      this.secretTitle.textContent = SECRET_AREA.letterTitle;
      this.secretBody.innerHTML = SECRET_AREA.letterBody.replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>");
      this.secretDate.textContent = `Selalu mencintaimu,\n${SECRET_AREA.date}`;

      retroAudio.playDiscoveryFanfare();
      this.startSecretFireworks();
    } else {
      this.secretLockedNotice.classList.remove("hidden");
      this.secretUnlockedContent.classList.add("hidden");
      retroAudio.playButtonClick();
    }
  }

  closeSecretModal() {
    this.secretModal.classList.remove("active");
    document.body.classList.remove("modal-open");
    if (this.secretFireworksAnim) {
      cancelAnimationFrame(this.secretFireworksAnim);
      this.secretFireworksAnim = null;
    }
  }

  startSecretFireworks() {
    const canvas = this.secretCanvas;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.secretParticles = [];

    const spawnBurst = () => {
      const x = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
      const y = Math.random() * (canvas.height * 0.5) + canvas.height * 0.1;
      const colors = ["#fbbf24", "#f43f5e", "#ec4899", "#38bdf8", "#a855f7", "#ffffff"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      for (let i = 0; i < 40; i++) {
        const angle = (Math.PI * 2 * i) / 40;
        const spd = Math.random() * 4 + 1.5;
        this.secretParticles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          color: color,
          alpha: 1.0,
          size: Math.random() * 3 + 2,
          decay: Math.random() * 0.015 + 0.01
        });
      }
      retroAudio.playFireworkBoom();
    };

    let tick = 0;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;

      if (tick % 45 === 0) {
        spawnBurst();
      }

      for (let i = this.secretParticles.length - 1; i >= 0; i--) {
        const p = this.secretParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravitasi
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.secretParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();
      }

      this.secretFireworksAnim = requestAnimationFrame(loop);
    };

    loop();
  }
}

// Inisialisasi saat DOM siap
window.addEventListener("DOMContentLoaded", () => {
  new BirthdayApp();
});
