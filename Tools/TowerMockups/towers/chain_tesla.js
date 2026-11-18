/* PROTOTYPE - NOT FOR PRODUCTION
 * Chain Tesla (Tháp điện chuỗi) — v3, tier rule revised from the user's Kingdom Rush reference
 * (2026-11-18). Spec: design/assets/specs/chain-tesla-assets.md.
 * ONE core body for all tiers: a squat chamfered-square plinth with a raised step, a fat upright
 * copper coil in the centre on a collar, porcelain discs under a ROUND terminal; power block
 * front-right with a lever switch + amber lamp. Tier 0 is already a finished building.
 * Each tier: ~15% bigger, material ladder (stone → stone + riveted steel bands → steel armour),
 * a new crown element (t1: 3 discs + two back porcelain posts · t2: 4 discs, flat toroid and two
 * tall side posts with bus bars — the low "M"), more violet glow / props.
 * Squat and wide (width ≥ 1.6 × height, t2 top ≤ 66 px) so it never reads as the Sun Rod.
 * Energy: electric violet, only on idle crackle / charge / discharge.
 */
(function () {
  const P = G.P;
  const COIL = { hi: '#f0a874', mid: '#e08a4e', lo: '#a85a2a' };
  const PORC = { hi: '#ffffff', mid: '#f0ece4', lo: '#a9a296' };
  const VIO = { hi: '#efe0ff', mid: '#c58cff', lo: '#6a44a0' };
  const STONE = { hi: '#e2d8c3', mid: '#b9ac93', lo: '#7e7362' };
  const PLATE = { hi: '#9fb0c8', mid: '#62738f', lo: '#3a4660' };
  const BATT = { hi: '#a4ae6a', mid: '#727d45', lo: '#474f30' };

  /* ---------- energy (fx layer, no outline) ---------- */
  /** Jagged lightning bolt with a thin dark edge so it reads on white ground. */
  function bolt(c, x1, y1, x2, y2, seed, w, segs) {
    G.fx(c, o => {
      G.seed(seed); const n = segs || 6, pts = [[x1, y1]];
      for (let i = 1; i < n; i++) { const t = i / n, j = (G.rnd() - .5) * 7; pts.push([x1 + (x2 - x1) * t + j, y1 + (y2 - y1) * t + j * .6]); }
      pts.push([x2, y2]);
      const line = (col, lw) => { o.beginPath(); pts.forEach(([x, y], i) => i ? o.lineTo(x, y) : o.moveTo(x, y)); o.strokeStyle = col; o.lineWidth = lw; o.lineJoin = 'miter'; o.lineCap = 'round'; o.stroke(); };
      line('rgba(44,34,64,.6)', w + 2); line(VIO.mid, w); line(VIO.hi, Math.max(.8, w * .45));
    });
  }
  /** Crackle + halo around a terminal. k = 0..1 charge level, f = frame. */
  function energy(c, x, y, rad, k, f) {
    if (k <= 0) return;
    G.fx(c, o => G.halo(o, x, y, rad * (1.2 + k * 1.1), VIO.mid));
    const n = Math.round(1 + k * 3);
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + f * 1.3 + .4; bolt(c, x + Math.cos(a) * rad * .8, y + Math.sin(a) * rad * .55, x + Math.cos(a) * rad * (1.4 + k * .7), Math.max(4, y + Math.sin(a) * rad * (1.1 + k * .5) - 2), f * 31 + i * 7, 1.1, 3); }
  }
  function burst(c, x, y, k, f) {
    if (!k) return;
    G.fx(c, o => { G.halo(o, x, y, 12 * k + 4, VIO.mid); o.save(); o.translate(x, y); o.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, r = (i % 2 ? 4 : 10) * k; o.lineTo(Math.cos(a) * r, Math.sin(a) * r * .85); } o.closePath(); o.fillStyle = VIO.hi; o.fill(); o.strokeStyle = 'rgba(44,34,64,.6)'; o.lineWidth = 1.2; o.stroke(); o.restore(); });
    [[24, -12], [-22, -10], [6, -18]].forEach(([dx, dy], i) => bolt(c, x, y, Math.max(5, Math.min(123, x + dx * k)), Math.max(4, y + dy * k), f * 17 + i * 5, 1.6 * k + .6, 5));
  }

  /* ---------- structure ---------- */
  /** Prism over any convex footprint (world coords around cx, gy). Same shading as G.prism. */
  function slab(c, cx, gy, W, h, col, opt) {
    opt = opt || {}; const T = G.tones(col), mat = opt.mat || 'concrete';
    const P2 = W.map(([x, y]) => [cx + x, gy + y * G.K]), m = P2.length;
    for (let i = 0; i < m; i++) {
      const a = P2[i], b = P2[(i + 1) % m], mx = (a[0] + b[0]) / 2 - cx, my = ((a[1] + b[1]) / 2 - gy) / G.K;
      if (my <= .5) continue; const lit = (-mx * .75 + my * .4) / Math.hypot(mx, my);
      const path = () => { c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(b[0], b[1] - h); c.lineTo(a[0], a[1] - h); c.closePath(); };
      const base = lit > .3 ? T.mid : lit > -.2 ? G.mix(T.mid, T.lo, .45) : T.lo;
      path(); const g = c.createLinearGradient(0, Math.min(a[1], b[1]) - h, 0, Math.max(a[1], b[1])); g.addColorStop(0, G.mix(base, T.hi, .25)); g.addColorStop(1, G.mix(base, T.ao, .25)); c.fillStyle = g; c.fill();
      path(); G.texture(c, [Math.min(a[0], b[0]), Math.min(a[1], b[1]) - h, Math.abs(b[0] - a[0]) + 1, Math.abs(b[1] - a[1]) + h], T, mat, .8);
      if (opt.stripes) { path(); G.stripesInPath(c, Math.min(a[0], b[0]), Math.min(a[1], b[1]) - h, Math.max(a[0], b[0]), Math.max(a[1], b[1]), 6); }
      c.beginPath(); c.moveTo(a[0], a[1] - h + .6); c.lineTo(b[0], b[1] - h + .6); c.strokeStyle = T.rim; c.lineWidth = 1; c.stroke();
      path(); G.stroke(c);
    }
    const top = () => { c.beginPath(); P2.forEach(([x, y], i) => i ? c.lineTo(x, y - h) : c.moveTo(x, y - h)); c.closePath(); };
    top(); const g = c.createLinearGradient(cx, gy - h - 30 * G.K, cx, gy - h + 30 * G.K); g.addColorStop(0, G.mix(T.hi, '#ffffff', .12)); g.addColorStop(1, G.mix(T.hi, T.mid, .55)); c.fillStyle = g; c.fill();
    top(); G.texture(c, [cx - 40, gy - h - 30, 80, 60], T, mat, .7); top(); G.stroke(c);
  }
  /** Chamfered square footprint (half-size s, chamfer k). */
  const cham = (a, b, k) => [[-a + k, -b], [a - k, -b], [a, -b + k], [a, b - k], [a - k, b], [-a + k, b], [-a, b - k], [-a, -b + k]];
  /** stone-block courses on the front face of a chamfered block */
  function blocks(c, x0, x1, yb, h, rows) {
    const T = G.tones(STONE);
    for (let i = 1; i < rows; i++) G.wire(c, [[x0 + 1, yb - h * i / rows], [x1 - 1, yb - h * i / rows]], G.rgba(T.lo, .9), 1);
    for (let i = 0; i < rows; i++) for (let j = 1; j < 5; j++) { const x = x0 + (x1 - x0) * (j - (i % 2) * .5) / 4.5; if (x <= x0 + 2 || x >= x1 - 2) continue; G.wire(c, [[x, yb - h * i / rows], [x, yb - h * (i + 1) / rows]], G.rgba(T.lo, .8), 1); }
  }
  /** riveted steel band along the top of the front three faces */
  function band(c, cx, gy, a, b, k, yTop, w, col) {
    const T = G.tones(col || P.steel), fy = gy + b * G.K, cy = gy + (b - k) * G.K, dy = yTop - gy;
    const segs = [[[cx - a, cy], [cx - a + k, fy]], [[cx - a + k, fy], [cx + a - k, fy]], [[cx + a - k, fy], [cx + a, cy]]];
    segs.forEach(([p, q], i) => {
      c.beginPath(); c.moveTo(p[0], p[1] + dy); c.lineTo(q[0], q[1] + dy); c.lineTo(q[0], q[1] + dy + w); c.lineTo(p[0], p[1] + dy + w); c.closePath();
      c.fillStyle = i === 2 ? T.lo : T.mid; c.fill(); G.stroke(c, 1.2);
      G.wire(c, [[p[0] + .5, p[1] + dy + .8], [q[0] - .5, q[1] + dy + .8]], T.rim, 1);
      if (i === 1) G.rivets(c, p[0] + 3, p[1] + dy + w / 2 + .3, q[0] - 3, q[1] + dy + w / 2 + .3, Math.round((q[0] - p[0]) / 7));
    });
  }
  function coil(c, cx, gy, r, h, dense) {
    G.cyl(c, cx, gy, r, h, COIL, { mat: 'metal' });
    const step = dense ? 2.1 : 2.8;
    for (let y = gy - 2; y > gy - h + 1; y -= step) { c.beginPath(); c.ellipse(cx, y, r - .3, r * G.K * .55, 0, .15, Math.PI - .15); c.strokeStyle = G.rgba(COIL.lo, .85); c.lineWidth = .9; c.stroke(); }
    c.strokeStyle = G.rgba('#fff4e0', .7); c.lineWidth = 1.4; c.beginPath(); c.moveTo(cx - r * .55, gy - 2); c.lineTo(cx - r * .55, gy - h + 2); c.stroke();
  }
  const discs = (c, cx, gy, r, n) => { let y = gy; for (let i = 0; i < n; i++) { G.cyl(c, cx, y, r, 2.4, PORC, { mat: 'paint' }); y -= 3.4; } return y + 1; };
  /** porcelain post: steel foot, n discs, copper ball. Returns ball centre y. */
  function post(c, x, gy, n, r, foot) {
    G.cyl(c, x, gy, r + 1.4, foot, P.steel, { mat: 'metal' });
    let y = gy - foot; for (let i = 0; i < n; i++) { G.cyl(c, x, y, r, 2.2, PORC, { mat: 'paint' }); y -= 3.1; }
    G.sphere(c, x, y - 1.5, r * .7, COIL); return y - 1.5;
  }
  const lever = (c, x, y, on) => { G.box(c, x - 3, y + 2, 6, 3, 3, P.gunmetal, { mat: 'metal', side: false }); G.bar(c, x, y - 1, x + (on ? 4 : -4), y - 7, 1.4, P.steelLight); G.ell(c, x + (on ? 4 : -4), y - 7, 1.3, 1.3, '#e2412f', 1); };
  /** flat toroid terminal (t2) centred at (x,y) */
  function toroid(c, x, y, R, live) {
    const T = G.tones(P.steelLight), ry = R * G.K;
    const side = () => { c.beginPath(); c.ellipse(x, y, R, ry, 0, Math.PI, 0, true); c.lineTo(x + R, y - 3); c.ellipse(x, y - 3, R, ry, 0, 0, Math.PI, false); c.closePath(); };
    side(); const g = c.createLinearGradient(x - R, 0, x + R, 0); g.addColorStop(0, T.rim); g.addColorStop(.3, T.hi); g.addColorStop(.75, T.mid); g.addColorStop(1, T.lo); c.fillStyle = g; c.fill(); side(); G.stroke(c);
    G.ellPath(c, x, y - 3, R, ry); const g2 = c.createRadialGradient(x - R * .4, y - 3 - ry * .6, 1, x, y - 3, R); g2.addColorStop(0, '#ffffff'); g2.addColorStop(.4, T.hi); g2.addColorStop(1, T.mid); c.fillStyle = g2; c.fill(); G.stroke(c);
    c.beginPath(); c.ellipse(x, y - 3, R - 3, ry - 2.5, 0, Math.PI * 1.1, Math.PI * 1.6); c.strokeStyle = '#ffffff'; c.lineWidth = 1.4; c.stroke();
    G.ell(c, x, y - 3.5, R * .42, ry * .42, live ? VIO.mid : T.lo, G.INNER);
    G.ell(c, x, y - 3.5, R * .22, ry * .22, live ? VIO.hi : COIL.mid, 1);
  }

  const TW = {
    id: 'chain_tesla', folder: 'ChainTesla', head: false,
    foot: [{ r: 34, h: 38 }, { r: 40, h: 50 }, { r: 48, h: 62 }],
    debrisCols: ['#b9ac93', '#e08a4e', '#f0ece4', '#62738f', '#727d45'],
    sheets: [
      { file: 'tower_chain_tesla_t0_base_idle.png', tier: 0, layer: 'base', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_chain_tesla_t0_base_charge.png', tier: 0, layer: 'base', anim: 'charge', frames: 4, fps: 6 },
      { file: 'tower_chain_tesla_t0_base_discharge.png', tier: 0, layer: 'base', anim: 'discharge', frames: 3, fps: 10 },
      { file: 'tower_chain_tesla_t0_base_build.png', tier: 0, layer: 'base', anim: 'build', frames: 6, fps: 10 },
      { file: 'tower_chain_tesla_t0_base_destroy.png', tier: 0, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: 'tower_chain_tesla_t1_base_upgrade.png', tier: 1, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 },
      { file: 'tower_chain_tesla_t1_base_idle.png', tier: 1, layer: 'base', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_chain_tesla_t1_base_charge.png', tier: 1, layer: 'base', anim: 'charge', frames: 4, fps: 6 },
      { file: 'tower_chain_tesla_t1_base_discharge.png', tier: 1, layer: 'base', anim: 'discharge', frames: 3, fps: 10 },
      { file: 'tower_chain_tesla_t1_base_destroy.png', tier: 1, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: 'tower_chain_tesla_t2_base_upgrade.png', tier: 2, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 },
      { file: 'tower_chain_tesla_t2_base_idle.png', tier: 2, layer: 'base', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_chain_tesla_t2_base_charge.png', tier: 2, layer: 'base', anim: 'charge', frames: 6, fps: 9 },
      { file: 'tower_chain_tesla_t2_base_discharge.png', tier: 2, layer: 'base', anim: 'discharge', frames: 3, fps: 10 },
      { file: 'tower_chain_tesla_t2_base_destroy.png', tier: 2, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
    ],

    state(tier, anim, f, n) {
      if (anim === 'idle') return { lamp: f === 0, k: f === 0 ? .2 : 0, f, on: false };
      if (anim === 'charge') return { lamp: true, k: (f + 1) / n, f, on: true, gap: f };
      return { lamp: true, k: 0, burst: [1, .6, .25][f], f, on: true, gap: f + 3 }; // discharge: bolt at F0
    },

    base(c, tier, s) { body(c, tier, s || {}); },

    rubble(c, tier) {
      const coilBit = (x, y, r, l, w) => { c.save(); c.translate(x, y); c.rotate(r); c.fillStyle = COIL.lo; c.fillRect(-l / 2, -w / 2, l, w); c.fillStyle = COIL.mid; c.fillRect(-l / 2, -w / 2, l, w * .45); c.restore(); };
      const ball = (x, y, r) => { c.fillStyle = '#5d6a80'; c.beginPath(); c.ellipse(x, y, r, r * .85, 0, 0, 7); c.fill(); c.fillStyle = '#8a97ad'; c.beginPath(); c.ellipse(x - r * .3, y - r * .3, r * .5, r * .4, 0, 0, 7); c.fill(); };
      const cols = [[['#7e7362', '#b9ac93'], ['#a9a296', '#f0ece4']], [['#7e7362', '#b9ac93'], ['#3a4258', '#5d6a80'], ['#a9a296', '#f0ece4']], [['#3a4660', '#62738f'], ['#a85a2a', '#e08a4e'], ['#a9a296', '#f0ece4']]][tier];
      A.heap(c, [30, 36, 42][tier], cols);
      coilBit(62, 76, .35, [16, 20, 26][tier], [7, 9, 11][tier]);
      if (tier < 2) ball(78, 80, [5, 6.5][tier]);
      else { c.strokeStyle = '#8b97a9'; c.lineWidth = 4; c.beginPath(); c.ellipse(82, 81, 12, 4, .2, 0, 7); c.stroke(); }
    },
  };

  /* One body for all tiers: wide chamfered plinth (step + block) → collar → fat coil → discs → round
   * terminal, porcelain posts on the shoulders, power block front-right. */
  function body(c, t, s) {
    const cx = 64, gy = 82, f = s.f || 0, live = s.k > .3 || !!s.burst;
    const A_ = [23, 30, 31][t], B = [13, 15, 17][t], K = 5, H = [8, 9, 12][t], stepH = 3;
    const coilR = [10, 12, 15][t], coilH = [10, 9, 12][t];
    const mat = t === 2 ? PLATE : STONE, mtex = t === 2 ? 'metal' : 'concrete';
    G.ground(c, cx, gy, A_ + 13, { tufts: 2, pebbles: 7 });

    // t2: tall side porcelain posts outside the plinth (the low "M")
    const PX = A_ + 14;
    let pl, pr;
    if (t === 2) { pl = post(c, cx - PX, gy - 2, 6, 4.6, 5); pr = post(c, cx + PX, gy - 2, 6, 4.6, 5); }

    // raised step + main block
    slab(c, cx, gy, cham(A_ + 6, B + 5, K + 3), stepH, mat, { mat: mtex, stripes: t === 2 });
    const yb = gy - stepH;
    slab(c, cx, yb, cham(A_, B, K), H, mat, { mat: t === 2 ? 'paint' : 'concrete' });
    const fy = yb + B * G.K, x0 = cx - A_ + K, x1 = cx + A_ - K;
    if (t < 2) blocks(c, x0, x1, fy, H, t === 0 ? 2 : 3);
    else for (let i = 1; i < 4; i++) { const x = x0 + (x1 - x0) * i / 4; G.wire(c, [[x, fy - 1], [x, fy - H + 1]], G.rgba(PLATE.lo, .9), 1.2); G.rivets(c, x + 2, fy - 3, x + 2, fy - H + 4, 2); }
    if (t >= 1) band(c, cx, yb, A_, B, K, yb - H, 3.2, P.steel);
    if (t === 2) { c.beginPath(); c.rect(x0, fy - 3.5, x1 - x0, 3); G.stripesInPath(c, x0, fy - 3.5, x1, fy - .5, 5); c.beginPath(); c.rect(x0, fy - 3.5, x1 - x0, 3); G.stroke(c, 1); }
    const deck = yb - H;

    // shoulder posts on the deck: t0 one-disc studs · t1 three-disc posts with bus bars · t2 steel bus feet
    const SX = A_ - 7, sy = deck - 2;
    let bl, br;
    if (t === 0) { post(c, cx - SX, sy, 1, 3.2, 2); post(c, cx + SX, sy, 1, 3.2, 2); }
    if (t === 1) { bl = post(c, cx - SX, sy, 3, 3.6, 2); br = post(c, cx + SX, sy, 3, 3.6, 2); }
    if (t === 2) { G.cyl(c, cx - SX, sy, 4, 4, P.gunmetal, { mat: 'metal' }); G.cyl(c, cx + SX, sy, 4, 4, P.gunmetal, { mat: 'metal' }); }

    // collar (t0 stone · t1 riveted steel · t2 armour + flat copper primary coil)
    G.cyl(c, cx, deck, coilR + 3, 3, t === 0 ? STONE : t === 1 ? P.steel : PLATE, { mat: t === 0 ? 'concrete' : 'metal' });
    if (t === 1) G.rivets(c, cx - coilR, deck + 1, cx + coilR, deck + 1, 5);
    if (t === 2) G.cyl(c, cx, deck - 3, coilR + 5, 2.6, COIL, { mat: 'metal', ribs: 12 });
    const cb = deck - (t === 2 ? 5.6 : 3);
    coil(c, cx, cb, coilR, coilH, t > 0);
    if (t >= 1) { c.beginPath(); c.ellipse(cx, cb - coilH * .5, coilR + .4, (coilR + .4) * G.K, 0, .1, Math.PI - .1); c.lineWidth = 3.2; c.strokeStyle = G.OUT; c.stroke(); c.lineWidth = 1.6; c.strokeStyle = P.steelLight.hi; c.stroke(); }
    const top = discs(c, cx, cb - coilH, coilR * .72, [1, 3, 4][t]);

    // round terminal: steel ball → bigger polished ball → flat toroid
    let tx = cx, ty, tr;
    if (t === 0) { tr = 5.6; ty = top - 4.6; G.sphere(c, tx, ty, tr, P.steelLight); }
    else if (t === 1) { tr = 6.5; ty = top - 5.3; G.sphere(c, tx, ty, tr, { hi: '#eef3f8', mid: '#a9b5c6', lo: '#5d677b' }); G.ell(c, tx - 2.4, ty - 2.6, 1.8, 1.2, '#ffffff', 0); }
    else { tr = 16; ty = top - 1; toroid(c, tx, ty, tr, live); ty -= 3; }

    // bus bars
    if (t === 1) { G.bar(c, cx - SX, bl, cx - coilR * .6, top + 1, 1.6, P.copper); G.bar(c, cx + SX, br, cx + coilR * .6, top + 1, 1.6, P.copper); }
    if (t === 2) { G.bar(c, cx - PX, pl, cx - SX, sy - 4, 2, P.copper); G.bar(c, cx + PX, pr, cx + SX, sy - 4, 2, P.copper); G.bar(c, cx - SX, sy - 4, cx - coilR, cb - 3, 2, P.copper); G.bar(c, cx + SX, sy - 4, cx + coilR, cb - 3, 2, P.copper); }

    // energy
    if (s.k > 0) energy(c, tx, ty, t === 2 ? 11 : tr, s.k, f);
    burst(c, tx, ty, s.burst, f);
    if (t === 1 && (s.k > .3 || s.burst)) { bolt(c, cx - SX, bl - 2, cx - 6, ty, f * 13 + 3, .9, 3); bolt(c, cx + SX, br - 2, cx + 6, ty, f * 13 + 9, .9, 3); }
    if (t === 2 && (s.k > 0 || s.burst)) { bolt(c, cx - PX, pl - 3, cx - 12, ty - 1, f * 13 + 3, 1, 4); bolt(c, cx + PX, pr - 3, cx + 12, ty - 1, f * 13 + 9, 1, 4); }
    if (t === 2) [[cx - PX, pl], [cx + PX, pr]].forEach(([x, y]) => G.fx(c, o => G.halo(o, x, y, live ? 6 : 4, VIO.mid)));
    if (t === 1 && s.k > 0) [[cx - SX, bl], [cx + SX, br]].forEach(([x, y]) => G.fx(c, o => G.halo(o, x, y, 4, VIO.mid)));

    // power block front-right: battery box → riveted capacitor cabinet → glass capacitor rack
    const px = cx + A_ - 14, pg = gy + B * G.K + 6;
    if (t === 0) {
      G.hose(c, [[px + 5, pg - 9], [px + 1, deck - 2], [cx + coilR - 2, cb - 4]], 1.8, { hi: '#ff8a7a', mid: '#e2412f', lo: '#8a2420' });
      G.box(c, px, pg, 15, 9, 8, BATT, { mat: 'paint' });
      G.ell(c, px + 4, pg - 10.5, 1.5, 1, COIL.mid, 1); G.ell(c, px + 11, pg - 10.5, 1.5, 1, G.OUT, 1);
      lever(c, px - 4, pg + 1, s.on);
      G.bar(c, px + 18, pg - 2, px + 18, pg - 17, 1.6, P.woodDark); G.lamp(c, px + 18, pg - 19, P.amber, s.lamp !== false, 2.5);
    } else if (t === 1) {
      G.bar(c, px + 4, pg - 14, cx + coilR - 1, cb - 3, 2, P.copper); G.bar(c, px + 9, pg - 14, cx + coilR - 1, cb - 7, 2, P.copper);
      G.box(c, px, pg, 18, 10, 13, P.steel, { mat: 'metal' });
      G.rivets(c, px + 2, pg - 11, px + 16, pg - 11, 4);
      for (let i = 0; i < 3; i++) G.ell(c, px + 4.5 + i * 4.5, pg - 5.5, 1.5, 1.5, live ? VIO.mid : '#4a4560', 1);
      if (live) G.fx(c, o => G.halo(o, px + 9, pg - 6, 7, VIO.mid));
      lever(c, px - 4, pg + 2, s.on);
      G.bar(c, px + 21, pg - 4, px + 21, pg - 21, 1.6, P.steel); G.lamp(c, px + 21, pg - 23, P.amber, s.lamp !== false, 2.6);
    } else {
      G.bar(c, px + 6, pg - 16, cx + coilR - 1, cb - 3, 2.2, P.copper);
      G.box(c, px, pg, 22, 10, 4, PLATE, { mat: 'metal', stripes: true });
      [px + 4, px + 11, px + 18].forEach((x, i) => { const g = live ? VIO : { hi: '#e6dcf3', mid: '#9b92b3', lo: '#5d5677' }; G.cyl(c, x, pg - 5 - i * .6, 3, 10, g, { mat: 'glass' }); G.cyl(c, x, pg - 15 - i * .6, 3.4, 2, P.copper, { mat: 'metal' }); });
      G.bar(c, px - 1, pg - 4, px - 1, pg - 20, 1.6, P.steel); G.bar(c, px + 23, pg - 6, px + 23, pg - 22, 1.6, P.steel); G.bar(c, px - 1, pg - 20, px + 23, pg - 22, 1.6, P.steel);
      if (live) G.fx(c, o => G.halo(o, px + 11, pg - 10, 10, VIO.mid));
      lever(c, px - 5, pg + 2, s.on);
      G.lamp(c, px + 23, pg - 25, P.amber, s.lamp !== false, 2.6);
      // rotary spark gap front-left on a motor box
      const gx = cx - A_ + 6, gyy = gy + B * G.K + 4, a = (s.gap || 0) * .7;
      G.box(c, gx - 8, gyy + 2, 14, 9, 7, P.paintRust);
      G.ell(c, gx - 1, gyy - 10, 6, 6, P.steelLight.mid, G.INNER);
      for (let i = 0; i < 4; i++) { const q = a + i * Math.PI / 2; G.ell(c, gx - 1 + Math.cos(q) * 4.2, gyy - 10 + Math.sin(q) * 4.2, 1.3, 1.3, COIL.mid, 1); }
      if (s.on) G.fx(c, o => G.halo(o, gx + 5, gyy - 10, 4, VIO.mid));
    }
  }

  TOWERS.chain_tesla = TW;
})();
