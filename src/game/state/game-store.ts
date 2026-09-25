"use client";

import { create } from "zustand";

import { bookInstances } from "@/game/run/book-instances";
import { generateInitialRun, CATALOG_VERSION, LAYOUT_VERSION } from "@/game/run/generate-run";
import { spawnSlots } from "@/game/layout/spawn-slots";
import type { BookLocation } from "@/game/run/types";
import { readSaveSlot, writeSaveSlot } from "@/game/save/storage";
import { getAvailableKnownMajorMagicPoints, getCarryCapacity } from "@/game/rules/progression";
import { getCorrectRowCount } from "@/game/rules/shelf-state";
import { majorMagicDefinitionById, type MajorMagicId } from "@/game/content/abilities";
import { shelfRows } from "@/game/layout/shelf-rows";
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
  setAutosaveEnabled: (enabled: boolean) => void;
  upgradeMajorMagic: (id: MajorMagicId) => void;
  setTargetedShelfRow: (rowId: string | null) => void;
  useMajorMagic: (id: MajorMagicId) => void;
  saveToSlot: (slotId: string) => void;
  loadFromSlot: (slotId: string) => void;
}

export type GameStore = GameState & GameActions;

const bookById = new Map(bookInstances.map((book) => [book.id, book]));
const shelfRowById = new Map(shelfRows.map((row) => [row.id, row]));

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

  setAutosaveEnabled: (enabled) => set({ autosaveEnabled: enabled }),

  upgradeMajorMagic: (id) => {
    const state = get();
    const definition = majorMagicDefinitionById.get(id);

    if (!definition) {
      return;
    }

    const currentLevel = state.majorMagicLevels[id];

    if (currentLevel >= definition.maxLevel) {
      return;
    }

    const correctRows = getCorrectRowCount(state.bookLocations);
    const availablePoints = getAvailableKnownMajorMagicPoints(
      correctRows,
      state.majorMagicLevels,
    );

    if (availablePoints <= 0) {
      return;
    }

    set({
      majorMagicLevels: {
        ...state.majorMagicLevels,
        [id]: currentLevel + 1,
      },
    });
  },

  setTargetedShelfRow: (rowId) => set({ targetedShelfRowId: rowId }),

  useMajorMagic: (id) => {
    const state = get();
    const level = state.majorMagicLevels[id];

    if (level <= 0 || state.carriedBookIds.length === 0) {
      return;
    }

    const topBookId = state.carriedBookIds.at(-1);
    const topBook = topBookId ? bookById.get(topBookId) : undefined;

    if (!topBook) {
      return;
    }

    if (id === "sort") {
      const carriedBookIds = [...state.carriedBookIds].sort((leftId, rightId) => {
        const left = bookById.get(leftId);
        const right = bookById.get(rightId);

        if (!left || !right) {
          return leftId.localeCompare(rightId);
        }

        const seriesComparison = left.seriesId.localeCompare(right.seriesId);

        return seriesComparison !== 0
          ? seriesComparison
          : left.volumeNumber - right.volumeNumber;
      });

      set({
        carriedBookIds,
        bookLocations: withReindexedCarriedLocations(
          state.bookLocations,
          carriedBookIds,
        ),
        majorMagicUsageCount: state.majorMagicUsageCount + 1,
      });
      return;
    }

    if (id === "shelf-guide") {
      set({
        activeShelfGuideSectionCode: topBook.sectionCode,
        majorMagicUsageCount: state.majorMagicUsageCount + 1,
      });

      window.setTimeout(() => {
        if (get().activeShelfGuideSectionCode === topBook.sectionCode) {
          set({ activeShelfGuideSectionCode: null });
        }
      }, 15_000);
      return;
    }

    if (id === "insight") {
      set({
        activeInsightSeriesId: topBook.seriesId,
        majorMagicUsageCount: state.majorMagicUsageCount + 1,
      });

      window.setTimeout(() => {
        if (get().activeInsightSeriesId === topBook.seriesId) {
          set({ activeInsightSeriesId: null });
        }
      }, 7_000);
      return;
    }

    if (id === "assemble") {
      const capacity = getCarryCapacity(state);
      const availableSpace = capacity - state.carriedBookIds.length;

      if (availableSpace <= 0) {
        return;
      }

      const candidateIds = Object.entries(state.bookLocations)
        .flatMap(([bookId, location]) => {
          if (location.kind !== "spawn" && location.kind !== "dropped") {
            return [];
          }

          const book = bookById.get(bookId);

          return book?.seriesId === topBook.seriesId ? [bookId] : [];
        })
        .sort((leftId, rightId) => {
          const left = bookById.get(leftId);
          const right = bookById.get(rightId);

          return (left?.volumeNumber ?? 0) - (right?.volumeNumber ?? 0);
        })
        .slice(0, Math.min(level, availableSpace));

      if (candidateIds.length === 0) {
        return;
      }

      const carriedBookIds = [...state.carriedBookIds, ...candidateIds];

      set({
        carriedBookIds,
        bookLocations: withReindexedCarriedLocations(
          state.bookLocations,
          carriedBookIds,
        ),
        majorMagicUsageCount: state.majorMagicUsageCount + 1,
      });
      return;
    }

    if (id === "auto-shelving") {
      const targetedRow = state.targetedShelfRowId
        ? shelfRowById.get(state.targetedShelfRowId)
        : undefined;

      if (!targetedRow) {
        return;
      }

      const bookLocations = { ...state.bookLocations };
      const remainingCarriedBookIds = [...state.carriedBookIds];
      let placedCount = 0;

      const getRowBooks = (rowId: string) =>
        Object.entries(bookLocations).flatMap(([bookId, location]) =>
          location.kind === "shelf" && location.rowId === rowId
            ? [bookId]
            : [],
        );

      for (const bookId of [...state.carriedBookIds]) {
        const book = bookById.get(bookId);

        if (!book || book.sectionCode !== targetedRow.sectionCode) {
          continue;
        }

        const compatibleRows = shelfRows.filter(
          (row) =>
            row.sectionCode === book.sectionCode &&
            row.capacity === book.volumeCount,
        );

        const existingSeriesRow = compatibleRows.find((row) =>
          getRowBooks(row.id).some(
            (shelvedBookId) =>
              bookById.get(shelvedBookId)?.seriesId === book.seriesId,
          ),
        );

        const emptyRow = compatibleRows.find(
          (row) => getRowBooks(row.id).length === 0,
        );

        const targetRow = existingSeriesRow ?? emptyRow;

        if (!targetRow) {
          continue;
        }

        const targetIndex = book.volumeNumber - 1;
        const targetOccupied = Object.entries(bookLocations).some(
          ([, location]) =>
            location.kind === "shelf" &&
            location.rowId === targetRow.id &&
            location.index === targetIndex,
        );

        if (targetOccupied) {
          continue;
        }

        bookLocations[bookId] = {
          kind: "shelf",
          rowId: targetRow.id,
          index: targetIndex,
        };

        const carriedIndex = remainingCarriedBookIds.indexOf(bookId);

        if (carriedIndex >= 0) {
          remainingCarriedBookIds.splice(carriedIndex, 1);
        }

        placedCount += 1;
      }

      if (placedCount === 0) {
        return;
      }

      set({
        carriedBookIds: remainingCarriedBookIds,
        bookLocations: withReindexedCarriedLocations(
          bookLocations,
          remainingCarriedBookIds,
        ),
        majorMagicUsageCount: state.majorMagicUsageCount + 1,
      });
    }
  },

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
      saveVersion: 3,
      savedAt: new Date().toISOString(),
      state: {
        phase: state.phase,
        runIdentity: state.runIdentity,
        bookLocations: state.bookLocations,
        carriedBookIds: state.carriedBookIds,
        collectedKeyIds: state.collectedKeyIds,
        majorMagicLevels: state.majorMagicLevels,
        unlockedMinorMagicIds: state.unlockedMinorMagicIds,
        elapsedMilliseconds: state.elapsedMilliseconds,
        majorMagicUsageCount: state.majorMagicUsageCount,
        cozyMode: state.cozyMode,
        autosaveEnabled: state.autosaveEnabled,
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

    set({ ...initialGameState, ...payload.state });
  },
}));
