"use client";

import { getRowsUntilNextKnownMajorMagicPoint } from "@/game/rules/progression";
import { getCorrectRowCount } from "@/game/rules/shelf-state";
import { useGameStore } from "@/game/state/game-store";

export function SkillPointProgress() {
  const phase = useGameStore((state) => state.phase);
  const bookLocations = useGameStore((state) => state.bookLocations);

  if (phase !== "sorting") {
    return null;
  }

  const correctRows = getCorrectRowCount(bookLocations);
  const rowsRemaining = getRowsUntilNextKnownMajorMagicPoint(correctRows);

  if (rowsRemaining === null) {
    return null;
  }

  return (
    <div className="desktop-skill-point-progress pointer-events-none absolute left-5 top-5 z-30 rounded-lg border border-white/15 bg-black/68 px-3 py-2 text-white shadow-lg backdrop-blur">
      <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-200/75">
        Next Major Magic Point
      </div>
      <div className="mt-1 text-sm font-semibold">
        {rowsRemaining} row{rowsRemaining === 1 ? "" : "s"} remaining
      </div>
    </div>
  );
}
