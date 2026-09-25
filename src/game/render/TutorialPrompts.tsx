"use client";

import { useState } from "react";

import { useGameSettings } from "@/game/settings/game-settings";
import { useGameStore } from "@/game/state/game-store";

type TutorialId = "stack-drop" | "recall-stone";

export function TutorialPrompts() {
  const { displayTutorial } = useGameSettings();
  const [dismissed, setDismissed] = useState<ReadonlySet<TutorialId>>(
    () => new Set(),
  );
  const phase = useGameStore((state) => state.phase);
  const carriedCount = useGameStore((state) => state.carriedBookIds.length);
  const bookLocations = useGameStore((state) => state.bookLocations);

  if (!displayTutorial || phase !== "sorting") {
    return null;
  }

  const unshelvedCount = Object.values(bookLocations).filter(
    (location) => location.kind !== "shelf",
  ).length;

  let tutorial:
    | {
        id: TutorialId;
        title: string;
        body: string;
      }
    | null = null;

  if (carriedCount >= 2 && !dismissed.has("stack-drop")) {
    tutorial = {
      id: "stack-drop",
      title: "Stack carried books",
      body:
        "Hold the Drop control to place every book in your carried stack neatly on the floor.",
    };
  } else if (
    unshelvedCount > 0 &&
    unshelvedCount <= 20 &&
    !dismissed.has("recall-stone")
  ) {
    tutorial = {
      id: "recall-stone",
      title: "Recall Stone available",
      body:
        "The Recall Stone at the main staircase can now gather the remaining unshelved books into one place.",
    };
  }

  if (!tutorial) {
    return null;
  }

  return (
    <div className="pointer-events-auto absolute bottom-24 right-5 z-40 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-amber-300/20 bg-black/82 p-4 text-white shadow-2xl backdrop-blur">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
        Tutorial
      </div>
      <div className="mt-1 font-semibold">{tutorial.title}</div>
      <div className="mt-2 text-sm leading-5 text-white/60">
        {tutorial.body}
      </div>
      <button
        className="mt-3 min-h-10 rounded-lg border border-white/15 px-3 text-xs font-semibold text-white/75 hover:bg-white/[0.06]"
        onClick={() =>
          setDismissed((current) => {
            const next = new Set(current);
            next.add(tutorial.id);
            return next;
          })
        }
        type="button"
      >
        Got it
      </button>
    </div>
  );
}
