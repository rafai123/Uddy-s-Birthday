// Main Application Entry Point
import { storage } from "./storage.js";
import { audio } from "./audio.js";
import { CinematicController } from "./cinematic.js";
import { GameWorld } from "./world.js";
import { ControlsController } from "./controls.js";
import { AlbumController } from "./album.js";
import { LOCATIONS_DATA } from "./data.js";

class App {
  constructor() {
    this.worldCanvas = document.getElementById("game-canvas");
    this.promptBox = document.getElementById("interaction-prompt");
    this.promptBtn = document.getElementById("prompt-action-btn");
    this.promptText = document.getElementById("prompt-text");

    this.btnSound = document.getElementById("btn-sound-toggle");
    this.soundIcon = document.getElementById("sound-icon");
    this.btnJournal = document.getElementById("btn-journal-open");
    this.journalBadge = document.getElementById("journal-badge");
    this.btnReplayIntro = document.getElementById("btn-replay-intro");

    this.currentNearbyItem = null;
  }

  init() {
    // 1. Initialize Controllers
    this.albumController = new AlbumController({
      onJournalUpdated: () => this.updateHUD()
    });

    this.gameWorld = new GameWorld({
      canvas: this.worldCanvas,
      onNearLocation: (item) => this.handleNearLocation(item),
      onLeaveLocation: () => this.handleLeaveLocation()
    });

    this.controls = new ControlsController({
      gameWorld: this.gameWorld,
      onAction: () => this.triggerCurrentAction()
    });

    // 2. Setup Sound & First Interaction Listener
    this.setupAudioListeners();

    // 3. Setup HUD Buttons
    this.setupHUD();

    // 4. Decide flow: Show Cinematic Intro or Game World directly
    const introWatched = storage.isIntroWatched();
    if (!introWatched) {
      this.cinematic = new CinematicController({
        onComplete: () => {
          this.startGame();
        }
      });
      this.cinematic.start();
    } else {
      // Hide intro layer immediately
      const cinematicLayer = document.getElementById("cinematic-layer");
      if (cinematicLayer) cinematicLayer.style.display = "none";
      this.startGame();
    }
  }

  startGame() {
    this.gameWorld.start();
    this.updateHUD();
  }

  setupAudioListeners() {
    // Unlock Web Audio API on first user interaction anywhere
    const unlockHandler = () => {
      audio.unlock();
      window.removeEventListener("pointerdown", unlockHandler);
      window.removeEventListener("keydown", unlockHandler);
    };
    window.addEventListener("pointerdown", unlockHandler, { once: true });
    window.addEventListener("keydown", unlockHandler, { once: true });

    // Sound toggle button
    this.btnSound.addEventListener("click", (e) => {
      e.stopPropagation();
      audio.unlock();
      const isMuted = audio.toggleMute();
      this.soundIcon.textContent = isMuted ? "🔇" : "🎵";
    });

    // Initial state
    this.soundIcon.textContent = storage.isMuted() ? "🔇" : "🎵";
  }

  setupHUD() {
    // Journal Button
    this.btnJournal.addEventListener("click", () => {
      audio.unlock();
      this.albumController.openJournal();
    });

    // Replay Intro Button
    if (this.btnReplayIntro) {
      this.btnReplayIntro.addEventListener("click", () => {
        audio.unlock();
        audio.playClick();
        const cinematicLayer = document.getElementById("cinematic-layer");
        cinematicLayer.style.display = "flex";
        cinematicLayer.classList.remove("fade-out");
        
        this.cinematic = new CinematicController({
          onComplete: () => {
            this.startGame();
          }
        });
        this.cinematic.start();
      });
    }

    // Prompt Click
    this.promptBtn.addEventListener("click", () => {
      this.triggerCurrentAction();
    });
  }

  handleNearLocation(item) {
    this.currentNearbyItem = item;
    this.controls.setActionButtonHighlight(true);

    if (item.type === "secret") {
      this.promptText.textContent = item.locked ? "🔒 Our Little Universe (Terkunci)" : "🌌 Masuk ke Our Little Universe ✨";
    } else {
      this.promptText.textContent = `Tampilkan Memori: ${item.name} ✨`;
    }

    this.promptBox.classList.add("visible");
  }

  handleLeaveLocation() {
    this.currentNearbyItem = null;
    this.controls.setActionButtonHighlight(false);
    this.promptBox.classList.remove("visible");
  }

  triggerCurrentAction() {
    audio.unlock();
    if (!this.currentNearbyItem) return;

    if (this.currentNearbyItem.type === "secret") {
      this.albumController.openSecretArea();
    } else {
      this.albumController.openAlbum(this.currentNearbyItem);
    }
  }

  updateHUD() {
    const unlocked = storage.getUnlockedLocations();
    const count = unlocked.length;
    const total = LOCATIONS_DATA.length;
    this.journalBadge.textContent = `${count}/${total}`;

    if (count >= total) {
      this.journalBadge.style.background = "#eab308";
      this.journalBadge.style.color = "#000";
    }
  }
}

// Start application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
