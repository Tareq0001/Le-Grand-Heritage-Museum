// Quill Folio & Illuminated Certificate Studio
// Creates bespoke illuminated parchment certificates with personalized wax seals

class QuillFolioStudio {
  constructor() {
    this.nameInput = document.getElementById('cert-input-name');
    this.titleInput = document.getElementById('cert-input-title');
    this.mottoInput = document.getElementById('cert-input-motto');

    this.certName = document.getElementById('cert-display-name');
    this.certTitle = document.getElementById('cert-display-title');
    this.certBody = document.getElementById('cert-display-body');
    this.certDate = document.getElementById('cert-display-date');
    this.btnPrint = document.getElementById('btn-print-certificate');

    this.init();
  }

  init() {
    if (this.nameInput) {
      this.nameInput.addEventListener('input', () => this.updatePreview());
    }
    if (this.titleInput) {
      this.titleInput.addEventListener('input', () => this.updatePreview());
    }
    if (this.mottoInput) {
      this.mottoInput.addEventListener('input', () => this.updatePreview());
    }
    if (this.btnPrint) {
      this.btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    // Set today's date in classical Roman/Hijri notation
    if (this.certDate) {
      const now = new Date();
      this.certDate.textContent = `صدر في قصر الأرشيف الملكي — ${now.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    }
  }

  updatePreview() {
    const name = this.nameInput.value.trim() || 'العالِم الأديب / الأستاذ طارق ابوعشي';
    const title = this.titleInput.value.trim() || 'باحث في روائع التراث الإنساني والعلوم الكلاسيكية';
    const motto = this.mottoInput.value.trim() || '« البساطة والعراقة هما منتهى الرقي الإنساني؛ فما صُنع بعناية وروح يبقى أثره خالداً على مر العصور. »';

    if (this.certName) this.certName.textContent = name;
    if (this.certTitle) this.certTitle.textContent = title;
    if (this.certBody) this.certBody.textContent = motto;
  }
}

window.QuillFolioStudio = QuillFolioStudio;
