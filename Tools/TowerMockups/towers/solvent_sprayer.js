/* PROTOTYPE - NOT FOR PRODUCTION
 * Solvent Sprayer (Tháp phun dung môi) — v3, tier rule from the user's Kingdom Rush reference
 * (2026-11-18). Spec: design/assets/specs/solvent-sprayer-assets.md
 * ONE core body for all tiers: an octagonal plinth carrying a big BULGING chemical tank at the
 * back-left (drawn as a faceted octagonal solid — 45° bevels, no round curves), a 45°-jointed pipe
 * to a swivel at the front-right where the Head (pump + slim jointed nozzle, mouth ~30° up) sits.
 * Tier ladder: stone → stone + riveted steel bands → steel armour; new crown per tier (t1 vent stack
 * with 45° elbow + valve wheel, t2 raised tank with a railed catwalk and twin vent stacks); more
 * glow / props per tier. Family: acid-green solvent seen through a vertical sight glass, yellow
 * diamond hazard label next to it, bottle-green tank shell. No teal, no white, no orange.
 */
(function () {
  const P = G.P;
  const STONE = { hi: '#e2d8c3', mid: '#b9ac93', lo: '#7e7362' };
  const PLATE = { hi: '#9fb0c8', mid: '#62738f', lo: '#3a4660' };
  const BOTTLE = { hi: '#7cc47a', mid: '#4a9a52', lo: '#2f6b3a' };
  const ACID = { hi: '#d4ff9a', mid: '#a6ff4d', lo: '#5fa82a' };
  const at = (arr, f) => arr[Math.min(f, arr.length - 1)];
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const LIGHT = [-.55, .45, .7];

  /* ---------- faceted octagonal solid (the "bulging" tank, caps, swivels) ----------
   * rings = [[halfWidth, height], ...] bottom → top; convex profile, back faces culled. */
  function lathe(c, cx, by, rings, col, opt) {
    opt = opt || {}; const T = G.tones(col), n = 8, rot = opt.rot || 0;
    const V = (w, z, a) => [cx + Math.cos(a) * w, by - z + Math.sin(a) * w * G.K];
    for (let i = 0; i < rings.length - 1; i++) {
      const [w0, z0] = rings[i], [w1, z1] = rings[i + 1];
      const nr = z1 - z0, nu = -(w1 - w0), nl = Math.hypot(nr, nu) || 1;
      for (let k = 0; k < n; k++) {
        const a0 = rot + k * Math.PI * 2 / n, a1 = a0 + Math.PI * 2 / n, am = (a0 + a1) / 2;
        const q = [V(w0, z0, a0), V(w0, z0, a1), V(w1, z1, a1), V(w1, z1, a0)];
        let ar = 0; for (let j = 0; j < 4; j++) { const p = q[j], r = q[(j + 1) % 4]; ar += p[0] * r[1] - r[0] * p[1]; }
        if (ar <= .05) continue;
        const b = (Math.cos(am) * nr / nl) * LIGHT[0] + (Math.sin(am) * nr / nl) * LIGHT[1] + (nu / nl) * LIGHT[2];
        const fill = b > .35 ? G.mix(T.mid, T.hi, Math.min(1, (b - .35) * 2.2)) : G.mix(T.mid, T.lo, Math.min(1, (.35 - b) * 1.7));
        const path = () => { c.beginPath(); q.forEach(([x, y], j) => j ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); };
        path(); c.fillStyle = fill; c.fill();
        const xs = q.map(p => p[0]), ys = q.map(p => p[1]);
        path(); G.texture(c, [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs) + 1, Math.max(...ys) - Math.min(...ys) + 1], T, opt.mat || 'paint', .6);
        path(); G.stroke(c, 1.1);
      }
    }
    if (opt.cap !== false) {
      const [w, z] = rings[rings.length - 1];
      const pts = []; for (let k = 0; k < n; k++) pts.push(V(w, z, rot + k * Math.PI * 2 / n));
      c.beginPath(); pts.forEach(([x, y], j) => j ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath();
      const g = c.createLinearGradient(cx - w, by - z - w * G.K, cx + w, by - z + w * G.K); g.addColorStop(0, G.mix(opt.top || T.hi, '#ffffff', .15)); g.addColorStop(1, G.mix(opt.top || T.hi, T.mid, .5));
      c.fillStyle = g; c.fill(); G.stroke(c, 1.1);
    }
    return V;
  }
  /** Point on a front belly face k (0..3, a = kπ/4 .. (k+1)π/4) at fraction fu, height z. */
  const face = (V, w, k, fu, z) => lerp(V(w, z, k * Math.PI / 4), V(w, z, (k + 1) * Math.PI / 4), fu);
  /** riveted steel band around the front of an octagonal solid (radius w, heights z..z+bw) */
  function oband(c, V, w, z, bw, col) {
    const T = G.tones(col || P.steel);
    for (let k = 0; k < 4; k++) {
      const q = [face(V, w, k, 0, z), face(V, w, k, 1, z), face(V, w, k, 1, z + bw), face(V, w, k, 0, z + bw)];
      c.beginPath(); q.forEach(([x, y], j) => j ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath();
      c.fillStyle = k >= 2 ? T.hi : k === 1 ? T.mid : T.lo; c.fill(); G.stroke(c, 1);
      const m = face(V, w, k, .5, z + bw / 2); G.rivets(c, m[0], m[1], m[0], m[1], 1);
    }
  }

  /* ---------- plinth helpers (octagon, flat face to the front) ---------- */
  const ROT8 = Math.PI / 8;
  const octV = (cx, gy, r, a) => [cx + Math.cos(a) * r, gy + Math.sin(a) * r * G.K];
  function prismCourses(c, cx, gy, r, h, rows) {
    const T = G.tones(STONE);
    for (let k = 0; k < 8; k++) {
      const a0 = ROT8 + k * Math.PI / 4, a1 = a0 + Math.PI / 4; if (Math.sin((a0 + a1) / 2) < .2) continue;
      const p = octV(cx, gy, r, a0), q = octV(cx, gy, r, a1);
      for (let i = 1; i < rows; i++) G.wire(c, [[p[0], p[1] - h * i / rows], [q[0], q[1] - h * i / rows]], G.rgba(T.lo, .9), 1);
      for (let i = 0; i < rows; i++) { const f = i % 2 ? .3 : .65; const m = lerp(p, q, f); G.wire(c, [[m[0], m[1] - h * i / rows - .5], [m[0], m[1] - h * (i + 1) / rows + .5]], G.rgba(T.lo, .8), 1); }
    }
  }
  function prismBand(c, cx, y, r, bw, col) {
    const T = G.tones(col || P.steel);
    for (let k = 0; k < 8; k++) {
      const a0 = ROT8 + k * Math.PI / 4, a1 = a0 + Math.PI / 4; if (Math.sin((a0 + a1) / 2) < .2) continue;
      const p = octV(cx, y, r + .6, a0), q = octV(cx, y, r + .6, a1);
      c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.lineTo(q[0], q[1] + bw); c.lineTo(p[0], p[1] + bw); c.closePath();
      c.fillStyle = Math.cos((a0 + a1) / 2) < -.3 ? T.hi : Math.cos((a0 + a1) / 2) > .3 ? T.lo : T.mid; c.fill(); G.stroke(c, 1);
      const m = lerp(p, q, .5); G.rivets(c, p[0] + (q[0] - p[0]) * .2, p[1] + (q[1] - p[1]) * .2 + bw / 2, q[0] - (q[0] - p[0]) * .2, q[1] - (q[1] - p[1]) * .2 + bw / 2, 2);
    }
  }
  /** steel pipe as straight segments with 45° joints and flanges */
  function pipe(c, pts, w, col) {
    for (let i = 0; i < pts.length - 1; i++) G.bar(c, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], w, col || P.steelLight);
    for (let i = 1; i < pts.length - 1; i++) G.ell(c, pts[i][0], pts[i][1], w * .75, w * .75, G.tones(col || P.steelLight).hi, 1.1);
  }
  function diamond(c, x, y, s) {
    c.beginPath(); c.moveTo(x, y - s); c.lineTo(x + s * .85, y); c.lineTo(x, y + s); c.lineTo(x - s * .85, y); c.closePath();
    c.fillStyle = P.hazard; c.fill(); G.stroke(c, 1.2);
    c.beginPath(); c.moveTo(x, y - s * .45); c.lineTo(x + s * .28, y + s * .15); c.lineTo(x, y + s * .38); c.lineTo(x - s * .28, y + s * .15); c.closePath(); c.fillStyle = '#3a2f50'; c.fill();
  }
  /** small faceted solvent canister (props) */
  function canister(c, x, gy, r, h, lit) {
    const V = lathe(c, x, gy, [[r * .7, 0], [r, r * .3], [r, h - r * .3], [r * .6, h]], BOTTLE);
    const g0 = face(V, r, 2, .25, 2), g1 = face(V, r, 2, .75, h - 3);
    c.fillStyle = lit ? ACID.mid : ACID.lo; c.fillRect(Math.min(g0[0], g1[0]), g1[1], 1.6, g0[1] - g1[1]);
    G.ell(c, x, gy - h - .5, r * .3, r * .3 * G.K, P.steel.mid, 1);
  }

  /* ---------- the tank (family thread) ---------- */
  function sightGlass(c, V, r, z0, z1, s, t) {
    const q = [face(V, r + .3, 2, .25, z0), face(V, r + .3, 2, .75, z0), face(V, r + .3, 2, .75, z1), face(V, r + .3, 2, .25, z1)];
    const path = (qq) => { c.beginPath(); qq.forEach(([x, y], j) => j ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); };
    // steel frame
    const fr = [face(V, r + .3, 2, .15, z0 - 1.5), face(V, r + .3, 2, .85, z0 - 1.5), face(V, r + .3, 2, .85, z1 + 1.5), face(V, r + .3, 2, .15, z1 + 1.5)];
    path(fr); c.fillStyle = G.tones(P.steel).mid; c.fill(); G.stroke(c, 1.1);
    path(q); c.fillStyle = '#1f3326'; c.fill();
    const lv = z0 + (z1 - z0) * .78;
    const qa = [q[0], q[1], face(V, r + .3, 2, .75, lv), face(V, r + .3, 2, .25, lv)];
    path(qa); const g = c.createLinearGradient(qa[0][0], 0, qa[1][0], 0); g.addColorStop(0, ACID.hi); g.addColorStop(.5, ACID.mid); g.addColorStop(1, ACID.lo); c.fillStyle = g; c.fill();
    G.wire(c, [qa[3], qa[2]], ACID.hi, 1);
    // rising bubbles
    for (let i = 0; i < 3; i++) { const fz = ((i * .37 + (s.bub || 0) * .25) % 1), p = face(V, r + .3, 2, .35 + (i % 2) * .3, z0 + 1 + fz * (lv - z0 - 2)); G.ell(c, p[0], p[1], .9, .9, ACID.hi, 0); }
    path(q); G.stroke(c, 1.1);
    const m = face(V, r, 2, .5, (z0 + lv) / 2);
    G.fx(c, o => G.halo(o, m[0], m[1], 5 + t * 1.5, ACID.mid));
  }

  function tank(c, t, cx, by, r, h, s, mid) {
    const b = r * .38;
    const col = BOTTLE;
    let V;
    if (mid) { // split around the catwalk (t2): lower part, catwalk, upper part
      V = lathe(c, cx, by, [[r - b, 0], [r, b], [r, mid.z]], col, { cap: false });
      mid.fn(V);
      lathe(c, cx, by, [[r, mid.z], [r, h - b], [r - b, h]], col, { top: BOTTLE.hi });
    } else V = lathe(c, cx, by, [[r - b, 0], [r, b], [r, h - b], [r - b, h]], col, { top: BOTTLE.hi });
    // material ladder on the tank
    if (t >= 1) { oband(c, V, r + .2, b + 1, 3, P.steel); oband(c, V, r + .2, h - b - 4, 3, P.steel); }
    if (t === 2) {
      for (let k = 1; k < 4; k++) { const p = V(r, b + 5, k * Math.PI / 4), q = V(r, h - b - 6, k * Math.PI / 4); G.rivets(c, p[0], p[1], q[0], q[1], 4); }
      oband(c, V, r - b * .5 + .2, b * .25, 2.4, PLATE);
    }
    // sight glass (front-left facet) + hazard diamond (front-right facet)
    sightGlass(c, V, r, b + 2.5, h - b - (t >= 1 ? 6 : 2.5), s, t);
    const lb = face(V, r, 1, .5, (h) * .5); diamond(c, lb[0], lb[1], [3.6, 4, 4.4][t]);
    // filler cap
    const cap = V(0, h, 0); lathe(c, cap[0], cap[1], [[3, 0], [3, 1.6], [2, 2.6]], P.steel, { mat: 'metal' });
    return V;
  }

  const TW = {
    id: 'solvent_sprayer', folder: 'SolventSprayer', head: true,
    headPos: [[73, 81], [74, 80], [75, 76]],
    foot: [{ r: 34, h: 38 }, { r: 40, h: 52 }, { r: 46, h: 64 }],
    debrisCols: ['#b9ac93', '#4a9a52', '#62738f', '#2f6b3a', '#5d6a80'],
    sheets: [
      { file: 'tower_solvent_sprayer_t0_base_idle.png', tier: 0, layer: 'base', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_solvent_sprayer_t0_base_build.png', tier: 0, layer: 'base', anim: 'build', frames: 6, fps: 10 },
      { file: 'tower_solvent_sprayer_t0_base_destroy.png', tier: 0, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: 'tower_solvent_sprayer_t0_head_idle.png', tier: 0, layer: 'head', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_solvent_sprayer_t0_head_spray.png', tier: 0, layer: 'head', anim: 'spray', frames: 6, fps: 10 },
      { file: 'tower_solvent_sprayer_t1_base_upgrade.png', tier: 1, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 },
      { file: 'tower_solvent_sprayer_t1_base_idle.png', tier: 1, layer: 'base', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_solvent_sprayer_t1_base_destroy.png', tier: 1, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: 'tower_solvent_sprayer_t1_head_idle.png', tier: 1, layer: 'head', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_solvent_sprayer_t1_head_spray.png', tier: 1, layer: 'head', anim: 'spray', frames: 6, fps: 12 },
      { file: 'tower_solvent_sprayer_t2_base_upgrade.png', tier: 2, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 },
      { file: 'tower_solvent_sprayer_t2_base_idle.png', tier: 2, layer: 'base', anim: 'idle', frames: 4, fps: 4 },
      { file: 'tower_solvent_sprayer_t2_base_destroy.png', tier: 2, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: 'tower_solvent_sprayer_t2_head_idle.png', tier: 2, layer: 'head', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_solvent_sprayer_t2_head_spray.png', tier: 2, layer: 'head', anim: 'spray', frames: 8, fps: 12 },
    ],
    state(tier, anim, f) {
      if (anim === 'idle') return { lamp: tier === 2 ? f < 2 : f === 0, bub: f, fly: f, drop: f === 0 ? 1 : 2, pist: tier === 2 && f === 1 ? 1 : 0 };
      if (tier === 0) return { lamp: true, bub: f, lev: at([0, 1, -1, -1, -.4, 0], f), swell: f === 2 ? 1 : 0, rec: at([0, 0, 0, 2, .5, 0], f), glob: f === 3 ? 1 : 0, drop: at([1, 0, 0, 0, 0, 1], f) };
      if (tier === 1) return { lamp: true, bub: f, press: at([0, 1.2, .4, 0, 0, -.5], f), rec: at([0, 0, 2, 0, 0, 0], f), shake: f === 3 ? 1 : 0, glob: f === 2 ? 1.15 : 0, drop: at([1, 0, 0, 0, 2, 1], f) };
      return { lamp: true, bub: f, fly: f, pist: at([0, -1, -2, 2.5, 0, 0, 0, 0], f), dip: at([0, 1, 2, -1.5, 0, 0, 0, 0], f), glob: f === 3 ? 1.3 : 0, vent: f === 5 ? 1 : f === 6 ? 2 : 0, drop: at([1, 0, 0, 0, 0, 2, 1, 1], f) };
    },
    base(c, tier, s) { body(c, tier, s || {}); },
    head(c, tier, s, dir) {
      const k = [1.55, 1.5, 1.45][tier];
      c.save(); c.translate(64, 64); c.scale(k, k); c.translate(-64, -64);
      [h0, h1, h2][tier](c, s || {}, G.dir(dir)); c.restore();
    },
    rubble(c, tier) {
      const shard = (x, y, r, s) => { c.save(); c.translate(x, y); c.rotate(r); c.fillStyle = BOTTLE.lo; c.beginPath(); c.moveTo(-s, 0); c.lineTo(-s * .5, -s * .7); c.lineTo(s * .6, -s * .6); c.lineTo(s, 0); c.lineTo(s * .4, s * .5); c.closePath(); c.fill(); c.fillStyle = BOTTLE.mid; c.fillRect(-s * .5, -s * .6, s * 1.1, s * .35); c.restore(); };
      const streak = (x, y, l) => { c.fillStyle = '#24502c'; c.beginPath(); c.ellipse(x, y, l, l * .3, 0, 0, 7); c.fill(); c.fillStyle = '#2f6b3a'; c.beginPath(); c.ellipse(x - l * .2, y - .5, l * .6, l * .17, 0, 0, 7); c.fill(); };
      const cols = [[['#7e7362', '#b9ac93'], ['#2f6b3a', '#4a9a52']], [['#7e7362', '#b9ac93'], ['#3a4258', '#5d6a80'], ['#2f6b3a', '#4a9a52']], [['#3a4660', '#62738f'], ['#2f6b3a', '#4a9a52'], ['#7e7362', '#b9ac93']]][tier];
      streak(70, 86, [12, 15, 18][tier]);
      A.heap(c, [31, 37, 43][tier], cols);
      shard(56, 74, -.3, [7, 8, 10][tier]); shard(72, 78, .4, [6, 7, 8][tier]);
    },
  };

  /* One body for all tiers: plinth → (t2 leg ring + catwalk) → bulging tank back-left → pipe → swivel. */
  function body(c, t, s) {
    const cx = 64, gy = 82;
    const R = [24, 28, 31][t], PH = [5, 6, 6][t], step = t === 2 ? 3 : 0;
    const mat = t === 2 ? PLATE : STONE;
    G.ground(c, cx, gy, R + 8, { tufts: 2, pebbles: 7 });
    if (t === 2) G.prism(c, cx, gy, R + 5, step, 8, PLATE, { rot: ROT8, stripes: true, mat: 'metal' });
    const pTop = G.prism(c, cx, gy - step, R, PH, 8, mat, { rot: ROT8, mat: t === 2 ? 'metal' : 'concrete', chipped: t === 0 });
    if (t < 2) prismCourses(c, cx, gy - step, R, PH, 2);
    if (t === 1) prismBand(c, cx, gy - PH, R, 2.6, P.steel);
    if (t === 2) for (let k = 0; k < 8; k++) { const a = ROT8 + k * Math.PI / 4; if (Math.sin(a) < 0) continue; const p = octV(cx, gy - step, R, a); G.rivets(c, p[0] + (Math.cos(a) < 0 ? 2 : -2), p[1] - 1.5, p[0] + (Math.cos(a) < 0 ? 2 : -2), p[1] - PH + 1.5, 2); }
    const top = gy - step - PH;
    { // recessed darker floor so the deck does not read as an empty table
      const fl = G.tones(mat), fr = R - 5; c.beginPath(); for (let k = 0; k < 8; k++) { const [x, y] = octV(cx, top + 1, fr, ROT8 + k * Math.PI / 4); k ? c.lineTo(x, y) : c.moveTo(x, y); } c.closePath();
      const gf = c.createLinearGradient(0, top - fr * G.K, 0, top + fr * G.K); gf.addColorStop(0, fl.ao); gf.addColorStop(.5, fl.lo); gf.addColorStop(1, fl.mid); c.fillStyle = gf; c.fill(); G.stroke(c, 1.2);
      if (t >= 1) { c.save(); c.clip(); for (let i = -6; i <= 6; i++) G.wire(c, [[cx + i * 5 - 8, top + 14], [cx + i * 5 + 8, top - 14]], G.rgba(fl.ao, .6), 1); c.restore(); }
    }

    // the tank, back-left
    const r = [13, 15, 17][t], h = [23, 31, 33][t], lift = [0, 0, 9][t];
    const tx = cx - [8, 9, 10][t], tby = top - [5, 6, 6][t] - lift;
    if (t === 2) { // ring of steel legs lifting the tank
      [Math.PI * 1.25, Math.PI * 1.75].forEach(a => { const p = [tx + Math.cos(a) * (r - 2), tby + lift + Math.sin(a) * (r - 2) * G.K]; G.bar(c, p[0], p[1], p[0], p[1] - lift - 2, 3.4, P.steel); });
    }
    if (t === 2) [Math.PI * .75, Math.PI * .25].forEach(a => { const p = [tx + Math.cos(a) * (r - 2), tby + lift + Math.sin(a) * (r - 2) * G.K]; G.bar(c, p[0], p[1], p[0], p[1] - lift - 2, 3.4, P.steel); });
    // t1 / t2 back props behind the tank: vent stack(s) start at the cap, drawn after
    let V;
    const catwalk = t === 2 ? {
      z: 13, fn: (Vt) => {
        const cw = r + 6, z = 13;
        const ringP = a => [tx + Math.cos(a) * cw, tby - z + Math.sin(a) * cw * G.K];
        // back rail (behind the upper tank)
        const back = []; for (let k = 4; k <= 8; k++) back.push(ringP(ROT8 + k * Math.PI / 4));
        back.forEach(([x, y]) => G.bar(c, x, y, x, y - 6, 1.4, P.steelLight));
        G.wire(c, back.map(([x, y]) => [x, y - 6]), G.OUT, 3.2); G.wire(c, back.map(([x, y]) => [x, y - 6]), G.tones(P.steelLight).mid, 1.4);
        G.prism(c, tx, tby - z + 2, cw, 2, 8, P.steel, { rot: ROT8, mat: 'metal', stripes: true, stripeStep: 5 });
      },
    } : null;
    V = tank(c, t, tx, tby, r, h, s, catwalk);
    if (t === 2) { // front rail of the catwalk + acid lamps on posts
      const cw = r + 6, z = 13; const ringP = a => [tx + Math.cos(a) * cw, tby - z + Math.sin(a) * cw * G.K];
      const front = []; for (let k = 0; k <= 4; k++) front.push(ringP(ROT8 + k * Math.PI / 4));
      front.forEach(([x, y]) => G.bar(c, x, y, x, y - 6, 1.4, P.steelLight));
      G.wire(c, front.map(([x, y]) => [x, y - 6]), G.OUT, 3.2); G.wire(c, front.map(([x, y]) => [x, y - 6]), G.tones(P.steelLight).mid, 1.4);
      [front[0], front[4]].forEach(([x, y]) => G.lamp(c, x, y - 8, ACID.mid, true, 1.8));
    }
    // crown: t1 vent stack with 45° elbow + valve wheel; t2 twin vent stacks
    const capC = V(0, h, 0);
    const stack = (x0, y0, up, side) => {
      const p1 = [x0, y0 - up], p2 = [x0 + side * 3, y0 - up - 3], p3 = [x0 + side * 3, y0 - up - 5];
      pipe(c, [[x0, y0], p1, p2, p3], 3, P.steelLight);
      G.boxC(c, p3[0], p3[1] + 1, 7, 4, 2, P.steel, { mat: 'metal', side: false });
      return p3;
    };
    if (t === 1) {
      stack(capC[0] - 6, capC[1] + 1, 2, -1);
      G.ell(c, capC[0] + 6, capC[1] - 3, 4, 2.6, G.tones(P.steel).mid, 1.3); G.ell(c, capC[0] + 6, capC[1] - 3, 1.2, .8, G.OUT, 0);
      G.bar(c, capC[0] + 6, capC[1], capC[0] + 6, capC[1] - 2.5, 1.6, P.steel);
    }
    if (t === 2) { stack(capC[0] - 6, capC[1] + 1, 3, -1); stack(capC[0] + 6, capC[1] + 1, 1, 1); }

    // pipe: tank foot (front-right facet) → down to the plinth → 45° → swivel
    const [hx, hy] = TW.headPos[t];
    const p0 = face(V, r - r * .19, 1, .3, r * .2);
    pipe(c, [p0, [p0[0] + 4, p0[1] + 4], [hx - 7, p0[1] + 4], [hx - 4, hy + 2]], 2.6, P.steelLight);
    if (t >= 1) G.gauge(c, hx - 11, p0[1] - 1, 2.6, .6);
    // swivel joint under the Head
    lathe(c, hx, hy + [3, 4, 6][t], [[8, 0], [8, [3, 4, 4][t]], [6.5, [4, 5, 6][t]]], t === 2 ? PLATE : P.steel, { mat: 'metal' });

    // props: amber lamp front-left (all tiers), canisters, flywheel
    const fl = octV(cx, gy - step, R, ROT8 + Math.PI * .75);
    G.bar(c, fl[0] + 2, fl[1] - PH + 1, fl[0] + 2, fl[1] - PH - 7, 1.6, P.steel);
    G.lamp(c, fl[0] + 2, fl[1] - PH - 9, P.amber, s.lamp !== false, 2.4);
    canister(c, cx - R - 2, gy + 7, 4, 8, true);
    if (t >= 1) canister(c, cx - R + 7, gy + 10, 3.4, 7, true);
    if (t === 2) {
      canister(c, cx - R - 4, gy - 2, 3.4, 8, true);
      // flywheel front-right (rotating 1/4 turn per idle frame)
      const fx = cx + R - 2, fy = gy - 6;
      G.box(c, fx - 6, gy + 6, 13, 8, 6, P.paintOlive.lo ? PLATE : PLATE, { mat: 'metal' });
      G.ell(c, fx + 2, fy - 4, 7, 7, G.tones(P.steel).mid, G.INNER); G.ell(c, fx + 2, fy - 4, 5, 5, G.tones(P.steel).lo, 1);
      for (let i = 0; i < 4; i++) { const a = (s.fly || 0) * Math.PI / 8 + i * Math.PI / 2; G.bar(c, fx + 2, fy - 4, fx + 2 + Math.cos(a) * 5, fy - 4 + Math.sin(a) * 5, 1.6, P.steelLight); }
      G.ell(c, fx + 2, fy - 4, 1.6, 1.6, P.brass.mid, 1);
      for (let i = 0; i < 3; i++) G.lamp(c, cx - 14 + i * 14, gy + R * G.K - 1, ACID.mid, s.lamp !== false || i === 1, 1.5);
    }
  }

  /* ================= HEADS ================= */
  const pt = (d, u, w, z) => [64 + d.dx * u + d.dy * w, 64 + (d.dy * u - d.dx * w) * G.K - z];
  const depth = (d, u, w) => d.dy * u - d.dx * w;
  const paint = parts => parts.sort((a, b) => a[0] - b[0]).forEach(p => p[1]());

  /** jointed nozzle through world joints [[u,z],...]; tip drop / glob */
  function nozzle(c, d, J, w, s) {
    const fk = d.dy < 0 ? 1 + d.dy * .45 : 1;
    const P2 = J.map(([u, z]) => pt(d, (u - (s.rec || 0)) * fk, 0, z));
    pipe(c, P2, w + (s.swell || 0), P.steelLight);
    const a = P2[P2.length - 2], b = P2[P2.length - 1];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
    // narrow brass tip
    G.bar(c, b[0] - ux * 1.5, b[1] - uy * 1.5, b[0] + ux * .8, b[1] + uy * .8, w * .55, P.brass);
    const tip = [b[0] + ux * 1.2, b[1] + uy * 1.2];
    G.ell(c, tip[0], tip[1], .9, .9, ACID.lo, 0);
    if (s.drop === 1) { G.ell(c, tip[0], tip[1] + 1.6, 1.1, 1.5, ACID.mid, 1); }
    if (s.drop === 2) { G.ell(c, tip[0], tip[1] + .8, .8, .8, ACID.mid, 0); G.ell(c, tip[0] + .2, tip[1] + 4.2, 1, 1.3, ACID.mid, 1); }
    if (s.glob) G.fx(c, o => {
      const k = s.glob, gx = tip[0] + ux * (3.5 + 2 * k), gy2 = tip[1] + uy * (3.5 + 2 * k);
      G.halo(o, gx, gy2, 5 * k, ACID.mid);
      o.beginPath(); o.ellipse(gx, gy2, 2.6 * k, 2.1 * k, Math.atan2(uy, ux), 0, 7); o.fillStyle = ACID.mid; o.fill(); G.stroke(o, 1);
      G.ell(o, gx - .8 * k, gy2 - .8 * k, .8 * k, .6 * k, ACID.hi, 0);
      G.ell(o, tip[0] + ux * 1.2, tip[1] + uy * 1.2, 1.2, 1, ACID.hi, 0);
    });
    return tip;
  }
  const turntable = (c, r) => lathe(c, 64, 64, [[r, 0], [r, 1.6]], P.steel, { mat: 'metal' });

  /* t0: green pump housing with a hand lever, single 45°-jointed pipe nozzle */
  function h0(c, s, d) {
    const J = [[3, 6], [3, 9], [6, 12], [12, 15]];
    turntable(c, 6.5);
    const lev = s.lev || 0, hp = [-8 + lev, 3, 13 + lev * 3];
    paint([
      [0, () => { const [x, y] = pt(d, -1, 0, 1.6); G.obox(c, x, y, 10, 9, 6, d.th, BOTTLE, { mat: 'paint' }); const [rx, ry] = pt(d, -1, 0, 8); G.rivets(c, rx - 3, ry + .5, rx + 3, ry + .5, 3); }],
      [depth(d, -6, 3) + .1, () => { const a = pt(d, -5, 3.5, 6.5), b = pt(d, hp[0], hp[1], hp[2]); G.bar(c, a[0], a[1], b[0], b[1], 1.8, P.steel); G.ell(c, b[0], b[1], 1.8, 1.8, G.tones(P.rubber).mid, 1.1); }],
      [depth(d, 8, 0) + .5, () => nozzle(c, d, J, 3.4, s)],
    ]);
  }
  /* t1: riveted pump box with a faceted diaphragm cap, 2-segment flanged gooseneck */
  function h1(c, s, d) {
    const J = [[4, 7], [4, 11], [8, 15], [14, 18]];
    turntable(c, 7.5);
    const sh = s.shake ? 1 : 0;
    paint([
      [0, () => {
        const [x, y] = pt(d, -1, 0, 1.6 + sh); G.obox(c, x, y, 12, 11, 7, d.th, BOTTLE, { mat: 'paint' });
        const [bx, by] = pt(d, -1, 0, 1.6 + sh); G.obox(c, bx, by, 12.6, 11.6, 2, d.th, P.steel, { mat: 'metal' });
        const [cx2, cy2] = pt(d, -2.5, 0, 8.6 + sh); lathe(c, cx2, cy2, [[4.4, 0], [4.4, 1.4], [3, 3.2 - (s.press || 0)]], P.steel, { mat: 'metal' });
        const [rx, ry] = pt(d, -1, 0, 8.6 + sh); G.rivets(c, rx - 4, ry + 3, rx + 4, ry + 3, 4);
      }],
      [depth(d, 8, 0) + .5, () => nozzle(c, d, J, 3.8, s)],
    ]);
  }
  /* t2: armoured turret block with two exposed pump pistons and a 2-joint boom on a hydraulic ram */
  function h2(c, s, d) {
    const dip = s.dip || 0, pi = s.pist || 0;
    const J = [[3, 10 - dip], [8, 15 - dip], [15, 18.5 - dip]];
    turntable(c, 8.5);
    const piston = w => [depth(d, -3, w), () => {
      const a = pt(d, -3, w, 2), b = pt(d, -3, w, 10); G.bar(c, a[0], a[1], b[0], b[1], 3.6, P.steel);
      const e = pt(d, -3, w, 13 + pi); G.bar(c, b[0], b[1], e[0], e[1], 1.6, P.steelLight); G.ell(c, e[0], e[1], 1.6, 1.2, P.brass.mid, 1);
      if (s.vent) G.puff(c, b[0] + 1, b[1] - 3 - s.vent * 2, 1.6 + s.vent * .8, .85, '#e6eedd');
    }];
    paint([
      piston(7.5), piston(-7.5),
      [0, () => {
        const [x, y] = pt(d, -1, 0, 1.6); G.obox(c, x, y, 14, 12, 8, d.th, PLATE, { mat: 'paint' });
        const [gx, gy2] = pt(d, -1, 0, 9.6); G.obox(c, gx, gy2, 8, 7, 1.6, d.th, BOTTLE, { mat: 'paint' });
        const [rx, ry] = pt(d, -1, 0, 9.6); G.rivets(c, rx - 5, ry + 3.5, rx + 5, ry + 3.5, 4);
      }],
      [depth(d, 6, 0) + .4, () => { const a = pt(d, 0, 0, 5), b = pt(d, 6, 0, 13 - dip); G.bar(c, a[0], a[1], b[0], b[1], 3.2, P.steel); G.bar(c, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, b[0], b[1], 1.6, P.steelLight); }],
      [depth(d, 9, 0) + .5, () => nozzle(c, d, J, 4, s)],
    ]);
  }

  TOWERS.solvent_sprayer = TW;
})();
