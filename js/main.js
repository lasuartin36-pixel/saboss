(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Speicher kann blockiert sein (Privatmodus) */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignorieren */ } }
  };

  /* Jahr */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* Header: beim Scrollen dunkel + Blur */
  const header = $('#header');
  const onScrollHeader = () => header.classList.toggle('is-solid', scrollY > 40);
  onScrollHeader();
  addEventListener('scroll', onScrollHeader, { passive: true });

  /* Mobiles Menü */
  const burger = $('#burger');
  const overlay = $('#overlay');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    if (open) { overlay.hidden = false; requestAnimationFrame(() => overlay.classList.add('is-open')); }
    else { overlay.classList.remove('is-open'); setTimeout(() => { if (!overlay.classList.contains('is-open')) overlay.hidden = true; }, 350); }
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', overlay).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !overlay.hidden) { setMenu(false); burger.focus(); } });

  /* Einblenden beim Scrollen */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  /* Hochzählende Zahlen */
  const fmt = new Intl.NumberFormat('de-DE');
  const countUp = (el) => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const fmtDec = new Intl.NumberFormat('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    if (reduced) { el.textContent = fmtDec.format(target); return; }
    const dur = 1800, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmtDec.format(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { countUp(en.target); co.unobserve(en.target); } });
    }, { threshold: .6 });
    counters.forEach(el => co.observe(el));
  } else {
    counters.forEach(el => { el.textContent = fmt.format(parseFloat(el.dataset.count)); });
  }

  /* Parallax (langsam) + Steuerrad dreht beim Scrollen */
  const parallax = $$('[data-parallax]');
  const wheel = $('#hero-wheel');
  let ticking = false;
  const update = () => {
    const vh = innerHeight;
    parallax.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const offset = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallax);
      el.style.transform = `translate3d(0, ${(-offset).toFixed(1)}px, 0)`;
    });
    if (wheel && scrollY < vh * 1.5) wheel.style.transform = `rotate(${(scrollY * 0.18).toFixed(1)}deg)`;
    ticking = false;
  };
  if (!reduced) {
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }

  /* Bewertungs-Slider */
  const track = $('.slider__track');
  $$('.slider__nav button').forEach(btn => btn.addEventListener('click', () => {
    const card = $('.review', track);
    const step = card ? card.getBoundingClientRect().width + 20 : 300;
    track.scrollBy({ left: step * Number(btn.dataset.dir), behavior: reduced ? 'auto' : 'smooth' });
  }));
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); $('.slider__nav [data-dir="1"]').click(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); $('.slider__nav [data-dir="-1"]').click(); }
  });

  /* Lightbox */
  const box = $('#lightbox');
  const boxImg = $('img', box);
  $$('[data-full]').forEach(item => item.addEventListener('click', () => {
    const img = $('img', item);
    boxImg.src = item.dataset.full || img.src;
    boxImg.alt = img.alt;
    if (typeof box.showModal === 'function') box.showModal(); else box.setAttribute('open', '');
  }));
  box.addEventListener('click', e => { if (e.target === box || e.target.closest('.lightbox__close')) box.close(); });

  /* Einwilligung (DSGVO): Maps + Video erst nach Zustimmung */
  const banner = $('#consent');
  const KEY = 'saboss-consent';
  const loadMap = () => {
    const map = $('#map');
    if (!map || $('iframe', map)) return;
    const f = document.createElement('iframe');
    f.src = map.dataset.src;
    f.title = 'Karte: Standort Saboss Barber Shop';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    f.setAttribute('allowfullscreen', '');
    map.replaceChildren(f);
  };
  const loadVideo = () => {
    const v = $('#hero-video');
    if (!v || v.dataset.loaded || reduced) return;
    v.dataset.loaded = '1';
    v.addEventListener('canplay', () => { v.playbackRate = 0.6; v.classList.add('is-ready'); v.play().catch(() => {}); }, { once: true });
    v.addEventListener('error', () => v.classList.remove('is-ready'), { once: true });
    v.src = v.dataset.src;
    v.load();
  };
  const apply = (choice) => { if (choice === 'all') { loadMap(); loadVideo(); } };
  const choose = (choice) => { store.set(KEY, choice); banner.hidden = true; apply(choice); };
  const saved = store.get(KEY);
  if (saved) apply(saved); else banner.hidden = false;
  $$('[data-consent-choice]').forEach(b => b.addEventListener('click', () => choose(b.dataset.consentChoice)));
  $('#cookie-settings').addEventListener('click', () => { banner.hidden = false; $('button', banner).focus(); });
  const mapBtn = $('[data-load="maps"]');
  if (mapBtn) mapBtn.addEventListener('click', loadMap); // Einzelfreigabe nur für die Karte

  /* Buchungsformular */
  const form = $('#booking');
  const err = $('#form-error');
  const ok = $('#form-ok');
  const date = $('#f-date');
  date.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    err.hidden = true;
    $$('[aria-invalid]', form).forEach(el => el.removeAttribute('aria-invalid'));
    if (form.website.value) return; // Honeypot

    const bad = [];
    ['name', 'phone', 'service', 'date', 'time'].forEach(n => { if (!form[n].value.trim()) bad.push(form[n]); });
    const mail = form.email.value.trim();
    if (!mail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) bad.push(form.email);
    if (!form.privacy.checked) bad.push(form.privacy);
    if (bad.length) {
      bad.forEach(el => el.setAttribute('aria-invalid', 'true'));
      err.textContent = 'Bitte prüfe die markierten Felder und stimme der Datenschutzerklärung zu.';
      err.hidden = false;
      bad[0].focus();
      return;
    }

    /* TODO Backend: Formular-Daten hier an einen Endpunkt senden
       (z. B. fetch('/api/termin', { method: 'POST', body: new FormData(form) })). */
    form.hidden = true;
    ok.hidden = false;
    ok.setAttribute('tabindex', '-1');
    ok.focus();
  });
})();
