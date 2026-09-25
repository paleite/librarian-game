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
import { getMajorMagicActiveMilliseconds, getMajorMagicCooldownMilliseconds } from "@/game/content/major-magic-tuning";
import { shelfRows } from "@/game/layout/shelf-rows";
import { secretDefinitions } from "@/game/content/secrets";
import { fixedTutorialBookPlacements } from "@/game/content/tutorial-series";

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

function withMajorMagicReadyAt(
  state: GameState,
  id: MajorMagicId,
  readyAt: number,
) {
  return {
    ...state.majorMagicReadyAt,
    [id]: readyAt,
  };
}

function autoShelveAtTarget(
  state: Pick<GameState, "bookLocations" | "carriedBookIds">,
  rowId: string,
): {
  bookLocations: Record<string, BookLocation>;
  carriedBookIds: string[];
  placedCount: number;
} {
  const targetedRow = shelfRowById.get(rowId);

  if (!targetedRow) {
    return {
      bookLocations: { ...state.bookLocations },
      carriedBookIds: [...state.carriedBookIds],
      placedCount: 0,
    };
  }

  const bookLocations = { ...state.bookLocations };
  const carriedBookIds = [...state.carriedBookIds];
  let placedCount = 0;

  const getRowBooks = (candidateRowId: string) =>
    Object.entries(bookLocations).flatMap(([bookId, location]) =>
      location.kind === "shelf" && location.rowId === candidateRowId
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

    const carriedIndex = carriedBookIds.indexOf(bookId);

    if (carriedIndex >= 0) {
      carriedBookIds.splice(carriedIndex, 1);
    }

    placedCount += 1;
  }

  return {
    carriedBookIds,
    bookLocations: withReindexedCarriedLocations(
      bookLocations,
      carriedBookIds,
    ),
    placedCount,
  };
}

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
      fixedPlacements: fixedTutorialBookPlacements,
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

  setTargetedShelfRow: (rowId) => {
    const state = get();

    if (
      rowId &&
      Date.now() < state.autoShelvingActiveUntil &&
      state.carriedBookIds.length > 0
    ) {
      const autoShelved = autoShelveAtTarget(state, rowId);

      set({
        targetedShelfRowId: rowId,
        carriedBookIds: autoShelved.carriedBookIds,
        bookLocations: autoShelved.bookLocations,
      });
      return;
    }

    set({ targetedShelfRowId: rowId });
  },

  useMajorMagic: (id) => {
    const state = get();
    const level = state.majorMagicLevels[id];
    const now = Date.now();

    if (
      level <= 0 ||
      state.carriedBookIds.length === 0 ||
      state.majorMagicReadyAt[id] > now
    ) {
      return;
    }

    const topBookId = state.carriedBookIds.at(-1);
    const topBook = topBookId ? bookById.get(topBookId) : undefined;

    if (!topBook) {
      return;
    }

    const cooldownMilliseconds = getMajorMagicCooldownMilliseconds(id, level);
    const activeMilliseconds = getMajorMagicActiveMilliseconds(id, level);

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
        majorMagicReadyAt: withMajorMagicReadyAt(
          state,
          id,
          now + cooldownMilliseconds,
        ),
      });
      return;
    }

    if (id === "shelf-guide") {
      set({
        activeShelfGuideSectionCode: topBook.sectionCode,
        majorMagicUsageCount: state.majorMagicUsageCount + 1,
        majorMagicReadyAt: withMajorMagicReadyAt(
          state,
          id,
          now + activeMilliseconds + cooldownMilliseconds,
        ),
      });

      window.setTimeout(() => {
        if (get().activeShelfGuideSectionCode === topBook.sectionCode) {
          set({ activeShelfGuideSectionCode: null });
        }
      }, activeMilliseconds);
      return;
    }

    if (id === "insight") {
      set({
        activeInsightSeriesId: topBook.seriesId,
        majorMagicUsageCount: state.majorMagicUsageCount + 1,
        majorMagicReadyAt: withMajorMagicReadyAt(
          state,
          id,
          now + activeMilliseconds + cooldownMilliseconds,
        ),
      });

      window.setTimeout(() => {
        if (get().activeInsightSeriesId === topBook.seriesId) {
          set({ activeInsightSeriesId: null });
        }
      }, activeMilliseconds);
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

      let carriedBookIds = [...state.carriedBookIds, ...candidateIds];
      let bookLocations = withReindexedCarriedLocations(
        state.bookLocations,
        carriedBookIds,
      );

      if (
        state.targetedShelfRowId &&
        now < state.autoShelvingActiveUntil
      ) {
        const autoShelved = autoShelveAtTarget(
          { bookLocations, carriedBookIds },
          state.targetedShelfRowId,
        );
        carriedBookIds = autoShelved.carriedBookIds;
        bookLocations = autoShelved.bookLocations;
      }

      set({
        carriedBookIds,
        bookLocations,
        majorMagicUsageCount: state.majorMagicUsageCount + 1,
        majorMagicReadyAt: withMajorMagicReadyAt(
          state,
          id,
          now + cooldownMilliseconds,
        ),
      });
      return;
    }

    if (id === "auto-shelving") {
      const activeUntil = now + activeMilliseconds;
      const autoShelved = state.targetedShelfRowId
        ? autoShelveAtTarget(state, state.targetedShelfRowId)
        : {
            bookLocations: state.bookLocations,
            carriedBookIds: state.carriedBookIds,
            placedCount: 0,
          };

      set({
        carriedBookIds: autoShelved.carriedBookIds,
        bookLocations: autoShelved.bookLocations,
        autoShelvingActiveUntil: activeUntil,
        majorMagicUsageCount: state.majorMagicUsageCount + 1,
        majorMagicReadyAt: withMajorMagicReadyAt(
          state,
          id,
          activeUntil + cooldownMilliseconds,
        ),
      });
    }
  },

  saveToSlot: (slotId) => {
    const state = get();

    writeSaveSlot(slotId, {
      saveVersion: 4,
      savedAt: new Date().toISOString(),
      state: {
        phase: state.phase,
        runIdentity: state.runIdentity,
        bookLocations: state.bookLocations,
        carriedBookIds: state.carriedBookIds,
        collectedKeyIds: state.collectedKeyIds,
        majorMagicLevels: state.majorMagicLevels,
        majorMagicReadyAt: state.majorMagicReadyAt,
        autoShelvingActiveUntil: state.autoShelvingActiveUntil,
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
