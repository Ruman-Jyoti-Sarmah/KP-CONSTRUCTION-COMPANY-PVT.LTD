import { useLayoutEffect } from "react";

/**
 * Technical / blueprint line grid surrounding the model.
 * Thin volumetric lines that fade in during the blueprint phase.
 * Each mesh is registered into `refs.array` so the scroll controller
 * can animate its material opacity imperatively (no React re-renders).
 */
export default function BlueprintLines({ refs }) {
  const { array } = refs;

  const lines = [];
  // vertical elevation grid (a translucent curtain crossing the model)
  for (let i = 0; i < 7; i++) {
    const z = -2.4 + i * 0.78;
    lines.push({ size: [0.04, 5.2, 0.04], pos: [0, 2.6, z] });
  }
  // horizontal elevation grid
  for (let j = 0; j < 6; j++) {
    const y = 0.3 + j * 0.92;
    lines.push({ size: [6.6, 0.04, 0.04], pos: [0, y, 1.9] });
  }
  // plan footprint
  lines.push({ size: [7.2, 0.04, 5.6], pos: [0, 0.05, 0] });
  // diagonal construction guides
  lines.push({ size: [8.4, 0.04, 0.04], pos: [0, 0.8, 0], rot: [0, 0, 0.62] });
  lines.push({ size: [8.4, 0.04, 0.04], pos: [0, 3.6, 0], rot: [0, 0, -0.62] });
  // measurement dimension ticks (top + side)
  for (let k = 0; k < 4; k++) {
    const sx = [-2.4, 0.8, 2.4, -0.6][k];
    lines.push({ size: [1.3, 0.04, 0.04], pos: [sx, 5.1, 0] });
  }

  useLayoutEffect(() => {
    // ensure registered refs are cleared on unmount
    return () => {
      array.length = 0;
    };
  }, [array]);

  return (
    <group>
      {lines.map((l, i) => (
        <mesh
          key={i}
          position={l.pos}
          rotation={l.rot || [0, 0, 0]}
          ref={(el) => {
            if (el) array[i] = el;
            else delete array[i];
          }}
        >
          <boxGeometry args={l.size} />
          <meshStandardMaterial
            color="#d9a84e"
            emissive="#d9a84e"
            emissiveIntensity={0.55}
            roughness={0.5}
            metalness={0.3}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  );
}