"use client";

import { useEffect, useRef, useState } from "react";

import { getAvailableKnownMajorMagicPoints, getCarryCapacity, getKnownEarnedMajorMagicPoints, getSpentMajorMagicPoints } from "@/game/rules/progression";
import { majorMagicDefinitions } from "@/game/content/abilities";
import { getCorrectRowCount } from "@/game/rules/shelf-state";
import { useGameStore } from "@/game/state/game-store";
import type { PlacementFeedback } from "@/game/rules/placement-feedback";
import { ACHIEVEMENT_UNLOCKED_EVENT, readProfileState } from "@/game/save/profile";
import type { AchievementId } from "@/game/content/achievements";
import { SPECIAL_STAGE_ULTIMATE_DURATION_MILLISECONDS } from "@/game/modes/special-stage";

import { playerInput } from "@/game/input/player-input";

import { GameCanvas } from "./GameCanvas";
import { MobileControls } from "./MobileControls";
import { MobileHud } from "./MobileHud";
import { AchievementToasts } from "./AchievementToasts";
import { AchievementGallery } from "./AchievementGallery";
import { SaveSlotsPanel } from "./SaveSlotsPanel";
import { LibraryAmbience } from "./LibraryAmbience";
import { InteractionHud } from "./InteractionHud";


export function GameShell() {
  const [saveError, setSaveError] = useState<string | null>(null);
  const [placementFeedback, setPlacementFeedback] = useState<PlacementFeedback | null>(null);
  const [magicMenuOpen, setMagicMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [specialStageUnlocked, setSpecialStageUnlocked] = useState(false);
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<AchievementId[]>([]);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [savesOpen, setSavesOpen] = useState(false);
  const previousCorrectRowsRef = useRef(0);

  const phase = useGameStore((state) => state.phase);
  const seed = useGameStore((state) => state.runIdentity?.seed ?? null);
  const startNewGame = useGameStore((state) => state.startNewGame);
  const startSpecialStage = useGameStore((state) => state.startSpecialStage);
  const returnToTitle = useGameStore((state) => state.returnToTitle);
  const saveToSlot = useGameStore((state) => state.saveToSlot);
  const loadFromSlot = useGameStore((state) => state.loadFromSlot);
  const setCozyMode = useGameStore((state) => state.setCozyMode);
  const cozyMode = useGameStore((state) => state.cozyMode);
  const elapsedMilliseconds = useGameStore(
    (state) => state.elapsedMilliseconds,
  );
  const specialStageUltimateStartedAt = useGameStore((state) => state.specialStageUltimateStartedAt);
  const specialStagePlacedCount = useGameStore((state) => state.specialStagePlacedCount);
  const majorMagicUsageCount = useGameStore(
    (state) => state.majorMagicUsageCount,
  );
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
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const elapsedText = [
    Math.floor(elapsedSeconds / 3600),
    Math.floor((elapsedSeconds % 3600) / 60),
    elapsedSeconds % 60,
  ]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
  const allBooksShelved =
    Object.values(bookLocations).length === 3072 &&
    Object.values(bookLocations).every(
      (location) => location.kind === "shelf",
    );
  const knownEarnedMagicPoints = getKnownEarnedMajorMagicPoints(correctRows);
  const spentMagicPoints = getSpentMajorMagicPoints(majorMagicLevels);
  const availableMagicPoints = getAvailableKnownMajorMagicPoints(
    correctRows,
    majorMagicLevels,
  );

  useEffect(() => {
    if (
      phase === "title" ||
      phase === "completed" ||
      phase === "special-stage-completed"
    ) {
      const profile = readProfileState();
      window.setTimeout(() => {
        setSpecialStageUnlocked(profile.specialStageUnlocked);
        setUnlockedAchievementIds(profile.unlockedAchievementIds);
      }, 0);
    }
  }, [phase]);

  useEffect(() => {
    const handleAchievementUnlocked = (event: Event) => {
      const achievementId = (event as CustomEvent<AchievementId>).detail;

      setUnlockedAchievementIds((current) =>
        current.includes(achievementId)
          ? current
          : [...current, achievementId],
      );
    };

    window.addEventListener(
      ACHIEVEMENT_UNLOCKED_EVENT,
      handleAchievementUnlocked,
    );

    return () =>
      window.removeEventListener(
        ACHIEVEMENT_UNLOCKED_EVENT,
        handleAchievementUnlocked,
      );
  }, []);

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
      <AchievementToasts />
      <LibraryAmbience
        active={phase === "sorting" || phase === "special-stage"}
        correctRows={correctRows}
        cozyMode={cozyMode}
        elapsedMilliseconds={elapsedMilliseconds}
      />
      {achievementsOpen ? (
        <AchievementGallery
          unlockedAchievementIds={unlockedAchievementIds}
          onClose={() => setAchievementsOpen(false)}
        />
      ) : null}
      {savesOpen ? (
        <SaveSlotsPanel
          canSave={phase === "sorting"}
          onClose={() => setSavesOpen(false)}
          onSave={(slotId) =>
            runSaveAction(() => saveToSlot(slotId))
          }
          onLoad={(slotId) =>
            runSaveAction(() => {
              loadFromSlot(slotId);
              setSavesOpen(false);
              setMobileMenuOpen(false);
            })
          }
        />
      ) : null}
      <InteractionHud />
      <div className="absolute inset-0">
        <GameCanvas
          onPlacementFeedback={(feedback) => {
            setPlacementFeedback(feedback);
            window.setTimeout(() => setPlacementFeedback(null), 850);
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="desktop-game-hud rounded-lg border border-white/10 bg-black/55 px-3 py-2 text-sm text-white backdrop-blur">
            <div className="font-medium">Librarian Game</div>
            <div className="text-white/60">
              WASD · Space jump · Q drop / hold Q drop stack · Esc releases
            </div>
          </div>

          <div className="desktop-game-hud pointer-events-auto rounded-lg border border-white/10 bg-black/55 px-3 py-2 text-right text-xs text-white/70 backdrop-blur">
            <div>Phase: {phase}</div>
            {phase === "special-stage" ? (
              <div>
                Ultimate: {specialStageUltimateStartedAt === null
                  ? "Press Z"
                  : `${specialStagePlacedCount}/3072`}
              </div>
            ) : null}
            {!cozyMode ? <div>Time: {elapsedText}</div> : null}
            <div>Correct rows: {correctRows} / 400</div>
            <div>Major Magic points: {availableMagicPoints} available · {spentMagicPoints}/{knownEarnedMagicPoints} spent/known earned</div>
            <div>Carrying: {carriedCount} / {carryCapacity}</div>
            <div>
              Keys: {collectedKeyCount} / 4 · Minor Magic:{" "}
              {unlockedMinorMagicIds.length} / 4
            </div>
            <div className="max-w-52 truncate">Seed: {seed ?? "none"}</div>

            <label className="mt-2 flex items-center justify-end gap-2">
              <span>Cozy</span>
              <input
                checked={cozyMode}
                onChange={(event) =>
                  setCozyMode(event.currentTarget.checked)
                }
                type="checkbox"
              />
            </label>

            <label className="mt-1 flex items-center justify-end gap-2">
              <span>Autosave</span>
              <input
                checked={autosaveEnabled}
                onChange={(event) =>
                  setAutosaveEnabled(event.currentTarget.checked)
                }
                type="checkbox"
              />
            </label>

            {phase === "sorting" ? (
              <button
                className="mt-2 rounded border border-white/15 px-3 py-1.5 hover:bg-white/10"
                onClick={() => setSavesOpen(true)}
                type="button"
              >
                Save / Load
              </button>
            ) : null}

            {saveError ? (
              <div className="mt-2 max-w-64 text-red-300">{saveError}</div>
            ) : null}
          </div>
        </div>

        {placementFeedback && phase === "sorting" ? (
          <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 rounded-full border border-white/15 bg-black/65 px-4 py-2 text-sm font-medium text-white backdrop-blur">
            {placementFeedback === "exact"
              ? "Exact placement"
              : placementFeedback === "correct-section"
                ? "Correct section, wrong position or row"
                : "Wrong section"}
          </div>
        ) : null}

        {phase === "special-stage" ? (
          <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-violet-300/25 bg-black/70 px-4 py-2 text-sm text-violet-100 backdrop-blur">
            {specialStageUltimateStartedAt === null
              ? "Press Z to use the Ultimate Skill."
              : `Ultimate arranging books: ${specialStagePlacedCount}/3072 · ~${Math.max(
                  0,
                  Math.ceil(
                    (SPECIAL_STAGE_ULTIMATE_DURATION_MILLISECONDS *
                      (1 - specialStagePlacedCount / 3072)) /
                      60000,
                  ),
                )} min remaining`}
          </div>
        ) : null}

        {phase === "sorting" && allBooksShelved ? (
          <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-amber-300/25 bg-black/70 px-4 py-2 text-sm text-amber-100 backdrop-blur">
            All 3,072 books are shelved. Return to the front doors.
          </div>
        ) : null}

        {phase === "completed" ? (
          <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-[min(38rem,calc(100vw-2rem))] rounded-2xl border border-white/15 bg-stone-950/95 p-7 text-white shadow-2xl">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                Principal&apos;s Evaluation
              </div>
              <h2 className="mt-2 text-3xl font-semibold">
                Library submitted
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-white/[0.05] p-3">
                  <div className="text-white/50">Correct rows</div>
                  <div className="mt-1 text-xl font-semibold">
                    {correctRows}/400
                  </div>
                </div>
                <div className="rounded-lg bg-white/[0.05] p-3">
                  <div className="text-white/50">Time</div>
                  <div className="mt-1 text-xl font-semibold">
                    {elapsedText}
                  </div>
                </div>
                <div className="rounded-lg bg-white/[0.05] p-3">
                  <div className="text-white/50">Major Magic uses</div>
                  <div className="mt-1 text-xl font-semibold">
                    {majorMagicUsageCount}
                  </div>
                </div>
                <div className="rounded-lg bg-white/[0.05] p-3">
                  <div className="text-white/50">Shelved books</div>
                  <div className="mt-1 text-xl font-semibold">
                    3072/3072
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2 text-sm text-white/75">
                {correctRows === 400 &&
                elapsedMilliseconds < 3 * 60 * 60 * 1000 ? (
                  <div>Efficiency Librarian condition met.</div>
                ) : null}
                {correctRows === 400 && majorMagicUsageCount === 0 ? (
                  <div>Anti-Magic Master condition met.</div>
                ) : null}
                {correctRows === 0 ? (
                  <div>You are Fired! condition met.</div>
                ) : null}
              </div>

              <button
                className="mt-6 rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
                onClick={() => returnToTitle()}
                type="button"
              >
                Return to title
              </button>
            </div>
          </div>
        ) : null}

        {phase === "special-stage-completed" ? (
          <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-[min(34rem,calc(100vw-2rem))] rounded-2xl border border-violet-300/20 bg-stone-950/95 p-7 text-center text-white shadow-2xl">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                Special Stage
              </div>
              <h2 className="mt-2 text-3xl font-semibold">
                Overtime avoided
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                The Ultimate Skill arranged all 3,072 books. This stage is kept
                separate from normal clear-time records.
              </p>
              <button
                className="mt-6 rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
                onClick={() => returnToTitle()}
                type="button"
              >
                Return to title
              </button>
            </div>
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
            <div className="mt-5 flex flex-col gap-2">
              <button
                className="rounded-lg bg-amber-200 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-100"
                onClick={() => startNewGame()}
                type="button"
              >
                Start new run
              </button>
              <button
                className="rounded-lg border border-white/15 px-5 py-3 font-semibold text-white/80 hover:bg-white/[0.06]"
                onClick={() => setSavesOpen(true)}
                type="button"
              >
                Continue / Saves
              </button>
              <button
                className="rounded-lg border border-white/15 px-5 py-3 font-semibold text-white/80 hover:bg-white/[0.06]"
                onClick={() => setAchievementsOpen(true)}
                type="button"
              >
                Achievements · {unlockedAchievementIds.length}/12
              </button>
              {specialStageUnlocked ? (
                <button
                  className="rounded-lg border border-violet-300/30 bg-violet-400/10 px-5 py-3 font-semibold text-violet-100 hover:bg-violet-400/15"
                  onClick={() => startSpecialStage()}
                  type="button"
                >
                  Special Stage
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/85 shadow-[0_0_8px_rgba(255,255,255,0.65)]" />
        )}
      </div>
      {(phase === "sorting" || phase === "special-stage") ? (
        <>
          <MobileHud
            correctRows={correctRows}
            carriedCount={carriedCount}
            carryCapacity={carryCapacity}
            elapsedText={elapsedText}
            cozyMode={cozyMode}
          />

          {!mobileMenuOpen && !magicMenuOpen ? (
            <MobileControls
              onOpenMenu={() => {
                playerInput.clearMove();
                setMobileMenuOpen(true);
              }}
            />
          ) : null}

          {mobileMenuOpen ? (
            <div className="mobile-game-menu pointer-events-auto absolute inset-0 z-40 flex items-end bg-black/45 p-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-sm">
              <div className="mx-auto w-full max-w-md rounded-2xl border border-white/15 bg-stone-950/95 p-5 text-white shadow-2xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                      Game menu
                    </div>
                    <div className="mt-1 text-sm text-white/55">
                      {correctRows}/400 rows · {carriedCount}/{carryCapacity} carried
                    </div>
                  </div>
                  <button
                    className="min-h-11 min-w-11 rounded-xl border border-white/15 px-3 text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                    type="button"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <label className="flex min-h-12 items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3">
                    <span>Cozy</span>
                    <input
                      checked={cozyMode}
                      onChange={(event) =>
                        setCozyMode(event.currentTarget.checked)
                      }
                      type="checkbox"
                    />
                  </label>

                  <label className="flex min-h-12 items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3">
                    <span>Autosave</span>
                    <input
                      checked={autosaveEnabled}
                      onChange={(event) =>
                        setAutosaveEnabled(event.currentTarget.checked)
                      }
                      type="checkbox"
                    />
                  </label>
                </div>

                {phase === "sorting" ? (
                  <>
                    <button
                      className="mt-4 min-h-12 w-full rounded-xl border border-white/15 bg-white/[0.04] text-sm"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setSavesOpen(true);
                      }}
                      type="button"
                    >
                      Save / Load
                    </button>

                    <button
                      className="mt-3 min-h-12 w-full rounded-xl border border-violet-300/20 bg-violet-400/10 text-sm font-semibold text-violet-100"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMagicMenuOpen(true);
                      }}
                      type="button"
                    >
                      Major Magic · {availableMagicPoints} point{availableMagicPoints === 1 ? "" : "s"} available
                    </button>
                  </>
                ) : null}

                {saveError ? (
                  <div className="mt-3 text-sm text-red-300">{saveError}</div>
                ) : null}

                <button
                  className="mt-3 min-h-12 w-full rounded-xl border border-amber-300/20 bg-amber-300/[0.06] text-sm text-amber-100"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAchievementsOpen(true);
                  }}
                  type="button"
                >
                  Achievements · {unlockedAchievementIds.length}/12
                </button>

                <button
                  className="mt-3 min-h-12 w-full rounded-xl border border-white/15 text-sm text-white/75"
                  onClick={() => {
                    playerInput.clearMove();
                    setMobileMenuOpen(false);
                    returnToTitle();
                  }}
                  type="button"
                >
                  Return to title
                </button>
              </div>
            </div>
          ) : null}
        </>
      ) : null}

    </main>
  );
}
