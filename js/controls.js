// Kontrol Input Retro: Virtual Joystick / D-Pad, Tombol Aksi [A] & Keyboard
// Dioptimalkan khusus untuk Android (Touch First, No Page Drag, Haptic Feedback)

import { retroAudio } from "./audio.js";

export class ControlsManager {
  constructor({ onMove, onAction }) {
    this.onMove = onMove;
    this.onAction = onAction;

    // Elemen D-Pad / Joystick
    this.dpadContainer = document.getElementById("virtual-dpad");
    this.dpadStick = document.getElementById("dpad-stick");
    this.btnAction = document.getElementById("btn-action-a");

    this.isDraggingDpad = false;
    this.dpadCenter = { x: 0, y: 0 };
    this.maxDpadRadius = 45; // Jangkauan maksimal thumb stick

    this.activeKeys = new Set();
    this.moveVector = { x: 0, y: 0 };

    this.initTouchControls();
    this.initKeyboardControls();
  }

  initTouchControls() {
    if (!this.dpadContainer || !this.btnAction) return;

    // 1. Virtual Joystick / D-Pad Touch Handlers
    const startDrag = (clientX, clientY) => {
      this.isDraggingDpad = true;
      const rect = this.dpadContainer.getBoundingClientRect();
      this.dpadCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      this.updateDpadPosition(clientX, clientY);
    };

    const moveDrag = (clientX, clientY) => {
      if (!this.isDraggingDpad) return;
      this.updateDpadPosition(clientX, clientY);
    };

    const endDrag = () => {
      if (!this.isDraggingDpad) return;
      this.isDraggingDpad = false;
      this.dpadStick.style.transform = `translate(0px, 0px)`;
      this.moveVector = { x: 0, y: 0 };
      if (this.onMove) this.onMove(0, 0);
    };

    // Pointer Events (Mendukung Touch HP Android & Mouse)
    this.dpadContainer.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
      this.dpadContainer.setPointerCapture(e.pointerId);
    });

    this.dpadContainer.addEventListener("pointermove", (e) => {
      if (this.isDraggingDpad) {
        e.preventDefault();
        moveDrag(e.clientX, e.clientY);
      }
    });

    const pointerUp = (e) => {
      if (this.isDraggingDpad) {
        e.preventDefault();
        endDrag();
      }
    };
    this.dpadContainer.addEventListener("pointerup", pointerUp);
    this.dpadContainer.addEventListener("pointercancel", pointerUp);

    // 2. Tombol Aksi [A] Retro
    const handleActionPress = (e) => {
      e.preventDefault();
      retroAudio.playButtonClick();

      // Haptic vibration feedback untuk Android
      if (navigator.vibrate) {
        navigator.vibrate([30]);
      }

      this.btnAction.classList.add("pressed");
      if (this.onAction) this.onAction();
    };

    const handleActionRelease = (e) => {
      e.preventDefault();
      this.btnAction.classList.remove("pressed");
    };

    this.btnAction.addEventListener("pointerdown", handleActionPress);
    this.btnAction.addEventListener("pointerup", handleActionRelease);
    this.btnAction.addEventListener("pointercancel", handleActionRelease);
  }

  updateDpadPosition(clientX, clientY) {
    const dx = clientX - this.dpadCenter.x;
    const dy = clientY - this.dpadCenter.y;
    const dist = Math.hypot(dx, dy);

    // Batasi gerakan stick visual
    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, this.maxDpadRadius);
    const stickX = Math.cos(angle) * clampedDist;
    const stickY = Math.sin(angle) * clampedDist;

    this.dpadStick.style.transform = `translate(${stickX}px, ${stickY}px)`;

    // Normalisasi vektor pergerakan
    if (dist > 8) {
      const vx = Math.cos(angle);
      const vy = Math.sin(angle);
      this.moveVector = { x: vx, y: vy };
      if (this.onMove) this.onMove(vx, vy);
    } else {
      this.moveVector = { x: 0, y: 0 };
      if (this.onMove) this.onMove(0, 0);
    }
  }

  initKeyboardControls() {
    window.addEventListener("keydown", (e) => {
      // Abaikan jika modal sedang terbuka atau input text aktif
      if (document.body.classList.contains("modal-open")) return;

      const key = e.key.toLowerCase();
      this.activeKeys.add(key);

      if (key === " " || key === "e" || key === "enter") {
        e.preventDefault();
        retroAudio.playButtonClick();
        if (this.onAction) this.onAction();
        return;
      }

      this.updateKeyboardMovement();
    });

    window.addEventListener("keyup", (e) => {
      const key = e.key.toLowerCase();
      this.activeKeys.delete(key);
      this.updateKeyboardMovement();
    });
  }

  updateKeyboardMovement() {
    let vx = 0;
    let vy = 0;

    if (this.activeKeys.has("arrowup") || this.activeKeys.has("w")) vy -= 1;
    if (this.activeKeys.has("arrowdown") || this.activeKeys.has("s")) vy += 1;
    if (this.activeKeys.has("arrowleft") || this.activeKeys.has("a")) vx -= 1;
    if (this.activeKeys.has("arrowright") || this.activeKeys.has("d")) vx += 1;

    // Normalisasi diagonal
    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    if (this.onMove) this.onMove(vx, vy);
  }

  // Tampilkan efek menyala pada tombol aksi saat dekat lokasi
  highlightActionButton(active, promptText = "") {
    if (!this.btnAction) return;
    if (active) {
      this.btnAction.classList.add("highlight");
    } else {
      this.btnAction.classList.remove("highlight");
    }
  }
}
