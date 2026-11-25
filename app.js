/* Pulse site — no build step, no libraries */
(() => {
  const REPO = 'Blank0321/pulse-releases';
  const RELEASES = `https://github.com/${REPO}/releases`;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };

  /* ---------------- i18n ---------------- */
  const RU = {
    'nav.scenes': 'сцены', 'nav.features': 'фишки', 'nav.install': 'установка', 'nav.updates': 'обновления', 'nav.faq': 'вопросы', 'nav.get': 'скачать',
    'hero.kicker': 'бесплатно · windows · без рекламы',
    'hero.h1a': 'твоя музыка.', 'hero.h1b': 'но звучит иначе.',
    'hero.sub': 'Плеер для Windows для твоих треков. 3D-сцены, которые двигаются под бит, караоке-субтитры и ИИ-помощник, который знает твой вкус. Без подписок и рекламы.',
    'hero.dl': 'Скачать для Windows', 'hero.beat': 'включить бит',
    'hero.hint': 'эта капля — одна из сцен в приложении. Нажми «включить бит» и посмотри, как она качает.',
    'mq': '3D-сцены ✦ караоке ✦ ИИ-помощник ✦ мини-плеер ✦ синхронизация через Google Диск ✦ статус в Discord ✦ медиаклавиши ✦ без пауз между треками ✦ эквалайзер ✦ автообновления ✦ ',
    'sc.eyebrow': 'сейчас играет', 'sc.h': 'девять миров. каждый качает под твой трек.',
    'sc.lead': 'Выбери настроение — сцена дышит в такт басу, а текст плывёт поверх, как в клипе. Или загрузи свою 3D-модель.',
    'ft.eyebrow': 'что внутри', 'ft.h': 'всё, что давно должно было быть в плеере.',
    'f.lyr.h': 'караоке, которое попадает в такт', 'f.lyr.p': 'Pulse сам находит текст и подсвечивает строку за строкой. Нажми на строку — перемотает туда. Чуть убегает? Поправь скорость — запомнится для этой песни.',
    'f.ai.q': 'включи что-нибудь для зала', 'f.ai.a': 'погнали 💪 перемешал самое жёсткое, сделал погромче',
    'f.ai.h': 'ИИ-помощник', 'f.ai.p': 'Пиши ему как другу. Он знает твою медиатеку и само приложение: включает песни, меняет настройки, ищет новости про твоих артистов и даёт совет дня. Можно дать ему имя и аватарку.',
    'f.mini.h': 'мини-плеер', 'f.mini.p': 'Свернул Pulse — в углу появляется тонкая плашка: обложка, название, кнопки. Перетащи куда удобно, она там и останется.',
    'f.sync.h': 'всё переезжает с тобой', 'f.sync.p': 'Войди через Google — песни, плейлисты и настройки появятся на другом компьютере. Хранятся на твоём Google Диске, а не на чужом сервере.',
    'f.dc.l': 'слушает Pulse', 'f.dc.h': 'статус в Discord', 'f.dc.p': 'Друзья видят, что у тебя играет. Не хочешь светить? Показывай только исполнителя или просто «слушает».',
    'f.keys.h': 'медиаклавиши и горячие клавиши', 'f.keys.p': 'Медиаклавиши на клавиатуре, окошко Windows над громкостью с обложкой, свои глобальные сочетания — работают даже в игре.',
    'f.snd.h': 'звук как надо', 'f.snd.p': 'Без пауз между треками, плавный переход, эквалайзер, усиление басов, выравнивание громкости, скорость до 3×, повтор A–B, таймер сна.',
    'f.fix.h': 'наводит порядок', 'f.fix.p': 'Кривые имена файлов превращаются в нормальные названия с обложками. Находит дубликаты, импортирует плейлисты из Spotify и Яндекса, делает mp3 из видео. Умное перемешивание, которое не крутит одни и те же 5 песен.',
    'in.eyebrow': 'установка', 'in.h': 'запуск за минуту.',
    'in.1h': 'скачай', 'in.1p': 'Жми кнопку — скачается один небольшой файл (~5 МБ).',
    'in.2h': 'Windows может напрячься', 'in.2p': 'Может появиться синее окно «Система Windows защитила ваш компьютер» — это потому, что Pulse новый и маленький. Нажми <b>Подробнее</b> → <b>Выполнить в любом случае</b>.',
    'in.3h': 'выбери музыку', 'in.3p': 'Укажи папку с музыкой (или войди через Google). Готово. Дальше обновления ставятся сами.',
    'up.eyebrow': 'обновления', 'up.h': 'обновляемся часто.', 'up.lead': 'Pulse обновляется сам — что нового, покажет прямо в приложении.',
    'up.loading': 'загружаю…', 'up.all': 'все версии на GitHub →', 'up.latest': 'последняя', 'up.fail': 'Не получилось загрузить список — посмотри на GitHub.',
    'fq.h': 'вопросы и ответы.',
    'q1': 'Это бесплатно?', 'a1': 'Да. Бесплатно, без рекламы, без подписки и без обязательного аккаунта.',
    'q2': 'Откуда берётся музыка?', 'a2': 'Из твоих файлов — mp3, flac, m4a, wav, ogg и других. Pulse — это плеер, он не качает музыку с YouTube или стримингов.',
    'q3': 'Windows пишет, что это небезопасно — что делать?', 'a3': 'Windows предупреждает про любое новое приложение без дорогого сертификата подписи. Нажми «Подробнее» → «Выполнить в любом случае». Обновления подписаны: приложение принимает только настоящие обновления Pulse.',
    'q4': 'Что нужно для работы?', 'a4': 'Windows 10 или 11, 64-бит. Пойдёт на любом нормальном компьютере; 3D-сценам лучше с видеокартой, а для старых ноутбуков есть «простой» режим.',
    'q5': 'А на телефон? На Mac?', 'a5': 'Уже в работе: сначала Android, потом iPhone, потом Mac.',
    'q6': 'Где хранятся мои данные?', 'a6': 'На твоём компьютере. Если войти через Google, копия ляжет на твой же Google Диск, чтобы переехать на другой компьютер. Ничего не продаётся и не отслеживается.',
    'q7': 'Как работают обновления?', 'a7': 'Pulse проверяет обновления при запуске. Один клик — он обновится и перезапустится, музыка и настройки остаются.',
    'q8': 'Можно скрыть в Discord, что я слушаю?', 'a8': 'Конечно: Настройки → Discord. Показывать трек, только исполнителя, просто «слушает» или выключить совсем.',
    'fin.a': 'сделай погромче.',
    'ft.priv': 'конфиденциальность', 'ft.ver': 'все версии', 'ft.made': 'сделано с любовью и с перебором баса.',
    'toast.dl': 'Скачивается. Если Windows спросит — «Подробнее» → «Выполнить в любом случае».',
    'meta.title': 'Pulse — твоя музыка, но звучит иначе',
  };
  const EN = { 'up.latest': 'latest', 'up.fail': "Couldn't load the list — check GitHub.", 'toast.dl': "Downloading. If Windows gets shy: More info → Run anyway.", 'meta.title': document.title };
  $$('[data-i18n]').forEach((el) => { EN[el.dataset.i18n] ??= el.innerHTML; });

  const qLang = new URLSearchParams(location.search).get('lang');
  let lang = (qLang === 'ru' || qLang === 'en') ? qLang : (store.get('pulse-lang') || 'en');
  const t = (k) => (lang === 'ru' ? RU[k] : EN[k]) ?? EN[k] ?? k;

  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (v != null) el.innerHTML = v; });
    $$('.lang button').forEach((b) => b.classList.toggle('on', b.dataset.lang === lang));
    document.title = t('meta.title');
    $$('.lang-link').forEach((a) => { a.href = 'privacy.html' + (lang === 'ru' ? '?lang=ru' : ''); });
    renderPills();
    renderReleases();
    renderDlMeta();
  }
  $$('.lang button').forEach((b) => b.addEventListener('click', () => {
    lang = b.dataset.lang; store.set('pulse-lang', lang);
    const u = new URL(location.href); u.searchParams.delete('lang'); history.replaceState(null, '', u);
    applyLang();
  }));

  /* ---------------- download link ---------------- */
  let dlUrl = null, dlRel = null;
  function renderDlMeta() {
    if (!dlRel) return;
    const mb = (dlRel.size / 1048576).toFixed(1);
    $$('.dl-meta').forEach((s) => {
      s.textContent = lang === 'ru' ? `${dlRel.ver} · 64 бит · ${mb.replace('.', ',')} МБ · Windows 10 / 11` : `${dlRel.ver} · 64-bit · ${mb} MB · Windows 10 / 11`;
    });
  }
  async function resolveDownload() {
    try {
      let rel;
      const cached = sessionStorage.getItem('pulse-rel');
      if (cached) rel = JSON.parse(cached);
      else {
        const r = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: 'application/vnd.github+json' } });
        if (!r.ok) throw new Error(r.status);
        const j = await r.json();
        const a = j.assets.find((x) => /x64-setup\.exe$/i.test(x.name)) || j.assets.find((x) => /\.exe$/i.test(x.name));
        if (!a) throw new Error('no exe');
        rel = { url: a.browser_download_url, ver: j.tag_name, size: a.size };
        try { sessionStorage.setItem('pulse-rel', JSON.stringify(rel)); } catch { /* ignore */ }
      }
      dlUrl = rel.url;
      dlRel = rel;
      $$('.dl-link').forEach((a) => { a.href = rel.url; });
      renderDlMeta();
    } catch { /* keep the fallback link to the releases page */ }
  }
  $$('.dl-link').forEach((a) => a.addEventListener('click', () => { if (dlUrl) toast(t('toast.dl')); }));

  function toast(msg) {
    let el = $('.toast');
    if (!el) {
      el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = msg; el.classList.add('show');
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 7000);
  }

  /* ---------------- release notes ---------------- */
  let releases = null, relFailed = false;
  async function loadReleases() {
    try {
      const r = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=5`, { headers: { Accept: 'application/vnd.github+json' } });
      if (!r.ok) throw new Error(r.status);
      releases = (await r.json()).filter((x) => !x.draft && !x.prerelease).slice(0, 4);
    } catch { relFailed = true; }
    renderReleases();
  }
  function renderReleases() {
    const box = $('#rel');
    if (!box) return;
    if (relFailed) { box.innerHTML = `<p class="muted">${t('up.fail')}</p>`; jumpToHash(); return; }
    if (!releases) return;
    const fmt = new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    box.innerHTML = '';
    releases.forEach((x, i) => {
      const items = (x.body || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => /^[•\-*]\s+/.test(l)).map((l) => l.replace(/^[•\-*]\s+/, ''));
      const card = document.createElement('article');
      card.className = 'rel reveal in';
      const left = document.createElement('div');
      const h = document.createElement('h3'); h.textContent = x.tag_name; left.appendChild(h);
      const tm = document.createElement('time'); tm.dateTime = x.published_at; tm.textContent = fmt.format(new Date(x.published_at)); left.appendChild(tm);
      if (i === 0) { const tg = document.createElement('span'); tg.className = 'tag'; tg.textContent = t('up.latest'); left.appendChild(tg); }
      const ul = document.createElement('ul');
      (items.length ? items : [x.name || x.tag_name]).forEach((s) => { const li = document.createElement('li'); li.textContent = s; ul.appendChild(li); });
      card.append(left, ul);
      box.appendChild(card);
    });
    jumpToHash();
  }
  // the app opens the site at #updates; the list loads late, so scroll there once it's in
  let jumped = false;
  function jumpToHash() {
    if (jumped || !location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (!el) return;
    jumped = true;
    setTimeout(() => el.scrollIntoView({ behavior: 'instant', block: 'start' }), 60);
  }

  /* ---------------- scenes gallery ---------------- */
  const SCENES = [
    ['chrome', 'Liquid chrome', 'Жидкий хром'], ['monoliths', 'Monoliths', 'Монолиты'], ['water', 'Water', 'Вода'],
    ['crystal', 'Crystal', 'Кристалл'], ['sphere', 'Sphere', 'Сфера'], ['cubes', 'Cubes', 'Кубы'],
    ['turntable', 'Turntable', 'Проигрыватель'], ['subwoofer', 'Subwoofer', 'Сабвуфер'], ['calm', 'Calm', 'Спокойный'],
  ];
  const shots = $('#shots'), pills = $('#pills');
  let cur = 0, timer = 0, paused = false;
  const DUR = 4500;
  SCENES.forEach(([k], i) => {
    const img = new Image();
    img.alt = ''; img.decoding = 'async';
    img.loading = i < 2 ? 'eager' : 'lazy';
    img.src = `assets/now-${k}.webp`;
    img.width = 1600; img.height = 1000;
    shots.appendChild(img);
  });
  function renderPills() {
    pills.innerHTML = '';
    SCENES.forEach(([, en, ru], i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.role = 'tab'; b.textContent = lang === 'ru' ? ru : en;
      b.setAttribute('aria-selected', String(i === cur));
      if (i === cur) b.classList.add('on');
      b.style.setProperty('--dur', DUR + 'ms');
      b.addEventListener('click', () => { paused = true; pills.classList.add('paused'); show(i); });
      pills.appendChild(b);
    });
    $('#sceneTitle').textContent = lang === 'ru' ? SCENES[cur][2] : SCENES[cur][1];
  }
  function show(i) {
    cur = (i + SCENES.length) % SCENES.length;
    $$('img', shots).forEach((im, j) => im.classList.toggle('on', j === cur));
    $$('button', pills).forEach((b, j) => {
      b.classList.toggle('on', j === cur); b.setAttribute('aria-selected', String(j === cur));
      if (j === cur) { b.style.animation = 'none'; void b.offsetWidth; b.style.animation = ''; }
    });
    $('#sceneTitle').textContent = lang === 'ru' ? SCENES[cur][2] : SCENES[cur][1];
    clearTimeout(timer);
    if (!paused && !reduce) timer = setTimeout(() => { if (galleryVisible) show(cur + 1); else waitingNext = true; }, DUR);
  }
  let galleryVisible = false, waitingNext = false;
  new IntersectionObserver(([e]) => {
    galleryVisible = e.isIntersecting;
    if (galleryVisible && waitingNext) { waitingNext = false; show(cur + 1); }
  }).observe(shots);

  /* scroll: tilt the app window flat as it comes into view; hide nav on scroll down */
  const stage = $('#stage'), nav = $('.nav');
  let lastY = scrollY, ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY;
    nav.classList.toggle('hide', y > 400 && y > lastY + 4);
    if (y < lastY - 4 || y < 400) nav.classList.remove('hide');
    lastY = y;
    if (!reduce && innerWidth > 680) {
      const r = stage.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, 1 - (r.top - innerHeight * 0.12) / (innerHeight * 0.75)));
      const e = 1 - Math.pow(1 - p, 3);
      stage.style.setProperty('--rx', (28 * (1 - e)).toFixed(2) + 'deg');
      stage.style.setProperty('--s', (0.86 + 0.14 * e).toFixed(4));
    }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* reveal on scroll */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  /* lyrics viz: move the lit line */
  const lyr = $$('.lyr p');
  let li = 1;
  if (!reduce) setInterval(() => { lyr.forEach((p) => p.classList.remove('cur')); li = (li + 1) % lyr.length; lyr[li].classList.add('cur'); }, 1600);

  /* pointer: glow, card spotlight, magnetic buttons */
  const glow = $('.cursor-glow');
  const fine = matchMedia('(pointer: fine)').matches;
  let mx = 0, my = 0;
  if (fine && !reduce) {
    addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      glow.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    }, { passive: true });
    $$('.card').forEach((c) => c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--px', (e.clientX - r.left) + 'px'); c.style.setProperty('--py', (e.clientY - r.top) + 'px');
    }));
    $$('.magnet').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + 'px');
        b.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px');
      });
      b.addEventListener('pointerleave', () => { b.style.setProperty('--mx', '0px'); b.style.setProperty('--my', '0px'); });
    });
  }

  /* ---------------- beat (Web Audio, synthesized on the fly) ---------------- */
  const audio = { ctx: null, an: null, master: null, on: false, timer: 0, next: 0, step: 0, noise: null, data: null };
  const BPM = 128, S16 = 60 / BPM / 4;
  const CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]; // Am F C G
  const ROOTS = [45, 41, 36, 43];
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function initAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    const ctx = new AC();
    const master = ctx.createGain(); master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
    const an = ctx.createAnalyser(); an.fftSize = 256; an.smoothingTimeConstant = 0.72;
    master.connect(comp).connect(an).connect(ctx.destination);
    const len = ctx.sampleRate;
    const nb = ctx.createBuffer(1, len, ctx.sampleRate); const d = nb.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    Object.assign(audio, { ctx, master, an, noise: nb, data: new Uint8Array(an.frequencyBinCount) });
    return true;
  }
  function env(g, t, a, peak, dec) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); }
  function kick(t) {
    const { ctx, master } = audio; const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(170, t); o.frequency.exponentialRampToValueAtTime(44, t + 0.11);
    env(g, t, 0.002, 1, 0.42); o.connect(g).connect(master); o.start(t); o.stop(t + 0.5);
  }
  function noiseHit(t, type, f, q, peak, dec) {
    const { ctx, master, noise } = audio; const s = ctx.createBufferSource(); s.buffer = noise;
    const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    const g = ctx.createGain(); env(g, t, 0.001, peak, dec);
    s.connect(fl).connect(g).connect(master); s.start(t, Math.random() * 0.5); s.stop(t + dec + 0.05);
  }
  function synth(t, midi, type, cutoff, peak, a, dec, detune = 0) {
    const { ctx, master } = audio; const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    o.type = type; o.frequency.value = hz(midi); o.detune.value = detune;
    f.type = 'lowpass'; f.frequency.setValueAtTime(cutoff, t); f.frequency.exponentialRampToValueAtTime(Math.max(80, cutoff * 0.25), t + a + dec); f.Q.value = 3;
    env(g, t, a, peak, dec); o.connect(f).connect(g).connect(master); o.start(t); o.stop(t + a + dec + 0.05);
  }
  function schedule(step, t) {
    const s = step % 16, bar = Math.floor(step / 16) % 4;
    if (s % 4 === 0) kick(t);
    if (s === 4 || s === 12) { noiseHit(t, 'bandpass', 1400, 0.8, 0.5, 0.16); noiseHit(t + 0.012, 'bandpass', 1800, 1, 0.3, 0.12); }
    if (s % 4 === 2) noiseHit(t, 'highpass', 7500, 0.7, 0.22, 0.09); else if (s % 2 === 1) noiseHit(t, 'highpass', 9000, 0.7, 0.07, 0.03);
    if (s % 4 === 2 || s % 4 === 3) synth(t, ROOTS[bar] + (s % 4 === 3 ? 12 : 0), 'sawtooth', 900, 0.32, 0.005, 0.14);
    if (s === 0) CHORDS[bar].forEach((m) => { synth(t, m, 'sawtooth', 1800, 0.045, 0.25, S16 * 15, -7); synth(t, m, 'sawtooth', 1800, 0.045, 0.25, S16 * 15, 7); });
    const arp = CHORDS[bar]; const n = arp[(s * 3 + (s >> 2)) % 3] + 12 + (s % 8 === 7 ? 12 : 0);
    if (s % 2 === 0 || s % 8 === 7) synth(t, n, 'triangle', 3200, 0.09, 0.003, 0.16);
  }
  function pump() {
    const { ctx } = audio;
    while (audio.next < ctx.currentTime + 0.12) { schedule(audio.step, audio.next); audio.next += S16; audio.step++; }
  }
  const beatBtn = $('#beatBtn');
  beatBtn.addEventListener('click', async () => {
    if (!audio.ctx && !initAudio()) return;
    const { ctx, master } = audio;
    if (!audio.on) {
      await ctx.resume();
      audio.on = true; audio.step = 0; audio.next = ctx.currentTime + 0.06;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime); master.gain.linearRampToValueAtTime(0.42, ctx.currentTime + 0.3);
      audio.timer = setInterval(pump, 25); pump();
    } else {
      audio.on = false; clearInterval(audio.timer);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
      setTimeout(() => { if (!audio.on) ctx.suspend(); }, 400);
    }
    beatBtn.setAttribute('aria-pressed', String(audio.on));
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && audio.on) beatBtn.click(); });

  /* ---------------- equalizer bars along the hero bottom ---------------- */
  const barsEl = $('#bars');
  const NB = innerWidth < 680 ? 32 : 64;
  for (let i = 0; i < NB; i++) barsEl.appendChild(document.createElement('i'));
  const barEls = [...barsEl.children];

  /* ---------------- hero blob (WebGL raymarched liquid chrome) ---------------- */
  const cv = $('#blob');
  const gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FS = `precision highp float;
uniform vec2 uRes;uniform float uT;uniform vec2 uM;uniform float uB;uniform float uL;uniform vec2 uC;uniform float uZ;
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float map(vec3 p){
  float d=1e3;float t=uT*.55;float s=1.+uB*.16;
  for(int i=0;i<6;i++){float fi=float(i);
    vec3 c=vec3(sin(t*.9+fi*1.7)*.5,cos(t*.7+fi*2.3)*.36,sin(t*.5+fi*1.1)*.4)*(1.+uB*.12);
    float r=(.36+.09*sin(fi*3.1+t*1.3))*s;
    d=smin(d,length(p-c)-r,.42);}
  d+=.022*sin(p.x*7.+uT*2.)*sin(p.y*6.+uT*1.7)*sin(p.z*8.+uT)*(1.+uL*3.);
  return d;}
vec3 nrm(vec3 p){vec2 e=vec2(.0025,0.);return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));}
vec3 env(vec3 r){
  float y=r.y;vec3 col=mix(vec3(.015,.01,.03),vec3(.07,.035,.14),smoothstep(-1.,1.,y));
  col+=vec3(.55,.25,.95)*pow(max(0.,1.-abs(y+.08)*3.5),3.)*.7;
  col+=vec3(1.,.96,1.)*smoothstep(.8,.97,y)*1.05;
  col+=vec3(.9,.8,1.)*smoothstep(.9,.99,-r.z)*smoothstep(.0,.5,y)*.35;
  float a=atan(r.z,r.x);
  col+=vec3(1.,.38,.82)*smoothstep(.955,1.,sin(a*3.+uT*.25))*smoothstep(-.4,.5,y)*1.1;
  col+=vec3(.55,.62,1.)*smoothstep(.98,1.,sin(a*5.-uT*.18+1.))*.7;
  return col;}
void main(){
  vec2 uv=((gl_FragCoord.xy-.5*uRes)/uRes.y-uC)*uZ;
  vec3 ro=vec3(0.,0.,6.);vec3 rd=normalize(vec3(uv,-2.05));
  float ay=uM.x*.6+uT*.08,ax=uM.y*.4;
  float cy=cos(ay),sy=sin(ay),cx=cos(ax),sx=sin(ax);
  ro.xz=vec2(cy*ro.x-sy*ro.z,sy*ro.x+cy*ro.z);rd.xz=vec2(cy*rd.x-sy*rd.z,sy*rd.x+cy*rd.z);
  ro.yz=vec2(cx*ro.y-sx*ro.z,sx*ro.y+cx*ro.z);rd.yz=vec2(cx*rd.y-sx*rd.z,sx*rd.y+cx*rd.z);
  vec3 bg=vec3(.027,.024,.047);
  float gw=exp(-2.6*length(uv*vec2(.85,1.1)));
  bg+=vec3(.34,.14,.62)*gw*(.22+uB*.4);
  vec3 col=bg;
  float b=dot(ro,rd);float c=dot(ro,ro)-2.1*2.1;float h=b*b-c;
  if(h>0.){
    float t=max(0.,-b-sqrt(h));bool hit=false;
    for(int i=0;i<70;i++){float d=map(ro+rd*t);if(d<.0015){hit=true;break;}t+=d*.92;if(t>9.)break;}
    if(hit){vec3 p=ro+rd*t;vec3 n=nrm(p);vec3 r=reflect(rd,n);
      float fr=pow(1.-max(0.,dot(n,-rd)),3.);
      col=env(r)*.95;
      col=mix(col,vec3(.72,.34,1.)*1.15,fr*.5);
      col+=vec3(1.,.42,.85)*fr*fr*uB*.9;}
  }
  vec2 q=gl_FragCoord.xy/uRes;col*=1.-.6*dot(q-.5,q-.5);
  gl_FragColor=vec4(pow(col,vec3(.92)),1.);}`;

  function makeGL() {
    if (!gl) return null;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; } return s; };
    const v = sh(gl.VERTEX_SHADER, VS), f = sh(gl.FRAGMENT_SHADER, FS);
    if (!v || !f) return null;
    const pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
    gl.useProgram(pr);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = {}; ['uRes', 'uT', 'uM', 'uB', 'uL', 'uC', 'uZ'].forEach((n) => { u[n] = gl.getUniformLocation(pr, n); });
    return u;
  }
  const U = makeGL();
  if (!U) document.body.classList.add('nogl');

  let scale = Math.min(devicePixelRatio || 1, 1.5) * 0.75, W = 0, H = 0;
  function resize() {
    const w = cv.clientWidth, h = cv.clientHeight;
    W = Math.max(1, Math.round(w * scale)); H = Math.max(1, Math.round(h * scale));
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    if (U) gl.viewport(0, 0, W, H);
  }
  addEventListener('resize', resize);
  resize();

  let heroVisible = true;
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(cv);

  let beat = 0, level = 0, smx = 0, smy = 0, frames = 0, acc = 0, slowN = 0, lastT = performance.now();
  const t0 = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = now - lastT; lastT = now;
    // sound → blob + bars
    let bass = 0, lvl = 0;
    if (audio.on && audio.an) {
      audio.an.getByteFrequencyData(audio.data);
      for (let i = 1; i < 5; i++) bass += audio.data[i]; bass /= 4 * 255;
      for (let i = 0; i < 64; i++) lvl += audio.data[i]; lvl /= 64 * 255;
      bass = Math.max(0, (bass - 0.55) / 0.45);
      for (let i = 0; i < barEls.length; i++) {
        const f = i / barEls.length, k = Math.floor(Math.pow(f, 1.5) * 46) + 1;
        barEls[i].style.height = (4 + Math.min(1, audio.data[k] / 255 * (1 + f * 1.4)) * 66).toFixed(1) + 'px';
      }
    } else {
      const tt = (now - t0) / 1000;
      bass = 0.18 + 0.12 * Math.sin(tt * 1.6);
      if (frames % 3 === 0) for (let i = 0; i < barEls.length; i++) barEls[i].style.height = (4 + 10 * (0.5 + 0.5 * Math.sin(tt * 2 + i * 0.35))).toFixed(1) + 'px';
    }
    beat += (bass - beat) * (bass > beat ? 0.55 : 0.12);
    level += (lvl - level) * 0.2;
    if (!U || !heroVisible) return;
    if (fine && !reduce) { smx += ((mx / innerWidth - 0.5) - smx) * 0.05; smy += ((my / innerHeight - 0.5) - smy) * 0.05; }
    const wide = W / H > 1.1;
    gl.uniform2f(U.uRes, W, H);
    gl.uniform1f(U.uT, reduce ? 12 : (now - t0) / 1000);
    gl.uniform2f(U.uM, smx, smy);
    gl.uniform1f(U.uB, beat);
    gl.uniform1f(U.uL, level);
    // on a tall phone screen the blob sits up top, smaller, behind the headline
    gl.uniform2f(U.uC, wide ? 0.5 * Math.min(1, (W / H) / 1.78) : 0, wide ? 0.0 : 0.17);
    gl.uniform1f(U.uZ, wide ? 1 : Math.min(2.4, 0.95 * H / W));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // adaptive resolution: keep it smooth on weak GPUs
    // (frames over 100 ms are a hidden tab or a hiccup, not a slow GPU — ignore them)
    frames++;
    if (dt < 100) { acc += dt; slowN++; }
    if (slowN >= 40) {
      const avg = acc / slowN; acc = 0; slowN = 0;
      if (avg > 24 && scale > 0.35) { scale = Math.max(0.35, scale - 0.12); resize(); }
      else if (avg < 13 && scale < Math.min(devicePixelRatio || 1, 1.5)) { scale = Math.min(Math.min(devicePixelRatio || 1, 1.5), scale + 0.08); resize(); }
    }
  }
  requestAnimationFrame(frame);

  /* go */
  applyLang();
  show(0);
  resolveDownload();
  loadReleases();
  requestAnimationFrame(() => { document.body.classList.add('loaded'); onScroll(); });
})();
