import type { GameState } from "@/game/state/game-state";

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
