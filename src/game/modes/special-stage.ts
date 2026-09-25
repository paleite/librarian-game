import { bookSeries } from "@/game/catalog/book-series";
import { shelfRows } from "@/game/layout/shelf-rows";
import { bookInstances } from "@/game/run/book-instances";
import type { BookLocation } from "@/game/run/types";

const rowsBySectionAndCapacity = new Map<string, string[]>();

for (const row of shelfRows) {
  const key = `${row.sectionCode}:${row.capacity}`;
  const rowIds = rowsBySectionAndCapacity.get(key) ?? [];
  rowIds.push(row.id);
  rowsBySectionAndCapacity.set(key, rowIds);
}

const seriesTargetRowId = new Map<string, string>();

for (const series of bookSeries) {
  const key = `${series.sectionCode}:${series.volumeCount}`;
  const rowIds = rowsBySectionAndCapacity.get(key);

  if (!rowIds || rowIds.length === 0) {
    throw new Error(`No compatible special-stage row for ${series.id}`);
  }

  const rowId = rowIds.shift();

  if (!rowId) {
    throw new Error(`No remaining special-stage row for ${series.id}`);
  }

  seriesTargetRowId.set(series.id, rowId);
}

export const specialStageOrderedBookIds = [...bookInstances]
  .sort((left, right) => {
    const sectionComparison = left.sectionCode.localeCompare(right.sectionCode);

    if (sectionComparison !== 0) {
      return sectionComparison;
    }

    const seriesComparison = left.seriesId.localeCompare(right.seriesId);

    return seriesComparison !== 0
      ? seriesComparison
      : left.volumeNumber - right.volumeNumber;
  })
  .map((book) => book.id);

const bookById = new Map(bookInstances.map((book) => [book.id, book]));

export function getSpecialStageCorrectLocation(bookId: string): BookLocation {
  const book = bookById.get(bookId);

  if (!book) {
    throw new Error(`Unknown special-stage book ${bookId}`);
  }

  const rowId = seriesTargetRowId.get(book.seriesId);

  if (!rowId) {
    throw new Error(`No special-stage row assigned for ${book.seriesId}`);
  }

  return {
    kind: "shelf",
    rowId,
    index: book.volumeNumber - 1,
  };
}

export const SPECIAL_STAGE_ULTIMATE_DURATION_MILLISECONDS = 10 * 60 * 1000;
