/* For Dad - the whole experience, in one small script.
   Scenes: gift -> envelope + card -> the car -> the map -> the finale.
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
  muteBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var m = !Sfx.muted;
    Sfx.setMuted(m);
    muteBtn.classList.toggle('is-muted', m);
    muteBtn.setAttribute('aria-pressed', String(m));
    muteBtn.setAttribute('aria-label', m ? 'Unmute sound' : 'Mute sound');
  });
  // iOS: audio can only start inside a user gesture. The first touch anywhere arms it.
  function armAudio() {
    Sfx.init(); Sfx.resume();
    muteBtn.classList.add('show');
    document.removeEventListener('pointerdown', armAudio, true);
    document.removeEventListener('touchend', armAudio, true);
  }
  document.addEventListener('pointerdown', armAudio, true);
  document.addEventListener('touchend', armAudio, true);

  // Keep the fixed overlays from rubber-banding on iOS. The card text may scroll.
  $$('.scene').forEach(function (sc) {
    sc.addEventListener('touchmove', function (e) {
      if (!e.target.closest || !e.target.closest('.card-text')) e.preventDefault();
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
  revealBtn.addEventListener('click', function () { goReveal(false); });

  /* ---------------- the car ---------------- */
  var hero = $('#hero');
  var tripStarted = false;
  function unlock() {
    document.body.classList.remove('locked');
    window.scrollTo(0, 0);
  }
  function goReveal(instant) {
    cardScene.classList.add('leave');
    if (instant) hero.classList.add('instant');
    hero.classList.add('drive');
    if (!instant) { Sfx.engine(); buzz([20, 60, 30]); }
    wait(T(instant ? 0 : 900)).then(function () {
      cardScene.hidden = true;
      return wait(T(instant ? 0 : 2000));
    }).then(function () {
      hero.classList.add('arrived');
      unlock();
      startTrip();
    });
  }

  /* ---------------- the map and the stops ---------------- */
  function buildTrip() {
    var trip = window.TRIP || { stops: [] }, pts = window.MAP_POINTS || {}, side = window.MAP_LABEL_SIDE || {}, geo = window.MAP_GEOMETRY || {};
    $('#trip-headline').textContent = trip.headline || '';
    $('#trip-intro').textContent = trip.intro || '';
    $('#trip-when').textContent = trip.when || '';
    if (trip.when) $('#finale-when').textContent = trip.when;
    $('#land').setAttribute('d', geo.land || '');
    $('#coast-glow').setAttribute('d', (geo.land || '').replace(/L18,0.*$/, ''));
    $('#route').setAttribute('d', geo.route || '');
    $('#route-glow').setAttribute('d', geo.route || '');
    $('#route-ghost').setAttribute('d', geo.route || '');

    var NS = 'http://www.w3.org/2000/svg', pins = $('#pins'), list = $('#stops');
    var majors = [], lastDay = 0, n = 0;
    trip.stops.forEach(function (s) {
      var p = pts[s.key]; if (!p) return;
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'pin' + (s.minor ? ' minor' : ''));
      g.setAttribute('transform', 'translate(' + p[0] + ' ' + p[1] + ')');
      g.dataset.key = s.key;
      if (!s.minor) { var ring = document.createElementNS(NS, 'circle'); ring.setAttribute('class', 'ring'); ring.setAttribute('r', '9'); g.appendChild(ring); }
      var dot = document.createElementNS(NS, 'circle'); dot.setAttribute('class', 'dot'); dot.setAttribute('r', s.minor ? '5' : '8'); g.appendChild(dot);
      var tx = document.createElementNS(NS, 'text');
      var left = side[s.key] === 'l', off = (window.MAP_LABEL_OFFSET || {})[s.key] || [0, 0];
      tx.setAttribute('x', (left ? -16 : 16) + off[0]); tx.setAttribute('y', 8 + off[1]);
      tx.setAttribute('text-anchor', left ? 'end' : 'start');
      tx.textContent = s.label || s.place || s.title || '';
      g.appendChild(tx);
      pins.appendChild(g);
      if (s.minor) return;

      if (s.day !== lastDay) {
        lastDay = s.day;
        var d = document.createElement('li'); d.className = 'day'; d.textContent = 'Day ' + s.day;
        list.appendChild(d);
      }
      n++;
      var li = document.createElement('li');
      li.className = 'stop'; li.dataset.key = s.key;
      li.innerHTML = '<div class="meta"><span class="time"></span><span class="num"></span></div><h3></h3><p class="place"></p><p class="text"></p>';
      $('.time', li).textContent = 'Day ' + s.day + (s.time ? ' · ' + s.time : '');
      $('.num', li).textContent = String(n).padStart(2, '0');
      $('h3', li).textContent = s.title || '';
      $('.place', li).textContent = s.place || '';
      $('.text', li).textContent = s.text || '';
      list.appendChild(li);
      majors.push({ key: s.key, pt: p, pin: g, li: li });
    });
    return majors;
  }

  var majors = buildTrip();

  function startTrip() {
    if (tripStarted) return;
    tripStarted = true;
    var route = $('#route'), glow = $('#route-glow'), marker = $('#car-marker'), mapWrap = $('#map-wrap');
    var L = route.getTotalLength();
    route.style.strokeDasharray = L + ' ' + L; glow.style.strokeDasharray = L + ' ' + L;
    route.style.strokeDashoffset = L; glow.style.strokeDashoffset = L;

    // Where along the road each stop sits: nearest sample point on the path.
    var samples = [], S = 700, i;
    for (i = 0; i <= S; i++) { var pp = route.getPointAtLength(L * i / S); samples.push([pp.x, pp.y]); }
    majors.forEach(function (m) {
      var best = 0, bd = Infinity;
      for (i = 0; i <= S; i++) { var dx = samples[i][0] - m.pt[0], dy = samples[i][1] - m.pt[1], d = dx * dx + dy * dy; if (d < bd) { bd = d; best = i; } }
      m.len = L * best / S;
    });
    if (majors.length) { majors[0].len = 0; majors[majors.length - 1].len = L; }

    var current = 0, target = 0, lastLit = -1, activeIdx = -1, pingAt = 0;
    var allPins = $$('.pin');
    var pinLen = allPins.map(function (g) {
      var key = g.dataset.key, p = (window.MAP_POINTS || {})[key], best = 0, bd = Infinity;
      for (i = 0; i <= S; i++) { var dx = samples[i][0] - p[0], dy = samples[i][1] - p[1], d = dx * dx + dy * dy; if (d < bd) { bd = d; best = i; } }
      return L * best / S;
    });

    function measure() {
      var vh = window.innerHeight, wide = window.innerWidth >= 900;
      var trigger;
      if (wide) trigger = vh * 0.55;
      else { var mb = Math.max(0, Math.min(vh, mapWrap.getBoundingClientRect().bottom)); trigger = mb + (vh - mb) * 0.42; }
      var tops = majors.map(function (m) { return m.li.getBoundingClientRect().top; });
      var idx = -1;
      for (i = 0; i < tops.length; i++) if (tops[i] <= trigger) idx = i;
      if (idx < 0) { target = 0; }
      else if (idx >= majors.length - 1) { target = L; }
      else {
        var f = clamp((trigger - tops[idx]) / Math.max(1, tops[idx + 1] - tops[idx]), 0, 1);
        f = f * f * (3 - 2 * f);
        target = majors[idx].len + (majors[idx + 1].len - majors[idx].len) * f;
      }
      if (idx !== activeIdx) {
        activeIdx = idx;
        majors.forEach(function (m, k) {
          m.li.classList.toggle('active', k === idx);
          m.li.classList.toggle('seen', k < idx);
        });
      }
    }

    function tick() {
      current += (target - current) * (reduceMotion ? 1 : 0.1);
      if (Math.abs(target - current) < 0.3) current = target;
      var off = L - current;
      route.style.strokeDashoffset = off; glow.style.strokeDashoffset = off;
      var p = route.getPointAtLength(current), q = route.getPointAtLength(Math.min(L, current + 3));
      var ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
      // The car faces right in the drawing; flip it when the road heads west so it never drives backwards.
      var flip = (ang > 90 || ang < -90) ? ' scale(1,-1)' : '';
      if (flip) ang = ang > 90 ? ang - 180 : ang + 180;
      marker.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')' + flip);
      var litCount = 0;
      for (var k = 0; k < allPins.length; k++) {
        var lit = pinLen[k] <= current + 0.5 && current > 0;
        if (lit) litCount++;
        if (lit !== allPins[k].classList.contains('lit')) allPins[k].classList.toggle('lit', lit);
      }
      if (litCount > lastLit && lastLit >= 0 && performance.now() - pingAt > 350) { Sfx.ping(); buzz(8); pingAt = performance.now(); }
      lastLit = litCount;
      requestAnimationFrame(tick);
    }
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    measure();
    requestAnimationFrame(tick);

    // Finale fades in once it is on screen.
    var finale = $('#finale');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { finale.classList.add('in'); io.disconnect(); } }); }, { threshold: 0.25 });
      io.observe(finale);
    } else finale.classList.add('in');
    stars();
  }

  /* ---------------- a few stars over the finale ---------------- */
  function stars() {
    var c = $('#stars'); if (!c) return;
    var ctx = c.getContext('2d'), pts = [], dpr = Math.min(window.devicePixelRatio || 1, 2), W, H;
    function size() {
      W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = []; var n = Math.round(W * H / 9000);
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.2 + 0.2, p: Math.random() * 6.28, s: 0.4 + Math.random() * 0.8 });
    }
    size(); window.addEventListener('resize', size);
    (function draw(now) {
      ctx.clearRect(0, 0, W, H);
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
  var go = new URLSearchParams(window.location.search).get('go');
  if (go === 'trip') {
    // Straight to the plan (handy for checking the map on a phone).
    giftScene.hidden = true; Fx.stop();
    cardScene.classList.add('enter');
    goReveal(true);
  } else if (go === 'card') {
    giftScene.hidden = true;
    cardScene.classList.add('enter');
  } else {
    Fx.start();
  }
})();
