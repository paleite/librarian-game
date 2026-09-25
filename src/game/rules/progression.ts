import {
  majorMagicDefinitions,
  type MajorMagicId,
} from "@/game/content/abilities";
import type { GameState } from "@/game/state/game-state";

export const knownMajorMagicPointThresholds = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 19, 22, 25, 29, 33, 37, 41,
  46, 50, 55,
] as const;

export function getKnownEarnedMajorMagicPoints(
  correctRowCount: number,
): number {
  return knownMajorMagicPointThresholds.filter(
    (threshold) => correctRowCount >= threshold,
  ).length;
}

export function getSpentMajorMagicPoints(
  majorMagicLevels: Readonly<Record<MajorMagicId, number>>,
): number {
  return majorMagicDefinitions.reduce(
    (sum, definition) => sum + majorMagicLevels[definition.id],
    0,
  );
}

export function getAvailableKnownMajorMagicPoints(
  correctRowCount: number,
  majorMagicLevels: Readonly<Record<MajorMagicId, number>>,
): number {
  return Math.max(
    0,
    getKnownEarnedMajorMagicPoints(correctRowCount) -
      getSpentMajorMagicPoints(majorMagicLevels),
  );
}

export function getCarryCapacity(
  state: Pick<GameState, "unlockedMinorMagicIds">,
): number {
  let capacity = 10;

  if (state.unlockedMinorMagicIds.includes("carry-capacity-3")) {
    capacity += 3;
  }

  if (state.unlockedMinorMagicIds.includes("carry-capacity-2")) {
    capacity += 2;
  }

  return capacity;
}

export function canSprint(
  state: Pick<GameState, "unlockedMinorMagicIds">,
): boolean {
  return state.unlockedMinorMagicIds.includes("sprint");
}

export function hasHighJump(
  state: Pick<GameState, "unlockedMinorMagicIds">,
): boolean {
  return state.unlockedMinorMagicIds.includes("high-jump");
}


export function getRowsUntilNextKnownMajorMagicPoint(
  correctRowCount: number,
): number | null {
  const nextThreshold = knownMajorMagicPointThresholds.find(
    (threshold) => threshold > correctRowCount,
  );

  return nextThreshold === undefined
    ? null
    : nextThreshold - correctRowCount;
}
