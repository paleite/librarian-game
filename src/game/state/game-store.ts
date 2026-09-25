"use client";

import { create } from "zustand";

import { bookInstances } from "@/game/run/book-instances";
import { generateInitialRun, CATALOG_VERSION, LAYOUT_VERSION } from "@/game/run/generate-run";
import { spawnSlots } from "@/game/layout/spawn-slots";
import type { BookLocation, Transform3 } from "@/game/run/types";
import { readSaveSlot, writeSaveSlot } from "@/game/save/storage";
import { getCarryCapacity } from "@/game/rules/progression";
import { secretDefinitions } from "@/game/content/secrets";

import {
  initialGameState,
  type BookMovementActions,
  type GameState,
} from "./game-state";

export interface GameActions extends BookMovementActions {
  startNewGame: (seed?: string) => void;
  returnToTitle: () => void;
  setCozyMode: (enabled: boolean) => void;
  saveToSlot: (slotId: string) => void;
  loadFromSlot: (slotId: string) => void;
}

export type GameStore = GameState & GameActions;

function createRunSeed(): string {
  return globalThis.crypto?.randomUUID?.() ?? `run-${Date.now()}`;
}

function assertBookExists(
  bookLocations: Record<string, BookLocation>,
  bookId: string,
): BookLocation {
  const location = bookLocations[bookId];

  if (!location) {
    throw new Error(`Unknown book id: ${bookId}`);
  }

  return location;
}

function withReindexedCarriedLocations(
  bookLocations: Record<string, BookLocation>,
  carriedBookIds: readonly string[],
): Record<string, BookLocation> {
  const nextBookLocations = { ...bookLocations };

  for (let index = 0; index < carriedBookIds.length; index += 1) {
    nextBookLocations[carriedBookIds[index]] = {
      kind: "carried",
      index,
    };
  }

  return nextBookLocations;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialGameState,

  startNewGame: (seed) => {
    const runSeed = seed ?? createRunSeed();
    const initialRun = generateInitialRun({
      seed: runSeed,
      books: bookInstances,
      spawnSlotIds: spawnSlots.map((spawnSlot) => spawnSlot.id),
    });

    set({
      ...initialGameState,
      phase: "sorting",
      runIdentity: initialRun.identity,
      bookLocations: Object.fromEntries(
        initialRun.books.map((bookState) => [
          bookState.bookId,
          bookState.location,
        ]),
      ),
    });
  },

  returnToTitle: () => set(initialGameState),

  setCozyMode: (enabled) => set({ cozyMode: enabled }),

  pickUpBook: (bookId) => {
    const state = get();
    assertBookExists(state.bookLocations, bookId);

    if (state.carriedBookIds.includes(bookId)) {
      return;
    }

    if (state.carriedBookIds.length >= getCarryCapacity(state)) {
      return;
    }

    const carriedBookIds = [...state.carriedBookIds, bookId];

    set({
      carriedBookIds,
      bookLocations: withReindexedCarriedLocations(
        state.bookLocations,
        carriedBookIds,
      ),
    });
  },

  reorderCarriedBook: (fromIndex, toIndex) => {
    const state = get();
    const carriedBookIds = [...state.carriedBookIds];

    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= carriedBookIds.length ||
      toIndex >= carriedBookIds.length ||
      fromIndex === toIndex
    ) {
      return;
    }

    const [bookId] = carriedBookIds.splice(fromIndex, 1);
    carriedBookIds.splice(toIndex, 0, bookId);

    set({
      carriedBookIds,
      bookLocations: withReindexedCarriedLocations(
        state.bookLocations,
        carriedBookIds,
      ),
    });
  },

  dropCarriedBook: (bookId, transform) => {
    const state = get();
    const carriedBookIds = state.carriedBookIds.filter(
      (carriedBookId) => carriedBookId !== bookId,
    );

    if (carriedBookIds.length === state.carriedBookIds.length) {
      return;
    }

    const bookLocations = withReindexedCarriedLocations(
      state.bookLocations,
      carriedBookIds,
    );

    bookLocations[bookId] = {
      kind: "dropped",
      transform,
    };

    set({ carriedBookIds, bookLocations });
  },

  dropAllCarriedBooks: (transforms) => {
    const state = get();

    if (transforms.length !== state.carriedBookIds.length) {
      throw new Error(
        `Expected ${state.carriedBookIds.length} drop transforms, got ${transforms.length}`,
      );
    }

    const bookLocations = { ...state.bookLocations };

    for (let index = 0; index < state.carriedBookIds.length; index += 1) {
      bookLocations[state.carriedBookIds[index]] = {
        kind: "dropped",
        transform: transforms[index],
      };
    }

    set({
      carriedBookIds: [],
      bookLocations,
    });
  },

  placeBookOnShelf: (bookId, rowId, index) => {
    const state = get();
    assertBookExists(state.bookLocations, bookId);

    const carriedBookIds = state.carriedBookIds.filter(
      (carriedBookId) => carriedBookId !== bookId,
    );
    const bookLocations = withReindexedCarriedLocations(
      state.bookLocations,
      carriedBookIds,
    );

    bookLocations[bookId] = {
      kind: "shelf",
      rowId,
      index,
    };

    set({ carriedBookIds, bookLocations });
  },

  collectSecretKey: (keyId) => {
    const state = get();

    if (state.collectedKeyIds.includes(keyId)) {
      return;
    }

    set({
      collectedKeyIds: [...state.collectedKeyIds, keyId],
    });
  },

  openSecretChest: (keyId) => {
    const state = get();

    if (!state.collectedKeyIds.includes(keyId)) {
      return;
    }

    const secret = secretDefinitions.find(
      (definition) => definition.keyId === keyId,
    );

    if (!secret || state.unlockedMinorMagicIds.includes(secret.rewardId)) {
      return;
    }

    set({
      unlockedMinorMagicIds: [
        ...state.unlockedMinorMagicIds,
        secret.rewardId,
      ],
    });
  },

  recallLooseBooks: () => {
    const state = get();
    const unshelvedBookIds = Object.entries(state.bookLocations)
      .filter(([, location]) => location.kind !== "shelf")
      .map(([bookId]) => bookId);

    if (unshelvedBookIds.length === 0 || unshelvedBookIds.length > 20) {
      return;
    }

    const carriedBookIds = new Set(state.carriedBookIds);
    const recalledBookIds = unshelvedBookIds.filter(
      (bookId) => !carriedBookIds.has(bookId),
    );
    const bookLocations = { ...state.bookLocations };

    for (let index = 0; index < recalledBookIds.length; index += 1) {
      const bookId = recalledBookIds[index];
      const column = index % 5;
      const row = Math.floor(index / 5);

      bookLocations[bookId] = {
        kind: "dropped",
        transform: {
          position: [
            -0.65 + column * 0.32,
            0.12,
            34.2 - row * 0.4,
          ],
          rotation: [0, (index % 2) * 0.18, 0],
        },
      };
    }

    set({ bookLocations });
  },

  saveToSlot: (slotId) => {
    const state = get();

    writeSaveSlot(slotId, {
      saveVersion: 1,
      savedAt: new Date().toISOString(),
      state: {
        phase: state.phase,
        runIdentity: state.runIdentity,
        bookLocations: state.bookLocations,
        carriedBookIds: state.carriedBookIds,
        collectedKeyIds: state.collectedKeyIds,
        unlockedMajorMagicIds: state.unlockedMajorMagicIds,
        unlockedMinorMagicIds: state.unlockedMinorMagicIds,
        elapsedMilliseconds: state.elapsedMilliseconds,
        majorMagicUsageCount: state.majorMagicUsageCount,
        cozyMode: state.cozyMode,
      },
    });
  },

  loadFromSlot: (slotId) => {
    const payload = readSaveSlot(slotId);

    if (!payload) {
      throw new Error(`Save slot not found: ${slotId}`);
    }

    if (
      payload.state.runIdentity &&
      (payload.state.runIdentity.catalogVersion !== CATALOG_VERSION ||
        payload.state.runIdentity.layoutVersion !== LAYOUT_VERSION)
    ) {
      throw new Error("Save is incompatible with the current catalog/layout version");
    }

    set(payload.state);
  },
}));
