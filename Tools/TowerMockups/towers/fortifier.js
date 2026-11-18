/* PROTOTYPE - NOT FOR PRODUCTION
 * Fortifier (Tháp gia cố) — v3 (tier rule revised from the Kingdom Rush reference, 2026-11-18):
 * ONE core body for all tiers — a squat, wide, symmetric repair workshop (flat roof, big front door,
 * 45° buttresses on both shoulders) read by its EMBLEM on top: WRENCH = repair, SHIELD = less damage
 * to walls. Tier 0 is already a finished building. Each tier: ~15% bigger, material ladder (stone →
 * stone + riveted steel bands → steel armour), a new crown element (parapet → corner turrets), more
 * glow/props; the emblem grows: wrench sign → shield + wrench → big shield + two crossed wrenches.
 * Repair-teal on the emblem, glowing only while repairing. Plate stack + amber light front-left.
 */
(function () {
  const P = G.P;
  const TEAL = { hi: '#7fdcc0', mid: '#3fbf9f', lo: '#2a8a72' };
  const TEAL_ON = { hi: '#e8fff8', mid: '#9ff0d6', lo: '#3fbf9f' };
  const CORE = '#d8fff4';
  const SHIELD = { hi: '#c7d3e6', mid: '#8fa3c0', lo: '#566a8a' };
  const STONE = { hi: '#e2d8c3', mid: '#b9ac93', lo: '#7e7362' };
  const PLATE = { hi: '#9fb0c8', mid: '#62738f', lo: '#3a4660' };
  const at = (arr, f) => arr[Math.min(f, arr.length - 1)];

  /* ---------- emblems ---------- */
  function wrench(c, x, y, L, rot, glow) {
    const hw = .09, hh = .2, nw = .075, ch = .07, tr = .15;
    const pts = [[nw, -.5], [hh - ch, -.5], [hh, -.5 + ch], [hh, -.22 - ch], [hh - ch, -.22], [hw, -.22], [hw, .24], [tr - .05, .24], [tr, .29], [tr, .43], [tr - .05, .48], [-tr + .05, .48], [-tr, .43], [-tr, .29], [-tr + .05, .24], [-hw, .24], [-hw, -.22], [-hh + ch, -.22], [-hh, -.22 - ch], [-hh, -.5 + ch], [-hh + ch, -.5], [-nw, -.5], [-nw, -.36], [nw, -.36]];
    if (glow) G.fx(c, o => G.halo(o, x, y, L * (.45 + glow * .25), TEAL.mid));
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(L, L);
    const T = glow > .5 ? TEAL_ON : TEAL;
    c.beginPath(); pts.forEach(([a, b], i) => i ? c.lineTo(a, b) : c.moveTo(a, b)); c.closePath();
    const g = c.createLinearGradient(-.2, 0, .2, 0); g.addColorStop(0, T.hi); g.addColorStop(.5, T.mid); g.addColorStop(1, T.lo); c.fillStyle = g; c.fill();
    c.lineWidth = G.INNER / L; c.strokeStyle = G.OUT; c.lineJoin = 'round'; c.stroke();
    c.beginPath(); c.moveTo(-hw * .45, -.18); c.lineTo(-hw * .45, .2); c.lineWidth = 1.2 / L; c.strokeStyle = '#f2fffb'; c.stroke();
    const ho = [[-.04, .3], [.04, .3], [.07, .33], [.07, .39], [.04, .42], [-.04, .42], [-.07, .39], [-.07, .33]];
    c.beginPath(); ho.forEach(([a, b], i) => i ? c.lineTo(a, b) : c.moveTo(a, b)); c.closePath(); c.fillStyle = G.OUT; c.fill();
    c.restore();
  }
  function shield(c, x, y, w, h, glow) {
    const ch = w * .12;
    const pts = [[-w / 2 + ch, -h / 2], [w / 2 - ch, -h / 2], [w / 2, -h / 2 + ch], [w / 2, h * .12], [0, h / 2], [-w / 2, h * .12], [-w / 2, -h / 2 + ch]].map(([a, b]) => [x + a, y + b]);
    if (glow) G.fx(c, o => G.halo(o, x, y, w * (.8 + glow * .4), TEAL.mid));
    G.poly(c, pts, glow > .5 ? { hi: '#ffffff', mid: '#d9e6f2', lo: '#8fa3c0' } : SHIELD, { mat: 'metal' });
    const k = .78, inner = pts.map(([a, b]) => [x + (a - x) * k, y + (b - y) * k]);
    c.beginPath(); inner.forEach(([a, b], i) => i ? c.lineTo(a, b) : c.moveTo(a, b)); c.closePath();
    c.lineWidth = Math.max(2, w * .09); c.strokeStyle = glow > .5 ? CORE : TEAL.mid; c.stroke();
    G.rivets(c, x - w * .3, y - h * .36, x + w * .3, y - h * .36, 3);
  }
  function sparks(c, x, y, k, seed) {
    if (!k) return; G.fx(c, o => { G.seed(seed); o.lineWidth = 1.2; o.strokeStyle = CORE; for (let i = 0; i < 6; i++) { const a = -Math.PI * (.1 + G.rnd() * .8), r1 = 6, r2 = 10 + G.rnd() * 6 * k; o.beginPath(); o.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); o.lineTo(x + Math.cos(a) * r2, Math.max(3, y + Math.sin(a) * r2)); o.stroke(); } });
  }
  function ring(c, x, y, r, k) { if (!k) return; G.fx(c, o => { o.beginPath(); o.ellipse(x, y, r, r * G.K, 0, 0, 7); o.lineWidth = 3 * k; o.strokeStyle = G.rgba(TEAL.hi, .8 * k); o.stroke(); o.lineWidth = 1; o.strokeStyle = G.rgba(CORE, k); o.stroke(); }); }
  function plateStack(c, x, gy, n, col) { for (let i = 0; i < n; i++) G.box(c, x - i * .6, gy - i * 2.6, 13, 8, 2.4, col || P.steel, { mat: 'metal', side: false }); }

  const TW = {
    id: 'fortifier', folder: 'Fortifier', head: false,
    foot: [{ r: 36, h: 40 }, { r: 41, h: 50 }, { r: 47, h: 62 }],
    debrisCols: ['#b9ac93', '#3fbf9f', '#62738f', '#8fa3c0', '#a8713c'],
    sheets: [],
    state(tier, anim, f, n) {
      if (anim === 'idle') return { glow: 0, lamp: f === 0, bob: 0 };
      if (anim === 'repair_loop') return { glow: .55 + .45 * Math.sin(f / n * Math.PI * 2) ** 2, spark: 1, f, bob: f % 2 ? -1 : 0, lamp: true };
      return { glow: at([1, .9, .6, .4], f), ring: at([.4, 1, .7, .3], f), ringR: at([12, 22, 32, 40], f), f, spark: f < 2 ? 1 : 0, bob: at([-2, -1, 0, 0], f), lamp: true };
    },
    base(c, tier, s) { body(c, tier, s || {}); },
    rubble(c, tier) {
      const w = (x, y, r, l) => { c.save(); c.translate(x, y); c.rotate(r); c.fillStyle = TEAL.lo; c.fillRect(-l / 2, -2, l, 4); c.fillStyle = TEAL.mid; c.fillRect(-l / 2, -2, l, 1.8); c.fillRect(l / 2 - 2, -4, 4, 8); c.restore(); };
      const sh = (x, y, r, s) => { c.save(); c.translate(x, y); c.rotate(r); c.fillStyle = SHIELD.lo; c.beginPath(); c.moveTo(-s, -s * .7); c.lineTo(s, -s * .7); c.lineTo(s, s * .1); c.lineTo(0, s * .7); c.lineTo(-s, s * .1); c.closePath(); c.fill(); c.fillStyle = SHIELD.mid; c.fillRect(-s * .8, -s * .6, s * 1.6, s * .4); c.restore(); };
      const cols = [[['#7e7362', '#b9ac93'], ['#6b4224', '#a8713c']], [['#7e7362', '#b9ac93'], ['#3a4258', '#5d6a80']], [['#3a4660', '#62738f'], ['#7e7362', '#b9ac93']]][tier];
      A.heap(c, [32, 37, 42][tier], cols);
      if (tier >= 1) sh(60, 78, -.5, [0, 8, 11][tier]);
      w(72, 82, .6, [16, 18, 20][tier]); if (tier === 2) w(50, 82, -.7, 20);
    },
  };
  [0, 1, 2].forEach(t => {
    if (t === 0) TW.sheets.push({ file: 'tower_fortifier_t0_base_idle.png', tier: 0, layer: 'base', anim: 'idle', frames: 2, fps: 2 });
    else TW.sheets.push({ file: `tower_fortifier_t${t}_base_upgrade.png`, tier: t, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 }, { file: `tower_fortifier_t${t}_base_idle.png`, tier: t, layer: 'base', anim: 'idle', frames: 2, fps: 2 });
    TW.sheets.push({ file: `tower_fortifier_t${t}_base_repair_loop.png`, tier: t, layer: 'base', anim: 'repair_loop', frames: t === 2 ? 6 : 4, fps: t === 2 ? 12 : 8 },
      { file: `tower_fortifier_t${t}_base_repair_pulse.png`, tier: t, layer: 'base', anim: 'repair_pulse', frames: 4, fps: 10 });
    if (t === 0) TW.sheets.push({ file: 'tower_fortifier_t0_base_build.png', tier: 0, layer: 'base', anim: 'build', frames: 6, fps: 10 });
    TW.sheets.push({ file: `tower_fortifier_t${t}_base_destroy.png`, tier: t, layer: 'base', anim: 'destroy', frames: 6, fps: 10 });
  });

  /** stone-block courses on a box front */
  function blockFace(c, x, gy, w, h, rows) {
    const T = G.tones(STONE);
    for (let i = 1; i < rows; i++) { const y = gy - h * i / rows; G.wire(c, [[x + 1, y], [x + w - 1, y]], G.rgba(T.lo, .9), 1); }
    for (let i = 0; i < rows; i++) for (let j = 1; j < 6; j++) { const xx = x + w * (j - (i % 2) * .5) / 5.5; if (xx <= x + 2 || xx >= x + w - 2) continue; G.wire(c, [[xx, gy - h * i / rows], [xx, gy - h * (i + 1) / rows]], G.rgba(T.lo, .8), 1); }
  }

  /* One body for all tiers: plinth → workshop block with door → buttresses → crown → emblem. */
  function body(c, t, s) {
    const cx = 64, gy = 84;
    const W = [50, 58, 66][t], D = [24, 28, 32][t], H = [15, 18, 21][t];
    const mat = t === 2 ? PLATE : STONE;
    G.ground(c, cx, gy, W / 2 + 12, { tufts: 2, pebbles: 7 });
    // plinth (centred on the ground pivot)
    G.boxC(c, cx, gy, W + 10, D + 8, 3, t === 2 ? PLATE : STONE, { mat: t === 2 ? 'metal' : 'concrete', stripes: t === 2 });
    const fx = cx - W / 2, fy = gy + D * G.K / 2 - 2;   // front-bottom-left of the block, block centred
    // 45° buttresses on both shoulders (family thread)
    const butt = k => { const bx = cx + k * (W / 2), by = fy; G.poly(c, [[bx, by], [bx + k * 9, by], [bx, by - H * .9]], mat, { mat: t === 2 ? 'metal' : 'concrete' }); };
    // workshop block
    G.box(c, fx, fy, W, D, H, mat, { mat: t === 2 ? 'paint' : 'concrete' });
    if (t < 2) blockFace(c, fx, fy, W, H, t === 0 ? 3 : 4);
    else for (let i = 1; i < 4; i++) { const x = fx + W * i / 4; G.wire(c, [[x, fy - 1], [x, fy - H + 1]], G.rgba(PLATE.lo, .9), 1.2); G.rivets(c, x + 2, fy - 3, x + 2, fy - H + 3, 3); }
    if (t >= 1) { // riveted steel band along the top + corner straps
      const ST = G.tones(P.steel); c.fillStyle = ST.mid; c.fillRect(fx, fy - H, W, 3.5); c.fillStyle = ST.rim; c.fillRect(fx + 1, fy - H + .5, W - 2, 1); c.strokeStyle = G.OUT; c.lineWidth = 1.2; c.strokeRect(fx, fy - H, W, 3.5);
      G.rivets(c, fx + 4, fy - H + 2.2, fx + W - 4, fy - H + 2.2, 8);
      [fx, fx + W - 4].forEach(x => { c.fillStyle = G.tones(P.steel).mid; c.fillRect(x, fy - H, 4, H); c.strokeStyle = G.OUT; c.lineWidth = 1.2; c.strokeRect(x, fy - H, 4, H); });
    }
    if (t === 2) { c.beginPath(); c.rect(fx, fy - 4, W, 3.5); G.stripesInPath(c, fx, fy - 4, fx + W, fy - .5, 5); c.beginPath(); c.rect(fx, fy - 4, W, 3.5); G.stroke(c, 1); }
    butt(-1); butt(1);
    // door (front centre): wood → steel roll-up → armoured blast door with teal light strip
    const dw = [12, 14, 16][t], dh = [10, 12, 14][t], dx = cx - dw / 2;
    c.beginPath(); c.moveTo(dx, fy); c.lineTo(dx, fy - dh + 3); c.lineTo(dx + 3, fy - dh); c.lineTo(dx + dw - 3, fy - dh); c.lineTo(dx + dw, fy - dh + 3); c.lineTo(dx + dw, fy); c.closePath();
    c.fillStyle = t === 0 ? G.tones(P.wood).mid : t === 1 ? '#7d889b' : '#3a4258'; c.fill(); G.stroke(c);
    if (t === 0) for (let i = 1; i < 3; i++) G.wire(c, [[dx + dw * i / 3, fy - 1], [dx + dw * i / 3, fy - dh + 2]], G.tones(P.wood).lo, 1);
    if (t === 1) for (let y = fy - dh + 3; y < fy; y += 2.4) G.wire(c, [[dx + 1, y], [dx + dw - 1, y]], 'rgba(40,30,60,.45)', 1);
    if (t === 2) { c.fillStyle = s.glow ? TEAL_ON.mid : TEAL.lo; c.fillRect(dx + 3, fy - dh + 4, dw - 6, 2); }
    // roof crown: t1 parapet merlons on the front edge · t2 four corner turrets
    const roofY = fy - H, backY = roofY - D * G.K;
    if (t === 1) for (let i = 0; i < 6; i++) G.box(c, fx + 2 + i * (W - 8) / 5, roofY + 1, 5, 3, 4, STONE, { mat: 'concrete', side: false });
    const turret = (x, y) => { G.box(c, x - 5, y, 10, 7, 9, PLATE, { mat: 'paint' }); G.box(c, x - 6, y - 9, 12, 8, 2, P.steel, { mat: 'metal' }); };
    if (t === 2) { turret(fx + 4, backY + 4); turret(fx + W - 4, backY + 4); }
    // emblem on the roof
    const ey = roofY - D * G.K / 2 - [12, 14, 18][t] + (s.bob || 0);
    G.bar(c, cx, roofY - D * G.K / 2 + 2, cx, ey + 8, 2.6, P.steelLight);
    if (t === 0) wrench(c, cx, ey, 20, Math.PI / 4, s.glow);
    else if (t === 1) { shield(c, cx, ey, 20, 22, s.glow); wrench(c, cx, ey, 24, Math.PI / 4, s.glow); }
    else { shield(c, cx, ey, 26, 30, s.glow); wrench(c, cx - 1, ey + 1, 30, -Math.PI / 4, s.glow); wrench(c, cx + 1, ey + 1, 30, Math.PI / 4, s.glow); }
    sparks(c, cx, ey - 6, s.spark, (s.f || 0) * 11 + t);
    if (t === 2) { turret(fx + 4, roofY + 2); turret(fx + W - 4, roofY + 2); G.lamp(c, fx + 4, roofY - 12, s.glow ? TEAL.hi : '#4a6a64', !!s.glow, 2.2); G.lamp(c, fx + W - 4, roofY - 12, s.glow ? TEAL.hi : '#4a6a64', !!s.glow, 2.2); }
    ring(c, cx, gy - 4, s.ringR ? s.ringR * (1 + t * .2) : 0, s.ring);
    // motif front-left: plate stack + amber light; more props per tier
    plateStack(c, fx - 12, gy + 9, 2 + t, t === 2 ? PLATE : P.steel);
    G.bar(c, fx - 2, gy + 6, fx - 2, gy - 6, 1.4, P.steel); G.lamp(c, fx - 2, gy - 8, P.amber, s.lamp !== false, 2.3);
    if (t >= 1) G.box(c, fx + W + 3, gy + 8, 11, 8, 7, t === 2 ? P.paintTeal : P.wood, { mat: t === 2 ? 'paint' : 'wood' });
  }

  TOWERS.fortifier = TW;
})();
