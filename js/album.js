// Pengelola Album Kenangan Bergaya Retro ("Model Scroll" & Dioptimalkan Penuh untuk Android)
// Menampilkan foto-foto tiap momen dalam format scroll reel yang sangat ringan, mulus, dan responsif

import { getPhotoUrl, getThumbUrl } from "./data.js";
import { retroAudio } from "./audio.js";
import { storage } from "./storage.js";

export class AlbumViewer {
  constructor() {
    this.modal = document.getElementById("album-modal");
    this.titleEl = document.getElementById("album-title");
    this.dateEl = document.getElementById("album-date");
    this.quoteEl = document.getElementById("album-quote");
    this.scrollReel = document.getElementById("album-scroll-reel");
    this.counterEl = document.getElementById("album-counter");
    this.thumbStrip = document.getElementById("album-thumbnails");
    this.btnClose = document.getElementById("btn-close-album");
    this.btnPrev = document.getElementById("btn-prev-photo");
    this.btnNext = document.getElementById("btn-next-photo");

    // Lightbox modal elements
    this.lightboxModal = document.getElementById("lightbox-modal");
    this.lightboxImg = document.getElementById("lightbox-img");
    this.lightboxCaption = document.getElementById("lightbox-caption");
    this.btnCloseLightbox = document.getElementById("btn-close-lightbox");

    this.currentLocation = null;
    this.currentIndex = 0;
    this.cards = [];

    this.initEvents();
  }

  initEvents() {
    // Tutup Album
    this.btnClose.addEventListener("click", () => this.close());

    // Tombol Navigasi Sebelumnya / Berikutnya
    this.btnPrev.addEventListener("click", () => this.scrollStep(-1));
    this.btnNext.addEventListener("click", () => this.scrollStep(1));

    // Tutup Lightbox
    this.btnCloseLightbox.addEventListener("click", () => this.closeLightbox());
    this.lightboxModal.addEventListener("click", (e) => {
      if (e.target === this.lightboxModal) this.closeLightbox();
    });

    // Deteksi Scroll Reel untuk sinkronisasi thumbnail & counter secara real-time
    this.scrollReel.addEventListener("scroll", () => {
      this.handleReelScroll();
    }, { passive: true });
  }

  open(locationData) {
    this.currentLocation = locationData;
    this.currentIndex = 0;

    // Putar melodi penemuan lokasi jika baru pertama kali dibuka
    const isFirstTime = storage.markLocationVisited(locationData.id);
    if (isFirstTime) {
      retroAudio.playDiscoveryFanfare();
    } else {
      retroAudio.playButtonClick();
    }

    // Set Header & Kutipan Romantis
    this.titleEl.textContent = `${locationData.icon} ${locationData.name} - ${locationData.subtitle}`;
    this.dateEl.textContent = `📅 ${locationData.dateText}`;
    this.quoteEl.textContent = locationData.quote;

    // Render Scroll Reel & Thumbnails
    this.renderScrollReel(locationData);
    this.renderThumbnails(locationData);

    // Tampilkan Modal dengan animasi pixel fade-in
    this.modal.classList.add("active");
    document.body.classList.add("modal-open");

    // Scroll ke kartu pertama
    setTimeout(() => {
      this.scrollToIndex(0, false);
      this.updateCounter(0);
    }, 60);
  }

  close() {
    retroAudio.playButtonClick();
    this.modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    this.scrollReel.innerHTML = "";
    this.thumbStrip.innerHTML = "";
  }

  // Render Kartu Foto Model Scroll Reel
  renderScrollReel(loc) {
    this.scrollReel.innerHTML = "";
    this.cards = [];

    loc.photos.forEach((photo, idx) => {
      const card = document.createElement("div");
      card.className = "scroll-photo-card";

      // Foto beresolusi optimal (ringan, ~150-200KB)
      const optSrc = getPhotoUrl(loc.folder, photo.file);

      card.innerHTML = `
        <div class="photo-frame-inner">
          <div class="photo-badge">✨ Moment ${idx + 1} / ${loc.photos.length}</div>
          <div class="photo-img-wrap">
            <img class="reel-photo-img" src="${optSrc}" alt="${photo.caption}" loading="lazy" />
            <div class="photo-tap-hint">🔍 Ketuk untuk memperbesar</div>
          </div>
          <div class="photo-caption-box">
            <p class="photo-caption-text">${photo.caption}</p>
          </div>
        </div>
      `;

      // Klik foto untuk membuka Fullscreen Lightbox
      const imgWrap = card.querySelector(".photo-img-wrap");
      imgWrap.addEventListener("click", () => {
        this.openLightbox(optSrc, photo.caption);
      });

      this.scrollReel.appendChild(card);
      this.cards.push(card);
    });
  }

  // Render Filmstrip Thumbnail di Bagian Bawah
  renderThumbnails(loc) {
    this.thumbStrip.innerHTML = "";

    loc.photos.forEach((photo, idx) => {
      const thumb = document.createElement("div");
      thumb.className = `reel-thumb-item ${idx === 0 ? "active" : ""}`;
      
      // Thumbnail sangat ringan (~30KB)
      const thumbSrc = getThumbUrl(loc.folder, photo.file);
      thumb.innerHTML = `<img src="${thumbSrc}" alt="thumb" loading="lazy" />`;

      thumb.addEventListener("click", () => {
        retroAudio.playButtonClick();
        this.scrollToIndex(idx, true);
      });

      this.thumbStrip.appendChild(thumb);
    });
  }

  handleReelScroll() {
    if (!this.scrollReel || this.cards.length === 0) return;

    const scrollLeft = this.scrollReel.scrollLeft;
    const cardWidth = this.cards[0].offsetWidth + 16; // 16px gap
    const newIndex = Math.round(scrollLeft / cardWidth);

    if (newIndex >= 0 && newIndex < this.cards.length && newIndex !== this.currentIndex) {
      this.currentIndex = newIndex;
      this.updateCounter(newIndex);
      this.syncActiveThumbnail(newIndex);
    }
  }

  scrollToIndex(index, smooth = true) {
    if (!this.cards[index]) return;
    this.currentIndex = index;
    const targetCard = this.cards[index];
    const offsetLeft = targetCard.offsetLeft - this.scrollReel.offsetLeft;

    this.scrollReel.scrollTo({
      left: offsetLeft,
      behavior: smooth ? "smooth" : "auto"
    });

    this.updateCounter(index);
    this.syncActiveThumbnail(index);
  }

  scrollStep(direction) {
    retroAudio.playButtonClick();
    const nextIndex = Math.max(0, Math.min(this.cards.length - 1, this.currentIndex + direction));
    this.scrollToIndex(nextIndex, true);
  }

  updateCounter(index) {
    if (!this.currentLocation) return;
    this.counterEl.textContent = `${index + 1} / ${this.currentLocation.photos.length}`;
  }

  syncActiveThumbnail(index) {
    const thumbs = this.thumbStrip.querySelectorAll(".reel-thumb-item");
    thumbs.forEach((t, i) => {
      if (i === index) {
        t.classList.add("active");
        t.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      } else {
        t.classList.remove("active");
      }
    });
  }

  // Lightbox Fullscreen
  openLightbox(src, caption) {
    retroAudio.playButtonClick();
    this.lightboxImg.src = src;
    this.lightboxCaption.textContent = caption;
    this.lightboxModal.classList.add("active");
  }

  closeLightbox() {
    this.lightboxModal.classList.remove("active");
    this.lightboxImg.src = "";
  }
}
