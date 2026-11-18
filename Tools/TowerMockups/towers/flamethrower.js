/* PROTOTYPE - NOT FOR PRODUCTION
 * Flamethrower (Súng phun lửa) — v3, tier rule from the Kingdom Rush reference (2026-11-18).
 * Spec: design/assets/specs/flamethrower-assets.md (sheet list, family thread).
 * ONE core body for all tiers: a squat square fuel bunker (wide plinth, block with a front hatch,
 * turntable in the roof centre) with fuel tanks lying horizontally across the BACK of the roof.
 * Tier 0 is already a finished building. Each tier: ~15% bigger, material ladder (stone blocks →
 * stone + riveted steel bands → steel armour plating), a new crown element (t1 parapet + chimney,
 * t2 tank-rack frame + armour teeth + compressor), more glow / props at the foot.
 * Family thread: LOW, WIDE flame-orange Head with a short flared nozzle and amber pilot light; dark-red
 * fuel tanks with yellow bands at the back (2 drums → 1 big tank → rack of 3), copper pipe to the
 * turntable.
 */
(function () {
  const P = G.P;
  const ORANGE = { hi: '#f5794a', mid: '#ef5b31', lo: '#b23d1f' };
  const TANK = { hi: '#d4513f', mid: '#b8352b', lo: '#7a2420' };
  const STONE = { hi: '#e2d8c3', mid: '#b9ac93', lo: '#7e7362' };
  const PLATE = { hi: '#d3dce8', mid: '#97a7bd', lo: '#5d6d86' };   // light steel armour (t2), reads apart from the orange head
  const HOT = ['#4a505e', '#7a3a2a', '#c4482a', '#ff7a3a'];
  const EMBER = '#ff8a3a';

  /* ---------- 3D cuboid for Head parts (any aim direction, optional pitch) ---------- */
  const VIEW = (() => { const n = Math.hypot(1, G.K); return [0, 1 / n, G.K / n]; })();
  const LIGHT = (() => { const v = [-.5, -.35, .8], n = Math.hypot(...v); return v.map(a => a / n); })();
  const pt = (d, u, w, z) => [64 + d.dx * u + d.dy * w, 68 + (d.dy * u - d.dx * w) * G.K - z];
  /** Cuboid centred at (u,w) on its base at height z; L along aim, W across, H up; pitched up by p.
   * Returns {P(a,b,h) local→screen, front: front face visible}. */
  function cub(c, d, o, col, opt) {
    opt = opt || {}; const T = G.tones(col), p = o.p || 0, cp = Math.cos(p), sp = Math.sin(p);
    const pu = o.pu == null ? o.u : o.pu, pz = o.pz == null ? o.z : o.pz;
    const P = (a, b, h) => { const U = o.u + a - pu, Z = o.z + h - pz; return pt(d, pu + U * cp - Z * sp, o.w + b, pz + U * sp + Z * cp); };
    const f = [d.dx * cp, d.dy * cp, sp], up = [-d.dx * sp, -d.dy * sp, cp], l = [d.dy, -d.dx, 0];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], neg = v => v.map(x => -x);
    const L2 = o.L / 2, W2 = o.W / 2, H = o.H;
    const faces = [
      [f, [[L2, -W2, 0], [L2, W2, 0], [L2, W2, H], [L2, -W2, H]], 'front'],
      [neg(f), [[-L2, -W2, 0], [-L2, W2, 0], [-L2, W2, H], [-L2, -W2, H]], 'back'],
      [l, [[-L2, W2, 0], [L2, W2, 0], [L2, W2, H], [-L2, W2, H]], 'left'],
      [neg(l), [[-L2, -W2, 0], [L2, -W2, 0], [L2, -W2, H], [-L2, -W2, H]], 'right'],
      [up, [[-L2, -W2, H], [L2, -W2, H], [L2, W2, H], [-L2, W2, H]], 'top'],
    ];
    const vis = {};
    faces.forEach(([n, q, name]) => {
      const v = dot(n, VIEW); vis[name] = v > .02; if (!vis[name]) return;
      const pts = q.map(([a, b, h]) => P(a, b, h)), lit = dot(n, LIGHT);
      const fill = name === 'top' ? (opt.top || G.mix(T.hi, T.mid, .2)) : lit > .25 ? T.mid : lit > -.15 ? G.mix(T.mid, T.lo, .45) : T.lo;
      const path = () => { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); };
      path(); c.fillStyle = fill; c.fill();
      const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
      path(); G.texture(c, [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)], T, opt.mat || 'paint', .7);
      if (name !== 'top') { c.beginPath(); c.moveTo(pts[3][0], pts[3][1] + .7); c.lineTo(pts[2][0], pts[2][1] + .7); c.strokeStyle = G.rgba(T.rim, .8); c.lineWidth = 1; c.stroke(); }
      path(); G.stroke(c);
    });
    return { P, vis };
  }

  /* ---------- base helpers (copied from mortar / fortifier v3) ---------- */
  function blockFace(c, x, gy, w, h, rows) {
    const T = G.tones(STONE);
    for (let i = 1; i < rows; i++) { const y = gy - h * i / rows; G.wire(c, [[x + 1, y], [x + w - 1, y]], G.rgba(T.lo, .9), 1); }
    for (let i = 0; i < rows; i++) for (let j = 1; j < 6; j++) { const xx = x + w * (j - (i % 2) * .5) / 5.5; if (xx <= x + 2 || xx >= x + w - 2) continue; G.wire(c, [[xx, gy - h * i / rows], [xx, gy - h * (i + 1) / rows]], G.rgba(T.lo, .8), 1); }
  }
  const strap = (c, x, y, w, h) => { const ST = G.tones(P.steel); c.fillStyle = ST.mid; c.fillRect(x, y, w, h); c.fillStyle = ST.rim; c.fillRect(x + .5, y + .5, w - 1, 1); c.strokeStyle = G.OUT; c.lineWidth = 1.2; c.strokeRect(x, y, w, h); };
  const tank = (c, cx, cy, len, r, bands) => G.hcyl(c, cx, cy, len, r, TANK, { bands: bands || [len * .2, len * .72], band: P.hazard });
  const glowSlit = (c, x, y, w, h, k) => {
    c.fillStyle = '#2a1a24'; c.fillRect(x, y, w, h); c.strokeStyle = G.OUT; c.lineWidth = 1.2; c.strokeRect(x, y, w, h);
    if (k > 0) { c.fillStyle = G.mix('#ff7a3a', '#ffb347', Math.min(1, k)); c.fillRect(x + .8, y + .8, w - 1.6, h - 1.6); c.fillStyle = '#ffe9a8'; c.fillRect(x + 1.5, y + h / 2 - .4, w - 3, .9); G.fx(c, o => { o.globalAlpha *= .6; G.halo(o, x + w / 2, y + h / 2, Math.max(w, h) * (.6 + k * .3), EMBER); }); }
  };

  const at = (arr, f) => arr[Math.min(f, arr.length - 1)];
  const TW = {
    id: 'flamethrower', folder: 'Flamethrower', head: true,
    headPos: [], // filled below from the body geometry
    foot: [{ r: 34, h: 38 }, { r: 39, h: 52 }, { r: 45, h: 68 }],
    debrisCols: ['#b9ac93', '#ef5b31', '#b8352b', '#62738f', '#cc823f'],
    sheets: [],
    state(tier, anim, f, n) {
      if (anim === 'idle') return { pilot: f === 0 ? 1 : .6, heat: 0, glow: f === 0 ? 1 : .7, lamp: f === 0 };
      if (anim === 'fire_start') return { pilot: 1, heat: [1, 2, 3][f], tongue: [.25, .55, .8][f] };
      if (anim === 'fire_loop') return { pilot: 1, heat: 3, tongue: [.9, 1, .85, 1][f], shake: f % 2 ? 1 : 0 };
      return { pilot: .8, heat: [2, 1, 0][f], smoke: f + 1 }; // fire_end
    },
    base(c, tier, s) { body(c, tier, s || {}); },
    head(c, tier, s, dir) {
      const k = [1.32, 1.4, 1.58][tier];
      c.save(); c.translate(64, 68); c.scale(k, k); c.translate(-64, -68);
      head(c, tier, s || {}, G.dir(dir)); c.restore();
    },
    rubble(c, tier) {
      const drum = (x, y, r, l, w) => { c.save(); c.translate(x, y); c.rotate(r); c.fillStyle = TANK.lo; c.fillRect(-l / 2, -w / 2, l, w); c.fillStyle = TANK.mid; c.fillRect(-l / 2, -w / 2, l, w * .45); c.fillStyle = '#f0b429'; c.fillRect(-l / 2 + l * .3, -w / 2, 2.5, w); c.restore(); };
      const hd = (x, y) => { c.fillStyle = ORANGE.lo; c.fillRect(x - 8, y - 3, 16, 7); c.fillStyle = ORANGE.mid; c.fillRect(x - 8, y - 3, 16, 3); };
      const cols = [[['#7e7362', '#b9ac93'], ['#6b4224', '#a8713c']], [['#7e7362', '#b9ac93'], ['#3a4258', '#5d6a80']], [['#3a4660', '#62738f'], ['#7e7362', '#b9ac93'], ['#86512a', '#cc823f']]][tier];
      A.heap(c, [32, 37, 43][tier], cols);
      if (tier === 0) { drum(56, 74, .3, 16, 8); drum(74, 77, -.2, 14, 8); }
      else if (tier === 1) drum(62, 73, .12, 32, 12);
      else { drum(54, 71, .2, 28, 10); drum(78, 75, -.15, 28, 10); }
      hd(66, 84);
    },
  };
  // sheet list per spec (21 tower sheets)
  [0, 1, 2].forEach(t => {
    if (t === 0) TW.sheets.push({ file: 'tower_flamethrower_t0_base_idle.png', tier: 0, layer: 'base', anim: 'idle', frames: 2, fps: 2 }, { file: 'tower_flamethrower_t0_base_build.png', tier: 0, layer: 'base', anim: 'build', frames: 6, fps: 10 });
    else TW.sheets.push({ file: `tower_flamethrower_t${t}_base_upgrade.png`, tier: t, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 }, { file: `tower_flamethrower_t${t}_base_idle.png`, tier: t, layer: 'base', anim: 'idle', frames: 2, fps: 2 });
    TW.sheets.push({ file: `tower_flamethrower_t${t}_base_destroy.png`, tier: t, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: `tower_flamethrower_t${t}_head_idle.png`, tier: t, layer: 'head', anim: 'idle', frames: 2, fps: 2 },
      { file: `tower_flamethrower_t${t}_head_fire_start.png`, tier: t, layer: 'head', anim: 'fire_start', frames: 3, fps: 10 },
      { file: `tower_flamethrower_t${t}_head_fire_loop.png`, tier: t, layer: 'head', anim: 'fire_loop', frames: 4, fps: 12 },
      { file: `tower_flamethrower_t${t}_head_fire_end.png`, tier: t, layer: 'head', anim: 'fire_end', frames: 3, fps: 10 });
  });

  /* ================= BASE: one body for all tiers ================= */
  const GEO = t => {
    const cx = 64, gy = 82, W = [46, 52, 60][t], D = [28, 32, 36][t], H = [12, 15, 18][t];
    const sk = Math.min(5, D * .35), fx = cx - W / 2 - sk / 2, fy = gy + D * G.K / 2 - 2;
    const roofY = fy - H, backY = roofY - D * G.K, rcy = roofY - D * G.K * .4;
    return { cx, gy, W, D, H, sk, fx, fy, roofY, backY, rcy };
  };
  [0, 1, 2].forEach(t => { const g = GEO(t); TW.headPos[t] = [64, Math.round(g.rcy + 2 - 3 - 4)]; });

  function body(c, t, s) {
    const { cx, gy, W, D, H, sk, fx, fy, roofY, backY, rcy } = GEO(t);
    const mat = t === 2 ? PLATE : STONE, glow = s.glow == null ? 1 : s.glow;
    G.ground(c, cx, gy, W / 2 + 11, { tufts: 2, pebbles: 7 });
    // plinth
    G.boxC(c, cx, gy, W + 12, D + 8, 3, t === 2 ? PLATE : { hi: '#c9bea8', mid: '#9c907a', lo: '#6a6052' }, { mat: t === 2 ? 'metal' : 'concrete', stripes: t === 2 });
    // t2: compressor shed behind the right shoulder (drawn before the block)
    // bunker block
    G.box(c, fx, fy, W, D, H, mat, { mat: t === 2 ? 'paint' : 'concrete' });
    if (t < 2) blockFace(c, fx, fy, W, H, t === 0 ? 3 : 4);
    else for (let i = 1; i < 5; i++) { const x = fx + W * i / 5; G.wire(c, [[x, fy - 1], [x, fy - H + 1]], G.rgba(PLATE.lo, .9), 1.2); G.rivets(c, x + 2, fy - 3, x + 2, fy - H + 3, 3); }
    if (t >= 1) { // riveted steel band along the top + corner straps
      strap(c, fx, roofY, W, 3.5); G.rivets(c, fx + 4, roofY + 2.2, fx + W - 4, roofY + 2.2, 9);
      [fx, fx + W - 4].forEach(x => strap(c, x, roofY, 4, H));
    }
    if (t === 2) { c.beginPath(); c.rect(fx, fy - 4, W, 3.5); G.stripesInPath(c, fx, fy - 4, fx + W, fy - .5, 5); c.beginPath(); c.rect(fx, fy - 4, W, 3.5); G.stroke(c, 1); }
    // front: fuel hatch in the centre, ember vents either side (more glow per tier)
    const dw = [12, 13, 14][t], dh = [8, 10, 11][t], dx = cx - sk / 2 - dw / 2, dy = fy - (t === 2 ? 4 : 0);
    c.beginPath(); c.moveTo(dx, dy); c.lineTo(dx, dy - dh + 3); c.lineTo(dx + 3, dy - dh); c.lineTo(dx + dw - 3, dy - dh); c.lineTo(dx + dw, dy - dh + 3); c.lineTo(dx + dw, dy); c.closePath();
    c.fillStyle = t === 0 ? G.tones(P.woodDark).mid : t === 1 ? '#7d889b' : '#3a4258'; c.fill(); G.stroke(c);
    if (t === 0) { G.wire(c, [[dx + 1, dy - 2.5], [dx + dw - 1, dy - 2.5]], '#4a505e', 1.6); G.wire(c, [[dx + 1, dy - dh + 3.5], [dx + dw - 1, dy - dh + 3.5]], '#4a505e', 1.6); }
    if (t === 1) G.rivets(c, dx + 2, dy - dh + 2.5, dx + dw - 2, dy - dh + 2.5, 4);
    if (t === 2) glowSlit(c, dx + 3, dy - dh + 3, dw - 6, 2.5, glow);
    if (t >= 1) { glowSlit(c, dx - 10, fy - H * .62, 6, 3, glow * (t === 2 ? 1.2 : .8)); glowSlit(c, dx + dw + 4, fy - H * .62, 6, 3, glow * (t === 2 ? 1.2 : .8)); }
    // crown: t1 chimney back-right; t2 tall exhaust stack back-right
    const rx0 = cx - sk / 2, chx = fx + W - 2 + sk;
    if (t === 1) { G.boxC(c, chx - 3, backY + 7, 8, 6, 30, STONE, { mat: 'concrete' }); strap(c, chx - 7, backY - 25, 8, 3); }
    // fuel tanks across the back of the roof (family thread): 2 drums → 1 big tank → rack of 3
    const tx = rx0 + sk / 2;
    if (t === 0) {
      [-11, 11].forEach(o => G.boxC(c, tx + o, backY + 8, 7, 5, 6, STONE, { mat: 'concrete' }));
      tank(c, tx - 11, backY - 3, 20, 7); tank(c, tx + 11, backY - 3, 20, 7);
      G.wire(c, [[tx - 22, backY - 7], [tx + 22, backY - 6]], P.rope.mid, 1.6);
    } else if (t === 1) {
      [-15, 15].forEach(o => G.boxC(c, tx + o, backY + 9, 8, 6, 7, P.steel, { mat: 'metal' }));
      tank(c, tx, backY - 5, W - 10, 10, [8, W - 20]);
      [-8, 8].forEach(o => { strap(c, tx + o, backY - 15, 3, 20); });
      G.gauge(c, tx + (W - 10) / 2 - 2, backY - 13, 2.8, .55);
    } else { // two big fuel tanks side by side on armoured saddles + one central gauge
      const len = (W - 12) / 2;
      [-1, 1].forEach(k => { G.boxC(c, tx + k * (len / 2 + 1), backY + 9, 9, 6, 8, PLATE, { mat: 'metal' }); });
      tank(c, tx - len / 2 - 1, backY - 5, len, 10, [4, len - 8]); tank(c, tx + len / 2 + 1, backY - 5, len, 10, [4, len - 8]);
      G.gauge(c, tx, backY - 16, 3.4, .8);
      G.lamp(c, tx + len + 2, backY - 12, P.amber, s.lamp !== false, 2.3);
    }
    // copper pipe from the tanks down to the turntable
    G.hose(c, [[tx - 8, backY + [6, 7, 8][t]], [tx - 13, rcy - 2], [tx - 10, rcy + 2]], [2.2, 2.6, 3][t], P.copper);
    // turntable
    G.cyl(c, cx, rcy + 2, [10, 11.5, 13][t], 3, t === 0 ? STONE : P.gunmetal, { mat: t === 0 ? 'concrete' : 'metal', ribs: t === 0 ? 0 : 10 });
    // crown on the front roof edge: t1 stone merlons; t2 steel armour teeth
    if (t === 1) [0, 1, 4, 5].forEach(i => G.box(c, fx + 2 + i * (W - 8) / 5, roofY + 1, 5, 3, 4, STONE, { mat: 'concrete', side: false }));
    if (t === 2) [0, 1, 4, 5].forEach(i => G.box(c, fx + 1 + i * (W - 8) / 5, roofY + 1.5, 6, 3, 5, PLATE, { mat: 'metal', side: false }));
    // right side: t2 compressor with flywheel; t1 valve wheel
    if (t === 1) { G.ell(c, fx + W + sk / 2 + 1, fy - H * .55 - 1.5, 3.4, 4, P.steel.mid, G.INNER); G.ell(c, fx + W + sk / 2 + 1, fy - H * .55 - 1.5, 1.2, 1.4, P.brass.mid, 1); }
    // foot props front-left: amber work lamp on a post (motif) + fuel cans, more per tier
    const lx = fx - 3;
    G.bar(c, lx, gy + 8, lx, gy - 6, 1.6, P.steel); G.lamp(c, lx, gy - 8, P.amber, s.lamp !== false, 2.4);
    G.box(c, lx + 3, gy + 13, 7, 5, 8, TANK, { mat: 'paint' });
    if (t >= 1) G.box(c, lx + 11, gy + 14, 7, 5, 6, TANK, { mat: 'paint' });
    if (t >= 1) G.hcyl(c, fx + W + sk - 2, gy + 10, 12, 4.5, TANK, { bands: [3], band: P.hazard });
    if (t === 2) G.lamp(c, fx + W + 4, fy - H - 2, P.amber, s.lamp !== false, 2);
  }

  /* ================= HEAD: low, wide flame-orange projector ================= */
  /** short flared nozzle; heat 0..3 colours the mouth; tongue = little flame at the mouth (fx) */
  function nozzle(c, d, u, z, L, r, s, flat, w) {
    const [x, y] = pt(d, u - (s.shake || 0) * .5, w || 0, z), Ls = L * d.fs + 2;
    const m = G.tube(c, x, y, d.ang, Ls, r, P.steel, { open: false, cap: HOT[s.heat || 0] });
    c.save(); c.translate(m[0], m[1]); c.rotate(d.ang);
    const R = r * (flat ? 2.1 : 1.75);
    c.beginPath(); c.moveTo(-3, -r); c.lineTo(1, -R); c.lineTo(1, R); c.lineTo(-3, r); c.closePath(); c.fillStyle = G.tones(P.steel).mid; c.fill(); G.stroke(c, 1.2);
    G.ell(c, 1, 0, R * .4, R, HOT[s.heat || 0], 1.2);
    c.restore();
    const pl = [m[0] + Math.cos(d.ang + 1.3) * r * 1.3, m[1] + Math.sin(d.ang + 1.3) * r * 1.3 + 1];
    G.lamp(c, pl[0], pl[1], P.amber, (s.pilot || 0) > .7, 1.5);
    if (s.tongue) G.fx(c, o => { o.save(); o.translate(m[0], m[1]); o.rotate(d.ang); const L2 = 10 * s.tongue; o.beginPath(); o.moveTo(1, -R * .8); o.quadraticCurveTo(L2 * .6, -R * 1.3, L2, 0); o.quadraticCurveTo(L2 * .6, R * 1.3, 1, R * .8); o.closePath(); o.fillStyle = '#ff9a3a'; o.fill(); o.strokeStyle = G.OUT; o.lineWidth = 1; o.stroke(); o.beginPath(); o.ellipse(L2 * .35, 0, L2 * .3, R * .45, 0, 0, 7); o.fillStyle = '#ffe08a'; o.fill(); o.restore(); });
    if (s.smoke) for (let i = 0; i < 2; i++) G.puff(c, m[0] + i * 3, Math.max(6, m[1] - 3 - s.smoke * 3 - i * 2), 2 + s.smoke, .85 - s.smoke * .2, '#d9d4de');
    return m;
  }

  function head(c, t, s, d) {
    const back = d.dy < -.1, sh = (s.shake || 0) * .4;
    const L = [10, 11, 12][t], Wd = [18, 20, 22][t], H = [5, 5.5, 6][t];
    // t2: TWIN flared nozzles side by side (far one first)
    const nz = () => {
      if (t < 2) return nozzle(c, d, L / 2 - 1, 2 + H * .55, [6, 7, 8][t], [2.2, 2.3, 2.6][t], s, t >= 1);
      const ws = [-5, 5].sort((a, b) => pt(d, 0, a, 0)[1] - pt(d, 0, b, 0)[1]);
      ws.forEach(w => nozzle(c, d, L / 2 - 1, 2 + H * .55, 7.5, 2.3, s, true, w));
    };
    const acc = () => { if (t !== 2) return; const a = pt(d, -L / 2 - 1.5, Wd * .38, 2 + H * .7), ang = Math.atan2(-d.dx * G.K * -1, -d.dy * 1); const v = [-d.dy, d.dx * G.K]; G.tube(c, a[0], a[1], Math.atan2(v[1], v[0]), Wd * .76 * Math.hypot(v[0], v[1]), 3.4, TANK, { open: false, cap: TANK.hi, bands: [Wd * .3], band: P.hazard, bandW: 2.5 }); };
    // collar
    G.cyl(c, 64, 68, [7, 8, 9][t], 2.5, P.gunmetal, { mat: 'metal' });
    if (back) nz();
    if (!back && d.dy > .1) acc();
    const B = cub(c, d, { u: -1 - sh, w: 0, z: 2.5, L, W: Wd, H }, ORANGE, { mat: 'paint' });
    // chamfered front lip: steel visor plate on top
    cub(c, d, { u: -2.5 - sh, w: 0, z: 2.5 + H, L: L - 5, W: Wd - 7, H: [1.4, 1.6, 2][t] }, t === 0 ? P.steel : PLATE, { mat: 'metal' });
    // rivets along the top edge of the visible long side
    const side = d.dx >= 0 ? -1 : 1;
    if (t >= 1) { const a = B.P(-L / 2 + 1.5, side * Wd / 2, H - 1.5), b = B.P(L / 2 - 1.5, side * Wd / 2, H - 1.5); G.rivets(c, a[0], a[1], b[0], b[1], 3); }
    // t1/t2: 45° heat shields form the shoulders
    if (t >= 1) [1, -1].forEach(sd => { if ((sd === 1) === (d.dx >= 0) && Math.abs(d.dx) > .5) return; const q = [pt(d, -L / 2, sd * (Wd / 2), 2.5), pt(d, L / 2 - 2, sd * (Wd / 2 + 2.5), 2.5), pt(d, L / 2 - 3, sd * (Wd / 2), 2.5 + H + 1), pt(d, -L / 2, sd * (Wd / 2 - 1.5), 2.5 + H + 1)]; G.poly(c, q, ORANGE, { mat: 'paint' }); G.rivets(c, q[3][0], q[3][1] + 2, q[2][0], q[2][1] + 2, 3); });
    // t2: glowing heat grille on top (3 ember slits) + pressure gauge
    if (t === 2) {
      const on = (s.heat || 0) >= 2 || s.pilot > .7;
      [-4, 0, 4].forEach(w => { const a = pt(d, -4, w, 2.5 + H + 2.2), b = pt(d, 2, w, 2.5 + H + 2.2); c.lineCap = 'round'; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineWidth = 3; c.strokeStyle = G.OUT; c.stroke(); c.lineWidth = 1.6; c.strokeStyle = on ? EMBER : '#7a3a2a'; c.stroke(); });
      if (on) { const g0 = pt(d, -1, 0, 2.5 + H + 2.5); G.fx(c, o => G.halo(o, g0[0], g0[1], 7, EMBER)); }
      const g = pt(d, -5, -Wd * .32, 2.5 + H + 3.5); G.gauge(c, g[0], g[1], 2, .7);
    }
    if (back || d.dy <= .1) acc();
    if (!back) nz();
  }

  TOWERS.flamethrower = TW;
})();
