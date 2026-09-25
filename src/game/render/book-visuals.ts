import * as THREE from "three";

const SECTION_BASE_HSL: Record<
  string,
  readonly [hue: number, saturation: number, lightness: number]
> = {
  "1A": [30, 0.42, 0.37],
  "1B": [224, 0.46, 0.45],
  "1C": [355, 0.55, 0.34],
  "1D": [78, 0.36, 0.42],
  "1E": [274, 0.34, 0.34],
  "1F": [6, 0.42, 0.42],
  "1G": [270, 0.30, 0.56],
  "1H": [225, 0.08, 0.20],
  "1I": [282, 0.42, 0.42],
  "1J": [193, 0.46, 0.42],
  "1K": [42, 0.18, 0.78],
  "1L": [46, 0.42, 0.72],
  "1M": [24, 0.54, 0.42],
  "1N": [38, 0.34, 0.37],
  "2A": [7, 0.38, 0.36],
  "2B": [78, 0.30, 0.39],
  "2C": [305, 0.18, 0.68],
  "2D": [218, 0.16, 0.46],
  "2E": [29, 0.18, 0.48],
  "2F": [201, 0.30, 0.30],
  "2G": [116, 0.28, 0.35],
  "2H": [8, 0.28, 0.36],
  "2I": [5, 0.36, 0.40],
  "2J": [42, 0.15, 0.72],
  "2K": [140, 0.25, 0.38],
  "2L": [324, 0.34, 0.49],
  "2M": [235, 0.08, 0.25],
  "2N": [28, 0.22, 0.36],
  "2O": [35, 0.25, 0.39],
  "2P": [281, 0.32, 0.45],
  "2Q": [8, 0.28, 0.36],
};

function stableHash(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function signedUnit(hash: number, shift: number): number {
  const value = (hash >>> shift) & 0xff;
  return value / 127.5 - 1;
}

const colorCache = new Map<string, string>();

/**
 * Every volume of a series shares one stable visual identity.
 *
 * Spawn assignments may change between runs, but a specific series never
 * changes color. Variations stay close to the section's source-inspired family.
 */
export function getStableBookColor(
  seriesId: string,
  sectionCode: string,
): string {
  const cacheKey = `${sectionCode}:${seriesId}`;
  const cached = colorCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const [baseHue, baseSaturation, baseLightness] =
    SECTION_BASE_HSL[sectionCode] ?? [30, 0.25, 0.42];
  const hash = stableHash(seriesId);
  const hue = (baseHue + signedUnit(hash, 0) * 11 + 360) % 360;
  const saturation = THREE.MathUtils.clamp(
    baseSaturation + signedUnit(hash, 8) * 0.08,
    0.12,
    0.72,
  );
  const lightness = THREE.MathUtils.clamp(
    baseLightness + signedUnit(hash, 16) * 0.08,
    0.18,
    0.82,
  );
  const color = new THREE.Color().setHSL(hue / 360, saturation, lightness);
  const value = `#${color.getHexString()}`;

  colorCache.set(cacheKey, value);

  return value;
}
