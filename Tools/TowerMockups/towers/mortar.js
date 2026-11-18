/* PROTOTYPE - NOT FOR PRODUCTION
 * Mortar (Súng cối) — v4, restyled per user reference (2026-11-18): a squat, fat mortar barrel
 * pointing at the sky between two gear-toothed cheek plates. Progression borrowed as a principle
 * (not copied): t0 black iron + brass bands · t1 dark iron studded with brass, red-hot glowing bore,
 * armoured spiked cheek blocks · t2 brass-armoured barrel with red-oxide panels, spikes, a draped
 * chain, the biggest hot bore. Family thread: fat skyward barrel + gear cheeks + ammo crate front-left
 * with an amber lamp. Same body every tier, ~15% bigger each time (art bible §3 revision).
 */
(function () {
  const P = G.P;
  const IRON = { hi: '#6b6f86', mid: '#3c3f52', lo: '#22232f' };
  const BRASS = { hi: '#ffe4a0', mid: '#d4a345', lo: '#8c6224' };
  const STEEL = { hi: '#c4d0e2', mid: '#8796ae', lo: '#4e5a72' };
  const RED = { hi: '#e2725f', mid: '#a83a2e', lo: '#5e1d1a' };
  const HOT = ['#2a1a1a', '#7a2a12', '#d8551e', '#ffb04a'];
  const at = (arr, f) => arr[Math.min(f, arr.length - 1)];

  /* ---------- parts ---------- */
  /** small pyramid stud / spike */
  function stud(c, x, y, s, col, spike) {
    const T = G.tones(col || BRASS), h = spike ? s * 1.6 : s;
    c.beginPath(); c.moveTo(x, y - h); c.lineTo(x + s, y); c.lineTo(x, y + s * .5); c.lineTo(x - s, y); c.closePath();
    c.fillStyle = T.mid; c.fill();
    c.beginPath(); c.moveTo(x, y - h); c.lineTo(x - s, y); c.lineTo(x, y + s * .5); c.closePath(); c.fillStyle = T.hi; c.fill();
    c.beginPath(); c.moveTo(x, y - h); c.lineTo(x + s, y); c.lineTo(x, y + s * .5); c.lineTo(x - s, y); c.closePath(); G.stroke(c, 1);
  }
  /** gear-toothed cheek plate (half disc standing beside the barrel) with a bolt hub */
  function cheek(c, x, gy, R, col, hub, armour) {
    const T = G.tones(col);
    const teeth = 9;
    c.beginPath(); c.moveTo(x - R, gy);
    for (let i = 0; i <= teeth * 2; i++) { const a = Math.PI + (i / (teeth * 2)) * Math.PI, r = i % 2 ? R : R + 2.6; c.lineTo(x + Math.cos(a) * r * .8, gy + Math.sin(a) * r); }
    c.lineTo(x + R * .8, gy); c.closePath();
    const g = c.createLinearGradient(x - R, gy - R, x + R, gy); g.addColorStop(0, T.hi); g.addColorStop(.5, T.mid); g.addColorStop(1, T.lo); c.fillStyle = g; c.fill();
    G.texture(c, [x - R, gy - R - 3, R * 2, R + 3], T, 'metal'); G.stroke(c);
    c.beginPath(); c.ellipse(x, gy - R * .1, R * .55, R * .62, 0, Math.PI, 0); c.strokeStyle = G.rgba(T.lo, .9); c.lineWidth = 1.2; c.stroke();
    G.ell(c, x, gy - R * .42, R * .3, R * .3, G.tones(hub || STEEL).mid, G.INNER);
    G.ell(c, x - R * .08, gy - R * .48, R * .12, R * .12, G.tones(hub || STEEL).hi, 0);
    if (armour) for (let i = 0; i < 3; i++) { const a = Math.PI * (1.2 + i * .3); stud(c, x + Math.cos(a) * R * .74 * .8, gy + Math.sin(a) * R * .74, armour === 2 ? 3 : 2.4, BRASS, armour === 2); }
  }
  /** the skyward barrel: cylinder + flared muzzle ring + bore (heat 0..3) */
  function barrel(c, cx, by, r, h, body, s, t) {
    G.cyl(c, cx, by, r, h, body, { mat: 'metal', top: null });
    const top = by - h;
    // bands
    const bands = t === 0 ? [.35, .7] : t === 1 ? [.25, .62] : [.2, .5, .8];
    bands.forEach(k => { const y = by - h * k; c.beginPath(); c.ellipse(cx, y, r + .9, (r + .9) * G.K, 0, 0, Math.PI); c.ellipse(cx, y - 2.6, r + .9, (r + .9) * G.K, 0, Math.PI, 0, true); c.closePath(); c.fillStyle = BRASS.mid; c.fill(); G.stroke(c, 1.1); c.beginPath(); c.ellipse(cx, y - 2, r + .9, (r + .9) * G.K, 0, .2, Math.PI - .2); c.strokeStyle = BRASS.hi; c.lineWidth = .9; c.stroke(); });
    // red panels (t2)
    if (t === 2) for (let i = 0; i < 3; i++) { const a = Math.PI * (.25 + i * .25), x = cx + Math.cos(a) * r * .95; c.fillStyle = RED.mid; c.fillRect(x - 2.2, by - h * .78, 4.4, h * .24); c.strokeStyle = G.OUT; c.lineWidth = 1; c.strokeRect(x - 2.2, by - h * .78, 4.4, h * .24); c.fillStyle = RED.hi; c.fillRect(x - 1.6, by - h * .77, 1.2, h * .22); }
    // studs (t1) / spikes (t2) around the body
    if (t >= 1) for (let i = 0; i < 3; i++) { const a = Math.PI * (.22 + i * .28), x = cx + Math.cos(a) * r, y = by - h * (t === 1 ? .44 : .36) + Math.sin(a) * r * G.K; stud(c, x, y, t === 1 ? 2.6 : 3.2, BRASS, t === 2); }
    // muzzle ring (flared) + bore
    const mr = r + (t === 0 ? 2.5 : 3.5);
    G.cyl(c, cx, top + 1, mr, 4, t === 0 ? IRON : t === 1 ? STEEL : BRASS, { mat: 'metal' });
    const heat = s.heat || 0;
    G.ell(c, cx, top - 3, r * .82, r * .82 * G.K, HOT[heat], G.INNER);
    if (heat >= 2) G.fx(c, o => { G.halo(o, cx, top - 3, r * (1 + heat * .25), '#ff8a3a'); G.ell(o, cx, top - 3, r * .5, r * .5 * G.K, '#ffd27a', 0); });
    return [cx, top - 3];
  }
  function flash(c, x, y, k) {
    if (!k) return;
    G.fx(c, c => { c.save(); c.translate(x, y); c.beginPath(); for (let i = 0; i < 14; i++) { const a = -Math.PI / 2 + (i / 13 - .5) * 2.4, r = (i % 2 ? 5 : 12) * k; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fillStyle = '#ffcf4a'; c.fill(); G.stroke(c, 1.3); G.ell(c, 0, -3 * k, 5 * k, 4 * k, '#fff4c8', 0); c.restore(); });
  }
  function smoke(c, x, y, f, k) {
    if (f == null || f < 0 || f > 4) return;
    for (let i = 0; i < 3; i++) { const t = f + i * .45, px = x + (i - 1) * 4 * k + t * 1.2, py = Math.max(7, y - 6 - t * 4 * k); const r = Math.min((3 + t * 1.8) * k, py - 3, 125 - px); if (r > 1) G.puff(c, px, py, r, .92 - f * .17); }
  }
  function chain(c, cx, y, w) {
    for (let i = 0; i <= 10; i++) { const t = i / 10, x = cx - w / 2 + w * t, yy = y + Math.sin(t * Math.PI) * 7; G.ell(c, x, yy, i % 2 ? 2.4 : 1.6, i % 2 ? 1.6 : 2.4, BRASS.mid, 1); }
  }
  function crate(c, x, gy, w, h, col, shells) {
    G.box(c, x, gy, w, 9, h, col, { mat: col === P.wood ? 'wood' : 'metal' });
    for (let i = 0; i < shells; i++) G.sphere(c, x + 4 + i * 4.5, gy - h - 3, 2, IRON);
  }

  const TW = {
    id: 'mortar', folder: 'Mortar', head: false,
    foot: [{ r: 30, h: 38 }, { r: 36, h: 52 }, { r: 42, h: 66 }],
    debrisCols: ['#3c3f52', '#d4a345', '#8796ae', '#a83a2e', '#b9ac93'],
    sheets: [
      { file: 'tower_mortar_t0_base_idle.png', tier: 0, layer: 'base', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_mortar_t0_base_fire.png', tier: 0, layer: 'base', anim: 'fire', frames: 6, fps: 12 },
      { file: 'tower_mortar_t0_base_build.png', tier: 0, layer: 'base', anim: 'build', frames: 6, fps: 10 },
      { file: 'tower_mortar_t0_base_destroy.png', tier: 0, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: 'tower_mortar_t1_base_upgrade.png', tier: 1, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 },
      { file: 'tower_mortar_t1_base_idle.png', tier: 1, layer: 'base', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_mortar_t1_base_fire.png', tier: 1, layer: 'base', anim: 'fire', frames: 8, fps: 12 },
      { file: 'tower_mortar_t1_base_destroy.png', tier: 1, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: 'tower_mortar_t2_base_upgrade.png', tier: 2, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 },
      { file: 'tower_mortar_t2_base_idle.png', tier: 2, layer: 'base', anim: 'idle', frames: 2, fps: 2 },
      { file: 'tower_mortar_t2_base_fire.png', tier: 2, layer: 'base', anim: 'fire', frames: 8, fps: 12 },
      { file: 'tower_mortar_t2_base_destroy.png', tier: 2, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
    ],
    state(tier, anim, f) {
      const idleHeat = [0, 2, 3][tier];
      if (anim === 'idle') return { lamp: f === 0, heat: tier ? (f === 0 ? idleHeat : idleHeat - 1) : 0 };
      const n = tier === 0 ? 6 : 8;
      return { lamp: true, rec: at([4, 3, 2, 1, .5, 0, 0, 0], f), fl: at([1.1, .6, 0], f) * (1 + tier * .2), sm: f, heat: tier === 0 ? at([2, 1, 0], f) : 3 };
    },
    base(c, tier, s) { body(c, tier, s || {}); },
    rubble(c, tier) {
      const cols = [[['#22232f', '#3c3f52'], ['#8c6224', '#d4a345']], [['#22232f', '#3c3f52'], ['#4e5a72', '#8796ae'], ['#8c6224', '#d4a345']], [['#8c6224', '#d4a345'], ['#5e1d1a', '#a83a2e'], ['#22232f', '#3c3f52']]][tier];
      A.heap(c, [26, 31, 36][tier], cols);
      c.save(); c.translate(66, 76); c.rotate(.35); const w = [9, 11, 13][tier], l = [18, 22, 26][tier];
      c.fillStyle = tier === 2 ? '#8c6224' : '#22232f'; c.fillRect(-l / 2, -w / 2, l, w); c.fillStyle = tier === 2 ? '#d4a345' : '#3c3f52'; c.fillRect(-l / 2, -w / 2, l, w * .45);
      c.fillStyle = '#d4a345'; c.fillRect(l * .1, -w / 2, 2.5, w); c.restore();
    },
  };

  /* One body for all tiers: small plinth → two gear cheeks → fat skyward barrel → props. */
  function body(c, t, s) {
    const cx = 64, gy = 82;
    const r = [11, 13, 15][t], h = [18, 22, 27][t], R = [16, 19, 22][t], rec = s.rec || 0;
    G.ground(c, cx, gy, [30, 36, 42][t], { tufts: 2, pebbles: 7 });
    // plinth: stone (t0) → stone + steel rim (t1) → brass-trimmed iron (t2)
    const plinthCol = t === 2 ? IRON : { hi: '#e2d8c3', mid: '#b9ac93', lo: '#7e7362' };
    G.prism(c, cx, gy, [20, 24, 29][t], [4, 5, 7][t], 8, plinthCol, { rot: Math.PI / 8, mat: t === 2 ? 'metal' : 'concrete', stripes: t === 2 });
    const py = gy - [4, 5, 7][t];
    if (t >= 1) { c.beginPath(); c.ellipse(cx, py + 1, [22, 27][t - 1] * .95, [22, 27][t - 1] * .95 * G.K, 0, .1, Math.PI - .1); c.strokeStyle = G.OUT; c.lineWidth = 3.4; c.stroke(); c.strokeStyle = t === 2 ? BRASS.mid : STEEL.mid; c.lineWidth = 2; c.stroke(); }
    // left cheek (behind), barrel, right cheek
    const cheekCol = t === 0 ? BRASS : t === 1 ? IRON : BRASS;
    const off = r + 4;
    cheek(c, cx - off, py + 2, R, cheekCol, t === 2 ? RED : STEEL, t);
    // carriage block under the barrel (t1+)
    if (t >= 1) G.boxC(c, cx, py + 2, r * 2 + 6, 10, 5, t === 1 ? IRON : RED, { mat: 'metal' });
    const body = t === 2 ? BRASS : IRON;
    const m = barrel(c, cx, py - rec * .6, r, h, body, s, t);
    cheek(c, cx + off, py + 4, R, cheekCol, t === 2 ? RED : STEEL, t);
    if (t === 2) chain(c, cx, py - 4, r * 2 + 14);
    // ammo crate front-left (motif) + lamp; more props per tier
    crate(c, cx - [30, 35, 40][t], gy + 9, 14, [6, 7, 8][t], t === 0 ? P.wood : t === 1 ? IRON : RED, [2, 3, 3][t]);
    G.lamp(c, cx - [24, 28, 33][t], gy - 4, P.amber, s.lamp !== false, 2.4);
    if (t >= 1) for (let i = 0; i < t + 1; i++) G.sphere(c, cx + [26, 31][t - 1] + i * 4.4, gy + 6 - i * .5, 2.2, IRON);
    flash(c, m[0], m[1] - 2, s.fl); smoke(c, m[0], m[1], s.sm, 1 + t * .15);
  }

  TOWERS.mortar = TW;
})();
