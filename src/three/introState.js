// ============================================================
// SCROLL-DRIVEN 3D STATE
// A mutable, JS-only object read each frame by the R3F scene.
// No React state is involved -> zero re-renders while scrolling.
// ============================================================

export const sceneState = {
  p: 0,
  x: 0,
  y: 0,
  z: -26,
  rotY: 0.22,
  rotX: -0.04,
  sep: 0,
  blueprint: 0,
  scale: 1,
  reveal: 0, // 0..1 when the canvas should fade into the site
};

const clamp = (v, a, b) => Math.min(b, Math.max(v, a));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function kf(points) {
  const pts = [...points].sort((a, b) => a[0] - b[0]);
  return (p) => {
    if (p <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      if (p <= pts[i][0]) {
        const [t0, v0] = pts[i - 1];
        const [t1, v1] = pts[i];
        const t = clamp((p - t0) / (t1 - t0), 0, 1);
        return lerp(v0, v1, easeInOut(t));
      }
    }
    return pts[pts.length - 1][1];
  };
}

// --- Keyframe curves mapped across scroll progress (0..1) ---
// structure world distance (negative z = in front of camera)
const kz = kf([
  [0, -26], [0.2, -22], [0.4, -18], [0.6, -14], [0.7, -11], [0.8, -7], [0.9, -3], [1, 0.4],
]);
// x offset: model sits off-centre (right) at rest, drifting back to centre
const kx = kf([
  [0, 2.6], [0.25, 2.35], [0.45, 1.1], [0.62, 0.2], [0.8, -0.6], [0.9, 0.4], [1, 0.05],
]);
const ky = kf([
  [0, -0.1], [0.25, 0.2], [0.4, 0.55], [0.6, 0.8], [0.8, 1.15], [0.9, 1.4], [1, 1.55],
]);
const krotY = kf([
  [0, 0.22], [0.35, 0.5], [0.5, 0.8], [0.65, 1.5], [0.8, 1.9], [1, 2.1],
]);
const krotX = kf([
  [0, -0.04], [0.7, -0.05], [0.85, 0.04], [1, 0.11],
]);
const ksep = kf([
  [0, 0], [0.55, 0], [0.63, 0.4], [0.74, 0.62], [0.82, 0.4], [1, 0.22],
]);
const kblue = kf([
  [0, 0], [0.6, 0], [0.66, 0.4], [0.78, 1], [1, 1],
]);
const kscale = kf([
  [0, 1], [0.86, 1], [0.9, 0.92], [0.95, 0.6], [0.98, 0.3], [1, 0.12],
]);

export function writeIntroState(p) {
  const P = clamp(p, 0, 1);
  sceneState.p = P;
  sceneState.x = kx(P);
  sceneState.y = ky(P);
  sceneState.z = kz(P);
  sceneState.rotY = krotY(P);
  sceneState.rotX = krotX(P);
  sceneState.sep = ksep(P);
  sceneState.blueprint = kblue(P);
  sceneState.scale = kscale(P);
  sceneState.reveal = clamp((P - 0.9) / 0.1, 0, 1);
}

// Static, composed "hero" state for reduced-motion / no-WebGL fallback.
export const staticSceneState = {
  p: 0.55,
  x: kx(0.55),
  y: ky(0.55),
  z: kz(0.55),
  rotY: krotY(0.55),
  rotX: krotX(0.55),
  sep: ksep(0.55),
  blueprint: kblue(0.55),
  scale: kscale(0.55),
  reveal: 0,
};