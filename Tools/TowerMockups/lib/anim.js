/* PROTOTYPE - NOT FOR PRODUCTION */
/* Shared animations for every tower (art bible §8): build (t0 only), upgrade (into t1/t2),
 * destroy (every tier). Each tower only supplies its own drawing; the beats are identical
 * across the roster. All coordinates are in the 128×128 logical cell; c is already scaled.
 *
 * Tower module contract (towers/*.js):
 *   TOWERS.<id> = {
 *     folder, id,                       // 'Mortar', 'mortar'
 *     head: false | true,               // has a rotating Head layer
 *     headPos: [[x,y],[x,y],[x,y]],     // Head pivot (cell centre of the head sheet) in base-cell coords, per tier
 *     foot: [{r,h},{r,h},{r,h}],        // footprint radius and height per tier (used for stakes/scaffold/dust)
 *     sheets: [...],                    // see sheet.js
 *     state(tier, anim, f, n) -> s,     // per-frame state for idle / fire / custom anims
 *     base(c, tier, s),                 // draws the Base layer
 *     head(c, tier, s, dir),            // draws the Head layer centred at (64,64), dir in S,SE,E,NE,N
 *     rubble(c, tier),                  // final destroy frame: 2 tones, no outline
 *   }
 */
(function () {
  const A = {};
  const GY = 80;
  const mk = (w, h) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv; };
  A.mk = mk;

  /** Render fn into an offscreen 128-cell canvas at scale S. */
  A.off = (S, fn) => { const cv = mk(128 * S, 128 * S); const o = cv.getContext('2d'); o.scale(S, S); fn(o); return cv; };
  /** Copy of src with colour laid over its opaque pixels. */
  A.tint = (src, col, a) => { const cv = mk(src.width, src.height); const o = cv.getContext('2d'); o.drawImage(src, 0, 0); o.globalCompositeOperation = 'source-atop'; o.globalAlpha = a; o.fillStyle = col; o.fillRect(0, 0, cv.width, cv.height); return cv; };
  /** Thick silhouette outline (hand-painted look: heavy outer line, thin inner lines).
   * Dilates the sprite's alpha by px in 8 directions, filled with the outline colour. */
  A.outline = (src, px) => {
    const cv = mk(src.width, src.height), o = cv.getContext('2d');
    // mask from solid pixels only: glows, shadows and other translucent paint get no outline
    const sil = mk(src.width, src.height), sc = sil.getContext('2d'); sc.drawImage(src, 0, 0);
    const id = sc.getImageData(0, 0, sil.width, sil.height), d = id.data;
    for (let i = 0; i < d.length; i += 4) { const on = d[i + 3] > 150; d[i] = 0x2c; d[i + 1] = 0x22; d[i + 2] = 0x40; d[i + 3] = on ? 255 : 0; }
    sc.putImageData(id, 0, 0);
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; o.drawImage(sil, Math.cos(a) * px, Math.sin(a) * px); }
    o.drawImage(src, 0, 0); return cv;
  };
  const put = (c, cv, alpha) => { c.save(); if (alpha != null) c.globalAlpha = alpha; c.drawImage(cv, 0, 0, 128, 128); c.restore(); };

  /** Full tower (Base + Head facing SE) at tier with state s. */
  A.composite = (c, tw, tier, s) => {
    tw.base(c, tier, s || {});
    if (tw.head) { const [hx, hy] = tw.headPos[tier]; c.save(); c.translate(hx - 64, hy - 64); tw.head(c, tier, s || {}, 'SE'); c.restore(); }
  };
  const idleS = (tw, tier) => tw.state(tier, 'idle', 0, 2);
  const compOff = (S, tw, tier, s) => A.off(S, o => A.composite(o, tw, tier, s || idleS(tw, tier)));

  /* ---------- helpers ---------- */
  const ringPts = (r, degs) => degs.map(d => { const a = d * Math.PI / 180; return [64 + Math.cos(a) * r, GY + Math.sin(a) * r * G.K]; });
  // deterministic pseudo-random
  const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  A.stakes = (c, r) => {
    const P = ringPts(r, [200, 340, 20, 160]);
    G.wire(c, [...P, P[0]], '#f6f1e6', 1.1);
    P.forEach(([x, y]) => { G.bar(c, x, y, x, y - 7, 1.6, G.P.wood); c.fillStyle = '#ff6a3d'; c.fillRect(x, y - 8, 4, 2.5); });
  };
  A.scaffold = (c, r, h, alpha) => {
    c.save(); c.globalAlpha = alpha == null ? 1 : alpha;
    const P = ringPts(r + 3, [205, 335, 25, 155]);
    const top = Math.max(4, GY - h - 4);
    const pole = ([x, y]) => G.bar(c, x, y, x, Math.max(4, top - (GY - y) * .2), 2, { hi: '#ffe08a', mid: '#f0b429', lo: '#a87810' });
    const rail = (p, q, t) => G.bar(c, p[0], p[1] - (p[1] - top) * t, q[0], q[1] - (q[1] - top) * t, 1.6, { hi: '#ffe08a', mid: '#d9a020', lo: '#a87810' });
    pole(P[0]); pole(P[1]); rail(P[0], P[1], .45); rail(P[0], P[1], .9);
    pole(P[2]); pole(P[3]); rail(P[3], P[2], .4); rail(P[3], P[2], .85);
    rail(P[0], P[3], .9); rail(P[1], P[2], .9);
    c.restore();
  };
  A.dust = (c, r, k) => {
    const n = Math.round(5 + k * 9);
    for (let i = 0; i < n; i++) {
      const a = rnd(i) * Math.PI * 2, rr = r * (.55 + rnd(i + 9) * .55);
      const x = 64 + Math.cos(a) * rr, y = Math.max(10, GY + Math.sin(a) * rr * G.K - rnd(i + 3) * 26 * k);
      const pr = Math.min(4 + k * 9 * (.6 + rnd(i + 5) * .6), 124 - x, x - 4, 124 - y, y - 4);
      if (pr > 1) G.puff(c, x, y, pr, Math.min(.95, .45 + k * .5), '#e9e1d2');
    }
  };
  A.debris = (c, r, t, cols) => {
    for (let i = 0; i < 9; i++) {
      const a = -Math.PI * (.1 + rnd(i) * .8), sp = r * (.4 + rnd(i + 2) * .8);
      const x = 64 + Math.cos(a) * sp * t * 1.3, y = GY - 18 + Math.sin(a) * sp * t + 30 * t * t;
      if (x < 4 || x > 124 || y < 4 || y > 124) continue;
      const s = 2 + rnd(i + 4) * 3; c.save(); c.translate(x, y); c.rotate(rnd(i) * 6 + t * 4);
      c.fillStyle = cols[i % cols.length]; c.fillRect(-s, -s * .6, s * 2, s * 1.2); c.restore();
    }
  };
  A.cracks = (c, r, h) => {
    c.save(); c.strokeStyle = '#1a1328'; c.lineWidth = 1.4; c.lineJoin = 'miter';
    [[-.45, .05], [.1, .2], [.5, .1]].forEach(([dx, dy], i) => {
      let x = 64 + dx * r, y = GY - h * (.1 + dy); c.beginPath(); c.moveTo(x, y);
      for (let k = 0; k < 5; k++) { x += (rnd(i * 7 + k) - .5) * 7; y -= 3 + rnd(i * 3 + k) * 4; c.lineTo(x, y); } c.stroke();
    });
    c.restore();
  };
  /** Generic 2-tone rubble heap (no outline). cols = [[lo,hi],...] */
  A.heap = (c, rx, cols) => {
    c.fillStyle = 'rgba(30,20,50,.25)'; c.beginPath(); c.ellipse(64, GY + 1, rx, rx * G.K * .8, 0, 0, 7); c.fill();
    for (let i = 0; i < 16; i++) {
      const a = rnd(i) * Math.PI * 2, rr = rx * Math.sqrt(rnd(i + 11)) * .9;
      const x = 64 + Math.cos(a) * rr, y = GY + Math.sin(a) * rr * G.K * .8 - rnd(i + 1) * 4;
      const [lo, hi] = cols[i % cols.length]; const s = 3 + rnd(i + 6) * 4;
      c.save(); c.translate(x, y); c.rotate(rnd(i + 3) * 3);
      c.fillStyle = lo; c.fillRect(-s, -s * .45, s * 2, s * 1.1); c.fillStyle = hi; c.fillRect(-s, -s * .45, s * 2, s * .45);
      c.restore();
    }
  };
  let SMOKE = '#e2dde6';
  const smoke = (c, r, k, rise) => {
    for (let i = 0; i < 6; i++) {
      const x = 64 + (rnd(i + 20) - .5) * r * 1.4, y = Math.max(12, GY - 10 - rise * (.4 + rnd(i) * .6));
      const pr = Math.min((4 + rnd(i + 1) * 4.5) * (.6 + k * .8), 124 - x, x - 4, y - 4);
      if (pr > 1) G.puff(c, x, y, pr, .7 * k, SMOKE);
    }
  };

  /* ---------- the three shared animations ---------- */
  /** build: only tier 0. */
  A.build = (c, S, tw, f, n) => {
    const ft = tw.foot[0];
    if (f === n - 1) return A.composite(c, tw, 0, idleS(tw, 0));
    const p = [0, .3, .55, .8, .95][Math.min(f, 4)];
    G.shadow(c, 64, GY, ft.r * p);
    if (p > 0) {
      const cv = compOff(S, tw, 0);
      const top = GY + 10 - p * (ft.h + 20);
      c.save(); c.beginPath(); c.rect(0, top, 128, 128 - top); c.clip(); put(c, cv); c.restore();
    }
    if (f < 3) A.stakes(c, ft.r);
    if (f > 0) A.dust(c, ft.r, .3 - f * .04);
  };
  /** upgrade: into tier `to` (1 or 2). Frame 0 = previous tier idle, last frame = new tier idle. */
  A.upgrade = (c, S, tw, to, f, n) => {
    const from = to - 1, a = tw.foot[from], b = tw.foot[to];
    if (f === 0) return A.composite(c, tw, from, idleS(tw, from));
    if (f === n - 1) return A.composite(c, tw, to, idleS(tw, to));
    if (f === 1) { A.composite(c, tw, from, idleS(tw, from)); A.scaffold(c, a.r, a.h, 1); A.dust(c, a.r, .25); return; }
    if (f === 2) { put(c, compOff(S, tw, from), .5); A.scaffold(c, b.r, b.h, 1); A.dust(c, b.r, .95); return; }
    if (f === 3) { put(c, A.tint(compOff(S, tw, to), '#8a7fa6', .7)); A.scaffold(c, b.r, b.h, 1); A.dust(c, b.r, .7); return; }
    A.composite(c, tw, to, idleS(tw, to)); A.scaffold(c, b.r, b.h, .85); A.dust(c, b.r, .25);
  };
  /** destroy: every tier. Last frame = that tier's rubble. */
  A.destroy = (c, S, tw, tier, f, n) => {
    const D = (window.DESTROY_FX || {})[tw.id];
    SMOKE = (D && D.smoke) || '#e2dde6';
    destroyBase(c, S, tw, tier, f, n, D);
    SMOKE = '#e2dde6';
    if (D) D.fx(c, tier, f, n, tw.foot[tier]);
  };
  const destroyBase = (c, S, tw, tier, f, n, D) => {
    const ft = tw.foot[tier], cols = (D && D.debris) || tw.debrisCols || [G.P.concrete.mid, G.P.steel.mid, G.P.sand.mid];
    // rubble frames: only ground + rubble (rendering the tower here would leak its glows/fx)
    if (f >= 3) {
      G.ground(c, 64, GY, ft.r, { tufts: 1 });
      tw.rubble(c, tier);
      if (f === 3) { A.debris(c, ft.r, 1, cols); smoke(c, ft.r, 1, ft.h); }
      else if (f < n - 1) smoke(c, ft.r, .5, ft.h * 1.2);
      return;
    }
    const cv = compOff(S, tw, tier);
    if (f === 0) { put(c, A.tint(cv, D ? D.color : '#ffffff', .75)); return; }
    if (f === 1) {
      // cracks only on the tower's own pixels
      const cr = A.mk(cv.width, cv.height), o = cr.getContext('2d'); o.drawImage(cv, 0, 0);
      o.globalCompositeOperation = 'source-atop'; o.scale(S, S); A.cracks(o, ft.r, ft.h);
      put(c, cr); A.debris(c, ft.r, .25, cols); return;
    }
    const sq = (k, rot, alpha) => { c.save(); c.translate(64, GY); c.rotate(rot); c.scale(1 + (1 - k) * .1, k); c.translate(-64, -GY); put(c, cv, alpha); c.restore(); };
    if (f === 2) { sq(.72, .05); A.debris(c, ft.r, .6, cols); smoke(c, ft.r, .7, ft.h * .7); return; }
    if (f === 3) { tw.rubble(c, tier); A.debris(c, ft.r, 1, cols); smoke(c, ft.r, 1, ft.h); return; }
    tw.rubble(c, tier);
    if (f < n - 1) smoke(c, ft.r, .5, ft.h * 1.2);
  };

  window.A = A;
})();
