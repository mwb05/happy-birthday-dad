/* =====================================================================
   THE SCENES  -  the little animated picture shown at each stop.
   One SVG per stop key (the keys match trip.js). Every scene is drawn
   in a 360 x 180 box and animated with the .sc-* rules in style.css.
   "#db11" is the car drawn once in index.html.
   ===================================================================== */
(function () {
  var car = function (x, y, w, cls) {
    return '<g class="' + (cls || '') + '"><use href="#db11" x="' + x + '" y="' + y + '" width="' + w + '" height="' + (w * 388 / 1240).toFixed(1) + '"/></g>';
  };
  var stars = function (n, h) {
    var s = '', seed = 7;
    for (var i = 0; i < n; i++) {
      seed = (seed * 9301 + 49297) % 233280; var x = (seed / 233280) * 360;
      seed = (seed * 9301 + 49297) % 233280; var y = (seed / 233280) * h;
      s += '<circle class="sc-twinkle" style="animation-delay:' + (i % 7) * 0.45 + 's" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (i % 3 ? 0.7 : 1.1) + '" fill="#f8ead0"/>';
    }
    return s;
  };
  var waves = function (y0, n, color) {
    var s = '';
    for (var i = 0; i < n; i++) {
      var y = y0 + i * 9 + i * i * 1.5;
      s += '<path class="sc-wave" style="animation-duration:' + (5 + i * 1.3) + 's" d="M-40,' + y + ' q10,-3 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0" fill="none" stroke="' + color + '" stroke-width="' + (0.8 + i * 0.25) + '" opacity="' + (0.25 + i * 0.12) + '"/>';
    }
    return s;
  };
  var sky = function (id, stops) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' + stops.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"/>'; }).join('') + '</linearGradient>';
  };
  var open = '<svg viewBox="0 0 360 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">';

  window.SCENES = {
    /* Leaving home before sunrise: the sun comes up, the road rolls. */
    start: open + '<defs>' + sky('sc-s1', [[0, '#0a1124'], [0.55, '#2c2a4a'], [0.85, '#a8685a'], [1, '#e2a25e']]) +
      '<radialGradient id="sc-sun1"><stop offset="0" stop-color="#fff3d0"/><stop offset="0.4" stop-color="#f3c77a" stop-opacity="0.8"/><stop offset="1" stop-color="#f3c77a" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="360" height="180" fill="url(#sc-s1)"/>' + stars(26, 70) +
      '<g class="sc-rise"><circle cx="268" cy="112" r="46" fill="url(#sc-sun1)"/><circle cx="268" cy="112" r="15" fill="#fff0c8"/></g>' +
      '<path d="M0,112 C50,96 100,106 150,100 C210,92 260,104 300,98 C330,94 350,98 360,96 L360,180 L0,180 Z" fill="#0d1222"/>' +
      '<g fill="#070a14"><path d="M40,124 C42,100 44,84 47,66 L49,66 C47,84 46,100 45,124 Z"/><path d="M48,66 C38,60 28,62 20,70 C30,64 40,64 48,68 C42,58 34,54 24,54 C36,54 44,58 49,66 C50,56 58,50 70,50 C60,54 54,60 50,66 C60,60 72,62 78,70 C68,64 58,64 49,68 Z"/>' +
      '<path d="M70,124 C71,108 72,96 74,84 L76,84 C75,96 74,108 74,124 Z"/><path d="M75,84 C68,80 60,80 54,86 C62,82 70,82 75,86 C72,78 66,74 58,74 C68,74 74,78 76,84 C78,76 84,72 94,72 C86,76 80,80 77,85 C84,80 92,82 96,88 C88,84 82,84 76,86 Z"/></g>' +
      '<rect x="0" y="130" width="360" height="50" fill="#080b14"/><line x1="0" y1="130" x2="360" y2="130" stroke="rgba(216,178,90,0.35)" stroke-width="0.6"/>' +
      '<line class="sc-roll" x1="-40" y1="156" x2="400" y2="156" stroke="#d8b25a" stroke-width="1.6" stroke-dasharray="20 16" opacity="0.6"/>' +
      '<path class="sc-beam" d="M262,124 L360,108 L360,146 Z" fill="#f3dc9a" opacity="0.18"/>' +
      car(96, 92, 170, 'sc-bob') + '</svg>',

    /* Lunch on the cliffs at Shell Beach: a table for two over the water. */
    shell: open + '<defs>' + sky('sc-s2', [[0, '#26457a'], [0.6, '#6a8cb8'], [1, '#e6d7b0']]) +
      '<radialGradient id="sc-sun2"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#fffaf0" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="360" height="180" fill="url(#sc-s2)"/>' +
      '<circle cx="290" cy="34" r="44" fill="url(#sc-sun2)" opacity="0.8"/><circle cx="290" cy="34" r="11" fill="#fff6dc"/>' +
      '<rect x="0" y="96" width="360" height="84" fill="#1d3a63"/>' + waves(104, 6, '#e3ecf7') +
      '<g class="sc-drift"><path d="M200,46 q5,-5 10,0 q5,-5 10,0" fill="none" stroke="#0b1226" stroke-width="1.4"/><path d="M228,58 q4,-4 8,0 q4,-4 8,0" fill="none" stroke="#0b1226" stroke-width="1.2"/></g>' +
      '<path d="M0,98 L150,98 C162,100 170,112 174,130 C178,150 186,166 196,180 L0,180 Z" fill="#141a2b"/><path d="M0,98 L150,98 C162,100 170,112 174,130" fill="none" stroke="#d8b25a" stroke-width="0.8" opacity="0.6"/>' +
      '<path d="M40,98 L136,98 L130,124 L46,124 Z" fill="#efe7d4"/><path d="M46,124 L130,124 L131,128 L45,128 Z" fill="#c9bfa6"/>' +
      '<ellipse cx="68" cy="97" rx="17" ry="4" fill="#fbf7ee" stroke="#c9bfa6" stroke-width="0.6"/><ellipse cx="108" cy="97" rx="17" ry="4" fill="#fbf7ee" stroke="#c9bfa6" stroke-width="0.6"/>' +
      '<ellipse cx="68" cy="96" rx="9" ry="2" fill="#d8b25a" opacity="0.55"/><ellipse cx="108" cy="96" rx="9" ry="2" fill="#d8b25a" opacity="0.55"/>' +
      [0, 1].map(function (i) { var x = i ? 120 : 46; return '<g class="sc-glint" style="animation-delay:' + i * 1.3 + 's"><path d="M' + (x + 2) + ',96 L' + x + ',80 C' + x + ',74 ' + (x + 10) + ',74 ' + (x + 10) + ',80 L' + (x + 8) + ',96 Z" fill="rgba(255,255,255,0.35)" stroke="#fff" stroke-width="0.6"/><path d="M' + (x + 0.6) + ',84 L' + (x + 9.4) + ',84 L' + (x + 8.3) + ',95 L' + (x + 1.7) + ',95 Z" fill="#e9d9a0" opacity="0.7"/></g>'; }).join('') +
      '<line x1="56" y1="124" x2="54" y2="146" stroke="#0b1226" stroke-width="2"/><line x1="120" y1="124" x2="122" y2="146" stroke="#0b1226" stroke-width="2"/></svg>',

    /* Tolosa in the Edna Valley: vines run to the morros, a glass of Pinot. */
    tolosa: open + '<defs>' + sky('sc-s3', [[0, '#1a2446'], [0.55, '#6a5a6a'], [1, '#d7a466']]) +
      '<clipPath id="sc-bowl"><path d="M268,62 C266,92 276,110 296,112 C316,110 326,92 324,62 Z"/></clipPath></defs>' +
      '<rect width="360" height="180" fill="url(#sc-s3)"/>' +
      '<path d="M0,96 C20,70 40,62 58,66 C74,70 84,90 100,94 C116,80 128,58 146,56 C166,54 176,84 190,94 C210,82 226,72 246,76 C270,80 290,92 360,90 L360,180 L0,180 Z" fill="#2a2a40"/>' +
      '<path d="M0,98 L360,98 L360,180 L0,180 Z" fill="#141b2c"/>' +
      [-260, -180, -110, -50, 0, 50, 110, 180, 260, 360].map(function (dx, i) {
        return '<line class="sc-draw" style="animation-delay:' + (i * 0.08) + 's" x1="' + (180 + dx * 0.05) + '" y1="99" x2="' + (180 + dx * 1.4) + '" y2="180" stroke="#4f6b45" stroke-width="' + (2 + Math.abs(dx) / 90) + '" stroke-dasharray="3 3" pathLength="100"/>';
      }).join('') +
      '<g class="sc-tilt"><path d="M268,62 C266,92 276,110 296,112 C316,110 326,92 324,62 Z" fill="rgba(255,255,255,0.12)"/>' +
      '<g clip-path="url(#sc-bowl)"><path class="sc-slosh" d="M250,88 C270,84 286,92 300,88 C314,84 330,90 345,86 L345,130 L250,130 Z" fill="#7a1f33"/></g>' +
      '<path d="M268,62 C266,92 276,110 296,112 C316,110 326,92 324,62" fill="none" stroke="#f8ead0" stroke-width="1.2" opacity="0.8"/>' +
      '<path d="M296,112 L296,150 M280,152 C288,149 304,149 312,152" fill="none" stroke="#f8ead0" stroke-width="1.6" opacity="0.8"/>' +
      '<path d="M274,70 C273,84 276,96 282,102" fill="none" stroke="#fff" stroke-width="1.4" opacity="0.45"/></g>' +
      '<circle class="sc-spark" cx="318" cy="66" r="2" fill="#fff4d6"/></svg>',

    /* Moonstone Beach: the sun goes into the Pacific, the boardwalk in front. */
    cambria: open + '<defs>' + sky('sc-s4', [[0, '#0a1124'], [0.45, '#3b2e52'], [0.75, '#a4525a'], [1, '#eb9a5c']]) +
      '<clipPath id="sc-above"><rect x="0" y="0" width="360" height="106"/></clipPath></defs>' +
      '<rect width="360" height="180" fill="url(#sc-s4)"/>' + stars(30, 60) +
      '<g clip-path="url(#sc-above)"><g class="sc-sink"><circle cx="190" cy="96" r="40" fill="#f7b267" opacity="0.25"/><circle cx="190" cy="96" r="24" fill="#ffd28a"/></g></g>' +
      '<rect x="0" y="106" width="360" height="74" fill="#0d1426"/>' +
      [0, 1, 2, 3, 4, 5].map(function (i) { var w = 46 - i * 6; return '<rect class="sc-shimmer" style="animation-delay:' + (i * 0.3) + 's" x="' + (190 - w / 2) + '" y="' + (110 + i * 7) + '" width="' + w + '" height="1.6" rx="0.8" fill="#ffc77a"/>'; }).join('') +
      waves(122, 4, '#e8a46a') +
      '<g fill="#04060c"><rect x="0" y="146" width="360" height="5"/><rect x="0" y="160" width="360" height="20"/>' +
      [14, 74, 134, 194, 254, 314].map(function (x) { return '<rect x="' + x + '" y="136" width="5" height="30"/>'; }).join('') + '</g>' +
      '<line x1="0" y1="138" x2="360" y2="138" stroke="#04060c" stroke-width="3"/></svg>',

    /* Big Sur: cliffs into the sea, the road on the ledge, McWay Falls. */
    bigsur: open + '<defs>' + sky('sc-s5', [[0, '#16233f'], [0.6, '#4d6283'], [1, '#a9b4c2']]) +
      '<path id="sc-road" d="M-20,92 C30,88 60,96 96,92 C140,86 170,98 210,96 C250,94 280,104 380,100"/></defs>' +
      '<rect width="360" height="180" fill="url(#sc-s5)"/>' +
      '<rect x="0" y="104" width="360" height="76" fill="#14233d"/>' + waves(118, 5, '#cfdcec') +
      '<path d="M0,54 C30,44 60,40 90,48 C120,56 150,52 180,62 C210,72 240,70 270,86 C290,96 310,100 330,106 L0,106 Z" fill="#283350"/>' +
      '<path d="M0,74 C40,66 80,70 110,78 C140,86 170,82 200,92 C230,102 260,104 290,116 L0,116 Z" fill="#1b2340"/>' +
      '<path d="M0,96 C30,90 60,98 96,94 C140,88 170,100 210,98 C240,97 250,110 252,128 C250,142 236,150 222,158 L210,150 C200,144 190,148 184,156 L0,170 Z" fill="#10172b"/>' +
      '<use href="#sc-road" fill="none" stroke="#d8b25a" stroke-width="1" opacity="0.55"/>' +
      '<path class="sc-fall" d="M196,104 C197,120 198,136 198,152" fill="none" stroke="#e9f1fb" stroke-width="2.4" stroke-dasharray="4 5" stroke-linecap="round"/>' +
      '<ellipse cx="198" cy="160" rx="22" ry="5" fill="#c9b48a"/><ellipse class="sc-mist" cx="198" cy="154" rx="9" ry="4" fill="#e9f1fb" opacity="0.4"/>' +
      '<g><use href="#db11" x="-22" y="-12" width="40" height="12.5"/><animateMotion dur="7s" repeatCount="indefinite" rotate="auto"><mpath href="#sc-road"/></animateMotion></g></svg>',

    /* Nepenthe: the terrace high above the coast, a toast and a candle. */
    nepenthe: open + '<defs>' + sky('sc-s6', [[0, '#17264a'], [0.6, '#5c6f92'], [1, '#d9c39a']]) +
      '<radialGradient id="sc-flame"><stop offset="0" stop-color="#fffbe8"/><stop offset="0.5" stop-color="#ffd27a"/><stop offset="1" stop-color="#ff9a3a" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="360" height="180" fill="url(#sc-s6)"/>' +
      '<rect x="0" y="92" width="360" height="88" fill="#1a2c4a"/>' + waves(100, 4, '#dfe8f4') +
      '<path d="M190,92 C220,70 250,74 280,62 C310,52 340,58 360,52 L360,96 L190,96 Z" fill="#2c3754"/><path d="M230,96 C260,84 300,86 360,76 L360,98 L230,98 Z" fill="#212a44"/>' +
      '<g fill="none" stroke="#0a0e19" stroke-width="2.4"><line x1="0" y1="112" x2="360" y2="112"/>' + [20, 70, 120, 170, 220, 270, 320].map(function (x) { return '<line x1="' + x + '" y1="112" x2="' + x + '" y2="136"/>'; }).join('') + '</g>' +
      '<path d="M40,132 L320,132 L340,180 L20,180 Z" fill="#3a2a1e"/><path d="M40,132 L320,132" stroke="#6b4a2e" stroke-width="2"/>' +
      '<ellipse cx="250" cy="152" rx="40" ry="9" fill="#fbf7ee"/><ellipse cx="250" cy="150" rx="22" ry="5" fill="#d8b25a" opacity="0.5"/>' +
      '<rect x="248.5" y="128" width="3" height="20" rx="1" fill="#f3dc9a"/><rect x="248.5" y="132" width="3" height="2" fill="#c43b3b"/><rect x="248.5" y="138" width="3" height="2" fill="#c43b3b"/>' +
      '<g class="sc-flicker"><ellipse cx="250" cy="121" rx="9" ry="12" fill="url(#sc-flame)" opacity="0.6"/><path d="M250,113 C254,118 254,124 250,127 C246,124 246,118 250,113 Z" fill="#ffe7a8"/></g>' +
      '<g class="sc-toast-l"><path d="M80,150 L78,120 C78,112 92,112 92,120 L90,150 Z" fill="rgba(255,255,255,0.22)" stroke="#f8ead0" stroke-width="0.8"/><path d="M78.6,128 L91.4,128 L90.3,149 L79.7,149 Z" fill="#e9d9a0" opacity="0.7"/></g>' +
      '<g class="sc-toast-r"><path d="M166,150 L164,120 C164,112 178,112 178,120 L176,150 Z" fill="rgba(255,255,255,0.22)" stroke="#f8ead0" stroke-width="0.8"/><path d="M164.6,128 L177.4,128 L176.3,149 L165.7,149 Z" fill="#e9d9a0" opacity="0.7"/></g>' +
      '<g class="sc-burst" fill="#fff4d6"><circle cx="128" cy="106" r="1.6"/><circle cx="116" cy="100" r="1.1"/><circle cx="140" cy="99" r="1.2"/><circle cx="108" cy="110" r="0.9"/><circle cx="148" cy="110" r="0.9"/></g></svg>',

    /* Bixby Bridge: the arch over the canyon, and the car going across. */
    bixby: open + '<defs>' + sky('sc-s7', [[0, '#15223f'], [0.6, '#5a6688'], [1, '#e0b47a']]) + '</defs>' +
      '<rect width="360" height="180" fill="url(#sc-s7)"/>' +
      '<rect x="0" y="140" width="360" height="40" fill="#14233d"/>' + waves(148, 3, '#dfe8f4') +
      '<path d="M0,60 C20,62 40,70 54,80 C64,100 70,126 76,146 L0,146 Z" fill="#141b2e"/><path d="M360,56 C340,60 320,66 304,78 C296,100 290,126 284,146 L360,146 Z" fill="#141b2e"/>' +
      '<g fill="none" stroke="#c9c2b2" stroke-linecap="round">' +
      '<path d="M62,74 L298,74" stroke-width="3.4"/><path d="M62,80 L298,80" stroke-width="1"/>' +
      '<path d="M96,146 C110,96 150,82 180,82 C210,82 250,96 264,146" stroke-width="3.6"/>' +
      [104, 118, 132, 146, 160, 200, 214, 228, 242, 256].map(function (x) { var t = (x - 180) / 84, y = 82 + 64 * t * t * 1.02; return '<line x1="' + x + '" y1="80" x2="' + x + '" y2="' + Math.min(146, y).toFixed(1) + '" stroke-width="1.4"/>'; }).join('') +
      '<line x1="86" y1="80" x2="86" y2="146" stroke-width="2.2"/><line x1="274" y1="80" x2="274" y2="146" stroke-width="2.2"/></g>' +
      car(0, 60, 48, 'sc-cross') + '</svg>',

    /* La Selva Beach: lights on at the house, the car pulls in. */
    laselva: open + '<defs>' + sky('sc-s8', [[0, '#080e20'], [0.6, '#1f2848'], [1, '#4a4a6a']]) +
      '<radialGradient id="sc-moon"><stop offset="0" stop-color="#fdf6e3"/><stop offset="0.3" stop-color="#fdf6e3" stop-opacity="0.35"/><stop offset="1" stop-color="#fdf6e3" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="360" height="180" fill="url(#sc-s8)"/>' + stars(40, 80) +
      '<circle cx="66" cy="40" r="30" fill="url(#sc-moon)"/><circle cx="66" cy="40" r="9" fill="#fdf6e3"/>' +
      '<rect x="0" y="112" width="360" height="68" fill="#0b1324"/>' + waves(120, 4, '#c9d6ea') +
      '<path d="M190,112 C220,100 250,96 290,96 L360,94 L360,160 L190,160 Z" fill="#0d1120"/>' +
      '<g fill="#070a14"><path d="M226,96 L250,78 L274,96 L274,120 L226,120 Z"/><path d="M276,94 L304,72 L332,94 L332,120 L276,120 Z"/></g>' +
      '<g fill="#ffd27a"><rect class="sc-light" style="animation-delay:0.4s" x="236" y="100" width="8" height="8"/><rect class="sc-light" style="animation-delay:0.9s" x="256" y="100" width="8" height="8"/>' +
      '<rect class="sc-light" style="animation-delay:1.4s" x="286" y="98" width="9" height="9"/><rect class="sc-light" style="animation-delay:1.9s" x="312" y="98" width="9" height="9"/><rect class="sc-light" style="animation-delay:2.4s" x="299" y="108" width="7" height="12"/></g>' +
      '<rect x="0" y="152" width="360" height="28" fill="#06080f"/>' +
      car(150, 124, 92, 'sc-arrive') + '</svg>'
  };
})();
