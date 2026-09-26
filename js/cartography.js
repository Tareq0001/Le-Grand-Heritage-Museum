// Royal Maritime Cartography Engine
// Portolan sea chart with radiating rhumb lines, compass rose, and historical expeditions

class RoyalSeaChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.voyages = {
      ibn_battuta: {
        title: 'رحلة شمس الدين ابن بطوطة (1325 - 1354م)',
        subtitle: 'The Great Journey across North Africa, Arabia, India & Cathay',
        origin: 'طنجة (Morocco)',
        color: '#c99a3e',
        waypoints: [
          { x: 0.18, y: 0.38, name: 'طنجة' },
          { x: 0.28, y: 0.40, name: 'الإسكندرية' },
          { x: 0.35, y: 0.48, name: 'مكة المكرمة' },
          { x: 0.46, y: 0.52, name: 'دلهي' },
          { x: 0.62, y: 0.60, name: 'كيرلا' },
          { x: 0.78, y: 0.45, name: 'خانبالق (بكين)' }
        ],
        log: 'خرجتُ من طنجة مسقط رأسي معتمداً على الله، لا رفيق يؤنسني، ولا قافلة أكون في جملتها... قطعتُ أزيد من 117 ألف كيلومتر في ثلاثين عاماً لم يسبقني إليها رحالة في تاريخ البشرية.'
      },
      cook: {
        title: 'رحلة الكابتن جيمس كوك على متن إنديفور (1768 - 1771م)',
        subtitle: 'First Royal Navy Voyage of HMS Endeavour across the Pacific',
        origin: 'Plymouth, England',
        color: '#2a5d8f',
        waypoints: [
          { x: 0.20, y: 0.28, name: 'Plymouth' },
          { x: 0.24, y: 0.45, name: 'Madeira' },
          { x: 0.30, y: 0.75, name: 'Cape Horn' },
          { x: 0.65, y: 0.68, name: 'Tahiti' },
          { x: 0.76, y: 0.78, name: 'New Zealand' },
          { x: 0.82, y: 0.68, name: 'Botany Bay' }
        ],
        log: 'Commissioned by King George III and the Royal Society to observe the Transit of Venus and explore the uncharted southern continent Terra Australis Incognita.'
      },
      laperouse: {
        title: 'بعثة لا بيروز الفرنسية حول العالم (1785 - 1788م)',
        subtitle: 'L\'Expédition Royale de Jean-François de La Pérouse',
        origin: 'Brest, France',
        color: '#8b1e22',
        waypoints: [
          { x: 0.21, y: 0.30, name: 'Brest' },
          { x: 0.32, y: 0.76, name: 'Terre de Feu' },
          { x: 0.50, y: 0.48, name: 'Île de Pâques' },
          { x: 0.55, y: 0.38, name: 'Hawaï' },
          { x: 0.80, y: 0.30, name: 'Kamtchatka' },
          { x: 0.86, y: 0.70, name: 'Vanikoro' }
        ],
        log: 'Ordonnée par le Roi Louis XVI avec les frégates La Boussole et L\'Astrolabe pour compléter les découvertes de Cook et cartographier les confins du Pacifique.'
      }
    };

    this.activeVoyageKey = 'ibn_battuta';
    this.animationProgress = 1;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
      this.render();
    });
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
  }

  selectVoyage(key) {
    if (!this.voyages[key]) return;
    this.activeVoyageKey = key;
    this.updateCard();
    if (window.HeritageAudio) window.HeritageAudio.playParchmentRustle();
    this.animateVoyage();
  }

  animateVoyage() {
    this.animationProgress = 0;
    const animate = () => {
      this.animationProgress += 0.035;
      if (this.animationProgress > 1) this.animationProgress = 1;
      this.render();
      if (this.animationProgress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

  updateCard() {
    const data = this.voyages[this.activeVoyageKey];
    const elTitle = document.getElementById('voyage-card-title');
    const elSub = document.getElementById('voyage-card-subtitle');
    const elLog = document.getElementById('voyage-card-log');

    if (elTitle) elTitle.textContent = data.title;
    if (elSub) elSub.textContent = data.subtitle;
    if (elLog) elLog.textContent = `« ${data.log} »`;
  }

  render() {
    const { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);

    // 1. Classical Parchment Background with Vignette
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, width * 0.2, width / 2, height / 2, width * 0.7);
    bgGrad.addColorStop(0, '#fbf5e6');
    bgGrad.addColorStop(1, '#e3d2b2');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Classical Radiating Rhumb Lines (خطوط اتجاهات الرياح البحرية)
    ctx.save();
    ctx.strokeStyle = 'rgba(180, 150, 100, 0.25)';
    ctx.lineWidth = 0.8;
    const centers = [
      { x: width * 0.3, y: height * 0.4 },
      { x: width * 0.7, y: height * 0.6 }
    ];

    centers.forEach(center => {
      for (let i = 0; i < 32; i++) {
        const rad = (i * Math.PI * 2) / 32;
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(center.x + Math.cos(rad) * width, center.y + Math.sin(rad) * width);
        ctx.stroke();
      }
    });
    ctx.restore();

    // 3. Compass Rose (وردة الرياح المذهبة)
    this.drawCompassRose(width * 0.15, height * 0.75, 45);

    // 4. Draw Active Expedition Route
    const voyage = this.voyages[this.activeVoyageKey];
    if (voyage) {
      const pts = voyage.waypoints.map(wp => ({
        x: wp.x * width,
        y: wp.y * height,
        name: wp.name
      }));

      // Golden Track Path
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);

      const totalSegments = pts.length - 1;
      const currentSegment = this.animationProgress * totalSegments;
      const completedSegments = Math.floor(currentSegment);

      for (let i = 1; i <= completedSegments; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }

      if (completedSegments < totalSegments) {
        const frac = currentSegment - completedSegments;
        const p1 = pts[completedSegments];
        const p2 = pts[completedSegments + 1];
        const cx = p1.x + (p2.x - p1.x) * frac;
        const cy = p1.y + (p2.y - p1.y) * frac;
        ctx.lineTo(cx, cy);
      }

      ctx.strokeStyle = voyage.color;
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.restore();

      // Waypoint Pins & Callouts
      pts.forEach((pt, idx) => {
        if (idx <= completedSegments) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#fffaea';
          ctx.fill();
          ctx.strokeStyle = voyage.color;
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.fillStyle = '#1c150e';
          ctx.font = 'bold 12px serif';
          ctx.fillText(pt.name, pt.x + 8, pt.y - 6);
        }
      });
    }
  }

  drawCompassRose(cx, cy, radius) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(cx, cy);

    // Outer brass rings
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#8c6820';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 8 Cardinal Points (Fleur-de-lis styling)
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const isMajor = i % 2 === 0;
      const len = isMajor ? radius * 0.95 : radius * 0.7;

      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-5, -len * 0.3);
      ctx.lineTo(0, -len);
      ctx.fillStyle = i === 0 ? '#8b1e22' : '#c99a3e'; // North is Red
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(5, -len * 0.3);
      ctx.lineTo(0, -len);
      ctx.fillStyle = '#3a2709';
      ctx.fill();
      ctx.restore();
    }

    // North Indicator Symbol (⚜ Fleur-de-lis)
    ctx.fillStyle = '#8b1e22';
    ctx.font = '14px serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', 0, -radius - 6);

    ctx.restore();
  }
}

window.RoyalSeaChart = RoyalSeaChart;
