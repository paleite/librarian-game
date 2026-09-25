import {
  majorMagicDefinitionById,
  type MajorMagicId,
} from "./abilities";

interface TimingEndpoints {
  levelOneCooldownSeconds: number;
  maxCooldownSeconds: number;
  levelOneActiveSeconds?: number;
  maxActiveSeconds?: number;
}

const timingEndpoints: Record<MajorMagicId, TimingEndpoints> = {
  sort: {
    levelOneCooldownSeconds: 30,
    maxCooldownSeconds: 5,
  },
  "shelf-guide": {
    levelOneCooldownSeconds: 60,
    maxCooldownSeconds: 5,
    levelOneActiveSeconds: 15,
    maxActiveSeconds: 60,
  },
  insight: {
    levelOneCooldownSeconds: 60,
    maxCooldownSeconds: 20,
    levelOneActiveSeconds: 7,
    maxActiveSeconds: 40,
  },
  "auto-shelving": {
    levelOneCooldownSeconds: 100,
    maxCooldownSeconds: 10,
    levelOneActiveSeconds: 10,
    maxActiveSeconds: 55,
  },
  assemble: {
    levelOneCooldownSeconds: 120,
    maxCooldownSeconds: 10,
  },
};

function interpolate(
  level: number,
  maxLevel: number,
  levelOneValue: number,
  maxValue: number,
): number {
  if (maxLevel <= 1) {
    return maxValue;
  }

  const normalizedLevel = (level - 1) / (maxLevel - 1);

  return levelOneValue + (maxValue - levelOneValue) * normalizedLevel;
}

/**
 * Level-1 and max-level values are source-backed.
 * Intermediate values are deliberately isolated here because the public sources
 * do not expose the complete per-level table. They currently use linear
 * interpolation and must remain parity="partial" until verified.
 */
export function getMajorMagicCooldownMilliseconds(
  id: MajorMagicId,
  level: number,
): number {
  const definition = majorMagicDefinitionById.get(id);
  const endpoints = timingEndpoints[id];

  if (!definition || level <= 0) {
    return 0;
  }

  return Math.round(
    interpolate(
      Math.min(level, definition.maxLevel),
      definition.maxLevel,
      endpoints.levelOneCooldownSeconds,
      endpoints.maxCooldownSeconds,
    ) * 1000,
  );
}

export function getMajorMagicActiveMilliseconds(
  id: MajorMagicId,
  level: number,
): number {
  const definition = majorMagicDefinitionById.get(id);
  const endpoints = timingEndpoints[id];

  if (
    !definition ||
    level <= 0 ||
    endpoints.levelOneActiveSeconds === undefined ||
    endpoints.maxActiveSeconds === undefined
  ) {
    return 0;
  }

  return Math.round(
    interpolate(
      Math.min(level, definition.maxLevel),
      definition.maxLevel,
      endpoints.levelOneActiveSeconds,
      endpoints.maxActiveSeconds,
    ) * 1000,
  );
}
