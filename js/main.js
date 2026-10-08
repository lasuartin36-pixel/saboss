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

  /* Preistafel: Staub, den der Rasierpinsel beim Scrollen wegwischt */
  const menu = $('#menu'), dust = $('#dust'), brush = $('#brush');
  if (menu && dust && brush && !reduced) {
    const ctx = dust.getContext('2d');
    const SWINGS = 12;
    let W = 0, H = 0, R = 60, maxP = 0, current = 0;
    const rng = (seed) => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    // Pinselweg: im Zickzack von links nach rechts, von oben nach unten
    const pathAt = (p) => {
      const phase = p * SWINGS * Math.PI;
      return { x: W / 2 - Math.cos(phase) * (W / 2 - 10), y: -30 + p * (H + 60), dir: Math.sin(phase) >= 0 ? -1 : 1, phase };
    };
    const wipe = (p0, p1) => {
      const n = Math.max(1, Math.ceil(Math.abs(p1 - p0) * SWINGS * 50));
      ctx.globalCompositeOperation = 'destination-out';
      for (let i = 0; i <= n; i++) {
        const { x, y } = pathAt(p0 + (p1 - p0) * i / n);
        const g = ctx.createRadialGradient(x, y, R * 0.5, x, y, R);
        g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    };
    const paintDust = () => {
      const r = rng(7);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(150,138,120,.86)';
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 14; i++) {              // große weiche Flecken
        const x = r() * W, y = r() * H, rad = 60 + r() * 160;
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        const c = r() < .5 ? '210,196,170' : '90,76,58';
        g.addColorStop(0, `rgba(${c},.35)`); g.addColorStop(1, `rgba(${c},0)`);
        ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      }
      const specks = Math.round(W * H / 70);      // feines Korn
      for (let i = 0; i < specks; i++) {
        ctx.fillStyle = r() < .5 ? `rgba(235,222,196,${.1 + r() * .25})` : `rgba(60,48,36,${.1 + r() * .25})`;
        ctx.beginPath(); ctx.arc(r() * W, r() * H, .4 + r() * 1.5, 0, Math.PI * 2); ctx.fill();
      }
    };
    const build = () => {
      const rect = menu.getBoundingClientRect();
      W = rect.width; H = rect.height;
      const dpr = Math.min(2, devicePixelRatio || 1);
      dust.width = Math.round(W * dpr); dust.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.max(58, (H + 60) / SWINGS * 0.72);
      brush.style.width = (R * 3.8) + 'px';
      paintDust();
      if (maxP > 0) wipe(0, maxP);
      dust.classList.toggle('is-done', maxP >= 0.995);
    };
    const update = () => {
      const rect = menu.getBoundingClientRect();
      if (Math.abs(rect.width - W) > 1 || Math.abs(rect.height - H) > 1) build();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - rect.top) / (rect.height + innerHeight * 0.3)));
      if (p > maxP) { wipe(maxP, p); maxP = p; if (maxP >= 0.995) dust.classList.add('is-done'); }
      const { x, y, dir, phase } = pathAt(p);
      const bw = brush.offsetWidth, bh = brush.offsetHeight;
      brush.style.transform = `translate(${(x - bw * 0.295).toFixed(1)}px, ${(y - bh * 0.5).toFixed(1)}px) scaleX(${dir}) rotate(${(-8 - 8 * Math.abs(Math.sin(phase))).toFixed(1)}deg)`;
      brush.style.opacity = (p > 0.004 && p < 0.996) ? 1 : 0;
    };
    let raf = 0;
    const kick = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); };
    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', kick);
    build(); update();
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
