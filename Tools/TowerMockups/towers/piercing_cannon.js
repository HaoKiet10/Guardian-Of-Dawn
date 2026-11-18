/* PROTOTYPE - NOT FOR PRODUCTION
 * Piercing Cannon (Pháo xuyên giáp) — v3, tier rule revised from the user's Kingdom Rush reference
 * (2026-11-18, art bible §3 "Sửa đổi 2026-11-18"). Reference towers: mortar.js / fortifier.js (v3).
 * ONE core silhouette for all tiers: a square battered gun keep (sloped walls, chamfered plinth) with
 * a yoke pedestal on top carrying the rotating Head; capacitor block with a cyan lamp back-left.
 * Tier 0 is already a finished stone keep (no sandbags / scrap). Each tier: ~15% bigger and taller,
 * material ladder (stone blocks → stone + riveted steel band → steel-blue armour plating), a new crown
 * element (t1 corner merlons + front 45° blast wedge · t2 four corner emitter pylons + hydraulic
 * outrigger feet), more cyan glow / props.
 * Family thread (spec): ONE long barrel with 3 coil rings, heavy breech, steel-blue armour; cyan only
 * on coils, capacitor lamps and the bolt. Spec: design/assets/specs/piercing-cannon-assets.md
 */
(function () {
  const P = G.P;
  const BLUE = { hi: '#a9c4e8', mid: '#6f93bf', lo: '#3f5f8c' };
  const CYAN = { hi: '#e6feff', mid: '#63f3ff', lo: '#25a9c4' };
  const COIL_OFF = { hi: '#d9a07a', mid: '#9a5a36', lo: '#5e3424' };
  const STONE = { hi: '#e2d8c3', mid: '#b9ac93', lo: '#7e7362' };
  const PLATE = { hi: '#9fb0c8', mid: '#62738f', lo: '#3a4660' };
  const at = (arr, f) => arr[Math.min(f, arr.length - 1)];
  const coilCol = k => k <= 0 ? COIL_OFF : { hi: G.mix(COIL_OFF.hi, CYAN.hi, k), mid: G.mix(COIL_OFF.mid, CYAN.mid, k), lo: G.mix(COIL_OFF.lo, CYAN.lo, k) };

  // one body, three sizes: ground y, keep half-size bottom a, wall height H, pedestal radius / height
  const DIM = [
    { gy: 82, a: 22, H: 11, pr: 8, ph: 3 },
    { gy: 83, a: 25, H: 18, pr: 9.5, ph: 4 },
    { gy: 84, a: 29, H: 23, pr: 11, ph: 5 },
  ];
  const TAPER = .82, DEPTH = .62;   // battered walls; keep is shallower than wide (no flat 'table' deck)
  const pedTop = t => { const d = DIM[t]; return d.gy - 3 - d.H - d.ph; };

  const TW = {
    id: 'piercing_cannon', folder: 'PiercingCannon', head: true,
    headPos: [0, 1, 2].map(t => [64, pedTop(t) - 4]),
    foot: [{ r: 33, h: 38 }, { r: 38, h: 52 }, { r: 44, h: 66 }],
    debrisCols: ['#b9ac93', '#6f93bf', '#454c63', '#63f3ff', '#cc823f'],
    sheets: [
      { file: 'tower_piercing_cannon_t0_base_idle.png', tier: 0, layer: 'base', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_piercing_cannon_t0_base_build.png', tier: 0, layer: 'base', anim: 'build', frames: 6, fps: 10 },
      { file: 'tower_piercing_cannon_t0_base_destroy.png', tier: 0, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: 'tower_piercing_cannon_t0_head_idle.png', tier: 0, layer: 'head', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_piercing_cannon_t0_head_charge.png', tier: 0, layer: 'head', anim: 'charge', frames: 4, fps: 6 },
      { file: 'tower_piercing_cannon_t0_head_fire.png', tier: 0, layer: 'head', anim: 'fire', frames: 4, fps: 12 },
      { file: 'tower_piercing_cannon_t1_base_upgrade.png', tier: 1, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 },
      { file: 'tower_piercing_cannon_t1_base_idle.png', tier: 1, layer: 'base', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_piercing_cannon_t1_base_destroy.png', tier: 1, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: 'tower_piercing_cannon_t1_head_idle.png', tier: 1, layer: 'head', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_piercing_cannon_t1_head_charge.png', tier: 1, layer: 'head', anim: 'charge', frames: 4, fps: 6 },
      { file: 'tower_piercing_cannon_t1_head_fire.png', tier: 1, layer: 'head', anim: 'fire', frames: 4, fps: 12 },
      { file: 'tower_piercing_cannon_t2_base_upgrade.png', tier: 2, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 },
      { file: 'tower_piercing_cannon_t2_base_idle.png', tier: 2, layer: 'base', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_piercing_cannon_t2_base_destroy.png', tier: 2, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: 'tower_piercing_cannon_t2_head_idle.png', tier: 2, layer: 'head', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_piercing_cannon_t2_head_charge.png', tier: 2, layer: 'head', anim: 'charge', frames: 4, fps: 6 },
      { file: 'tower_piercing_cannon_t2_head_fire.png', tier: 2, layer: 'head', anim: 'fire', frames: 6, fps: 18 },
    ],

    // coils: glow level of the 3 coil rings (breech → muzzle); cap: capacitor lamp on the base
    state(tier, anim, f, n) {
      if (anim === 'idle') return { coils: [.15, .15, .15], cap: f === 0 ? 1 : .55 };
      if (anim === 'charge') { const k = [[.4, 0, 0], [1, .45, 0], [1, 1, .5], [1, 1, 1]][f]; return { coils: k, cap: 1, spark: f >= 2 ? f - 1 : 0 }; }
      // fire: frame 0 = flash + spawn bolt (spec), then recoil and coils drain
      if (n === 6) return { coils: at([[1, 1, 1], [.6, .6, .7], [.3, .3, .4], [.15, .15, .2], [.1, .1, .15], [.15, .15, .15]], f), cap: .6, fl: at([1.3, .7, .2, 0], f), rec: at([0, 6, 4, 2, 1, 0], f), cyl: at([0, 5, 3, 1.5, .5, 0], f) };
      return { coils: at([[1, 1, 1], [.5, .5, .6], [.2, .2, .3], [.15, .15, .15]], f), cap: .6, fl: at([1, .5, .1, 0], f), rec: at([0, 4, 2, 0], f) };
    },

    base(c, tier, s) { body(c, tier, s || {}); },
    head(c, tier, s, dir) {
      const k = [1.26, 1.3, 1.3][tier];
      c.save(); c.translate(64, 68); c.scale(k, k); c.translate(-64, -68);
      [h0, h1, h2][tier](c, s || {}, G.dir(dir)); c.restore();
    },

    rubble(c, tier) {
      const barrel = (x, y, r, l) => { c.save(); c.translate(x, y); c.rotate(r); c.fillStyle = '#3a4258'; c.fillRect(-l / 2, -2.5, l, 5); c.fillStyle = '#8a97ad'; c.fillRect(-l / 2, -2.5, l, 2); [.2, .45, .7].forEach(t => { c.fillStyle = '#9a5a36'; c.fillRect(-l / 2 + l * t, -3.5, 3, 7); }); c.restore(); };
      const cols = [[['#7e7362', '#b9ac93'], ['#3f5f8c', '#6f93bf']], [['#7e7362', '#b9ac93'], ['#3a4258', '#5d6a80'], ['#3f5f8c', '#6f93bf']], [['#3a4660', '#62738f'], ['#3f5f8c', '#6f93bf'], ['#7e7362', '#b9ac93']]][tier];
      A.heap(c, [30, 35, 41][tier], cols); barrel(66, 76, .15, [32, 38, 44][tier]);
      if (tier === 2) { c.save(); c.translate(42, 80); c.rotate(-.7); c.fillStyle = '#5d677b'; c.fillRect(-10, -2, 20, 4); c.restore(); }
    },
  };

  /* capacitor jar: glass cylinder with cyan core (motif, always back-left on the Base) */
  function capJar(c, x, gy, r, h, k) {
    G.cyl(c, x, gy, r + 1.2, 2.5, P.gunmetal, { mat: 'metal' });
    const g = { hi: G.mix('#9fd4e6', CYAN.hi, k * .6), mid: G.mix('#5f8fa6', CYAN.mid, k * .7), lo: G.mix('#34586e', CYAN.lo, k * .7) };
    G.cyl(c, x, gy - 2.5, r, h, g, { mat: 'glass' });
    G.cyl(c, x, gy - 2.5 - h, r + 1.2, 2.5, P.copper, { mat: 'metal' });
    if (k > .5) G.fx(c, o => G.halo(o, x, gy - 2.5 - h / 2, r * 2.4, CYAN.mid));
  }

  /* ---------- keep: square tower with battered (sloped) walls ---------- */
  function keepPts(cx, gy, a, b, h) {
    const K = G.K * DEPTH;
    return {
      BLB: [cx - a, gy - a * K], BLF: [cx - a, gy + a * K], BRF: [cx + a, gy + a * K], BRB: [cx + a, gy - a * K],
      TLB: [cx - b, gy - b * K - h], TLF: [cx - b, gy + b * K - h], TRF: [cx + b, gy + b * K - h], TRB: [cx + b, gy - b * K - h],
    };
  }
  function keep(c, cx, gy, a, b, h, col, mat) {
    const T = G.tones(col), q = keepPts(cx, gy, a, b, h);
    if (a - b > .5) G.poly(c, [q.BLB, q.BLF, q.TLF, q.TLB], col, { mat, fill: G.mix(T.mid, T.lo, .35) });
    if (a - b > .5) G.poly(c, [q.BRF, q.BRB, q.TRB, q.TRF], col, { mat, fill: T.lo });
    G.poly(c, [q.BLF, q.BRF, q.TRF, q.TLF], col, { mat });
    G.wire(c, [[q.TLF[0] + 1, q.TLF[1] + .7], [q.TRF[0] - 1, q.TRF[1] + .7]], T.rim, 1);
    G.poly(c, [q.TLB, q.TLF, q.TRF, q.TRB], col, { mat, fill: G.mix(T.hi, '#ffffff', .08) });
    return q;
  }
  /** stone courses on the front + left faces */
  function courses(c, q, rows) {
    const T = G.tones(STONE), L = (p, r, t) => [p[0] + (r[0] - p[0]) * t, p[1] + (r[1] - p[1]) * t];
    for (let k = 1; k < rows; k++) {
      const t = k / rows;
      G.wire(c, [L(q.BLF, q.TLF, t), L(q.BRF, q.TRF, t)], G.rgba(T.lo, .9), 1);
      G.wire(c, [L(q.BLB, q.TLB, t), L(q.BLF, q.TLF, t)], G.rgba(T.lo, .7), 1);
    }
    for (let k = 0; k < rows; k++) (k % 2 ? [.33, .67] : [.17, .5, .83]).forEach(u => {
      const a0 = L(L(q.BLF, q.BRF, u), L(q.TLF, q.TRF, u), k / rows), a1 = L(L(q.BLF, q.BRF, u), L(q.TLF, q.TRF, u), (k + 1) / rows);
      G.wire(c, [[a0[0], a0[1] - .5], [a1[0], a1[1] + .5]], G.rgba(T.lo, .8), 1);
    });
  }
  /** riveted steel band across the front + left faces at fraction t of the wall */
  function band(c, q, t, w, col) {
    const T = G.tones(col), L = (p, r, u) => [p[0] + (r[0] - p[0]) * u, p[1] + (r[1] - p[1]) * u];
    const fl = L(q.BLF, q.TLF, t), fr = L(q.BRF, q.TRF, t), bl = L(q.BLB, q.TLB, t), rb = L(q.BRB, q.TRB, t);
    G.poly(c, [bl, fl, [fl[0], fl[1] - w], [bl[0], bl[1] - w]], col, { mat: 'metal', w: 1.2, fill: T.hi });
    G.poly(c, [fr, rb, [rb[0], rb[1] - w], [fr[0], fr[1] - w]], col, { mat: 'metal', w: 1.2, fill: T.lo });
    G.poly(c, [[fl[0] - .5, fl[1] + .4], [fr[0] + .5, fr[1] + .4], [fr[0] + .5, fr[1] - w], [fl[0] - .5, fl[1] - w]], col, { mat: 'metal', w: 1.2 });
    G.wire(c, [[fl[0] + 1, fl[1] - w + .9], [fr[0] - 1, fr[1] - w + .9]], T.rim, 1);
    G.rivets(c, fl[0] + 3, fl[1] - w / 2, fr[0] - 3, fr[1] - w / 2, 5);
  }
  /** armour plate seams on the front face */
  function seams(c, q) {
    [.33, .67].forEach(u => { const b = [q.BLF[0] + (q.BRF[0] - q.BLF[0]) * u, q.BLF[1]], tp = [q.TLF[0] + (q.TRF[0] - q.TLF[0]) * u, q.TLF[1]]; G.wire(c, [[b[0], b[1] - 1], [tp[0], tp[1] + 1]], G.rgba(PLATE.lo, .95), 1.3); G.rivets(c, b[0] + 2, b[1] - 3, tp[0] + 2, tp[1] + 3, 3); });
  }

  /* ================= BASE: one keep, three tiers ================= */
  function body(c, t, s) {
    const cx = 64, { gy, a, H, pr, ph } = DIM[t], b = a * TAPER, k = s.cap == null ? 1 : s.cap;
    const wall = t === 2 ? PLATE : STONE, tm = t === 2 ? 'metal' : 'concrete';
    G.ground(c, cx, gy, a + 14, { tufts: 2, pebbles: 7 });

    // capacitor block back-left (family motif): 1 jar → caged pair → bank of 3 with copper bus bar
    const capX = cx - a - 4, capY = gy - a * G.K * DEPTH + 4;
    if (t === 0) { G.box(c, capX - 7, capY + 2, 12, 8, 7, P.steel, { mat: 'metal' }); capJar(c, capX - 1, capY - 5, 3.4, 11, k); }
    if (t === 1) {
      G.box(c, capX - 10, capY + 3, 19, 10, 4, P.steel, { mat: 'metal' });
      capJar(c, capX - 5, capY - 1, 3.6, 15, k); capJar(c, capX + 3, capY - 3, 3.6, 15, k);
      [capX - 10, capX - 1, capX + 8].forEach(x => G.bar(c, x, capY, x, capY - 22, 1.4, P.steel)); G.bar(c, capX - 10, capY - 22, capX + 8, capY - 24, 1.6, P.steel);
    }
    if (t === 2) {
      G.box(c, capX - 12, capY + 4, 23, 11, 5, P.gunmetal, { mat: 'metal' });
      [-7, 0, 7].forEach((dx, i) => capJar(c, capX + dx - 1, capY - 1 - i, 3.4, 22, k));
      G.bar(c, capX - 11, capY - 26, capX + 9, capY - 29, 2.2, P.copper);
    }
    // t2 hydraulic outrigger feet at the four corners (back pair first)
    const leg = (sx, sy) => { const fx = cx + sx * (a + 9), fy = gy + sy * (a + 7) * G.K * DEPTH; G.ell(c, fx, fy + 1, 5.5, 3, P.steel.mid); G.bar(c, fx, fy, cx + sx * (a - 1), gy + sy * (a - 1) * G.K * DEPTH - 12, 3.6, P.steelLight); G.bar(c, fx, fy - 1, cx + sx * (a + 1), gy + sy * a * G.K * DEPTH - 5, 2.2, BLUE); };
    if (t === 2) { leg(-1, -1); leg(1, -1); }
    // plinth (straight walls, a bit wider)
    keep(c, cx, gy, a + 4, a + 4, 3, wall, tm);
    if (t === 2) { const q = keepPts(cx, gy, a + 4, a + 4, 3); c.beginPath(); c.rect(q.BLF[0], q.BLF[1] - 3, q.BRF[0] - q.BLF[0], 3); G.stripesInPath(c, q.BLF[0], q.BLF[1] - 3, q.BRF[0], q.BLF[1], 5); c.beginPath(); c.rect(q.BLF[0], q.BLF[1] - 3, q.BRF[0] - q.BLF[0], 3); G.stroke(c, 1); }
    // the keep
    const wy = gy - 3, q = keep(c, cx, wy, a, b, H, wall, t === 2 ? 'paint' : 'concrete');
    if (t < 2) courses(c, q, t === 0 ? 2 : 3); else seams(c, q);
    if (t >= 1) band(c, q, .35, 3.4, P.steel);
    // door / energy port on the front face: wood → steel → glowing cyan slot
    const dw = [8, 9, 10][t], dh = [7, 8, 9][t], dfy = q.BLF[1] - .5;
    c.beginPath(); c.moveTo(cx - dw / 2, dfy); c.lineTo(cx - dw / 2, dfy - dh + 3); c.quadraticCurveTo(cx, dfy - dh - 2, cx + dw / 2, dfy - dh + 3); c.lineTo(cx + dw / 2, dfy); c.closePath();
    c.fillStyle = t === 0 ? G.tones(P.wood).mid : t === 1 ? '#5d677b' : '#2b2f42'; c.fill(); G.stroke(c, 1.2);
    if (t === 0) G.wire(c, [[cx, dfy - 1], [cx, dfy - dh + 1]], G.tones(P.wood).lo, 1);
    if (t === 1) for (let y = dfy - dh + 3; y < dfy; y += 2.2) G.wire(c, [[cx - dw / 2 + 1, y], [cx + dw / 2 - 1, y]], 'rgba(40,30,60,.5)', 1);
    if (t === 2) { c.fillStyle = k > .7 ? CYAN.mid : CYAN.lo; c.fillRect(cx - 1.5, dfy - dh + 2, 3, dh - 3); if (k > .7) G.fx(c, o => G.halo(o, cx, dfy - dh / 2, 6, CYAN.mid)); }
    // crown on the roof corners: t1 stone merlons · t2 steel emitter pylons with cyan lamps
    const top = wy - H, corners = [[q.TLB, -1], [q.TRB, 1], [q.TLF, -1], [q.TRF, 1]];
    const merlon = ([x, y]) => G.boxC(c, x, y + 1, 7, 6, 5, STONE, { mat: 'concrete' });
    const pylon = ([x, y]) => { G.boxC(c, x, y + 1, 7, 6, 9, PLATE, { mat: 'metal' }); G.poly(c, [[x - 3.5, y - 7], [x + 3.5, y - 7], [x + 1.5, y - 12], [x - 1.5, y - 12]], P.steelLight, { mat: 'metal', w: 1.1 }); G.lamp(c, x, y - 13.5, CYAN.mid, k > .7, 1.9); };
    const inset = ([p]) => [p[0] + (cx - p[0]) * .12, p[1] + (top - p[1]) * .12];
    if (t === 1) corners.slice(0, 2).forEach(cn => merlon(inset(cn)));
    if (t === 2) corners.slice(0, 2).forEach(cn => pylon(inset(cn)));
    // yoke pedestal
    G.cyl(c, cx, top + 1, pr + 2.5, 1.6, P.gunmetal, { mat: 'metal', ribs: t === 2 ? 12 : 0 });
    G.cyl(c, cx, top - .6, pr, ph - .6, t === 0 ? P.steel : BLUE, { mat: t === 0 ? 'metal' : 'paint' });
    if (t >= 1) G.rivets(c, cx - pr + 2.5, top + 1.2, cx + pr - 2.5, top + 1.2, 4);
    // armoured conduit from the capacitor to the pedestal
    G.hose(c, [[capX + 4, capY - (t === 0 ? 14 : t === 1 ? 20 : 26)], [capX + 12, top - 4], [cx - pr, top - ph + 2]], t === 2 ? 3 : 2.2, t === 2 ? P.gunmetal : P.rubber);
    if (t === 1) corners.slice(2).forEach(cn => merlon(inset(cn)));
    if (t === 2) corners.slice(2).forEach(cn => pylon(inset(cn)));
    // t1 front 45° blast wedge · t2 front outrigger feet
    if (t === 1) {
      const y0 = gy + (a + 4) * G.K * DEPTH + 3, x0 = cx + 6, x1 = cx + a + 6;
      G.poly(c, [[x0, y0 + 6], [x1, y0 + 2], [x1 - 2, y0 - 5], [x0 + 2, y0 - 1]], P.concreteDark, { mat: 'concrete' });
      c.save(); c.beginPath(); c.moveTo(x0 + 2, y0 - 1); c.lineTo(x1 - 2, y0 - 5); c.lineTo(x1 - 1.4, y0 - 3); c.lineTo(x0 + 2.6, y0 + 1); c.closePath(); c.fillStyle = P.hazard; c.fill(); c.restore();
    }
    if (t === 2) { leg(-1, 1); leg(1, 1); }
    // foot props: shell rack front-left + lamp, more per tier
    const px = cx - a - 10, py = gy + a * G.K * DEPTH + 6;
    G.box(c, px, py, 13, 8, [6, 7, 8][t], t === 0 ? P.wood : t === 1 ? P.steel : PLATE, { mat: t === 0 ? 'wood' : 'metal' });
    for (let i = 0; i < 2 + (t > 0 ? 1 : 0); i++) { G.tube(c, px + 2 + i * 4, py - [6, 7, 8][t] - 1, -Math.PI / 2, 6, 1.6, P.brass, { open: false }); G.ell(c, px + 2 + i * 4, py - [6, 7, 8][t] - 7, .8, 1.4, CYAN.mid, 0); }
    if (t >= 1) { G.bar(c, cx + a + 8, gy + 2, cx + a + 8, gy - 14, 1.6, P.steel); G.lamp(c, cx + a + 8, gy - 16, CYAN.mid, k > .7, 2.3); }
  }

  /* ================= HEADS ================= */
  const pt = (d, u, w, z) => [64 + d.dx * u + d.dy * w, 68 + (d.dy * u - d.dx * w) * G.K - z];

  /* barrel with 3 coil rings; returns muzzle */
  function barrel(c, d, u0, z, L, r, coils, opt) {
    const [x, y] = pt(d, u0, 0, z), Ls = L * d.fs + r;
    const pos = [.16, .36, .56].map(t => t * Ls);
    const m = G.tube(c, x, y, d.ang, Ls, r, P.steelLight, { muzzleRing: !opt.brake, brake: opt.brake });
    // coil rings (fatter than the barrel), cyan when charged
    pos.forEach((p, i) => {
      const k = coils[i] || 0, T = coilCol(k), rr = r * (opt.big ? 1.8 : 1.5), bw = opt.big ? 4.5 : 3;
      c.save(); c.translate(x, y); c.rotate(d.ang);
      c.beginPath(); c.rect(p, -rr, bw, rr * 2); const g = c.createLinearGradient(0, -rr, 0, rr); g.addColorStop(0, T.hi); g.addColorStop(.5, T.mid); g.addColorStop(1, T.lo); c.fillStyle = g; c.fill(); G.stroke(c, 1.2);
      if (opt.big) { for (let q = 1; q < bw; q += 1.6) { c.strokeStyle = G.rgba(k > .3 ? CYAN.lo : '#5e3424', .8); c.lineWidth = .7; c.beginPath(); c.moveTo(p + q, -rr + 1); c.lineTo(p + q, rr - 1); c.stroke(); } }
      c.restore();
      if (k > .55) { const cxp = x + Math.cos(d.ang) * (p + bw / 2), cyp = y + Math.sin(d.ang) * (p + bw / 2); G.fx(c, o => G.halo(o, cxp, cyp, rr * 2.2 * k, CYAN.mid)); }
    });
    return m;
  }
  function flash(c, m, d, k, big) {
    if (!k) return;
    G.fx(c, c => {
      c.save(); c.translate(m[0], m[1]); c.rotate(d.ang);
      c.beginPath(); [[0, -5], [9 * k, -3], [20 * k * (big || 1), 0], [9 * k, 3], [0, 5], [4, 0]].forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.closePath();
      c.fillStyle = CYAN.mid; c.fill(); G.stroke(c, 1.1);
      G.ell(c, 5 * k, 0, 6 * k, 3 * k, CYAN.hi, 0); c.restore();
    });
  }
  function sparks(c, m, d, n) {
    if (!n) return; G.fx(c, o => { o.strokeStyle = CYAN.hi; o.lineWidth = 1.2; for (let i = 0; i < n * 2; i++) { const a = d.ang + (i - n) * .6; o.beginPath(); o.moveTo(m[0] + Math.cos(a) * 3, m[1] + Math.sin(a) * 3); o.lineTo(m[0] + Math.cos(a) * 7, m[1] + Math.sin(a) * 7); o.stroke(); } });
  }
  /* t0: long steel barrel with 3 copper coils, steel-blue breech block + gunmetal counterweight,
   * cyan charge lamp on the breech */
  function h0(c, s, d) {
    const rec = s.rec || 0; let m;
    const gun = () => { m = barrel(c, d, 4 - rec, 7, 31, 2, s.coils || [], {}); };
    const breech = () => {
      const [cx, cy] = pt(d, -11 - rec, 0, 2); G.obox(c, cx, cy, 7, 9, 8, d.th, P.gunmetal, { mat: 'metal' });
      G.rivets(c, cx - 2.5, cy - 5, cx + 2.5, cy - 5, 2);
      const [bx, by] = pt(d, -3 - rec, 0, 2); G.obox(c, bx, by, 11, 10, 8, d.th, BLUE, { mat: 'paint' });
      const [px, py] = pt(d, -3 - rec, 0, 10); G.lamp(c, px, py - 1, CYAN.mid, (s.coils || [0])[0] > .3, 1.5); // breech charge lamp
    };
    if (d.dy < 0) { gun(); breech(); } else { breech(); gun(); }
    flash(c, m, d, s.fl); sparks(c, m, d, s.spark);
  }

  /* t1: wedge-shaped steel-blue armoured breech with cheek plates, long barrel with 3 machined
   * coil rings and a square muzzle brake */
  function h1(c, s, d) {
    const rec = s.rec || 0; let m;
    const gun = () => { m = barrel(c, d, 6 - rec, 8, 34, 2.3, s.coils || [], { brake: true }); };
    const breech = () => {
      const [cx, cy] = pt(d, -4 - rec, 0, 0); G.obox(c, cx, cy, 16, 12, 9, d.th, BLUE, { mat: 'paint' });
      // wedge front plate sloping toward the barrel
      const a = pt(d, 4 - rec, 6, 9), b = pt(d, 4 - rec, -6, 9), a2 = pt(d, -2 - rec, 5, 14), b2 = pt(d, -2 - rec, -5, 14);
      G.poly(c, [a, b, b2, a2], BLUE, { mat: 'paint' });
      const [rx, ry] = pt(d, -9 - rec, 0, 10); G.rivets(c, rx - 3, ry, rx + 3, ry, 3);
      const [lx, ly] = pt(d, -6 - rec, 0, 15); G.lamp(c, lx, ly, CYAN.mid, (s.coils || [0])[0] > .3, 1.6);
    };
    if (d.dy < 0) { gun(); breech(); } else { breech(); gun(); }
    flash(c, m, d, s.fl, 1.2); sparks(c, m, d, s.spark);
  }

  /* t2: big breech with exposed sliding block, 2 short recoil cylinders under it, long barrel with
   * 3 big cut-away coil housings showing copper windings, steel counterweight + cable */
  function h2(c, s, d) {
    const rec = s.rec || 0, cy0 = s.cyl || 0; let m;
    const gun = () => { m = barrel(c, d, 6 - rec, 10, 36, 2.7, s.coils || [], { big: true, brake: true }); };
    const breech = () => {
      const [wx, wy] = pt(d, -15 - rec, 0, 3); G.obox(c, wx, wy, 7, 11, 9, d.th, P.gunmetal, { mat: 'metal' });
      G.hose(c, [[wx, wy - 9], [wx - d.sx * 4, wy - 4], [wx - d.sx * 6, wy + 4]], 1.8, P.rubber);
      [-3.5, 3.5].forEach(w => { const a = pt(d, -6, w, 2), b = pt(d, 6 - cy0, w, 4); G.bar(c, a[0], a[1], b[0], b[1], 3, P.steelLight); });
      const [cx, cy] = pt(d, -4 - rec, 0, 3); G.obox(c, cx, cy, 18, 14, 11, d.th, BLUE, { mat: 'paint' });
      const [sx, sy] = pt(d, -5 - rec, 0, 14); G.obox(c, sx, sy, 8, 7, 3, d.th, P.steelLight, { mat: 'metal' }); // sliding block
      const [lx, ly] = pt(d, -11 - rec, 0, 15); G.lamp(c, lx, ly, CYAN.mid, (s.coils || [0])[0] > .3, 1.8);
    };
    if (d.dy < 0) { gun(); breech(); } else { breech(); gun(); }
    flash(c, m, d, s.fl, 1.4); sparks(c, m, d, s.spark);
  }

  TOWERS.piercing_cannon = TW;
})();
