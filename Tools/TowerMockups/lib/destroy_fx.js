/* PROTOTYPE - NOT FOR PRODUCTION */
/* Signature destroy effects per tower (layered on top of the shared collapse in lib/anim.js).
 * Each entry: { color: flash tint for frame 0, fx(c, tier, f, n, ft) } where f = frame (0..5),
 * ft = {r, h} footprint. Everything here draws on the fx layer (no silhouette outline).
 * Theme: what is INSIDE the tower is what goes off — shells, belts, fuel, ice, charge, nets…
 */
(function () {
  const GY = 80, CX = 64;
  const R = s => { let x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const fx = (c, fn) => G.fx(c, fn);
  const clampXY = (x, y) => [Math.max(4, Math.min(124, x)), Math.max(4, Math.min(124, y))];

  /* ---------- building blocks ---------- */
  const H = {};
  /** star burst / flash */
  H.burst = (c, x, y, r, cols) => fx(c, o => { o.save(); o.translate(x, y); o.beginPath(); for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, rr = (i % 2 ? .45 : 1) * r; o.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * .85); } o.closePath(); o.fillStyle = cols[0]; o.fill(); o.strokeStyle = G.OUT; o.lineWidth = 1.2; o.stroke(); o.beginPath(); o.ellipse(0, 0, r * .45, r * .38, 0, 0, 7); o.fillStyle = cols[1] || '#fffbe8'; o.fill(); o.restore(); });
  /** layered fireball rising */
  H.fireball = (c, x, y, r, k) => fx(c, o => { [[1, '#b23d1f'], [.78, '#ef5b31'], [.55, '#ffb04a'], [.3, '#fff1b0']].forEach(([s, col], i) => { const rr = r * s * k; const [px, py] = clampXY(x + (i % 2 ? 2 : -2) * k, y - i * 2 * k); o.beginPath(); o.arc(px, py, Math.max(1, Math.min(rr, py - 3, 125 - px, px - 3)), 0, 7); o.fillStyle = col; o.fill(); }); o.beginPath(); o.arc(x, y, Math.max(1, r * k), 0, 7); o.strokeStyle = 'rgba(44,34,64,.7)'; o.lineWidth = 1.2; o.stroke(); });
  /** shards flying out from (x,y); t = 0..1 progress */
  H.shards = (c, x, y, n, t, cols, size, seed) => fx(c, o => { for (let i = 0; i < n; i++) { const a = -Math.PI * (.05 + R(i + seed) * .9), sp = 18 + R(i + seed + 3) * 22; const px = x + Math.cos(a) * sp * t * 1.2, py = y + Math.sin(a) * sp * t + 26 * t * t; if (px < 4 || px > 124 || py < 4 || py > 124) continue; const s = (size || 3) * (.6 + R(i + seed + 5) * .7); o.save(); o.translate(px, py); o.rotate(R(i + seed) * 6 + t * 5); o.beginPath(); o.moveTo(0, -s); o.lineTo(s * .7, 0); o.lineTo(0, s * .8); o.lineTo(-s * .6, 0); o.closePath(); o.fillStyle = cols[i % cols.length]; o.fill(); o.strokeStyle = G.OUT; o.lineWidth = .9; o.stroke(); o.restore(); } });
  /** sparks / tracers radiating */
  H.sparks = (c, x, y, n, t, col, seed, len) => fx(c, o => { o.lineCap = 'round'; for (let i = 0; i < n; i++) { const a = R(i + seed) * Math.PI * 2, d1 = 4 + t * 20 * (.5 + R(i + seed + 2)), d2 = d1 + (len || 5); const p1 = clampXY(x + Math.cos(a) * d1, y + Math.sin(a) * d1 * .8), p2 = clampXY(x + Math.cos(a) * d2, y + Math.sin(a) * d2 * .8); o.beginPath(); o.moveTo(...p1); o.lineTo(...p2); o.strokeStyle = 'rgba(44,34,64,.55)'; o.lineWidth = 2.6; o.stroke(); o.strokeStyle = col; o.lineWidth = 1.4; o.stroke(); } });
  /** jagged electric arcs around a point */
  H.arcs = (c, x, y, r, n, col, seed) => fx(c, o => { for (let k = 0; k < n; k++) { const a0 = R(k + seed) * Math.PI * 2; let px = x, py = y; o.beginPath(); o.moveTo(px, py); for (let i = 1; i <= 5; i++) { const a = a0 + (R(k * 7 + i + seed) - .5) * 1.2; px = x + Math.cos(a) * r * i / 5; py = y + Math.sin(a) * r * i / 5 * .8; [px, py] = clampXY(px, py); o.lineTo(px, py); } o.strokeStyle = 'rgba(44,34,64,.6)'; o.lineWidth = 3; o.stroke(); o.strokeStyle = col; o.lineWidth = 1.6; o.stroke(); } });
  /** flat shock ring on the ground */
  H.ring = (c, x, y, r, col, k) => fx(c, o => { o.beginPath(); o.ellipse(x, y, Math.min(r, 60), Math.min(r, 60) * G.K, 0, 0, 7); o.lineWidth = 4 * k; o.strokeStyle = G.rgba(col, .7 * k); o.stroke(); o.lineWidth = 1.2; o.strokeStyle = G.rgba('#ffffff', .8 * k); o.stroke(); });
  /** liquid splash blobs */
  H.splash = (c, x, y, n, t, col, seed) => fx(c, o => { for (let i = 0; i < n; i++) { const a = -Math.PI * (.1 + R(i + seed) * .8), sp = 14 + R(i + seed + 1) * 16; const px = x + Math.cos(a) * sp * t * 1.3, py = y + Math.sin(a) * sp * t + 24 * t * t; if (px < 4 || px > 124 || py < 4 || py > 124) continue; const r = 1.6 + R(i + seed + 4) * 2.4; o.beginPath(); o.ellipse(px, py, r, r * 1.2, 0, 0, 7); o.fillStyle = col; o.fill(); o.strokeStyle = G.OUT; o.lineWidth = .9; o.stroke(); } });
  /** ground puddle with optional bubbles / flames */
  H.puddle = (c, x, y, rx, col, extra, f) => fx(c, o => { o.beginPath(); for (let i = 0; i <= 12; i++) { const a = i / 12 * Math.PI * 2, k = .8 + R(i + 3) * .35; o.lineTo(x + Math.cos(a) * rx * k, y + Math.sin(a) * rx * k * G.K * .8); } o.closePath(); o.fillStyle = G.rgba(col, .75); o.fill(); o.strokeStyle = 'rgba(44,34,64,.5)'; o.lineWidth = 1; o.stroke();
    if (extra === 'bubbles') for (let i = 0; i < 4; i++) { const bx = x + (R(i + f) - .5) * rx * 1.4, by = y + (R(i + f + 2) - .5) * rx * .5; o.beginPath(); o.arc(bx, by, 1 + R(i + f + 5) * 1.5, 0, 7); o.fillStyle = '#e8ffb0'; o.fill(); o.strokeStyle = G.OUT; o.lineWidth = .7; o.stroke(); }
    if (extra === 'flames') for (let i = 0; i < 4; i++) { const bx = x + (i - 1.5) * rx * .45, by = y - 1, h = 4 + R(i + f * 3) * 4; o.beginPath(); o.moveTo(bx - 2.2, by); o.quadraticCurveTo(bx - 1.5, by - h * .7, bx, by - h); o.quadraticCurveTo(bx + 1.5, by - h * .7, bx + 2.2, by); o.closePath(); o.fillStyle = '#ff9a3a'; o.fill(); o.strokeStyle = G.OUT; o.lineWidth = .9; o.stroke(); o.beginPath(); o.ellipse(bx, by - h * .3, 1, h * .25, 0, 0, 7); o.fillStyle = '#ffe08a'; o.fill(); } });
  /** cold / steam cloud */
  H.cloud = (c, x, y, r, k, col) => { for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2, px = x + Math.cos(a) * r * .6, py = y + Math.sin(a) * r * .35 - k * 4; const rr = Math.min(r * .45 * (.7 + k * .5), py - 3, 125 - px, px - 3); if (rr > 1) G.puff(c, px, py, rr, .8 * (1.1 - k * .4), col); } };
  /** brass casings bouncing */
  H.casings = (c, x, y, n, t, seed) => fx(c, o => { for (let i = 0; i < n; i++) { const a = -Math.PI * (.15 + R(i + seed) * .7), sp = 10 + R(i + seed + 1) * 18; const px = x + Math.cos(a) * sp * t * 1.3, py = y + Math.sin(a) * sp * t + 30 * t * t; if (px < 4 || px > 124 || py < 4 || py > 124) continue; o.save(); o.translate(px, py); o.rotate(R(i) * 6 + t * 8); o.fillStyle = '#d9a441'; o.fillRect(-1.6, -.9, 3.2, 1.8); o.strokeStyle = G.OUT; o.lineWidth = .7; o.strokeRect(-1.6, -.9, 3.2, 1.8); o.restore(); } });
  /** net mesh piece */
  H.nets = (c, x, y, n, t, seed) => fx(c, o => { for (let i = 0; i < n; i++) { const a = -Math.PI * (.1 + R(i + seed) * .8), sp = 12 + R(i + seed + 2) * 14; const px = x + Math.cos(a) * sp * t * 1.3, py = y + Math.sin(a) * sp * t + 18 * t * t; if (px < 6 || px > 122 || py < 6 || py > 122) continue; const s = 4 + R(i + seed + 4) * 3; o.save(); o.translate(px, py); o.rotate(R(i) * 3 + t * 3); o.strokeStyle = '#c08a4a'; o.lineWidth = 1; for (let k = -1; k <= 1; k++) { o.beginPath(); o.moveTo(-s, k * s * .5); o.lineTo(s, k * s * .5); o.stroke(); o.beginPath(); o.moveTo(k * s * .5, -s); o.lineTo(k * s * .5, s); o.stroke(); } o.fillStyle = '#b9de3a'; [[-s, -s], [s, s]].forEach(([a2, b2]) => { o.beginPath(); o.arc(a2, b2, 1.3, 0, 7); o.fill(); }); o.restore(); } });

  const top = (ft, k) => GY - ft.h * (k == null ? .7 : k);

  window.DESTROY_FX = {
    mortar: { color: '#ffd9a0', smoke: '#cfc6c0', debris: ['#3c3f52','#d4a345','#b9ac93'], fx(c, t, f, n, ft) {
      const y = top(ft, .85);
      if (f === 1) H.burst(c, CX, y, 9 + t * 2, ['#ffb04a', '#fff1b0']);
      if (f === 2) H.fireball(c, CX, y - 6, 12 + t * 2, 1);
      if (f === 3) { H.fireball(c, CX + 2, y - 12, 10 + t * 2, .8); H.shards(c, CX, y, 8, .7, ['#3c3f52', '#d4a345'], 3.4, 11); }
      if (f === 4) H.cloud(c, CX, y - 12, 18, .8, '#cfc8d2');
    } },
    machine_gun: { color: '#ffe6a0', smoke: '#d8d6e0', debris: ['#506a9c','#97a7bd','#d9a441'], fx(c, t, f, n, ft) {
      const y = top(ft, .7);
      if (f >= 1 && f <= 4) { H.sparks(c, CX + (f % 2 ? 6 : -6), y, 6 + t * 2, f / 4, '#ffcf4a', f * 5, 6); H.casings(c, CX, y + 4, 10 + t * 3, f / 4, f); }
      if (f === 2 || f === 3) H.burst(c, CX + (f === 2 ? -8 : 9), y - 4, 5, ['#ffcf4a', '#fff4c8']);
    } },
    flamethrower: { color: '#ffc08a', smoke: '#7d7280', debris: ['#b8352b','#ef5b31','#5d6d86'], fx(c, t, f, n, ft) {
      const y = top(ft, .55);
      if (f === 1) H.burst(c, CX, y - 4, 10, ['#ef5b31', '#ffd27a']);
      if (f === 2) H.fireball(c, CX, y - 8, 15 + t * 3, 1);
      if (f === 3) { H.fireball(c, CX - 6, y - 14, 12 + t * 2, .8); H.splash(c, CX, y, 8, .6, '#ef5b31', 4); }
      if (f >= 3) H.puddle(c, CX + 4, GY + 6, 16 + t * 3, '#3a2a2a', 'flames', f);
      if (f === 4) H.cloud(c, CX, y - 18, 18, .9, '#8a8090');
    } },
    fortifier: { color: '#d8fff4', smoke: '#d7efe8', debris: ['#3fbf9f','#8fa3c0','#b9ac93'], fx(c, t, f, n, ft) {
      const y = top(ft, 1.05);
      if (f === 1) { H.sparks(c, CX, y, 10, .3, '#9ff0d6', 7, 5); H.burst(c, CX, y, 7, ['#7fdcc0', '#ffffff']); }
      if (f === 2 || f === 3) H.shards(c, CX, y, 7, (f - 1) / 2, ['#3fbf9f', '#8fa3c0', '#7fdcc0'], 4, 21);
      if (f === 3) H.ring(c, CX, GY + 2, 30 + t * 6, '#3fbf9f', .8);
    } },
    cryo_tower: { color: '#e8faff', smoke: '#e4f6ff', debris: ['#7fd6ff','#e8faff','#9db1c2'], fx(c, t, f, n, ft) {
      const y = top(ft, .7);
      if (f === 1) H.burst(c, CX, y, 10, ['#bdeeff', '#ffffff']);
      if (f >= 1 && f <= 3) H.shards(c, CX, y, 12 + t * 2, f / 3, ['#7fd6ff', '#e8faff', '#3f9fcf'], 4, 31);
      if (f >= 2 && f <= 4) H.cloud(c, CX, GY - 6, 22 + t * 3, (f - 1) / 3, '#d4f1ff');
      if (f >= 4) fx(c, o => { [[54, GY + 4], [72, GY + 6], [64, GY + 10]].forEach(([x, yy], i) => { o.save(); o.translate(x, yy); o.rotate(i - 1); o.beginPath(); o.moveTo(-3, 0); o.lineTo(0, -5); o.lineTo(3, 0); o.lineTo(0, 2); o.closePath(); o.fillStyle = '#9fdcff'; o.fill(); o.strokeStyle = G.OUT; o.lineWidth = .9; o.stroke(); o.restore(); }); });
    } },
    chain_tesla: { color: '#efe0ff', smoke: '#e6dcf3', debris: ['#e08a4e','#c58cff','#f0ece4'], fx(c, t, f, n, ft) {
      const y = top(ft, .95);
      if (f <= 3) H.arcs(c, CX, y, 18 + t * 4, 4 + f, '#c58cff', f * 13 + 1);
      if (f === 1 || f === 2) H.burst(c, CX, y, 8 + f * 2, ['#c58cff', '#ffffff']);
      if (f === 3) H.ring(c, CX, GY + 2, 34, '#9a6ad8', .9);
      if (f >= 4) H.sparks(c, CX, GY - 4, 4, .3, '#dcb8ff', f * 7, 3);
    } },
    sun_rod: { color: '#fff7c8', smoke: '#f3e9c8', debris: ['#e97d4e','#ffcf3a','#eeede8'], fx(c, t, f, n, ft) {
      const y = GY - ft.h * .95;
      if (f <= 1) H.burst(c, CX, y, 12 - f * 2, ['#ffcf3a', '#ffffff']);
      if (f >= 1 && f <= 3) H.shards(c, CX, y, 9, f / 3, ['#ffcf3a', '#fff1a8', '#d99a1a'], 3.6, 41);
      if (f >= 2 && f <= 4) H.splash(c, CX, GY - ft.h * .5, 7, (f - 1) / 3, '#e97d4e', 9);
    } },
    net_launcher: { color: '#f0ffd0', smoke: '#e3e8cf', debris: ['#b9de3a','#c08a4a','#62738f'], fx(c, t, f, n, ft) {
      const y = top(ft, .75);
      if (f === 1) H.burst(c, CX, y, 7, ['#b9de3a', '#ffffff']);
      if (f >= 1 && f <= 4) H.nets(c, CX, y, 5 + t, f / 4, 51);
      if (f >= 2 && f <= 3) fx(c, o => { o.beginPath(); o.moveTo(CX - 20, GY - 2); for (let i = 0; i < 8; i++) o.quadraticCurveTo(CX - 18 + i * 5, GY - 8 - (i % 2) * 6, CX - 15 + i * 5, GY - 2); o.strokeStyle = '#c08a4a'; o.lineWidth = 1.4; o.stroke(); });
    } },
    solvent_sprayer: { color: '#eaffc0', smoke: '#d6f0b8', debris: ['#4a9a52','#a6ff4d','#62738f'], fx(c, t, f, n, ft) {
      const y = top(ft, .6);
      if (f === 1) H.burst(c, CX - 8, y, 9, ['#a6ff4d', '#f2ffe0']);
      if (f >= 1 && f <= 3) H.splash(c, CX - 8, y, 12 + t * 2, f / 3, '#a6ff4d', 61);
      if (f >= 3) H.puddle(c, CX - 4, GY + 6, 18 + t * 3, '#7ccf3a', 'bubbles', f);
      if (f === 2 || f === 3) H.cloud(c, CX - 8, y - 4, 14, (f - 1) / 2, '#d9ffb0');
    } },
    heat_decoy: { color: '#ffe0b0', smoke: '#d9c9cc', debris: ['#f2766b','#ff9f1c','#62738f'], fx(c, t, f, n, ft) {
      const y = top(ft, .85);
      if (f === 1) H.burst(c, CX, y, 11, ['#ff9f1c', '#ffe8b0']);
      if (f >= 1 && f <= 3) H.shards(c, CX, y, 8 + t * 2, f / 3, ['#f2766b', '#f79a8f', '#b8524a'], 4.4, 71);
      if (f >= 2 && f <= 4) H.sparks(c, CX, y, 10, f / 4, '#ffb04a', f * 3 + 70, 4);
      if (f === 4) H.cloud(c, CX, y - 6, 16, .7, '#e6dde8');
    } },
    piercing_cannon: { color: '#d8fdff', smoke: '#d6eef4', debris: ['#6f93bf','#63f3ff','#9a5a36'], fx(c, t, f, n, ft) {
      const y = top(ft, .75);
      if (f === 1) H.burst(c, CX, y, 10, ['#63f3ff', '#ffffff']);
      if (f >= 1 && f <= 3) H.arcs(c, CX - 14, y + 6, 14, 3, '#63f3ff', f * 9 + 81);
      if (f === 2 || f === 3) H.ring(c, CX, GY + 2, 18 + f * 10, '#25a9c4', 1 - (f - 2) * .3);
      if (f === 3) H.shards(c, CX, y, 7, .7, ['#6f93bf', '#3a4258'], 3.6, 83);
    } },
    sniper_nest: { color: '#fff4d6', smoke: '#d9cfbf', debris: ['#a8713c','#7d8f3a','#6f7d8c'], fx(c, t, f, n, ft) {
      const y = top(ft, .8);
      if (f === 1) { fx(c, o => { o.fillStyle = '#ffffff'; o.beginPath(); o.arc(CX + 10, y - 4, 2.6, 0, 7); o.fill(); }); H.sparks(c, CX + 10, y - 4, 6, .2, '#fff4c8', 91, 4); }
      if (f >= 1 && f <= 3) H.shards(c, CX, y, 10, f / 3, ['#a8713c', '#6b4224', '#9aab4f'], 4, 93);
      if (f === 3) H.cloud(c, CX, GY - 4, 20, .8, '#d9cfbf');
    } },
  };
  window.DESTROY_FX._helpers = H;
})();
