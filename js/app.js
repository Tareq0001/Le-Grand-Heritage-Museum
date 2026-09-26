// Master Application Orchestrator
// Coordinates salon transitions, instruments initialization, and language switching

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Instruments
  let astrolabeInstance = null;
  let loupeInstance = null;
  let seaChartInstance = null;
  let horologyInstance = null;
  let folioStudioInstance = null;

  try {
    astrolabeInstance = new window.RoyalAstrolabe('astrolabe-canvas');
  } catch (err) {
    console.error('Astrolabe initialization:', err);
  }

  try {
    loupeInstance = new window.BibliophileLoupe('manuscript-stage', 'brass-loupe');
  } catch (err) {
    console.error('Loupe initialization:', err);
  }

  try {
    seaChartInstance = new window.RoyalSeaChart('sea-chart-canvas');
  } catch (err) {
    console.error('Sea chart initialization:', err);
  }

  try {
    horologyInstance = new window.RoyalHorology('escapement-canvas');
  } catch (err) {
    console.error('Horology initialization:', err);
  }

  try {
    folioStudioInstance = new window.QuillFolioStudio();
  } catch (err) {
    console.error('Folio studio initialization:', err);
  }

  // 2. Salon Navigation (Gallery Tabs)
  const tabs = document.querySelectorAll('.gallery-tab');
  const exhibits = document.querySelectorAll('.exhibit-view');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      exhibits.forEach(e => e.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-exhibit');
      const targetExhibit = document.getElementById(targetId);
      if (targetExhibit) {
        targetExhibit.classList.add('active');
      }

      if (window.HeritageAudio) {
        window.HeritageAudio.playChime();
        window.HeritageAudio.playParchmentRustle();
      }

      // Trigger redraw on canvases when becoming visible
      if (targetId === 'exhibit-astrolabe' && astrolabeInstance) {
        setTimeout(() => {
          astrolabeInstance.resize();
          astrolabeInstance.render();
        }, 50);
      }
      if (targetId === 'exhibit-cartography' && seaChartInstance) {
        setTimeout(() => {
          seaChartInstance.resize();
          seaChartInstance.render();
        }, 50);
      }
      if (targetId === 'exhibit-horology' && horologyInstance) {
        setTimeout(() => {
          horologyInstance.resize();
        }, 50);
      }
    });
  });

  // 3. Audio Ambience Toggle
  const btnAudio = document.getElementById('btn-audio-toggle');
  if (btnAudio) {
    btnAudio.addEventListener('click', () => {
      const active = window.HeritageAudio.toggle();
      btnAudio.textContent = active ? '🔊 النغمات الكلاسيكية: مفعّلة' : '🔇 النغمات الكلاسيكية: صامتة';
      btnAudio.style.borderColor = active ? 'var(--gold-highlight)' : 'var(--gold-antique)';
    });
  }

  // 4. Astrolabe Plate Selector
  const plateSelect = document.getElementById('plate-select');
  if (plateSelect && astrolabeInstance) {
    plateSelect.addEventListener('change', (e) => {
      astrolabeInstance.setLatitude(parseFloat(e.target.value));
      if (window.HeritageAudio) window.HeritageAudio.playParchmentRustle();
    });
  }

  // 5. Maritime Voyages Selector
  const voyageButtons = document.querySelectorAll('.btn-voyage-select');
  voyageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      voyageButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-voyage');
      if (seaChartInstance) {
        seaChartInstance.selectVoyage(key);
      }
    });
  });

  // 6. Classical Language Switcher
  const btnLang = document.getElementById('btn-lang-toggle');
  let currentLang = 'ar';

  if (btnLang) {
    btnLang.addEventListener('click', () => {
      if (currentLang === 'ar') {
        currentLang = 'fr-en';
        document.body.style.direction = 'ltr';
        btnLang.textContent = 'العربية الفصحى (Arabic)';
        applyTranslations('fr-en');
      } else {
        currentLang = 'ar';
        document.body.style.direction = 'rtl';
        btnLang.textContent = 'Langue Classique (Français & English)';
        applyTranslations('ar');
      }
      if (window.HeritageAudio) window.HeritageAudio.playParchmentRustle();
    });
  }

  function applyTranslations(lang) {
    const i18n = {
      'ar': {
        subtitle: 'المعرض الملكي الدائم للتراث العلمي والإنساني',
        title: 'Le Grand Cabinet des Curiosités',
        motto: '« مستودع روائع الفكر، ونفائس المخطوطات، والآلات الفلكية والميكانيكية التي صاغتها يد الحضارة الإنسانية الكلاسيكية. »',
        tab1: '⚜ أسطرلاب الفلك الملكي',
        tab2: '📜 مخطوطة التنوير والعدسة',
        tab3: '🧭 أطلس الملاحة والبحار',
        tab4: '⏳ ميزان الساعات الملكية',
        tab5: '🖋️ ديوان الحكمة والشهادة'
      },
      'fr-en': {
        subtitle: 'Royal Cabinet of Antiquities, Sciences & Human Enlightenment',
        title: 'Le Grand Cabinet des Curiosités',
        motto: '« A treasury of rare manuscripts, celestial astrolabes, and classical mechanical horology celebrating world civilizational heritage. »',
        tab1: '⚜ Royal Celestial Astrolabe',
        tab2: '📜 Illuminated Folio & Loupe',
        tab3: '🧭 Portolan Maritime Atlas',
        tab4: '⏳ Precision Escapement',
        tab5: '🖋️ The Enlightenment Folio'
      }
    };

    const dict = i18n[lang];
    const elSub = document.querySelector('.imperial-subtitle');
    const elTitle = document.querySelector('.imperial-title');
    const elMotto = document.querySelector('.imperial-motto');
    
    if (elSub) elSub.textContent = dict.subtitle;
    if (elTitle) elTitle.textContent = dict.title;
    if (elMotto) elMotto.textContent = dict.motto;

    const t1 = document.querySelector('[data-exhibit="exhibit-astrolabe"] span:last-child');
    const t2 = document.querySelector('[data-exhibit="exhibit-manuscript"] span:last-child');
    const t3 = document.querySelector('[data-exhibit="exhibit-cartography"] span:last-child');
    const t4 = document.querySelector('[data-exhibit="exhibit-horology"] span:last-child');
    const t5 = document.querySelector('[data-exhibit="exhibit-quill"] span:last-child');

    if (t1) t1.textContent = dict.tab1;
    if (t2) t2.textContent = dict.tab2;
    if (t3) t3.textContent = dict.tab3;
    if (t4) t4.textContent = dict.tab4;
    if (t5) t5.textContent = dict.tab5;
  }
});
