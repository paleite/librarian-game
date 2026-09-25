import { bookInstances } from "@/game/run/book-instances";
import { shelfRows } from "@/game/layout/shelf-rows";
import type { BookLocation } from "@/game/run/types";

import { validateShelfRow } from "./row-validation";

const bookById = new Map(bookInstances.map((book) => [book.id, book]));

export function getOrderedBookIdsForRow(
  rowId: string,
  bookLocations: Readonly<Record<string, BookLocation>>,
): string[] {
  return Object.entries(bookLocations)
    .flatMap(([bookId, location]) =>
      location.kind === "shelf" && location.rowId === rowId
        ? [{ bookId, index: location.index }]
        : [],
    )
    .sort((left, right) => left.index - right.index)
    .map((entry) => entry.bookId);
}

export function getCorrectRowCount(
  bookLocations: Readonly<Record<string, BookLocation>>,
): number {
  let correctRows = 0;

  for (const row of shelfRows) {
    const orderedBookIds = getOrderedBookIdsForRow(row.id, bookLocations);

    const validation = validateShelfRow({
      sectionCode: row.sectionCode,
      orderedBookIds,
      booksById: bookById,
    });

    if (validation.correct) {
      correctRows += 1;
    }
  }

  return correctRows;
}


export function isSectionComplete(
  sectionCode: string,
  bookLocations: Readonly<Record<string, BookLocation>>,
): boolean {
  const sectionRows = shelfRows.filter((row) => row.sectionCode === sectionCode);

  if (sectionRows.length === 0) {
    return false;
  }

  return sectionRows.every((row) => {
    const orderedBookIds = getOrderedBookIdsForRow(row.id, bookLocations);

    return validateShelfRow({
      sectionCode: row.sectionCode,
      orderedBookIds,
      booksById: bookById,
    }).correct;
  });
}
