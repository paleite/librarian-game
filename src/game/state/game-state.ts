import type { MajorMagicId, MinorMagicId } from "@/game/content/abilities";
import type { SectionCode } from "@/game/catalog/schema";
import type { SecretKeyId } from "@/game/content/secrets";
import type { BookLocation, RunIdentity, Transform3 } from "@/game/run/types";

export type GamePhase = "title" | "sorting" | "completed" | "special-stage" | "special-stage-completed";

export type MajorMagicLevels = Record<MajorMagicId, number>;
export type MajorMagicReadyAt = Record<MajorMagicId, number>;

export interface GameState {
  phase: GamePhase;
  runIdentity: RunIdentity | null;
  bookLocations: Record<string, BookLocation>;
  carriedBookIds: string[];
  collectedKeyIds: SecretKeyId[];
  openedSecretChestIds: SecretKeyId[];
  majorMagicLevels: MajorMagicLevels;
  unlockedMinorMagicIds: MinorMagicId[];
  elapsedMilliseconds: number;
  majorMagicUsageCount: number;
  cozyMode: boolean;
  autosaveEnabled: boolean;
  activeShelfGuideSectionCode: SectionCode | null;
  shelfGuideActiveUntil: number;
  activeInsightSeriesId: string | null;
  insightActiveUntil: number;
  targetedShelfRowId: string | null;
  majorMagicReadyAt: MajorMagicReadyAt;
  autoShelvingActiveUntil: number;
  specialStageUltimateStartedAt: number | null;
  specialStagePlacedCount: number;
}

export interface BookMovementActions {
  pickUpBook: (bookId: string) => void;
  reorderCarriedBook: (fromIndex: number, toIndex: number) => void;
  dropCarriedBook: (bookId: string, transform: Transform3) => void;
  dropAllCarriedBooks: (transforms: readonly Transform3[]) => void;
  placeBookOnShelf: (bookId: string, rowId: string, index: number) => void;
  collectSecretKey: (keyId: SecretKeyId) => void;
  openSecretChest: (keyId: SecretKeyId) => void;
  collectSecretReward: (keyId: SecretKeyId) => void;
  recallLooseBooks: () => void;
  setTargetedShelfRow: (rowId: string | null) => void;
  useMajorMagic: (id: MajorMagicId) => void;
  addElapsedMilliseconds: (milliseconds: number) => void;
  completeRun: () => void;
  startSpecialStage: () => void;
  startSpecialStageUltimate: () => void;
  advanceSpecialStageUltimate: (now: number) => void;
}

export const initialMajorMagicLevels: MajorMagicLevels = {
  sort: 0,
  "shelf-guide": 0,
  insight: 0,
  "auto-shelving": 0,
  assemble: 0,
};

export const initialMajorMagicReadyAt: MajorMagicReadyAt = {
  sort: 0,
  "shelf-guide": 0,
  insight: 0,
  "auto-shelving": 0,
  assemble: 0,
};

export const initialGameState: GameState = {
  phase: "title",
  runIdentity: null,
  bookLocations: {},
  carriedBookIds: [],
  collectedKeyIds: [],
  openedSecretChestIds: [],
  majorMagicLevels: initialMajorMagicLevels,
  unlockedMinorMagicIds: [],
  elapsedMilliseconds: 0,
  majorMagicUsageCount: 0,
  cozyMode: false,
  autosaveEnabled: true,
  activeShelfGuideSectionCode: null,
  shelfGuideActiveUntil: 0,
  activeInsightSeriesId: null,
  insightActiveUntil: 0,
  targetedShelfRowId: null,
  majorMagicReadyAt: initialMajorMagicReadyAt,
  autoShelvingActiveUntil: 0,
  specialStageUltimateStartedAt: null,
  specialStagePlacedCount: 0,
};
