// Royal Celestial Astrolabe Simulator
// An authentic, interactive 16th-century brass astrolabe

class RoyalAstrolabe {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.angle = 0.45; // Rotation of rete in radians
    this.isDragging = false;
    this.lastMouseAngle = 0;
    
    this.plateLatitude = 37.88; // Default: Cordoba / Seville (الأندلس)
    
    // Classical Stars on Rete
    this.stars = [
      { name: 'Sirius / الشعرى اليمانية', ra: 101.28, dec: -16.71, mag: 1.4 },
      { name: 'Vega / النسر الواقع', ra: 279.23, dec: 38.78, mag: 1.2 },
      { name: 'Aldebaran / الدبران', ra: 68.98, dec: 16.51, mag: 1.3 },
      { name: 'Rigel / رجل الجوزاء', ra: 78.63, dec: -8.20, mag: 1.3 },
      { name: 'Arcturus / السماك الرامح', ra: 213.91, dec: 19.18, mag: 1.2 },
      { name: 'Antares / قلب العقرب', ra: 247.35, dec: -26.43, mag: 1.4 },
      { name: 'Altair / النسر الطائر', ra: 297.69, dec: 8.87, mag: 1.3 },
      { name: 'Spica / السماك الأعزل', ra: 201.29, dec: -11.16, mag: 1.3 }
    ];

    this.zodiacSigns = [
      'Aries / الحمل', 'Taurus / الثور', 'Gemini / الجوزاء', 'Cancer / السرطان',
      'Leo / الأسد', 'Virgo / العذراء', 'Libra / الميزان', 'Scorpio / العقرب',
      'Sagittarius / القوس', 'Capricorn / الجدي', 'Aquarius / الدلو', 'Pisces / الحوت'
    ];

    this.initEvents();
    this.resize();
    this.render();
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
    this.cy = this.height / 2;
    this.radius = Math.min(this.cx, this.cy) - 20;
  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.render();
    });

    const getAngleFromEvent = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left - rect.width / 2;
      const y = clientY - rect.top - rect.height / 2;
      return Math.atan2(y, x);
    };

    const startDrag = (e) => {
      this.isDragging = true;
      this.lastMouseAngle = getAngleFromEvent(e);
      if (window.HeritageAudio) window.HeritageAudio.playParchmentRustle();
    };

    const doDrag = (e) => {
      if (!this.isDragging) return;
      const currentAngle = getAngleFromEvent(e);
      const delta = currentAngle - this.lastMouseAngle;
      this.angle += delta;
      this.lastMouseAngle = currentAngle;
      this.render();
      this.updateReadout();
    };

    const stopDrag = () => {
      this.isDragging = false;
    };

    this.canvas.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', doDrag);
    window.addEventListener('mouseup', stopDrag);

    this.canvas.addEventListener('touchstart', startDrag, { passive: true });
    window.addEventListener('touchmove', doDrag, { passive: true });
    window.addEventListener('touchend', stopDrag);
  }

  setLatitude(lat) {
    this.plateLatitude = lat;
    this.render();
    this.updateReadout();
  }

  updateReadout() {
    const degAngle = ((this.angle * 180 / Math.PI) % 360 + 360) % 360;
    const zodiacIndex = Math.floor(degAngle / 30) % 12;
    const zodiacName = this.zodiacSigns[zodiacIndex];
    const solarAlt = Math.round(Math.abs(Math.sin(this.angle)) * (90 - this.plateLatitude));

    const elZodiac = document.getElementById('readout-zodiac');
    const elAlt = document.getElementById('readout-solar-alt');
    const elSidereal = document.getElementById('readout-sidereal');

    if (elZodiac) elZodiac.textContent = zodiacName;
    if (elAlt) elAlt.textContent = `${solarAlt}° N`;
    if (elSidereal) {
      const hours = Math.floor(degAngle / 15);
      const mins = Math.floor((degAngle % 15) * 4);
      elSidereal.textContent = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} h`;
    }
  }

  render() {
    const { ctx, cx, cy, radius } = this;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Brass Mater (Outer Ring)
    const brassGrad = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius);
    brassGrad.addColorStop(0, '#be9440');
    brassGrad.addColorStop(0.85, '#997328');
    brassGrad.addColorStop(1, '#533b0e');

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = brassGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.restore();

    // 2. Engraved Degree Ring (Limb)
    ctx.save();
    ctx.strokeStyle = '#3d2a09';
    ctx.lineWidth = 1.5;
    for (let deg = 0; deg < 360; deg += 5) {
      const rad = (deg * Math.PI) / 180;
      const isMajor = deg % 30 === 0;
      const len = isMajor ? 14 : 7;
      const x1 = cx + Math.cos(rad) * (radius - 2);
      const y1 = cy + Math.sin(rad) * (radius - 2);
      const x2 = cx + Math.cos(rad) * (radius - 2 - len);
      const y2 = cy + Math.sin(rad) * (radius - 2 - len);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      if (isMajor) {
        ctx.fillStyle = '#2d1f06';
        ctx.font = '10px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const tx = cx + Math.cos(rad) * (radius - 24);
        const ty = cy + Math.sin(rad) * (radius - 24);
        ctx.fillText(deg.toString(), tx, ty);
      }
    }
    ctx.restore();

    // 3. Inner Plate (Tympan / Safiha)
    const plateRadius = radius - 36;
    const plateGrad = ctx.createRadialGradient(cx, cy, plateRadius * 0.2, cx, cy, plateRadius);
    plateGrad.addColorStop(0, '#eedbb5');
    plateGrad.addColorStop(1, '#caa769');

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, plateRadius, 0, Math.PI * 2);
    ctx.fillStyle = plateGrad;
    ctx.fill();
    ctx.strokeStyle = '#5a4214';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Almucantars (Altitude circles for given latitude)
    ctx.strokeStyle = 'rgba(88, 62, 18, 0.45)';
    ctx.lineWidth = 1;
    for (let alt = 10; alt <= 80; alt += 10) {
      const altRadius = plateRadius * (1 - alt / 95);
      const offsetY = (alt / 90) * 35;
      ctx.beginPath();
      ctx.arc(cx, cy - offsetY, altRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Horizon Arc & Meridian line
    ctx.beginPath();
    ctx.moveTo(cx, cy - plateRadius);
    ctx.lineTo(cx, cy + plateRadius);
    ctx.moveTo(cx - plateRadius, cy);
    ctx.lineTo(cx + plateRadius, cy);
    ctx.stroke();
    ctx.restore();

    // 4. The Rete (الهندام / الشبكة - Rotatable Star Web)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.angle);

    // Ecliptic Circle (حلقة البروج)
    const eclipticRadius = plateRadius * 0.58;
    const eclipticOffset = plateRadius * 0.22;
    ctx.beginPath();
    ctx.arc(0, eclipticOffset, eclipticRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#6e4f16';
    ctx.lineWidth = 16;
    ctx.stroke();

    ctx.strokeStyle = '#fae4a8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Arabesque Filigree Bars on Rete
    ctx.strokeStyle = '#85611f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, plateRadius * 0.85, 0.3, Math.PI - 0.3);
    ctx.arc(0, 0, plateRadius * 0.85, Math.PI + 0.3, -0.3);
    ctx.stroke();

    // Star Pointers (شظايا النجوم)
    this.stars.forEach((star, index) => {
      const starAngle = (star.ra * Math.PI) / 180;
      const dist = (plateRadius * 0.45) + ((star.dec + 40) / 80) * (plateRadius * 0.4);
      const sx = Math.cos(starAngle) * dist;
      const sy = Math.sin(starAngle) * dist;

      // Pointer dagger
      ctx.beginPath();
      ctx.moveTo(sx * 0.85, sy * 0.85);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = '#4a340b';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Golden Star dot
      ctx.beginPath();
      ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffec9e';
      ctx.shadowColor = '#d4af37';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.strokeStyle = '#4a340b';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Star Latin/Arabic label
      ctx.fillStyle = '#261b07';
      ctx.font = 'bold 9px serif';
      ctx.fillText(star.name.split('/')[0].trim(), sx + 6, sy + 3);
    });

    ctx.restore();

    // 5. Central Brass Pin & Rule (الفرس والمحور)
    ctx.save();
    ctx.translate(cx, cy);
    // Pivoting rule
    ctx.rotate(this.angle * 0.5);
    ctx.fillStyle = '#b38830';
    ctx.fillRect(-6, -plateRadius, 12, plateRadius * 2);
    ctx.strokeStyle = '#4a340b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-6, -plateRadius, 12, plateRadius * 2);

    // Horse wedge / Pin
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#d4af37';
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#261b07';
    ctx.fill();
    ctx.restore();
  }
}

window.RoyalAstrolabe = RoyalAstrolabe;
