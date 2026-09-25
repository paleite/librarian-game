import type { SectionCode } from "@/game/catalog/schema";

export interface Transform3 {
  position: readonly [number, number, number];
  rotation: readonly [number, number, number];
}

export interface BookInstance {
  id: string;
  seriesId: string;
  sectionCode: SectionCode;
  volumeNumber: number;
  volumeCount: 3 | 5 | 10;
  title: string;
  visualFamily: string;
}

export type BookLocation =
  | { kind: "spawn"; slotId: string }
  | { kind: "carried"; index: number }
  | { kind: "shelf"; rowId: string; index: number }
  | { kind: "dropped"; transform: Transform3 };

export interface RunBookState {
  bookId: string;
  location: BookLocation;
}

export interface RunIdentity {
  seed: string;
  catalogVersion: number;
  layoutVersion: number;
}

export interface InitialRun {
  identity: RunIdentity;
  books: readonly RunBookState[];
}
