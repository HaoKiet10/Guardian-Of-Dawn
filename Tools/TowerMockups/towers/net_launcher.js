/* PROTOTYPE - NOT FOR PRODUCTION
 * Net Launcher (Tháp phóng lưới) — v3, tier rule from the Kingdom Rush reference (2026-11-18).
 * Spec: design/assets/specs/net-launcher-assets.md (sheet list, family thread). 18 tower sheets.
 * ONE core body for all tiers: a square stone net-store tower on a wide square plinth, a front bay
 * showing the stored net bundles, turntable on the roof. Tier 0 is already a finished building.
 * Each tier: ~15% bigger, material ladder (stone → stone + riveted steel bands → steel armour with an
 * open I-beam bay you can see into), a new crown element (t0 corner caps → t1 parapet + net crate →
 * t2 corner I-beam posts + air bottles), more glow / props at the foot.
 * Family thread: square box launcher, square port(s), pitched up ~15° toward the target; lime #b9de3a
 * ONLY on the launcher; rope-brown net bundle visible in the port = loaded; rope reel back-left on the
 * Base growing per tier (hand coil → drum on a frame → motorised drum). Hazard yellow only on the Base.
 */
(function () {
  const P = G.P;
  const LIME = { hi: '#d9f07e', mid: '#b9de3a', lo: '#7f9e1e' };
  const ROPE = { hi: '#e2b676', mid: '#c08a4a', lo: '#8a5a2b' };
  const STONE = { hi: '#e2d8c3', mid: '#b9ac93', lo: '#7e7362' };
  const PLATE = { hi: '#9fb0c8', mid: '#62738f', lo: '#3a4660' };
  const PITCH = 15 * Math.PI / 180;
  const at = (arr, f) => arr[Math.min(f, arr.length - 1)];

  /* ---------- 3D cuboid for Head parts (same helper as flamethrower.js) ---------- */
  const VIEW = (() => { const n = Math.hypot(1, G.K); return [0, 1 / n, G.K / n]; })();
  const LIGHT = (() => { const v = [-.5, -.35, .8], n = Math.hypot(...v); return v.map(a => a / n); })();
  const pt = (d, u, w, z) => [64 + d.dx * u + d.dy * w, 68 + (d.dy * u - d.dx * w) * G.K - z];
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
  const quad = (c, q, fill, w) => { c.beginPath(); q.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fillStyle = fill; c.fill(); if (w !== 0) G.stroke(c, w || 1.2); };
  /** net bundle in a quad (rope brown, net mesh, tie); k<1 = still sliding in (smaller, deeper) */
  function bundleQ(c, q, k) {
    const m = [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2], s = .78 * (.55 + .45 * k);
    const r = q.map(([x, y]) => [m[0] + (x - m[0]) * s, m[1] + (y - m[1]) * s]);
    quad(c, r, k < 1 ? G.mix(ROPE.mid, '#2c2240', .35) : ROPE.mid, 1);
    c.save(); c.beginPath(); r.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.clip();
    const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    c.strokeStyle = ROPE.lo; c.lineWidth = .9;
    for (let i = 1; i < 4; i++) { const t = i / 4; let a = lerp(r[0], r[1], t), b = lerp(r[3], r[2], t); c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.stroke(); a = lerp(r[0], r[3], t); b = lerp(r[1], r[2], t); c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.stroke(); }
    c.fillStyle = G.rgba(ROPE.hi, .8); const h = lerp(r[3], r[2], .3); c.fillRect(h[0] - 1, h[1], 2, 1.2);
    c.restore();
  }
  /** flat bundle (Base: stored nets in the bay) */
  function bundle(c, x, y, w, h) {
    const q = [[x, y + h], [x + w, y + h], [x + w, y], [x, y]];
    G.poly(c, [[x + 1, y + h], [x + w - 1, y + h], [x + w, y + 2], [x + w - 2, y], [x + 2, y], [x, y + 2]], ROPE, { mat: 'cloth' });
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.strokeStyle = ROPE.lo; c.lineWidth = .9;
    for (let i = -h; i < w; i += 3) { c.beginPath(); c.moveTo(x + i, y + h); c.lineTo(x + i + h, y); c.stroke(); c.beginPath(); c.moveTo(x + i, y); c.lineTo(x + i + h, y + h); c.stroke(); }
    c.restore(); c.fillStyle = P.rope.lo; c.fillRect(x + w / 2 - .8, y, 1.6, h); return q;
  }
  function puff(c, x, y, k) { if (!k) return; for (let i = 0; i < 3; i++) G.puff(c, x + (i - 1) * 3 * k, Math.max(6, y - i * 2 * k), (2.2 + i * .8) * k, .9 - i * .15, '#eef0f2'); }

  /* ---------- base helpers (copied from mortar / fortifier v3) ---------- */
  function blockFace(c, x, gy, w, h, rows) {
    const T = G.tones(STONE);
    for (let i = 1; i < rows; i++) { const y = gy - h * i / rows; G.wire(c, [[x + 1, y], [x + w - 1, y]], G.rgba(T.lo, .9), 1); }
    for (let i = 0; i < rows; i++) for (let j = 1; j < 5; j++) { const xx = x + w * (j - (i % 2) * .5) / 4.5; if (xx <= x + 2 || xx >= x + w - 2) continue; G.wire(c, [[xx, gy - h * i / rows], [xx, gy - h * (i + 1) / rows]], G.rgba(T.lo, .8), 1); }
  }
  const strap = (c, x, y, w, h) => { const ST = G.tones(P.steel); c.fillStyle = ST.mid; c.fillRect(x, y, w, h); c.fillStyle = ST.rim; c.fillRect(x + .5, y + .5, w - 1, 1); c.strokeStyle = G.OUT; c.lineWidth = 1.2; c.strokeRect(x, y, w, h); };
  const ibeam = (c, x, y0, y1, w) => { const T = G.tones(PLATE); c.fillStyle = T.mid; c.fillRect(x - w / 2, y1, w, y0 - y1); c.fillStyle = T.lo; c.fillRect(x - .8, y1, 1.6, y0 - y1); c.fillStyle = T.rim; c.fillRect(x - w / 2 + .5, y1, 1, y0 - y1); c.strokeStyle = G.OUT; c.lineWidth = 1.2; c.strokeRect(x - w / 2, y1, w, y0 - y1); };

  const TW = {
    id: 'net_launcher', folder: 'NetLauncher', head: true,
    headPos: [],
    foot: [{ r: 34, h: 38 }, { r: 39, h: 54 }, { r: 45, h: 70 }],
    debrisCols: ['#b9ac93', '#b9de3a', '#c08a4a', '#62738f', '#5d6a80'],
    sheets: [],
    state(tier, anim, f, n) {
      if (anim === 'idle') return { lamp: tier === 2 && n === 4 ? f < 2 : f === 0, rot: f / 4, chain: f * 3, load: [1, 1], rack: 3 };
      if (anim === 'fire') {
        if (tier === 0) return { lamp: true, rec: at([0, 2, 1, 0], f), load: [at([1, 0], f)], puff: at([0, 1, .6, .3], f) };
        if (tier === 1) return { lamp: true, recA: at([0, 2, 1, .4, 0, 0, 0, 0], f), recB: at([0, 0, 0, 0, 0, 2, 1, 0], f), load: [at([1, 0], f), f < 5 ? 1 : 0], puffA: at([0, 1, .6, .3, 0], f), puffB: at([0, 0, 0, 0, 0, 1, .6, .3], f) };
        return { lamp: true, rec: at([0, 3, 2, 1, .5, 0], f), load: [at([1, 0], f)], puff: at([0, 1.25, .85, .5, .25, 0], f), rack: 3 };
      }
      // reload: frame 0 empty, last frame = idle F0
      if (tier === 0) return { lamp: true, load: [at([0, .35, .7, 1], f)], lever: at([0, 1, 1, 0], f) };
      if (tier === 1) return { lamp: true, load: [at([0, 0, .5, 1], f), at([0, 0, 0, 0, .5, 1], f)], lever: at([0, 1, 0, 1, 0, 0], f) };
      return { lamp: true, load: [at([0, 0, .3, .6, .85, 1], f)], ram: at([0, .5, 1, .7, .3, 0], f), rack: f >= 1 && f <= 3 ? 2 : 3 };
    },
    base(c, tier, s) { body(c, tier, s || {}); },
    head(c, tier, s, dir) {
      const k = [1.3, 1.38, 1.38][tier];
      c.save(); c.translate(64, 68); c.scale(k, k); c.translate(-64, -68);
      head(c, tier, s || {}, G.dir(dir)); c.restore();
    },
    rubble(c, tier) {
      const box = (x, y, r, s) => { c.save(); c.translate(x, y); c.rotate(r); c.fillStyle = LIME.lo; c.fillRect(-s, -s * .6, s * 2, s * 1.2); c.fillStyle = LIME.mid; c.fillRect(-s, -s * .6, s * 2, s * .5); c.fillStyle = '#2c2240'; c.fillRect(-s * .3, -s * .3, s * .6, s * .6); c.restore(); };
      const cols = [[['#7e7362', '#b9ac93'], ['#8a5a2b', '#c08a4a']], [['#7e7362', '#b9ac93'], ['#3a4258', '#5d6a80']], [['#3a4660', '#62738f'], ['#7e7362', '#b9ac93'], ['#8a5a2b', '#c08a4a']]][tier];
      A.heap(c, [31, 36, 42][tier], cols);
      c.fillStyle = ROPE.lo; c.beginPath(); c.ellipse(52, 80, 6, 3.5, 0, 0, 7); c.fill(); c.fillStyle = ROPE.mid; c.beginPath(); c.ellipse(52, 79, 4, 2.2, 0, 0, 7); c.fill();
      box(70, 78, .3, [6, 7, 8][tier]);
    },
  };
  // sheet list per spec (18 tower sheets)
  const HF = [[4, 12, 4, 8], [8, 16, 6, 10], [6, 12, 6, 10]];
  [0, 1, 2].forEach(t => {
    if (t === 0) TW.sheets.push({ file: 'tower_net_launcher_t0_base_idle.png', tier: 0, layer: 'base', anim: 'idle', frames: 2, fps: 2 }, { file: 'tower_net_launcher_t0_base_build.png', tier: 0, layer: 'base', anim: 'build', frames: 6, fps: 10 });
    else TW.sheets.push({ file: `tower_net_launcher_t${t}_base_upgrade.png`, tier: t, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 }, { file: `tower_net_launcher_t${t}_base_idle.png`, tier: t, layer: 'base', anim: 'idle', frames: t === 2 ? 4 : 2, fps: t === 2 ? 6 : 2 });
    TW.sheets.push({ file: `tower_net_launcher_t${t}_base_destroy.png`, tier: t, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: `tower_net_launcher_t${t}_head_idle.png`, tier: t, layer: 'head', anim: 'idle', frames: 2, fps: 2 },
      { file: `tower_net_launcher_t${t}_head_fire.png`, tier: t, layer: 'head', anim: 'fire', frames: HF[t][0], fps: HF[t][1] },
      { file: `tower_net_launcher_t${t}_head_reload.png`, tier: t, layer: 'head', anim: 'reload', frames: HF[t][2], fps: HF[t][3] });
  });

  /* ================= BASE: one body for all tiers ================= */
  const GEO = t => {
    const cx = 64, gy = 82, W = [38, 44, 50][t], D = [28, 32, 36][t], H = [12, 19, 23][t];
    const sk = Math.min(5, D * .35), fx = cx - W / 2 - sk / 2, fy = gy + D * G.K / 2 - 2;
    const roofY = fy - H, backY = roofY - D * G.K, rcy = roofY - D * G.K / 2;
    return { cx, gy, W, D, H, sk, fx, fy, roofY, backY, rcy };
  };
  [0, 1, 2].forEach(t => { const g = GEO(t); TW.headPos[t] = [64, Math.round(g.rcy + 2 - 3 - 4)]; });

  /** rope reel, back-left (family motif): coil → drum on an A-frame → motorised drum */
  function reel(c, t, x, y, rot) {
    if (t === 0) { for (let i = 0; i < 4; i++) { G.ell(c, x, y - i * 2.2, 7 - i * .3, 4 - i * .2, i % 2 ? ROPE.mid : ROPE.hi, 1.1); } G.ell(c, x, y - 7.5, 3, 1.6, ROPE.lo, 1); return; }
    const r = t === 1 ? 6.5 : 8, len = t === 1 ? 12 : 14, cy = y - r - (t === 1 ? 5 : 6);
    G.bar(c, x - len / 2 - 1, y, x - len / 2 + 1, cy, 2.4, t === 1 ? P.woodDark : PLATE); G.bar(c, x + len / 2 + 1, y, x + len / 2 - 1, cy, 2.4, t === 1 ? P.woodDark : PLATE);
    G.hcyl(c, x, cy, len, r, ROPE, { mat: 'cloth', capRight: false });
    for (let i = 1; i < 5; i++) G.wire(c, [[x - len / 2 + i * len / 5, cy - r + 1], [x - len / 2 + i * len / 5 - 1, cy + r - 1]], ROPE.lo, .9);
    G.ell(c, x + len / 2, cy, r * .5, r + 1.5, G.tones(P.steel).mid, G.INNER);
    for (let i = 0; i < 3; i++) { const a = (rot || 0) * Math.PI * 2 + i * Math.PI * 2 / 3; G.wire(c, [[x + len / 2, cy], [x + len / 2 + Math.cos(a) * r * .45, cy + Math.sin(a) * (r + 1)]], G.OUT, 1.2); }
    G.ell(c, x + len / 2, cy, 1.2, 1.6, P.brass.mid, 1);
    if (t === 2) { G.box(c, x - len / 2 - 9, y + 3, 8, 7, 9, P.paintRust); G.lamp(c, x - len / 2 - 5, y - 4, P.amber, true, 1.6); }
  }

  function body(c, t, s) {
    const { cx, gy, W, D, H, sk, fx, fy, roofY, backY, rcy } = GEO(t);
    const mat = t === 2 ? PLATE : STONE;
    G.ground(c, cx, gy, W / 2 + 15, { tufts: 2, pebbles: 7 });
    // wide square plinth (hazard edge from t1 — yellow lives only on the Base)
    G.boxC(c, cx, gy + 1, W + 22, D + 14, 3, t === 2 ? PLATE : { hi: '#c9bea8', mid: '#9c907a', lo: '#6a6052' }, { mat: t === 2 ? 'metal' : 'concrete', stripes: t >= 1, stripeStep: 6 });
    // rope reel back-left (behind the block)
    reel(c, t, fx - 2, backY + 14 + t, s.rot);
    // t1 net crate back-right
    if (t === 1) { G.box(c, fx + W - 2, backY + 16, 12, 8, 9, P.wood, { mat: 'wood' }); bundle(c, fx + W, backY + 3, 8, 4); }
    // tower block
    G.box(c, fx, fy, W, D, H, mat, { mat: t === 2 ? 'paint' : 'concrete' });
    if (t < 2) blockFace(c, fx, fy, W, H, t === 0 ? 3 : 4);
    if (t >= 1) { strap(c, fx, roofY, W, 3.5); G.rivets(c, fx + 4, roofY + 2.2, fx + W - 4, roofY + 2.2, 8); [fx, fx + W - 4].forEach(x => strap(c, x, roofY, 4, H)); }
    // front bay with the stored nets
    const bw = [15, 19, W - 12][t], bh = [9, 12, H - 7][t], bx = cx - sk / 2 - bw / 2, by = fy - 1;
    c.beginPath(); c.rect(bx, by - bh, bw, bh); c.fillStyle = '#2a2236'; c.fill(); G.stroke(c);
    c.fillStyle = 'rgba(255,159,28,.18)'; c.fillRect(bx + 1, by - bh + 1, bw - 2, 3);
    if (t === 0) { G.plank(c, bx - 1, by - 3, bw + 2, 3, P.wood); bundle(c, bx + 3, by - 9, 9, 6); G.plank(c, bx - 2, by - bh - 3, bw + 4, 3, P.woodDark); }
    if (t === 1) { bundle(c, bx + 2, by - 7, 7, 6); bundle(c, bx + 10, by - 7, 7, 6); bundle(c, bx + 6, by - 12, 7, 5); strap(c, bx - 2, by - bh - 3, bw + 4, 3.5); G.rivets(c, bx + 1, by - bh - 1.3, bx + bw - 1, by - bh - 1.3, 5); }
    if (t === 2) {
      // open I-beam bay: see into the frame, chain hoist lifting bundles
      c.fillStyle = '#3b3350'; c.fillRect(bx + 1, by - bh + 1, bw - 2, bh - 2);
      G.wire(c, [[bx + 2, by - 2], [bx + bw - 2, by - bh + 2]], G.tones(PLATE).lo, 2.2);
      const ch = s.chain || 0, chx = cx - sk / 2;
      for (let y = by - bh + 1 + (ch % 3); y < by - 1; y += 3) { c.fillStyle = '#8b97a9'; c.fillRect(chx - 1, y, 2, 2); }
      bundle(c, chx - 5, by - 9 - (ch % 6), 10, 6); bundle(c, chx - 5, by - 19 - (ch % 6), 10, 6);
      [bx, bx + bw / 2 - sk / 4 - 6, bx + bw / 2 + 6, bx + bw].forEach((x, i) => { if (i === 0 || i === 3) ibeam(c, x, by, by - bh - 1, 4); });
      strap(c, bx - 2, by - bh - 3, bw + 4, 4); G.rivets(c, bx + 1, by - bh - 1, bx + bw - 1, by - bh - 1, 6);
      for (let i = 0; i < 2; i++) { const x = i ? fx + W - 5 : fx + 1; G.rivets(c, x + 2, fy - 4, x + 2, roofY + 6, 3); }
    }
    // turntable
    G.cyl(c, cx, rcy + 2, [9, 10.5, 12][t], 3, t === 0 ? STONE : P.gunmetal, { mat: t === 0 ? 'concrete' : 'metal', ribs: t === 0 ? 0 : 10 });
    // crown: t0 four stone corner caps · t1 stone parapet with steel caps · t2 corner I-beam posts + lamp
    const corners = [[fx + 2 + sk, backY + 3], [fx + W - 5 + sk, backY + 3], [fx + 1, roofY + 1], [fx + W - 6, roofY + 1]];
    if (t === 0) corners.forEach(([x, y]) => G.box(c, x, y, 5, 4, 4, STONE, { mat: 'concrete' }));
    if (t === 1) { corners.forEach(([x, y]) => { G.box(c, x - .5, y, 6, 4, 6, STONE, { mat: 'concrete' }); strap(c, x - 1, y - 7.5, 7, 2); }); }
    if (t === 2) {
      corners.forEach(([x, y], i) => { ibeam(c, x + 2.5, y, y - (i < 2 ? 16 : 10), 4.4); strap(c, x - .5, y - (i < 2 ? 17.5 : 11.5), 6, 2.5); });
      G.wire(c, [[corners[0][0] + 2.5, corners[0][1] - 15], [corners[1][0] + 2.5, corners[1][1] - 15]], G.OUT, 2);
      G.lamp(c, corners[0][0] + 2.5, corners[0][1] - 20, P.amber, s.lamp !== false, 2.3);
    }
    // foot props front-left: amber work lamp + spare bundles; t2 air bottles right with pipe
    const lx = fx - 6;
    G.bar(c, lx, gy + 9, lx, gy - 5, 1.6, P.steel); G.lamp(c, lx, gy - 7, P.amber, t === 2 ? true : s.lamp !== false, 2.4);
    bundle(c, lx + 2, gy + 4, 9, 6);
    if (t >= 1) bundle(c, fx + W + sk - 4, gy + 8, 9, 6);
    if (t === 2) {
      G.hose(c, [[fx + W + sk - 1, roofY + 4], [fx + W + sk + 3, roofY + 8], [fx + W + sk + 4, gy - 8]], 1.8, P.copper);
      G.cyl(c, fx + W + sk + 5, gy - 2, 3.4, 14, P.paintTeal, { mat: 'paint' }); G.cyl(c, fx + W + sk + 12, gy + 1, 3.4, 12, P.paintTeal, { mat: 'paint' });
    }
  }

  /* ================= HEAD: square lime box launcher on a U-fork, pitched up 15° ================= */
  function head(c, t, s, d) {
    const L = [13, 13, 15][t], Wd = [13, 20, 21][t], H = [11, 11, 13][t], zt = [8.5, 9, 9.5][t];
    const nearL = d.dx < 0; // +w (left) side faces the camera only when aiming west (never in our rows)
    G.cyl(c, 64, 68, [7, 8, 9][t], 2.5, P.gunmetal, { mat: 'metal' });
    // U-fork plates either side of the box (steel, never lime)
    const fork = sd => { const w = sd * (Wd / 2 + 1.2); const q = [pt(d, -3.5, w, 2), pt(d, 3.5, w, 2), pt(d, 1.6, w, zt), pt(d, -1.6, w, zt)]; G.poly(c, q, t === 2 ? PLATE : P.steel, { mat: 'metal' }); const m = pt(d, 0, w, zt); G.ell(c, m[0], m[1], 1.8, 1.8, G.tones(P.steel).hi, 1.1); };
    const rec = s.rec || 0;
    const back = d.dy < -.1;
    // items behind the box
    fork(nearL ? -1 : 1);
    if (t === 1 && !back) { const a = pt(d, -L / 2 - 1, 0, 3.5); G.tube(c, a[0], a[1], d.ang, L * d.fs + 2, 2.6, P.steelLight, { open: false }); }
    const boxO = { u: -rec, w: 0, z: zt - H / 2, L, W: Wd, H, p: PITCH, pu: -rec, pz: zt };
    const B = cub(c, d, boxO, LIME, { mat: 'paint' });
    // ports on the front face
    const ports = t === 1 ? [[-Wd / 4 - .3, 6.5], [Wd / 4 + .3, 6.5]] : [[0, t === 2 ? 10 : 7.5]];
    const loads = s.load || [1, 1];
    if (B.vis.front) ports.forEach(([b, ps], i) => {
      const r = t === 1 ? [s.recA || 0, s.recB || 0][i] : 0, h0 = H / 2 - ps / 2;
      const q = [B.P(L / 2, b - ps / 2, h0), B.P(L / 2, b + ps / 2, h0), B.P(L / 2, b + ps / 2, h0 + ps), B.P(L / 2, b - ps / 2, h0 + ps)];
      quad(c, q, '#241c33', 1.2);
      const k = loads[i] == null ? 1 : loads[i]; if (k > 0) bundleQ(c, q, k);
      // steel lip
      c.beginPath(); q.forEach(([x, y], j) => j ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.strokeStyle = G.tones(P.steel).hi; c.lineWidth = .8; c.stroke();
    });
    // back face: when aiming away show a hatch (no ports)
    if (B.vis.back) { const q = [B.P(-L / 2, -Wd / 4, H * .3), B.P(-L / 2, Wd / 4, H * .3), B.P(-L / 2, Wd / 4, H * .75), B.P(-L / 2, -Wd / 4, H * .75)]; quad(c, q, G.tones(P.steel).mid, 1.1); }
    // rope lashing band (t0) / riveted steel bands (t1, t2) around the box — the band is steel, the paint stays lime
    const bandAt = (a, col, w) => { const q = [B.P(a, -Wd / 2, 0), B.P(a, -Wd / 2, H), B.P(a, Wd / 2, H)]; G.wire(c, q, G.OUT, w + 2); G.wire(c, q, col, w); };
    if (t === 0) { bandAt(-L * .2, ROPE.mid, 1.8); }
    else { bandAt(-L * .3, G.tones(P.steel).mid, 1.6); const a = B.P(-L * .3, -Wd / 2, H * .3), b = B.P(-L * .3, -Wd / 2, H * .8); G.rivets(c, a[0], a[1], b[0], b[1], 2); }
    // on top of the box
    if (t === 0) { // net sack lashed on the lid
      const q = [B.P(-L * .35, -Wd * .3, H), B.P(L * .15, -Wd * .3, H), B.P(L * .15, Wd * .3, H), B.P(-L * .35, Wd * .3, H)];
      const m = q.map(([x, y]) => [x, y - 2.5]); quad(c, [q[0], q[1], m[1], m[0]], ROPE.lo, 1); quad(c, m, ROPE.mid, 1); bundleQ(c, m, 1);
    }
    if (t === 1) { // hopper + lever
      cub(c, d, { u: -2.5 - rec, w: 0, z: zt + H / 2, L: 6, W: 8, H: 3, p: PITCH, pu: -rec, pz: zt }, P.steel, { mat: 'metal' });
      const a = B.P(-L / 2 + 1, -Wd / 2 + 2, H + 1), lv = s.lever ? -5 : 0, b = [a[0] - 3, a[1] - 7 - lv * .3]; G.bar(c, a[0], a[1], b[0] + (s.lever ? 3 : 0), b[1] + (s.lever ? 4 : 0), 1.6, P.steelLight); G.ell(c, b[0] + (s.lever ? 3 : 0), b[1] + (s.lever ? 4 : 0), 1.6, 1.6, '#e2412f', 1);
    }
    if (t === 2) { // open rack of net bundles + hydraulic ram
      const n = s.rack == null ? 3 : s.rack;
      for (let i = 0; i < n; i++) { const o = { u: -1.5 - rec, w: 0, z: zt + H / 2 + i * 2.6, L: 7, W: 9, H: 2.6, p: PITCH, pu: -rec, pz: zt }; const R = cub(c, d, o, ROPE, { mat: 'cloth', top: ROPE.hi }); const a = R.P(-3.5, -4.5, 2.6), b = R.P(3.5, 4.5, 2.6); G.wire(c, [a, b], ROPE.lo, .9); }
      [-1, 1].forEach(sd => { const a = B.P(-L / 2 + 1, sd * 5.5, H), b = B.P(-L / 2 + 1, sd * 5.5, H + 6.5); G.bar(c, a[0], a[1], b[0], b[1], 1.6, PLATE); });
      const a = B.P(-L / 2 + 1, -5.5, H + 6.5), b = B.P(-L / 2 + 1, 5.5, H + 6.5); G.bar(c, a[0], a[1], b[0], b[1], 1.6, PLATE);
      const ram = s.ram || 0, r0 = B.P(-L / 2 + 1, 0, H + 8), r1 = B.P(-L / 2 + 1, 0, H + 6.5 - ram * 2); G.bar(c, r0[0], r0[1], r1[0], r1[1], 2.4, P.steelLight);
    }
    // near-side parts
    if (t === 0) { const a = pt(d, -2 - rec, -(Wd / 2 + 3.5), 2); G.cyl(c, a[0], a[1], 2.2, 8, P.steelLight, { mat: 'metal' }); G.wire(c, [[a[0] - 2.5, a[1] - 5], [a[0] + 2.5, a[1] - 5]], ROPE.mid, 1.4); }
    if (t === 1 && back) { const a = pt(d, -L / 2 - 1, 0, 3.5); G.tube(c, a[0], a[1], d.ang, L * d.fs + 2, 2.6, P.steelLight, { open: false }); }
    if (t === 1) { const g = pt(d, -3, -(Wd / 2 + 1), 3); G.gauge(c, g[0], g[1], 1.8, .6); }
    if (t === 2) [-1, 1].forEach(sd => { if (sd !== (nearL ? -1 : 1)) return; const a = pt(d, -5, sd * (Wd / 2 + 2), 2), b = pt(d, 3 - rec, sd * (Wd / 2 + 1.5), zt + 2); G.bar(c, a[0], a[1], b[0], b[1], 3, P.steelLight); G.bar(c, a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 3.6, PLATE); });
    fork(nearL ? 1 : -1);
    if (t === 2) { const a = pt(d, -5, -(Wd / 2 + 2), 2), b = pt(d, 3 - rec, -(Wd / 2 + 1.5), zt + 2); G.bar(c, a[0], a[1], b[0], b[1], 3, P.steelLight); G.bar(c, a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 3.6, PLATE); }
    // compressed-air puff at the port(s) (fx layer)
    const mz = (b) => B.P(L / 2 + 3, b, H / 2);
    if (t === 1) { if (s.puffA) puff(c, ...mz(-Wd / 4), s.puffA); if (s.puffB) puff(c, ...mz(Wd / 4), s.puffB); }
    else if (s.puff) puff(c, ...mz(0), s.puff);
  }

  TOWERS.net_launcher = TW;
})();
