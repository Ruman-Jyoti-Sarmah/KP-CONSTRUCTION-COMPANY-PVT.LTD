// ============================================================
// JOURNEY STATE — one continuous 3D story for the whole site.
// Page scroll (0..1) drives a single mutable state object read
// every frame by the R3F journey scene. Zero React re-renders.
//
//   0–0.20  approach the tower (it assembles as you arrive)
//   0.20–0.40  structure separates, camera passes through
//   0.40–0.55  PROJECTS   floating architectural panels
//   0.55–0.70  SERVICES   architectural modules
//   0.70–0.82  ABOUT      model wall
//   0.82–0.92  BLUEPRINT  wireframe + grid
//   0.92–1.00  CONTACT    completed space (warm)
// ============================================================

export const journeyState = {
  p: 0,
  build: 0, // tower assembly 0..1
  split: 0, // structural separation 0..1
  glass: 1, // glass shell opacity
  camx: 7,
  camy: 1.6,
  camz: 14,
  lookY: 2.2,
  roll: 0,
  debris: 0,
  zones: { projects: 0, services: 0, about: 0, blueprint: 0, contact: 0 },
  bgWarm: 0, // 0 = night ivory/charcoal, 1 = warm contact space
};

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
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
        return v0 + (v1 - v0) * easeInOut(t);
      }
    }
    return pts[pts.length - 1][1];
  };
}

// --- camera travel along -Z (desktop stops) ---
const kz = kf([
  [0, 14], [0.18, 7], [0.3, 3], [0.42, -2],
  [0.52, -19], [0.66, -41], [0.78, -59], [0.88, -74], [1, -88],
]);
// mobile stops sit farther back (portrait has a narrower view)
const kzM = kz ? null : null;

const kx = kf([
  [0, 7], [0.15, 4.2], [0.3, 1.2], [0.52, 0.6], [0.7, -1.1], [0.9, 0.2], [1, 0],
]);
const ky = kf([
  [0, 1.6], [0.25, 2.5], [0.5, 2.7], [0.75, 2.2], [1, 2.5],
]);
const klookY = kf([
  [0, 2.0], [0.3, 2.4], [0.55, 2.6], [0.8, 2.3], [1, 2.4],
]);
const kroll = kf([
  [0, 0], [0.4, 0.02], [0.7, -0.02], [1, 0],
]);

const kbuild = kf([[0, 0.07], [0.16, 1]]);
const ksplit = kf([[0.2, 0], [0.33, 1], [0.6, 1], [0.78, 1]]);
const kglass = kf([[0.24, 1], [0.42, 0.12]]);
const kdebris = kf([[0.14, 0], [0.3, 0.85], [0.88, 0.85], [1, 0.35]]);

const zoneKf = {
  projects: kf([[0.34, 0], [0.42, 1], [0.6, 1], [0.68, 0]]),
  services: kf([[0.52, 0], [0.6, 1], [0.74, 1], [0.8, 0]]),
  about: kf([[0.68, 0], [0.74, 1], [0.86, 1], [0.9, 0]]),
  blueprint: kf([[0.78, 0], [0.85, 1], [1, 1]]),
  contact: kf([[0.88, 0], [0.94, 1], [1, 1]]),
};

const kbgWarm = kf([[0.9, 0], [1, 1]]);

// Portrait cameras need the stops set slightly further back.
let mobileZOffset = 0;
export function applyMobileJourney(mobile) {
  mobileZOffset = mobile ? 1.8 : 0;
}

export function writeJourneyState(p) {
  const P = clamp(p, 0, 1);
  const s = journeyState;
  s.p = P;
  s.build = kbuild(P);
  s.split = ksplit(P);
  s.glass = kglass(P);
  s.camx = kx(P);
  s.camy = ky(P);
  s.camz = kz(P) + mobileZOffset;
  s.lookY = klookY(P);
  s.roll = kroll(P);
  s.debris = kdebris(P);
  s.bgWarm = kbgWarm(P);
  for (const key of Object.keys(zoneKf)) s.zones[key] = zoneKf[key](P);
}
