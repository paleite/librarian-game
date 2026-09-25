import { bookSeries } from "@/game/catalog/book-series";
import type { BookSeries, SectionCode } from "@/game/catalog/schema";

export interface ShelfRowDefinition {
  id: string;
  sectionCode: SectionCode;
  capacity: 3 | 5 | 10;
  ordinalWithinSection: number;
}

const seriesBySection = new Map<SectionCode, BookSeries[]>();

for (const series of bookSeries) {
  const sectionSeries = seriesBySection.get(series.sectionCode) ?? [];
  sectionSeries.push(series);
  seriesBySection.set(series.sectionCode, sectionSeries);
}

/**
 * The source game allows a complete title to occupy any compatible row within
 * its correct section. We therefore derive the number and capacities of rows
 * from the catalog without assigning a specific title to a specific row.
 *
 * Exact 3D transforms are authored separately once the source layout has been
 * reconstructed from maps/screenshots/video.
 */
export const shelfRows: readonly ShelfRowDefinition[] = Array.from(
  seriesBySection,
).flatMap(([sectionCode, sectionSeries]) => {
  const capacities = sectionSeries
    .map((series) => series.volumeCount)
    .sort((left, right) => right - left);

  return capacities.map((capacity, index) => ({
    id: `${sectionCode.toLowerCase()}-row-${String(index + 1).padStart(2, "0")}`,
    sectionCode,
    capacity,
    ordinalWithinSection: index,
  }));
});

if (shelfRows.length !== 400) {
  throw new Error(`Expected 400 semantic shelf rows, got ${shelfRows.length}`);
}

const totalShelfCapacity = shelfRows.reduce(
  (sum, row) => sum + row.capacity,
  0,
);

if (totalShelfCapacity !== 3072) {
  throw new Error(
    `Expected total shelf capacity of 3072, got ${totalShelfCapacity}`,
  );
}
