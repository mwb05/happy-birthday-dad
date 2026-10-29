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

    /* Lilac Patisserie, Santa Barbara: coffee steaming, a pastry, palms and a red-tile roof outside. */
    sb: open + '<defs>' + sky('sc-s9', [[0, '#3a5f93'], [0.6, '#8fb0cf'], [1, '#f0dcb4']]) +
      '<linearGradient id="sc-cup" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9e2d2"/><stop offset="0.45" stop-color="#fffdf7"/><stop offset="1" stop-color="#cfc5b0"/></linearGradient></defs>' +
      '<rect width="360" height="180" fill="url(#sc-s9)"/>' +
      '<circle cx="60" cy="38" r="16" fill="#fff6dc" opacity="0.9"/>' +
      '<path d="M0,96 C40,86 90,90 130,84 C170,78 210,88 250,82 C300,76 330,84 360,80 L360,110 L0,110 Z" fill="#6f7f8f" opacity="0.5"/>' +
      '<g transform="translate(256,94) scale(0.8) translate(-256,-112)"><g fill="#efe3cf"><rect x="196" y="62" width="120" height="50"/><rect x="232" y="40" width="24" height="24"/></g>' +
      '<g fill="#b4553a"><path d="M188,64 L204,50 L308,50 L324,64 Z"/><path d="M228,42 L244,30 L260,42 Z"/></g>' +
      '<g fill="#3a2c22"><path d="M214,112 L214,86 C214,78 228,78 228,86 L228,112 Z"/><path d="M244,112 L244,86 C244,78 258,78 258,86 L258,112 Z"/><path d="M274,112 L274,86 C274,78 288,78 288,86 L288,112 Z"/><rect x="238" y="46" width="12" height="12" rx="6"/></g></g>' +
      '<g transform="translate(150,94) scale(0.68) translate(-150,-120)"><g class="sc-sway" style="transform-origin:150px 120px"><path d="M148,120 C149,96 150,72 152,40 L155,40 C154,72 153,96 153,120 Z" fill="#2c2a26"/>' +
      '<path d="M153,40 C138,30 122,32 112,44 C126,36 140,36 153,42 C144,28 132,22 118,22 C134,22 146,28 154,40 C158,26 170,18 186,18 C172,24 162,30 156,40 C170,32 186,34 194,46 C182,38 168,38 155,42 Z" fill="#33503a"/></g></g>' +
      '<rect x="0" y="94" width="360" height="86" fill="#2a1e1a"/><rect x="0" y="94" width="360" height="3" fill="#4a362c"/><g transform="translate(0,-24)">' +
      '<ellipse cx="128" cy="160" rx="46" ry="9" fill="#f7f2e6"/><ellipse cx="128" cy="158" rx="40" ry="7" fill="#fffdf7" stroke="#d8cdb6" stroke-width="0.8"/>' +
      '<path d="M104,128 L152,128 C152,146 146,156 128,156 C110,156 104,146 104,128 Z" fill="url(#sc-cup)"/>' +
      '<path d="M152,134 C164,134 164,148 150,148" fill="none" stroke="#e4dccb" stroke-width="4"/>' +
      '<ellipse cx="128" cy="128" rx="24" ry="5" fill="#5a3a24"/><ellipse cx="128" cy="128" rx="13" ry="2.6" fill="#c49a6a" opacity="0.8"/>' +
      [0, 1, 2].map(function (i) { return '<path class="sc-steam" style="animation-delay:' + i * 0.9 + 's" d="M' + (120 + i * 8) + ',122 C' + (114 + i * 8) + ',112 ' + (126 + i * 8) + ',104 ' + (120 + i * 8) + ',92" fill="none" stroke="#fffaf0" stroke-width="2" stroke-linecap="round"/>'; }).join('') +
      '<ellipse cx="236" cy="162" rx="38" ry="7" fill="#f7f2e6"/>' +
      '<path d="M206,158 C206,140 224,132 236,132 C250,132 266,140 266,158 Z" fill="#d89a4e"/><path d="M212,150 C222,144 250,144 260,150 M216,142 C228,137 244,137 256,142" fill="none" stroke="#b5722e" stroke-width="2"/>' +
      '<path d="M210,156 C220,150 252,150 262,156" fill="none" stroke="#f3cf8e" stroke-width="1.2" opacity="0.8"/></g></svg>',

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

    /* Morro Rock: the dome in the late sun, gulls overhead, an otter floating on its back. */
    morro: open + '<defs>' + sky('sc-s10', [[0, '#253a66'], [0.55, '#9c7d86'], [1, '#f0b878']]) +
      '<linearGradient id="sc-rock" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a3e44"/><stop offset="0.6" stop-color="#2a2430"/><stop offset="1" stop-color="#1a1622"/></linearGradient></defs>' +
      '<rect width="360" height="180" fill="url(#sc-s10)"/>' +
      '<circle cx="78" cy="70" r="30" fill="#ffd8a0" opacity="0.25"/><circle cx="78" cy="70" r="13" fill="#ffe2b0"/>' +
      '<path d="M150,112 C152,84 162,56 188,44 C206,36 228,38 244,52 C262,68 270,92 274,112 Z" fill="url(#sc-rock)"/>' +
      '<path d="M162,96 C170,74 184,58 200,52 M214,48 C230,52 244,66 252,84" fill="none" stroke="#f0b878" stroke-width="1" opacity="0.35"/>' +
      '<path d="M240,112 C270,108 300,106 360,108 L360,114 L240,114 Z" fill="#1c1a24"/><path d="M0,110 C40,108 100,108 150,112 L0,114 Z" fill="#1c1a24"/>' +
      '<rect x="0" y="112" width="360" height="68" fill="#17304f"/>' + waves(120, 5, '#f0c79a') +
      '<g class="sc-drift"><path d="M110,34 q5,-5 10,0 q5,-5 10,0" fill="none" stroke="#1a1622" stroke-width="1.4"/><path d="M138,46 q4,-4 8,0 q4,-4 8,0" fill="none" stroke="#1a1622" stroke-width="1.2"/><path d="M96,52 q3,-3 6,0 q3,-3 6,0" fill="none" stroke="#1a1622" stroke-width="1"/></g>' +
      '<g transform="translate(0,-20)"><g class="sc-float"><ellipse cx="112" cy="150" rx="24" ry="5" fill="#0e2038" opacity="0.6"/>' +
      '<path d="M90,148 C96,142 124,140 134,146 C130,150 98,152 90,148 Z" fill="#5a4636"/>' +
      '<circle cx="137" cy="143" r="5.5" fill="#6a5442"/><circle cx="139" cy="141" r="1" fill="#0b0a0c"/><ellipse cx="141.5" cy="144" rx="1.6" ry="1.2" fill="#e8dccb"/>' +
      '<path d="M112,142 C114,136 120,136 122,141" fill="none" stroke="#6a5442" stroke-width="3" stroke-linecap="round"/><ellipse cx="117" cy="139" rx="3" ry="2" fill="#8a8f98"/>' +
      '<path d="M90,148 L82,144 L84,150 Z" fill="#5a4636"/></g></g></svg>',

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

    /* Piedras Blancas: the lighthouse up the coast, bulls on the sand, one rearing up to bellow. */
    seals: open + '<defs>' + sky('sc-s11', [[0, '#2b4570'], [0.6, '#7d95b4'], [1, '#e2d6bc']]) + '</defs>' +
      '<rect width="360" height="180" fill="url(#sc-s11)"/>' +
      '<rect x="0" y="92" width="360" height="40" fill="#22406a"/>' + waves(98, 4, '#e8eef6') +
      '<g fill="#e9e6de"><path d="M300,92 L303,62 L309,62 L312,92 Z"/><rect x="301" y="56" width="10" height="6"/></g><path d="M300,56 L306,50 L312,56 Z" fill="#9a3b33"/>' +
      '<circle class="sc-twinkle" cx="306" cy="59" r="2.4" fill="#fff4c8"/><path d="M286,92 C296,86 316,86 330,92 Z" fill="#3c4a5c"/>' +
      '<rect x="0" y="120" width="360" height="60" fill="#c9b48a"/><g transform="translate(0,-20)"><path d="M0,124 C60,118 120,122 180,118 C240,114 300,120 360,116 L360,180 L0,180 Z" fill="#c9b48a"/>' +
      '<path d="M0,124 C60,118 120,122 180,118 C240,114 300,120 360,116" fill="none" stroke="#f4efe4" stroke-width="1.4" opacity="0.6" class="sc-mist"/>' +
      '<g fill="#5b5048"><path d="M30,160 C34,148 70,144 92,150 C100,152 104,158 100,162 C80,166 44,166 30,160 Z"/><path d="M200,166 C206,154 244,152 262,158 C270,161 270,166 264,168 C244,171 214,170 200,166 Z"/>' +
      '<path d="M268,146 C272,138 296,136 310,141 C316,143 316,148 312,150 C298,152 278,151 268,146 Z"/></g>' +
      '<g class="sc-rear" style="transform-origin:150px 166px"><path d="M108,166 C108,152 124,146 140,142 C150,128 156,112 168,104 C176,100 184,104 184,112 C184,118 178,122 172,126 C168,138 166,152 170,166 Z" fill="#6b5e54"/>' +
      '<path d="M168,104 C174,96 186,98 190,104 C192,110 188,114 184,114 C186,108 180,104 176,106 Z" fill="#7d6f63"/><circle cx="178" cy="106" r="1.4" fill="#0b0a0c"/>' +
      '<path d="M184,112 C190,116 192,122 188,126" fill="none" stroke="#4a4038" stroke-width="2.4" stroke-linecap="round"/></g>' +
      '<g class="sc-burst" fill="none" stroke="#f4efe4" stroke-width="1.2"><path d="M196,104 q6,-4 10,0"/><path d="M198,96 q8,-6 14,0"/></g></g></svg>',

    /* Ragged Point: high on the cliff edge, the coast running north into haze, the car pulled over. */
    ragged: open + '<defs>' + sky('sc-s12', [[0, '#1d3460'], [0.55, '#6f8db5'], [1, '#e8dcc2']]) +
      '<linearGradient id="sc-haze" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8ea4c0" stop-opacity="0.9"/><stop offset="1" stop-color="#8ea4c0" stop-opacity="0"/></linearGradient></defs>' +
      '<rect width="360" height="180" fill="url(#sc-s12)"/>' +
      '<circle cx="300" cy="40" r="26" fill="#fff6dc" opacity="0.25"/><circle cx="300" cy="40" r="10" fill="#fff6dc"/>' +
      '<rect x="0" y="92" width="360" height="88" fill="#1f3b63"/>' + waves(100, 5, '#e3ecf7') +
      '<path d="M0,72 C20,66 40,70 60,78 C80,86 96,88 112,94 L0,96 Z" fill="#5d7090"/>' +
      '<path d="M0,82 C30,76 60,82 90,92 C110,98 130,100 150,104 L0,106 Z" fill="#40506e"/>' +
      '<rect x="0" y="66" width="200" height="40" fill="url(#sc-haze)" opacity="0.35"/>' +
      '<path d="M170,180 C176,150 190,124 214,108 C236,94 262,90 290,92 L360,92 L360,180 Z" fill="#141b2e"/>' +
      '<path d="M214,108 C236,94 262,90 290,92 L360,92" fill="none" stroke="#d8b25a" stroke-width="0.8" opacity="0.55"/>' +
      '<g stroke="#6b5a40" stroke-width="1.4"><line x1="222" y1="104" x2="222" y2="96"/><line x1="246" y1="96" x2="246" y2="88"/><line x1="270" y1="92" x2="270" y2="84"/><path d="M222,98 C232,92 238,90 246,90 C256,88 262,86 270,86" fill="none"/></g>' +
      '<g class="sc-sway" style="transform-origin:330px 92px"><path d="M328,92 L330,62 L333,62 L334,92 Z" fill="#1a1622"/><path d="M304,64 C312,52 324,48 332,52 C342,46 354,50 360,58 C352,58 346,60 340,64 C330,60 318,62 304,64 Z" fill="#22352a"/></g>' +
      car(252, 73, 62, 'sc-bob') +
      '<g class="sc-drift"><path d="M90,40 q5,-5 10,0 q5,-5 10,0" fill="none" stroke="#0b1226" stroke-width="1.3"/></g></svg>',

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

    /* McWay Falls up close: the fall drops off the bluff onto the cove, turquoise water, a cypress. */
    mcway: open + '<defs>' + sky('sc-s13', [[0, '#1c3562'], [0.6, '#6d8ab0'], [1, '#cfd8e2']]) +
      '<linearGradient id="sc-cove" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f8f9a"/><stop offset="1" stop-color="#14405e"/></linearGradient></defs>' +
      '<rect width="360" height="180" fill="url(#sc-s13)"/>' +
      '<rect x="0" y="150" width="360" height="30" fill="#1a2438"/><g transform="translate(0,-22)"><rect x="0" y="96" width="360" height="84" fill="#1a3a60"/>' + waves(104, 3, '#e3ecf7') +
      '<path d="M0,40 C30,36 70,44 100,56 C120,64 128,80 132,100 L136,180 L0,180 Z" fill="#1e2a3e"/>' +
      '<path d="M360,58 C330,58 300,66 270,80 C250,92 246,110 246,130 L250,180 L360,180 Z" fill="#1a2438"/>' +
      '<path d="M132,104 C170,120 210,124 246,112 L250,180 L136,180 Z" fill="url(#sc-cove)"/>' +
      '<path d="M140,150 C170,160 210,160 240,150 C238,166 222,176 190,176 C160,176 144,166 140,150 Z" fill="#e3d3ac"/>' +
      '<path d="M140,150 C170,160 210,160 240,150" fill="none" stroke="#f4efe4" stroke-width="1.4" opacity="0.7" class="sc-mist"/>' +
      '<path d="M100,56 C112,60 120,66 126,74 L132,74 L132,80 L100,80 Z" fill="#2c3a50"/>' +
      '<path class="sc-fall" d="M130,76 C134,96 140,120 146,150" fill="none" stroke="#eef5fc" stroke-width="3.2" stroke-dasharray="5 4" stroke-linecap="round"/>' +
      '<path class="sc-fall" style="animation-delay:-0.3s" d="M127,76 C130,98 135,122 141,150" fill="none" stroke="#d6e6f6" stroke-width="1.6" stroke-dasharray="3 6" stroke-linecap="round" opacity="0.7"/>' +
      '<ellipse class="sc-mist" cx="146" cy="152" rx="12" ry="5" fill="#eef5fc" opacity="0.5"/>' +
      '<g fill="#14251c"><path d="M46,46 L48,22 L51,22 L52,46 Z"/><path d="M20,26 C30,14 44,10 50,16 C58,8 74,10 82,20 C70,20 62,22 54,26 C44,22 32,22 20,26 Z"/><path d="M30,32 C38,24 48,22 52,26 C60,22 70,24 76,30 C66,30 58,32 50,34 C44,30 36,30 30,32 Z"/></g>' +
      '<g class="sc-drift"><path d="M220,52 q5,-5 10,0 q5,-5 10,0" fill="none" stroke="#0b1226" stroke-width="1.3"/></g></g></svg>',

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

    /* Carmel-by-the-Sea: the lone cypress on the white sand, the town lit for Christmas behind. */
    carmel: open + '<defs>' + sky('sc-s14', [[0, '#1a2448'], [0.55, '#6a6688'], [1, '#e8b88a']]) + '</defs>' +
      '<rect width="360" height="180" fill="url(#sc-s14)"/>' +
      '<circle cx="110" cy="96" r="30" fill="#ffd8a0" opacity="0.2"/><circle cx="110" cy="96" r="11" fill="#ffe2b8"/>' +
      '<rect x="0" y="100" width="360" height="80" fill="#1d3354"/>' + waves(108, 3, '#f0d2b0') +
      '<g fill="#2a2638"><path d="M200,100 L200,74 L214,64 L228,74 L228,100 Z"/><path d="M230,100 L230,80 L246,70 L262,80 L262,100 Z"/><path d="M264,100 L264,70 L280,58 L296,70 L296,100 Z"/><path d="M298,100 L298,78 L314,68 L330,78 L330,100 Z"/><path d="M332,100 L332,72 L346,62 L360,72 L360,100 Z"/></g>' +
      '<g fill="#ffd27a">' + [[208, 82], [218, 84], [240, 86], [252, 86], [272, 76], [286, 78], [306, 84], [320, 84], [340, 80], [352, 82]].map(function (p, i) { return '<rect class="sc-light" style="animation-delay:' + (0.3 + i * 0.18) + 's" x="' + p[0] + '" y="' + p[1] + '" width="5" height="6"/>'; }).join('') + '</g>' +
      '<path d="M196,72 C230,60 270,52 310,58 C330,60 350,56 360,52" fill="none" stroke="#3a3446" stroke-width="0.6"/>' +
      [200, 214, 228, 242, 256, 270, 284, 298, 312, 326, 340, 354].map(function (x, i) { var y = 70 - (x - 196) * 0.09 + Math.sin(i) * 2; return '<circle class="sc-twinkle" style="animation-delay:' + (i % 5) * 0.4 + 's" cx="' + x + '" cy="' + y.toFixed(1) + '" r="1.5" fill="' + (i % 3 === 0 ? '#ff8a7a' : i % 3 === 1 ? '#fff0b8' : '#9fe0b0') + '"/>'; }).join('') +
      '<path d="M0,128 C60,122 140,124 220,120 C280,117 330,122 360,120 L360,180 L0,180 Z" fill="#efe6d2"/>' +
      '<path d="M0,128 C60,122 140,124 220,120 C280,117 330,122 360,120" fill="none" stroke="#fff" stroke-width="1.6" opacity="0.7" class="sc-mist"/>' +
      '<g class="sc-sway" style="transform-origin:66px 150px"><path d="M60,150 C62,130 58,112 66,96 C70,88 78,84 84,80 L86,84 C78,90 72,96 70,110 C68,124 70,138 72,150 Z" fill="#2a2018"/>' +
      '<path d="M30,92 C36,78 56,72 70,76 C80,66 104,66 116,76 C108,78 100,80 94,86 C80,82 72,84 64,90 C52,86 40,88 30,92 Z" fill="#1c3426"/>' +
      '<path d="M70,74 C78,62 96,58 108,64 C100,66 92,68 86,72 Z" fill="#244030"/></g>' +
      '<path d="M140,150 c3,-1 6,1 9,0 M160,158 c3,-1 6,1 9,0" stroke="#c9b48a" stroke-width="1" fill="none"/></svg>',

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
