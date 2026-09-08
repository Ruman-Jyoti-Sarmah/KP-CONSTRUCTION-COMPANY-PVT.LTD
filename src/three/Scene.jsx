import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei/core";
import { sceneState } from "./introState.js";
import ArchitecturalStructure from "./ArchitecturalStructure.jsx";
import BlueprintLines from "./BlueprintLines.jsx";
import Particles from "./Particles.jsx";

// Static vertical offset so the model (y ~ 0..4.9) sits centered in frame.
const MODEL_Y = -2.45;

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} color="#cdd6e0" />
      <directionalLight position={[7, 11, 5]} intensity={1.3} color="#ffe7bd" />
      <directionalLight position={[-7, 4, -6]} intensity={0.55} color="#8fb3d9" />
      {/* gold rim + fill for the futuristic glow */}
      <pointLight position={[0, 5, 4]} intensity={1.1} color="#d9a84e" />
      <pointLight position={[-4, 1.4, 3]} intensity={0.55} color="#e8b95f" />
      <pointLight position={[4, 2.2, -3]} intensity={0.4} color="#6f87a8" />
    </>
  );
}

function SceneRuntime({ tier }) {
  const worldRef = useRef(null);
  const orbitRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const blueprintRefs = useRef([]);
  const time = useRef(0);
  const { size } = useThree();

  // Mouse parallax target (lerped for smoothness)
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onMove = (e) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const s = sceneState;
    time.current += delta || 1 / 60;
    const t = time.current;

    // Responsive framing: on narrow/portrait screens pull the model toward
    // the centre and scale it down so it never crops off-screen.
    const aspect = size.width / Math.max(size.height, 1);
    const xFactor = aspect < 0.8 ? 0.15 : aspect < 1.2 ? 0.55 : 1;
    const scaleFit = aspect < 0.8 ? 0.72 : aspect < 1.2 ? 0.85 : 1;

    // smooth mouse follow
    mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.05;
    mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.05;

    if (worldRef.current) {
      worldRef.current.position.set(
        s.x * xFactor + mouse.current.x * 0.35,
        s.y - mouse.current.y * 0.22,
        s.z
      );
      worldRef.current.scale.setScalar(Math.max(s.scale * scaleFit, 0.0001));
    }
    if (orbitRef.current) {
      // scroll keyframed rotation + continuous cinematic auto-rotation + mouse tilt
      orbitRef.current.rotation.y = s.rotY + t * 0.12 + mouse.current.x * 0.12;
      orbitRef.current.rotation.x = s.rotX - mouse.current.y * 0.05 + Math.sin(t * 0.4) * 0.012;
    }

    if (leftRef.current) {
      leftRef.current.position.x = -1.8 - s.sep * 1.15;
      leftRef.current.position.y = s.sep * 0.6;
    }
    if (rightRef.current) {
      rightRef.current.position.x = 1.7 + s.sep * 1.15;
      rightRef.current.position.y = s.sep * 0.4;
    }

    const lines = blueprintRefs.current;
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i];
      if (m && m.material) {
        m.material.opacity = s.blueprint;
        m.material.forceUpdate = true;
      }
    }
  });

  const blueprint = { array: blueprintRefs.current };

  return (
    <>
      <Lights />
      <group ref={worldRef}>
        <group ref={orbitRef} position={[0, MODEL_Y, 0]}>
          <ArchitecturalStructure refs={{ leftRef, rightRef }} />
          <BlueprintLines refs={blueprint} />
          {tier !== "low" && <Particles count={tier === "high" ? 40 : 18} />}
        </group>
      </group>
      {tier !== "low" && (
        <ContactShadows
          opacity={0.55}
          scale={14}
          blur={2.5}
          far={5.2}
          resolution={256}
          color="#000000"
          frames={Infinity}
          position={[0, -0.04, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      )}
    </>
  );
}

// Manual camera for deterministic cinematic framing (created once).
const CAMERA = (() => {
  try {
    const cam = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 120);
    cam.position.set(0, 1.15, 8.4);
    cam.lookAt(new THREE.Vector3(0, 0, 0));
    return cam;
  } catch (_) {
    return null; // fall back to fiber's default camera
  }
})();

/**
 * Keeps the camera framing correct on every screen size / orientation:
 * wider FOV + slight pull-back on portrait phones and tablets.
 */
function CameraRig() {
  const { camera, size } = useThree();
  useEffect(() => {
    if (!camera || !camera.isPerspectiveCamera) return;
    const aspect = size.width / Math.max(size.height, 1);
    camera.aspect = aspect;
    camera.fov = aspect < 0.8 ? 58 : aspect < 1.2 ? 50 : 40;
    camera.position.set(0, 1.15, aspect < 0.8 ? 10.6 : aspect < 1.2 ? 9.4 : 8.4);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

export default function Scene({ tier = "high" }) {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      camera={CAMERA}
      dpr={[1, tier === "high" ? 1.5 : 1]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop="always"
    >
      <CameraRig />
      <SceneRuntime tier={tier} />
    </Canvas>
  );
}