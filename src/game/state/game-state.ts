import type { MajorMagicId, MinorMagicId } from "@/game/content/abilities";
import type { SecretKeyId } from "@/game/content/secrets";
import type { BookLocation, RunIdentity, Transform3 } from "@/game/run/types";

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

export interface BookMovementActions {
  pickUpBook: (bookId: string) => void;
  reorderCarriedBook: (fromIndex: number, toIndex: number) => void;
  dropCarriedBook: (bookId: string, transform: Transform3) => void;
  dropAllCarriedBooks: (transforms: readonly Transform3[]) => void;
  placeBookOnShelf: (bookId: string, rowId: string, index: number) => void;
  collectSecretKey: (keyId: SecretKeyId) => void;
  openSecretChest: (keyId: SecretKeyId) => void;
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
