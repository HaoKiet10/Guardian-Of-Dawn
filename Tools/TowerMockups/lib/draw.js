/* PROTOTYPE - NOT FOR PRODUCTION */
/* Guardian of Dawn — tower mockup drawing library, v2 "hand-painted cartoon" style.
 * Art direction revision (2026-11-18): stylised hand-painted look, richer colour (warm lights,
 * cool purple shadows), material-specific highlights (metal / painted steel / glass / energy /
 * wood / cloth / concrete), subtle wear, layered overlapping parts, towers grounded with a
 * dirt skirt + contact shadow. Silhouette outline is added afterwards by A.outline (thick outer
 * line); inner lines here are thinner.
 *
 * Cell 128×128 logical px. Ground pivot G.CX=64, G.GY=80. Ground depth squash G.K=0.72.
 * Light from top-left. y grows down. Draw back to front.
 */
(function () {
  const G = {};
  G.OUT = '#2c2240';
  G.K = 0.72;
  G.CX = 64;
  G.GY = 80;
  G.INNER = 1.5; // inner line width

  /* ---------- colour ---------- */
  const rgb = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); };
  const toHex = a => '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  G.mix = (a, b, t) => { const A = rgb(a), B = rgb(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
  G.rgba = (h, a) => { const [r, g, b] = rgb(h); return `rgba(${r},${g},${b},${a})`; };
  /** tones(hex|{hi,mid,lo}) -> {hi, mid, lo, rim, ao}. Warm light, cool purple shadow. */
  G.tones = c => {
    const t = typeof c === 'object' ? { ...c } : { hi: G.mix(c, '#fff0c4', .42), mid: c, lo: G.mix(c, '#2b2252', .46) };
    t.rim = t.rim || G.mix(t.hi, '#ffffff', .45);
    t.ao = t.ao || G.mix(t.lo, '#1a1230', .45);
    return t;
  };

  /* Materials (art bible palette + painted-steel variety instead of flat grey) */
  G.P = {
    steel: { hi: '#8a97ad', mid: '#5d6a80', lo: '#3a4258' },          // bare blued steel
    steelLight: { hi: '#b9c3d1', mid: '#8b97a9', lo: '#5d677b' },
    gunmetal: { hi: '#6d7690', mid: '#454c63', lo: '#2b2f42' },
    paintTeal: { hi: '#6fb0a6', mid: '#3f7f7a', lo: '#27515a' },      // painted industrial steel
    paintRust: { hi: '#d98a62', mid: '#a9503a', lo: '#6a2e2c' },      // red-oxide primer
    paintOlive: { hi: '#a4ae6a', mid: '#727d45', lo: '#474f30' },
    paintCream: { hi: '#fff4d8', mid: '#e6d6ad', lo: '#a99a78' },
    concrete: { hi: '#ddd5c4', mid: '#b3a995', lo: '#7d7468' },
    concreteDark: { hi: '#c2b9a8', mid: '#958c7c', lo: '#655d55' },
    sand: { hi: '#f8dc93', mid: '#e3b45a', lo: '#a87a36' },
    cloth: { hi: '#d8c79a', mid: '#b29c68', lo: '#7a6441' },
    wood: { hi: '#d9a66a', mid: '#a8713c', lo: '#6b4224' },
    woodDark: { hi: '#a87a50', mid: '#7a5232', lo: '#4a301e' },
    copper: { hi: '#f2b779', mid: '#cc823f', lo: '#86512a' },
    brass: { hi: '#ffe39a', mid: '#d9a441', lo: '#93672a' },
    rust: { hi: '#c4784e', mid: '#91512f', lo: '#5a3020' },
    rope: { hi: '#ecc488', mid: '#c08a4a', lo: '#87592b' },
    rubber: { hi: '#5a5470', mid: '#3a3550', lo: '#221e33' },
    glass: { hi: '#e9fbff', mid: '#9fd4e6', lo: '#4f7f99' },
    hazard: '#f0b429',
    amber: '#ff9f1c',
    dirt: { hi: '#c9b28a', mid: '#a68b62', lo: '#735c40' },
    grass: { hi: '#c6c26b', mid: '#8f9046', lo: '#5d6232' },
  };

  /* deterministic random */
  let SEED = 1;
  G.seed = s => { SEED = s | 0 || 1; };
  const rnd = () => { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; };
  G.rnd = rnd;

  /* ---------- line + basic ---------- */
  G.stroke = (c, w) => { c.lineWidth = w || G.INNER; c.strokeStyle = G.OUT; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(); };
  G.ellPath = (c, x, y, rx, ry) => { c.beginPath(); c.ellipse(x, y, Math.max(rx, .1), Math.max(ry, .1), 0, 0, Math.PI * 2); };
  G.ell = (c, x, y, rx, ry, fill, w) => { G.ellPath(c, x, y, rx, ry); c.fillStyle = fill; c.fill(); if (w !== 0) G.stroke(c, w); };

  /** Hand-painted texture inside the current path: brush dabs (light upper-left, dark lower-right),
   * a few scratches and chips. bbox = [x,y,w,h]. mat: 'metal'|'paint'|'wood'|'concrete'|'cloth'|'glass'|'none' */
  G.texture = (c, bb, T, mat, amount) => {
    if (mat === 'none') return; amount = amount == null ? 1 : amount;
    const [x, y, w, h] = bb; if (w < 3 || h < 3) return;
    c.save(); c.clip();
    G.seed(Math.floor(x * 13 + y * 7 + w * 3 + h));
    const n = Math.min(40, Math.floor(w * h / 55 * amount));
    for (let i = 0; i < n; i++) {
      const px = x + rnd() * w, py = y + rnd() * h, t = ((px - x) / w + (py - y) / h) / 2;
      const len = 2 + rnd() * (mat === 'wood' ? 9 : 5), ang = mat === 'wood' ? 0 : -0.5 + rnd() * .4;
      c.strokeStyle = t < .5 ? G.rgba(T.hi, .28 + rnd() * .2) : G.rgba(T.lo, .22 + rnd() * .2);
      c.lineWidth = mat === 'concrete' ? 1 : 1.3 + rnd(); c.lineCap = 'round';
      c.beginPath(); c.moveTo(px, py); c.lineTo(px + Math.cos(ang) * len, py + Math.sin(ang) * len); c.stroke();
    }
    if (mat === 'concrete') for (let i = 0; i < n / 3; i++) { c.fillStyle = G.rgba(T.lo, .35); c.fillRect(x + rnd() * w, y + rnd() * h, 1, 1); }
    if (mat === 'metal' || mat === 'paint') {
      const k = Math.min(3, Math.floor(w * h / 260 * amount));
      for (let i = 0; i < k; i++) { // scratches
        const px = x + rnd() * w, py = y + rnd() * h, l = 3 + rnd() * 6;
        c.strokeStyle = G.rgba(T.rim, .55); c.lineWidth = .7; c.beginPath(); c.moveTo(px, py); c.lineTo(px + l, py - l * .35); c.stroke();
      }
      if (mat === 'paint') for (let i = 0; i < k; i++) { // paint chips show bare metal
        const px = x + rnd() * w, py = y + h * (.5 + rnd() * .5);
        c.fillStyle = '#7d8696'; c.beginPath(); c.ellipse(px, py, 1.2 + rnd() * 1.5, .8 + rnd(), 0, 0, 7); c.fill();
      }
    }
    if (mat === 'glass') { c.strokeStyle = G.rgba('#ffffff', .8); c.lineWidth = 1.4; c.beginPath(); c.moveTo(x + w * .2, y + h * .7); c.lineTo(x + w * .55, y + h * .2); c.stroke(); }
    c.restore();
  };

  /** Hazard stripes (yellow / indigo diagonals) clipped to the current path, slightly worn. */
  G.stripesInPath = (c, x0, y0, x1, y1, step) => {
    step = step || 8; c.save(); c.clip(); c.lineWidth = step / 2;
    for (let x = x0 - (y1 - y0) - step; x < x1 + step; x += step) {
      c.strokeStyle = (Math.floor((x - x0) / step) % 2 === 0) ? G.P.hazard : '#3a2f50';
      c.beginPath(); c.moveTo(x, y1); c.lineTo(x + (y1 - y0), y0); c.stroke();
    }
    G.seed(x0 * 3 + y0); for (let i = 0; i < 6; i++) { c.fillStyle = 'rgba(60,45,70,.45)'; c.fillRect(x0 + rnd() * (x1 - x0), y0 + rnd() * (y1 - y0), 2 + rnd() * 3, 1.5); }
    c.restore();
  };

  /* ---------- layers ----------
   * Sheet rendering sets G.DEFER = {ground:[], fx:[]}: ground skirts and effects (smoke, flash)
   * are then recorded instead of drawn, and composited outside the silhouette outline
   * (ground under, fx over). Outside a sheet render they draw immediately. */
  G.DEFER = null;
  const defer = (kind, c, fn) => {
    if (!G.DEFER) return fn(c);
    const m = c.getTransform(), a = c.globalAlpha;
    G.DEFER[kind].push(o => { o.save(); o.setTransform(m); o.globalAlpha = a; fn(o); o.restore(); });
  };
  /** Draw effects (muzzle flash, smoke, sparks) on the fx layer: no silhouette outline. */
  G.fx = (c, fn) => defer('fx', c, fn);

  /* ---------- ground integration ---------- */
  /** Dirt skirt + contact shadow + pebbles + dry grass tufts. Draw FIRST. */
  G.ground = (c, cx, gy, rx, opt) => defer('ground', c, o => groundNow(o, cx, gy, rx, opt));
  const groundNow = (c, cx, gy, rx, opt) => {
    opt = opt || {}; G.seed(Math.round(rx * 31 + cx));
    const D = G.tones(opt.col || G.P.dirt), ry = rx * G.K;
    // irregular dirt blob
    c.beginPath();
    for (let i = 0; i <= 20; i++) { const a = i / 20 * Math.PI * 2, k = 1 + (rnd() - .5) * .16; const x = cx + Math.cos(a) * rx * 1.08 * k, y = gy + 2 + Math.sin(a) * ry * 1.08 * k; i ? c.lineTo(x, y) : c.moveTo(x, y); }
    c.closePath(); c.fillStyle = G.rgba(D.mid, .55); c.fill();
    // contact shadow (ambient occlusion) — darker toward the bottom-right (light from top-left)
    G.ellPath(c, cx + 3, gy + 2.5, rx * .92, ry * .85); c.fillStyle = 'rgba(38,24,58,.30)'; c.fill();
    G.ellPath(c, cx + 2, gy + 1.5, rx * .78, ry * .7); c.fillStyle = 'rgba(38,24,58,.22)'; c.fill();
    // pebbles
    for (let i = 0; i < (opt.pebbles == null ? 7 : opt.pebbles); i++) {
      const a = rnd() * Math.PI * 2, r = rx * (.92 + rnd() * .2), x = cx + Math.cos(a) * r, y = gy + 2 + Math.sin(a) * r * G.K;
      G.ell(c, x, y, 1.4 + rnd() * 1.4, 1 + rnd(), D.lo, 0); G.ell(c, x - .4, y - .4, .7, .5, D.hi, 0);
    }
    // dry grass tufts on the rim
    for (let i = 0; i < (opt.tufts == null ? 3 : opt.tufts); i++) {
      const a = (.1 + rnd() * .8) * Math.PI * (rnd() < .5 ? 1 : -1) + (rnd() < .5 ? 0 : Math.PI), r = rx * (1 + rnd() * .08);
      const x = cx + Math.cos(a) * r, y = gy + 2 + Math.sin(a) * r * G.K;
      [-2, 0, 2].forEach((d, j) => { c.strokeStyle = [G.P.grass.lo, G.P.grass.mid, G.P.grass.hi][j]; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x + d * .6, y); c.quadraticCurveTo(x + d, y - 3, x + d * 1.6, y - 5 - rnd() * 2); c.stroke(); });
    }
  };
  G.shadow = (c, cx, gy, rx) => G.ground(c, cx, gy, rx, { pebbles: 0, tufts: 0 });

  /* ---------- volumes ---------- */
  const vgrad = (c, y0, y1, T) => { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, T.hi); g.addColorStop(.45, T.mid); g.addColorStop(1, T.lo); return g; };
  const hgrad = (c, x0, x1, T) => { const g = c.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, T.hi); g.addColorStop(.3, T.mid); g.addColorStop(.75, T.mid); g.addColorStop(1, T.lo); return g; };

  /** Vertical cylinder. opt: {stripes, top:colour|null, mat, ribs:n} */
  G.cyl = (c, cx, gy, rx, h, col, opt) => {
    opt = opt || {}; const T = G.tones(col), ry = opt.ry || rx * G.K, mat = opt.mat || 'metal';
    const side = () => { c.beginPath(); c.moveTo(cx - rx, gy - h); c.lineTo(cx - rx, gy); c.ellipse(cx, gy, rx, ry, 0, Math.PI, 0, true); c.lineTo(cx + rx, gy - h); c.closePath(); };
    side(); c.fillStyle = hgrad(c, cx - rx, cx + rx, T); c.fill();
    side(); G.texture(c, [cx - rx, gy - h, rx * 2, h + ry], T, mat);
    if (opt.stripes) { side(); G.stripesInPath(c, cx - rx, gy - h, cx + rx, gy + ry, opt.stripeStep); }
    if (opt.ribs) for (let i = 1; i < opt.ribs; i++) { const a = Math.PI * i / opt.ribs, x = cx - Math.cos(a) * rx, y = gy + Math.sin(a) * ry; c.strokeStyle = G.rgba(T.lo, .7); c.lineWidth = 1; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - h); c.stroke(); }
    // rim light along the top front edge
    c.beginPath(); c.ellipse(cx, gy - h, rx - .5, ry - .5, 0, .15, Math.PI - .15); c.strokeStyle = T.rim; c.lineWidth = 1; c.stroke();
    side(); G.stroke(c);
    if (opt.top !== null) {
      G.ellPath(c, cx, gy - h, rx, ry); const g = c.createLinearGradient(cx - rx, gy - h - ry, cx + rx, gy - h + ry); g.addColorStop(0, T.rim); g.addColorStop(.5, opt.top || T.hi); g.addColorStop(1, T.mid);
      c.fillStyle = g; c.fill(); G.ellPath(c, cx, gy - h, rx, ry); G.texture(c, [cx - rx, gy - h - ry, rx * 2, ry * 2], T, mat, .5); G.ellPath(c, cx, gy - h, rx, ry); G.stroke(c);
    }
  };

  /** Regular n-gon prism (plinths, decks). opt: {rot, stripes, top, mat, chipped:bool} Returns top polygon pts. */
  G.prism = (c, cx, gy, r, h, n, col, opt) => {
    opt = opt || {}; const T = G.tones(col), rot = opt.rot || 0, mat = opt.mat || 'concrete';
    const pts = []; for (let i = 0; i < n; i++) { const a = rot + i / n * Math.PI * 2; pts.push([Math.cos(a) * r, Math.sin(a) * r]); }
    const P = pts.map(([x, y]) => [cx + x, gy + y * G.K]), m = P.length;
    const faces = [];
    for (let i = 0; i < m; i++) {
      const a = P[i], b = P[(i + 1) % m], mx = (a[0] + b[0]) / 2 - cx, my = ((a[1] + b[1]) / 2 - gy) / G.K;
      if (my <= 0.5) continue; const lit = (-mx * .75 + my * .4) / Math.hypot(mx, my); faces.push([a, b, lit]);
    }
    faces.forEach(([a, b, lit]) => {
      const path = () => { c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(b[0], b[1] - h); c.lineTo(a[0], a[1] - h); c.closePath(); };
      const base = lit > .3 ? T.mid : lit > -.2 ? G.mix(T.mid, T.lo, .45) : T.lo;
      path(); const g = c.createLinearGradient(0, Math.min(a[1], b[1]) - h, 0, Math.max(a[1], b[1])); g.addColorStop(0, G.mix(base, T.hi, .25)); g.addColorStop(1, G.mix(base, T.ao, .25)); c.fillStyle = g; c.fill();
      path(); G.texture(c, [Math.min(a[0], b[0]), Math.min(a[1], b[1]) - h, Math.abs(b[0] - a[0]) + 1, Math.abs(b[1] - a[1]) + h], T, mat, .8);
      if (opt.stripes) { path(); G.stripesInPath(c, Math.min(a[0], b[0]), Math.min(a[1], b[1]) - h, Math.max(a[0], b[0]), Math.max(a[1], b[1]), opt.stripeStep); }
      c.beginPath(); c.moveTo(a[0], a[1] - h + .6); c.lineTo(b[0], b[1] - h + .6); c.strokeStyle = T.rim; c.lineWidth = 1; c.stroke();
      path(); G.stroke(c);
    });
    const top = () => { c.beginPath(); P.forEach(([x, y], i) => i ? c.lineTo(x, y - h) : c.moveTo(x, y - h)); c.closePath(); };
    top(); const g = c.createLinearGradient(cx - r, gy - h - r * G.K, cx + r, gy - h + r * G.K); g.addColorStop(0, G.mix(opt.top || T.hi, '#ffffff', .12)); g.addColorStop(1, G.mix(opt.top || T.hi, T.mid, .55)); c.fillStyle = g; c.fill();
    top(); G.texture(c, [cx - r, gy - h - r * G.K, r * 2, r * 2 * G.K], T, mat, .7);
    if (opt.chipped) { G.seed(r * 7); for (let i = 0; i < 3; i++) { const p = P[Math.floor(rnd() * m)]; G.ell(c, p[0] + (cx - p[0]) * .06, p[1] - h + (gy - p[1]) * .06, 2.5, 1.5, T.lo, 0); } }
    top(); G.stroke(c);
    return P.map(([x, y]) => [x, y - h]);
  };

  /** Box: (x,gy) front-bottom-left on ground; w, d (ground depth), h. opt: {top, stripes, mat, side:bool (show right face)} */
  G.box = (c, x, gy, w, d, h, col, opt) => {
    opt = opt || {}; const T = G.tones(col), dd = d * G.K, mat = opt.mat || 'paint', sk = opt.side === false ? 0 : Math.min(5, d * .35);
    // right side face (skewed) for depth
    if (sk) { c.beginPath(); c.moveTo(x + w, gy); c.lineTo(x + w + sk, gy - dd); c.lineTo(x + w + sk, gy - dd - h); c.lineTo(x + w, gy - h); c.closePath(); c.fillStyle = T.lo; c.fill(); G.stroke(c); }
    const front = () => { c.beginPath(); c.rect(x, gy - h, w, h); };
    front(); c.fillStyle = vgrad(c, gy - h, gy, { hi: G.mix(T.mid, T.hi, .35), mid: T.mid, lo: G.mix(T.mid, T.lo, .55) }); c.fill();
    front(); G.texture(c, [x, gy - h, w, h], T, mat);
    if (opt.stripes) { front(); G.stripesInPath(c, x, gy - h, x + w, gy); }
    front(); G.stroke(c);
    const topP = () => { c.beginPath(); c.moveTo(x, gy - h); c.lineTo(x + w, gy - h); c.lineTo(x + w + sk, gy - h - dd); c.lineTo(x + sk, gy - h - dd); c.closePath(); };
    topP(); c.fillStyle = opt.top || T.hi; c.fill(); topP(); G.texture(c, [x, gy - h - dd, w + sk, dd], T, mat, .6);
    c.beginPath(); c.moveTo(x + 1, gy - h + .6); c.lineTo(x + w - 1, gy - h + .6); c.strokeStyle = T.rim; c.lineWidth = 1; c.stroke();
    topP(); G.stroke(c);
  };
  G.boxC = (c, cx, gy, w, d, h, col, opt) => G.box(c, cx - w / 2, gy + d * G.K / 2, w, d, h, col, opt);

  /* ---------- direction helpers (Head layers) ----------
   * Head sheets have rows S, SE, E, NE, N (SW, W, NW are flipX in engine). World angle θ:
   * E = 0, S = +90° (toward camera). G.dir(name) -> {th, dx, dy, sx, sy, fs, ang, lx, ly}
   *   (dx,dy) world unit vector; (sx,sy) screen vector (y squashed by K); fs = foreshortening;
   *   ang = screen angle for G.tube; (lx,ly) screen vector of the gun's LEFT side. */
  G.DIRS = { S: 90, SE: 45, E: 0, NE: -45, N: -90 };
  G.dir = name => {
    const th = (G.DIRS[name] == null ? 45 : G.DIRS[name]) * Math.PI / 180, dx = Math.cos(th), dy = Math.sin(th);
    return { th, dx, dy, sx: dx, sy: dy * G.K, fs: Math.hypot(dx, dy * G.K), ang: Math.atan2(dy * G.K, dx), lx: dy, ly: -dx * G.K };
  };
  /** Oriented box on the ground plane: centre (cx,cy) on its base, length along world angle th,
   * width across it, height h. Draws visible side faces + top. Returns top-centre [x,y]. */
  G.obox = (c, cx, cy, len, wid, h, th, col, opt) => {
    opt = opt || {}; const T = G.tones(col), mat = opt.mat || 'paint';
    const dx = Math.cos(th), dy = Math.sin(th), lx = dy, ly = -dx;
    const W = [[len / 2, wid / 2], [len / 2, -wid / 2], [-len / 2, -wid / 2], [-len / 2, wid / 2]]
      .map(([u, w]) => [cx + dx * u + lx * w, cy + (dy * u + ly * w) * G.K]);
    for (let i = 0; i < 4; i++) {
      const a = W[i], b = W[(i + 1) % 4], mx = (a[0] + b[0]) / 2 - cx, my = ((a[1] + b[1]) / 2 - cy) / G.K;
      if (my <= .3) continue; const lit = (-mx * .75 + my * .4) / Math.hypot(mx, my);
      const p = () => { c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(b[0], b[1] - h); c.lineTo(a[0], a[1] - h); c.closePath(); };
      p(); c.fillStyle = lit > .3 ? T.mid : lit > -.2 ? G.mix(T.mid, T.lo, .45) : T.lo; c.fill();
      p(); G.texture(c, [Math.min(a[0], b[0]), Math.min(a[1], b[1]) - h, Math.abs(a[0] - b[0]) + 1, Math.abs(a[1] - b[1]) + h], T, mat, .8); p(); G.stroke(c);
    }
    const tp = () => { c.beginPath(); W.forEach(([x, y], i) => i ? c.lineTo(x, y - h) : c.moveTo(x, y - h)); c.closePath(); };
    tp(); c.fillStyle = opt.top || T.hi; c.fill(); tp(); G.texture(c, [cx - len / 2, cy - h - wid / 2, len, wid], T, mat, .5); tp(); G.stroke(c);
    return [cx, cy - h];
  };

  /** Tube/barrel from (x,y) along angle ang. opt: {bands, band, bandW, brake, open, cap, mat, wrap:[pos,len] cloth wrap, muzzleRing} */
  G.tube = (c, x, y, ang, L, r, col, opt) => {
    opt = opt || {}; const T = G.tones(col);
    c.save(); c.translate(x, y); c.rotate(ang);
    const body = () => { c.beginPath(); c.moveTo(0, -r); c.lineTo(L, -r); c.lineTo(L, r); c.lineTo(0, r); c.ellipse(0, 0, r * .45, r, 0, Math.PI / 2, Math.PI * 1.5, false); c.closePath(); };
    body(); c.fillStyle = vgrad(c, -r, r, T); c.fill();
    body(); G.texture(c, [0, -r, L, r * 2], T, opt.mat || 'metal', .8);
    // specular streak (metal)
    c.strokeStyle = G.rgba(T.rim, .9); c.lineWidth = Math.max(1, r * .22); c.beginPath(); c.moveTo(r * .5, -r * .55); c.lineTo(L - 2, -r * .55); c.stroke();
    body(); G.stroke(c);
    if (opt.wrap) { const [p, l] = opt.wrap, C = G.tones(G.P.cloth); c.beginPath(); c.rect(p, -r - .8, l, r * 2 + 1.6); c.fillStyle = vgrad(c, -r, r, C); c.fill(); for (let k = p + 2; k < p + l; k += 3) { c.strokeStyle = C.lo; c.lineWidth = .9; c.beginPath(); c.moveTo(k, -r); c.lineTo(k - 2, r); c.stroke(); } c.beginPath(); c.rect(p, -r - .8, l, r * 2 + 1.6); G.stroke(c); }
    if (opt.bands) { const B = G.tones(opt.band || G.P.brass); opt.bands.forEach(p => { const bw = opt.bandW || 3.5; c.beginPath(); c.rect(p, -r - .7, bw, r * 2 + 1.4); c.fillStyle = vgrad(c, -r, r, B); c.fill(); G.stroke(c, 1.2); c.fillStyle = B.rim; c.fillRect(p + .6, -r * .7, bw - 1.2, 1); }); }
    if (opt.brake) { const R = r * 1.3, bx = L - 8; c.beginPath(); c.rect(bx, -R, 7, R * 2); c.fillStyle = vgrad(c, -R, R, T); c.fill(); G.stroke(c); c.fillStyle = G.OUT; c.fillRect(bx + 2, -R + 2, 3, 2); c.fillRect(bx + 2, R - 4, 3, 2); }
    const capT = G.tones(opt.cap || T.mid);
    if (opt.muzzleRing) { G.ell(c, L, 0, r * .55, r * 1.18, capT.hi, G.INNER); }
    G.ell(c, L, 0, r * .45, r, capT.hi, G.INNER);
    if (opt.open !== false) { G.ell(c, L + .3, 0, r * .3, r * .7, G.OUT, 0); G.ell(c, L - .2, -r * .25, r * .1, r * .2, G.rgba(capT.rim, .5), 0); }
    c.restore();
    return [x + Math.cos(ang) * L, y + Math.sin(ang) * L];
  };

  /** Horizontal cylinder (tank) lying left-right, centre (cx,cy). opt: {bands, band, mat, capRight} */
  G.hcyl = (c, cx, cy, len, r, col, opt) => {
    opt = opt || {}; const T = G.tones(col), x0 = cx - len / 2, x1 = cx + len / 2;
    const body = () => { c.beginPath(); c.moveTo(x0, cy - r); c.lineTo(x1, cy - r); c.ellipse(x1, cy, r * .42, r, 0, -Math.PI / 2, Math.PI / 2, false); c.lineTo(x0, cy + r); c.ellipse(x0, cy, r * .42, r, 0, Math.PI / 2, Math.PI * 1.5, false); c.closePath(); };
    body(); c.fillStyle = vgrad(c, cy - r, cy + r, T); c.fill(); body(); G.texture(c, [x0, cy - r, len, r * 2], T, opt.mat || 'paint');
    c.strokeStyle = G.rgba(T.rim, .8); c.lineWidth = Math.max(1, r * .2); c.beginPath(); c.moveTo(x0 + 2, cy - r * .55); c.lineTo(x1 - 2, cy - r * .55); c.stroke();
    if (opt.bands) opt.bands.forEach(p => { c.fillStyle = opt.band || G.P.hazard; c.fillRect(x0 + p, cy - r + 1, 3, r * 2 - 2); });
    body(); G.stroke(c);
    if (opt.capRight !== false) G.ell(c, x1, cy, r * .42, r, T.hi);
  };

  /** Dome on base ellipse (cx, by, rx), height h. */
  G.dome = (c, cx, by, rx, h, col, opt) => {
    opt = opt || {}; const T = G.tones(col), ry = rx * G.K;
    const p = () => { c.beginPath(); c.moveTo(cx - rx, by); c.ellipse(cx, by, rx, ry, 0, Math.PI, 0, true); c.ellipse(cx, by, rx, h, 0, 0, Math.PI, true); c.closePath(); };
    p(); const g = c.createRadialGradient(cx - rx * .4, by - h * .7, 1, cx, by - h * .3, rx * 1.3); g.addColorStop(0, T.rim); g.addColorStop(.25, T.hi); g.addColorStop(.6, T.mid); g.addColorStop(1, T.lo); c.fillStyle = g; c.fill();
    p(); G.texture(c, [cx - rx, by - h, rx * 2, h + ry], T, opt.mat || 'metal', .7); p(); G.stroke(c);
  };

  G.sphere = (c, x, y, r, col) => {
    const T = G.tones(col); G.ellPath(c, x, y, r, r);
    const g = c.createRadialGradient(x - r * .4, y - r * .45, r * .1, x, y, r); g.addColorStop(0, T.rim); g.addColorStop(.3, T.hi); g.addColorStop(.7, T.mid); g.addColorStop(1, T.lo);
    c.fillStyle = g; c.fill(); G.stroke(c);
  };

  /** Thick bar between two points (legs, braces, pipes, rebar). */
  G.bar = (c, x1, y1, x2, y2, w, col) => {
    const T = G.tones(col); c.lineCap = 'round';
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.lineWidth = w + 2.4; c.strokeStyle = G.OUT; c.stroke();
    c.lineWidth = w; c.strokeStyle = T.mid; c.stroke();
    if (w >= 2.5) { c.lineWidth = Math.max(.9, w * .32); c.strokeStyle = T.hi; const ox = -w * .22, oy = -w * .22; c.beginPath(); c.moveTo(x1 + ox, y1 + oy); c.lineTo(x2 + ox, y2 + oy); c.stroke(); }
  };
  /** Polygon with material fill (any custom plate / shield / panel). pts = [[x,y],...] */
  G.poly = (c, pts, col, opt) => {
    opt = opt || {}; const T = G.tones(col); const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const bb = [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
    const p = () => { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); };
    p(); const g = c.createLinearGradient(bb[0], bb[1], bb[0] + bb[2], bb[1] + bb[3]); g.addColorStop(0, opt.flat ? T.mid : T.hi); g.addColorStop(.5, T.mid); g.addColorStop(1, opt.flat ? T.mid : T.lo); c.fillStyle = opt.fill || g; c.fill();
    p(); G.texture(c, bb, T, opt.mat || 'paint', opt.tex);
    if (opt.stripes) { p(); G.stripesInPath(c, bb[0], bb[1], bb[0] + bb[2], bb[1] + bb[3]); }
    p(); G.stroke(c, opt.w);
  };
  G.wire = (c, pts, col, w) => { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.lineWidth = w || 1.2; c.strokeStyle = col || G.OUT; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(); };
  /** Hose / cable: outlined thick curve through points (quadratic smoothing). */
  G.hose = (c, pts, w, col) => {
    const T = G.tones(col || G.P.rubber); const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; c.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); } const l = pts[pts.length - 1]; c.lineTo(l[0], l[1]); };
    c.lineCap = 'round'; c.lineJoin = 'round';
    path(); c.lineWidth = w + 2.4; c.strokeStyle = G.OUT; c.stroke(); path(); c.lineWidth = w; c.strokeStyle = T.mid; c.stroke();
    path(); c.lineWidth = Math.max(.8, w * .3); c.strokeStyle = T.hi; c.save(); c.translate(-w * .2, -w * .25); c.stroke(); c.restore();
  };

  /** One sandbag — lumpy, with a tie and stitching. */
  G.bag = (c, x, y, col, w, h, rot) => {
    w = w || 13; h = h || 8; const T = G.tones(col || G.P.sand);
    c.save(); c.translate(x, y); c.rotate(rot || 0);
    const p = () => { c.beginPath(); c.moveTo(-w / 2 + 2, -h / 2); c.quadraticCurveTo(0, -h / 2 - 1.4, w / 2 - 2, -h / 2); c.quadraticCurveTo(w / 2 + 1, 0, w / 2 - 2, h / 2); c.quadraticCurveTo(0, h / 2 + 1, -w / 2 + 2, h / 2); c.quadraticCurveTo(-w / 2 - 1, 0, -w / 2 + 2, -h / 2); c.closePath(); };
    p(); c.fillStyle = vgrad(c, -h / 2, h / 2, T); c.fill(); p(); G.texture(c, [-w / 2, -h / 2, w, h], T, 'cloth', 1.4);
    c.strokeStyle = G.rgba(T.lo, .8); c.lineWidth = .8; c.setLineDash([1.2, 1.2]); c.beginPath(); c.moveTo(-w / 2 + 3, h * .1); c.lineTo(w / 2 - 3, h * .1); c.stroke(); c.setLineDash([]);
    c.strokeStyle = T.rim; c.lineWidth = 1; c.beginPath(); c.moveTo(-w / 2 + 3, -h / 2 + 1.2); c.quadraticCurveTo(0, -h / 2 + .3, w / 2 - 4, -h / 2 + 1.2); c.stroke();
    p(); G.stroke(c, 1.3);
    c.restore();
  };
  /** Ring / arc of sandbags on a ground ellipse. part 'back'|'front'|'all'. opt: {skip:[a0,a1], phase, jitter, w, h, col, squash} */
  G.bags = (c, cx, gy, r, n, part, opt) => {
    opt = opt || {}; const pts = []; G.seed(Math.round(r * 17 + n));
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 + (opt.phase || 0.2), na = ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      if (opt.skip && na > opt.skip[0] && na < opt.skip[1]) continue;
      const s = Math.sin(a); if (part === 'back' && s > 0) continue; if (part === 'front' && s <= 0) continue;
      const j = opt.jitter ? (rnd() - .5) * 2.4 : 0;
      pts.push([cx + Math.cos(a) * r + j, gy + s * r * (opt.squash || G.K) + j * .5, (rnd() - .5) * .25 + Math.cos(a) * .15]);
    }
    pts.sort((p, q) => p[1] - q[1]).forEach(p => G.bag(c, p[0], p[1], opt.col, opt.w, opt.h, p[2]));
  };

  /** Lamp: glass bulb with hard-edged glow rings (no soft bloom). */
  G.lamp = (c, x, y, col, on, r) => {
    r = r || 2.6;
    if (on !== false) { G.ellPath(c, x, y, r * 2.6, r * 2.4); c.fillStyle = G.rgba(col, .18); c.fill(); G.ellPath(c, x, y, r * 1.7, r * 1.6); c.fillStyle = G.rgba(col, .3); c.fill(); }
    G.ell(c, x, y, r, r, on === false ? G.mix(col, G.OUT, .55) : col, 1.2);
    if (on !== false) G.ell(c, x - r * .35, y - r * .35, r * .35, r * .35, '#fffbe8', 0);
  };
  G.halo = (c, x, y, r, col) => { [[r, .16], [r * .62, .3]].forEach(([rr, a]) => { G.ellPath(c, x, y, rr, rr * .9); c.fillStyle = G.rgba(col, a); c.fill(); }); };
  /** Round gauge (glass + needle). */
  G.gauge = (c, x, y, r, val) => {
    G.ell(c, x, y, r + 1.2, r + 1.2, G.P.brass.mid, G.INNER); G.ell(c, x, y, r, r, '#f4efe0', 0);
    c.strokeStyle = '#e2412f'; c.lineWidth = 1; const a = Math.PI * (.75 + (val == null ? .5 : val) * 1.5); c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * r * .85, y + Math.sin(a) * r * .85); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = .8; c.beginPath(); c.arc(x, y, r * .7, Math.PI * 1.1, Math.PI * 1.5); c.stroke();
  };
  G.plank = (c, x, y, w, h, col) => { const T = G.tones(col || G.P.wood); const p = () => { c.beginPath(); c.rect(x, y, w, h); }; p(); c.fillStyle = vgrad(c, y, y + h, T); c.fill(); p(); G.texture(c, [x, y, w, h], T, 'wood', 1.2); p(); G.stroke(c, 1.2); c.fillStyle = G.OUT; c.fillRect(x + 2, y + h / 2 - .5, 1, 1); c.fillRect(x + w - 3, y + h / 2 - .5, 1, 1); };
  G.rivets = (c, x1, y1, x2, y2, n, col) => { for (let i = 0; i < n; i++) { const t = n === 1 ? .5 : i / (n - 1), x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t; G.ell(c, x, y, .95, .95, G.OUT, 0); G.ell(c, x - .3, y - .3, .45, .45, col || '#c7d0dc', 0); } };
  G.puff = (c, x, y, r, a, col) => G.fx(c, c => { c.save(); c.globalAlpha = a == null ? .9 : a; const T = G.tones(col || '#efeaf3'); G.ellPath(c, x, y, r, r); const g = c.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r); g.addColorStop(0, T.rim); g.addColorStop(.6, T.mid); g.addColorStop(1, T.lo); c.fillStyle = g; c.fill(); G.stroke(c, 1.1); c.restore(); });

  window.G = G;
  window.TOWERS = window.TOWERS || {};
})();
