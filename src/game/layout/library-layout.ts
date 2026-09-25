import { sections } from "@/game/catalog/sections";

import {
  LibraryTopologySchema,
  type LibraryTopology,
  type SectionPlacement,
} from "./schema";

function createAlternatingPlacements(
  codes: readonly string[],
  floor: 1 | 2,
): SectionPlacement[] {
  return codes.map((sectionCode, index) => ({
    sectionCode,
    floor,
    zone: index % 2 === 0 ? ("left" as const) : ("right" as const),
    routeOrder: index,
  }));
}

const firstFloor = [
  ...createAlternatingPlacements(
    ["1A", "1B", "1C", "1D", "1E", "1F", "1G", "1H", "1I", "1J", "1K", "1L"],
    1,
  ),
  { sectionCode: "1M", floor: 1 as const, zone: "back" as const, routeOrder: 12 },
  { sectionCode: "1N", floor: 1 as const, zone: "back" as const, routeOrder: 13 },
];

const secondFloor = [
  ...createAlternatingPlacements(
    ["2A", "2B", "2C", "2D", "2E", "2F", "2G", "2H", "2I", "2J", "2K", "2L"],
    2,
  ),
  { sectionCode: "2M", floor: 2 as const, zone: "back" as const, routeOrder: 12 },
  { sectionCode: "2N", floor: 2 as const, zone: "back" as const, routeOrder: 13 },
  { sectionCode: "2O", floor: 2 as const, zone: "back" as const, routeOrder: 14 },
  { sectionCode: "2P", floor: 2 as const, zone: "back" as const, routeOrder: 15 },
  { sectionCode: "2Q", floor: 2 as const, zone: "back" as const, routeOrder: 16 },
];

const topologyData = {
  sections: [...firstFloor, ...secondFloor],
  fixedLocations: [
    {
      id: "first-floor-stair-crest",
      floor: 1,
      description: "Wall crest between the main staircases.",
    },
    {
      id: "stair-railing-right-white-pot",
      floor: 1,
      description: "Right-hand white pot on the stair railing when facing the wall.",
    },
    {
      id: "first-floor-bench-book-pile-near-scales",
      floor: 1,
      description: "Book pile on the bench/table near the stairs and scales.",
    },
    {
      id: "second-floor-top-of-2o-bookcase",
      floor: 2,
      description: "Top of the 2O The Travels of Otherworld bookcase.",
    },
    {
      id: "second-floor-warrior-crimson-chest",
      floor: 2,
      description: "Crimson chest near the Warrior section.",
    },
    {
      id: "second-floor-warrior-emerald-chest",
      floor: 2,
      description: "Emerald chest near the Warrior section.",
    },
    {
      id: "second-floor-archery-golden-chest",
      floor: 2,
      description: "Golden chest near the Archery section.",
    },
    {
      id: "second-floor-archery-azure-chest",
      floor: 2,
      description: "Azure chest near the Archery section.",
    },
    {
      id: "staircase-recall-stone",
      floor: 1,
      description: "Recall Stone podium at the main staircase.",
    },
  ],
} as const;

export const libraryTopology: LibraryTopology =
  LibraryTopologySchema.parse(topologyData);

const authoredSectionCodes = new Set(sections.map((section) => section.code));
const topologySectionCodes = new Set(
  libraryTopology.sections.map((placement) => placement.sectionCode),
);

if (topologySectionCodes.size !== authoredSectionCodes.size) {
  throw new Error("Library topology does not contain every authored section");
}

for (const sectionCode of authoredSectionCodes) {
  if (!topologySectionCodes.has(sectionCode)) {
    throw new Error(`Library topology is missing section ${sectionCode}`);
  }
}
