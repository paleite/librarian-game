export const majorMagicIds = [
  "sort",
  "shelf-guide",
  "insight",
  "auto-shelving",
  "assemble",
] as const;

export const minorMagicIds = [
  "high-jump",
  "carry-capacity-3",
  "sprint",
  "carry-capacity-2",
] as const;

export type MajorMagicId = (typeof majorMagicIds)[number];
export type MinorMagicId = (typeof minorMagicIds)[number];

export interface AbilityDefinition<TId extends string> {
  id: TId;
  name: string;
  effect: string;
}

export const majorMagicDefinitions: readonly AbilityDefinition<MajorMagicId>[] = [
  {
    id: "sort",
    name: "Sort",
    effect: "Reorder the books currently carried by the player.",
  },
  {
    id: "shelf-guide",
    name: "Shelf Guide",
    effect: "Reveal the correct library section for the top carried book.",
  },
  {
    id: "insight",
    name: "Insight",
    effect: "Highlight loose matching volumes for the top carried book.",
  },
  {
    id: "auto-shelving",
    name: "Auto-Shelving",
    effect: "Place compatible carried books onto the targeted shelf.",
  },
  {
    id: "assemble",
    name: "Assemble",
    effect: "Collect other loose volumes from the top carried book's series.",
  },
];

export const minorMagicDefinitions: readonly AbilityDefinition<MinorMagicId>[] = [
  {
    id: "high-jump",
    name: "High Jump",
    effect: "Increase jump height and unlock elevated traversal.",
  },
  {
    id: "carry-capacity-3",
    name: "Carry Capacity +3",
    effect: "Increase carry capacity from 10 to 13.",
  },
  {
    id: "sprint",
    name: "Sprint",
    effect: "Unlock faster player movement.",
  },
  {
    id: "carry-capacity-2",
    name: "Carry Capacity +2",
    effect: "Increase carry capacity from 13 to 15.",
  },
];
