import { useFrame } from "@react-three/fiber";

/**
 * Subtle dust/particles for depth. Positions updated imperatively in the
 * frame loop (no React overhead). Disabled on "low" quality tier.
 */
export default function Particles({ count = 30 }) {
  const refs = [];
  const time = { t: 0 };

  useFrame((state, delta) => {
    time.t += (delta || 1 / 60) * 0.6;
    const t = time.t;
    for (let i = 0; i < count; i++) {
      const m = refs[i];
      if (!m) continue;
      m.position.y = m.__baseY + Math.sin(t + i * 1.7) * 0.28;
      m.position.x = m.__baseX + Math.sin(t * 0.6 + i * 2.1) * 0.4;
      m.position.z = m.__baseZ + Math.cos(t * 0.7 + i) * 0.3;
    }
  }, 1);

  const seed = [];
  for (let i = 0; i < count; i++) {
    seed.push([(Math.random() - 0.5) * 1.4, Math.random() * 1.1 - 0.2, (Math.random() - 0.5) * 1.5]);
  }

  return (
    <group>
      {seed.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) {
              el.__baseX = p[0];
              el.__baseY = p[1];
              el.__baseZ = p[2];
              refs[i] = el;
            } else delete refs[i];
          }}
        >
          <sphereGeometry args={[0.02 + (i % 5) * 0.008, 6, 6]} />
          <meshStandardMaterial color="#f2d38a" emissive="#d9a84e" emissiveIntensity={0.9} transparent opacity={0.75} />
        </mesh>
      ))}
    </group>
  );
}