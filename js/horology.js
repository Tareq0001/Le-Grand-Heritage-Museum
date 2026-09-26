// Royal Horological Escapement Simulator
// Accurate deadbeat anchor escapement with swinging pendulum and audible tick-tock

class RoyalHorology {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.wheelTeeth = 30;
    this.wheelAngle = 0;
    this.pendulumAngle = 0;
    this.pendulumMaxAngle = 0.12; // radians
    this.time = 0;
    this.lastTickSign = 1;

    this.running = true;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
    this.cx = this.width / 2;
    this.wheelCy = this.height * 0.45;
    this.anchorCy = this.height * 0.22;
  }

  animate() {
    if (!this.running) return;

    this.time += 0.04;
    // Harmonic oscillation of pendulum
    const prevPendulumAngle = this.pendulumAngle;
    this.pendulumAngle = Math.sin(this.time * 2.5) * this.pendulumMaxAngle;

    // Detect zero-crossing for escapement tick
    const currentSign = Math.sign(this.pendulumAngle);
    if (currentSign !== this.lastTickSign && currentSign !== 0) {
      this.lastTickSign = currentSign;
      this.wheelAngle += (Math.PI * 2) / (this.wheelTeeth * 2);
      if (window.HeritageAudio) {
        window.HeritageAudio.playTick(currentSign > 0);
      }
    }

    this.render();
    requestAnimationFrame(() => this.animate());
  }

  render() {
    const { ctx, width, height, cx, wheelCy, anchorCy } = this;
    ctx.clearRect(0, 0, width, height);

    // 1. Dark Oak Clock Case Background
    ctx.fillStyle = '#140e0a';
    ctx.fillRect(0, 0, width, height);

    // 2. Brass Escape Wheel (عجلة الميزان المسننة المذهبة)
    const wheelRadius = Math.min(width, height) * 0.26;
    ctx.save();
    ctx.translate(cx, wheelCy);
    ctx.rotate(this.wheelAngle);

    // Escape Wheel Teeth (Deadbeat Ratchet profile)
    ctx.fillStyle = '#c59b27';
    ctx.strokeStyle = '#5a420e';
    ctx.lineWidth = 1.5;

    for (let i = 0; i < this.wheelTeeth; i++) {
      const angle = (i * Math.PI * 2) / this.wheelTeeth;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(wheelRadius * 0.8, -4);
      ctx.lineTo(wheelRadius, -2);
      ctx.lineTo(wheelRadius * 0.95, 6);
      ctx.lineTo(wheelRadius * 0.78, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Inner Cutouts & Spokes (Four Baroque Arms)
    ctx.beginPath();
    ctx.arc(0, 0, wheelRadius * 0.8, 0, Math.PI * 2);
    ctx.stroke();

    for (let j = 0; j < 4; j++) {
      ctx.save();
      ctx.rotate((j * Math.PI) / 2);
      ctx.fillStyle = '#9e7225';
      ctx.fillRect(-4, -wheelRadius * 0.8, 8, wheelRadius * 1.6);
      ctx.restore();
    }

    // Central Brass Arbor
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#fae19c';
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 3. Blued Steel Anchor & Pallets (مرساة التعشيق بالفولاذ الأزرق)
    ctx.save();
    ctx.translate(cx, anchorCy);
    ctx.rotate(this.pendulumAngle * 0.8);

    // Anchor Crossbar in Blued Steel
    ctx.fillStyle = '#1d3557';
    ctx.strokeStyle = '#457b9d';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Left Pallet Arm
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.quadraticCurveTo(-wheelRadius * 0.7, -10, -wheelRadius * 0.85, wheelRadius * 0.45);
    ctx.lineTo(-wheelRadius * 0.78, wheelRadius * 0.48);
    ctx.quadraticCurveTo(-wheelRadius * 0.6, 0, 0, 0);
    ctx.fill();
    ctx.stroke();

    // Right Pallet Arm
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.quadraticCurveTo(wheelRadius * 0.7, -10, wheelRadius * 0.85, wheelRadius * 0.45);
    ctx.lineTo(wheelRadius * 0.78, wheelRadius * 0.48);
    ctx.quadraticCurveTo(wheelRadius * 0.6, 0, 0, 0);
    ctx.fill();
    ctx.stroke();

    // 4. Swinging Pendulum Rod & Polished Brass Bob (بندول الساعة)
    const pendulumLen = height * 0.68;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, pendulumLen);
    ctx.strokeStyle = '#c59b27';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Polished Brass Bob
    ctx.beginPath();
    ctx.arc(0, pendulumLen, 24, 0, Math.PI * 2);
    const bobGrad = ctx.createRadialGradient(-6, pendulumLen - 6, 2, 0, pendulumLen, 24);
    bobGrad.addColorStop(0, '#fff4cc');
    bobGrad.addColorStop(0.5, '#c59b27');
    bobGrad.addColorStop(1, '#5a420e');
    ctx.fillStyle = bobGrad;
    ctx.fill();
    ctx.strokeStyle = '#3a2707';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }
}

window.RoyalHorology = RoyalHorology;
