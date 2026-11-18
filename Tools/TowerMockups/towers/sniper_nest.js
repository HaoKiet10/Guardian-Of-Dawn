/* PROTOTYPE - NOT FOR PRODUCTION
 * Sniper Nest (Tháp bắn tỉa) — v3, tier rule from the user's Kingdom Rush reference (2026-11-18).
 * Spec: design/assets/specs/sniper-nest-assets.md
 * ONE core body for all tiers: a watchtower — octagonal plinth, a narrower octagonal support drum,
 * 45° corbels, and a WIDER octagonal deck on top (deck surface 16 / 32 / 48 px above ground). One
 * kneeling gunner with a long rifle sits on the deck (Gunner layer, SHARED across tiers, ≤ 24 px
 * above the deck). Tier ladder: stone → stone + riveted steel bands → steel armour; new crown per
 * tier (t1 steel shield plates + antenna mast, t2 armoured back shield + hydraulic struts + motorised
 * stereo rangefinder bar); more lamps / props per tier. Rangefinder motif always back-right of the
 * deck with an amber glint. Nothing in the front half of the deck rises more than 4 px.
 */
(function () {
  const P = G.P;
  const STONE = { hi: '#e2d8c3', mid: '#b9ac93', lo: '#7e7362' };
  const PLATE = { hi: '#9fb0c8', mid: '#62738f', lo: '#3a4660' };
  const OLIVE = { hi: '#9aab4f', mid: '#7d8f3a', lo: '#5a682a' };
  const COVER = { hi: '#8d9aa8', mid: '#6f7d8c', lo: '#4f5966' };
  const GUN = { hi: '#5a6274', mid: '#323845', lo: '#1e222c' };
  const at = (arr, f) => arr[Math.min(f, arr.length - 1)];
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const ROT8 = Math.PI / 8;
  const octV = (cx, gy, r, a) => [cx + Math.cos(a) * r, gy + Math.sin(a) * r * G.K];
  const DH = [16, 32, 48];

  function courses(c, cx, gy, r, h, rows) {
    const T = G.tones(STONE);
    for (let k = 0; k < 8; k++) {
      const a0 = ROT8 + k * Math.PI / 4, a1 = a0 + Math.PI / 4; if (Math.sin((a0 + a1) / 2) < .2) continue;
      const p = octV(cx, gy, r, a0), q = octV(cx, gy, r, a1);
      for (let i = 1; i < rows; i++) G.wire(c, [[p[0], p[1] - h * i / rows], [q[0], q[1] - h * i / rows]], G.rgba(T.lo, .9), 1);
      for (let i = 0; i < rows; i++) { const m = lerp(p, q, i % 2 ? .3 : .65); G.wire(c, [[m[0], m[1] - h * i / rows - .5], [m[0], m[1] - h * (i + 1) / rows + .5]], G.rgba(T.lo, .8), 1); }
    }
  }
  function band(c, cx, y, r, bw, col) {
    const T = G.tones(col || P.steel);
    for (let k = 0; k < 8; k++) {
      const a0 = ROT8 + k * Math.PI / 4, a1 = a0 + Math.PI / 4, am = (a0 + a1) / 2; if (Math.sin(am) < .2) continue;
      const p = octV(cx, y, r + .6, a0), q = octV(cx, y, r + .6, a1);
      c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.lineTo(q[0], q[1] - bw); c.lineTo(p[0], p[1] - bw); c.closePath();
      c.fillStyle = Math.cos(am) < -.3 ? T.hi : Math.cos(am) > .3 ? T.lo : T.mid; c.fill(); G.stroke(c, 1);
      const m = lerp(p, q, .5); G.rivets(c, m[0], m[1] - bw / 2, m[0], m[1] - bw / 2, 1);
    }
  }
  function crate(c, x, gy, w, h, col) {
    G.box(c, x, gy, w, 8, h, col, { mat: col === P.wood ? 'wood' : 'metal' });
    G.wire(c, [[x + 1, gy - h / 2], [x + w - 1, gy - h / 2]], G.rgba(G.tones(col).lo, .9), 1);
  }

  const TW = {
    id: 'sniper_nest', folder: 'SniperNest', head: true,
    headPos: DH.map(h => [64, 82 - h - 16]),
    foot: [{ r: 32, h: 36 }, { r: 38, h: 50 }, { r: 44, h: 64 }],
    debrisCols: ['#b9ac93', '#7d8f3a', '#62738f', '#a8713c', '#5d6a80'],
    sheets: [
      { file: 'tower_sniper_nest_t0_base_idle.png', tier: 0, layer: 'base', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_sniper_nest_t0_base_build.png', tier: 0, layer: 'base', anim: 'build', frames: 6, fps: 10 },
      { file: 'tower_sniper_nest_t0_base_destroy.png', tier: 0, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: 'tower_sniper_nest_t1_base_upgrade.png', tier: 1, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 },
      { file: 'tower_sniper_nest_t1_base_idle.png', tier: 1, layer: 'base', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_sniper_nest_t1_base_destroy.png', tier: 1, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: 'tower_sniper_nest_t2_base_upgrade.png', tier: 2, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 },
      { file: 'tower_sniper_nest_t2_base_idle.png', tier: 2, layer: 'base', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_sniper_nest_t2_base_destroy.png', tier: 2, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      // Gunner sheets: shared by all tiers (art bible §8 exception), no t<N> token, tier 0 in the def
      { file: 'tower_sniper_nest_gunner_idle.png', tier: 0, layer: 'head', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_sniper_nest_gunner_aim.png', tier: 0, layer: 'head', anim: 'aim', frames: 3, fps: 8 },
      { file: 'tower_sniper_nest_gunner_fire.png', tier: 0, layer: 'head', anim: 'fire', frames: 4, fps: 10 },
      { file: 'tower_sniper_nest_gunner_reload.png', tier: 0, layer: 'head', anim: 'reload', frames: 4, fps: 5 },
    ],
    state(tier, anim, f) {
      if (anim === 'idle') return { lamp: f === 0, glint: f === 0, pose: 'up', sh: f === 1 ? 1 : 0 };
      if (anim === 'aim') return { lamp: true, pose: ['lower', 'level', 'aim'][f], glint: f === 2 };
      if (anim === 'fire') return { lamp: true, pose: ['recoil', 'aim', 'bolt', 'aim'][f], glint: f === 3 };
      return { lamp: true, pose: ['down', 'mag_out', 'pouch', 'mag_in'][f] };
    },
    base(c, tier, s) { body(c, tier, s || {}); },
    head(c, tier, s, dir) { gunner(c, s || {}, G.dir(dir)); },
    rubble(c, tier) {
      const plank = (x, y, r, l, col) => { c.save(); c.translate(x, y); c.rotate(r); c.fillStyle = col[0]; c.fillRect(-l / 2, -2, l, 4); c.fillStyle = col[1]; c.fillRect(-l / 2, -2, l, 1.8); c.restore(); };
      const cols = [[['#7e7362', '#b9ac93'], ['#6b4224', '#a8713c']], [['#7e7362', '#b9ac93'], ['#3a4258', '#5d6a80']], [['#3a4660', '#62738f'], ['#7e7362', '#b9ac93']]][tier];
      A.heap(c, [30, 35, 40][tier], cols);
      plank(58, 76, -.35, [18, 22, 26][tier], tier === 0 ? ['#6b4224', '#a8713c'] : ['#3a4660', '#62738f']);
      plank(72, 80, .5, 12, ['#5a682a', '#7d8f3a']);
    },
  };

  /* One body for all tiers: plinth → support drum (+ struts) → corbels → wide deck → back crown + rangefinder. */
  function body(c, t, s) {
    const cx = 64, gy = 82, dh = DH[t];
    const PR = [24, 28, 33][t], PH = [3, 4, 3][t], SR = [10, 11, 12][t], DR = [17, 19, 21][t], DT = 3;
    const mat = t === 2 ? PLATE : STONE, mm = t === 2 ? 'metal' : 'concrete';
    G.ground(c, cx, gy, PR + 7, { tufts: 2, pebbles: 7 });
    let base = gy;
    if (t === 2) { G.prism(c, cx, gy, PR + 4, 3, 8, PLATE, { rot: ROT8, stripes: true, mat: 'metal' }); base -= 3; }
    G.prism(c, cx, base, PR, PH, 8, mat, { rot: ROT8, mat: mm });
    if (t < 2) courses(c, cx, base, PR, PH, 1);
    base -= PH;
    const deckBot = gy - dh + DT, corb = [3, 5, 6][t];
    const drumH = deckBot - corb - (base - 0); // negative number of px upward
    const sH = base - (deckBot + 0) - 0;
    // hydraulic struts (t2), back pair behind the drum
    const strut = a => { const p = octV(cx, base, PR - 4, a), q = octV(cx, deckBot - 1, SR + 2, a); G.bar(c, p[0], p[1], q[0], q[1], 3.6, P.steel); const m = lerp(p, q, .45); G.bar(c, m[0], m[1], q[0], q[1], 2, P.steelLight); };
    if (t === 2) { strut(Math.PI * 1.25); strut(Math.PI * 1.75); }
    // support drum
    G.prism(c, cx, base, SR, sH, 8, mat, { rot: ROT8, mat: t === 2 ? 'paint' : 'concrete', top: null });
    if (t < 2) courses(c, cx, base, SR, sH, Math.max(2, Math.round(sH / 5)));
    if (t === 1) [.3, .75].forEach(k => band(c, cx, base - sH * k + 1.5, SR, 3, P.steel));
    if (t === 2) {
      for (let k = 0; k < 8; k++) { const a = ROT8 + k * Math.PI / 4; if (Math.sin(a) < .1) continue; const p = octV(cx, base, SR, a); G.rivets(c, p[0], p[1] - 3, p[0], p[1] - sH + 3, 5); }
      // exposed ammo hoist chain on the front-right of the trunk
      const hx = cx + 6, y0 = base + 5, y1 = deckBot + 3;
      G.bar(c, hx - 2, y0, hx - 2, y1, 1.2, P.steel); G.bar(c, hx + 2, y0, hx + 2, y1, 1.2, P.steel);
      for (let y = y0 - 2; y > y1; y -= 3) G.ell(c, hx, y, 1.6, 1.1, G.tones(P.steel).hi, 1);
      G.boxC(c, hx, base + 7, 9, 6, 6, P.paintOlive, { mat: 'paint' });
      strut(Math.PI * .25); strut(Math.PI * .75);
    }
    // 45° corbels under the deck rim (front half)
    for (let k = 0; k < 8; k++) {
      const a = ROT8 + k * Math.PI / 4 + Math.PI / 8; if (Math.sin(a) < .1) continue;
      const p = octV(cx, deckBot, SR, a), q = octV(cx, deckBot, DR - 1, a);
      G.poly(c, [[p[0], p[1]], [q[0], q[1]], [p[0], p[1] + corb + 2]], mat, { mat: mm });
    }
    // the deck (wider than the support)
    const deckMat = t === 0 ? P.wood : t === 1 ? P.steel : PLATE;
    G.prism(c, cx, deckBot, DR, DT, 8, deckMat, { rot: ROT8, mat: t === 0 ? 'wood' : 'metal', stripes: t >= 1, stripeStep: 6 });
    const top = gy - dh;
    if (t === 0) { c.save(); c.beginPath(); for (let k = 0; k < 8; k++) { const [x, y] = octV(cx, top, DR, ROT8 + k * Math.PI / 4); k ? c.lineTo(x, y) : c.moveTo(x, y); } c.closePath(); c.clip(); for (let i = -5; i <= 5; i++) G.wire(c, [[cx - DR, top + i * 3.4], [cx + DR, top + i * 3.4]], G.rgba(G.tones(P.wood).lo, .7), 1); c.restore(); }
    if (t >= 1) G.rivets(c, cx - DR + 4, top + 1, cx + DR - 4, top + 1, 0);
    // back crown: t0 stone merlons, t1 riveted steel shield plates + antenna, t2 armoured back shield
    for (let k = 0; k < 8; k++) {
      const a0 = ROT8 + k * Math.PI / 4, a1 = a0 + Math.PI / 4, am = (a0 + a1) / 2; if (Math.sin(am) > -.3) continue;
      const p = octV(cx, top, DR - 1.5, a0), q = octV(cx, top, DR - 1.5, a1), hh = [3, 4, 4][t];
      if (t === 0) { [.25, .75].forEach(f => { const m = lerp(p, q, f); G.boxC(c, m[0], m[1] + 1, 6, 4, hh, STONE, { mat: 'concrete' }); }); }
      else { G.poly(c, [p, q, [q[0], q[1] - hh], [p[0], p[1] - hh]], t === 2 ? PLATE : P.steel, { mat: 'metal' }); G.rivets(c, p[0] + (q[0] - p[0]) * .2, p[1] - hh + 2, q[0] - (q[0] - p[0]) * .2, q[1] - hh + 2, 2); }
    }
    if (t === 1) { const b = octV(cx, top, DR - 2, Math.PI * 1.3); G.bar(c, b[0], b[1], b[0], b[1] - 9, 1.6, P.steel); G.lamp(c, b[0], b[1] - 10, P.amber, s.lamp !== false, 1.6); }
    if (t === 2) { [Math.PI * 1.15, Math.PI * 1.85].forEach(a => { const b = octV(cx, top, DR - 1.5, a); G.lamp(c, b[0], b[1] - 6, P.amber, s.lamp !== false, 1.9); }); }
    // low rifle-rest rail around the front half (t1+), ≤ 3 px above the deck
    if (t >= 1) { const pts = []; for (let k = 0; k <= 4; k++) pts.push(octV(cx, top - 3, DR - 1.5, ROT8 + k * Math.PI / 4)); pts.forEach(([x, y]) => G.bar(c, x, y + 3, x, y, 1.3, P.steelLight)); G.wire(c, pts, G.OUT, 3); G.wire(c, pts, G.tones(P.steelLight).mid, 1.4); }
    // rangefinder motif back-right, amber glint
    const rf = octV(cx, top, DR - 3, -Math.PI * .22);
    const glint = (x, y) => { G.lamp(c, x, y, P.amber, s.glint !== false && s.lamp !== false, 1.4); };
    if (t === 0) { G.bar(c, rf[0], rf[1], rf[0], rf[1] - 9, 1.6, P.steel); G.tube(c, rf[0] - 3, rf[1] - 11, -.15, 6, 1.6, P.brass, { open: false }); G.tube(c, rf[0] - 2, rf[1] - 9, -.15, 6, 1.6, P.brass, { open: false }); glint(rf[0] + 3.5, rf[1] - 11); }
    if (t === 1) { G.bar(c, rf[0], rf[1], rf[0], rf[1] - 10, 2.2, P.steel); G.box(c, rf[0] - 5, rf[1] - 10, 10, 5, 5, P.steel, { mat: 'metal' }); G.rivets(c, rf[0] - 4, rf[1] - 12.5, rf[0] + 4, rf[1] - 12.5, 3); glint(rf[0] + 6, rf[1] - 14); }
    if (t === 2) {
      G.bar(c, rf[0], rf[1], rf[0] - 2, rf[1] - 7, 2.6, P.steelLight);
      G.boxC(c, rf[0], rf[1] + 1, 6, 5, 4, PLATE, { mat: 'metal' });
      G.tube(c, rf[0] - 10, rf[1] - 8, 0, 20, 2, P.steel, { open: false, bands: [2, 15], band: OLIVE });
      G.ell(c, rf[0] - 10, rf[1] - 8, 1.2, 2, '#1e222c', 1); glint(rf[0] + 10.5, rf[1] - 8);
    }
    // props on the ground: ammo crates front-left + amber lamp, more per tier
    crate(c, cx - PR - 4, gy + 8, 12, [6, 7, 8][t], t === 0 ? P.wood : t === 1 ? P.steel : PLATE);
    G.bar(c, cx - PR + 10, gy + 7, cx - PR + 10, gy - 4, 1.4, P.steel); G.lamp(c, cx - PR + 10, gy - 6, P.amber, s.lamp !== false, 2.2);
    if (t >= 1) crate(c, cx + PR - 9, gy + 9, 11, 6, P.paintOlive);
    if (t === 2) { crate(c, cx - PR - 1, gy + 1, 10, 6, PLATE); G.lamp(c, cx + PR - 3, gy - 2, P.amber, s.lamp !== false, 1.8); }
  }

  /* ================= GUNNER (shared) =================
   * Kneel point at (64,80) in the gunner cell (pivot 0.5, 0.375). Everything ≤ 24 px above it. */
  const pt = (d, u, w, z) => [64 + d.dx * u + d.dy * w, 80 + (d.dy * u - d.dx * w) * G.K - z];
  const depth = (d, u, w) => d.dy * u - d.dx * w;
  const POSE = {
    up: { b: [1.5, -3.4, 0], m: [2.5, -3.4, 20], lean: 0 },
    lower: { b: [-3, -2.4, 8], m: [12, -2.4, 19], lean: .5 },
    level: { b: [-5, -2.2, 12], m: [16, -2.2, 12], lean: 1 },
    aim: { b: [-4, -2.2, 11.5], m: [17, -2.2, 11.5], lean: 1.6, eye: 1 },
    recoil: { b: [-6, -2.2, 12], m: [15, -2.2, 13.2], lean: .4, eye: 1 },
    bolt: { b: [-4, -2.2, 11.5], m: [17, -2.2, 11.5], lean: 1.2, bolt: 1 },
    down: { b: [-3, -2.4, 12], m: [13, -2.4, 3], lean: .6 },
    mag_out: { b: [-3, -2.4, 12], m: [13, -2.4, 3], lean: .6, mag: 'hand' },
    pouch: { b: [-3, -2.4, 12], m: [13, -2.4, 3], lean: .6, mag: 'pouch' },
    mag_in: { b: [-3, -2.4, 12], m: [13, -2.4, 3], lean: .6, mag: 'in' },
  };
  function gunner(c, s, d) {
    const p = POSE[s.pose || 'up'], L = p.lean, up = s.sh || 0;
    const fk = d.dy < 0 ? 1 + d.dy * .55 : 1;               // N / NE: shorter forward reach (≤ 24 px)
    const W = ([u, w, z]) => pt(d, u * (u > 0 ? fk : 1), w, z);
    const B = W(p.b), M = W(p.m);
    const along = f => [p.b[0] + (p.m[0] - p.b[0]) * f, p.b[1], p.b[2] + (p.m[2] - p.b[2]) * f];
    const parts = [];
    // legs: left knee up in front, right knee down
    parts.push([depth(d, 1, 1.6), () => { const h = pt(d, L * .3, 1.6, 6), k = pt(d, 4.5, 1.6, 7), f = pt(d, 5, 1.6, .6); G.bar(c, h[0], h[1], k[0], k[1], 3.2, COVER); G.bar(c, k[0], k[1], f[0], f[1], 2.8, COVER); G.ell(c, f[0] + d.dx, f[1], 1.8, 1.1, '#2b2633', 1); }]);
    parts.push([depth(d, -1, -1.6), () => { const h = pt(d, L * .3, -1.6, 6), k = pt(d, 1.5, -1.6, .8), f = pt(d, -4, -1.6, .8); G.bar(c, h[0], h[1], k[0], k[1], 3.2, COVER); G.bar(c, k[0], k[1], f[0], f[1], 2.8, COVER); G.ell(c, f[0], f[1], 1.6, 1, '#2b2633', 1); }]);
    // torso + chest pouch
    parts.push([0, () => {
      const [x, y] = pt(d, L, 0, 5 + up); G.obox(c, x, y, 4.2, 6.4, 8, d.th, COVER, { mat: 'cloth' });
      const [bx, by] = pt(d, L, 0, 7.5 + up); G.obox(c, bx, by, 4.6, 6.8, 1.3, d.th, '#4a3f3a', { mat: 'none' });
      if (d.dy > -.5) { const [qx, qy] = pt(d, L + 2.4, .8, 9 + up); G.obox(c, qx, qy, 1.4, 3, 2.6, d.th, OLIVE, { mat: 'none' }); }
    }]);
    // head: balaclava + steel helmet + yellow goggles (no face)
    parts.push([.2, () => {
      const [x, y] = pt(d, L * 1.3, 0, 15 + up);
      G.ell(c, x, y + .6, 2.6, 2.6, COVER.lo, 1.1);
      G.dome(c, x, y - .6, 3.7, 3.6, P.steel);
      c.beginPath(); c.ellipse(x, y - .6, 4.2, 1.3, 0, 0, Math.PI * 2); c.fillStyle = G.tones(P.steel).mid; c.fill(); G.stroke(c, 1);
      if (d.dy > -.8) { const [gx, gy2] = pt(d, L * 1.3 + 2.2, 0, 14.6 + up); G.ell(c, gx, gy2, 1.6 * Math.max(.5, d.fs), 1, '#ffd23a', 1); if (s.glint) G.fx(c, o => G.ell(o, gx - .5, gy2 - .4, .7, .5, '#fffbe8', 0)); }
    }]);
    // rifle: olive stock, gunmetal barrel, olive-wrapped scope, steel box magazine
    const rifleDepth = depth(d, (p.b[0] + p.m[0]) / 2 * fk, p.b[1]) + (d.dy < -.5 ? 0 : .6);
    parts.push([rifleDepth, () => {
      const s1 = W(along(.3)), mz = W(along(.42));
      G.bar(c, s1[0], s1[1], M[0], M[1], 1.5, GUN);
      G.bar(c, B[0], B[1], s1[0], s1[1], 3, OLIVE);
      const sc0 = W(along(.32).map((v, i) => i === 2 ? v + 2 : v)), sc1 = W(along(.56).map((v, i) => i === 2 ? v + 2 : v));
      G.bar(c, sc0[0], sc0[1], sc1[0], sc1[1], 2.4, OLIVE); G.ell(c, sc1[0], sc1[1], 1.2, 1.2, '#1e222c', .8);
      if (p.mag !== 'hand' && p.mag !== 'pouch') { const m2 = W(along(.4).map((v, i) => i === 2 ? v - 2.4 : v)); G.bar(c, mz[0], mz[1], m2[0], m2[1], 2, P.steel); }
      if (p.bolt) { const k = W(along(.36).map((v, i) => i === 1 ? v - 1.6 : v)); G.bar(c, k[0] - 2 * d.dx, k[1], k[0], k[1], 1, P.steelLight); G.fx(c, o => { o.save(); o.translate(k[0] + 1.5, k[1] - 4); o.rotate(.6); o.fillStyle = '#9aa3b2'; o.fillRect(-1.3, -.6, 2.6, 1.2); o.strokeStyle = G.OUT; o.lineWidth = .8; o.strokeRect(-1.3, -.6, 2.6, 1.2); o.restore(); }); }
    }]);
    // arms
    const shR = [L, -2.8, 12 + up], shL = [L, 2.8, 12 + up];
    let hR = along(.33), hL = along(.6);
    if (p === POSE.up) { hR = [2, -3.2, 11]; hL = [4, 1.6, 7.5]; }
    if (p.mag === 'hand') hL = [4, 1, 6];
    if (p.mag === 'pouch') hL = [L + 2.6, .8, 9.5];
    if (p.mag === 'in') hL = along(.42).map((v, i) => i === 2 ? v - 1.5 : v);
    const arm = (sh, hd, w) => [depth(d, (sh[0] + hd[0]) / 2, w), () => { const a = pt(d, ...sh), b = W(hd); G.bar(c, a[0], a[1], b[0], b[1], 2.4, COVER); G.ell(c, b[0], b[1], 1.3, 1.3, '#3b3446', .8); }];
    parts.push(arm(shR, hR, -2.8 - .3), arm(shL, hL, 2.8));
    if (p.mag === 'hand' || p.mag === 'pouch') parts.push([depth(d, hL[0], hL[1]) + .3, () => { const q = W(hL); G.bar(c, q[0], q[1] + .5, q[0], q[1] + 3, 2, P.steel); }]);
    parts.sort((a, b) => a[0] - b[0]).forEach(q => q[1]());
  }

  TOWERS.sniper_nest = TW;
})();
