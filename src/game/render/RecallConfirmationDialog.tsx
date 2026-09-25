"use client";

import { playRecallCue } from "@/game/audio/sfx";
import { useGameStore } from "@/game/state/game-store";
import { useInteractionUiStore } from "@/game/state/interaction-ui-store";

export function RecallConfirmationDialog() {
  const open = useInteractionUiStore(
    (state) => state.recallConfirmationOpen,
  );
  const close = useInteractionUiStore(
    (state) => state.closeRecallConfirmation,
  );
  const recallLooseBooks = useGameStore((state) => state.recallLooseBooks);
  const bookLocations = useGameStore((state) => state.bookLocations);

  if (!open) {
    return null;
  }

  const unshelvedCount = Object.values(bookLocations).filter(
    (location) => location.kind !== "shelf",
  ).length;

  const confirm = () => {
    recallLooseBooks();
    playRecallCue();
    close();
  };

  return (
    <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
      <div className="w-[min(30rem,calc(100vw-2rem))] rounded-2xl border border-violet-200/20 bg-stone-950/95 p-6 text-white shadow-2xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200/75">
          Recall Stone
        </div>
        <h2 className="mt-2 text-2xl font-semibold">Recall unshelved books?</h2>
        <p className="mt-3 text-sm leading-6 text-white/65">
          This will summon the remaining {unshelvedCount} unshelved book
          {unshelvedCount === 1 ? "" : "s"} back near the starting podium.
          Using the Recall Stone does not count as Major Magic and does not
          invalidate the Anti-Magic Master challenge.
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            className="min-h-11 rounded-xl border border-white/15 px-4 text-sm hover:bg-white/[0.06]"
            onClick={close}
            type="button"
          >
            Cancel
          </button>
          <button
            className="min-h-11 rounded-xl border border-violet-300/25 bg-violet-300/10 px-4 text-sm font-semibold text-violet-100 hover:bg-violet-300/[0.16]"
            onClick={confirm}
            type="button"
          >
            Recall books
          </button>
        </div>
      </div>
    </div>
  );
}
