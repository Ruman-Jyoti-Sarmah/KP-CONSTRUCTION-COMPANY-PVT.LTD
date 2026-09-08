import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { journeyState } from "./journeyState.js";
import { supportsWebGL, useIsMobile } from "../hooks/useMedia.js";

// ============================================================
// JOURNEY SCENE — one fixed 3D environment behind the whole site.
// The camera travels through zones laid out along -Z as the user
// scrolls. HTML sections float above as translucent "spaces".
// ============================================================

const Z = { tower: 0, projects: -26, services: -48, about: -66, blueprint: -82, contact: -96 };
const TOWER_H = 5.2;
const MODEL_Y = -TOWER_H / 2;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOut = (t) => 1 - Math.pow(1 - clamp01(t), 3);

// Tower parts — assembled during the intro (build 0..1 maps to scroll 0–0.16).
const FLOOR_H = 1.06;
const SLAB_H = 0.12;
const B0 = 0.18;

function towerParts() {
  const parts = [];
  const push = (o) => parts.push(o);
  // foundation
  push({ pos: [0, 0.09, 0], size: [2.6, 0.18, 2.6], mat: "concrete", win: [0, 0.06], mode: "pop", g: "base" });
  push({ pos: [0, 0.025, 0], size: [2.7, 0.05, 2.7], mat: "bronze", win: [0.05, 0.11], mode: "pop", g: "base" });
  push({ disc: true, pos: [0, -0.02, 0], r: 6, mat: "ground", win: [0, 0.1], mode: "fade", g: "base" });
  // core
  push({ pos: [0, B0, 0], size: [0.72, 4.62, 0.72], mat: "concrete", win: [0.09, 0.5], mode: "growY", g: "base" });
  // floors: columns + slabs
  for (let f = 0; f < 4; f++) {
    const base = B0 + f * (FLOOR_H + SLAB_H);
    for (const x of [-0.85, 0.85]) {
      for (const z of [-0.85, 0.85]) {
        push({ pos: [x, base, z], size: [0.14, FLOOR_H, 0.14], mat: "steelDark", win: [0.13 + f * 0.11, 0.21 + f * 0.11], mode: "pop", g: "frame" });
      }
    }
    push({ pos: [0, base + FLOOR_H + SLAB_H / 2, 0], size: [2.12, SLAB_H, 2.12], mat: "stone", win: [0.22 + f * 0.11, 0.3 + f * 0.11], mode: "pop", g: "frame" });
  }
  // glass shell
  for (let f = 0; f < 4; f++) {
    const base = B0 + f * (FLOOR_H + SLAB_H) + 0.03;
    const h = FLOOR_H - 0.06;
    const s = 0.55 + f * 0.07, e = 0.66 + f * 0.07;
    push({ pos: [0, base + h / 2, 1.045], size: [2.0, h, 0.05], mat: "glass", win: [s, e], mode: "fade", g: "shell" });
    push({ pos: [0, base + h / 2, -1.045], size: [2.0, h, 0.05], mat: "glass", win: [s, e], mode: "fade", g: "shell" });
    push({ pos: [1.045, base + h / 2, 0], size: [0.05, h, 2.0], mat: "glass", win: [s, e], mode: "fade", g: "shell" });
    push({ pos: [-1.045, base + h / 2, 0], size: [0.05, h, 2.0], mat: "glass", win: [s, e], mode: "fade", g: "shell" });
  }
  // bronze mullions
  for (const x of [-1.06, 1.06]) {
    for (const z of [-1.06, 1.06]) {
      push({ pos: [x, B0, z], size: [0.07, 4.6, 0.07], mat: "bronze", win: [0.68, 0.82], mode: "fade", g: "shell" });
    }
  }
  // wings: split groups
  push({ pos: [1.85, 0.9, 0.3], size: [0.9, 1.8, 0.9], mat: "steelDark", win: [0.5, 0.66], mode: "pop", g: "wingA" });
  push({ pos: [1.85, 1.86, 0.3], size: [1.0, 0.1, 1.0], mat: "bronze", win: [0.6, 0.74], mode: "fade", g: "wingA" });
  push({ pos: [-1.85, 1.3, -0.2], size: [0.8, 2.6, 0.8], mat: "stone", win: [0.55, 0.72], mode: "pop", g: "wingB" });
  push({ pos: [-1.85, 2.66, -0.2], size: [0.9, 0.08, 0.9], mat: "bronze", win: [0.66, 0.8], mode: "fade", g: "wingB" });
  // roof + crown
  const top = B0 + 4 * (FLOOR_H + SLAB_H);
  push({ pos: [0, top + 0.08, 0], size: [2.3, 0.16, 2.3], mat: "white", win: [0.78, 0.86], mode: "pop", g: "base" });
  push({ pos: [0, top + 0.19, 0], size: [2.34, 0.04, 2.34], mat: "bronze", win: [0.84, 0.92], mode: "fade", g: "base" });
  push({ pos: [0, top + 0.5, 0], size: [0.12, 0.62, 1.1], mat: "bronze", win: [0.88, 0.96], mode: "pop", g: "base" });
  return parts;
}

// Palette — matches the site identity (dark ivory/charcoal + muted bronze).
function makeMaterials() {
  const M = (def) => new THREE.MeshStandardMaterial({ ...def, transparent: true });
  return {
    concrete: M({ color: "#1f2329", roughness: 0.95, metalness: 0.05 }),
    stone: M({ color: "#2a2d33", roughness: 0.85, metalness: 0.15 }),
    white: M({ color: "#3a4149", roughness: 0.7, metalness: 0.2 }),
    steelDark: M({ color: "#4a5058", roughness: 0.4, metalness: 0.85 }),
    glass: M({ color: "#10151a", roughness: 0.08, metalness: 0.6, opacity: 0.55 }),
    bronze: M({ color: "#d9a84e", emissive: "#d9a84e", emissiveIntensity: 0.7, roughness: 0.35, metalness: 0.4 }),
    ground: M({ color: "#0d1014", roughness: 0.98, metalness: 0 }),
    panel: M({ color: "#262b31", roughness: 0.6, metalness: 0.3 }),
    panelScreen: M({ color: "#e8e2d4", roughness: 0.35, metalness: 0.1, emissive: "#8d867a", emissiveIntensity: 0.12 }),
    projAccent: M({ color: "#d9a84e", emissive: "#d9a84e", emissiveIntensity: 0.6, roughness: 0.35 }),
    module: M({ color: "#2e343b", roughness: 0.5, metalness: 0.4 }),
    servAccent: M({ color: "#d9a84e", emissive: "#d9a84e", emissiveIntensity: 0.6, roughness: 0.35 }),
    wall: M({ color: "#23282e", roughness: 0.75, metalness: 0.2 }),
    aboutAccent: M({ color: "#d9a84e", emissive: "#d9a84e", emissiveIntensity: 0.6, roughness: 0.35 }),
    blueprint: M({ color: "#d9a84e", emissive: "#d9a84e", emissiveIntensity: 0.9, roughness: 0.4 }),
    contact: M({ color: "#d9a84e", emissive: "#d9a84e", emissiveIntensity: 0.55, roughness: 0.4, metalness: 0.35 }),
    debris: M({ color: "#3a4149", roughness: 0.6, metalness: 0.4 }),
  };
}

function Runtime({ isMobile }) {
  const parts = useMemo(towerParts, []);
  const refs = useRef({});
  const groups = useRef({});
  const { camera, scene } = useThree();

  const materials = useMemo(makeMaterials, []);
  const SPREAD = isMobile ? 0.55 : 1;
  const coldBg = useMemo(() => new THREE.Color("#0b0d10"), []);
  const warmBg = useMemo(() => new THREE.Color("#181310"), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    scene.fog = new THREE.Fog(new THREE.Color("#0b0d10"), 9, 46);
    scene.background = new THREE.Color("#0b0d10");
    const created = Object.values(materials);
    const geometries = [];
    Object.values(groups.current).forEach((g) =>
      g?.traverse?.((o) => {
        if (o.geometry) geometries.push(o.geometry);
      })
    );
    return () => {
      created.forEach((m) => m.dispose());
      geometries.forEach((g) => g.dispose());
      scene.fog = null;
      scene.background = null;
    };
  }, [scene, materials]);

  useFrame((_, delta) => {
    const s = journeyState;
    const t = performance.now() / 1000;
    const dt = Math.min(delta || 1 / 60, 0.05);

    // cinematic camera travel along -Z with gentle orbital sway
    camera.position.set(s.camx * (isMobile ? 0.45 : 1), s.camy, s.camz);
    camera.lookAt(s.camx * 0.12, s.lookY, s.camz - 8);
    camera.rotateZ(s.roll);

    // environment warmth at the final space
    tmpColor.copy(coldBg).lerp(warmBg, s.bgWarm);
    if (scene.background && scene.background.isColor) scene.background.copy(tmpColor);
    if (scene.fog) scene.fog.color.copy(tmpColor);

    // tower assembly
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const g = refs.current[i];
      if (!g) continue;
      const p = easeOut((s.build - part.win[0]) / (part.win[1] - part.win[0]));
      if (part.mode === "growY") g.scale.set(1, Math.max(p, 0.0001), 1);
      else g.scale.setScalar(Math.max(p, 0.0001));
      if (part.mode === "fade") g.position.y = part.pos[1] + (1 - p) * -0.3;
    }

    // structural separation (20–40%)
    const sp = s.split;
    if (groups.current.wingA) groups.current.wingA.position.x = sp * 1.6;
    if (groups.current.wingB) groups.current.wingB.position.x = -sp * 1.6;
    if (groups.current.frame) groups.current.frame.scale.x = 1 + sp * 0.55;
    materials.glass.opacity = 0.55 * s.glass;
    materials.bronze.emissiveIntensity = 0.7 * (0.4 + 0.6 * s.glass);

    // zone fades
    const zOp = s.zones;
    const setZone = (matNames, op, group) => {
      for (const n of matNames) materials[n].opacity = op;
      if (groups.current[group]) groups.current[group].visible = op > 0.02;
    };
    setZone(["panel", "panelScreen", "projAccent"], zOp.projects, "projectsZone");
    setZone(["module", "servAccent"], zOp.services, "servicesZone");
    setZone(["wall", "aboutAccent"], zOp.about, "aboutZone");
    setZone(["blueprint"], zOp.blueprint, "blueprintZone");
    setZone(["contact"], zOp.contact, "contactZone");
    materials.debris.opacity = s.debris;
    if (groups.current.debris) groups.current.debris.visible = s.debris > 0.02;

    if (groups.current.blueprintZone) groups.current.blueprintZone.position.y = Math.sin(t * 0.4) * 0.06;

    if (groups.current.debris) {
      groups.current.debris.children.forEach((c, i) => {
        c.rotation.y += dt * (0.12 + i * 0.02);
        c.rotation.x += dt * 0.06;
        c.position.y = c.userData.baseY + Math.sin(t * 0.5 + i * 1.7) * 0.25;
      });
    }
  });

  const M = materials;
  const reg = (i) => (el) => {
    if (el) refs.current[i] = el;
  };
  const gref = (name) => (el) => {
    if (el) groups.current[name] = el;
  };
  const renderParts = (gname) =>
    parts.map((part, i) =>
      part.g === gname ? (
        <group key={i} ref={reg(i)} position={part.pos}>
          {part.disc ? (
            <mesh material={M[part.mat]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[part.r, 40]} />
            </mesh>
          ) : (
            <mesh material={M[part.mat]}>
              <boxGeometry args={part.size} />
            </mesh>
          )}
        </group>
      ) : null
    );

  // Projects: four floating architectural panels in a shallow arc.
  const panels = [0, 1, 2, 3].map((i) => {
    const a = (i - 1.5) * 0.42;
    return { x: Math.sin(a) * 7.5 * SPREAD, z: -(1 - Math.cos(a)) * 2.2, ry: -a * 0.9, y: 2.7 };
  });

  // Services: six architectural modules in two columns.
  const modules = [];
  for (let c = 0; c < 2; c++) {
    for (let r = 0; r < 3; r++) {
      modules.push({ x: (c === 0 ? -1 : 1) * 2.5 * SPREAD, y: 1.3 + r * 1.5, z: -(c * 1.4) });
    }
  }

  // Blueprint grid lines.
  const gridLines = [];
  for (let i = -5; i <= 5; i++) {
    gridLines.push({ pos: [i * 1.6, 0.02, 0], size: [0.02, 0.02, 16] });
    gridLines.push({ pos: [0, 0.02, i * 1.6], size: [16, 0.02, 0.02] });
  }

  return (
    <>
      {/* soft architectural lighting */}
      <ambientLight intensity={0.55} color="#cdd6e0" />
      <directionalLight position={[6, 10, 6]} intensity={1.15} color="#ffe7bd" />
      <directionalLight position={[-6, 4, -5]} intensity={0.35} color="#8fb3d9" />
      <pointLight position={[0, 3, 4]} intensity={0.5} color="#d9a84e" />
      <pointLight position={[0, 3, Z.projects + 6]} intensity={0.7} color="#d9a84e" distance={14} />
      <pointLight position={[0, 3, Z.contact + 6]} intensity={1.2} color="#e8b95f" distance={18} />

      {/* ============ TOWER ZONE — assembles, then separates ============ */}
      <group position={[0, MODEL_Y, Z.tower]}>
        <group ref={gref("base")}>{renderParts("base")}</group>
        <group ref={gref("frame")}>{renderParts("frame")}</group>
        <group ref={gref("shell")}>{renderParts("shell")}</group>
        <group ref={gref("wingA")}>{renderParts("wingA")}</group>
        <group ref={gref("wingB")}>{renderParts("wingB")}</group>
      </group>

      {/* ============ PROJECTS ZONE — floating presentation panels ============ */}
      <group ref={gref("projectsZone")} position={[0, 0, Z.projects]} visible={false}>
        {panels.map((p, i) => (
          <group key={i} position={[p.x, p.y, p.z]} rotation={[0, p.ry, 0]}>
            <mesh material={M.panel}>
              <boxGeometry args={[3.7, 2.4, 0.14]} />
            </mesh>
            <mesh material={M.panelScreen} position={[0, 0, 0.09]}>
              <boxGeometry args={[3.35, 2.05, 0.04]} />
            </mesh>
            <mesh material={M.projAccent} position={[0, -1.28, 0.05]}>
              <boxGeometry args={[3.7, 0.05, 0.2]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ============ SERVICES ZONE — architectural modules ============ */}
      <group ref={gref("servicesZone")} position={[0, 0, Z.services]} visible={false}>
        {modules.map((m, i) => (
          <group key={i} position={[m.x, m.y, m.z]}>
            <mesh material={M.module}>
              <boxGeometry args={[2.7, 1.15, 0.18]} />
            </mesh>
            <mesh material={M.servAccent} position={[-1.45, 0, 0.1]}>
              <boxGeometry args={[0.06, 1.15, 0.12]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ============ ABOUT ZONE — model wall ============ */}
      <group ref={gref("aboutZone")} position={[0, 0, Z.about]} visible={false}>
        <mesh material={M.wall} position={[0, 2.6, 0]}>
          <boxGeometry args={[7.4, 4.8, 0.2]} />
        </mesh>
        <mesh material={M.aboutAccent} position={[0, 0.12, 0.12]}>
          <boxGeometry args={[7.4, 0.07, 0.24]} />
        </mesh>
        <mesh material={M.white} position={[0, 3.1, 0.13]}>
          <boxGeometry args={[3.4, 2.1, 0.06]} />
        </mesh>
      </group>

      {/* ============ BLUEPRINT ZONE — building becomes a drawing ============ */}
      <group ref={gref("blueprintZone")} position={[0, 0, Z.blueprint]} visible={false}>
        {gridLines.map((l, i) => (
          <mesh key={i} material={M.blueprint} position={l.pos}>
            <boxGeometry args={l.size} />
          </mesh>
        ))}
        {/* wireframe of the tower */}
        <lineSegments material={M.blueprint} position={[0, TOWER_H / 2, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(2.4, TOWER_H, 2.4)]} />
        </lineSegments>
        <mesh material={M.blueprint} position={[0, 0.04, -3]}>
          <boxGeometry args={[6.2, 0.02, 0.02]} />
        </mesh>
      </group>

      {/* ============ CONTACT ZONE — the completed space ============ */}
      <group ref={gref("contactZone")} position={[0, 0, Z.contact]} visible={false}>
        {[0, 1, 2].map((i) => (
          <group key={i} position={[0, 0, -i * 2.4]}>
            <mesh material={M.bronze} position={[-3.4 * SPREAD, 2.6, 0]}>
              <boxGeometry args={[0.12, 5.2, 0.12]} />
            </mesh>
            <mesh material={M.bronze} position={[3.4 * SPREAD, 2.6, 0]}>
              <boxGeometry args={[0.12, 5.2, 0.12]} />
            </mesh>
            <mesh material={M.bronze} position={[0, 5.2, 0]}>
              <boxGeometry args={[6.9 * SPREAD + 0.12, 0.12, 0.12]} />
            </mesh>
          </group>
        ))}
        <mesh material={M.wall} position={[0, 2.4, -6]}>
          <boxGeometry args={[9, 4.8, 0.2]} />
        </mesh>
      </group>

      {/* ============ floating architectural geometry (desktop only) ============ */}
      {!isMobile && (
        <group ref={gref("debris")} visible={false}>
          {[
            [-3.6, 3.4, -8], [3.2, 4.2, -14], [-4.2, 2.2, -22],
            [3.8, 3.0, -33], [-3.4, 4.4, -44], [3.6, 2.4, -58], [-3.0, 3.2, -72],
          ].map((p, i) => (
            <mesh
              key={i}
              material={M.debris}
              position={[p[0], p[1], p[2]]}
              userData={{ baseY: p[1] }}
              rotation={[0.3, 0.4, 0.1]}
            >
              {i % 3 === 0 ? (
                <torusGeometry args={[0.35, 0.03, 6, 28]} />
              ) : (
                <boxGeometry args={[0.4, 0.4, 0.04]} />
              )}
            </mesh>
          ))}
        </group>
      )}
    </>
  );
}

function CameraRig() {
  const { camera, size } = useThree();
  useEffect(() => {
    if (!camera || !camera.isPerspectiveCamera) return;
    camera.aspect = size.width / Math.max(size.height, 1);
    camera.fov = 45;
    camera.near = 0.1;
    camera.far = 130;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

/**
 * Fixed full-page 3D environment. Exactly one instance is mounted.
 * If WebGL is unavailable it renders nothing — the HTML sections
 * remain fully readable on their solid fallback backgrounds.
 */
export default function JourneyScene() {
  const isMobile = useIsMobile();
  const ok = useMemo(() => supportsWebGL(), []);
  if (!ok) return null;
  return (
    <Canvas
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      dpr={[1, isMobile ? 1.25 : 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance", stencil: false }}
      frameloop="always"
    >
      <CameraRig />
      <Runtime isMobile={isMobile} />
    </Canvas>
  );
}
