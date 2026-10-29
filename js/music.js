/* =====================================================================
   THE MUSIC  -  four tracks for the drive, played live in the browser.
   ---------------------------------------------------------------------
   Nothing is downloaded: every note is synthesised with Web Audio, so
   there are no audio files, no licences and no network requests.
   To change the list, edit TRACKS below (name, a short description,
   tempo and the chord loop). js/app.js builds the picker from it.
   ===================================================================== */
(function () {
  'use strict';

  var hz = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };

  /* Each chord: b = bass note, v = the voicing (MIDI note numbers). */
  var TRACKS = [
    {
      id: 'coast', name: 'Coastal Drive', desc: 'Warm keys and an easy groove',
      bpm: 90, swing: 0,
      chords: [
        { b: 38, v: [62, 66, 69, 73] },  // Dmaj7
        { b: 35, v: [59, 62, 66, 69] },  // Bm7
        { b: 31, v: [59, 62, 66, 67] },  // Gmaj7
        { b: 33, v: [57, 61, 64, 66] }   // A6
      ],
      // the tune comes in on the second time round: [bar, step, note, length in steps]
      melody: [[4, 0, 78, 6], [4, 6, 76, 2], [4, 8, 74, 6], [4, 14, 71, 2], [5, 0, 74, 8], [5, 10, 73, 6],
               [6, 0, 71, 6], [6, 6, 74, 2], [6, 8, 78, 8], [7, 0, 76, 12], [7, 12, 73, 4]],
      loopBars: 8
    },
    {
      id: 'gt', name: 'Grand Tourer', desc: 'Night-drive synths with a pulse',
      bpm: 108, swing: 0,
      chords: [
        { b: 33, v: [57, 60, 64] },  // Am
        { b: 29, v: [57, 60, 65] },  // F
        { b: 36, v: [55, 60, 64] },  // C
        { b: 31, v: [55, 59, 62] }   // G
      ],
      loopBars: 4
    },
    {
      id: 'jazz', name: 'Sunset Jazz', desc: 'Brushes, walking bass, Rhodes',
      bpm: 84, swing: 0.3,
      chords: [
        { b: 31, v: [58, 62, 65, 69], walk: [31, 34, 38, 35] },  // Gm9
        { b: 36, v: [58, 64, 69, 70], walk: [36, 40, 43, 40] },  // C13
        { b: 29, v: [57, 60, 64, 67], walk: [29, 33, 36, 39] },  // Fmaj9
        { b: 38, v: [54, 60, 63, 69], walk: [38, 42, 45, 32] }   // D7b9
      ],
      loopBars: 4
    },
    {
      id: 'sur', name: 'Big Sur Morning', desc: 'Slow and open, with the ocean',
      bpm: 64, swing: 0,
      chords: [
        { b: 36, v: [55, 62, 64, 67] },  // Cadd9
        { b: 35, v: [55, 59, 62, 69] },  // G/B
        { b: 33, v: [57, 60, 64, 67] },  // Am7
        { b: 29, v: [53, 57, 60, 64] }   // Fmaj7
      ],
      bells: [[0, 4, 79], [0, 10, 76], [1, 6, 74], [2, 2, 72], [2, 8, 76], [3, 4, 69], [3, 12, 72]],
      loopBars: 4
    },
    { id: 'off', name: 'No music', desc: 'Just the road' }
  ];

  var M = {
    tracks: TRACKS,
    choice: 'coast',   // the track picked by default
    playing: null,
    ctx: null, out: null, bus: null, noiseBuf: null, timer: null,
    step: 0, nextAt: 0,

    attach: function (ctx, dest) {
      if (this.ctx || !ctx) return;
      this.ctx = ctx;
      this.out = ctx.createGain(); this.out.gain.value = 0.85; this.out.connect(dest);
      var len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.noiseBuf = buf;
    },
    track: function (id) { for (var i = 0; i < TRACKS.length; i++) if (TRACKS[i].id === id) return TRACKS[i]; return null; },

    play: function (id) {
      if (!this.ctx) return;
      var tr = this.track(id);
      if (!tr || !tr.bpm) { this.stop(); return; }
      if (this.playing === id) return;
      this.stop();
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
      if (this.ctx.state === 'suspended') this.ctx.resume();
      var c = this.ctx;
      this.bus = c.createGain();
      this.bus.gain.setValueAtTime(0.0001, c.currentTime);
      this.bus.gain.exponentialRampToValueAtTime(1, c.currentTime + 1.2);
      this.bus.connect(this.out);
      this.playing = id; this.cur = tr;
      this.step = 0; this.nextAt = c.currentTime + 0.08;
      var self = this;
      this.timer = setInterval(function () { self.tick(); }, 40);
      this.tick();
    },
    stop: function () {
      if (this.timer) { clearInterval(this.timer); this.timer = null; }
      if (this.bus && this.ctx) {
        var b = this.bus, t = this.ctx.currentTime;
        b.gain.cancelScheduledValues(t); b.gain.setValueAtTime(b.gain.value || 0.0001, t);
        b.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
        setTimeout(function () { try { b.disconnect(); } catch (e) {} }, 1200);
      }
      this.bus = null; this.playing = null; this.cur = null;
    },

    tick: function () {
      var c = this.ctx, tr = this.cur;
      if (!c || !tr) return;
      var sd = 60 / tr.bpm / 4;  // one 16th note
      // If the phone slept and the clock jumped, pick up from now instead of catching up.
      if (this.nextAt < c.currentTime - 0.2) this.nextAt = c.currentTime + 0.05;
      while (this.nextAt < c.currentTime + 0.3) {
        var s = this.step, inBar = s % 16, bar = Math.floor(s / 16) % (tr.loopBars || 4);
        var t = this.nextAt + (tr.swing && inBar % 4 === 2 ? tr.swing * sd * 2 : 0);
        this['play_' + tr.id](t, inBar, bar, tr.chords[bar % tr.chords.length], sd, tr);
        this.step++; this.nextAt += sd;
      }
    },

    /* ---------- the instruments ---------- */
    env: function (g, t, peak, a, dur) {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + a);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    },
    osc: function (type, f, t, dur, dest, detune) {
      var o = this.ctx.createOscillator(); o.type = type; o.frequency.value = f;
      if (detune) o.detune.value = detune;
      o.connect(dest); o.start(t); o.stop(t + dur + 0.05);
      return o;
    },
    gain: function (dest) { var g = this.ctx.createGain(); g.connect(dest || this.bus); return g; },
    filter: function (type, f, q, dest) { var x = this.ctx.createBiquadFilter(); x.type = type; x.frequency.value = f; x.Q.value = q || 0.7; x.connect(dest); return x; },

    keys: function (m, t, dur, v) {          // electric-piano: a sine with a bell on top
      var g = this.gain(); this.env(g, t, v, 0.006, dur);
      this.osc('sine', hz(m), t, dur, g);
      var g2 = this.gain(); this.env(g2, t, v * 0.22, 0.004, Math.min(dur, 0.5));
      this.osc('sine', hz(m) * 2, t, dur, g2);
    },
    pad: function (notes, t, dur, v, bright) {
      var g = this.gain(), lp = this.filter('lowpass', bright || 900, 0.5, g);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v, t + dur * 0.35);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.4);
      for (var i = 0; i < notes.length; i++) {
        this.osc('sawtooth', hz(notes[i]), t, dur + 0.4, lp, -7);
        this.osc('sawtooth', hz(notes[i]), t, dur + 0.4, lp, 7);
      }
    },
    bass: function (m, t, dur, v) {
      var g = this.gain(), lp = this.filter('lowpass', 420, 0.8, g); this.env(g, t, v, 0.01, dur);
      this.osc('triangle', hz(m), t, dur, lp);
      this.osc('sine', hz(m), t, dur, lp);
    },
    pluck: function (m, t, v) {
      var g = this.gain(), lp = this.filter('lowpass', 2600, 4, g);
      lp.frequency.setValueAtTime(3200, t); lp.frequency.exponentialRampToValueAtTime(380, t + 0.22);
      this.env(g, t, v, 0.004, 0.3);
      this.osc('sawtooth', hz(m), t, 0.3, lp);
      this.osc('square', hz(m) * 0.5, t, 0.3, lp, 4);
    },
    bell: function (m, t, v) {
      var g = this.gain(); this.env(g, t, v, 0.005, 2.6); this.osc('sine', hz(m), t, 2.6, g);
      var g2 = this.gain(); this.env(g2, t, v * 0.3, 0.005, 1.2); this.osc('sine', hz(m) * 2.76, t, 1.2, g2);
    },
    lead: function (m, t, dur, v) {
      var g = this.gain(), lp = this.filter('lowpass', 1800, 0.7, g);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.05);
      g.gain.setValueAtTime(v, t + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.25);
      var o = this.osc('triangle', hz(m), t, dur + 0.25, lp);
      var lfo = this.ctx.createOscillator(), lg = this.ctx.createGain();
      lfo.frequency.value = 5; lg.gain.value = 6; lfo.connect(lg); lg.connect(o.detune); lfo.start(t); lfo.stop(t + dur + 0.3);
    },
    noise: function (t, dur, type, f, q, v, attack) {
      var src = this.ctx.createBufferSource(); src.buffer = this.noiseBuf;
      var g = this.gain(), fl = this.filter(type, f, q, g);
      this.env(g, t, v, attack || 0.002, dur);
      src.connect(fl); src.start(t, Math.random() * 1.5); src.stop(t + dur + 0.05);
    },
    kick: function (t, v) {
      var g = this.gain(); this.env(g, t, v, 0.003, 0.32);
      var o = this.osc('sine', 110, t, 0.34, g);
      o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    },
    hat: function (t, v) { this.noise(t, 0.05, 'highpass', 7500, 0.7, v); },
    snare: function (t, v) { this.noise(t, 0.18, 'bandpass', 1900, 0.8, v); var g = this.gain(); this.env(g, t, v * 0.5, 0.002, 0.09); this.osc('triangle', 190, t, 0.1, g); },
    brush: function (t, v, dur) { this.noise(t, dur || 0.22, 'bandpass', 4200, 0.6, v, 0.03); },

    /* ---------- the tracks ---------- */
    play_coast: function (t, s, bar, ch, sd, tr) {
      if (s === 0) this.pad(ch.v, t, sd * 16, 0.035, 1100);
      if ([0, 3, 6, 8, 11, 14].indexOf(s) >= 0) { var k = [0, 2, 1, 3, 2, 1][[0, 3, 6, 8, 11, 14].indexOf(s)]; this.keys(ch.v[k % ch.v.length], t, sd * 5, 0.07); }
      if (s === 0) this.bass(ch.b, t, sd * 7, 0.22);
      if (s === 10) this.bass(ch.b + 7, t, sd * 2, 0.16);
      if (s === 12) this.bass(ch.b + 12, t, sd * 4, 0.18);
      if (s === 0 || s === 8 || s === 10) this.kick(t, s === 10 ? 0.12 : 0.24);
      if (s === 4 || s === 12) this.noise(t, 0.08, 'bandpass', 2600, 1.2, 0.06);
      if (s % 2 === 0) this.hat(t, s % 4 === 2 ? 0.035 : 0.018);
      var mel = tr.melody;
      for (var i = 0; i < mel.length; i++) if (mel[i][0] === bar && mel[i][1] === s) this.lead(mel[i][2], t, sd * mel[i][3], 0.05);
    },
    play_gt: function (t, s, bar, ch, sd) {
      if (s === 0) this.pad(ch.v.map(function (n) { return n - 12; }), t, sd * 16, 0.03, 700);
      var arp = [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 2, 3, 2];
      var a = arp[s], note = a === 3 ? ch.v[0] + 12 : ch.v[a];
      this.pluck(note + 12, t, 0.05);
      if (s % 2 === 0) this.bass(ch.b + (s % 4 === 2 ? 12 : 0), t, sd * 1.6, 0.2);
      if (s % 4 === 0) this.kick(t, 0.28);
      if (s === 4 || s === 12) this.snare(t, 0.1);
      if (s % 4 === 2) this.hat(t, 0.045);
    },
    play_jazz: function (t, s, bar, ch, sd) {
      if (s % 4 === 0) this.bass(ch.walk[s / 4], t, sd * 3.6, 0.26);
      if (s === 0 && bar % 2 === 0) for (var i = 0; i < ch.v.length; i++) this.keys(ch.v[i], t + i * 0.012, sd * 7, 0.045);
      if (s === 6 || (s === 14 && bar % 2)) for (var j = 0; j < ch.v.length; j++) this.keys(ch.v[j], t + j * 0.01, sd * 3, 0.04);
      if (s % 4 === 0) this.brush(t, 0.03, 0.3);
      if (s === 0 || s === 4 || s === 6 || s === 8 || s === 12 || s === 14) this.noise(t, 0.12, 'highpass', 6500, 0.6, s % 4 === 2 ? 0.02 : 0.03);
      if (s === 4 || s === 12) this.brush(t, 0.05, 0.16);
      if (s % 8 === 0) this.kick(t, 0.07);
    },
    play_sur: function (t, s, bar, ch, sd, tr) {
      if (s === 0) { this.pad(ch.v, t, sd * 16, 0.06, 800); this.bass(ch.b, t, sd * 15, 0.18); }
      if (s === 8) this.keys(ch.v[ch.v.length - 1] + 12, t, sd * 8, 0.025);
      var b = tr.bells;
      for (var i = 0; i < b.length; i++) if (b[i][0] === bar && b[i][1] === s) this.bell(b[i][2], t, 0.07);
      if (s === 0 && bar % 2 === 0) this.noise(t, sd * 30, 'lowpass', 520, 0.5, 0.05, sd * 12);
    }
  };

  window.Music = M;
})();
