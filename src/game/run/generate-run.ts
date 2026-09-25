import { shuffled } from "./seeded-random";
import type { BookInstance, InitialRun } from "./types";

export const CATALOG_VERSION = 1;
export const LAYOUT_VERSION = 2;

export interface GenerateInitialRunInput {
  seed: string;
  books: readonly BookInstance[];
  spawnSlotIds: readonly string[];
}

export function generateInitialRun({
  seed,
  books,
  spawnSlotIds,
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

  const shuffledBookIds = shuffled(
    books.map((book) => book.id),
    `${seed}:books`,
  );
  const shuffledSpawnSlotIds = shuffled(spawnSlotIds, `${seed}:spawns`);

  return {
    identity: {
      seed,
      catalogVersion: CATALOG_VERSION,
      layoutVersion: LAYOUT_VERSION,
    },
    books: shuffledBookIds.map((bookId, index) => ({
      bookId,
      location: {
        kind: "spawn",
        slotId: shuffledSpawnSlotIds[index],
      },
    })),
  };
}
