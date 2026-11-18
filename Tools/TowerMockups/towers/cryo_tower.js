/* PROTOTYPE - NOT FOR PRODUCTION
 * Cryo Tower (Tháp làm lạnh) — v4 (user direction 2026-11-18): fires a directional ICE BEAM, so it
 * now has a rotating Head. Base = one cold-steel drum body for all tiers (fins around it, gas bottle
 * back-left with amber lamp); Head = frost projector whose muzzle holds a glowing ice crystal; the
 * beam leaves the crystal tip. Tiers: t0 stone plinth + single-barrel projector · t1 + steel bands,
 * taller fins, coolant canisters on the head · t2 armour, glowing vent slits, crystal held in 3
 * claws on a long finned barrel with a coil collar. Cyan only on crystal / vents / beam, always with
 * the angular ice-crystal shape. Rounded dome/drum allowed (only rounded family, art bible §3).
 */
(function () {
  const P = G.P;
  const COLD = { hi: '#d3dee8', mid: '#9db1c2', lo: '#5f7387' };
  const CYAN = { hi: '#e8faff', mid: '#7fd6ff', lo: '#3f9fcf' };
  const STONE = { hi: '#e2d8c3', mid: '#b9ac93', lo: '#7e7362' };
  const PLATE = { hi: '#a9bdd2', mid: '#6a8099', lo: '#3c4d64' };
  const at = (arr, f) => arr[Math.min(f, arr.length - 1)];

  /* ---------- shared parts ---------- */
  function fin(c, cx, gy, a, rIn, rOut, h) {
    const p = (r, z) => [cx + Math.cos(a) * r, gy + Math.sin(a) * r * G.K - z];
    G.poly(c, [p(rIn, 0), p(rOut, 0), p(rOut, h * .7), p(rIn, h)], COLD, { mat: 'metal', tex: .5 });
  }
  const fins = (c, cx, gy, n, rIn, rOut, h, back) => { for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + Math.PI / n; if ((Math.sin(a) > .15) === back) continue; if (Math.abs(Math.cos(a)) < .35 && Math.sin(a) > 0) continue; fin(c, cx, gy, a, rIn, rOut, h); } };
  function bottle(c, x, gy, r, h) { G.cyl(c, x, gy, r, h, COLD, { mat: 'paint' }); G.dome(c, x, gy - h, r, r * .7, COLD); G.cyl(c, x, gy - h - r * .6, 1.6, 2.4, CYAN, { mat: 'metal' }); }
  /** ice crystal pointing along screen angle ang, base at (x,y) */
  function crystal(c, x, y, ang, len, w, glow) {
    if (glow) G.fx(c, o => G.halo(o, x + Math.cos(ang) * len * .5, y + Math.sin(ang) * len * .5, len * (.7 + glow * .5), CYAN.mid));
    c.save(); c.translate(x, y); c.rotate(ang);
    const pts = [[0, -w * .5], [len * .65, -w * .5], [len, 0], [len * .65, w * .5], [0, w * .5], [-len * .15, 0]];
    c.beginPath(); pts.forEach(([a, b], i) => i ? c.lineTo(a, b) : c.moveTo(a, b)); c.closePath();
    c.fillStyle = glow > .6 ? CYAN.hi : CYAN.mid; c.fill();
    c.beginPath(); c.moveTo(0, -w * .5); c.lineTo(len * .65, -w * .5); c.lineTo(len, 0); c.lineTo(0, 0); c.closePath(); c.fillStyle = glow > .6 ? '#ffffff' : CYAN.hi; c.fill();
    c.beginPath(); pts.forEach(([a, b], i) => i ? c.lineTo(a, b) : c.moveTo(a, b)); c.closePath(); G.stroke(c, 1.2);
    c.restore();
    return [x + Math.cos(ang) * len, y + Math.sin(ang) * len];
  }
  /** the ice beam (fire frames): tapered cyan beam with white core + frost glints */
  function beam(c, x, y, ang, len, w, f) {
    G.fx(c, o => {
      o.save(); o.translate(x, y); o.rotate(ang);
      const L = len;
      o.beginPath(); o.moveTo(0, -w); o.lineTo(L, -w * 1.4); o.lineTo(L, w * 1.4); o.lineTo(0, w); o.closePath();
      o.fillStyle = G.rgba(CYAN.mid, .55); o.fill(); o.strokeStyle = 'rgba(44,34,64,.55)'; o.lineWidth = 1; o.stroke();
      o.beginPath(); o.moveTo(0, -w * .45); o.lineTo(L, -w * .6); o.lineTo(L, w * .6); o.lineTo(0, w * .45); o.closePath(); o.fillStyle = '#f2fdff'; o.fill();
      G.seed(f * 13 + 3); for (let i = 0; i < 5; i++) { const px = G.rnd() * L, py = (G.rnd() - .5) * w * 3; o.fillStyle = '#ffffff'; o.beginPath(); o.moveTo(px, py - 2); o.lineTo(px + 1, py); o.lineTo(px, py + 2); o.lineTo(px - 1, py); o.closePath(); o.fill(); }
      o.restore();
    });
  }
  /** cluster of ice shards growing out of the ground / plinth (cyan with white facets) */
  function iceCluster(c, x, y, s) {
    [[-.55, .75, -.35], [.5, .65, .3], [0, 1, 0]].forEach(([dx, h, tilt]) => {
      const bx = x + dx * 4 * s, by = y, H = 11 * s * h, W = 2.6 * s;
      c.save(); c.translate(bx, by); c.rotate(tilt);
      c.beginPath(); c.moveTo(-W, 0); c.lineTo(-W, -H * .7); c.lineTo(0, -H); c.lineTo(W, -H * .7); c.lineTo(W, 0); c.closePath();
      c.fillStyle = CYAN.mid; c.fill();
      c.beginPath(); c.moveTo(-W, 0); c.lineTo(-W, -H * .7); c.lineTo(0, -H); c.lineTo(0, 0); c.closePath(); c.fillStyle = CYAN.hi; c.fill();
      c.beginPath(); c.moveTo(-W, 0); c.lineTo(-W, -H * .7); c.lineTo(0, -H); c.lineTo(W, -H * .7); c.lineTo(W, 0); c.closePath(); G.stroke(c, 1.2);
      c.restore();
    });
  }
  /** wavy white frost cap along the front of a rim */
  function frostCap(c, cx, y, r) {
    c.beginPath(); c.ellipse(cx, y, r, r * G.K, 0, Math.PI, 0); for (let i = 0; i <= 12; i++) { const a = i / 12 * Math.PI, rr = r * (i % 2 ? .97 : 1.0); c.lineTo(cx + Math.cos(a) * rr, y + Math.sin(a) * rr * G.K + (i % 2 ? 2.4 : 1)); } c.closePath();
    c.fillStyle = '#f4fbff'; c.fill(); G.stroke(c, 1.1);
  }
  function mist(c, cx, gy, r, k) { if (!k) return; for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + .5; const x = cx + Math.cos(a) * r, y = gy + Math.sin(a) * r * G.K - 3; const pr = Math.min(4 + k * 3, x - 4, 124 - x, y - 4); if (pr > 1) G.puff(c, x, y, pr, .7, '#d4f1ff'); } }

  const TW = {
    id: 'cryo_tower', folder: 'CryoTower', head: true,
    headPos: [[64, 55], [64, 49], [64, 43]],
    foot: [{ r: 30, h: 38 }, { r: 35, h: 50 }, { r: 40, h: 64 }],
    debrisCols: ['#b9ac93', '#9db1c2', '#7fd6ff', '#6a8099', '#5f7387'],
    sheets: [],
    state(tier, anim, f) {
      if (anim === 'idle') return { glow: f === 0 ? .5 : .3, lamp: f === 0, wisp: f === 0 };
      return { glow: 1, breath: 1, f, kick: f % 2 ? .5 : 0, lamp: true, mist: .6 }; // fire (icy breath loop)
    },
    base(c, tier, s) { base(c, tier, s || {}); },
    head(c, tier, s, dir) {
      const k = [1.45, 1.45, 1.45][tier];
      c.save(); c.translate(64, 68); c.scale(k, k); c.translate(-64, -68);
      head(c, tier, s || {}, G.dir(dir)); c.restore();
    },
    rubble(c, tier) {
      const cols = [[['#7e7362', '#b9ac93'], ['#5f7387', '#9db1c2']], [['#7e7362', '#b9ac93'], ['#5f7387', '#9db1c2']], [['#3c4d64', '#6a8099'], ['#5f7387', '#9db1c2']]][tier];
      A.heap(c, [26, 30, 35][tier], cols);
      [[58, 80, -.4], [72, 82, .5], [64, 86, 0]].forEach(([x, y, r]) => { c.save(); c.translate(x, y); c.rotate(r); c.fillStyle = CYAN.lo; c.beginPath(); c.moveTo(-4, 0); c.lineTo(0, -3); c.lineTo(4, 0); c.lineTo(0, 3); c.closePath(); c.fill(); c.fillStyle = CYAN.hi; c.fillRect(-2, -1, 2, 1.5); c.restore(); });
    },
  };
  [0, 1, 2].forEach(t => {
    if (t === 0) TW.sheets.push({ file: 'tower_cryo_tower_t0_base_idle.png', tier: 0, layer: 'base', anim: 'idle', frames: 2, fps: 2 }, { file: 'tower_cryo_tower_t0_base_build.png', tier: 0, layer: 'base', anim: 'build', frames: 6, fps: 10 });
    else TW.sheets.push({ file: `tower_cryo_tower_t${t}_base_upgrade.png`, tier: t, layer: 'base', anim: 'upgrade', frames: 6, fps: 10 }, { file: `tower_cryo_tower_t${t}_base_idle.png`, tier: t, layer: 'base', anim: 'idle', frames: 2, fps: 2 });
    TW.sheets.push({ file: `tower_cryo_tower_t${t}_base_destroy.png`, tier: t, layer: 'base', anim: 'destroy', frames: 6, fps: 10 },
      { file: `tower_cryo_tower_t${t}_head_idle.png`, tier: t, layer: 'head', anim: 'idle', frames: 2, fps: 3 },
      { file: `tower_cryo_tower_t${t}_head_fire.png`, tier: t, layer: 'head', anim: 'fire', frames: 4, fps: 12 });
  });

  /* ================= BASE: plinth → cold-steel drum with fins → turret ring ================= */
  function base(c, t, s) {
    const cx = 64, gy = 82;
    const pr = [26, 30, 34][t], ph = [5, 6, 7][t], dr = [16, 18, 21][t], dh = [10, 13, 16][t];
    G.ground(c, cx, gy, pr + 6, { tufts: 2, pebbles: 7 });
    G.prism(c, cx, gy, pr, ph, 8, t === 2 ? PLATE : STONE, { rot: Math.PI / 8, mat: t === 2 ? 'metal' : 'concrete', stripes: t === 2, chipped: t < 2 });
    const py = gy - ph;
    // gas bottle(s) back-left + amber lamp (motif)
    if (t === 0) bottle(c, cx - pr + 6, py - 2, 4, 12);
    else if (t === 1) { bottle(c, cx - pr + 4, py - 2, 4, 13); bottle(c, cx - pr + 12, py - 5, 4, 13); G.bar(c, cx - pr, py - 2, cx - pr, py - 22, 1.4, P.steel); G.bar(c, cx - pr + 16, py - 5, cx - pr + 16, py - 25, 1.4, P.steel); }
    else { G.cyl(c, cx - pr + 7, py - 2, 7, 22, { hi: '#f2f8fc', mid: '#c4d4e0', lo: '#8099ad' }, { mat: 'paint' }); G.dome(c, cx - pr + 7, py - 24, 7, 4, { hi: '#f2f8fc', mid: '#c4d4e0', lo: '#8099ad' }); [[cx - pr + 5, py - 10], [cx - pr + 9, py - 17]].forEach(([x, y]) => G.ell(c, x, y, 2, 1.3, '#ffffff', 0)); G.hose(c, [[cx - pr + 13, py - 16], [cx - 14, py - 12], [cx - 10, py - 8]], 2.2, CYAN); }
    G.lamp(c, cx - pr + 2, py - [18, 26, 30][t], P.amber, s.lamp !== false, 2.2);
    // fins behind, drum, fins in front
    fins(c, cx, py, 6, dr - 2, dr + 6 + t * 2, dh + 3 + t * 3, true);
    G.cyl(c, cx, py, dr, dh, t === 2 ? PLATE : COLD, { mat: 'metal' });
    if (t >= 1) { c.beginPath(); c.ellipse(cx, py - dh * .5, dr + .7, (dr + .7) * G.K, 0, .05, Math.PI - .05); c.lineWidth = 4; c.strokeStyle = G.OUT; c.stroke(); c.lineWidth = 2.4; c.strokeStyle = P.steel.mid; c.stroke(); for (let i = 0; i < 7; i++) { const a = Math.PI * (.1 + i * .13); G.rivets(c, cx + Math.cos(a) * (dr + .7), py - dh * .5 + Math.sin(a) * (dr + .7) * G.K, cx + Math.cos(a) * (dr + .7), py - dh * .5 + Math.sin(a) * (dr + .7) * G.K, 1); } }
    if (t === 2) [-.45, 0, .45].forEach(k => { const x = cx + dr * Math.cos(Math.PI * (.5 + k * .6)); c.fillStyle = CYAN.mid; c.fillRect(x - 1.3, py - dh + 4, 2.6, dh - 8); c.strokeStyle = G.OUT; c.lineWidth = 1; c.strokeRect(x - 1.3, py - dh + 4, 2.6, dh - 8); });
    // ice-crystal stencil on the drum front
    const sx = cx, sy = py - dh * .35; c.beginPath(); [[0, -4], [1.5, -1.5], [4, 0], [1.5, 1.5], [0, 4], [-1.5, 1.5], [-4, 0], [-1.5, -1.5]].forEach(([a, b], i) => i ? c.lineTo(sx + a, sy + b * .85) : c.moveTo(sx + a, sy + b * .85)); c.closePath(); c.fillStyle = CYAN.mid; c.fill(); G.stroke(c, 1);
    fins(c, cx, py, 6, dr - 2, dr + 6 + t * 2, dh + 3 + t * 3, false);
    // frost cap on the drum rim + ice clusters on the plinth (more and bigger per tier)
    const top = py - dh;
    frostCap(c, cx, top, dr);
    const cl = [[[cx + pr - 7, py + 6, .8]], [[cx + pr - 6, py + 6, .95], [cx - pr + 14, py + 12, .75]], [[cx + pr - 6, py + 6, 1.1], [cx - pr + 16, py + 13, .9], [cx + 6, py + pr * G.K + 2, .7]]][t];
    cl.forEach(([x, y, k]) => iceCluster(c, x, y, k));
    if (t >= 1) G.fx(c, o => cl.forEach(([x, y, k]) => G.halo(o, x, y - 6 * k, 8 * k, CYAN.mid)));
    // turret ring on top + cyan cool ring
    G.cyl(c, cx, top, dr * .62, 3, P.gunmetal, { mat: 'metal' });
    c.beginPath(); c.ellipse(cx, top - 3, dr * .62 + 1, (dr * .62 + 1) * G.K, 0, .05, Math.PI - .05); c.lineWidth = 3.6; c.strokeStyle = G.OUT; c.stroke(); c.lineWidth = 2; c.strokeStyle = CYAN.mid; c.stroke();
    mist(c, cx, py, dr + 8, s.mist);
  }

  /* ================= HEAD: round frost "breather" — dome housing with a crystal core window on top
   * and a short, WIDE flared blower mouth with a grille; fire = a cone of icy breath ============== */
  const pt = (d, u, w, z) => [64 + d.dx * u + d.dy * w, 68 + (d.dy * u - d.dx * w) * G.K - z];
  /** short wide bell mouth on the dome front, grille + dark/cyan throat. Returns mouth centre. */
  function mouth(c, x, y, ang, len, w0, w1, glow) {
    const T = G.tones(COLD);
    c.save(); c.translate(x, y); c.rotate(ang);
    c.beginPath(); c.moveTo(0, -w0); c.lineTo(len, -w1); c.lineTo(len, w1); c.lineTo(0, w0); c.closePath();
    const g = c.createLinearGradient(0, -w1, 0, w1); g.addColorStop(0, T.hi); g.addColorStop(.5, T.mid); g.addColorStop(1, T.lo); c.fillStyle = g; c.fill(); G.stroke(c);
    // rim ring + throat
    G.ell(c, len, 0, w1 * .38, w1, P.steelLight.mid, G.INNER);
    G.ell(c, len + .3, 0, w1 * .26, w1 * .78, glow > .6 ? CYAN.mid : '#2b3b52', 0);
    for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(len - .2, i * w1 * .3); c.lineTo(len + .5, i * w1 * .3); c.strokeStyle = G.OUT; c.lineWidth = .9; c.stroke(); }
    c.restore();
    return [x + Math.cos(ang) * len, y + Math.sin(ang) * len];
  }
  /** cone of icy breath: vapour puffs widening along the direction + sparkling ice glints */
  function breath(c, x, y, ang, len, spread, f, k) {
    G.fx(c, o => {
      // soft cone of frost: widening wedge, fading out, with a wavy end
      o.save(); o.translate(x, y); o.rotate(ang);
      const g = o.createLinearGradient(0, 0, len, 0); g.addColorStop(0, 'rgba(240,252,255,.95)'); g.addColorStop(.45, 'rgba(190,236,255,.6)'); g.addColorStop(1, 'rgba(160,220,255,0)');
      o.beginPath(); o.moveTo(0, -2.5);
      for (let i = 0; i <= 8; i++) { const t = i / 8; o.lineTo(len * t, -2.5 - spread * t - Math.sin(t * 9 + f * 1.7) * 1.2); }
      for (let i = 8; i >= 0; i--) { const t = i / 8; o.lineTo(len * t, 2.5 + spread * t + Math.sin(t * 8 + f * 1.3) * 1.2); }
      o.closePath(); o.fillStyle = g; o.fill();
      o.strokeStyle = 'rgba(44,34,64,.35)'; o.lineWidth = 1; o.stroke();
      // soft vapour clumps (no outline) drifting outward
      for (let i = 0; i < 6; i++) { const t = ((i * .17 + f * .12) % 1), dist = 5 + t * len * .9, off = Math.sin(i * 2.1 + f) * spread * t * .8, r = 2 + t * spread * .7; o.beginPath(); o.arc(dist, off, r, 0, 7); o.fillStyle = `rgba(255,255,255,${(.75 - t * .6).toFixed(2)})`; o.fill(); }
      o.restore();
    });
    G.fx(c, o => { G.seed(f * 17 + 5); for (let i = 0; i < 6; i++) { const t = G.rnd(), off = (G.rnd() - .5) * spread * 2 * t, dist = 6 + t * len; const px = x + Math.cos(ang) * dist - Math.sin(ang) * off, py = y + Math.sin(ang) * dist + Math.cos(ang) * off; if (px < 4 || px > 124 || py < 4 || py > 124) continue; o.fillStyle = '#ffffff'; o.beginPath(); o.moveTo(px, py - 2); o.lineTo(px + 1.2, py); o.lineTo(px, py + 2); o.lineTo(px - 1.2, py); o.closePath(); o.fill(); } });
  }
  function head(c, t, s, d) {
    const back = d.dy < 0, kick = s.kick || 0;
    const R = [7.5, 8.5, 9.5][t];                          // dome radius
    let m;
    const blower = () => {
      const [x, y] = pt(d, R * .55 - kick, 0, R * .55);
      m = mouth(c, x, y, d.ang, ([5, 6, 7][t]) * Math.max(.5, d.fs) + 1.5, R * .45, R * .75 + t * .6, s.glow);
    };
    // side coolant canisters (t1+) behind / in front by depth
    const cans = front => { if (t < 1) return; [-1, 1].forEach(k => { const [qx, qy] = pt(d, -2, k * (R + 1.5), 0); if ((qy > 68) !== front) return; G.cyl(c, qx, qy, 2.4, 8, COLD, { mat: 'paint' }); G.ell(c, qx, qy - 8, 1.5, 1.1, CYAN.mid, 1); }); };
    cans(false);
    if (back) blower();
    // dome housing: short drum + dome, cold steel (t2 armoured plates)
    const body = t === 2 ? PLATE : COLD;
    G.cyl(c, 64, 68, R, 4, body, { mat: 'metal' });
    G.dome(c, 64, 64, R, R * .95, body);
    // crystal core window on top (glowing), t2 crowned by 3 small crystals
    const wy = 64 - R * .62;
    G.ell(c, 64, wy, R * .5, R * .36, '#20304a', G.INNER);
    G.ell(c, 64, wy, R * .4, R * .28, s.glow > .6 ? CYAN.hi : CYAN.mid, 0);
    if (s.glow) G.fx(c, o => G.halo(o, 64, wy - 1, R * (.6 + s.glow * .5), CYAN.mid));
    const spikes = t === 2 ? [[-3, .7], [0, 1], [3, .7]] : [[0, t === 1 ? .85 : .7]];
    spikes.forEach(([dx, k]) => { const x = 64 + dx, H = R * k; c.beginPath(); c.moveTo(x - 1.6, wy); c.lineTo(x - 1.6, wy - H * .6); c.lineTo(x, wy - H); c.lineTo(x + 1.6, wy - H * .6); c.lineTo(x + 1.6, wy); c.closePath(); c.fillStyle = CYAN.mid; c.fill(); G.stroke(c, 1); c.fillStyle = CYAN.hi; c.fillRect(x - 1.2, wy - H * .55, 1, H * .45); });
    // frost rim on the dome + amber status lamp at the back
    c.beginPath(); c.ellipse(64, 66, R + .4, (R + .4) * G.K, 0, .15, Math.PI - .15); c.lineWidth = 2.2; c.strokeStyle = '#f4fbff'; c.stroke();
    G.lamp(c, ...pt(d, -R * .7, 0, R * .9), P.amber, s.lamp !== false, 1.4);
    if (!back) blower();
    cans(true);
    if (s.breath && m) breath(c, m[0], m[1], d.ang, [26, 32, 38][t], [6, 8, 10][t], s.f || 0, 1);
    else if (s.wisp && m) G.puff(c, m[0] + Math.cos(d.ang) * 3, m[1] + Math.sin(d.ang) * 3 - 1, 2.4, .7, '#e8faff');
  }

  TOWERS.cryo_tower = TW;
})();
