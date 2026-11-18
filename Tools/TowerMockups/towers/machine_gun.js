/* PROTOTYPE - NOT FOR PRODUCTION
 * Machine Gun (Súng máy) — v3, tier rule revised from the user's Kingdom Rush reference (2026-11-18,
 * art bible §3 "Sửa đổi 2026-11-18"). Reference towers: mortar.js / fortifier.js (v3).
 * ONE core silhouette for all tiers: an octagonal gun pillbox (plinth → octagon wall with a firing
 * slit → cornice → turret ring) carrying the rotating Head. Tier 0 is already a finished stone
 * pillbox (no sandbags / pallets). Each tier: ~15% bigger and taller, material ladder (stone blocks →
 * stone + riveted steel band → navy steel armour plating), a new crown element (t1 stone merlons ·
 * t2 spiked steel teeth + ammo hopper + exhaust stack), more glow / props at the foot.
 * Family thread (spec): long horizontal barrel(s), ammo box with brass belt on the gun's LEFT, amber
 * scope glint on top of the receiver; navy painted steel. Spec: design/assets/specs/machine-gun-assets.md
 */
(function () {
  const P = G.P;
  const NAVY = { hi: '#93acd9', mid: '#506a9c', lo: '#2e3c66' };
  const STONE = { hi: '#e2d8c3', mid: '#b9ac93', lo: '#7e7362' };
  const PLATE = { hi: '#d3dce8', mid: '#97a7bd', lo: '#5d6d86' };   // light steel armour plate (t2) — reads apart from the navy head
  const at = (arr, f) => arr[Math.min(f, arr.length - 1)];

  // one body, three sizes: ground y, octagon radius, wall height, turret ring radius / height
  const DIM = [
    { gy: 82, R: 24, H: 11, rr: 10, rh: 3 },
    { gy: 83, R: 28, H: 17, rr: 12, rh: 5 },
    { gy: 84, R: 32, H: 21, rr: 14, rh: 6 },
  ];
  // turret ring top (Head contact point; head cell y=68 → headPos y = contact - 4)
  const ringTop = t => { const d = DIM[t]; return d.gy - 3 - d.H - 3 - d.rh; };

  function flash(c, x, y, ang, k) {
    if (!k) return;
    G.fx(c, c => {
      c.save(); c.translate(x, y); c.rotate(ang); c.beginPath();
      [[0, -3], [6 * k, -2], [12 * k, 0], [6 * k, 2], [0, 3], [3 * k, 0]].forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py));
      c.closePath(); c.fillStyle = '#ffcf4a'; c.fill(); G.stroke(c, 1.1);
      G.ell(c, 2.5 * k, 0, 3 * k, 2.2 * k, '#fff4c8', 0); c.restore();
    });
  }

  const TW = {
    id: 'machine_gun', folder: 'MachineGun', head: true,
    headPos: [0, 1, 2].map(t => [64, ringTop(t) - 4]),
    foot: [{ r: 33, h: 38 }, { r: 38, h: 52 }, { r: 44, h: 66 }],
    debrisCols: ['#b9ac93', '#454c63', '#506a9c', '#d9a441', '#7e7362'],
    sheets: [
      { file: 'tower_machine_gun_t0_base_idle.png', tier: 0, layer: 'base', anim: 'idle', frames: 2, fps: 4 },
      { file: 'tower_machine_gun_t0_base_build.png', tier: 0, layer: 'base', anim: 'build', frames: 6, fps: 10 },
      { file: 'tower_machine_gun_t0_base_destroy.png', tier: 0, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: 'tower_machine_gun_t0_head_idle.png', tier: 0, layer: 'head', anim: 'idle', frames: 2, fps: 3 },
      { file: 'tower_machine_gun_t0_head_fire.png', tier: 0, layer: 'head', anim: 'fire', frames: 4, fps: 24 },
      { file: 'tower_machine_gun_t1_base_upgrade.png', tier: 1, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 },
      { file: 'tower_machine_gun_t1_base_idle.png', tier: 1, layer: 'base', anim: 'idle', frames: 2, fps: 4 },
      { file: 'tower_machine_gun_t1_base_destroy.png', tier: 1, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: 'tower_machine_gun_t1_head_idle.png', tier: 1, layer: 'head', anim: 'idle', frames: 2, fps: 3 },
      { file: 'tower_machine_gun_t1_head_fire.png', tier: 1, layer: 'head', anim: 'fire', frames: 8, fps: 24 },
      { file: 'tower_machine_gun_t2_base_upgrade.png', tier: 2, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 },
      { file: 'tower_machine_gun_t2_base_idle.png', tier: 2, layer: 'base', anim: 'idle', frames: 2, fps: 4 },
      { file: 'tower_machine_gun_t2_base_destroy.png', tier: 2, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: 'tower_machine_gun_t2_head_idle.png', tier: 2, layer: 'head', anim: 'idle', frames: 2, fps: 3 },
      { file: 'tower_machine_gun_t2_head_fire_start.png', tier: 2, layer: 'head', anim: 'fire_start', frames: 6, fps: 12 },
      { file: 'tower_machine_gun_t2_head_fire_loop.png', tier: 2, layer: 'head', anim: 'fire_loop', frames: 4, fps: 24 },
    ],

    state(tier, anim, f) {
      if (anim === 'idle') return { lamp: f === 0, glint: f === 0, spin: f * (1 / 12), f };
      if (tier === 0) return { lamp: true, glint: true, rec: at([0, 2, 1, 0], f), fl: at([0, 1, .45, 0], f) };
      if (tier === 1) return { lamp: true, glint: true, recA: at([0, 2, 1.4, .6, 0, 0, 0, 0], f), recB: at([0, 0, 0, 0, 0, 2, 1.2, .4], f), flA: at([0, 1, .45, 0, 0, 0, 0, 0], f), flB: at([0, 0, 0, 0, 0, 1, .45, 0], f) };
      if (anim === 'fire_start') return { lamp: true, glint: true, spin: [0, .04, .12, .24, .4, .6][f] || 0, blur: f >= 3 ? (f - 2) * .25 : 0, shake: f >= 4 ? .5 : 0 };
      return { lamp: true, glint: true, spin: f / 6, blur: 1, rec: at([1, 3, 2, 1], f), fl: at([.6, 1.15, .7, 1], f), shake: f % 2 ? .6 : 0 };
    },

    base(c, tier, s) { body(c, tier, s || {}); },
    head(c, tier, s, dir) {
      // chunky guns: scale the head around its base contact
      const k = [1.4, 1.42, 1.38][tier];
      c.save(); c.translate(64, 68); c.scale(k, k); c.translate(-64, -68);
      [h0, h1, h2][tier](c, s || {}, G.dir(dir)); c.restore();
    },

    rubble(c, tier) {
      const gun = (x, y, r, l) => { c.save(); c.translate(x, y); c.rotate(r); c.fillStyle = '#2b2f42'; c.fillRect(-l / 2, -2.5, l, 5); c.fillStyle = '#6d7690'; c.fillRect(-l / 2, -2.5, l, 2); c.fillStyle = '#d9a441'; c.fillRect(-l / 2 - 3, -3, 5, 6); c.restore(); };
      const cols = [[['#7e7362', '#b9ac93'], ['#6b4224', '#a8713c']], [['#7e7362', '#b9ac93'], ['#3a4258', '#5d6a80'], ['#2e3c66', '#506a9c']], [['#2c3a62', '#4f6496'], ['#7e7362', '#b9ac93'], ['#93672a', '#d9a441']]][tier];
      A.heap(c, [30, 35, 41][tier], cols);
      gun(66, 76, .2, [20, 24, 30][tier]); if (tier >= 1) gun(56, 80, -.35, 18);
      if (tier === 2) { c.save(); c.translate(46, 82); c.rotate(-.5); c.fillStyle = '#d9a441'; c.fillRect(-9, -1.5, 18, 3); c.restore(); }
    },
  };

  /* ---------- octagon body helpers (flat front face, rot π/8) ---------- */
  const ROT = Math.PI / 8;
  const octPts = (cx, gy, r) => { const a = []; for (let i = 0; i < 9; i++) { const t = ROT + i * Math.PI / 4; a.push([cx + Math.cos(t) * r, gy + Math.sin(t) * r * G.K]); } return a; };
  const VIS = [0, 1, 2];                       // front-right, front, front-left faces
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  /** stone-block courses on the visible octagon faces */
  function courses(c, cx, gy, r, h, rows) {
    const T = G.tones(STONE), p = octPts(cx, gy, r);
    VIS.forEach(i => {
      const a = p[i], b = p[i + 1];
      for (let k = 1; k < rows; k++) G.wire(c, [[a[0] - .6, a[1] - h * k / rows], [b[0] + .6, b[1] - h * k / rows]], G.rgba(T.lo, .9), 1);
      for (let k = 0; k < rows; k++) (k % 2 ? [.5] : [.22, .78]).forEach(t => { const [x, y] = lerp(a, b, t); G.wire(c, [[x, y - h * k / rows - .6], [x, y - h * (k + 1) / rows + .6]], G.rgba(T.lo, .8), 1); });
    });
  }
  /** riveted steel band wrapped round the visible faces at height z above gy */
  function band(c, cx, gy, r, z, w, col) {
    const T = G.tones(col), p = octPts(cx, gy, r + .7);
    VIS.forEach(i => {
      const a = p[i], b = p[i + 1];
      G.poly(c, [[a[0], a[1] - z], [b[0], b[1] - z], [b[0], b[1] - z - w], [a[0], a[1] - z - w]], col, { mat: 'metal', w: 1.2 });
      G.wire(c, [[a[0] - .6, a[1] - z - w + .9], [b[0] + .6, b[1] - z - w + .9]], T.rim, 1);
      const q1 = lerp(a, b, .18), q2 = lerp(a, b, .82); G.rivets(c, q1[0], q1[1] - z - w / 2, q2[0], q2[1] - z - w / 2, 3);
    });
  }
  /** armour-plate seams with rivet columns on the visible faces */
  function seams(c, cx, gy, r, h) {
    const p = octPts(cx, gy, r);
    [1, 2].forEach(i => G.wire(c, [[p[i][0], p[i][1] - 1], [p[i][0], p[i][1] - h + 1]], G.rgba(PLATE.lo, .95), 1.3));
    [1, 2].forEach(i => { const ox = i === 1 ? -2.2 : 2.2; G.rivets(c, p[i][0] + ox, p[i][1] - 3, p[i][0] + ox, p[i][1] - h + 3, 3); });
    [0, 2].forEach(i => { const [x, y] = lerp(p[i], p[i + 1], .5); G.rivets(c, x, y - 3, x, y - h + 3, 3); });
  }
  /** crown pieces round the rim (merlons / spiked teeth); part 'back' | 'front' */
  function crown(c, cx, y, r, n, h, col, part, spike) {
    for (let i = 0; i < n; i++) {
      const a = Math.PI * 2 * (i + .5) / n - Math.PI, x = cx + Math.cos(a) * r, yy = y + Math.sin(a) * r * G.K;
      if ((Math.sin(a) < -.2) !== (part === 'back')) continue;
      G.boxC(c, x, yy + 2, 6.5, 5, h, col, { mat: col === STONE ? 'concrete' : 'metal' });
      if (spike) G.poly(c, [[x - 3.2, yy + .6 - h], [x + 2.2, yy + .6 - h], [x - .4, yy - h - 5.5]], P.steelLight, { mat: 'metal', w: 1.1 });
    }
  }
  /** 4 big armoured bastions on the rim (diagonals), each with a brass cap — clear crown for t2 */
  function bastions(c, cx, y, r, part) {
    [Math.PI * 1.25, Math.PI * 1.75, Math.PI * .25, Math.PI * .75].forEach(a => {
      const x = cx + Math.cos(a) * r, yy = y + Math.sin(a) * r * G.K;
      if ((Math.sin(a) < 0) !== (part === 'back')) return;
      G.boxC(c, x, yy + 3, 11, 8, 9, PLATE, { mat: 'metal' });
      G.boxC(c, x, yy - 6, 12.5, 9, 2.4, P.brass, { mat: 'metal' });
      G.rivets(c, x - 3.5, yy + 1, x + 3.5, yy + 1, 3);
    });
  }
  function shells(c, x, y, n) { for (let i = 0; i < n; i++) { const sx = x + (i % 3) * 3.6 + (i > 2 ? 1.8 : 0), sy = y - (i > 2 ? 2.6 : 0); G.ell(c, sx, sy, 1.6, 1.2, P.brass.mid, 1); G.ell(c, sx - .4, sy - .4, .6, .4, P.brass.hi, 0); } }

  /* ================= BASE: one pillbox, three tiers ================= */
  function body(c, t, s) {
    const cx = 64, { gy, R, H, rr, rh } = DIM[t];
    const wall = t === 2 ? PLATE : STONE, tm = t === 2 ? 'metal' : 'concrete';
    const lampOn = s.lamp !== false;
    G.ground(c, cx, gy, R + 12, { tufts: 2, pebbles: 7 });

    // t2 back props (behind the body): ammo hopper back-left, exhaust stack back-right
    if (t === 2) { // one clear back prop: brass ammo hopper back-left
      G.cyl(c, cx - R - 1, gy - 6, 8, 24, P.brass, { mat: 'metal', ribs: 6 });
      G.cyl(c, cx - R - 1, gy - 30, 9, 3, P.steel, { mat: 'metal' });
    }
    // plinth step
    G.prism(c, cx, gy, R + 4, 3, 8, wall, { rot: ROT, mat: tm, stripes: t === 2 });
    // octagon wall
    const wy = gy - 3;
    G.prism(c, cx, wy, R, H, 8, wall, { rot: ROT, mat: t === 2 ? 'paint' : 'concrete' });
    if (t < 2) courses(c, cx, wy, R, H, t === 0 ? 2 : 3); else seams(c, cx, wy, R, H);
    if (t >= 1) band(c, cx, wy, R, H * .3, 3.4, t === 2 ? P.brass : P.steel);
    // firing slit on the front face (dark → amber glow at t2)
    const fy = wy + R * G.K * .924 - H * .72, sw = R * .42;
    G.poly(c, [[cx - sw / 2 - 1.5, fy - 2.6], [cx + sw / 2 + 1.5, fy - 2.6], [cx + sw / 2 + 1.5, fy + 2.6], [cx - sw / 2 - 1.5, fy + 2.6]], t === 2 ? P.steelLight : P.concreteDark, { mat: 'metal', w: 1.1 });
    c.fillStyle = '#1e1630'; c.fillRect(cx - sw / 2, fy - 1.2, sw, 2.6);
    if (t === 2) { c.fillStyle = G.rgba(P.amber, lampOn ? .95 : .55); c.fillRect(cx - sw / 2 + 1, fy - .4, sw - 2, 1.2); if (lampOn) G.fx(c, o => G.halo(o, cx, fy, sw * .6, P.amber)); }
    // cornice
    const top = wy - H;
    G.prism(c, cx, top, R + 1.5, 3, 8, wall, { rot: ROT, mat: tm });
    const deck = top - 3;
    // recessed floor
    const fp = octPts(cx, deck, R - 4.5), fl = G.tones(wall);
    c.beginPath(); fp.slice(0, 8).forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath();
    const gf = c.createLinearGradient(0, deck - R * G.K, 0, deck + R * G.K); gf.addColorStop(0, fl.ao); gf.addColorStop(.5, fl.lo); gf.addColorStop(1, fl.mid); c.fillStyle = gf; c.fill(); G.stroke(c, 1.2);
    // crown (back half)
    if (t === 1) crown(c, cx, deck, R - .5, 8, 5, STONE, 'back');
    if (t === 2) bastions(c, cx, deck, R - 1, 'back');
    // brass belt feed from the hopper (t2)
    if (t === 2) G.hose(c, [[cx - R + 3, gy - 31], [cx - R + 12, gy - 33], [cx - rr - 1, deck - rh + 1]], 2.6, P.brass);
    // turret ring: steel → navy → navy gear ring
    G.cyl(c, cx, deck + 1, rr + 2, 1.5, P.gunmetal, { mat: 'metal' });
    G.cyl(c, cx, deck - .5, rr, rh - .5, t === 0 ? P.steel : NAVY, { mat: t === 0 ? 'metal' : 'paint', ribs: t === 2 ? 12 : 0 });
    if (t >= 1) G.rivets(c, cx - rr + 3, deck + 1, cx + rr - 3, deck + 1, t === 2 ? 6 : 4);
    // crown (front half)
    if (t === 1) crown(c, cx, deck, R - .5, 8, 5, STONE, 'front');
    if (t === 2) bastions(c, cx, deck, R - 1, 'front');

    // foot props: front-left ammo storage + amber lamp (motif), more per tier
    if (t === 0) {
      G.box(c, cx - R - 9, gy + 11, 14, 9, 8, P.wood, { mat: 'wood' }); shells(c, cx - R - 5, gy + 1, 3);
      G.bar(c, cx + R + 3, gy + 6, cx + R + 3, gy - 7, 1.6, P.steel); G.lamp(c, cx + R + 3, gy - 9, P.amber, lampOn, 2.4);
    } else {
      const lh = t === 2 ? 13 : 10;
      G.box(c, cx - R - 10, gy + 12, 15, 9, lh, NAVY, { mat: 'paint' });
      G.rivets(c, cx - R - 8, gy + 14 - lh, cx - R + 3, gy + 14 - lh, 4);
      if (t === 2) { c.beginPath(); c.rect(cx - R - 10, gy + 8, 15, 3); G.stripesInPath(c, cx - R - 10, gy + 8, cx - R + 5, gy + 11, 4); c.beginPath(); c.rect(cx - R - 10, gy + 8, 15, 3); G.stroke(c, 1); }
      G.lamp(c, cx - R - 2, gy + 12 - lh - 6, P.amber, lampOn, 2.6);
      shells(c, cx + R - 4, gy + 15, t === 2 ? 3 : 5);
      if (t === 1) { G.bar(c, cx + R + 4, gy + 6, cx + R + 4, gy - 9, 1.6, P.steel); G.lamp(c, cx + R + 4, gy - 11, P.amber, lampOn, 2.4); }
      if (t === 2) { G.bar(c, cx + R + 4, gy + 6, cx + R + 4, gy - 11, 1.8, P.steel); G.lamp(c, cx + R + 4, gy - 13, P.amber, lampOn, 2.6); }
    }
  }

  /* ================= HEADS (centred at 64,64; base contact at y≈68) ================= */
  // place a part along direction d: u = forward (world px), w = left (world px), z = height
  const pt = (d, u, w, z) => [64 + d.dx * u + d.dy * w, 68 + (d.dy * u - d.dx * w) * G.K - z];
  const scope = (c, d, on, h) => { const [x, y] = pt(d, -1, 0, h + 2); G.lamp(c, x, y, P.amber, on, 1.8); };

  function ammoBox(c, d, u, w, z, len, wid, h, col, belt) {
    const [x, y] = pt(d, u, w, z); G.obox(c, x, y, len, wid, h, d.th, col);
    if (belt) { const [bx, by] = pt(d, u + len / 2, w * .4, z + h * .6); G.hose(c, [[x, y - h * .8], [(x + bx) / 2, Math.min(y, by) - h - 1], [bx, by]], 1.8, P.brass); }
  }

  /* t0: single thin barrel with a short cooling jacket, open ammo box on the left */
  function h0(c, s, d) {
    const rec = s.rec || 0, back = d.dy < 0;
    const leftFirst = d.ly < 0;                       // left side further from camera → draw first
    const barrel = () => {
      const [x, y] = pt(d, 6 - rec, 0, 6);
      const L = 19 * d.fs + 2;
      const m = G.tube(c, x, y, d.ang, L, 2.1, P.steel, { muzzleRing: true });
      G.tube(c, x, y, d.ang, Math.min(9, L), 3.3, P.gunmetal, { open: false, wrap: [2, 3] });
      flash(c, m[0], m[1], d.ang, s.fl);
    };
    if (leftFirst) ammoBox(c, d, -1, 8, 2, 6, 5, 5, P.paintOlive, true);
    if (back) barrel();
    const [hx, hy] = pt(d, -7, 0, 3); G.obox(c, hx, hy, 7, 4, 4, d.th, P.wood, { mat: 'wood' });
    const [x, y] = pt(d, -rec * .5, 0, 0); G.obox(c, x, y, 12, 7, 7, d.th, NAVY, { mat: 'paint' });
    scope(c, d, s.glint !== false, 7);
    if (!back) barrel();
    if (!leftFirst) ammoBox(c, d, -1, 8, 2, 6, 5, 5, P.paintOlive, true);
  }

  /* t1: twin barrels behind a riveted navy gun shield; navy ammo box with brass belt on the left */
  function h1(c, s, d) {
    const back = d.dy < 0, leftFirst = d.ly < 0;
    const barrels = () => [[-2.8, s.recA || 0, s.flA], [2.8, s.recB || 0, s.flB]].forEach(([w, r, fl]) => {
      const [x, y] = pt(d, 7 - r, w, 7); const L = 22 * d.fs + 3;
      const m = G.tube(c, x, y, d.ang, L, 2.2, P.gunmetal, { bands: [3], band: P.steelLight, muzzleRing: true }); flash(c, m[0], m[1], d.ang, fl);
    });
    const shield = () => {
      const a = pt(d, 9, 11, 2), b = pt(d, 9, -11, 2), a2 = pt(d, 7, 10, 16), b2 = pt(d, 7, -10, 16);
      G.poly(c, [a, b, b2, [(a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2 - 2], a2], NAVY, { mat: 'paint' });
      G.rivets(c, a[0] + (b[0] - a[0]) * .15, a[1] - 3, a[0] + (b[0] - a[0]) * .85, b[1] - 3, 4);
      c.fillStyle = P.hazard; const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 8]; c.fillRect(mid[0] - 3, mid[1], 6, 2);
    };
    if (leftFirst) ammoBox(c, d, -2, 10, 2, 8, 6, 7, NAVY, true);
    if (back) { barrels(); shield(); }
    const [x, y] = pt(d, 0, 0, 0); G.obox(c, x, y, 15, 10, 8, d.th, NAVY, { mat: 'paint' });
    scope(c, d, s.glint !== false, 8);
    if (!back) { barrels(); shield(); }
    if (!leftFirst) ammoBox(c, d, -2, 10, 2, 8, 6, 7, NAVY, true);
  }

  /* t2: six-barrel rotary cluster in a gunmetal housing, clamp rings, long brass belt from the left,
   * hydraulic yoke under the housing */
  /* t2: classic rotary gun — fat rotor drum, a bundle of thin barrels held by a front clamp plate,
   * navy receiver with sloped side armour + top carry rail, round brass ammo drum on the LEFT feeding
   * a belt into the receiver. Barrels visibly rotate (spin) while firing. */
  function h2(c, s, d) {
    const back = d.dy < 0, leftFirst = d.ly < 0, rec = s.rec || 0, sh = s.shake || 0;
    const spin = s.spin || 0;
    const gun = () => {
      const [x, y] = pt(d, 6 - rec, 0, 7 + sh);
      // rotor drum
      const r0 = G.tube(c, x, y, d.ang, 6 * Math.max(.5, d.fs) + 2, 5, P.gunmetal, { bands: [1], band: P.brass, bandW: 2.2, open: false, cap: P.steel.mid });
      // barrel bundle: 3 visible lanes, positions cycle with the spin
      const Lb = 20 * d.fs + 6, px = -Math.sin(d.ang), py = Math.cos(d.ang);
      const lanes = [0, 1, 2].map(i => { const ph = ((i / 3 + spin) % 1) * Math.PI * 2; return { off: Math.sin(ph) * 3.2, depth: Math.cos(ph) }; }).sort((a, b) => a.depth - b.depth);
      let mid;
      lanes.forEach(({ off, depth }) => {
        const bx = r0[0] + px * off, by = r0[1] + py * off;
        const m = G.tube(c, bx, by, d.ang, Lb, 1.5, depth > 0 ? P.steelLight : P.steel, { muzzleRing: false });
        if (Math.abs(off) < 1.7 || !mid) mid = m;
      });
      // front clamp plate holding the bundle
      const cxp = r0[0] + Math.cos(d.ang) * Lb * .62, cyp = r0[1] + Math.sin(d.ang) * Lb * .62;
      c.save(); c.translate(cxp, cyp); c.rotate(d.ang); G.ell(c, 0, 0, 1.8, 5.2, P.steelLight.mid, G.INNER); c.restore();
      if (s.blur) G.fx(c, o => { o.save(); o.translate(r0[0], r0[1]); o.rotate(d.ang); o.fillStyle = G.rgba('#e3e9f2', .3 * s.blur); o.fillRect(2, -4.5, Lb * .9, 9); o.restore(); });
      const tip = [r0[0] + Math.cos(d.ang) * Lb, r0[1] + Math.sin(d.ang) * Lb];
      flash(c, tip[0], tip[1], d.ang, s.fl ? s.fl * 1.25 : 0);
    };
    // brass ammo drum on the gun's left side + belt into the receiver
    const drum = () => { const [ax, ay] = pt(d, -3, 10, 0); G.cyl(c, ax, ay, 4.8, 9, P.brass, { mat: 'metal', ribs: 6 }); const [rx, ry] = pt(d, -1, 4, 7); G.hose(c, [[ax, ay - 9], [(ax + rx) / 2, Math.min(ay - 11, ry - 3)], [rx, ry]], 2, P.brass); };
    // yoke
    const [yx, yy] = pt(d, 0, 0, 0); G.bar(c, yx - 4, yy, yx - 2, yy - 6, 3, P.steelLight); G.bar(c, yx + 4, yy, yx + 2, yy - 6, 3, P.steelLight);
    if (leftFirst) drum();
    if (back) gun();
    // receiver + sloped side armour + carry rail
    const [x, y] = pt(d, -2, 0, 2 + sh); G.obox(c, x, y, 14, 10, 9, d.th, NAVY, { mat: 'paint' });
    [1, -1].forEach(k => { const a = pt(d, -8, k * 5.5, 2 + sh), b = pt(d, 4, k * 5.5, 2 + sh), b2 = pt(d, 3, k * 7, 9 + sh), a2 = pt(d, -7, k * 7, 9 + sh); G.poly(c, [a, b, b2, a2], NAVY, { mat: 'paint', w: 1.2 }); });
    const r1 = pt(d, -6, 0, 13 + sh), r2 = pt(d, 3, 0, 13 + sh); G.bar(c, r1[0], r1[1], r2[0], r2[1], 1.8, P.steelLight);
    const [px, py] = pt(d, -2, 0, 11 + sh); G.rivets(c, px - 3, py + 1, px + 3, py + 1, 3);
    scope(c, d, s.glint !== false, 11 + sh);
    if (!back) gun();
    if (!leftFirst) drum();
  }

  TOWERS.machine_gun = TW;
})();
