"use client";

import { create } from "zustand";

import type { MajorMagicId, MinorMagicId } from "@/game/content/abilities";
import type { SecretKeyId } from "@/game/content/secrets";

export type GamePhase = "title" | "sorting" | "completed";

export interface GameRuntimeState {
  phase: GamePhase;
  seed: string | null;
  carriedBookIds: string[];
  collectedKeyIds: SecretKeyId[];
  unlockedMajorMagicIds: MajorMagicId[];
  unlockedMinorMagicIds: MinorMagicId[];
  correctlyShelvedRows: number;
  shelvedBooks: number;
  startNewGame: (seed?: string) => void;
  returnToTitle: () => void;
}

function createRunSeed(): string {
  return globalThis.crypto?.randomUUID?.() ?? `run-${Date.now()}`;
}

export const useGameStore = create<GameRuntimeState>((set) => ({
  phase: "title",
  seed: null,
  carriedBookIds: [],
  collectedKeyIds: [],
  unlockedMajorMagicIds: [],
  unlockedMinorMagicIds: [],
  correctlyShelvedRows: 0,
  shelvedBooks: 0,
  startNewGame: (seed) =>
    set({
      phase: "sorting",
      seed: seed ?? createRunSeed(),
      carriedBookIds: [],
      collectedKeyIds: [],
      unlockedMajorMagicIds: [],
      unlockedMinorMagicIds: [],
      correctlyShelvedRows: 0,
      shelvedBooks: 0,
    }),
  returnToTitle: () => set({ phase: "title" }),
}));
