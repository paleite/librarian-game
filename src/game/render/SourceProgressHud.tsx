"use client";

import { getRowsUntilNextKnownMajorMagicPoint } from "@/game/rules/progression";

export function SourceProgressHud({
  correctRows,
  shelvedBooks,
  carriedCount,
  carryCapacity,
  elapsedText,
  cozyMode,
}: {
  correctRows: number;
  shelvedBooks: number;
  carriedCount: number;
  carryCapacity: number;
  elapsedText: string;
  cozyMode: boolean;
}) {
  const rowsRemaining = getRowsUntilNextKnownMajorMagicPoint(correctRows);

  return (
    <div className="source-progress-hud pointer-events-none absolute inset-0 z-30 text-white">
      <div className="absolute left-5 top-5 min-w-36 rounded-lg bg-black/45 px-3 py-2 shadow-lg backdrop-blur-[2px]">
        {rowsRemaining !== null ? (
          <div className="text-[11px] font-semibold text-white/75">
            {rowsRemaining} row{rowsRemaining === 1 ? "" : "s"} left to level up
          </div>
        ) : null}

        <div className="mt-1 flex items-baseline gap-4">
          <div>
            <span className="text-lg font-bold tabular-nums">{correctRows}</span>
            <span className="text-xs text-white/55"> / 400</span>
          </div>
          <div>
            <span className="text-lg font-bold tabular-nums">{shelvedBooks}</span>
            <span className="text-xs text-white/55"> / 3072</span>
          </div>
        </div>
      </div>

      {!cozyMode ? (
        <div className="absolute right-5 top-5 rounded bg-black/35 px-2 py-1 text-xs font-semibold tabular-nums text-white/70 backdrop-blur-[2px]">
          {elapsedText}
        </div>
      ) : null}

      <div className="absolute bottom-5 right-5 rounded-lg bg-black/45 px-3 py-2 text-base font-bold tabular-nums shadow-lg backdrop-blur-[2px]">
        {carriedCount}
        <span className="text-sm font-medium text-white/55"> / {carryCapacity}</span>
      </div>
    </div>
  );
}
