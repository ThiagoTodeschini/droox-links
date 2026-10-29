/* drooxOS: theme, pixel icons, window, menus, clock and live notice */
(() => {
  'use strict';

  const TWITCH_USER = 'drooxdroox';
  const THEME_KEY = 'drooxos-theme';
  const THEME_COLOR = { '98': '#008080', aero: '#0f52b0' };

  const root = document.documentElement;
  const body = document.body;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const params = new URLSearchParams(location.search);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode etc. */ } },
  };

  /* ---------- icons ----------
     Each icon is a single SVG. Aero shows it as a vector; 98 rasterizes it
     at its real size and reduces it to the 216-color palette with ordered
     dithering, like a 256-color screen. The logo is drawn by hand instead. */

  const ICONS = {
    logo: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fe3ff"/><stop offset=".5" stop-color="#2a8fe8"/><stop offset="1" stop-color="#0b46a8"/></linearGradient><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><path d="M3 7c5-3 9 2 13 0s8-4 13-1v18c-5-3-9-1-13 1s-8-3-13 0z" fill="url(#f)" stroke="#06306e" stroke-width="1" stroke-linejoin="round"/><path d="M3 7c5-3 9 2 13 0s8-4 13-1v8c-5-3-9-1-13 1s-8-3-13 0z" fill="url(#s)"/><path d="M18.5 8.2h3.6v15.6h-3.6v-1.3a5.2 5.2 0 1 1 0-7.8zM15.7 16.3a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 1 0 0-4.6z" fill="#fff" fill-rule="evenodd" stroke="#06306e" stroke-opacity=".6" stroke-width=".9" stroke-linejoin="round"/></svg>',
    folder: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3b0"/><stop offset="1" stop-color="#f0b830"/></linearGradient></defs><path d="M2.5 7.5h10l3 3h14v17h-27z" fill="#e3a823" stroke="#6b4a00" stroke-width="1.4" stroke-linejoin="round"/><path d="M2.5 12.5h27v15h-27z" fill="url(#f)" stroke="#6b4a00" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    globe: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><radialGradient id="g" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#bff0ff"/><stop offset=".5" stop-color="#2f9be8"/><stop offset="1" stop-color="#0b3d91"/></radialGradient></defs><circle cx="16" cy="16" r="13" fill="url(#g)" stroke="#0a2a66" stroke-width="1.5"/><path d="M8 10c3-2 6-1 7 1s-1 4-3 4-2 2-1 4-1 3-3 2-3-4-2-6 0-3 2-5zM19 7c2 0 5 2 6 5s0 5-2 5-2-2-4-2-2-3-1-5 0-3 1-3zM17 21c2-1 5 0 5 2s-2 4-4 3-2-4-1-5z" fill="#4cbb3c"/></svg>',
    theme: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="2.5" y="3.5" width="27" height="20" rx="2" fill="#d8d4cc" stroke="#3a3a3a" stroke-width="1.4"/><rect x="5.5" y="6.5" width="21" height="14" fill="#008080"/><path d="M16 6.5h10.5v14H16z" fill="#1f6fd0"/><path d="M16 20.5c2.6-4.6 6.3-7.4 10.5-8.6v8.6z" fill="#7fd0f6"/><circle cx="22.5" cy="10.5" r="1.8" fill="#fff"/><path d="M12 24h8l1.5 4.5h-11z" fill="#bcb7ae" stroke="#3a3a3a" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><radialGradient id="i" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#9fd8ff"/><stop offset="1" stop-color="#0a4fb0"/></radialGradient></defs><circle cx="16" cy="16" r="13" fill="url(#i)" stroke="#06306e" stroke-width="1.5"/><rect x="14" y="13" width="4" height="11" fill="#fff"/><circle cx="16" cy="9" r="2.3" fill="#fff"/></svg>',
    power: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><radialGradient id="p" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffb3a6"/><stop offset="1" stop-color="#b3200e"/></radialGradient></defs><circle cx="16" cy="16" r="13" fill="url(#p)" stroke="#6b1105" stroke-width="1.5"/><path d="M11.5 11.5a7 7 0 1 0 9 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M16 8v8" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>',
  };

  // the 98 logo, one character per pixel: a waving flag with the d on top
  const LOGO_PIXELS = [
    '................',
    '.kkkkk.....kkkkk',
    'kkHHHkkk.kkkHHHk',
    'kHHHHMMkkkHHHHHk',
    'kHMMMMMMkkkkMMMk',
    'kMMMMSSMkwwkMMMk',
    'kMMMMkkkkwwkMMMk',
    'kMMMkkwwwwwkMMMk',
    'kMMkkwwkkwwkMMMk',
    'kMMkwwkkkwwkMMMk',
    'kMSkwwkkkwwkSSSk',
    'kSSkkwwkkwwkSSSk',
    'kSSSkkwwwwwkSSSk',
    'kSkkkkkkkkkkkkkk',
    'kkk.kkkDDDkkk...',
    '......kkkkk.....',
  ];
  const LOGO_COLORS = { k: '#000000', w: '#ffffff', H: '#66ccff', M: '#0066ff', S: '#0033cc', D: '#000099' };

  const BRAND_COLORS = {
    twitch: ['#9146FF'],
    instagram: ['#FEDA75', '#FA7E1E', '#D62976', '#962FBF', '#4F5BD5'],
    x: ['#000000'],
    steam: ['#111D2E', '#1387B8'],
    github: ['#181717'],
    spotify: ['#1DB954'],
  };

  // the 98 shortcut arrow, drawn pixel by pixel
  const ARROW = [
    '##########',
    '#........#',
    '#...####.#',
    '#.....##.#',
    '#....###.#',
    '#...##.#.#',
    '#..##....#',
    '#.##.....#',
    '#........#',
    '##########',
  ];
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const pixCache = new Map();

  let uid = 0;
  // unique ids per copy, otherwise gradients from a hidden SVG vanish in the others
  function inlineSvg(svg) {
    const n = ++uid;
    return svg.replace(/id="([\w-]+)"/g, `id="$1-${n}"`).replace(/url\(#([\w-]+)\)/g, `url(#$1-${n})`);
  }

  function brandSvg(brand) {
    const d = $(`#i-${brand} path`).getAttribute('d');
    const colors = BRAND_COLORS[brand];
    if (colors.length === 1) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 26 26"><path d="${d}" fill="${colors[0]}"/></svg>`;
    }
    const stops = colors.map((c, i) => `<stop offset="${i / (colors.length - 1)}" stop-color="${c}"/>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 26 26"><defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0">${stops}</linearGradient></defs><path d="${d}" fill="url(#g)"/></svg>`;
  }

  function pixelate(svg, size, arrow) {
    const key = `${size}|${arrow}|${svg}`;
    if (!pixCache.has(key)) {
      pixCache.set(key, new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = size;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, size, size);
          const data = ctx.getImageData(0, 0, size, size);
          const px = data.data;
          for (let i = 0; i < px.length; i += 4) {
            if (px[i + 3] < 128) { px[i + 3] = 0; continue; }
            const p = i / 4;
            const x = p % size;
            const y = (p - x) / size;
            const t = (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16 - 0.5;
            for (let k = 0; k < 3; k++) px[i + k] = clamp(Math.round((px[i + k] + t * 51) / 51) * 51, 0, 255);
            px[i + 3] = 255;
          }
          ctx.putImageData(data, 0, 0);
          if (arrow) {
            const top = size - ARROW.length;
            ARROW.forEach((row, y) => {
              for (let x = 0; x < row.length; x++) {
                ctx.fillStyle = row[x] === '#' ? '#000' : '#fff';
                ctx.fillRect(x, top + y, 1, 1);
              }
            });
          }
          resolve(canvas.toDataURL());
        };
        img.onerror = reject;
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace('<svg ', `<svg width="${size}" height="${size}" `));
      }));
    }
    return pixCache.get(key);
  }

  function pixelArt(rows, colors) {
    const canvas = document.createElement('canvas');
    canvas.width = rows[0].length;
    canvas.height = rows.length;
    const ctx = canvas.getContext('2d');
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] === '.') continue;
        ctx.fillStyle = colors[row[x]];
        ctx.fillRect(x, y, 1, 1);
      }
    });
    return canvas.toDataURL();
  }

  function addPixel(el, size, source) {
    const img = new Image(size, size);
    img.className = 'pix';
    img.alt = '';
    img.draggable = false;
    el.append(img);
    Promise.resolve(source).then((url) => {
      img.src = url;
      el.style.setProperty('--pix', `url("${url}")`);
      el.classList.add('has-pix');
    }).catch(() => img.remove());
  }

  function mountIcons() {
    const logo = pixelArt(LOGO_PIXELS, LOGO_COLORS);
    for (const el of $$('.icon[data-icon]')) {
      const name = el.dataset.icon;
      const size = Number(el.dataset.size) || 16;
      el.insertAdjacentHTML('afterbegin', inlineSvg(ICONS[name]));
      addPixel(el, size, name === 'logo' ? logo : pixelate(ICONS[name], size, false));
    }
    for (const el of $$('.ico[data-brand]')) {
      addPixel(el, 32, pixelate(brandSvg(el.dataset.brand), 32, el.hasAttribute('data-arrow')));
    }
  }

  /* ---------- theme ---------- */

  const trayTheme = $('#trayTheme');
  const themeLabel = { '98': 'Windows 98', aero: 'Frutiger Aero' };

  function applyTheme(t) {
    root.dataset.theme = t;
    const other = t === '98' ? 'aero' : '98';
    for (const b of $$('[data-set-theme]')) b.setAttribute('aria-checked', String(b.dataset.setTheme === t));
    trayTheme.textContent = t === '98' ? '98' : 'Aero';
    trayTheme.title = `Switch to the ${themeLabel[other]} theme`;
    trayTheme.setAttribute('aria-label', `${themeLabel[t]} theme. Switch to ${themeLabel[other]}`);
    $('meta[name="theme-color"]').content = THEME_COLOR[t];
  }

  function setTheme(t) {
    if (t === root.dataset.theme) return;
    store.set(THEME_KEY, t);
    if (document.startViewTransition && !reduceMotion.matches) document.startViewTransition(() => applyTheme(t));
    else applyTheme(t);
  }
  const toggleTheme = () => setTheme(root.dataset.theme === '98' ? 'aero' : '98');

  /* ---------- window ---------- */

  const win = $('#win');
  const task = $('#taskWin');
  const deskIcon = $('#deskIcon');
  const maxBtn = $('.cap-max', win);

  function setActive(on) {
    win.classList.toggle('is-inactive', !on);
    task.setAttribute('aria-pressed', String(on && !win.hidden));
  }
  function openWin() {
    win.hidden = false;
    task.hidden = false;
    body.classList.remove('win-hidden');
    setActive(true);
    win.focus({ preventScroll: true });
  }
  function minimizeWin() {
    win.hidden = true;
    body.classList.add('win-hidden');
    setActive(false);
  }
  function closeWin() {
    minimizeWin();
    task.hidden = true;
    win.classList.remove('is-max');
    win.style.removeProperty('--dx');
    win.style.removeProperty('--dy');
    syncMaxBtn();
  }
  function toggleMax() {
    win.classList.toggle('is-max');
    syncMaxBtn();
  }
  function syncMaxBtn() {
    maxBtn.setAttribute('aria-label', win.classList.contains('is-max') ? 'Restore' : 'Maximize');
  }

  $('.cap-min', win).addEventListener('click', minimizeWin);
  $('.cap-close', win).addEventListener('click', closeWin);
  maxBtn.addEventListener('click', toggleMax);
  win.addEventListener('focusin', () => setActive(true));

  task.addEventListener('click', () => {
    if (win.hidden) openWin();
    else if (win.classList.contains('is-inactive')) { setActive(true); win.focus({ preventScroll: true }); }
    else minimizeWin();
  });

  // clicking outside the window makes its title bar "inactive", like Windows
  let lastPointer = 'mouse';
  document.addEventListener('pointerdown', (e) => {
    lastPointer = e.pointerType || 'mouse';
    if (!task.contains(e.target) && !win.hidden) setActive(win.contains(e.target));
    if (!deskIcon.contains(e.target)) deskIcon.classList.remove('is-selected');
  }, true);

  // mouse: one click selects, two open. Touch and keyboard: open right away
  deskIcon.addEventListener('click', (e) => {
    if (e.detail === 0 || lastPointer !== 'mouse') openWin();
    else deskIcon.classList.add('is-selected');
  });
  deskIcon.addEventListener('dblclick', openWin);

  // drag by the title bar (wide screens only)
  const bar = $('.titlebar', win);
  const wide = matchMedia('(min-width: 700px)');
  let drag = null;
  bar.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('button') || win.classList.contains('is-max') || !wide.matches) return;
    const r = win.getBoundingClientRect();
    const dx = parseFloat(win.style.getPropertyValue('--dx')) || 0;
    const dy = parseFloat(win.style.getPropertyValue('--dy')) || 0;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, dx, dy, left: r.left - dx, top: r.top - dy, w: r.width };
    bar.setPointerCapture(e.pointerId);
  });
  bar.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const floor = $('.taskbar').getBoundingClientRect().top - 34;
    const left = clamp(drag.left + drag.dx + e.clientX - drag.x, 90 - drag.w, innerWidth - 90);
    const top = clamp(drag.top + drag.dy + e.clientY - drag.y, 0, floor);
    win.style.setProperty('--dx', `${left - drag.left}px`);
    win.style.setProperty('--dy', `${top - drag.top}px`);
  });
  const endDrag = (e) => { if (drag && e.pointerId === drag.id) drag = null; };
  bar.addEventListener('pointerup', endDrag);
  bar.addEventListener('pointercancel', endDrag);
  bar.addEventListener('dblclick', (e) => { if (!e.target.closest('button')) toggleMax(); });
  wide.addEventListener('change', () => {
    win.style.removeProperty('--dx');
    win.style.removeProperty('--dy');
  });

  /* ---------- menus (menu bar and Start) ---------- */

  let open = null; // { btn, pop }

  const itemsOf = (pop) => $$('[role^="menuitem"]', pop);

  function openPopup(btn, pop, focusFirst) {
    closePopup();
    btn.setAttribute('aria-expanded', 'true');
    pop.hidden = false;
    open = { btn, pop };
    if (focusFirst) itemsOf(pop)[0]?.focus();
  }
  function closePopup(returnFocus) {
    if (!open) return;
    const { btn, pop } = open;
    btn.setAttribute('aria-expanded', 'false');
    pop.hidden = true;
    open = null;
    if (returnFocus) btn.focus();
  }

  for (const menu of $$('.menu')) {
    const btn = $('.menu-btn', menu);
    const pop = $('.menu-pop', menu);
    btn.addEventListener('click', (e) => {
      if (open?.pop === pop) closePopup();
      else openPopup(btn, pop, e.detail === 0);
    });
    // with one menu open, hovering another one switches to it, like Windows
    btn.addEventListener('pointerenter', () => {
      if (open && open.pop !== pop && open.pop.classList.contains('menu-pop')) openPopup(btn, pop, false);
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); openPopup(btn, pop, true); }
    });
  }

  const startBtn = $('#startBtn');
  const startMenu = $('#startMenu');
  startBtn.addEventListener('click', (e) => {
    if (open?.pop === startMenu) closePopup();
    else openPopup(startBtn, startMenu, e.detail === 0);
  });

  document.addEventListener('pointerdown', (e) => {
    if (open && !open.pop.contains(e.target) && !open.btn.contains(e.target)) closePopup();
  });

  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); closePopup(true); return; }
    if (e.key === 'Tab') { closePopup(); return; }
    const items = itemsOf(open.pop);
    const i = items.indexOf(document.activeElement);
    let next = -1;
    if (e.key === 'ArrowDown') next = (i + 1) % items.length;
    else if (e.key === 'ArrowUp') next = (i - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    if (next >= 0) { e.preventDefault(); items[next].focus(); }
  });

  /* ---------- actions ---------- */

  const aboutDlg = $('#aboutDlg');
  const shutdownDlg = $('#shutdownDlg');

  function openDialog(dlg) {
    dlg.returnValue = '';
    dlg.showModal();
  }

  const actions = {
    about: () => openDialog(aboutDlg),
    shutdown: () => openDialog(shutdownDlg),
    theme: toggleTheme,
    close: closeWin,
  };

  document.addEventListener('click', (e) => {
    const themeItem = e.target.closest('[data-set-theme]');
    const actionItem = e.target.closest('[data-action]');
    if (themeItem) { closePopup(); setTheme(themeItem.dataset.setTheme); }
    else if (actionItem) { closePopup(); actions[actionItem.dataset.action]?.(); }
    else if (e.target.closest('.start-menu a')) closePopup();
  });

  trayTheme.addEventListener('click', toggleTheme);
  for (const b of $$('dialog [data-close]')) b.addEventListener('click', () => b.closest('dialog').close());

  /* ---------- shut down / restart ---------- */

  const power = $('#power');
  let powerBusy = false;

  async function boot() {
    powerBusy = true;
    power.dataset.phase = 'boot';
    await wait(1900);
    power.hidden = true;
    powerBusy = false;
    openWin();
  }

  async function powerCycle(kind) {
    powerBusy = true;
    $('#powerMsg').textContent = kind === 'restart' ? 'Restarting...' : 'Shutting down...';
    power.dataset.phase = 'busy';
    power.hidden = false;
    power.focus();
    await wait(1400);
    if (kind === 'restart') return boot();
    power.dataset.phase = 'off';
    powerBusy = false;
  }

  shutdownDlg.addEventListener('close', () => {
    if (shutdownDlg.returnValue !== 'ok') return;
    powerCycle(new FormData($('form', shutdownDlg)).get('sd'));
  });
  power.addEventListener('click', () => {
    if (!powerBusy && power.dataset.phase === 'off') boot();
  });
  power.addEventListener('keydown', (e) => {
    if (!powerBusy && power.dataset.phase === 'off' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      boot();
    }
  });

  /* ---------- clock ---------- */

  const clock = $('#clock');
  const fmtTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
  const fmtDate = new Intl.DateTimeFormat('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  const fmtLong = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  function tick() {
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.title = fmtLong.format(now);
    clock.innerHTML = `<span class="clock-time">${fmtTime.format(now)}</span><span class="clock-date">${fmtDate.format(now)}</span>`;
  }

  /* ---------- Twitch live notice ----------
     decapi.me answers in plain text: "drooxdroox is offline" or how long
     the stream has been up ("1 hour, 5 minutes"). ?live in the URL fakes one. */

  async function checkLive() {
    let title = '';
    if (!params.has('live')) {
      try {
        const res = await fetch(`https://decapi.me/twitch/uptime/${TWITCH_USER}`, { cache: 'no-store' });
        const text = (await res.text()).trim();
        if (!res.ok || !/\d+\s*(second|minute|hour|day)/i.test(text)) return;
        const t = await fetch(`https://decapi.me/twitch/title/${TWITCH_USER}`, { cache: 'no-store' });
        if (t.ok) title = (await t.text()).trim();
      } catch {
        return; // offline or the API is down: just show nothing
      }
    } else {
      title = 'test stream title';
    }
    for (const el of $$('.live-badge, .live-line, #trayLive')) el.hidden = false;
    const balloon = $('#balloon');
    const titleEl = $('#balloonTitle');
    titleEl.textContent = title;
    titleEl.hidden = !title;
    balloon.hidden = false;
    $('.balloon-x', balloon).addEventListener('click', () => { balloon.hidden = true; });
    setTimeout(() => { balloon.hidden = true; }, 12000);
  }

  /* ---------- start up ---------- */

  const urlTheme = params.get('theme');
  applyTheme(urlTheme === 'aero' || urlTheme === '98' ? urlTheme : (root.dataset.theme === 'aero' ? 'aero' : '98'));
  mountIcons();
  tick();
  setInterval(tick, 10000);
  setActive(true);
  checkLive();
})();
