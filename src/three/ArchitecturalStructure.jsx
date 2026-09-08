// Shared material recipes — dark futuristic architectural palette
export const MATERIALS = {
  stone: { color: "#2a2d33", roughness: 0.85, metalness: 0.15 },
  concrete: { color: "#1f2329", roughness: 0.95, metalness: 0.05 },
  white: { color: "#343a42", roughness: 0.7, metalness: 0.25 },
  steel: { color: "#8f959d", roughness: 0.25, metalness: 0.95 },
  steelDark: { color: "#4a5058", roughness: 0.4, metalness: 0.85 },
  glass: {
    color: "#0f1418",
    roughness: 0.08,
    metalness: 0.6,
    opacity: 0.62,
    transparent: true,
  },
  glowGold: {
    color: "#d9a84e",
    emissive: "#d9a84e",
    emissiveIntensity: 1.6,
    roughness: 0.3,
    metalness: 0.4,
  },
  glowWarm: {
    color: "#f2d38a",
    emissive: "#f2d38a",
    emissiveIntensity: 1.1,
    roughness: 0.5,
    metalness: 0.2,
  },
};

function Box({ pos, size, mat, rot }) {
  return (
    <mesh position={pos} rotation={rot}>
      <boxGeometry args={size} />
      <meshStandardMaterial {...MATERIALS[mat]} />
    </mesh>
  );
}

/**
 * FUTURISTIC TOWER — a dark glass-and-steel high-rise with emissive
 * gold window bands, glowing vertical light strips and an orbiting
 * light ring. Left/right wing masses are exposed via refs so the
 * scroll controller can subtly separate them during deconstruction.
 */
export default function ArchitecturalStructure({ refs }) {
  const { leftRef, rightRef } = refs;

  // Emissive window bands for the main shaft (one per floor)
  const floors = 7;
  const bands = [];
  for (let i = 0; i < floors; i++) {
    bands.push(0.85 + i * 0.62);
  }

  return (
    <group position={[0, 0, 0]}>
      {/* Base podium */}
      <Box pos={[0, 0.2, 0]} size={[7.2, 0.4, 5.6]} mat="concrete" />
      {/* Glowing podium edge */}
      <Box pos={[0, 0.44, 0]} size={[7.3, 0.06, 5.7]} mat="glowGold" />

      {/* MAIN TOWER SHAFT (dark glass) */}
      <group ref={leftRef}>
        <Box pos={[-0.2, 2.75, 0]} size={[2.1, 4.7, 2.1]} mat="glass" />
        {/* window bands */}
        {bands.map((y) => (
          <Box key={y} pos={[-0.2, y, 0]} size={[2.16, 0.12, 2.16]} mat="glowWarm" />
        ))}
        {/* crown */}
        <Box pos={[-0.2, 5.2, 0]} size={[2.3, 0.22, 2.3]} mat="steelDark" />
        <Box pos={[-0.2, 5.42, 0]} size={[1.1, 0.4, 1.1]} mat="glowGold" />
        {/* corner light strips */}
        <Box pos={[-1.32, 2.75, 1.12]} size={[0.07, 4.7, 0.07]} mat="glowGold" />
        <Box pos={[0.92, 2.75, 1.12]} size={[0.07, 4.7, 0.07]} mat="glowGold" />
      </group>

      {/* RIGHT WING (steel + stone) */}
      <group ref={rightRef}>
        <Box pos={[2.15, 1.7, 0.4]} size={[1.5, 3.0, 1.5]} mat="steelDark" />
        <Box pos={[2.15, 3.3, 0.4]} size={[1.62, 0.1, 1.62]} mat="glowWarm" />
        <Box pos={[2.15, 1.35, -0.75]} size={[0.3, 2.3, 0.3]} mat="glowGold" />
        <Box pos={[2.15, 3.35, 0.4]} size={[1.7, 0.24, 1.7]} mat="steel" />
      </group>

      {/* CENTRAL GLASS ATRIUM */}
      <Box pos={[1.05, 1.25, 1.0]} size={[1.15, 2.1, 1.15]} mat="glass" />
      <Box pos={[1.05, 2.36, 1.0]} size={[1.25, 0.1, 1.25]} mat="glowGold" />

      {/* Sky bridge */}
      <Box pos={[0.9, 2.0, 0.2]} size={[2.6, 0.22, 0.9]} mat="concrete" rot={[0, 0.3, 0]} />

      {/* Roof slab of the podium composition */}
      <Box pos={[0, 4.98, 0]} size={[6.4, 0.24, 4.6]} mat="white" />

      {/* Steel framework columns */}
      <Box pos={[-2.9, 2.2, 2.0]} size={[0.18, 4.4, 0.18]} mat="steelDark" />
      <Box pos={[2.9, 2.2, 2.0]} size={[0.18, 4.4, 0.18]} mat="steelDark" />
      <Box pos={[-2.9, 2.2, -2.0]} size={[0.18, 4.4, 0.18]} mat="steelDark" />
      <Box pos={[2.9, 2.2, -2.0]} size={[0.18, 4.4, 0.18]} mat="steelDark" />

      {/* Cantilevered viewing deck */}
      <Box pos={[3.7, 1.0, 0.1]} size={[1.4, 0.24, 3.2]} mat="stone" />
      <Box pos={[3.7, 1.14, 0.1]} size={[1.4, 0.05, 3.2]} mat="glowGold" />

      {/* ORBITING LIGHT RING */}
      <mesh position={[0, 3.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.55, 0.035, 8, 90]} />
        <meshStandardMaterial color="#d9a84e" emissive="#d9a84e" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0, 3.1, 0]} rotation={[Math.PI / 2.35, 0.4, 0]}>
        <torusGeometry args={[4.15, 0.02, 8, 90]} />
        <meshStandardMaterial color="#f2d38a" emissive="#f2d38a" emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}