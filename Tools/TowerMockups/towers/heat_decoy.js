/* PROTOTYPE - NOT FOR PRODUCTION
 * Heat Decoy (Mồi nhiệt) — v3, tier rule from the Kingdom Rush reference (2026-11-18).
 * Spec: design/assets/specs/heat-decoy-assets.md. Base-only.
 * ONE core silhouette for all tiers: an octagonal plinth, a tapered octagonal firebox drum, coral
 * radiator fins fanning OUTWARD and UP (≥30° from vertical) like an open flower / chalice, and a
 * glowing faceted heart core at the centre top. Tier 0 is already a finished structure (no sandbags /
 * cut-down drum — deviation from the spec's t0, per the approved tier rule). Each tier: ~15% bigger,
 * material ladder (stone → stone + riveted steel bands → steel armour), a new crown element
 * (5 fins + wire cage → 8 fins + armoured glass lamp → 8 big fins + 2 fin banks on arms + core raised on
 * bellows + reflector collar), more glow / props. Exhaust back-left; gauge + amber lamp front-right.
 * Core glow = hard-edged halos only; fins never redden; cooldown = core dims + pale steam from vents.
 */
(function () {
  const P = G.P;
  const CORAL = { hi: '#f79a8f', mid: '#f2766b', lo: '#b8524a' };
  const AMB = { hi: '#ffd27a', mid: '#ff9f1c', lo: '#c26a0a' };
  const WINE = '#6e3442', WINE_D = '#4a2230', STEAM = '#d4dde8';
  const STONE = { hi: '#e2d8c3', mid: '#b9ac93', lo: '#7e7362' };
  const PLATE = { hi: '#9fb0c8', mid: '#62738f', lo: '#3a4660' };
  const at = (arr, f) => arr[Math.min(f, arr.length - 1)];

  /* ---------- local material helpers (same pattern as sun_rod / mortar v3) ---------- */
  function frustum(c, cx, by, r0, r1, h, n, col, opt) {
    opt = opt || {}; const T = G.tones(col), rot = opt.rot == null ? Math.PI / n : opt.rot, mat = opt.mat || 'concrete';
    const B = [], U = [], vis = [];
    for (let i = 0; i < n; i++) { const a = rot + i / n * Math.PI * 2; B.push([cx + Math.cos(a) * r0, by + Math.sin(a) * r0 * G.K]); U.push([cx + Math.cos(a) * r1, by - h + Math.sin(a) * r1 * G.K]); }
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, mid = rot + (i + .5) / n * Math.PI * 2; if (Math.sin(mid) <= .05) continue; vis.push([i, j]);
      const lit = -Math.cos(mid) * .75 + Math.sin(mid) * .4, base = lit > .3 ? T.mid : lit > -.2 ? G.mix(T.mid, T.lo, .45) : T.lo;
      const q = () => { c.beginPath(); c.moveTo(B[i][0], B[i][1]); c.lineTo(B[j][0], B[j][1]); c.lineTo(U[j][0], U[j][1]); c.lineTo(U[i][0], U[i][1]); c.closePath(); };
      q(); const g = c.createLinearGradient(0, by - h, 0, by + r0 * G.K); g.addColorStop(0, G.mix(base, T.hi, .25)); g.addColorStop(1, G.mix(base, T.ao, .25)); c.fillStyle = g; c.fill();
      const xs = [B[i][0], B[j][0], U[i][0], U[j][0]], ys = [B[i][1], B[j][1], U[i][1], U[j][1]];
      q(); G.texture(c, [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs) + 1, Math.max(...ys) - Math.min(...ys)], T, mat, .8);
      c.beginPath(); c.moveTo(U[i][0], U[i][1] + .7); c.lineTo(U[j][0], U[j][1] + .7); c.strokeStyle = T.rim; c.lineWidth = 1; c.stroke();
      q(); G.stroke(c);
    }
    if (opt.top !== null) {
      const tp = () => { c.beginPath(); U.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); };
      tp(); c.fillStyle = opt.top || G.mix(T.hi, '#ffffff', .1); c.fill(); tp(); G.texture(c, [cx - r1, by - h - r1 * G.K, r1 * 2, r1 * 2 * G.K], T, mat, .6); tp(); G.stroke(c);
    }
    return { B, U, vis };
  }
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const ptAt = (F, i, t) => lerp(F.B[i], F.U[i], t);
  function courses(c, F, rows) {
    const lo = G.rgba(STONE.lo, .9);
    for (let k = 1; k < rows; k++) F.vis.forEach(([i, j]) => G.wire(c, [ptAt(F, i, k / rows), ptAt(F, j, k / rows)], lo, 1));
    for (let r = 0; r < rows; r++) F.vis.forEach(([i, j], n) => { if ((n + r) % 2) return; const a = lerp(ptAt(F, i, r / rows), ptAt(F, j, r / rows), .5), b = lerp(ptAt(F, i, (r + 1) / rows), ptAt(F, j, (r + 1) / rows), .5); G.wire(c, [a, b], lo, 1); });
  }
  function band(c, F, t0, t1, col) {
    const T = G.tones(col || P.steel);
    F.vis.forEach(([i, j]) => {
      const a = ptAt(F, i, t0), b = ptAt(F, j, t0), d = ptAt(F, j, t1), e = ptAt(F, i, t1);
      G.poly(c, [a, b, d, e], T, { mat: 'metal', w: 1.1, tex: .4 });
      G.wire(c, [[e[0], e[1] + .8], [d[0], d[1] + .8]], T.rim, .9);
      const m = lerp(lerp(a, b, .5), lerp(e, d, .5), .5); G.rivets(c, m[0], m[1], m[0], m[1], 1);
    });
  }
  function seams(c, F, n) { F.vis.forEach(([i]) => { const a = ptAt(F, i, .15), b = ptAt(F, i, .85); G.rivets(c, a[0] + 1.2, a[1], b[0] + 1.2, b[1], n); }); }
  function hazard(c, F, t0, t1) {
    F.vis.forEach(([i, j]) => {
      const a = ptAt(F, i, t0), b = ptAt(F, j, t0), d = ptAt(F, j, t1), e = ptAt(F, i, t1);
      const p = () => { c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(d[0], d[1]); c.lineTo(e[0], e[1]); c.closePath(); };
      p(); G.stripesInPath(c, Math.min(a[0], e[0]) - 1, Math.min(d[1], e[1]) - 1, Math.max(b[0], d[0]) + 1, Math.max(a[1], b[1]) + 1, 5); p(); G.stroke(c, 1);
    });
  }

  /* ---------- family parts ---------- */
  /** Fin plate in screen space from (bx,by) along screen angle ang, length L, width w0→w1, chamfered tip. */
  function finS(c, bx, by, ang, L, w0, w1, inner, t, glow, push) {
    L += push || 0;
    c.save(); c.translate(bx, by); c.rotate(ang);
    const pts = [[0, -w0 / 2], [L * .78, -w1 / 2], [L, -w1 * .18], [L, w1 * .18], [L * .78, w1 / 2], [0, w0 / 2]];
    G.poly(c, pts, inner ? { hi: '#ffc2b8', mid: CORAL.hi, lo: CORAL.mid } : CORAL, { mat: 'paint', w: 1.2, tex: .7 });
    G.wire(c, [[1.5, 0], [L - 1, 0]], G.rgba(CORAL.lo, .9), 1);             // fold crease
    if (t >= 1) for (let k = 1; k <= 2; k++) { const x = L * (.3 + k * .2); G.wire(c, [[x, -w1 * .38], [x, w1 * .38]], G.rgba(CORAL.lo, .75), .9); } // radiator grooves
    G.rivets(c, 2, 0, 2, 0, 1);
    if (glow) G.wire(c, [[L * .78, -w1 / 2 + .8], [L - .3, -w1 * .18 + .4], [L - .3, w1 * .18 - .4]], AMB.hi, 1.4); // amber rim on the lit edge
    c.restore();
  }
  /** Fin on the rim ring at world angle a, tilted theta from vertical. */
  function ringFin(c, cx, cy, r, a, theta, L, w0, w1, t, glow, push) {
    const bx = cx + Math.cos(a) * r, by = cy + Math.sin(a) * r * G.K;
    const dx = Math.cos(a) * Math.sin(theta), dy = Math.sin(a) * Math.sin(theta) * G.K - Math.cos(theta);
    const ws = Math.hypot(Math.sin(a), Math.cos(a) * G.K);
    finS(c, bx, by, Math.atan2(dy, dx), L * Math.hypot(dx, dy), w0 * ws, w1 * ws, Math.sin(a) < 0, t, glow, push);
  }
  /** Faceted heart (45° segments, straight lines). lvl: 2 bright, 1 amber, .5 dark amber, 0 wine + filament, -1 wine dark */
  function heart(c, x, y, s, lvl) {
    const pts = [[0, .5], [-.5, 0], [-.5, -.25], [-.25, -.5], [0, -.25], [.25, -.5], [.5, -.25], [.5, 0]].map(([a, b]) => [x + a * s, y + b * s]);
    const T = lvl >= 2 ? { hi: '#fffbe8', mid: AMB.hi, lo: AMB.mid } : lvl >= 1 ? AMB : lvl >= .5 ? { hi: AMB.mid, mid: AMB.lo, lo: '#8a4a12' } : lvl >= 0 ? { hi: '#8e4a58', mid: WINE, lo: WINE_D } : { hi: WINE, mid: WINE_D, lo: '#2e1620' };
    G.poly(c, pts, T, { mat: 'none', w: 1.2 });
    if (lvl === 0) G.wire(c, [[x - s * .3, y - s * .1], [x - s * .1, y + s * .1], [x + s * .1, y - s * .1], [x + s * .3, y + s * .1]], AMB.mid, 1.1);
    if (lvl >= 1) G.wire(c, [[x - s * .32, y - s * .26], [x - s * .14, y - s * .38]], '#ffffff', 1.1);
  }
  function rings(c, x, y, r, k) {
    if (!(k > 0)) return;
    G.fx(c, o => {
      if (k >= 1.5) { G.ellPath(o, x, y, r * 1.55, r * 1.45); o.fillStyle = G.rgba(AMB.mid, .14); o.fill(); }
      G.ellPath(o, x, y, r * Math.min(1, .6 + k * .4), r * .92 * Math.min(1, .6 + k * .4)); o.fillStyle = G.rgba(AMB.mid, .2); o.fill();
      G.ellPath(o, x, y, r * .62, r * .58); o.fillStyle = G.rgba(AMB.hi, .28); o.fill();
    });
  }
  function steam(c, x, y, f, big) {
    if (f == null || f < 0) return; const k = big || 1;
    for (let i = 0; i < 2; i++) { const t = f + i * .6, py = Math.max(6, y - t * 4 * k), r = Math.min((2 + t * 1.1) * k, py - 3); if (r > 1) G.puff(c, x + (i ? 1.5 : -1) + t * .4, py, r, Math.max(.3, .85 - f * .12), STEAM); }
  }
  function gaugePost(c, x, gy, t, s) {
    G.bar(c, x, gy, x, gy - 9, 1.8, P.steel);
    if (t >= 1) G.box(c, x - 4, gy + 2, 8, 6, 5, t === 2 ? PLATE : P.steel, { mat: 'metal' });
    G.gauge(c, x, gy - 11, 3.1, s.needle == null ? .08 : s.needle);
    G.lamp(c, x + 5, gy - 6, P.amber, s.lamp !== false, 1.9);
  }

  const TW = {
    id: 'heat_decoy', folder: 'HeatDecoy', head: false,
    foot: [{ r: 30, h: 40 }, { r: 35, h: 50 }, { r: 42, h: 62 }],
    debrisCols: ['#b9ac93', '#f2766b', '#62738f', '#ff9f1c', '#b8524a'],
    sheets: [],
    state(tier, anim, f, n) {
      if (anim === 'idle') return { core: 0, ring: 0, lamp: f === 0, needle: .08, slot: 0 };
      if (anim === 'active') {
        // heartbeat: rest, strong beat, light beat, settle (t2: 6 frames, same 0.667 s cycle)
        const C = n === 6 ? { core: [1, 2, 2, 1, 1, 1], ring: [1, 2, 1.6, 1, .8, .7], push: [0, 1, 1, 0, 0, 0], bel: [0, 2, 1, 0, -1, -1] } : { core: [1, 2, 1, 1], ring: [1, 2, 1, .7], push: [0, 1, 0, 0], bel: [0, 2, 0, -1] };
        return { core: at(C.core, f), ring: at(C.ring, f), push: at(C.push, f), bel: at(C.bel, f), glow: 1, lamp: true, needle: .9 + (f % 2 ? .03 : -.02), slot: 1 };
      }
      // cooldown: core dims amber → dark amber → wine, lamp off, needle sweeps back, pale steam from vents
      const m = n === 6 ? [1, .5, .5, 0, 0, -1] : [1, .5, 0, -1];
      return { core: at(m, f), ring: 0, push: f === 1 ? -1 : 0, lamp: false, needle: n === 6 ? at([.9, .82, .74, .66, .58, .5], f) : at([.9, .78, .62, .5], f), steam: f, slot: f < 2 ? .5 : 0 };
    },
    base(c, tier, s) { body(c, tier, s || {}); },
    rubble(c, tier) {
      const fin = (x, y, r, l) => { c.save(); c.translate(x, y); c.rotate(r); c.fillStyle = CORAL.lo; c.beginPath(); c.moveTo(0, -2); c.lineTo(l * .8, -3.5); c.lineTo(l, 0); c.lineTo(l * .8, 3.5); c.lineTo(0, 2); c.closePath(); c.fill(); c.fillStyle = CORAL.mid; c.fillRect(1, -2.5, l * .7, 2); c.restore(); };
      const cols = [[['#7e7362', '#b9ac93'], ['#7e7362', '#b9ac93']], [['#7e7362', '#b9ac93'], ['#3a4258', '#5d6a80']], [['#3a4660', '#62738f'], ['#7e7362', '#b9ac93']]][tier];
      A.heap(c, [26, 31, 37][tier], cols);
      fin(46, 80, -.4, 12); fin(72, 78, .3, 13); fin(58, 87, .1, 11); if (tier >= 1) fin(80, 86, -.2, 12); if (tier === 2) fin(40, 88, .5, 14);
      c.fillStyle = WINE_D; c.beginPath(); c.moveTo(64, 85); c.lineTo(60, 81); c.lineTo(62, 79); c.lineTo(64, 81); c.lineTo(66, 79); c.lineTo(68, 81); c.closePath(); c.fill();
    },
  };
  [0, 1, 2].forEach(t => {
    if (t === 0) TW.sheets.push({ file: 'tower_heat_decoy_t0_base_idle.png', tier: 0, layer: 'base', anim: 'idle', frames: 2, fps: 2 });
    else TW.sheets.push({ file: `tower_heat_decoy_t${t}_base_upgrade.png`, tier: t, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 }, { file: `tower_heat_decoy_t${t}_base_idle.png`, tier: t, layer: 'base', anim: 'idle', frames: 2, fps: 2 });
    TW.sheets.push({ file: `tower_heat_decoy_t${t}_base_active.png`, tier: t, layer: 'base', anim: 'active', frames: t === 2 ? 6 : 4, fps: t === 2 ? 9 : 6 },
      { file: `tower_heat_decoy_t${t}_base_cooldown.png`, tier: t, layer: 'base', anim: 'cooldown', frames: t === 2 ? 6 : 4, fps: 4 });
    if (t === 0) TW.sheets.push({ file: 'tower_heat_decoy_t0_base_build.png', tier: 0, layer: 'base', anim: 'build', frames: 6, fps: 10 });
    TW.sheets.push({ file: `tower_heat_decoy_t${t}_base_destroy.png`, tier: t, layer: 'base', anim: 'destroy', frames: 6, fps: 10 });
  });

  /* One body for all tiers: plinth → firebox drum (glow slots) → rim → back fins → core housing →
   * front fins. Exhaust back-left, gauge + amber lamp front-right. */
  function body(c, t, s) {
    const cx = 64, gy = 82, mat = t === 2 ? PLATE : STONE;
    const R = [22, 26, 31][t], ph = [5, 6, 7][t];
    const r0 = [12, 14, 16.5][t], r1 = [9.5, 11, 13][t], dh = [9, 11, 13][t];
    G.ground(c, cx, gy, R + 8, { tufts: 2, pebbles: 7 });

    // plinth
    let pl;
    if (t === 2) { pl = frustum(c, cx, gy, R, R - 2, 3, 8, PLATE, { mat: 'metal' }); hazard(c, pl, .05, .95); pl = frustum(c, cx, gy - 3, R - 4, R - 7, ph - 3, 8, PLATE, { mat: 'metal' }); seams(c, pl, 2); }
    else { pl = frustum(c, cx, gy, R, R - 4, ph, 8, mat, { mat: 'concrete' }); courses(c, pl, 2); if (t === 1) band(c, pl, 0, .4, P.steel); }
    const pb = gy - ph;
    // t2 outrigger feet on the 4 diagonals (front two drawn later)
    const foot = front => { if (t !== 2) return; [Math.PI * .25, Math.PI * .75, Math.PI * 1.25, Math.PI * 1.75].forEach(a => { if ((Math.sin(a) > 0) !== front) return; const x = cx + Math.cos(a) * (R + 2), y = gy + Math.sin(a) * (R + 2) * G.K; G.boxC(c, x, y + 1, 7, 6, 4, P.steel, { mat: 'metal' }); G.bar(c, x, y - 3, cx + Math.cos(a) * (R - 6), pb + Math.sin(a) * (R - 6) * G.K - 1, 2.4, P.steelLight); }); };
    foot(false);

    // exhaust stack(s) back-left
    const stacks = t === 2 ? [[-13, -7], [-7, -10]] : [[-11, -7]];
    const stackTop = [];
    stacks.forEach(([dx, dy], i) => { const h = [16, 22, 30][t] - i * 4, x = cx + dx, y = pb + dy; G.cyl(c, x, y, [2.2, 2.6, 3][t], h, t === 0 ? P.rust : t === 1 ? P.steel : P.gunmetal, { mat: 'metal' }); G.cyl(c, x, y - h + 1, [2.8, 3.2, 3.6][t], 2, P.steel, { mat: 'metal' }); stackTop.push([x, y - h - 2]); });

    // firebox drum with glow slots
    const dr = frustum(c, cx, pb, r0, r1, dh, 8, mat, { mat: t === 2 ? 'paint' : 'concrete' });
    if (t === 0) courses(c, dr, 3);
    if (t === 1) { courses(c, dr, 3); band(c, dr, .62, .82); }
    if (t === 2) seams(c, dr, 3);
    const nslot = t + 1, sw = 2.4;
    for (let i = 0; i < nslot; i++) { const x = cx + (i - (nslot - 1) / 2) * 4.4, y = pb + r0 * G.K * .9 - dh * .55; c.beginPath(); c.rect(x - sw / 2, y - 3, sw, 5); c.fillStyle = s.slot >= 1 ? AMB.hi : s.slot > 0 ? AMB.lo : '#3a2238'; c.fill(); G.stroke(c, 1); }
    const rimY = pb - dh;
    G.cyl(c, cx, rimY + 2, r1 + 1.5, 2.5, t === 0 ? P.steel : t === 1 ? P.steelLight : PLATE, { mat: 'metal' });

    // fins: angles, sizes per tier (fan outward ≥30° from vertical)
    const nf = [5, 8, 8][t], theta = [52, 56, 56][t] * Math.PI / 180, L = [14, 16.5, 18.5][t], w0 = [5, 5, 6][t], w1 = [9, 9.5, 11][t];
    const angs = []; for (let i = 0; i < nf; i++) angs.push(nf === 5 ? -Math.PI / 2 + i * Math.PI * 2 / 5 : -Math.PI / 2 + (i + .5) * Math.PI / 4);
    const fr = r1 + .5, fy = rimY;
    const glow = s.glow ? 1 : 0, push = s.push || 0;
    angs.filter(a => Math.sin(a) <= .01).forEach(a => ringFin(c, cx, fy, fr, a, theta, L, w0, w1, t, glow, push));

    // t2: fin banks on hydraulic arms (spread wide like open arms)
    if (t === 2) [-1, 1].forEach(k => {
      const ax = cx + k * 30, ay = gy - 30;
      G.bar(c, cx + k * (r0 - 2), pb - dh * .4, ax, ay, 3.2, P.steelLight);
      G.cyl(c, cx + k * (r0 + 4), pb - dh * .55, 1.8, 5, P.brass, { mat: 'metal', top: null });
      [1.25, .85, .5].forEach((sp, i) => finS(c, ax, ay, -Math.PI / 2 + k * sp, 12 + i * 1.2, 4, 8, i === 2, 2, glow, push));
      G.ell(c, ax, ay, 2.4, 2.4, PLATE.mid, 1.2);
    });

    // core housing
    let coreY;
    if (t === 0) {
      coreY = rimY - 8;
      G.cyl(c, cx, rimY, 5.5, 2, P.steel, { mat: 'metal' });
      rings(c, cx, coreY, 12, s.ring);
      heart(c, cx, coreY, 10, s.core);
      [-4.5, -1.5, 1.5, 4.5].forEach(d => G.wire(c, [[cx + d, rimY - 1.5], [cx + d * 1.05, coreY - 4], [cx + d * .3, coreY - 8]], '#3a4258', 1.2));
      G.ell(c, cx, coreY - 8.5, 1.8, 1.4, P.steelLight.mid, 1);
    } else if (t === 1) {
      coreY = rimY - 9;
      G.cyl(c, cx, rimY, 7, 3, P.steel, { mat: 'metal' });
      rings(c, cx, coreY, 15, s.ring);
      G.cyl(c, cx, rimY - 2.5, 6.6, 12, { hi: '#e9fbff', mid: s.core >= 1 ? '#ffe2a8' : '#9fc4d6', lo: '#5f7f99' }, { mat: 'glass', top: null });
      heart(c, cx, coreY, 10.5, s.core);
      [-5, 5].forEach(d => G.bar(c, cx + d, rimY - 3, cx + d, rimY - 14, 1.4, P.steel));
      G.cyl(c, cx, rimY - 14, 7, 2.6, P.steel, { mat: 'metal' });
      G.cyl(c, cx, rimY - 16.5, 2.2, 3, P.steelLight, { mat: 'metal' });
      stackTop.push([cx, rimY - 21]);
    } else {
      // bellows (accordion, beats with the heart) + reflector collar + armoured glass cylinder
      const bh = 7 + (s.bel || 0);
      for (let i = 0; i < 4; i++) G.prism(c, cx, rimY - i * bh / 4, i % 2 ? 6 : 7.5, bh / 4 + .3, 8, i % 2 ? P.rubber : P.steel, { rot: Math.PI / 8, mat: 'metal' });
      const by = rimY - bh;
      frustum(c, cx, by, 7, 11, 4, 8, P.steelLight, { mat: 'metal', top: '#dfe6ee' });
      coreY = by - 12;
      rings(c, cx, coreY, 17, s.ring);
      G.cyl(c, cx, by - 3, 6.2, 15, { hi: '#e9fbff', mid: s.core >= 1 ? '#ffe2a8' : '#9fc4d6', lo: '#5f7f99' }, { mat: 'glass', top: null });
      heart(c, cx, coreY, 11.5, s.core);
      [-5.6, 5.6].forEach(d => { G.bar(c, cx + d, by - 3, cx + d, by - 18, 2.4, PLATE); G.rivets(c, cx + d, by - 6, cx + d, by - 15, 3); });
      G.cyl(c, cx, by - 18, 8, 3, PLATE, { mat: 'metal' });
      G.cyl(c, cx, by - 21, 2.4, 3, P.steelLight, { mat: 'metal' });
      stackTop.push([cx, by - 26]);
    }
    // front fins
    angs.filter(a => Math.sin(a) > .01).forEach(a => ringFin(c, cx, fy, fr, a, theta, L, w0, w1, t, glow, push));
    if (t === 0) stackTop.push([cx, coreY - 11]);
    foot(true);

    // gauge + amber lamp front-right (motif)
    gaugePost(c, cx + R - 2, gy + 6, t, s);
    if (t >= 1) G.box(c, cx - R - 2, gy + 7, 10, 7, 6, t === 2 ? P.paintRust : P.wood, { mat: t === 2 ? 'paint' : 'wood' });
    if (t === 2) G.hose(c, [[cx - R + 6, gy], [cx - r0 - 2, gy - 6], [cx - r0 + 1, pb - 2]], 2, P.rubber);

    // cooldown steam from fixed vents
    if (s.steam != null) stackTop.forEach(([x, y], i) => steam(c, x, y, s.steam - i * .3, t === 2 ? 1.15 : 1));
  }

  TOWERS.heat_decoy = TW;
})();
