/* PROTOTYPE - NOT FOR PRODUCTION
 * Sun Rod (Cột thu sáng) — v3, tier rule revised from the Kingdom Rush reference (2026-11-18).
 * Spec: design/assets/specs/sun-rod-assets.md. Base-only.
 * ONE core silhouette for all tiers: an octagonal plinth, a slender tapered obelisk pedestal, a thin
 * steel rod with a red-copper coil, and a long faceted sun-yellow crystal held in prongs at the very
 * top (never a coil/torus up there). Tier 0 is already a finished structure (no drum + sandbags).
 * Each tier: ~15% bigger/taller (56/66/76 px — art-bible exception: always the tallest thing, thin
 * 31/41/52% of the cell), material ladder (stone → stone + riveted steel bands → steel armour), a new
 * crown element (3 prongs → 5 prongs + porcelain stack → 5 hydraulic claws + toothed collar + porcelain
 * stacks), more glow / props. Family thread: copper ground cable to a stake FRONT-RIGHT.
 * Absorb → destroy is its normal life cycle, so `absorb` is its showcase animation.
 */
(function () {
  const P = G.P;
  const CU = { hi: '#f4a479', mid: '#e97d4e', lo: '#a9502c' };
  const SUN = { hi: '#fff1a8', mid: '#ffcf3a', lo: '#d99a1a' };
  const PORC = { hi: '#ffffff', mid: '#eeede8', lo: '#9a978e' };
  const STONE = { hi: '#e2d8c3', mid: '#b9ac93', lo: '#7e7362' };
  const PLATE = { hi: '#9fb0c8', mid: '#62738f', lo: '#3a4660' };
  const at = (arr, f) => arr[Math.min(f, arr.length - 1)];

  /* ---------- local material helpers (copied pattern from mortar / fortifier v3) ---------- */
  /** Tapered n-gon (frustum): bottom radius r0 at by, top radius r1 at by-h. Returns {B,U,vis}. */
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
  /** stone courses + staggered joints on the visible faces */
  function courses(c, F, rows) {
    const lo = G.rgba(STONE.lo, .9);
    for (let k = 1; k < rows; k++) F.vis.forEach(([i, j]) => G.wire(c, [ptAt(F, i, k / rows), ptAt(F, j, k / rows)], lo, 1));
    for (let r = 0; r < rows; r++) F.vis.forEach(([i, j], n) => { if ((n + r) % 2) return; const a = lerp(ptAt(F, i, r / rows), ptAt(F, j, r / rows), .5), b = lerp(ptAt(F, i, (r + 1) / rows), ptAt(F, j, (r + 1) / rows), .5); G.wire(c, [a, b], lo, 1); });
  }
  /** riveted steel band between heights t0..t1 on the visible faces */
  function band(c, F, t0, t1, col) {
    const T = G.tones(col || P.steel);
    F.vis.forEach(([i, j]) => {
      const a = ptAt(F, i, t0), b = ptAt(F, j, t0), d = ptAt(F, j, t1), e = ptAt(F, i, t1);
      G.poly(c, [a, b, d, e], T, { mat: 'metal', w: 1.1, tex: .4 });
      G.wire(c, [[e[0], e[1] + .8], [d[0], d[1] + .8]], T.rim, .9);
      const m = lerp(lerp(a, b, .5), lerp(e, d, .5), .5); G.rivets(c, m[0], m[1], m[0], m[1], 1);
    });
  }
  /** armour seams: rivet rows along the visible face edges */
  function seams(c, F, n) { F.vis.forEach(([i]) => { const a = ptAt(F, i, .12), b = ptAt(F, i, .88); G.rivets(c, a[0] + 1.2, a[1], b[0] + 1.2, b[1], n); }); }
  /** hazard stripes on the visible faces between t0..t1 */
  function hazard(c, F, t0, t1) {
    F.vis.forEach(([i, j]) => {
      const a = ptAt(F, i, t0), b = ptAt(F, j, t0), d = ptAt(F, j, t1), e = ptAt(F, i, t1);
      const p = () => { c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(d[0], d[1]); c.lineTo(e[0], e[1]); c.closePath(); };
      p(); G.stripesInPath(c, Math.min(a[0], e[0]) - 1, Math.min(d[1], e[1]) - 1, Math.max(b[0], d[0]) + 1, Math.max(a[1], b[1]) + 1, 5); p(); G.stroke(c, 1);
    });
  }

  /* ---------- family parts ---------- */
  function crystal(c, x, y, w, h, flare, crack) {
    const pts = [[0, -h / 2], [w * .5, -h * .22], [w * .5, h * .25], [0, h / 2], [-w * .5, h * .25], [-w * .5, -h * .22]].map(([a, b]) => [x + a, y + b]);
    if (flare >= .5) G.fx(c, o => { G.halo(o, x, y, (w + 6) * (.7 + flare * .45), SUN.mid); G.halo(o, x, y, w * (.6 + flare * .4), '#ffffff'); });
    else if (flare > 0) G.fx(c, o => { o.strokeStyle = '#fffbe0'; o.lineWidth = 1.2; [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([a, b]) => { o.beginPath(); o.moveTo(x - w * .15 + w * .35 * a, y - h * .3 + h * .2 * b); o.lineTo(x - w * .15 + w * .8 * a, y - h * .3 + h * .42 * b); o.stroke(); }); });
    const p = () => { c.beginPath(); pts.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.closePath(); };
    p(); c.fillStyle = flare > .6 ? '#fffbe0' : SUN.mid; c.fill();
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); c.lineTo(pts[5][0], pts[5][1]); c.lineTo(pts[4][0], pts[4][1]); c.lineTo(pts[3][0], pts[3][1]); c.lineTo(x, y); c.closePath(); c.fillStyle = flare > .6 ? '#ffffff' : SUN.hi; c.fill();
    c.beginPath(); c.moveTo(pts[1][0], pts[1][1]); c.lineTo(pts[2][0], pts[2][1]); c.lineTo(pts[3][0], pts[3][1]); c.lineTo(x, y); c.closePath(); c.fillStyle = flare > .6 ? SUN.mid : SUN.lo; c.fill();
    G.wire(c, [[x, y - h / 2 + 1], [x, y + h / 2 - 1]], G.rgba(SUN.lo, .7), .8);
    G.wire(c, [[x - w * .32, y - h * .18], [x - w * .1, y - h * .38]], '#ffffff', 1.1);
    p(); G.stroke(c, 1.3);
    if (crack) { c.beginPath(); c.moveTo(x - w * .4, y - h * .3); c.lineTo(x + w * .1, y - h * .05); c.lineTo(x - w * .15, y + h * .1); c.lineTo(x + w * .35, y + h * .35); c.strokeStyle = G.OUT; c.lineWidth = 1.2; c.stroke(); }
  }
  function coil(c, x, gy, r, h, heat) {
    const T = heat ? { hi: G.mix(CU.hi, '#ffd9a0', heat * .6), mid: G.mix(CU.mid, '#ff4a2a', heat * .6), lo: G.mix(CU.lo, '#9a1a10', heat * .5) } : CU;
    G.cyl(c, x, gy, r, h, T, { mat: 'metal' });
    for (let y = gy - 1.5; y > gy - h + 1; y -= 1.8) { c.beginPath(); c.ellipse(x, y, r - .2, r * G.K * .5, 0, .2, Math.PI - .2); c.strokeStyle = G.rgba(T.lo, .9); c.lineWidth = .8; c.stroke(); }
    if (heat > .5) G.fx(c, o => G.halo(o, x, gy - h / 2, r * 2.2, '#ff6a3a'));
  }
  function porcelain(c, x, y, r, n, gap) { for (let i = 0; i < n; i++) G.prism(c, x, y - i * gap, r, gap * .7, 8, PORC, { rot: Math.PI / 8, mat: 'paint' }); return y - n * gap; }
  /** ground cable through pts; `run` 0..1 = energy pulse travelling down it */
  function groundCable(c, pts, w, col, run) {
    G.hose(c, pts, w, col || CU);
    if (run > 0 && run < 1.05) {
      const n = pts.length - 1, t = Math.min(.999, run) * n, i = Math.floor(t), f = t - i;
      const x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
      G.fx(c, o => { G.halo(o, x, y, 6, SUN.mid); G.ell(o, x, y, 2.2, 2.2, '#fffbe0', 0); });
    }
  }
  function sparks(c, x, y, k, n) {
    G.fx(c, o => { o.strokeStyle = '#fffbe0'; o.lineWidth = 1.3; n = n || 8; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + .2; o.beginPath(); o.moveTo(x + Math.cos(a) * 5, y + Math.sin(a) * 5); o.lineTo(x + Math.cos(a) * (8 + 5 * k), Math.max(3, y + Math.sin(a) * (8 + 5 * k))); o.stroke(); } });
  }

  const TW = {
    id: 'sun_rod', folder: 'SunRod', head: false,
    foot: [{ r: 19, h: 56 }, { r: 23, h: 66 }, { r: 28, h: 76 }],
    debrisCols: ['#b9ac93', '#e97d4e', '#ffcf3a', '#62738f', '#eeede8'],
    sheets: [],
    state(tier, anim, f) {
      if (anim === 'idle') return { glint: f === 1 ? .25 : 0, lamp: f === 0 };
      // absorb: bolt hits the crystal → white flare, rod white-hot, coils heat orange→red, energy runs
      // down the ground cable to the stake, crystal cracks; F5 hands over to destroy F0
      return { glint: 0, flare: at([1.1, .9, .7, .55, .3, .2], f), heat: at([.1, .4, .7, 1, 1, 1], f), hot: at([.2, 1, .7, .5, .4, .3], f), red: f >= 4 ? 1 : 0, run: at([0, .2, .55, .9, 1.02, 2], f), crack: f >= 4 ? (f >= 5 ? 2 : 1) : 0, open: at([.4, 1, 1, 1, .8, .6], f), spark: f <= 1 ? 1 - f * .4 : 0, stakeSpark: f === 3 || f === 4, smoke: f >= 3 ? f - 3 : -1, lamp: f < 4 };
    },
    base(c, tier, s) { body(c, tier, s || {}); },
    rubble(c, tier) {
      const bent = (x, y, l, a1, a2, w, col, hi) => { c.save(); c.translate(x, y); c.rotate(a1); c.fillStyle = col; c.fillRect(0, -w / 2, l * .55, w); c.fillStyle = hi; c.fillRect(0, -w / 2, l * .55, w * .4); c.translate(l * .55, 0); c.rotate(a2); c.fillStyle = col; c.fillRect(0, -w / 2, l * .45, w); c.restore(); };
      const shards = k => [[56, 80], [71, 84], [64, 89], [50, 86]].slice(0, 3 + (k > 0)).forEach(([x, y], i) => { c.fillStyle = i % 2 ? '#d99a1a' : '#ffcf3a'; c.beginPath(); c.moveTo(x, y - 3.5); c.lineTo(x + 2, y); c.lineTo(x, y + 2); c.lineTo(x - 2, y); c.closePath(); c.fill(); });
      const cols = [[['#7e7362', '#b9ac93'], ['#7e7362', '#b9ac93']], [['#7e7362', '#b9ac93'], ['#3a4258', '#5d6a80']], [['#3a4660', '#62738f'], ['#7e7362', '#b9ac93'], ['#9a978e', '#eeede8']]][tier];
      A.heap(c, [20, 25, 30][tier], cols);
      bent(48, 78, [32, 40, 48][tier], -.12, .5, [2.6, 3, 3.6][tier], '#5d6a80', '#8b97a9');
      c.fillStyle = '#a9502c'; c.beginPath(); c.moveTo(70, 80); c.lineTo(80, 78); c.lineTo(84, 82); c.lineTo(76, 84); c.closePath(); c.fill(); // flat copper splash, straight edges
      c.fillStyle = '#e97d4e'; c.fillRect(73, 79.5, 6, 1.5);
      shards(tier);
    },
  };
  [0, 1, 2].forEach(t => {
    if (t === 0) TW.sheets.push({ file: 'tower_sun_rod_t0_base_idle.png', tier: 0, layer: 'base', anim: 'idle', frames: 2, fps: 2 }, { file: 'tower_sun_rod_t0_base_absorb.png', tier: 0, layer: 'base', anim: 'absorb', frames: 6, fps: 12 }, { file: 'tower_sun_rod_t0_base_build.png', tier: 0, layer: 'base', anim: 'build', frames: 6, fps: 10 });
    else TW.sheets.push({ file: `tower_sun_rod_t${t}_base_upgrade.png`, tier: t, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 }, { file: `tower_sun_rod_t${t}_base_idle.png`, tier: t, layer: 'base', anim: 'idle', frames: 2, fps: 2 }, { file: `tower_sun_rod_t${t}_base_absorb.png`, tier: t, layer: 'base', anim: 'absorb', frames: 6, fps: 12 });
    TW.sheets.push({ file: `tower_sun_rod_t${t}_base_destroy.png`, tier: t, layer: 'base', anim: 'destroy', frames: 6, fps: 10 });
  });

  /* One body for all tiers: octagonal plinth → tapered obelisk pedestal → cap collar → steel rod with
   * copper coil (+ porcelain) → crown collar → prongs/claws → crystal. Ground cable front-right. */
  function body(c, t, s) {
    const cx = 64, gy = 82, top = gy - [56, 66, 76][t];
    const R = [15, 19, 24][t], ph = [6, 7, 8][t], mat = t === 2 ? PLATE : STONE, mt = t === 2 ? 'metal' : 'concrete';
    const [cw, ch] = [[7, 13], [8.5, 15], [10, 17]][t], ccy = top + ch / 2 + 1, collarY = ccy + ch * .25 + 5;
    const hot = s.hot || 0, red = s.red || 0;
    const rodT = red ? { hi: '#ffb08a', mid: '#e0583a', lo: '#8a2a20' } : hot ? { hi: '#ffffff', mid: G.mix(P.steelLight.mid, '#ffeec0', hot), lo: G.mix(P.steelLight.lo, '#d9a070', hot) } : P.steelLight;
    G.ground(c, cx, gy, R + 9, { tufts: 2, pebbles: 6 });

    // t2: capacitor cans on the back corners of the deck (behind the pedestal)
    const pb = gy - ph;
    const can = (x, y, hx, hy) => { G.hose(c, [[x, y - 14], [(x + hx) / 2, hy - 3], [hx, hy]], 1.8, P.rubber); G.cyl(c, x, y, 4.4, 14, P.paintTeal, { mat: 'paint', ribs: 3 }); porcelain(c, x, y - 14, 2.8, 2, 2.4); G.lamp(c, x, y - 20.5, P.amber, s.lamp !== false, 1.7); };
    if (t === 2) can(cx + 15, gy - 10, cx + 6, gy - 30);

    // plinth
    let pl;
    if (t === 2) { pl = frustum(c, cx, gy, R, R - 2, 4, 8, PLATE, { mat: 'metal' }); hazard(c, pl, .05, .95); pl = frustum(c, cx, gy - 4, R - 4, R - 9, ph - 4, 8, PLATE, { mat: 'metal' }); seams(c, pl, 2); }
    else { pl = frustum(c, cx, gy, R, R - 4.5, ph, 8, mat, { mat: mt }); courses(c, pl, 2); }
    if (t === 1) band(c, pl, .0, .4, P.steel);

    // tapered obelisk pedestal
    const pr0 = [8, 9.5, 11][t], pr1 = [4.6, 5.3, 6][t], phh = [17, 21, 25][t];
    const pd = frustum(c, cx, pb, pr0, pr1, phh, 8, mat, { mat: t === 2 ? 'paint' : 'concrete' });
    if (t === 0) courses(c, pd, 4);
    if (t === 1) { courses(c, pd, 5); band(c, pd, .16, .3); band(c, pd, .66, .8); }
    if (t === 2) { seams(c, pd, 4); band(c, pd, .45, .55, PLATE); }
    if (t === 2) can(cx - 19, gy + 1, cx - 8, gy - 22);
    // amber aviation lamp on the pedestal front
    const lt = .55, lr = pr0 + (pr1 - pr0) * lt;
    G.lamp(c, cx, pb + lr * G.K - phh * lt, P.amber, s.lamp !== false, [2.2, 2.4, 2.6][t]);

    // cap collar (t2: toothed armour crown)
    const ct = pb - phh;
    G.cyl(c, cx, ct + 1.5, pr1 + 2, 3, t === 0 ? STONE : t === 1 ? P.steel : PLATE, { mat: t === 0 ? 'concrete' : 'metal' });
    const teeth = front => { if (t !== 2) return; for (let i = 0; i < 8; i++) { const a = (i + .5) / 8 * Math.PI * 2, sx = cx + Math.cos(a) * (pr1 + 1.2), sy = ct - 1.5 + Math.sin(a) * (pr1 + 1.2) * G.K; if ((Math.sin(a) > 0) !== front) continue; G.poly(c, [[sx - 1.4, sy + 1], [sx + 1.4, sy + 1], [sx + 1.4, sy - 2.5], [sx, sy - 4], [sx - 1.4, sy - 2.5]], PLATE, { mat: 'metal', w: 1.1, tex: 0 }); } };
    teeth(false);

    // rod with coil (+ porcelain)
    const sr = [2, 2.3, 2.6][t];
    G.cyl(c, cx, ct - 1, sr, ct - 1 - collarY, rodT, { mat: 'metal', top: null });
    if (t === 0) { coil(c, cx, ct - 3, 3.6, 6, s.heat); G.cyl(c, cx, ct - 12, sr + .9, 1.6, P.steel, { mat: 'metal' }); }
    if (t === 1) { coil(c, cx, ct - 2, 4.2, 5, s.heat); const y = porcelain(c, cx, ct - 8, 4.4, 3, 2.4); coil(c, cx, y - .5, 3.6, 4, s.heat); }
    if (t === 2) {
      let y = porcelain(c, cx, ct - 2, 5, 3, 2.8);
      coil(c, cx, y, 5.4, 8, s.heat);
      porcelain(c, cx, y - 9, 4, 2, 2.2);
    }
    teeth(true);

    // crown collar
    G.cyl(c, cx, collarY + 2, [3.4, 4, 4.6][t], 3, t === 0 ? P.steel : t === 1 ? P.steelLight : PLATE, { mat: 'metal' });
    const op = s.open || 0;
    const prong = (k, outer) => {
      const w = t === 2 ? 2.2 : t === 1 ? 1.9 : 1.7, col = s.flare >= .9 ? { hi: '#ffffff', mid: '#fff1c8', lo: '#c9a868' } : (t === 2 ? { hi: '#c9d6e8', mid: '#8fa3c0', lo: '#566a8a' } : P.steelLight);
      const bx = cx + k * (outer ? 3.2 : 2), by = collarY - .5, o = op * 1.6;
      const mx = cx + k * (outer ? cw * .5 + 6.5 + o : cw * .5 + 2.6 + o * .6), my = outer ? ccy + ch * .32 : ccy + ch * .18;
      const tx = mx + k * (outer ? 1.6 + o : .6 + o * .5), ty = outer ? ccy - ch * .02 : ccy - ch * .3;
      G.bar(c, bx, by, mx, my, w, col); G.bar(c, mx, my, tx, ty, w * .8, col);
      if (t === 2) G.ell(c, mx, my, 1.5, 1.5, PLATE.mid, 1);
    };
    G.bar(c, cx, collarY - .5, cx, ccy + ch * .2, t === 2 ? 2.2 : 1.6, P.steelLight);
    if (t >= 1) { prong(-1, true); prong(1, true); }
    crystal(c, cx, ccy, cw, ch, s.flare || s.glint, s.crack);
    prong(-1, false); prong(1, false);

    // ground cable front-right to the stake (motif)
    const c0 = [cx + pr0 * .55, pb + pr0 * G.K * .7], c1 = [cx + R * .78, gy - ph * .3 + R * G.K * .5], c2 = [cx + R + 8, gy + 7];
    if (t === 0) { groundCable(c, [c0, c1, c2], 1.8, CU, s.run); G.ell(c, c2[0], c2[1] + 1, 3.6, 2, P.dirt.lo, 0); G.bar(c, c2[0], c2[1] + 1, c2[0], c2[1] - 6, 2.2, P.rust); G.ell(c, c2[0], c2[1] - 3, 2.2, 1.2, CU.mid, 1); }
    if (t === 1) { groundCable(c, [c0, c1, c2], 3, P.steel, 0); groundCable(c, [c0, c1, c2], .1, CU, s.run); G.boxC(c, c2[0] + 1, c2[1] + 2, 11, 7, 2.5, P.steel, { mat: 'metal' }); G.rivets(c, c2[0] - 3, c2[1] - 1, c2[0] + 4, c2[1] - 1, 3); }
    if (t === 2) { groundCable(c, [c0, c1, c2], 3.6, P.gunmetal, 0); groundCable(c, [c0, c1, c2], .1, CU, s.run); G.box(c, c2[0] - 5, c2[1] + 5, 12, 8, 8, PLATE, { mat: 'metal' }); G.gauge(c, c2[0] + 1, c2[1] - 2, 2.6, s.run > .8 ? .95 : .2); }
    if (s.stakeSpark) sparks(c, c2[0], c2[1] - 4, .4, 6);
    if (s.smoke >= 0) G.puff(c, cx + 5 + s.smoke * 2, ct - 10 - s.smoke * 5, 2.5 + s.smoke * 1.2, .75 - s.smoke * .2, '#d9d4dc');
    if (s.spark) sparks(c, cx, ccy, s.spark);
  }

  TOWERS.sun_rod = TW;
})();
