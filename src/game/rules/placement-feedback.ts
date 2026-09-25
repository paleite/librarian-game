import { shelfRows } from "@/game/layout/shelf-rows";
import { bookInstances } from "@/game/run/book-instances";
import type { BookLocation } from "@/game/run/types";

export type PlacementFeedback =
  | "exact"
  | "correct-section"
  | "wrong-section";

const bookById = new Map(bookInstances.map((book) => [book.id, book]));
const rowById = new Map(shelfRows.map((row) => [row.id, row]));

export interface GetPlacementFeedbackInput {
  bookId: string;
  rowId: string;
  index: number;
  bookLocations: Readonly<Record<string, BookLocation>>;
}

export function getPlacementFeedback({
  bookId,
  rowId,
  index,
  bookLocations,
}: GetPlacementFeedbackInput): PlacementFeedback {
  const book = bookById.get(bookId);
  const row = rowById.get(rowId);

  if (!book || !row) {
    throw new Error("Cannot evaluate placement for unknown book or shelf row");
  }

  if (book.sectionCode !== row.sectionCode) {
    return "wrong-section";
  }

  if (row.capacity !== book.volumeCount || index !== book.volumeNumber - 1) {
    return "correct-section";
  }

  for (const [otherBookId, location] of Object.entries(bookLocations)) {
    if (
      otherBookId === bookId ||
      location.kind !== "shelf" ||
      location.rowId === rowId
    ) {
      continue;
    }

    const otherBook = bookById.get(otherBookId);

    if (otherBook?.seriesId === book.seriesId) {
      return "correct-section";
    }
  }

  return "exact";
}
