"use client";

import { create } from "zustand";

import { CATALOG_VERSION, LAYOUT_VERSION } from "@/game/run/generate-run";

import {
  initialGameState,
  type GameState,
} from "./game-state";

export interface GameActions {
  startNewGame: (seed?: string) => void;
  returnToTitle: () => void;
  setCozyMode: (enabled: boolean) => void;
}

export type GameStore = GameState & GameActions;

function createRunSeed(): string {
  return globalThis.crypto?.randomUUID?.() ?? `run-${Date.now()}`;
}

export const useGameStore = create<GameStore>((set) => ({
  ...initialGameState,

  startNewGame: (seed) =>
    set({
      ...initialGameState,
      phase: "sorting",
      runIdentity: {
        seed: seed ?? createRunSeed(),
        catalogVersion: CATALOG_VERSION,
        layoutVersion: LAYOUT_VERSION,
      },
    }),

  returnToTitle: () => set(initialGameState),

  setCozyMode: (enabled) => set({ cozyMode: enabled }),
}));
