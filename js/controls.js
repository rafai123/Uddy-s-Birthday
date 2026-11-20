// Input Controller: Virtual Joystick, Action Button 'A', Keyboard WASD/Arrows, and Tap-to-Walk
export class ControlsController {
  constructor({ gameWorld, onAction }) {
    this.gameWorld = gameWorld;
    this.onAction = onAction;

    this.joystickZone = document.getElementById("joystick-zone");
    this.joystickThumb = document.getElementById("joystick-thumb");
    this.btnActionA = document.getElementById("btn-action-a");

    this.joystickActive = false;
    this.touchId = null;
    this.originX = 0;
    this.originY = 0;
    this.maxRadius = 45;

    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    this.targetWalkPoint = null;
    this.walkInterval = null;

    this.init();
  }

  init() {
    this.bindJoystick();
    this.bindKeyboard();
    this.bindTapToWalk();
    this.bindActionButton();
  }

  bindJoystick() {
    if (!this.joystickZone) return;

    const handleStart = (clientX, clientY, identifier) => {
      this.joystickActive = true;
      this.touchId = identifier;
      const rect = this.joystickZone.getBoundingClientRect();
      this.originX = rect.left + rect.width / 2;
      this.originY = rect.top + rect.height / 2;
      this.handleMove(clientX, clientY);
      this.stopTapWalk();
    };

    const handleMove = (clientX, clientY) => {
      if (!this.joystickActive) return;
      const dx = clientX - this.originX;
      const dy = clientY - this.originY;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      const clampedDist = Math.min(this.maxRadius, dist);
      const thumbX = Math.cos(angle) * clampedDist;
      const thumbY = Math.sin(angle) * clampedDist;

      this.joystickThumb.style.transform = `translate(${thumbX}px, ${thumbY}px)`;

      // Normalize speed
      const intensity = clampedDist / this.maxRadius;
      const vx = Math.cos(angle) * (this.gameWorld.player.speed * intensity);
      const vy = Math.sin(angle) * (this.gameWorld.player.speed * intensity);
      this.gameWorld.setMovement(vx, vy);
    };

    const handleEnd = () => {
      this.joystickActive = false;
      this.touchId = null;
      this.joystickThumb.style.transform = `translate(0px, 0px)`;
      if (!this.hasActiveKeyboard()) {
        this.gameWorld.setMovement(0, 0);
      }
    };

    this.handleMove = handleMove;

    // Touch Events
    this.joystickZone.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      handleStart(touch.clientX, touch.clientY, touch.identifier);
    }, { passive: false });

    window.addEventListener("touchmove", (e) => {
      if (!this.joystickActive) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.touchId) {
          handleMove(touch.clientX, touch.clientY);
          break;
        }
      }
    });

    window.addEventListener("touchend", (e) => {
      if (!this.joystickActive) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.touchId) {
          handleEnd();
          break;
        }
      }
    });

    // Mouse Fallback for testing joystick on desktop
    this.joystickZone.addEventListener("mousedown", (e) => {
      handleStart(e.clientX, e.clientY, "mouse");
      const onMouseMove = (ev) => handleMove(ev.clientX, ev.clientY);
      const onMouseUp = () => {
        handleEnd();
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    });
  }

  bindKeyboard() {
    window.addEventListener("keydown", (e) => {
      const code = e.code;
      if (["KeyW", "ArrowUp"].includes(code)) this.keys.up = true;
      if (["KeyS", "ArrowDown"].includes(code)) this.keys.down = true;
      if (["KeyA", "ArrowLeft"].includes(code)) this.keys.left = true;
      if (["KeyD", "ArrowRight"].includes(code)) this.keys.right = true;

      if (["Space", "KeyE", "Enter"].includes(code)) {
        if (this.onAction) this.onAction();
      }

      this.updateKeyboardMovement();
    });

    window.addEventListener("keyup", (e) => {
      const code = e.code;
      if (["KeyW", "ArrowUp"].includes(code)) this.keys.up = false;
      if (["KeyS", "ArrowDown"].includes(code)) this.keys.down = false;
      if (["KeyA", "ArrowLeft"].includes(code)) this.keys.left = false;
      if (["KeyD", "ArrowRight"].includes(code)) this.keys.right = false;

      this.updateKeyboardMovement();
    });
  }

  hasActiveKeyboard() {
    return this.keys.up || this.keys.down || this.keys.left || this.keys.right;
  }

  updateKeyboardMovement() {
    if (this.joystickActive) return;

    let vx = 0;
    let vy = 0;
    const speed = this.gameWorld.player.speed;

    if (this.keys.up) vy -= speed;
    if (this.keys.down) vy += speed;
    if (this.keys.left) vx -= speed;
    if (this.keys.right) vx += speed;

    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    if (vx !== 0 || vy !== 0) {
      this.stopTapWalk();
      this.gameWorld.setMovement(vx, vy);
    } else {
      this.gameWorld.setMovement(0, 0);
    }
  }

  bindTapToWalk() {
    const canvas = this.gameWorld.canvas;
    canvas.addEventListener("pointerdown", (e) => {
      // Don't trigger if interacting with UI overlay
      if (e.target !== canvas) return;

      const worldPos = this.gameWorld.screenToWorld(e.clientX, e.clientY);
      this.startTapWalk(worldPos.x, worldPos.y);
    });
  }

  startTapWalk(targetX, targetY) {
    this.targetWalkPoint = { x: targetX, y: targetY };
    this.stopTapWalk();

    this.walkInterval = setInterval(() => {
      if (!this.targetWalkPoint) {
        this.stopTapWalk();
        return;
      }
      const dx = this.targetWalkPoint.x - this.gameWorld.player.x;
      const dy = this.targetWalkPoint.y - this.gameWorld.player.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 10) {
        this.gameWorld.setMovement(0, 0);
        this.stopTapWalk();
      } else {
        this.gameWorld.walkTo(this.targetWalkPoint.x, this.targetWalkPoint.y);
      }
    }, 1000 / 60);
  }

  stopTapWalk() {
    if (this.walkInterval) {
      clearInterval(this.walkInterval);
      this.walkInterval = null;
    }
  }

  bindActionButton() {
    if (!this.btnActionA) return;
    this.btnActionA.addEventListener("click", () => {
      if (this.onAction) this.onAction();
    });
  }

  setActionButtonHighlight(active) {
    if (!this.btnActionA) return;
    if (active) {
      this.btnActionA.classList.add("pulse-glow");
    } else {
      this.btnActionA.classList.remove("pulse-glow");
    }
  }
}
