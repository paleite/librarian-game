import type { BookInstance } from "@/game/run/types";
import type { SectionCode } from "@/game/catalog/schema";

export type RowValidationFailure =
  | "empty"
  | "mixed-series"
  | "incomplete-series"
  | "wrong-section"
  | "wrong-volume-order"
  | "unknown-book";

export type RowValidationResult =
  | {
      correct: true;
      seriesId: string;
    }
  | {
      correct: false;
      reason: RowValidationFailure;
      seriesId?: string;
    };

export interface ValidateShelfRowInput {
  sectionCode: SectionCode;
  orderedBookIds: readonly string[];
  booksById: ReadonlyMap<string, BookInstance>;
}

export function validateShelfRow({
  sectionCode,
  orderedBookIds,
  booksById,
}: ValidateShelfRowInput): RowValidationResult {
  if (orderedBookIds.length === 0) {
    return { correct: false, reason: "empty" };
  }

  const books = orderedBookIds.map((bookId) => booksById.get(bookId));

  if (books.some((book) => !book)) {
    return { correct: false, reason: "unknown-book" };
  }

  const knownBooks = books.filter(
    (book): book is BookInstance => book !== undefined,
  );
  const firstBook = knownBooks[0];
  const seriesId = firstBook.seriesId;

  if (knownBooks.some((book) => book.seriesId !== seriesId)) {
    return { correct: false, reason: "mixed-series", seriesId };
  }

  if (
    knownBooks.length !== firstBook.volumeCount ||
    new Set(knownBooks.map((book) => book.volumeNumber)).size !==
      firstBook.volumeCount
  ) {
    return { correct: false, reason: "incomplete-series", seriesId };
  }

  if (firstBook.sectionCode !== sectionCode) {
    return { correct: false, reason: "wrong-section", seriesId };
  }

  for (let index = 0; index < knownBooks.length; index += 1) {
    if (knownBooks[index].volumeNumber !== index + 1) {
      return { correct: false, reason: "wrong-volume-order", seriesId };
    }
  }

  return { correct: true, seriesId };
}
