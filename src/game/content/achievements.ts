export const achievementIds = [
  "first-step",
  "intermediate",
  "veteran",
  "grand",
  "novice-mage",
  "sage",
  "life-hack",
  "archmage",
  "overtime-avoider",
  "efficiency",
  "anti-magic",
  "you-are-fired",
] as const;

export type AchievementId = (typeof achievementIds)[number];

export interface AchievementDefinition {
  id: AchievementId;
  name: string;
  description: string;
}

export const achievementDefinitions: readonly AchievementDefinition[] = [
  {
    id: "first-step",
    name: "The First Step of Organizing",
    description: "Complete the first row by arranging the books correctly.",
  },
  {
    id: "intermediate",
    name: "Intermediate Librarian",
    description: "Complete the 50 rows.",
  },
  {
    id: "veteran",
    name: "Veteran Librarian",
    description: "Complete the 200 rows.",
  },
  {
    id: "grand",
    name: "The Grand Librarian",
    description: "Complete the 400 rows.",
  },
  {
    id: "novice-mage",
    name: "Novice Mage",
    description: "Unlocked your first major spell.",
  },
  {
    id: "sage",
    name: "Sage of the Library",
    description: "Unlocked all major magic.",
  },
  {
    id: "life-hack",
    name: "Life Hack Wizard",
    description: "Unlocked all minor magic.",
  },
  {
    id: "archmage",
    name: "The Archmage",
    description: "Maxed out all major spell levels.",
  },
  {
    id: "overtime-avoider",
    name: "Overtime Avoider",
    description: "Used your ultimate skill in the special stage to automatically clear all the books.",
  },
  {
    id: "efficiency",
    name: "Efficiency Librarian",
    description: "Completed the game within three hours.",
  },
  {
    id: "anti-magic",
    name: "Anti-Magic Master",
    description: "Completed the game without using major magic.",
  },
  {
    id: "you-are-fired",
    name: "You are Fired!",
    description: "Arranged all 3,072 books randomly on the shelves, but left the library without completing a single row.",
  },
];

export const achievementDefinitionById = new Map(
  achievementDefinitions.map((definition) => [definition.id, definition]),
);
