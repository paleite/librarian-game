import { bookSeries } from "@/game/catalog/book-series";

import type { BookInstance } from "./types";

export const bookInstances: readonly BookInstance[] = bookSeries.flatMap((series) =>
  Array.from({ length: series.volumeCount }, (_, index) => {
    const volumeNumber = index + 1;

    return {
      id: `${series.id}:${String(volumeNumber).padStart(2, "0")}`,
      seriesId: series.id,
      sectionCode: series.sectionCode,
      volumeNumber,
      volumeCount: series.volumeCount,
      title: series.title,
      visualFamily: series.visualFamily,
    };
  }),
);

if (bookInstances.length !== 3072) {
  throw new Error(
    `Expected 3072 derived book instances, got ${bookInstances.length}`,
  );
}

const uniqueBookIds = new Set(bookInstances.map((book) => book.id));

if (uniqueBookIds.size !== bookInstances.length) {
  throw new Error("Duplicate physical book IDs detected");
}
