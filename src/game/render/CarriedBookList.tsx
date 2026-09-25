"use client";

import { bookInstances } from "@/game/run/book-instances";
import { useGameStore } from "@/game/state/game-store";

const bookById = new Map(bookInstances.map((book) => [book.id, book]));

export function CarriedBookList({
  onClose,
}: {
  onClose: () => void;
}) {
  const carriedBookIds = useGameStore((state) => state.carriedBookIds);
  const reorderCarriedBook = useGameStore(
    (state) => state.reorderCarriedBook,
  );

  return (
    <div className="pointer-events-auto absolute inset-0 z-50 overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="mx-auto my-6 w-full max-w-xl rounded-2xl border border-white/15 bg-stone-950/95 p-5 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              Books in hand
            </div>
            <h2 className="mt-2 text-2xl font-semibold">
              {carriedBookIds.length} carried
            </h2>
            <div className="mt-1 text-xs text-white/45">
              The last item is the current top book.
            </div>
          </div>
          <button
            className="min-h-11 rounded-xl border border-white/15 px-4 text-sm"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="mt-5 space-y-2">
          {[...carriedBookIds].reverse().map((bookId, reverseIndex) => {
            const book = bookById.get(bookId);
            const actualIndex =
              carriedBookIds.length - 1 - reverseIndex;
            const isTop = actualIndex === carriedBookIds.length - 1;

            if (!book) {
              return null;
            }

            return (
              <div
                className={
                  "flex items-center justify-between gap-3 rounded-xl border p-3 " +
                  (isTop
                    ? "border-amber-300/25 bg-amber-300/[0.07]"
                    : "border-white/10 bg-white/[0.03]")
                }
                key={bookId}
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">
                    {book.title}
                  </div>
                  <div className="mt-1 text-xs text-white/50">
                    Volume {book.volumeNumber} / {book.volumeCount}
                  </div>
                </div>

                {isTop ? (
                  <div className="shrink-0 text-[10px] font-bold uppercase tracking-[0.15em] text-amber-200">
                    Top
                  </div>
                ) : (
                  <button
                    className="shrink-0 rounded-lg border border-white/15 px-3 py-2 text-xs hover:bg-white/[0.06]"
                    onClick={() =>
                      reorderCarriedBook(
                        actualIndex,
                        carriedBookIds.length - 1,
                      )
                    }
                    type="button"
                  >
                    Move to top
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {carriedBookIds.length === 0 ? (
          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.025] p-5 text-center text-sm text-white/45">
            You are not carrying any books.
          </div>
        ) : null}
      </div>
    </div>
  );
}
