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

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* Header: beim Scrollen Holz + Barber-Streifen */
  const header = $('#header');
  const onScrollHeader = () => header.classList.toggle('is-solid', scrollY > 40);
  onScrollHeader();
  addEventListener('scroll', onScrollHeader, { passive: true });

  /* Mobiles Menü */
  const burger = $('#burger');
  const overlay = $('#overlay');
  if (burger && overlay) {
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
  }

  /* Steuerrad dreht sich beim Scrollen (weich nachgezogen) */
  const wheel = $('#wheel');
  if (wheel && !reduced) {
    const DEG_PER_PX = 0.28;
    let current = scrollY * DEG_PER_PX, running = false;
    const frame = () => {
      const target = scrollY * DEG_PER_PX;
      current += (target - current) * 0.12;
      wheel.style.setProperty('--rot', current.toFixed(2) + 'deg');
      if (Math.abs(target - current) > 0.02) requestAnimationFrame(frame); else running = false;
    };
    const kick = () => { if (!running) { running = true; requestAnimationFrame(frame); } };
    addEventListener('scroll', kick, { passive: true });
    kick();
  }

  /* Schere: wandert beim Scrollen von rechts nach links und schneidet (auf/zu) */
  const scissors = $('#scissors');
  const cutline = $('.snip__line');
  if (scissors && cutline && !reduced) {
    const bladeA = $('#bladeA'), bladeB = $('#bladeB');
    let angle = 8, idle;
    const update = () => {
      const vw = innerWidth;
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const p = Math.min(1, Math.max(0, scrollY / max));
      const w = scissors.getBoundingClientRect().width;
      const x = vw - p * (vw + w * 1.1);              // linke Kante der Schere
      scissors.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      const pivot = x + w * (112 / 212);              // Drehpunkt der Schere
      cutline.style.transform = `scaleX(${Math.min(1, Math.max(0, (vw - pivot) / vw)).toFixed(4)})`;
      // Klingen: alle ~200px Scrollweg einmal auf und zu
      const target = 1 + 17 * (0.5 + 0.5 * Math.sin(scrollY / 32));
      angle += (target - angle) * 0.5;
      bladeA.setAttribute('transform', `rotate(${angle.toFixed(2)})`);
      bladeB.setAttribute('transform', `rotate(${(-angle).toFixed(2)})`);
      clearTimeout(idle);
      idle = setTimeout(() => {            // im Stand sanft halb schließen
        const settle = () => {
          angle += (7 - angle) * 0.2;
          bladeA.setAttribute('transform', `rotate(${angle.toFixed(2)})`);
          bladeB.setAttribute('transform', `rotate(${(-angle).toFixed(2)})`);
          if (Math.abs(angle - 7) > .1) requestAnimationFrame(settle);
        };
        settle();
      }, 180);
    };
    let raf = 0;
    const kick = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); };
    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', kick);
    update();
  }

  /* Bewertungs-Slider */
  const track = $('#track');
  if (track) {
    $$('.slider__nav button').forEach(btn => btn.addEventListener('click', () => {
      const card = $('.review', track);
      const step = card ? card.getBoundingClientRect().width + 29 : 320;
      track.scrollBy({ left: step * Number(btn.dataset.dir), behavior: reduced ? 'auto' : 'smooth' });
    }));
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); $('.slider__nav [data-dir="1"]').click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); $('.slider__nav [data-dir="-1"]').click(); }
    });
  }

  /* Einwilligung (DSGVO): Karte + Buchungssystem erst nach Zustimmung/Klick */
  const banner = $('#consent');
  const KEY = 'saboss-consent';
  const embed = (box, src, title, extra = {}) => {
    if (!box || $('iframe', box) || !src) return;
    const f = document.createElement('iframe');
    f.src = src; f.title = title; f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    Object.assign(f, extra);
    box.replaceChildren(f);
  };
  const loadMap = () => { const m = $('#map'); embed(m, m && m.dataset.src, 'Karte: Standort Saboss Barber Shop'); };
  const loadBooking = () => {
    const b = $('#booking');
    if (!b) return;
    if (!b.dataset.src) {
      const hint = $('.booking__hint', b);
      if (hint) hint.textContent = 'Die Online-Buchung wird gerade eingerichtet. Bis dahin erreichst du uns telefonisch oder per WhatsApp.';
      const btn = $('#load-booking');
      if (btn) btn.hidden = true;
      return;
    }
    embed(b, b.dataset.src, 'Online-Terminbuchung Saboss Barber Shop');
  };
  const apply = (choice) => { if (choice === 'all') { loadMap(); loadBooking(); } };
  const choose = (choice) => { store.set(KEY, choice); banner.hidden = true; apply(choice); };
  const saved = store.get(KEY);
  if (saved) apply(saved); else banner.hidden = false;
  $$('[data-consent-choice]').forEach(b => b.addEventListener('click', () => choose(b.dataset.consentChoice)));
  $('#cookie-settings').addEventListener('click', () => { banner.hidden = false; $('button', banner).focus(); });
  const mapBtn = $('#load-map');
  if (mapBtn) mapBtn.addEventListener('click', loadMap);
  const bookBtn = $('#load-booking');
  if (bookBtn) bookBtn.addEventListener('click', loadBooking);
})();
