"use client";

import { bookInstances } from "@/game/run/book-instances";
import { useGameStore } from "@/game/state/game-store";
import { useInteractionUiStore } from "@/game/state/interaction-ui-store";

const bookById = new Map(bookInstances.map((book) => [book.id, book]));

export function InteractionHud() {
  const aimed = useInteractionUiStore((state) => state.aimed);
  const topCarriedBookId = useGameStore(
    (state) => state.carriedBookIds.at(-1) ?? null,
  );
  const phase = useGameStore((state) => state.phase);

  const carriedBook = topCarriedBookId
    ? bookById.get(topCarriedBookId) ?? null
    : null;

  if (phase !== "sorting" && phase !== "special-stage") {
    return null;
  }

  return (
    <>
      {aimed ? (
        <div className="pointer-events-none absolute left-1/2 top-[calc(50%+24px)] z-30 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 text-center text-white">
          <div className="inline-block rounded-lg border border-white/15 bg-black/72 px-3 py-2 shadow-xl backdrop-blur">
            <div className="text-sm font-semibold">{aimed.title}</div>
            {aimed.subtitle ? (
              <div className="mt-0.5 text-xs text-white/60">
                {aimed.subtitle}
              </div>
            ) : null}
            {aimed.action ? (
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-200/80">
                {aimed.action}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {carriedBook ? (
        <div className="pointer-events-none absolute bottom-[max(18px,env(safe-area-inset-bottom))] left-1/2 z-30 w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-white/15 bg-black/72 px-5 py-3 text-center text-white shadow-2xl backdrop-blur">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
            Holding
          </div>
          <div className="mt-1 text-sm font-semibold">{carriedBook.title}</div>
          <div className="mt-1 text-xs text-white/60">
            Volume {carriedBook.volumeNumber} / {carriedBook.volumeCount}
          </div>
        </div>
      ) : null}
    </>
  );
}
