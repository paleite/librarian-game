"use client";

import { useEffect, useRef, useState } from "react";

import { getAvailableKnownMajorMagicPoints, getCarryCapacity, getKnownEarnedMajorMagicPoints, getSpentMajorMagicPoints } from "@/game/rules/progression";
import { majorMagicDefinitions } from "@/game/content/abilities";
import { getCorrectRowCount } from "@/game/rules/shelf-state";
import { useGameStore } from "@/game/state/game-store";
import { bookInstances } from "@/game/run/book-instances";
import type { PlacementFeedback } from "@/game/rules/placement-feedback";

import { GameCanvas } from "./GameCanvas";

const MANUAL_SAVE_SLOTS = ["slot-1", "slot-2", "slot-3"] as const;

export function GameShell() {
  const [saveError, setSaveError] = useState<string | null>(null);
  const [inspectedBookId, setInspectedBookId] = useState<string | null>(null);
  const [placementFeedback, setPlacementFeedback] = useState<PlacementFeedback | null>(null);
  const [magicMenuOpen, setMagicMenuOpen] = useState(false);
  const previousCorrectRowsRef = useRef(0);

  const phase = useGameStore((state) => state.phase);
  const seed = useGameStore((state) => state.runIdentity?.seed ?? null);
  const startNewGame = useGameStore((state) => state.startNewGame);
  const saveToSlot = useGameStore((state) => state.saveToSlot);
  const loadFromSlot = useGameStore((state) => state.loadFromSlot);
  const setAutosaveEnabled = useGameStore(
    (state) => state.setAutosaveEnabled,
  );
  const bookLocations = useGameStore((state) => state.bookLocations);
  const carriedCount = useGameStore((state) => state.carriedBookIds.length);
  const unlockedMinorMagicIds = useGameStore(
    (state) => state.unlockedMinorMagicIds,
  );
  const collectedKeyCount = useGameStore(
    (state) => state.collectedKeyIds.length,
  );
  const autosaveEnabled = useGameStore((state) => state.autosaveEnabled);
  const majorMagicLevels = useGameStore((state) => state.majorMagicLevels);
  const upgradeMajorMagic = useGameStore((state) => state.upgradeMajorMagic);

  const correctRows = getCorrectRowCount(bookLocations);
  const carryCapacity = getCarryCapacity({ unlockedMinorMagicIds });
  const knownEarnedMagicPoints = getKnownEarnedMajorMagicPoints(correctRows);
  const spentMagicPoints = getSpentMajorMagicPoints(majorMagicLevels);
  const availableMagicPoints = getAvailableKnownMajorMagicPoints(
    correctRows,
    majorMagicLevels,
  );
  const inspectedBook = inspectedBookId
    ? bookInstances.find((book) => book.id === inspectedBookId) ?? null
    : null;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Tab" || phase !== "sorting") {
        return;
      }

      event.preventDefault();
      setMagicMenuOpen((open) => {
        const nextOpen = !open;

        if (nextOpen && document.pointerLockElement) {
          document.exitPointerLock();
        }

        return nextOpen;
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase]);

  useEffect(() => {
    const previousCorrectRows = previousCorrectRowsRef.current;
    previousCorrectRowsRef.current = correctRows;

    if (
      phase !== "sorting" ||
      !autosaveEnabled ||
      correctRows <= previousCorrectRows
    ) {
      return;
    }

    try {
      saveToSlot("autosave");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Autosave operation failed";

      window.setTimeout(() => setSaveError(message), 0);
    }
  }, [autosaveEnabled, correctRows, phase, saveToSlot]);

  const runSaveAction = (action: () => void) => {
    try {
      action();
      setSaveError(null);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Save operation failed",
      );
    }
  };

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <GameCanvas
          onInspectBook={setInspectedBookId}
          onPlacementFeedback={(feedback) => {
            setPlacementFeedback(feedback);
            window.setTimeout(() => setPlacementFeedback(null), 850);
          }}
        />
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
            <div>Major Magic points: {availableMagicPoints} available · {spentMagicPoints}/{knownEarnedMagicPoints} spent/known earned</div>
            <div>Carrying: {carriedCount} / {carryCapacity}</div>
            <div>
              Keys: {collectedKeyCount} / 4 · Minor Magic:{" "}
              {unlockedMinorMagicIds.length} / 4
            </div>
            <div className="max-w-52 truncate">Seed: {seed ?? "none"}</div>

            <label className="mt-2 flex items-center justify-end gap-2">
              <span>Autosave</span>
              <input
                checked={autosaveEnabled}
                onChange={(event) =>
                  setAutosaveEnabled(event.currentTarget.checked)
                }
                type="checkbox"
              />
            </label>

            <div className="mt-2 grid grid-cols-3 gap-1">
              {MANUAL_SAVE_SLOTS.map((slotId, index) => (
                <div className="flex gap-1" key={slotId}>
                  <button
                    className="rounded border border-white/15 px-2 py-1 hover:bg-white/10"
                    onClick={() =>
                      runSaveAction(() => saveToSlot(slotId))
                    }
                    type="button"
                  >
                    S{index + 1}
                  </button>
                  <button
                    className="rounded border border-white/15 px-2 py-1 hover:bg-white/10"
                    onClick={() =>
                      runSaveAction(() => loadFromSlot(slotId))
                    }
                    type="button"
                  >
                    L{index + 1}
                  </button>
                </div>
              ))}
            </div>

            <button
              className="mt-1 rounded border border-white/15 px-2 py-1 hover:bg-white/10"
              onClick={() =>
                runSaveAction(() => loadFromSlot("autosave"))
              }
              type="button"
            >
              Load autosave
            </button>

            {saveError ? (
              <div className="mt-2 max-w-64 text-red-300">{saveError}</div>
            ) : null}
          </div>
        </div>

        {inspectedBook && phase === "sorting" ? (
          <div className="pointer-events-none absolute bottom-20 left-1/2 w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-white/15 bg-black/72 px-5 py-4 text-center text-white shadow-2xl backdrop-blur">
            <div className="text-base font-semibold">{inspectedBook.title}</div>
            <div className="mt-1 text-sm text-white/65">
              Volume {inspectedBook.volumeNumber} / {inspectedBook.volumeCount}
            </div>
          </div>
        ) : null}

        {placementFeedback && phase === "sorting" ? (
          <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 rounded-full border border-white/15 bg-black/65 px-4 py-2 text-sm font-medium text-white backdrop-blur">
            {placementFeedback === "exact"
              ? "Exact placement"
              : placementFeedback === "correct-section"
                ? "Correct section, wrong position or row"
                : "Wrong section"}
          </div>
        ) : null}

        {magicMenuOpen && phase === "sorting" ? (
          <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-sm">
            <div className="w-[min(46rem,calc(100vw-2rem))] rounded-2xl border border-white/15 bg-stone-950/95 p-6 text-white shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                    Major Magic
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold">
                    {availableMagicPoints} point{availableMagicPoints === 1 ? "" : "s"} available
                  </h2>
                  <p className="mt-2 text-sm text-white/55">
                    Verified progression thresholds are encoded through 55 completed rows; later thresholds remain source-research data.
                  </p>
                </div>
                <button
                  className="rounded border border-white/15 px-3 py-2 text-sm hover:bg-white/10"
                  onClick={() => setMagicMenuOpen(false)}
                  type="button"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {majorMagicDefinitions.map((definition) => {
                  const level = majorMagicLevels[definition.id];
                  const maxed = level >= definition.maxLevel;

                  return (
                    <button
                      className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-left enabled:hover:bg-white/[0.08] disabled:opacity-55"
                      disabled={availableMagicPoints <= 0 || maxed}
                      key={definition.id}
                      onClick={() => upgradeMajorMagic(definition.id)}
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold">
                          {definition.hotkey}. {definition.name}
                        </div>
                        <div className="text-sm text-violet-200">
                          {level}/{definition.maxLevel}
                        </div>
                      </div>
                      <div className="mt-2 text-sm leading-5 text-white/55">
                        {definition.effect}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {phase === "title" ? (
          <div className="pointer-events-auto mx-auto mb-10 w-full max-w-md rounded-2xl border border-white/15 bg-black/70 p-6 text-center text-white shadow-2xl backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
              Full-clone architecture
            </p>
            <h1 className="mt-3 text-3xl font-semibold">Enter the library</h1>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Sort all 3,072 volumes into 400 correct series rows across the
              two-floor library.
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
