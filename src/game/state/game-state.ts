import type { MajorMagicId, MinorMagicId } from "@/game/content/abilities";
import type { SecretKeyId } from "@/game/content/secrets";
import type { BookLocation, RunIdentity } from "@/game/run/types";

export type GamePhase = "title" | "sorting" | "completed";

export interface GameState {
  phase: GamePhase;
  runIdentity: RunIdentity | null;
  bookLocations: Record<string, BookLocation>;
  carriedBookIds: string[];
  collectedKeyIds: SecretKeyId[];
  unlockedMajorMagicIds: MajorMagicId[];
  unlockedMinorMagicIds: MinorMagicId[];
  elapsedMilliseconds: number;
  majorMagicUsageCount: number;
  cozyMode: boolean;
}

export const initialGameState: GameState = {
  phase: "title",
  runIdentity: null,
  bookLocations: {},
  carriedBookIds: [],
  collectedKeyIds: [],
  unlockedMajorMagicIds: [],
  unlockedMinorMagicIds: [],
  elapsedMilliseconds: 0,
  majorMagicUsageCount: 0,
  cozyMode: false,
};
