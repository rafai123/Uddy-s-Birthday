// 2D Canvas Game World: Landscape, Character Sprite, Camera & Location Pins
import { LOCATIONS_DATA, SECRET_AREA } from "./data.js";
import { storage } from "./storage.js";

export class GameWorld {
  constructor({ canvas, onNearLocation, onLeaveLocation }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.onNearLocation = onNearLocation;
    this.onLeaveLocation = onLeaveLocation;

    // World Dimensions (Virtual coordinates)
    this.worldWidth = 1050;
    this.worldHeight = 900;

    // Camera
    this.camera = { x: 0, y: 0 };

    // Player State
    this.player = {
      x: 480,
      y: 480,
      speed: 3.2,
      vx: 0,
      vy: 0,
      facing: "down", // down, up, left, right
      isMoving: false,
      frame: 0,
      animTimer: 0
    };

    // Ambient particles (sparkles, petals, fireflies)
    this.ambientParticles = [];
    this.initAmbientParticles(35);

    // Nearby location tracking
    this.currentNear = null;

    // Tick & animation
    this.tick = 0;
    this.isRunning = false;
    this.animationId = null;

    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initAmbientParticles(count) {
    this.ambientParticles = [];
    for (let i = 0; i < count; i++) {
      this.ambientParticles.push({
        x: Math.random() * this.worldWidth,
        y: Math.random() * this.worldHeight,
        vx: (Math.random() - 0.5) * 0.4 + 0.2,
        vy: Math.random() * 0.4 + 0.1,
        size: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * Math.PI * 2,
        type: Math.random() < 0.6 ? "petal" : "firefly"
      });
    }
  }

  start() {
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  setMovement(vx, vy) {
    this.player.vx = vx;
    this.player.vy = vy;

    if (vx !== 0 || vy !== 0) {
      this.player.isMoving = true;
      if (Math.abs(vx) > Math.abs(vy)) {
        this.player.facing = vx > 0 ? "right" : "left";
      } else {
        this.player.facing = vy > 0 ? "down" : "up";
      }
    } else {
      this.player.isMoving = false;
    }
  }

  walkTo(targetWorldX, targetWorldY) {
    const dx = targetWorldX - this.player.x;
    const dy = targetWorldY - this.player.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 8) {
      this.setMovement((dx / dist) * this.player.speed, (dy / dist) * this.player.speed);
    } else {
      this.setMovement(0, 0);
    }
  }

  // Convert Screen coordinates to World coordinates
  screenToWorld(screenX, screenY) {
    return {
      x: screenX + this.camera.x,
      y: screenY + this.camera.y
    };
  }

  update() {
    this.tick++;

    // Update Player Position
    if (this.player.isMoving) {
      this.player.x += this.player.vx;
      this.player.y += this.player.vy;

      // World boundaries
      this.player.x = Math.max(30, Math.min(this.worldWidth - 30, this.player.x));
      this.player.y = Math.max(30, Math.min(this.worldHeight - 30, this.player.y));

      // Animation frame update
      this.player.animTimer++;
      if (this.player.animTimer > 8) {
        this.player.animTimer = 0;
        this.player.frame = (this.player.frame + 1) % 4;
      }
    } else {
      this.player.frame = 0;
    }

    // Camera follow smoothly
    const targetCamX = this.player.x - this.canvas.width / 2;
    const targetCamY = this.player.y - this.canvas.height / 2;
    this.camera.x += (targetCamX - this.camera.x) * 0.1;
    this.camera.y += (targetCamY - this.camera.y) * 0.1;

    // Check Proximity to Locations
    this.checkProximity();

    // Update Ambient Particles
    this.ambientParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.05;

      if (p.x > this.worldWidth) p.x = 0;
      if (p.y > this.worldHeight) p.y = 0;
    });
  }

  checkProximity() {
    const interactRadius = 65;
    let found = null;

    // Check normal locations 1-5
    for (const loc of LOCATIONS_DATA) {
      const d = Math.hypot(this.player.x - loc.coords.x, this.player.y - loc.coords.y);
      if (d <= interactRadius) {
        found = { ...loc, type: "location" };
        break;
      }
    }

    // Check secret area
    if (!found) {
      const d = Math.hypot(this.player.x - SECRET_AREA.coords.x, this.player.y - SECRET_AREA.coords.y);
      if (d <= interactRadius + 15) {
        const isUnlocked = storage.isSecretUnlocked();
        found = { ...SECRET_AREA, type: "secret", locked: !isUnlocked };
      }
    }

    if (found && (!this.currentNear || this.currentNear.id !== found.id)) {
      this.currentNear = found;
      if (this.onNearLocation) this.onNearLocation(found);
    } else if (!found && this.currentNear) {
      this.currentNear = null;
      if (this.onLeaveLocation) this.onLeaveLocation();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    // Offset by camera
    this.ctx.translate(-this.camera.x, -this.camera.y);

    // 1. Draw World Background & Terrain
    this.drawTerrain();

    // 2. Draw Roads and Paths
    this.drawPaths();

    // 3. Draw Landmarks & Environmental Props
    this.drawLandmarks();

    // 4. Draw Location Beacons
    this.drawLocationPins();

    // 5. Draw Player Character
    this.drawPlayer();

    // 6. Draw Ambient Particles & Lighting
    this.drawAmbient();

    this.ctx.restore();
  }

  drawTerrain() {
    const ctx = this.ctx;

    // Base Grass Land
    const landGrad = ctx.createLinearGradient(0, 0, this.worldWidth, this.worldHeight);
    landGrad.addColorStop(0, "#2a623d");
    landGrad.addColorStop(0.5, "#3e8e41");
    landGrad.addColorStop(1, "#235c34");
    ctx.fillStyle = landGrad;
    ctx.fillRect(0, 0, this.worldWidth, this.worldHeight);

    // Water Body: Danau Toba (Top & Left corner)
    ctx.fillStyle = "#1e4e79";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(600, 0);
    ctx.bezierCurveTo(550, 180, 480, 240, 280, 260);
    ctx.bezierCurveTo(120, 280, 40, 360, 0, 480);
    ctx.closePath();
    ctx.fill();

    // Deep water layer
    ctx.fillStyle = "#163a5c";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(460, 0);
    ctx.bezierCurveTo(400, 140, 220, 190, 140, 200);
    ctx.bezierCurveTo(60, 210, 20, 280, 0, 340);
    ctx.closePath();
    ctx.fill();

    // Animated water ripples
    ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 8; i++) {
      const rx = 80 + (i * 55 + this.tick * 0.4) % 360;
      const ry = 60 + (i * 32) % 180;
      ctx.beginPath();
      ctx.ellipse(rx, ry, 18, 4, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Samosir Island (Inside Lake)
    ctx.fillStyle = "#4a8505";
    ctx.beginPath();
    ctx.ellipse(380, 310, 85, 55, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#8f9f30";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Wooden Pier / Jetty on Samosir
    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(340, 280, 38, 10);
    // Little Boat
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(330, 275);
    ctx.lineTo(345, 275);
    ctx.lineTo(340, 285);
    ctx.lineTo(325, 285);
    ctx.closePath();
    ctx.fill();

    // Pantai (Coast & Sand on East / Right)
    ctx.fillStyle = "#f3e5ab";
    ctx.beginPath();
    ctx.moveTo(this.worldWidth, 340);
    ctx.bezierCurveTo(680, 380, 640, 520, 720, 600);
    ctx.bezierCurveTo(800, 680, 880, 660, this.worldWidth, 680);
    ctx.closePath();
    ctx.fill();

    // Ocean on Far Right
    ctx.fillStyle = "#2980b9";
    ctx.beginPath();
    ctx.moveTo(this.worldWidth, 380);
    ctx.bezierCurveTo(740, 420, 700, 520, 780, 580);
    ctx.bezierCurveTo(850, 640, 920, 620, this.worldWidth, 640);
    ctx.closePath();
    ctx.fill();

    // Pantai Animated Foam / Waves
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 2;
    const waveOffset = Math.sin(this.tick * 0.05) * 6;
    ctx.beginPath();
    ctx.arc(760 + waveOffset, 480, 60, -0.4, 1.2);
    ctx.stroke();

    // Sinabung / Mountain Hills (Bottom-Left)
    this.drawMountain(240, 620, 110, 140, "#5a6268");
    this.drawMountain(340, 600, 90, 110, "#4e555b");
    this.drawMountain(170, 680, 120, 150, "#3f474d");

    // Tongging Cliff (Top-Right)
    ctx.fillStyle = "#6d5c48";
    ctx.beginPath();
    ctx.moveTo(700, 180);
    ctx.lineTo(840, 160);
    ctx.lineTo(860, 320);
    ctx.lineTo(720, 330);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#4a3c2c";
    ctx.beginPath();
    ctx.moveTo(700, 180);
    ctx.lineTo(720, 330);
    ctx.lineTo(710, 340);
    ctx.lineTo(690, 200);
    ctx.closePath();
    ctx.fill();

    // Meat Village (Bottom-Center Valley)
    // Rice terraces / green fields
    ctx.fillStyle = "#66bb6a";
    ctx.beginPath();
    ctx.ellipse(520, 650, 120, 75, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Secret Area: "Our Little Universe" (Floating Starry Summit at Top-Center)
    this.drawSecretSanctuary();
  }

  drawMountain(x, y, w, h, color) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y + h / 2);
    ctx.lineTo(x, y - h / 2);
    ctx.lineTo(x + w / 2, y + h / 2);
    ctx.closePath();
    ctx.fill();

    // Snow/Sky highlight on mountain tip
    ctx.fillStyle = "#e0e6ed";
    ctx.beginPath();
    ctx.moveTo(x, y - h / 2);
    ctx.lineTo(x - w * 0.16, y - h / 2 + h * 0.25);
    ctx.lineTo(x + w * 0.16, y - h / 2 + h * 0.25);
    ctx.closePath();
    ctx.fill();
  }

  drawSecretSanctuary() {
    const ctx = this.ctx;
    const x = SECRET_AREA.coords.x;
    const y = SECRET_AREA.coords.y;
    const isUnlocked = storage.isSecretUnlocked();

    // Floating island shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.beginPath();
    ctx.ellipse(x, y + 55, 95, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Floating celestial rock
    const grad = ctx.createRadialGradient(x, y, 10, x, y, 90);
    if (isUnlocked) {
      grad.addColorStop(0, "#ffe082");
      grad.addColorStop(0.4, "#ba68c8");
      grad.addColorStop(1, "#311b92");
    } else {
      grad.addColorStop(0, "#78909c");
      grad.addColorStop(0.7, "#37474f");
      grad.addColorStop(1, "#212121");
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, 90, 48, 0, 0, Math.PI * 2);
    ctx.fill();

    // Aura ring
    ctx.strokeStyle = isUnlocked ? "rgba(255, 215, 0, 0.75)" : "rgba(144, 164, 174, 0.4)";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(x, y, 68 + Math.sin(this.tick * 0.05) * 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Icon or Lock
    ctx.font = "24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(isUnlocked ? "🌌" : "🔒", x, y);

    // Label
    ctx.fillStyle = isUnlocked ? "#fff9c4" : "#b0bec5";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText(isUnlocked ? "Our Little Universe (Terbuka!)" : "Our Little Universe (Rahasia)", x, y + 30);
  }

  drawPaths() {
    const ctx = this.ctx;
    ctx.strokeStyle = "#c8ad7f";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    // Central crossroad
    ctx.moveTo(480, 480);
    // Path to Samosir Pier
    ctx.bezierCurveTo(450, 420, 400, 360, 380, 335);
    // Path to Sinabung
    ctx.moveTo(480, 480);
    ctx.bezierCurveTo(420, 500, 350, 520, 300, 560);
    // Path to Pantai
    ctx.moveTo(480, 480);
    ctx.bezierCurveTo(560, 490, 620, 470, 700, 460);
    // Path to Meat
    ctx.moveTo(480, 480);
    ctx.bezierCurveTo(500, 530, 510, 580, 520, 640);
    // Path to Tongging
    ctx.moveTo(480, 480);
    ctx.bezierCurveTo(560, 400, 680, 340, 760, 260);
    // Path towards Secret Summit
    ctx.moveTo(480, 480);
    ctx.bezierCurveTo(480, 340, 490, 260, 500, 210);

    ctx.stroke();

    // Road dashed center
    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawLandmarks() {
    const ctx = this.ctx;

    // Small village huts in Meat
    this.drawHut(480, 630);
    this.drawHut(550, 620);
    this.drawHut(530, 670);

    // Decorative Trees
    const trees = [
      { x: 420, y: 520 }, { x: 440, y: 540 }, { x: 580, y: 530 },
      { x: 620, y: 430 }, { x: 660, y: 390 }, { x: 310, y: 440 },
      { x: 340, y: 480 }, { x: 460, y: 380 }, { x: 520, y: 360 },
      { x: 740, y: 330 }, { x: 780, y: 350 }, { x: 260, y: 500 }
    ];
    trees.forEach((t) => this.drawTree(t.x, t.y));
  }

  drawHut(x, y) {
    const ctx = this.ctx;
    // Base
    ctx.fillStyle = "#8d6e63";
    ctx.fillRect(x - 12, y - 10, 24, 18);
    // Door
    ctx.fillStyle = "#4e342e";
    ctx.fillRect(x - 4, y - 1, 8, 9);
    // Roof
    ctx.fillStyle = "#d32f2f";
    ctx.beginPath();
    ctx.moveTo(x - 16, y - 10);
    ctx.lineTo(x, y - 22);
    ctx.lineTo(x + 16, y - 10);
    ctx.closePath();
    ctx.fill();
  }

  drawTree(x, y) {
    const ctx = this.ctx;
    // Trunk
    ctx.fillStyle = "#5d4037";
    ctx.fillRect(x - 3, y - 4, 6, 14);
    // Leaves (Puffy layers)
    ctx.fillStyle = "#2e7d32";
    ctx.beginPath();
    ctx.arc(x, y - 12, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#388e3c";
    ctx.beginPath();
    ctx.arc(x - 4, y - 15, 10, 0, Math.PI * 2);
    ctx.arc(x + 4, y - 15, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  drawLocationPins() {
    const ctx = this.ctx;

    LOCATIONS_DATA.forEach((loc) => {
      const x = loc.coords.x;
      const y = loc.coords.y;
      const isUnlocked = storage.isLocationUnlocked(loc.id);
      const isNear = this.currentNear && this.currentNear.id === loc.id;
      const bounce = Math.sin(this.tick * 0.08 + loc.id) * 4;

      // Glow Halo
      ctx.fillStyle = isNear ? "rgba(255, 235, 59, 0.45)" : isUnlocked ? "rgba(76, 175, 80, 0.35)" : "rgba(239, 68, 68, 0.3)";
      ctx.beginPath();
      ctx.arc(x, y + 8, isNear ? 28 : 22, 0, Math.PI * 2);
      ctx.fill();

      // Pin Shape
      ctx.save();
      ctx.translate(x, y + bounce);

      ctx.fillStyle = isUnlocked ? "#10b981" : "#ef4444";
      ctx.beginPath();
      ctx.arc(0, -18, 14, 0, Math.PI * 2);
      ctx.moveTo(-10, -14);
      ctx.lineTo(0, 4);
      ctx.lineTo(10, -14);
      ctx.fill();

      // Inner Badge Number
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(loc.id.toString(), 0, -18);

      // Label below
      ctx.font = "bold 11px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 4;
      ctx.fillText(loc.name, 0, 16);
      ctx.restore();
    });
  }

  // Draw Cute Female Character (Pixel Style)
  drawPlayer() {
    const ctx = this.ctx;
    const x = this.player.x;
    const y = this.player.y;
    const frame = this.player.frame;
    const facing = this.player.facing;

    ctx.save();
    ctx.translate(x, y);

    // Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
    ctx.beginPath();
    ctx.ellipse(0, 15, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bobbing effect when moving
    const bob = this.player.isMoving ? Math.sin(this.tick * 0.4) * 2 : 0;
    const legOffset = this.player.isMoving ? (frame % 2 === 0 ? 3 : -3) : 0;

    // Legs / Shoes (White boots)
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(-6 + legOffset, 10 + bob, 4, 6);
    ctx.fillRect(2 - legOffset, 10 + bob, 4, 6);

    // Cute Outfit (Pink/Coral Dress)
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.moveTo(-7, 2 + bob);
    ctx.lineTo(7, 2 + bob);
    ctx.lineTo(10, 11 + bob);
    ctx.lineTo(-10, 11 + bob);
    ctx.closePath();
    ctx.fill();

    // Belt / Ribbon
    ctx.fillStyle = "#fda4af";
    ctx.fillRect(-7, 4 + bob, 14, 2);

    // Face / Skin (Warm peach)
    ctx.fillStyle = "#ffe4c4";
    ctx.beginPath();
    ctx.arc(0, -6 + bob, 8.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (based on direction)
    ctx.fillStyle = "#331800";
    if (facing === "down") {
      ctx.fillRect(-3, -7 + bob, 2, 3);
      ctx.fillRect(2, -7 + bob, 2, 3);
      // Blush
      ctx.fillStyle = "rgba(244, 63, 94, 0.5)";
      ctx.fillRect(-5, -4 + bob, 2, 2);
      ctx.fillRect(4, -4 + bob, 2, 2);
    } else if (facing === "left") {
      ctx.fillRect(-5, -7 + bob, 2, 3);
    } else if (facing === "right") {
      ctx.fillRect(3, -7 + bob, 2, 3);
    } // "up" shows back of head

    // Hair (Warm Brown twin buns / stylish hair)
    ctx.fillStyle = "#6d4c41";
    // Hair base
    ctx.beginPath();
    ctx.arc(0, -9 + bob, 8.5, Math.PI, Math.PI * 2);
    ctx.fill();

    if (facing === "up") {
      // Full back hair
      ctx.beginPath();
      ctx.arc(0, -7 + bob, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    // Twin Buns
    ctx.beginPath();
    ctx.arc(-8, -13 + bob, 4.5, 0, Math.PI * 2);
    ctx.arc(8, -13 + bob, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Cute Ribbons on buns
    ctx.fillStyle = "#f43f5e";
    ctx.fillRect(-10, -12 + bob, 4, 3);
    ctx.fillRect(6, -12 + bob, 4, 3);

    ctx.restore();
  }

  drawAmbient() {
    const ctx = this.ctx;

    this.ambientParticles.forEach((p) => {
      ctx.save();
      const alpha = Math.sin(p.pulse) * 0.3 + 0.5;
      ctx.globalAlpha = Math.max(0.1, Math.min(0.9, alpha));

      if (p.type === "firefly") {
        ctx.fillStyle = "#fff59d";
        ctx.shadowColor = "#fbc02d";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Floating Pink Rose Petals
        ctx.fillStyle = "#f472b6";
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * 1.5, p.size * 0.8, p.pulse, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.loop());
  }
}
