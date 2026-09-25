export type GamePhase = "title" | "sorting" | "completed";

export interface GameState {
  phase: GamePhase;
  correctlyShelvedRows: number;
  shelvedBooks: number;
  carriedBookIds: string[];
}

export const initialGameState: GameState = {
  phase: "title",
  correctlyShelvedRows: 0,
  shelvedBooks: 0,
  carriedBookIds: [],
};
