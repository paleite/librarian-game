import { shuffled } from "./seeded-random";
import type { BookInstance, InitialRun } from "./types";

export const CATALOG_VERSION = 1;
export const LAYOUT_VERSION = 4;

export interface FixedBookPlacement {
  bookId: string;
  slotId: string;
}

export interface GenerateInitialRunInput {
  seed: string;
  books: readonly BookInstance[];
  spawnSlotIds: readonly string[];
  fixedPlacements?: readonly FixedBookPlacement[];
}

export function generateInitialRun({
  seed,
  books,
  spawnSlotIds,
  fixedPlacements = [],
}: GenerateInitialRunInput): InitialRun {
  if (spawnSlotIds.length < books.length) {
    throw new Error(
      `Not enough spawn slots: need ${books.length}, got ${spawnSlotIds.length}`,
    );
  }

  const uniqueBookIds = new Set(books.map((book) => book.id));
  const uniqueSpawnSlotIds = new Set(spawnSlotIds);

  if (uniqueBookIds.size !== books.length) {
    throw new Error("Cannot generate a run with duplicate book IDs");
  }

  if (uniqueSpawnSlotIds.size !== spawnSlotIds.length) {
    throw new Error("Cannot generate a run with duplicate spawn-slot IDs");
  }

  const fixedBookIds = new Set<string>();
  const fixedSlotIds = new Set<string>();

  for (const placement of fixedPlacements) {
    if (!uniqueBookIds.has(placement.bookId)) {
      throw new Error(`Fixed placement references unknown book ${placement.bookId}`);
    }

    if (!uniqueSpawnSlotIds.has(placement.slotId)) {
      throw new Error(
        `Fixed placement references unknown spawn slot ${placement.slotId}`,
      );
    }

    if (fixedBookIds.has(placement.bookId) || fixedSlotIds.has(placement.slotId)) {
      throw new Error("Fixed placements must use unique books and spawn slots");
    }

    fixedBookIds.add(placement.bookId);
    fixedSlotIds.add(placement.slotId);
  }

  const randomizedBookIds = shuffled(
    books
      .map((book) => book.id)
      .filter((bookId) => !fixedBookIds.has(bookId)),
    `${seed}:books`,
  );

  const randomizedSpawnSlotIds = shuffled(
    spawnSlotIds.filter((slotId) => !fixedSlotIds.has(slotId)),
    `${seed}:spawns`,
  );

  if (randomizedSpawnSlotIds.length < randomizedBookIds.length) {
    throw new Error("Fixed placements left too few randomized spawn slots");
  }

  return {
    identity: {
      seed,
      catalogVersion: CATALOG_VERSION,
      layoutVersion: LAYOUT_VERSION,
    },
    books: [
      ...fixedPlacements.map((placement) => ({
        bookId: placement.bookId,
        location: {
          kind: "spawn" as const,
          slotId: placement.slotId,
        },
      })),
      ...randomizedBookIds.map((bookId, index) => ({
        bookId,
        location: {
          kind: "spawn" as const,
          slotId: randomizedSpawnSlotIds[index],
        },
      })),
    ],
  };
}
