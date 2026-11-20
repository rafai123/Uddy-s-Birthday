// Photo Album, Memory Journal & Secret Area Modal Controller
import { LOCATIONS_DATA, SECRET_AREA } from "./data.js";
import { storage } from "./storage.js";
import { audio } from "./audio.js";

export class AlbumController {
  constructor({ onJournalUpdated }) {
    this.onJournalUpdated = onJournalUpdated;

    // Album Elements
    this.albumModal = document.getElementById("album-modal");
    this.albumTitle = document.getElementById("album-title");
    this.albumSubtitle = document.getElementById("album-subtitle");
    this.albumDate = document.getElementById("album-date");
    this.albumQuote = document.getElementById("album-quote");
    this.albumMainPhoto = document.getElementById("album-main-photo");
    this.albumCaption = document.getElementById("album-caption");
    this.albumCounter = document.getElementById("album-counter");
    this.albumThumbnails = document.getElementById("album-thumbnails");
    this.btnPrevPhoto = document.getElementById("btn-prev-photo");
    this.btnNextPhoto = document.getElementById("btn-next-photo");
    this.btnCloseAlbum = document.getElementById("btn-close-album");

    // Lightbox Zoom
    this.lightboxModal = document.getElementById("lightbox-modal");
    this.lightboxImg = document.getElementById("lightbox-img");
    this.lightboxCaption = document.getElementById("lightbox-caption");
    this.btnCloseLightbox = document.getElementById("btn-close-lightbox");

    // Memory Journal Elements
    this.journalModal = document.getElementById("journal-modal");
    this.journalList = document.getElementById("journal-list");
    this.journalProgressText = document.getElementById("journal-progress-text");
    this.journalProgressBar = document.getElementById("journal-progress-bar");
    this.btnCloseJournal = document.getElementById("btn-close-journal");
    this.btnResetProgress = document.getElementById("btn-reset-progress");

    // Secret Area Modal Elements
    this.secretModal = document.getElementById("secret-modal");
    this.secretTitle = document.getElementById("secret-title");
    this.secretBody = document.getElementById("secret-body");
    this.secretDate = document.getElementById("secret-date");
    this.secretLockedNotice = document.getElementById("secret-locked-notice");
    this.secretUnlockedContent = document.getElementById("secret-unlocked-content");
    this.btnCloseSecret = document.getElementById("btn-close-secret");
    this.secretCanvas = document.getElementById("secret-fireworks-canvas");

    this.currentLocation = null;
    this.currentPhotoIndex = 0;
    this.secretFireworksTimer = null;

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Album navigation
    this.btnPrevPhoto.addEventListener("click", () => this.prevPhoto());
    this.btnNextPhoto.addEventListener("click", () => this.nextPhoto());
    this.btnCloseAlbum.addEventListener("click", () => this.closeAlbum());

    // Lightbox
    this.albumMainPhoto.addEventListener("click", () => {
      if (this.currentLocation && this.currentLocation.photos.length > 0) {
        this.openLightbox(this.currentLocation.photos[this.currentPhotoIndex]);
      }
    });
    this.btnCloseLightbox.addEventListener("click", () => this.closeLightbox());
    this.lightboxModal.addEventListener("click", (e) => {
      if (e.target === this.lightboxModal) this.closeLightbox();
    });

    // Journal
    this.btnCloseJournal.addEventListener("click", () => this.closeJournal());
    if (this.btnResetProgress) {
      this.btnResetProgress.addEventListener("click", () => {
        if (confirm("Apakah kamu ingin mengulang petualangan dari awal? Semua kenangan akan direset.")) {
          storage.resetAll();
          window.location.reload();
        }
      });
    }

    // Secret Area
    this.btnCloseSecret.addEventListener("click", () => this.closeSecret());

    // Swipe support for touch
    let touchStartX = 0;
    this.albumMainPhoto.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    this.albumMainPhoto.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      if (touchStartX - touchEndX > 50) {
        this.nextPhoto();
      } else if (touchEndX - touchStartX > 50) {
        this.prevPhoto();
      }
    }, { passive: true });
  }

  // Buka Album Kenangan untuk Lokasi Tertentu
  openAlbum(location) {
    this.currentLocation = location;
    this.currentPhotoIndex = 0;

    // Play chime sound
    audio.playChime();

    // Mark as unlocked in storage
    const newlyUnlocked = storage.unlockLocation(location.id);
    if (newlyUnlocked && this.onJournalUpdated) {
      this.onJournalUpdated();
    }

    this.albumTitle.textContent = `${location.icon} ${location.name}`;
    this.albumSubtitle.textContent = location.subtitle;
    this.albumDate.textContent = `📅 ${location.dateText}`;
    this.albumQuote.textContent = location.quote;

    this.renderThumbnails();
    this.showCurrentPhoto();

    this.albumModal.classList.add("active");
  }

  closeAlbum() {
    this.albumModal.classList.remove("active");
  }

  showCurrentPhoto() {
    if (!this.currentLocation || !this.currentLocation.photos.length) return;
    const photo = this.currentLocation.photos[this.currentPhotoIndex];
    const folder = this.currentLocation.folder;

    this.albumMainPhoto.style.opacity = "0.4";
    this.albumMainPhoto.src = `./${folder}/${photo.file}`;
    this.albumMainPhoto.onload = () => {
      this.albumMainPhoto.style.opacity = "1";
    };

    this.albumCaption.textContent = photo.caption;
    this.albumCounter.textContent = `${this.currentPhotoIndex + 1} / ${this.currentLocation.photos.length}`;

    // Update active thumbnail
    const thumbs = this.albumThumbnails.querySelectorAll(".thumb-item");
    thumbs.forEach((t, i) => {
      if (i === this.currentPhotoIndex) {
        t.classList.add("active");
        t.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      } else {
        t.classList.remove("active");
      }
    });
  }

  renderThumbnails() {
    this.albumThumbnails.innerHTML = "";
    const folder = this.currentLocation.folder;

    this.currentLocation.photos.forEach((photo, idx) => {
      const thumb = document.createElement("img");
      thumb.className = "thumb-item" + (idx === 0 ? " active" : "");
      thumb.loading = "lazy";
      thumb.src = `./${folder}/${photo.file}`;
      thumb.alt = photo.caption;

      thumb.addEventListener("click", () => {
        this.currentPhotoIndex = idx;
        this.showCurrentPhoto();
        audio.playClick();
      });

      this.albumThumbnails.appendChild(thumb);
    });
  }

  prevPhoto() {
    if (!this.currentLocation) return;
    audio.playClick();
    this.currentPhotoIndex = (this.currentPhotoIndex - 1 + this.currentLocation.photos.length) % this.currentLocation.photos.length;
    this.showCurrentPhoto();
  }

  nextPhoto() {
    if (!this.currentLocation) return;
    audio.playClick();
    this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.currentLocation.photos.length;
    this.showCurrentPhoto();
  }

  // Lightbox Zoom
  openLightbox(photo) {
    if (!this.currentLocation) return;
    this.lightboxImg.src = `./${this.currentLocation.folder}/${photo.file}`;
    this.lightboxCaption.textContent = photo.caption;
    this.lightboxModal.classList.add("active");
  }

  closeLightbox() {
    this.lightboxModal.classList.remove("active");
  }

  // Memory Journal
  openJournal() {
    audio.playClick();
    const unlockedIds = storage.getUnlockedLocations();
    const total = LOCATIONS_DATA.length;
    const count = unlockedIds.length;

    this.journalProgressText.textContent = `${count} dari ${total} Kenangan Terbuka`;
    this.journalProgressBar.style.width = `${(count / total) * 100}%`;

    this.journalList.innerHTML = "";
    LOCATIONS_DATA.forEach((loc) => {
      const isUnlocked = unlockedIds.includes(loc.id);
      const card = document.createElement("div");
      card.className = `journal-card ${isUnlocked ? "unlocked" : "locked"}`;

      if (isUnlocked) {
        card.innerHTML = `
          <div class="journal-card-left">
            <img class="journal-card-thumb" src="./${loc.folder}/${loc.photos[0].file}" alt="${loc.name}">
          </div>
          <div class="journal-card-right">
            <div class="journal-card-title">${loc.icon} ${loc.name}</div>
            <div class="journal-card-date">${loc.dateText}</div>
            <p class="journal-card-desc">${loc.description.substring(0, 90)}...</p>
            <button class="btn-journal-open">Lihat Album ✨</button>
          </div>
        `;
        const btnOpen = card.querySelector(".btn-journal-open");
        btnOpen.addEventListener("click", () => {
          this.closeJournal();
          this.openAlbum(loc);
        });
      } else {
        card.innerHTML = `
          <div class="journal-card-left locked-icon">🔒</div>
          <div class="journal-card-right">
            <div class="journal-card-title">??? (${loc.name})</div>
            <div class="journal-card-hint">Belum ditemukan. Jelajahi peta untuk menemukan tempat ini.</div>
          </div>
        `;
      }
      this.journalList.appendChild(card);
    });

    this.journalModal.classList.add("active");
  }

  closeJournal() {
    this.journalModal.classList.remove("active");
  }

  // Secret Area: "Our Little Universe"
  openSecretArea() {
    const isUnlocked = storage.isSecretUnlocked();
    audio.playChime();

    if (!isUnlocked) {
      this.secretLockedNotice.classList.remove("hidden");
      this.secretUnlockedContent.classList.add("hidden");
    } else {
      this.secretLockedNotice.classList.add("hidden");
      this.secretUnlockedContent.classList.remove("hidden");
      this.secretTitle.textContent = SECRET_AREA.letterTitle;
      this.secretBody.innerText = SECRET_AREA.letterBody;
      this.secretDate.textContent = `26 November 2026 ❤️`;
      this.startSecretFireworks();
    }

    this.secretModal.classList.add("active");
  }

  closeSecret() {
    this.secretModal.classList.remove("active");
    this.stopSecretFireworks();
  }

  startSecretFireworks() {
    const canvas = this.secretCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ["#ff3b69", "#ffd700", "#ff77aa", "#00d2ff", "#b026ff", "#ffffff"];

    const spawnExplosion = () => {
      const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
      const y = Math.random() * canvas.height * 0.45 + canvas.height * 0.1;
      audio.playFirework();

      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          size: Math.random() * 3 + 1.5
        });
      }
    };

    spawnExplosion();
    this.secretFireworksTimer = setInterval(spawnExplosion, 800);

    const anim = () => {
      if (!this.secretModal.classList.contains("active")) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.alpha -= 0.015;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(anim);
    };

    requestAnimationFrame(anim);
  }

  stopSecretFireworks() {
    if (this.secretFireworksTimer) {
      clearInterval(this.secretFireworksTimer);
      this.secretFireworksTimer = null;
    }
  }
}
