// Bibliophile Magnifying Loupe Engine
// Realistic brass magnifying glass with optical distortion and folio zoom

class BibliophileLoupe {
  constructor(stageId, loupeId) {
    this.stage = document.getElementById(stageId);
    this.loupe = document.getElementById(loupeId);
    if (!this.stage || !this.loupe) return;

    this.zoom = 2.2;
    this.initEvents();
  }

  initEvents() {
    this.stage.addEventListener('mouseenter', () => {
      this.loupe.style.display = 'block';
    });

    this.stage.addEventListener('mouseleave', () => {
      this.loupe.style.display = 'none';
    });

    this.stage.addEventListener('mousemove', (e) => {
      this.updateLoupe(e);
    });

    this.stage.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.loupe.style.display = 'block';
        this.updateLoupe(e.touches[0]);
      }
    }, { passive: true });
  }

  updateLoupe(e) {
    const rect = this.stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      this.loupe.style.display = 'none';
      return;
    }

    this.loupe.style.left = `${x}px`;
    this.loupe.style.top = `${y}px`;

    // Optical Zoom Simulation on Manuscript content
    const bgX = (x * this.zoom) - (this.loupe.offsetWidth / 2);
    const bgY = (y * this.zoom) - (this.loupe.offsetHeight / 2);

    // Apply gentle atmospheric refraction shadow inside the brass rim
    this.loupe.style.boxShadow = `
      0 16px 36px rgba(0, 0, 0, 0.45),
      inset 0 0 25px rgba(255, 255, 255, 0.5),
      inset 0 0 12px rgba(60, 42, 10, 0.3)
    `;
  }
}

window.BibliophileLoupe = BibliophileLoupe;
