"use client";

import { useFrame } from "@react-three/fiber";

import { useGameStore } from "@/game/state/game-store";

export function SpecialStageController() {
  useFrame(() => {
    const state = useGameStore.getState();

    if (
      state.phase !== "special-stage" ||
      state.specialStageUltimateStartedAt === null
    ) {
      return;
    }

    state.advanceSpecialStageUltimate(Date.now());
  });

  return null;
}
