/* For Dad - the whole experience, in one small script.
   Stops: gift -> envelope + card -> the car -> the road, stop by stop -> the finale.
   No libraries, no network calls, nothing recorded. */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var wait = function (ms) { return new Promise(function (res) { setTimeout(res, ms); }); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var T = function (ms) { return reduceMotion ? Math.min(ms, 200) : ms; };

  /* ---------------- haptics ---------------- */
  function buzz(pattern) {
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {}
  }

  /* ---------------- sound (synthesised, nothing to download) ---------------- */
  var Sfx = {
    ctx: null, master: null, muted: false, ready: false,
    init: function () {
      if (this.ctx) return;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted ? 0 : 0.5;
        this.master.connect(this.ctx.destination);
        this.ready = true;
      } catch (e) { this.ctx = null; }
    },
    resume: function () { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },
    setMuted: function (m) {
      this.muted = m;
      if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.5, this.ctx.currentTime, 0.03);
    },
    tone: function (freq, at, dur, type, vol, slideTo) {
      if (!this.ready) return;
      var c = this.ctx, o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, at);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, at + dur);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(vol || 0.15, at + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      o.connect(g); g.connect(this.master);
      o.start(at); o.stop(at + dur + 0.05);
    },
    noise: function (at, dur, freq, q, vol, type) {
      if (!this.ready) return;
      var c = this.ctx, len = Math.ceil(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      var src = c.createBufferSource(); src.buffer = buf;
      var f = c.createBiquadFilter(); f.type = type || 'bandpass'; f.frequency.value = freq; f.Q.value = q;
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(vol, at + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      src.connect(f); f.connect(g); g.connect(this.master);
      src.start(at); src.stop(at + dur + 0.05);
    },
    now: function () { return this.ctx ? this.ctx.currentTime : 0; },
    shimmer: function () { var t = this.now(); this.tone(420, t, 0.6, 'sine', 0.08, 1680); this.noise(t, 0.5, 3200, 0.8, 0.05, 'highpass'); },
    chime: function () {
      var t = this.now(), notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      for (var i = 0; i < notes.length; i++) { this.tone(notes[i], t + i * 0.11, 2.2, 'sine', 0.11); this.tone(notes[i] * 2, t + i * 0.11, 0.9, 'sine', 0.025); }
    },
    paper: function () { var t = this.now(); this.noise(t, 0.38, 2200, 0.6, 0.07); this.noise(t + 0.18, 0.3, 900, 1.2, 0.04); },
    engine: function () {
      if (!this.ready) return;
      var t = this.now(), c = this.ctx;
      var o = c.createOscillator(), o2 = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain();
      o.type = 'sawtooth'; o2.type = 'square';
      o.frequency.setValueAtTime(42, t); o.frequency.exponentialRampToValueAtTime(110, t + 1.6); o.frequency.exponentialRampToValueAtTime(48, t + 3.0);
      o2.frequency.setValueAtTime(84, t); o2.frequency.exponentialRampToValueAtTime(220, t + 1.6); o2.frequency.exponentialRampToValueAtTime(96, t + 3.0);
      f.type = 'lowpass'; f.frequency.setValueAtTime(160, t); f.frequency.linearRampToValueAtTime(520, t + 1.4); f.frequency.linearRampToValueAtTime(140, t + 3.2);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.9); g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
      o.connect(f); o2.connect(f); f.connect(g); g.connect(this.master);
      o.start(t); o2.start(t); o.stop(t + 3.3); o2.stop(t + 3.3);
      this.noise(t + 0.2, 2.6, 380, 0.5, 0.05, 'lowpass');
    },
    ping: function () { var t = this.now(); this.tone(1318.5, t, 0.8, 'sine', 0.045); this.tone(1975.5, t + 0.03, 0.5, 'sine', 0.015); }
  };

  var muteBtn = $('#mute');
  function setMute(m) {
    Sfx.setMuted(m);
    muteBtn.classList.toggle('is-muted', m);
    muteBtn.setAttribute('aria-pressed', String(m));
    muteBtn.setAttribute('aria-label', m ? 'Unmute sound' : 'Mute sound');
    syncMusic();
  }
  muteBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    setMute(!Sfx.muted);
  });

  /* ---------------- music for the drive (js/music.js) ---------------- */
  var Music = window.Music || null, musicBtn = $('#music-btn'), musicMenu = $('#music-menu');
  function syncMusic() {
    if (!Music) return;
    $$('[data-track]').forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-track') === Music.choice)); });
    musicBtn.classList.toggle('playing', !!Music.playing && !Sfx.muted);
  }
  function pickTrack(id) {
    if (!Music) return;
    Sfx.init(); Sfx.resume();
    if (Sfx.ctx) Music.attach(Sfx.ctx, Sfx.master);
    Music.choice = id;
    if (id !== 'off' && Sfx.muted) setMute(false);
    Music.play(id);
    syncMusic();
    buzz(6);
  }
  // Start the chosen track once the drive begins (it may already be playing if he previewed one).
  function startMusic() {
    if (!Music || Music.playing || Music.choice === 'off') return;
    if (Sfx.ctx) { Music.attach(Sfx.ctx, Sfx.master); Music.play(Music.choice); syncMusic(); }
  }
  function openMenu(open) {
    musicMenu.classList.toggle('show', open);
    musicBtn.setAttribute('aria-expanded', String(open));
  }
  if (Music) {
    Music.tracks.forEach(function (tr) {
      var li = document.createElement('li'), b = document.createElement('button');
      b.type = 'button'; b.className = 'track'; b.setAttribute('role', 'radio'); b.setAttribute('data-track', tr.id);
      b.innerHTML = '<span class="tick"></span><span class="name"></span><span class="desc"></span>';
      $('.name', b).textContent = tr.name; $('.desc', b).textContent = tr.desc;
      b.addEventListener('click', function (e) { e.stopPropagation(); pickTrack(tr.id); wait(350).then(function () { openMenu(false); }); });
      li.appendChild(b); $('#tracks').appendChild(li);
      var chip = document.createElement('button');
      chip.type = 'button'; chip.className = 'chip'; chip.setAttribute('role', 'radio'); chip.setAttribute('data-track', tr.id);
      chip.textContent = tr.name;
      chip.addEventListener('click', function (e) { e.stopPropagation(); pickTrack(tr.id); });
      $('#music-chips').appendChild(chip);
    });
    musicBtn.addEventListener('click', function (e) { e.stopPropagation(); openMenu(!musicMenu.classList.contains('show')); });
    musicMenu.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    document.addEventListener('pointerdown', function (e) {
      if (musicMenu.classList.contains('show') && !musicMenu.contains(e.target) && e.target !== musicBtn && !musicBtn.contains(e.target)) openMenu(false);
    });
    syncMusic();
  } else {
    musicBtn.hidden = true; $('.music-pick').hidden = true;
  }

  // iOS: audio can only start inside a user gesture. The first touch anywhere arms it.
  function armAudio() {
    Sfx.init(); Sfx.resume();
    if (Music && Sfx.ctx) Music.attach(Sfx.ctx, Sfx.master);
    muteBtn.classList.add('show');
    musicBtn.classList.add('show');
    document.removeEventListener('pointerdown', armAudio, true);
    document.removeEventListener('touchend', armAudio, true);
  }
  document.addEventListener('pointerdown', armAudio, true);
  document.addEventListener('touchend', armAudio, true);

  // Keep the fixed overlays from rubber-banding on iOS. The card text may scroll.
  $$('.scene').forEach(function (sc) {
    sc.addEventListener('touchmove', function (e) {
      if (!e.target.closest || !e.target.closest('.card-text, .stop-body, .plan')) e.preventDefault();
    }, { passive: false });
  });

  /* ---------------- particles on the gift scene ---------------- */
  var Fx = (function () {
    var canvas = $('#fx'), ctx = canvas.getContext('2d'), W = 0, H = 0, dpr = 1;
    var dust = [], confetti = [], running = false, last = 0;
    var GOLD = ['#f3dc9a', '#d8b25a', '#fff4d6', '#c9a24a', '#f8ead0', '#e8c977'];
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seedDust() {
      dust = [];
      var n = reduceMotion ? 0 : Math.round((W * H) / 16000);
      for (var i = 0; i < n; i++) dust.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + 0.3, a: Math.random() * 0.5 + 0.1, vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 10 - 3, p: Math.random() * Math.PI * 2 });
    }
    function burst(cx, cy) {
      var n = reduceMotion ? 40 : 220;
      for (var i = 0; i < n; i++) {
        var ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.5, sp = 380 + Math.random() * 620;
        confetti.push({
          x: cx + (Math.random() - 0.5) * 40, y: cy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
          w: 4 + Math.random() * 6, h: 2 + Math.random() * 8, rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 14,
          c: GOLD[(Math.random() * GOLD.length) | 0], life: 2.8 + Math.random() * 1.6, t: 0, circle: Math.random() < 0.25
        });
      }
    }
    function frame(now) {
      if (!running) return;
      var dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
      ctx.clearRect(0, 0, W, H);
      var i, p;
      for (i = 0; i < dust.length; i++) {
        p = dust[i]; p.p += dt; p.x += (p.vx + Math.sin(p.p) * 6) * dt; p.y += p.vy * dt;
        if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
        if (p.x < -4) p.x = W + 4; else if (p.x > W + 4) p.x = -4;
        ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(p.p * 2));
        ctx.fillStyle = '#e8c977';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      for (i = confetti.length - 1; i >= 0; i--) {
        p = confetti[i]; p.t += dt;
        if (p.t > p.life) { confetti.splice(i, 1); continue; }
        p.vy += 900 * dt; p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        var fade = p.t > p.life - 0.8 ? (p.life - p.t) / 0.8 : 1;
        ctx.globalAlpha = Math.max(0, fade);
        ctx.fillStyle = p.c;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        if (p.circle) { ctx.beginPath(); ctx.arc(0, 0, p.w * 0.4, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.scale(1, Math.abs(Math.cos(p.rot * 1.7)) * 0.8 + 0.2); ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    return {
      start: function () { resize(); seedDust(); running = true; last = performance.now(); requestAnimationFrame(frame); window.addEventListener('resize', function () { resize(); seedDust(); }); },
      stop: function () { running = false; },
      burst: burst,
      size: function () { return { w: W, h: H }; }
    };
  })();

  /* ---------------- scene 1: the present ---------------- */
  var giftScene = $('#scene-gift'), gift = $('#gift'), stage = $('#gift-stage'), giftHint = $('#gift-hint');
  var giftOpened = false, dragging = false, startY = 0, startX = 0, pull = 0;

  /* Fit the gift between the heading and the "Pull the ribbon" hint, so the bow and ribbon
     never cross "Happy birthday, Dad." on a short screen (an iPhone with Safari's bars showing,
     a small laptop window). At full size the gift reaches about UP px above its centre (bow
     lifted by a pull, plus the float) and DOWN px below it. It stays centred when there is
     room; otherwise it moves down just enough, and shrinks if it still does not fit. */
  function fitGift() {
    if (giftOpened || giftScene.hidden) return;
    var UP = 238, DOWN = 160, GAP = 16;
    var h1 = giftScene.querySelector('.top-line h1');
    if (!h1) return;
    var top = h1.getBoundingClientRect().bottom + GAP;
    var bottom = giftHint.getBoundingClientRect().top - 4;
    var H = giftScene.clientHeight;
    var full = window.matchMedia('(min-width: 900px)').matches ? 1.35 : 1;
    var s = clamp((bottom - top) / (UP + DOWN), 0.6, full);
    var dy = Math.max(0, top + UP * s - H / 2);
    giftScene.style.setProperty('--gs', s.toFixed(3));
    giftScene.style.setProperty('--gift-dy', Math.round(dy) + 'px');
  }
  fitGift();
  window.addEventListener('resize', fitGift);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitGift);

  function setParallax(nx, ny) {
    gift.style.setProperty('--ry', (nx * 16).toFixed(2) + 'deg');
    gift.style.setProperty('--rx', (-ny * 9).toFixed(2) + 'deg');
  }
  stage.addEventListener('pointermove', function (e) {
    if (giftOpened) return;
    if (dragging) {
      pull = clamp((startY - e.clientY) / 90, 0, 1);
      gift.style.setProperty('--pull', pull.toFixed(3));
      if (pull >= 1) openGift();
      return;
    }
    if (e.pointerType === 'mouse') setParallax(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
  });
  stage.addEventListener('pointerdown', function (e) {
    if (giftOpened) return;
    dragging = true; startY = e.clientY; startX = e.clientX; pull = 0;
    stage.classList.add('grab');
    try { stage.setPointerCapture(e.pointerId); } catch (err) {}
    buzz(6);
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false; stage.classList.remove('grab');
    var moved = Math.abs(e.clientY - startY) + Math.abs(e.clientX - startX);
    if (pull >= 0.3 || moved < 10) openGift();
    else { pull = 0; gift.style.setProperty('--pull', '0'); }
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  // Gentle idle sway on touch devices (no mouse to drive the parallax).
  if (!reduceMotion && window.matchMedia('(hover: none)').matches) {
    var t0 = performance.now();
    (function sway(now) {
      if (giftOpened) return;
      var s = (now - t0) / 1000;
      if (!dragging) setParallax(Math.sin(s * 0.6) * 0.25, Math.cos(s * 0.45) * 0.15);
      requestAnimationFrame(sway);
    })(t0);
  }

  function openGift() {
    if (giftOpened) return;
    giftOpened = true;
    dragging = false;
    stage.classList.remove('grab');
    gift.style.setProperty('--pull', '1');
    Sfx.shimmer(); buzz(14);
    gift.classList.add('untied');
    giftHint.classList.add('hide');
    wait(T(560)).then(function () {
      gift.classList.add('open');
      giftScene.classList.add('lit');
      Sfx.chime(); buzz([12, 40, 18, 40, 24]);
      return wait(T(380));
    }).then(function () {
      var r = gift.getBoundingClientRect(), s = Fx.size();
      Fx.burst(r.left + r.width / 2, Math.min(r.top + r.height * 0.1, s.h * 0.6));
      return wait(T(2300));
    }).then(goCard);
  }

  /* ---------------- scene 2: the envelope and the card ---------------- */
  var cardScene = $('#scene-card'), envBox = $('#envelope'), card = $('#card'), envHint = $('#env-hint'), revealBtn = $('#to-reveal');
  var cardState = 0;

  function renderCard() {
    var cfg = window.CARD || {};
    var box = $('#card-message');
    box.innerHTML = '';
    var paras = String(cfg.message || '').trim().split(/\n\s*\n/);
    paras.forEach(function (p, i) {
      var el = document.createElement('p');
      el.innerHTML = p.split('\n').map(function (line) {
        return line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }).join('<br>');
      if (i === paras.length - 1 && /^love/i.test(p)) el.className = 'sign';
      box.appendChild(el);
    });
    if (cfg.coverTitle) $('#cover-title').textContent = cfg.coverTitle;
    if (cfg.coverDate) $('#cover-date').textContent = cfg.coverDate;
    if (cfg.image) {
      var img = new Image();
      img.onload = function () { $('#cover-img').src = cfg.image; $('#cover-front').classList.add('has-image'); };
      img.src = cfg.image;
    }
  }

  function goCard() {
    giftScene.classList.add('leave');
    cardScene.classList.add('enter');
    wait(T(1000)).then(function () { giftScene.hidden = true; Fx.stop(); });
  }

  envBox.addEventListener('pointerdown', function () {
    if (cardState) return;
    cardState = 1;
    buzz(8); Sfx.paper();
    envBox.classList.add('open');
    envHint.classList.add('hide');
    wait(T(760)).then(function () {
      card.classList.add('lift'); Sfx.shimmer();
      return wait(T(850));
    }).then(function () {
      cardScene.classList.add('card-free');
      $('#card-topline').style.opacity = '0';
      return wait(T(950));
    }).then(function () {
      card.classList.add('opened'); Sfx.chime(); buzz([10, 30, 14]);
      return wait(T(1500));
    }).then(function () {
      revealBtn.hidden = false;
      requestAnimationFrame(function () { revealBtn.classList.add('show'); });
    });
  });
  revealBtn.addEventListener('click', function () { goCar(false); });

  /* Fit the message to the card: the largest type size that still fits without scrolling,
     so the words fill the card instead of floating in the top half of it. */
  function fitCard() {
    var box = $('#card-message');
    if (!box || !box.clientHeight) return;
    var lo = 12, hi = 34;
    box.style.fontSize = hi + 'px';
    if (box.scrollHeight <= box.clientHeight) return;
    for (var k = 0; k < 14; k++) {
      var mid = (lo + hi) / 2;
      box.style.fontSize = mid + 'px';
      if (box.scrollHeight <= box.clientHeight) lo = mid; else hi = mid;
    }
    box.style.fontSize = Math.floor(lo * 10) / 10 + 'px';
  }
  window.addEventListener('resize', fitCard);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitCard);

  /* ---------------- the journey: one dot per stop ---------------- */
  var trip = window.TRIP || { stops: [] };
  var MP = window.MAP_POINTS || {};
  var majorsData = trip.stops.filter(function (s) { return !s.minor && MP[s.key]; });
  var progress = $('#progress');
  var chapters = ['The present', 'The card', 'The car'].concat(majorsData.map(function (s) { return s.label || s.place; })).concat(['Happy birthday']);
  chapters.forEach(function (name) { var li = document.createElement('li'); li.title = name; progress.appendChild(li); });
  function setProgress(n) {
    $$('li', progress).forEach(function (li, k) { li.classList.toggle('done', k < n); li.classList.toggle('now', k === n); });
  }
  setProgress(0);

  /* ---------------- stop 3: the car ---------------- */
  var carScene = $('#scene-car');
  function goCar(instant) {
    cardScene.classList.add('leave');
    carScene.classList.add('enter');
    if (instant) carScene.classList.add('instant');
    carScene.classList.add('drive');
    setProgress(2);
    if (!instant) { Sfx.engine(); buzz([20, 60, 30]); }
    wait(T(instant ? 0 : 900)).then(function () {
      cardScene.hidden = true;
      return wait(T(instant ? 0 : 2000));
    }).then(function () { carScene.classList.add('arrived'); });
  }
  $('#to-map').addEventListener('click', function () { startMusic(); goJourney(); });

  /* ---------------- the map ---------------- */
  var NS = 'http://www.w3.org/2000/svg';
  var journey = $('#journey'), map = $('#map'), routeEl = $('#route'), glowEl = $('#route-glow'), ghostEl = $('#route-ghost');
  var landEl = $('#land'), coastEl = $('#coast-glow'), marker = $('#car-marker'), stopCard = $('#stop-card'), caption = $('#drive-caption');
  var geo = window.MAP_GEOMETRY || {};
  // The coastline file stops at the map frame; carry the land on past it so the camera can roam.
  var land = (geo.land || '').replace(/L18,0 .*$/, 'L18,0 L10,-1600 L2600,-1600 L2600,2600 L1150,2600 L860,850 Z');
  landEl.setAttribute('d', land);
  coastEl.setAttribute('d', (geo.land || '').replace(/ L18,0 .*$/, ''));
  [routeEl, glowEl, ghostEl].forEach(function (p) { p.setAttribute('d', geo.route || ''); });

  (function graticule() {
    var g = $('#graticule'), d = '';
    for (var x = -600; x <= 1500; x += 70) d += 'M' + x + ',-1600 L' + x + ',2600 ';
    for (var y = -600; y <= 1500; y += 70) d += 'M-1600,' + y + ' L2600,' + y + ' ';
    var p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); g.appendChild(p);
  })();

  // Scaled items: drawn in screen pixels, re-scaled every frame so they stay the same size at any zoom.
  var scaled = [];
  function addLabel(text, x, y, cls, rot) {
    var g = document.createElementNS(NS, 'g'), t = document.createElementNS(NS, 'text');
    t.setAttribute('class', cls); t.textContent = text;
    if (rot) t.setAttribute('transform', 'rotate(' + rot + ')');
    g.appendChild(t); $('#map-labels').appendChild(g);
    scaled.push({ el: g, x: x, y: y });
  }
  addLabel('Los Angeles', 600, 596, 'map-label');
  addLabel('San Luis Obispo', 330, 446, 'map-label');
  addLabel('Monterey', 112, 98, 'map-label');
  addLabel('Pacific Ocean', 230, 660, 'map-ocean-label', -55);

  var side = window.MAP_LABEL_SIDE || {}, offs = window.MAP_LABEL_OFFSET || {};
  var pinEls = [];
  trip.stops.forEach(function (s) {
    var p = MP[s.key]; if (!p) return;
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'pin' + (s.minor ? ' minor' : ''));
    if (!s.minor) { var ring = document.createElementNS(NS, 'circle'); ring.setAttribute('class', 'ring'); ring.setAttribute('r', '7'); g.appendChild(ring); }
    var dot = document.createElementNS(NS, 'circle'); dot.setAttribute('class', 'dot'); dot.setAttribute('r', s.minor ? '3.5' : '6'); g.appendChild(dot);
    var tx = document.createElementNS(NS, 'text'), left = side[s.key] === 'l', off = offs[s.key] || [0, 0];
    tx.setAttribute('x', (left ? -12 : 12) + off[0]); tx.setAttribute('y', 5 + off[1]);
    tx.setAttribute('text-anchor', left ? 'end' : 'start');
    tx.textContent = s.label || s.place || s.title || '';
    g.appendChild(tx);
    $('#pins').appendChild(g);
    scaled.push({ el: g, x: p[0], y: p[1] });
    pinEls.push({ el: g, key: s.key, pt: p });
  });

  // Where along the road each pin sits.
  var L = routeEl.getTotalLength(), SAMPLES = 900, samples = [];
  for (var si = 0; si <= SAMPLES; si++) { var sp = routeEl.getPointAtLength(L * si / SAMPLES); samples.push([sp.x, sp.y]); }
  function lenAt(pt) {
    var best = 0, bd = Infinity;
    for (var k = 0; k <= SAMPLES; k++) { var dx = samples[k][0] - pt[0], dy = samples[k][1] - pt[1], d = dx * dx + dy * dy; if (d < bd) { bd = d; best = k; } }
    return L * best / SAMPLES;
  }
  pinEls.forEach(function (p) { p.len = lenAt(p.pt); });
  var STOP_ZOOM = window.MAP_ZOOM || {};
  var majors = majorsData.map(function (s, k) {
    var len = k === 0 ? 0 : k === majorsData.length - 1 ? L : lenAt(MP[s.key]);
    return { s: s, len: len, pt: MP[s.key], zoom: STOP_ZOOM[s.key] || 1 };
  });

  /* ---------------- the camera ---------------- */
  // The camera: map point (x, y) shown at screen point (ax, ay), with z map units across aw screen pixels.
  var cam = { x: 400, y: 380, z: 900, ax: 200, ay: 400, aw: 400 }, W = 0, H = 0, view = null;
  function measureView() {
    W = window.innerWidth; H = window.innerHeight;
    var top = 40;
    if (W >= 900) view = { w: W * 0.56, cx: W * 0.32, cy: H * 0.5, base: 470, fw: W * 0.9, fh: H - top, fcx: W * 0.5, fcy: (H + top) / 2 };
    else {
      var ph = stopCard.offsetHeight || H * 0.5;
      view = { w: W, cx: W / 2, cy: top + (H - ph - top) * 0.5, base: 300, fw: W, fh: H - top - 20, fcx: W / 2, fcy: (H + top) / 2 };
    }
  }
  function overviewCam() {
    var z = Math.max(700, 680 * view.fw / Math.max(1, view.fh)) * 1.08;
    return { x: 400, y: 360, z: z, ax: view.fcx, ay: view.fcy, aw: view.fw };
  }
  function stopCam(m) { return { x: m.pt[0], y: m.pt[1], z: view.base * m.zoom, ax: view.cx, ay: view.cy, aw: view.w }; }
  var currentLen = 0, lastLit = -1, pingAt = 0;
  function render() {
    var s = cam.z / cam.aw;
    map.setAttribute('viewBox', (cam.x - cam.ax * s).toFixed(2) + ' ' + (cam.y - cam.ay * s).toFixed(2) + ' ' + (W * s).toFixed(2) + ' ' + (H * s).toFixed(2));
    for (var k = 0; k < scaled.length; k++) scaled[k].el.setAttribute('transform', 'translate(' + scaled[k].x + ' ' + scaled[k].y + ') scale(' + s.toFixed(4) + ')');
    routeEl.style.strokeWidth = (3.4 * s).toFixed(2); glowEl.style.strokeWidth = (11 * s).toFixed(2);
    ghostEl.style.strokeWidth = (2 * s).toFixed(2); ghostEl.style.strokeDasharray = (2 * s).toFixed(2) + ' ' + (8 * s).toFixed(2);
    landEl.style.strokeWidth = (1.2 * s).toFixed(2);
    $('#graticule').style.strokeWidth = (0.7 * s).toFixed(2);
    var off = L - currentLen;
    routeEl.style.strokeDasharray = L + ' ' + L; glowEl.style.strokeDasharray = L + ' ' + L;
    routeEl.style.strokeDashoffset = off; glowEl.style.strokeDashoffset = off;
    var p = routeEl.getPointAtLength(currentLen), q = routeEl.getPointAtLength(Math.min(L, currentLen + 2)), q0 = routeEl.getPointAtLength(Math.max(0, currentLen - 2));
    var ang = Math.atan2(q.y - q0.y, q.x - q0.x) * 180 / Math.PI;
    // The car faces right in the drawing; flip it when the road heads west so it never drives backwards.
    var west = ang > 90 || ang < -90;
    if (west) ang = ang > 90 ? ang - 180 : ang + 180;
    marker.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ') scale(' + s.toFixed(4) + ') rotate(' + ang.toFixed(1) + ')' + (west ? ' scale(-1,1)' : ''));
    var lit = 0;
    for (k = 0; k < pinEls.length; k++) {
      var on = pinEls[k].len <= currentLen + 0.5 && (currentLen > 0 || k === 0);
      if (on) lit++;
      if (on !== pinEls[k].el.classList.contains('lit')) pinEls[k].el.classList.toggle('lit', on);
    }
    if (lit > lastLit && lastLit >= 0 && performance.now() - pingAt > 300) { Sfx.ping(); buzz(8); pingAt = performance.now(); }
    lastLit = lit;
  }
  var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  // Animate camera and car together. `pull` widens the shot mid-flight, like the old travel maps.
  function fly(toCam, toLen, ms, pull) {
    var from = { x: cam.x, y: cam.y, z: cam.z, ax: cam.ax, ay: cam.ay, aw: cam.aw }, fromLen = currentLen;
    ms = T(ms);
    return new Promise(function (res) {
      var t0 = performance.now();
      (function step(now) {
        var t = clamp((now - t0) / ms, 0, 1), e = ease(t);
        currentLen = fromLen + (toLen - fromLen) * e;
        var z = from.z + (toCam.z - from.z) * e;
        z *= 1 + (pull || 0) * Math.sin(Math.PI * e);
        if (toLen !== fromLen && pull) {
          // follow the car, then settle on the stop
          var p = routeEl.getPointAtLength(currentLen), w = Math.pow(e, 3);
          cam.x = p.x + (toCam.x - p.x) * w; cam.y = p.y + (toCam.y - p.y) * w;
          if (e < 0.15) { var w0 = 1 - e / 0.15; cam.x = cam.x * (1 - w0) + from.x * w0; cam.y = cam.y * (1 - w0) + from.y * w0; }
        } else { cam.x = from.x + (toCam.x - from.x) * e; cam.y = from.y + (toCam.y - from.y) * e; }
        cam.z = z;
        cam.ax = from.ax + (toCam.ax - from.ax) * e; cam.ay = from.ay + (toCam.ay - from.ay) * e; cam.aw = from.aw + (toCam.aw - from.aw) * e;
        if (pull) {
          // the stop card is down while driving, so centre the car on the whole screen mid-flight
          var b = Math.sin(Math.PI * e);
          cam.ax += (view.fcx - cam.ax) * b; cam.ay += (view.fcy - cam.ay) * b; cam.aw += (view.fw - cam.aw) * b;
        }
        render();
        if (t < 1) requestAnimationFrame(step); else res();
      })(t0);
    });
  }

  /* ---------------- the stop card ---------------- */
  var idx = -1, busy = false, inJourney = false;
  function fillCard(k) {
    var s = majors[k].s;
    $('#stop-time').textContent = 'Day ' + s.day + (s.time ? ' · ' + s.time : '');
    $('#stop-count').textContent = (k + 1) + ' of ' + majors.length;
    $('#stop-title').textContent = s.title || '';
    $('#stop-place').textContent = s.place || '';
    $('#stop-text').textContent = s.text || '';
    $('#stop-scene').innerHTML = (window.SCENES || {})[s.key] || '';
    $('#stop-back').style.visibility = k > 0 ? 'visible' : 'hidden';
    $('#stop-next').textContent = k === majors.length - 1 ? 'One more thing' : 'Drive on';
    $('.stop-body', stopCard).scrollTop = 0;
  }
  function showCard(k) {
    fillCard(k);
    stopCard.classList.add('show');
    caption.classList.remove('show');
    setProgress(3 + k);
    Sfx.chime && k === majors.length - 1 ? Sfx.chime() : Sfx.ping();
    buzz([10, 30, 14]);
  }
  function hideCard() { stopCard.classList.remove('show'); }

  function goJourney(instant) {
    if (inJourney) return;
    inJourney = true;
    carScene.classList.add('leave');
    journey.classList.add('enter');
    measureView();
    var ov = overviewCam();
    cam = ov; currentLen = 0; render();
    wait(T(instant ? 0 : 900)).then(function () {
      carScene.hidden = true;
      if (instant) { measureView(); cam = stopCam(majors[0]); render(); idx = 0; showCard(0); return; }
      busy = true;
      caption.textContent = 'Day 1 · Leaving home';
      caption.classList.add('show');
      return wait(T(500)).then(function () { return fly(stopCam(majors[0]), 0, 2200, 0); }).then(function () { busy = false; idx = 0; showCard(0); });
    });
  }

  function goStop(k) {
    if (busy || k === idx || k < 0) return;
    if (k >= majors.length) { return goFinale(); }
    busy = true;
    var back = k < idx, m = majors[k];
    hideCard();
    caption.textContent = back ? 'Back to ' + (m.s.label || m.s.place) : 'Day ' + m.s.day + ' · On to ' + (m.s.label || m.s.place);
    caption.classList.add('show');
    Sfx.engine && !back && Sfx.engine();
    var dist = Math.abs(m.len - currentLen);
    var ms = back ? 1300 : clamp(1700 + dist * 5, 2200, 4600);
    wait(T(350)).then(function () { return fly(stopCam(m), m.len, ms, back ? 0.3 : 0.9); }).then(function () {
      idx = k; busy = false; showCard(k);
    });
  }
  $('#stop-next').addEventListener('click', function () { goStop(idx + 1); });
  $('#stop-back').addEventListener('click', function () { goStop(idx - 1); });
  document.addEventListener('keydown', function (e) {
    if (!inJourney || busy || !journey.classList.contains('enter') || finale.classList.contains('enter')) return;
    if (e.target.closest && e.target.closest('.music-menu, .music-btn, .mute')) return;
    if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goStop(idx + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goStop(idx - 1); }
  });
  window.addEventListener('resize', function () {
    if (!inJourney) return;
    measureView();
    if (!busy) { cam = idx >= 0 && !finale.classList.contains('enter') ? stopCam(majors[idx]) : overviewCam(); render(); }
  });

  /* ---------------- the finale ---------------- */
  var finale = $('#finale');
  function goFinale() {
    busy = true;
    hideCard();
    caption.textContent = 'The whole coast';
    caption.classList.add('show');
    fly(overviewCam(), L, 2400, 0).then(function () {
      wait(T(700)).then(function () {
        caption.classList.remove('show');
        finale.classList.add('enter');
        setProgress(chapters.length - 1);
        Sfx.chime(); buzz([12, 40, 18, 40, 24]);
        wait(T(300)).then(function () { finale.classList.add('in'); });
        stars();
        busy = false;
      });
    });
  }
  $('#replay-drive').addEventListener('click', function () {
    finale.classList.remove('enter', 'in');
    idx = -1; busy = true;
    var ov = overviewCam();
    fly(ov, 0, 1200, 0).then(function () { return fly(stopCam(majors[0]), 0, 1800, 0); }).then(function () { busy = false; idx = 0; showCard(0); });
  });

  /* ---------------- the whole plan, as a list ---------------- */
  (function buildPlan() {
    $('#trip-headline').textContent = trip.headline || '';
    $('#trip-intro').textContent = trip.intro || '';
    $('#trip-when').textContent = trip.when || '';
    if (trip.when) $('#finale-when').textContent = trip.when;
    var list = $('#stops'), lastDay = 0;
    majors.forEach(function (m, n) {
      var s = m.s;
      if (s.day !== lastDay) {
        lastDay = s.day;
        var d = document.createElement('li'); d.className = 'day'; d.textContent = 'Day ' + s.day;
        list.appendChild(d);
      }
      var li = document.createElement('li');
      li.className = 'stop seen';
      li.innerHTML = '<div class="meta"><span class="time"></span><span class="num"></span></div><h3></h3><p class="place"></p><p class="text"></p>';
      $('.time', li).textContent = 'Day ' + s.day + (s.time ? ' · ' + s.time : '');
      $('.num', li).textContent = String(n + 1).padStart(2, '0');
      $('h3', li).textContent = s.title || '';
      $('.place', li).textContent = s.place || '';
      $('.text', li).textContent = s.text || '';
      list.appendChild(li);
    });
  })();
  var plan = $('#plan');
  $('#show-plan').addEventListener('click', function () { plan.hidden = false; plan.scrollTop = 0; requestAnimationFrame(function () { plan.classList.add('show'); }); });
  $('#close-plan').addEventListener('click', function () { plan.classList.remove('show'); wait(400).then(function () { plan.hidden = true; }); });

  /* ---------------- a few stars over the finale ---------------- */
  var starsOn = false;
  function stars() {
    var c = $('#stars'); if (!c || starsOn) return;
    starsOn = true;
    var ctx = c.getContext('2d'), pts = [], dpr = Math.min(window.devicePixelRatio || 1, 2), SW, SH;
    function size() {
      SW = c.clientWidth; SH = c.clientHeight; c.width = SW * dpr; c.height = SH * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = []; var n = Math.round(SW * SH / 9000);
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * SW, y: Math.random() * SH, r: Math.random() * 1.2 + 0.2, p: Math.random() * 6.28, s: 0.4 + Math.random() * 0.8 });
    }
    size(); window.addEventListener('resize', size);
    (function draw(now) {
      ctx.clearRect(0, 0, SW, SH);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i], a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(now / 1000 * p.s + p.p));
        ctx.globalAlpha = a; ctx.fillStyle = '#f3dc9a';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduceMotion) requestAnimationFrame(draw);
    })(performance.now());
  }

  /* ---------------- start ---------------- */
  renderCard();
  fitCard();
  // Deep links for checking one stop on a phone: ?go=card, ?go=car, ?go=trip, ?go=stop&n=3, ?go=finale
  var qs = new URLSearchParams(window.location.search), go = qs.get('go');
  function skipTo(stage) {
    giftScene.hidden = true; Fx.stop();
    cardScene.classList.add('enter');
    if (stage === 'card') { setProgress(1); return; }
    goCar(true);
    if (stage === 'car') return;
    cardScene.hidden = true;
    goJourney(true);
  }
  // On a deep link nothing has been tapped yet, so the drive's music starts on the first tap instead.
  if (go && go !== 'card' && go !== 'car') document.addEventListener('pointerdown', function first() {
    document.removeEventListener('pointerdown', first, true);
    wait(0).then(startMusic);
  }, true);
  if (go) { muteBtn.classList.add('show'); musicBtn.classList.add('show'); }
  if (go === 'card' || go === 'car' || go === 'trip') skipTo(go);
  else if (go === 'stop' || go === 'finale') {
    skipTo('trip');
    var n = go === 'finale' ? majors.length - 1 : clamp(parseInt(qs.get('n'), 10) || 0, 0, majors.length - 1);
    wait(50).then(function () {
      idx = n; currentLen = majors[n].len; cam = stopCam(majors[n]); render(); showCard(n);
      if (go === 'finale') goFinale();
    });
  } else {
    Fx.start();
  }
})();
