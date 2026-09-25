"use client";

import { useMemo } from "react";

import { useGameSettings } from "@/game/settings/game-settings";
import { useGameStore } from "@/game/state/game-store";
import {
  dismissTutorial,
  useDismissedTutorials,
  type TutorialId,
} from "@/game/tutorial/tutorial-state";

interface TutorialDefinition {
  id: TutorialId;
  eyebrow: string;
  title: string;
  body: string;
}

const STACK_DROP_TUTORIAL: TutorialDefinition = {
  id: "stack-drop",
  eyebrow: "New interaction",
  title: "Stack carried books",
  body: "Hold the Drop Book control to place the whole carried stack neatly on the ground.",
};

const RECALL_TUTORIAL: TutorialDefinition = {
  id: "recall-stone",
  eyebrow: "Recall Stone available",
  title: "Recover remaining books",
  body: "With 20 or fewer unshelved books remaining, the Recall Stone at the starting podium can summon loose or unreachable books back to you. Using it does not count as Major Magic.",
};

export function TutorialHints() {
  const { displayTutorial } = useGameSettings();
  const phase = useGameStore((state) => state.phase);
  const carriedBookIds = useGameStore((state) => state.carriedBookIds);
  const bookLocations = useGameStore((state) => state.bookLocations);
  const dismissed = useDismissedTutorials();

  const unshelvedCount = useMemo(
    () =>
      Object.values(bookLocations).filter(
        (location) => location.kind !== "shelf",
      ).length,
    [bookLocations],
  );

  if (!displayTutorial || phase !== "sorting") {
    return null;
  }

  const dismissedSet = new Set(dismissed);
  const tutorial =
    unshelvedCount > 0 &&
    unshelvedCount <= 20 &&
    !dismissedSet.has("recall-stone")
      ? RECALL_TUTORIAL
      : carriedBookIds.length >= 2 &&
          !dismissedSet.has("stack-drop")
        ? STACK_DROP_TUTORIAL
        : null;

  if (!tutorial) {
    return null;
  }

  return (
    <div className="pointer-events-auto absolute bottom-[max(24px,env(safe-area-inset-bottom))] right-[max(18px,env(safe-area-inset-right))] z-40 w-[min(25rem,calc(100vw-2rem))] rounded-xl border border-violet-200/20 bg-black/82 p-4 text-white shadow-2xl backdrop-blur">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200/75">
        {tutorial.eyebrow}
      </div>
      <div className="mt-1 text-base font-semibold">{tutorial.title}</div>
      <div className="mt-2 text-sm leading-5 text-white/65">
        {tutorial.body}
      </div>
      <button
        className="mt-3 min-h-10 rounded-lg border border-white/15 px-3 text-sm hover:bg-white/[0.06]"
        onClick={() => dismissTutorial(tutorial.id)}
        type="button"
      >
        Got it
      </button>
    </div>
  );
}
