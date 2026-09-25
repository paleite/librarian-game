"use client";

import { useEffect } from "react";

import {
  majorMagicDefinitions,
  majorMagicIds,
} from "@/game/content/abilities";
import type { AchievementId } from "@/game/content/achievements";
import { unlockAchievements } from "@/game/save/profile";
import { getCorrectRowCount } from "@/game/rules/shelf-state";
import { useGameStore } from "@/game/state/game-store";

function evaluateAchievements(): AchievementId[] {
  const state = useGameStore.getState();
  const correctRows = getCorrectRowCount(state.bookLocations);
  const unlocks: AchievementId[] = [];

  if (correctRows >= 1) {
    unlocks.push("first-step");
  }

  if (correctRows >= 50) {
    unlocks.push("intermediate");
  }

  if (correctRows >= 200) {
    unlocks.push("veteran");
  }

  if (correctRows >= 400) {
    unlocks.push("grand");
  }

  if (state.majorMagicUsageCount > 0) {
    unlocks.push("novice-mage");
  }

  if (majorMagicIds.every((id) => state.majorMagicLevels[id] > 0)) {
    unlocks.push("sage");
  }

  if (state.unlockedMinorMagicIds.length >= 4) {
    unlocks.push("life-hack");
  }

  if (
    majorMagicDefinitions.every(
      (definition) =>
        state.majorMagicLevels[definition.id] >= definition.maxLevel,
    )
  ) {
    unlocks.push("archmage");
  }

  if (
    state.specialStagePlacedCount >= 3072 &&
    (state.phase === "special-stage" ||
      state.phase === "special-stage-completed")
  ) {
    unlocks.push("overtime-avoider");
  }

  if (state.phase === "completed" && correctRows === 400) {
    if (state.elapsedMilliseconds < 3 * 60 * 60 * 1000) {
      unlocks.push("efficiency");
    }

    if (state.majorMagicUsageCount === 0) {
      unlocks.push("anti-magic");
    }
  }

  if (state.phase === "completed" && correctRows === 0) {
    unlocks.push("you-are-fired");
  }

  return unlocks;
}

export function AchievementController() {
  useEffect(() => {
    const evaluate = () => {
      unlockAchievements(evaluateAchievements());
    };

    evaluate();

    const unsubscribe = useGameStore.subscribe(evaluate);

    return unsubscribe;
  }, []);

  return null;
}
