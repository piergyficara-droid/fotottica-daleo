document.addEventListener('DOMContentLoaded', () => {
  const isTouch = window.matchMedia('(hover:none)').matches;

  const nav = document.getElementById('nav');
  const legacyPhotos = document.querySelectorAll('.legacy-photo img');

  function gestisciScroll() {
    if (nav && !nav.classList.contains('solid')) {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }

    const hSchermo = window.innerHeight;
    legacyPhotos.forEach(img => {
      const contenitore = img.parentElement;
      const rect = contenitore.getBoundingClientRect();
      if (rect.top < hSchermo && rect.bottom > 0) {
        const p = (hSchermo - rect.top) / (hSchermo + rect.height);
        const spostamento = (p - 0.5) * 40;
        img.style.transform = `scale(1.08) translateY(${spostamento}px)`;
      }
    });
  }

  window.addEventListener('scroll', gestisciScroll);
  gestisciScroll();

  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  if (!isTouch) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const box = btn.getBoundingClientRect();
        const x = e.clientX - box.left - box.width / 2;
        const y = e.clientY - box.top - box.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0)';
      });
    });
  }

  const heroContent = document.getElementById('heroContent');
  const heroSection = document.getElementById('heroSection');

  if (heroContent && heroSection && !isTouch) {
    heroSection.addEventListener('mousemove', e => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dx = (e.clientX - w / 2) / w;
      const dy = (e.clientY - h / 2) / h;
      heroContent.style.transform = `translate(${dx * -14}px, ${dy * -10}px)`;
    });
  }

  const elementiDaRivelare = document.querySelectorAll('.reveal, .statement, .legacy-photo, .service-card, .value-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.2 });

  elementiDaRivelare.forEach(el => observer.observe(el));

  const contatori = document.querySelectorAll('.stat-num');
  const observerContatori = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const valoreFinale = parseInt(el.dataset.count, 10);
        const suffisso = el.dataset.suffix || '';
        let valoreAttuale = 0;
        const passo = Math.max(1, Math.round(valoreFinale / 60));

        (function conteggio() {
          valoreAttuale += passo;
          if (valoreAttuale >= valoreFinale) {
            el.textContent = valoreFinale + suffisso;
            return;
          }
          el.textContent = valoreAttuale + suffisso;
          requestAnimationFrame(conteggio);
        })();

        observerContatori.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  contatori.forEach(el => observerContatori.observe(el));

  const bottoniFiltro = document.querySelectorAll('.filter-btn');
  const elementiGalleria = document.querySelectorAll('.masonry-item');

  if (bottoniFiltro.length && elementiGalleria.length) {
    bottoniFiltro.forEach(btn => {
      btn.addEventListener('click', () => {
        bottoniFiltro.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const categoria = btn.dataset.filter;
        elementiGalleria.forEach(item => {
          const visibile = categoria === 'all' || item.dataset.category === categoria;
          if (visibile) {
            item.classList.remove('hide');
            setTimeout(() => item.classList.add('show'), 10);
          } else {
            item.classList.remove('show');
            item.classList.add('hide');
          }
        });
      });
    });
  }

  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('img');
    const lbCounter = lightbox.querySelector('.lb-counter');
    const btnChiudi = lightbox.querySelector('.lb-close');
    const btnPrev = lightbox.querySelector('.lb-prev');
    const btnNext = lightbox.querySelector('.lb-next');
    let listaFoto = [];
    let indiceAttuale = 0;

    function apriFoto(i) {
      listaFoto = Array.from(document.querySelectorAll('.masonry-item:not(.hide) img'));
      indiceAttuale = i;
      aggiornaFoto();
      lightbox.classList.add('open');
    }

    function aggiornaFoto() {
      if (listaFoto[indiceAttuale]) {
        lbImg.src = listaFoto[indiceAttuale].src;
      }
      if (lbCounter) {
        lbCounter.textContent = (indiceAttuale + 1) + ' / ' + listaFoto.length;
      }
    }

    document.querySelectorAll('.masonry-item').forEach((item) => {
      item.addEventListener('click', () => {
        const elementiVisibili = Array.from(document.querySelectorAll('.masonry-item:not(.hide)'));
        const i = elementiVisibili.indexOf(item);
        apriFoto(i < 0 ? 0 : i);
      });
    });

    if (btnChiudi) btnChiudi.addEventListener('click', () => lightbox.classList.remove('open'));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (!listaFoto.length) return;
        indiceAttuale = (indiceAttuale - 1 + listaFoto.length) % listaFoto.length;
        aggiornaFoto();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (!listaFoto.length) return;
        indiceAttuale = (indiceAttuale + 1) % listaFoto.length;
        aggiornaFoto();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') lightbox.classList.remove('open');
      if (!listaFoto.length) return;
      if (e.key === 'ArrowLeft') {
        indiceAttuale = (indiceAttuale - 1 + listaFoto.length) % listaFoto.length;
        aggiornaFoto();
      }
      if (e.key === 'ArrowRight') {
        indiceAttuale = (indiceAttuale + 1) % listaFoto.length;
        aggiornaFoto();
      }
    });
  }

  /* Banner cookie: uguale su tutte le pagine, con Accetta/Rifiuta */
  const cookieBanner = document.getElementById('cookie-banner');
  if (cookieBanner) {
    if (!localStorage.getItem('cookieChoice')) {
      cookieBanner.style.display = 'flex';
    }
    const accetta = document.getElementById('accept-cookies');
    const rifiuta = document.getElementById('reject-cookies');
    if (accetta) {
      accetta.addEventListener('click', () => {
        localStorage.setItem('cookieChoice', 'accepted');
        cookieBanner.style.display = 'none';
        if (typeof gtag === 'function') {
          gtag('consent', 'update', { 'analytics_storage': 'granted' });
        }
      });
    }
    if (rifiuta) {
      rifiuta.addEventListener('click', () => {
        localStorage.setItem('cookieChoice', 'rejected');
        cookieBanner.style.display = 'none';
        if (typeof gtag === 'function') {
          gtag('consent', 'update', { 'analytics_storage': 'denied' });
        }
      });
    }
  }
});