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
    name: "First Step",
    description: "Complete your first correct row.",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    description: "Complete 50 correct rows.",
  },
  {
    id: "veteran",
    name: "Veteran",
    description: "Complete 200 correct rows.",
  },
  {
    id: "grand",
    name: "Grand",
    description: "Complete all 400 correct rows.",
  },
  {
    id: "novice-mage",
    name: "Novice Mage",
    description: "Use Major Magic for the first time.",
  },
  {
    id: "sage",
    name: "Sage",
    description: "Unlock all five Major Magic abilities.",
  },
  {
    id: "life-hack",
    name: "Life Hack",
    description: "Unlock all four Minor Magic abilities.",
  },
  {
    id: "archmage",
    name: "Archmage",
    description: "Reach the maximum level of every Major Magic ability.",
  },
  {
    id: "overtime-avoider",
    name: "Overtime Avoider",
    description: "Use the Special Stage Ultimate Skill to clear every book.",
  },
  {
    id: "efficiency",
    name: "Efficiency",
    description: "Finish all 400 rows in under three hours.",
  },
  {
    id: "anti-magic",
    name: "Anti-Magic",
    description: "Finish all 400 rows without using Major Magic.",
  },
  {
    id: "you-are-fired",
    name: "You are Fired",
    description: "Shelve all 3,072 books with zero correct rows.",
  },
];

export const achievementDefinitionById = new Map(
  achievementDefinitions.map((definition) => [definition.id, definition]),
);
