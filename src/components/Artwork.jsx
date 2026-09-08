/**
 * Artwork — editorial architectural vector illustration used in place of
 * photography. Renders soft ivory/stone/concrete compositions with thin
 * hairlines, glass panels and champagne accents. Pure SVG, no raster assets.
 */

const BG = {
  ivory: "#f5f2ea",
  stone: "#e5e0d6",
  concrete: "#c9c4ba",
  mist: "#efece3",
  ink: "#292929",
  champagne: "#9b8060",
  glass: "#cdd6d6",
};

function facade(x, y, w, h, { floors = 4, cols = 3, glass = 0.5, mat = "concrete", accent, rx = 0 } = {}) {
  const swatch = { concrete: BG.concrete, stone: BG.stone, white: BG.ivory, steel: "#c7c7c7", wood: "#b99a76" };
  const fill = swatch[mat] || BG.stone;
  const parts = [];
  const fh = h / floors;
  const cw = w / cols;

  parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${BG.ink}" stroke-opacity="0.55" stroke-width="1.1"/>`);
  for (let f = 1; f < floors; f++)
    parts.push(`<line x1="${x}" y1="${y + f * fh}" x2="${x + w}" y2="${y + f * fh}" stroke="${BG.ink}" stroke-opacity="0.3" stroke-width="0.8"/>`);
  for (let c = 1; c < cols; c++)
    parts.push(`<line x1="${x + c * cw}" y1="${y}" x2="${x + c * cw}" y2="${y + h}" stroke="${BG.ink}" stroke-opacity="0.3" stroke-width="0.8"/>`);
  for (let f = 0; f < floors; f++) {
    for (let c = 0; c < cols; c++) {
      if ((f * cols + c) % 3 < glass * 3) {
        parts.push(`<rect x="${x + c * cw + cw * 0.18}" y="${y + f * fh + fh * 0.2}" width="${cw * 0.64}" height="${fh * 0.6}" fill="${BG.glass}" opacity="0.55" stroke="${BG.ink}" stroke-opacity="0.25"/>`);
      }
    }
  }
  if (accent) parts.push(`<line x1="${x}" y1="${y - 6}" x2="${x + w}" y2="${y - 6}" stroke="${BG.champagne}" stroke-width="2"/>`);
  return `<g>${parts.join("")}</g>`;
}

function grid(w, h, step = 40) {
  const tone = "#d6d2c8";
  const lines = [];
  for (let x = 0; x <= w; x += step) lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${tone}" stroke-width="0.6" opacity="0.5"/>`);
  for (let y = 0; y <= h; y += step) lines.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${tone}" stroke-width="0.6" opacity="0.5"/>`);
  return `<g>${lines.join("")}</g>`;
}

function vanish(w, h) {
  const x = 40;
  const y = 340;
  return `<g stroke="${BG.ink}" stroke-opacity="0.5" stroke-width="1">
    <line x1="0" y1="0" x2="${w}" y2="0"/><line x1="${w}" y1="0" x2="${w}" y2="${h}"/><line x1="${w}" y1="${h}" x2="0" y2="${h}"/>
    <circle cx="${x}" cy="${y}" r="3" fill="none"/>
    <line x1="${x - 10}" y1="${y}" x2="${x + 10}" y2="${y}"/>
    <line x1="${x}" y1="${y - 10}" x2="${x}" y2="${y + 10}"/>
  </g>`;
}

function sky(w, h) {
  return `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${BG.ivory}"/>
    <stop offset="0.7" stop-color="${BG.stone}"/>
    <stop offset="1" stop-color="${BG.concrete}"/>
  </linearGradient></defs><rect width="${w}" height="${h}" fill="url(#sky)"/>`;
}
const RESIDENCE = (w, h) => `
  ${sky(w, h)}
  ${grid(w, h)}
  <g transform="translate(${w * 0.18} ${h * 0.18})">
    ${facade(0, 60, w * 0.5, w * 0.78, { floors: 3, cols: 2, glass: 0.4, mat: "stone", accent: true })}
    ${facade(w * 0.36, 40, w * 0.42, w * 0.6, { floors: 2, cols: 3, glass: 0.5, mat: "white" })}
    <rect x="${-6}" y="${h * 0.2}" width="${w * 0.9}" height="16" fill="${BG.ivory}" stroke="${BG.ink}" stroke-opacity="0.4"/>
  </g>
  ${vanish(w, h)}`;

const HEADQUARTERS = (w, h) => `
  ${sky(w, h)}
  ${grid(w, h)}
  <g transform="translate(${w * 0.14} ${h * 0.1})">
    ${facade(0, 20, w * 0.32, w * 1.0, { floors: 6, cols: 2, glass: 0.8, mat: "steel", accent: true })}
    ${facade(w * 0.34, 120, w * 0.2, w * 0.6, { floors: 4, cols: 2, glass: 0.6, mat: "glass" })}
    <rect x="${w * 0.24}" y="${w * 0.95}" width="${w * 0.52}" height="18" fill="${BG.concrete}" stroke="${BG.ink}" stroke-opacity="0.5"/>
  </g>
  ${vanish(w, h)}`;

const URBAN = (w, h) => `
  ${sky(w, h)}
  ${grid(w, h, 30)}
  <g transform="translate(${w * 0.12} ${h * 0.16})">
    ${facade(0, 60, w * 0.24, w * 0.7, { floors: 3, cols: 2, glass: 0.5, mat: "concrete" })}
    ${facade(w * 0.22, 20, w * 0.3, w * 0.9, { floors: 5, cols: 2, glass: 0.7, mat: "steel", accent: true })}
    ${facade(w * 0.5, 70, w * 0.3, w * 0.66, { floors: 4, cols: 3, glass: 0.5, mat: "stone" })}
    <rect x="${-4}" y="${w * 0.88}" width="${w * 0.9}" height="${h - w * 0.88 - 40}" fill="${BG.mist}" stroke="${BG.ink}" stroke-opacity="0.35"/>
  </g>
  ${vanish(w, h)}`;

const COMPLEX = (w, h) => `
  ${sky(w, h)}
  ${grid(w, h)}
  <g transform="translate(${w * 0.16} ${h * 0.2})">
    ${facade(0, 40, w * 0.3, w * 0.72, { floors: 3, cols: 2, glass: 0.5, mat: "white" })}
    ${facade(w * 0.18, 150, w * 0.6, w * 0.42, { floors: 2, cols: 4, glass: 0.6, mat: "glass" })}
    ${facade(w * 0.3, 20, w * 0.44, w * 0.9, { floors: 6, cols: 2, glass: 0.75, mat: "concrete", accent: true })}
  </g>
  ${vanish(w, h)}`;
const MATERIALS_MAP = {
  concrete: { base: "#d5d1c8", lines: "#b7b1a6", grain: 0.9 },
  steel: { base: "#cdcdca", lines: "#b8b8b4", grain: 0.5, hLine: true },
  glass: { base: "#cdd6d6", lines: "#baccd2", grain: 0.2, hLine: true },
  stone: { base: "#e8e4db", lines: "#d9d3c6", grain: 0.8 },
  wood: { base: "#c4a37c", lines: "#a5834f", grain: 0.7, hLine: true },
};

function bgLighter(hex) {
  const v = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (v >> 16 & 255) + 18);
  const g = Math.min(255, (v >> 8 & 255) + 18);
  const b = Math.min(255, (v & 255) + 18);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function materialSlab(name, w, h) {
  const m = MATERIALS_MAP[name] || MATERIALS_MAP.concrete;
  const bars = [];
  const n = m.hLine ? 9 : name === "steel" ? 6 : 11;
  for (let i = 1; i < n; i++) {
    const off = (h / n) * i + (i % 2) * 6;
    bars.push(
      m.hLine
        ? `<line x1="${w * 0.05}" y1="${off}" x2="${w * 0.95}" y2="${off}" stroke="${m.lines}" stroke-opacity="0.5" stroke-width="1.4"/>`
        : `<line x1="${off}" y1="${h * 0.05}" x2="${off}" y2="${h * 0.95}" stroke="${m.lines}" stroke-opacity="0.5" stroke-width="1.6"/>`
    );
  }
  return `
   <rect width="${w}" height="${h}" fill="${m.base}"/>
   <defs><linearGradient id="mat-${name}" x1="0" y1="0" x2="1" y2="1">
     <stop offset="0" stop-color="${bgLighter(m.base)}" stop-opacity="0.9"/>
     <stop offset="1" stop-color="${m.base}"/>
   </linearGradient></defs>
   <rect width="${w}" height="${h}" fill="url(#mat-${name})" opacity="0.45"/>
   ${bars.join("")}
   <rect width="${w}" height="${h}" fill="url(#noise)" opacity="0.06"/>
  `;
}

const NOISE = `<defs><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" result="n"/><feColorMatrix in="n" values="0 0 0 0 0.4 0 0 0 0 0.38 0 0 0 0 0.34 0 0 0 0.4 0"/></filter></defs>`;

/**
 * @param variant project/service key
 * @param material pass a material name to render a material slab instead
 */
export default function Artwork({ variant = "residence", material = null, className = "", aspect = "portrait" }) {
  const w = aspect === "wide" ? 1500 : 900;
  const h = aspect === "wide" ? 1000 : aspect === "square" ? 900 : 1120;
  let body;

  if (material) {
    body = `${NOISE}${materialSlab(material, w, h)}`;
  } else {
    const variants = { residence: RESIDENCE, headquarters: HEADQUARTERS, urban: URBAN, complex: COMPLEX };
    const build = variants[variant] || RESIDENCE;
    body = `${NOISE}${build(w, h)}`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" preserveAspectRatio="xMidYMid slice">${body}</svg>`;
  return (
    <span
      className={className}
      role="img"
      aria-label={material ? `${material} material surface` : `${variant} — architectural illustration`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}