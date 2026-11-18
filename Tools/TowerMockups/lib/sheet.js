/* PROTOTYPE - NOT FOR PRODUCTION */
/* Sprite-sheet assembly (art bible §8): 1 file = 1 (tier, layer, anim); 1 row per anim,
 * frames left→right, no padding; Head sheets have 5 rows S, SE, E, NE, N (others flipX).
 *
 * Sheet definition (in each tower's `sheets` array):
 *   { file, tier, layer: 'base'|'head', anim, frames, fps }
 * anim 'build' | 'upgrade' | 'destroy' use lib/anim.js; anything else calls tw.state().
 */
(function () {
  const SH = {};
  SH.DIRS = ['S', 'SE', 'E', 'NE', 'N'];

  SH.drawFrame = (c, S, tw, def, f, dir) => {
    const n = def.frames;
    if (def.anim === 'build') return A.build(c, S, tw, f, n);
    if (def.anim === 'upgrade') return A.upgrade(c, S, tw, def.tier, f, n);
    if (def.anim === 'destroy') return A.destroy(c, S, tw, def.tier, f, n);
    const s = tw.state(def.tier, def.anim, f, n);
    if (def.layer === 'head') tw.head(c, def.tier, s, dir || 'SE'); else tw.base(c, def.tier, s);
  };

  /** Render a whole sheet. Returns a canvas (frames*128*S) × (rows*128*S). */
  SH.render = (tw, def, S) => {
    S = S || 1; const rows = def.layer === 'head' ? 5 : 1;
    const cv = A.mk(def.frames * 128 * S, rows * 128 * S); const c = cv.getContext('2d');
    for (let r = 0; r < rows; r++) for (let f = 0; f < def.frames; f++) {
      // rubble frames stay outline-free (art bible §7)
      const rubble = def.anim === 'destroy' && f >= def.frames - 2;
      const fr = SH.layered(S, o => SH.drawFrame(o, S, tw, def, f, SH.DIRS[r]), !rubble);
      c.drawImage(fr, f * 128 * S, r * 128 * S);
    }
    return cv;
  };
  SH.OUTLINE = 1.3;
  /** Render fn with layers: ground (no outline) → body (thick silhouette outline) → fx (no outline). */
  SH.layered = (S, fn, outline) => {
    G.DEFER = { ground: [], fx: [] };
    let body; try { body = A.off(S, o => { o.beginPath(); o.rect(0, 0, 128, 128); o.clip(); fn(o); }); } finally { var D = G.DEFER; G.DEFER = null; }
    const out = A.mk(128 * S, 128 * S), c = out.getContext('2d');
    D.ground.forEach(g => g(c));
    c.drawImage(outline === false ? body : A.outline(body, SH.OUTLINE * S), 0, 0);
    D.fx.forEach(g => g(c));
    return out;
  };
  /** Body only (no ground, no fx) — for silhouette tests. */
  SH.body = (S, fn) => { G.DEFER = { ground: [], fx: [] }; try { return A.off(S, fn); } finally { G.DEFER = null; } };
  /** Composite idle/any state with layers (used by previews). */
  SH.still = (tw, tier, s, S) => SH.layered(S || 1, o => A.composite(o, tw, tier, s || tw.state(tier, 'idle', 0, 2)));

  /** Preview~/_preview_tower.png: 512×256. Row 1: t0,t1,t2 idle + t2 action; row 2: same as
   * #2c2240 silhouettes blurred 2 px. Background: left half night, right half white plains. */
  SH.preview = (tw) => {
    const cv = A.mk(512, 256), c = cv.getContext('2d');
    c.fillStyle = '#1e2a4a'; c.fillRect(0, 0, 256, 256); c.fillStyle = '#f1ece0'; c.fillRect(256, 0, 256, 256);
    const act = tw.sheets.find(s => s.tier === 2 && !['idle', 'build', 'upgrade', 'destroy'].includes(s.anim));
    const cells = [[0, 'idle', 0], [1, 'idle', 0], [2, 'idle', 0], [2, act ? act.anim : 'idle', 0]];
    cells.forEach(([t, anim, f], i) => {
      const draw = o => { if (anim === 'idle') A.composite(o, tw, t, tw.state(t, 'idle', 0, 2)); else { tw.base(o, t, tw.state(t, anim, f, act.frames)); if (tw.head) { const [hx, hy] = tw.headPos[t]; o.save(); o.translate(hx - 64, hy - 64); tw.head(o, t, tw.state(t, anim, 1, act.frames), 'SE'); o.restore(); } } };
      c.drawImage(SH.layered(1, draw), i * 128, 0);
      const sil = A.tint(SH.body(1, o => A.composite(o, tw, t, tw.state(t, 'idle', 0, 2))), '#2c2240', 1); c.save(); c.filter = 'blur(2px)'; c.drawImage(sil, i * 128, 128); c.restore();
    });
    return cv;
  };

  window.SH = SH;
})();
