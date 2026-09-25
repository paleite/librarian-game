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

export interface MajorMagicDefinition extends AbilityDefinition<MajorMagicId> {
  hotkey: "1" | "2" | "3" | "4" | "5";
  maxLevel: number;
}

export const majorMagicDefinitions: readonly MajorMagicDefinition[] = [
  {
    id: "sort",
    name: "Sort",
    effect: "Sort carried books by series and volume order.",
    hotkey: "1",
    maxLevel: 5,
  },
  {
    id: "shelf-guide",
    name: "Shelf Guide",
    effect: "Reveal the correct shelf section for the top carried book.",
    hotkey: "2",
    maxLevel: 10,
  },
  {
    id: "insight",
    name: "Insight",
    effect: "Highlight loose matching volumes for the top carried book.",
    hotkey: "3",
    maxLevel: 10,
  },
  {
    id: "auto-shelving",
    name: "Auto-Shelving",
    effect: "Automatically shelve compatible carried books at the targeted section.",
    hotkey: "4",
    maxLevel: 10,
  },
  {
    id: "assemble",
    name: "Assemble",
    effect: "Collect loose volumes from the top carried book's series.",
    hotkey: "5",
    maxLevel: 10,
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

export const majorMagicDefinitionById = new Map(
  majorMagicDefinitions.map((definition) => [definition.id, definition]),
);
