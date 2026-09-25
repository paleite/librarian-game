"use client";

import { useState } from "react";

import { useGameStore } from "@/game/state/game-store";
import { getCorrectRowCount } from "@/game/rules/shelf-state";
import { getCarryCapacity } from "@/game/rules/progression";

import { GameCanvas } from "./GameCanvas";

export function GameShell() {
  const [saveError, setSaveError] = useState<string | null>(null);
  const phase = useGameStore((state) => state.phase);
  const seed = useGameStore((state) => state.runIdentity?.seed ?? null);
  const startNewGame = useGameStore((state) => state.startNewGame);
  const bookLocations = useGameStore((state) => state.bookLocations);
  const carriedCount = useGameStore((state) => state.carriedBookIds.length);
  const unlockedMinorMagicIds = useGameStore((state) => state.unlockedMinorMagicIds);
  const collectedKeyCount = useGameStore((state) => state.collectedKeyIds.length);
  const correctRows = getCorrectRowCount(bookLocations);
  const carryCapacity = getCarryCapacity({ unlockedMinorMagicIds });
  const saveToSlot = useGameStore((state) => state.saveToSlot);
  const loadFromSlot = useGameStore((state) => state.loadFromSlot);

  const runSaveAction = (action: () => void) => {
    try {
      action();
      setSaveError(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Save operation failed");
    }
  };

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <GameCanvas />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="rounded-lg border border-white/10 bg-black/55 px-3 py-2 text-sm text-white backdrop-blur">
            <div className="font-medium">Librarian Game</div>
            <div className="text-white/60">
              WASD · Space jump · Q drop / hold Q drop stack · Esc releases
            </div>
          </div>

          <div className="pointer-events-auto rounded-lg border border-white/10 bg-black/55 px-3 py-2 text-right text-xs text-white/70 backdrop-blur">
            <div>Phase: {phase}</div>
            <div>Correct rows: {correctRows} / 400</div>
            <div>Carrying: {carriedCount} / {carryCapacity}</div>
            <div>Keys: {collectedKeyCount} / 4 · Minor Magic: {unlockedMinorMagicIds.length} / 4</div>
            <div className="max-w-52 truncate">Seed: {seed ?? "none"}</div>
            <div className="mt-2 flex justify-end gap-2">
              <button
                className="rounded border border-white/15 px-2 py-1 hover:bg-white/10"
                onClick={() => runSaveAction(() => saveToSlot("quick"))}
                type="button"
              >
                Save
              </button>
              <button
                className="rounded border border-white/15 px-2 py-1 hover:bg-white/10"
                onClick={() => runSaveAction(() => loadFromSlot("quick"))}
                type="button"
              >
                Load
              </button>
            </div>
            {saveError ? (
              <div className="mt-2 max-w-64 text-red-300">{saveError}</div>
            ) : null}
          </div>
        </div>

        {phase === "title" ? (
          <div className="pointer-events-auto mx-auto mb-10 w-full max-w-md rounded-2xl border border-white/15 bg-black/70 p-6 text-center text-white shadow-2xl backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
              Full-clone architecture
            </p>
            <h1 className="mt-3 text-3xl font-semibold">Enter the library</h1>
            <p className="mt-3 text-sm leading-6 text-white/65">
              The first-person runtime is now the real game surface. Catalog,
              deterministic scattering, shelving, progression, secrets, and saves
              are layered onto this scene rather than built as separate prototypes.
            </p>
            <button
              className="mt-5 rounded-lg bg-amber-200 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-100"
              onClick={() => startNewGame()}
              type="button"
            >
              Start new run
            </button>
          </div>
        ) : (
          <div className="mx-auto mb-6 h-2 w-2 rounded-full bg-white/85 shadow-[0_0_8px_rgba(255,255,255,0.65)]" />
        )}
      </div>
    </main>
  );
}
