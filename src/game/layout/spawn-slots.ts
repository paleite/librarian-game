import { tutorialSpawnSlotIds } from "@/game/content/tutorial-series";
import { createSeededRandom } from "@/game/run/seeded-random";
import type { Transform3 } from "@/game/run/types";

export interface SpawnSlotDefinition {
  id: string;
  floor: 1 | 2;
  transform: Transform3;
}

const TOTAL_BOOKS = 3072;
const TUTORIAL_BOOKS = 10;
const RANDOMIZED_BOOKS = TOTAL_BOOKS - TUTORIAL_BOOKS;
const FIRST_FLOOR_RANDOMIZED_BOOKS = 1531;
const SECOND_FLOOR_RANDOMIZED_BOOKS =
  RANDOMIZED_BOOKS - FIRST_FLOOR_RANDOMIZED_BOOKS;
const GRID_COLUMNS = 48;
const HALL_WIDTH = 15.5;
const HALL_LENGTH = 73;
const HALL_Z_CENTER = -2.5;

const tutorialSpawnSlots: readonly SpawnSlotDefinition[] =
  tutorialSpawnSlotIds.map((id, index) => ({
    id,
    floor: 1,
    transform: {
      position: [
        0.95 + (index % 5) * 0.18,
        0.12 + Math.floor(index / 5) * 0.065,
        31.2 + Math.floor(index / 5) * 0.14,
      ],
      rotation: [0.02, -0.16 + (index % 5) * 0.04, 0],
    },
  }));

function createFirstFloorSpawnSlots(
  count: number,
): SpawnSlotDefinition[] {
  const random = createSeededRandom("layout-v4-floor-1");
  const rows = Math.ceil(count / GRID_COLUMNS);
  const slots: SpawnSlotDefinition[] = [];

  for (let index = 0; index < count; index += 1) {
    const column = index % GRID_COLUMNS;
    const row = Math.floor(index / GRID_COLUMNS);
    const normalizedX = column / (GRID_COLUMNS - 1) - 0.5;
    const normalizedZ = rows <= 1 ? 0 : row / (rows - 1) - 0.5;

    const x =
      normalizedX * HALL_WIDTH +
      (random() - 0.5) * (HALL_WIDTH / GRID_COLUMNS) * 0.95;
    const z =
      HALL_Z_CENTER +
      normalizedZ * HALL_LENGTH +
      (random() - 0.5) * (HALL_LENGTH / rows) * 0.85;
    const yaw = (random() - 0.5) * Math.PI * 2;

    slots.push({
      id: `floor-1-scatter-${String(index + 1).padStart(4, "0")}`,
      floor: 1,
      transform: {
        position: [x, 0.08, z],
        rotation: [
          (random() - 0.5) * 0.16,
          yaw,
          (random() - 0.5) * 0.16,
        ],
      },
    });
  }

  return slots;
}

function createSecondFloorSpawnSlots(
  count: number,
): SpawnSlotDefinition[] {
  const random = createSeededRandom("layout-v4-floor-2");
  const slots: SpawnSlotDefinition[] = [];

  for (let index = 0; index < count; index += 1) {
    const selector = index % 100;
    let x: number;
    let z: number;

    if (selector < 42) {
      x = -6.9 + (random() - 0.5) * 3.2;
      z = -4 + (random() - 0.5) * 60;
    } else if (selector < 84) {
      x = 6.9 + (random() - 0.5) * 3.2;
      z = -4 + (random() - 0.5) * 60;
    } else if (selector < 94) {
      x = (random() - 0.5) * 15.6;
      z = -38 + (random() - 0.5) * 5.6;
    } else {
      x = (random() - 0.5) * 15.6;
      z = 28 + (random() - 0.5) * 5.6;
    }

    slots.push({
      id: `floor-2-scatter-${String(index + 1).padStart(4, "0")}`,
      floor: 2,
      transform: {
        position: [x, 4.68, z],
        rotation: [
          (random() - 0.5) * 0.16,
          (random() - 0.5) * Math.PI * 2,
          (random() - 0.5) * 0.16,
        ],
      },
    });
  }

  return slots;
}

/**
 * Physical spawn positions stay fixed between runs. The book identities assigned
 * to ordinary slots are shuffled; the ten-book white-cat tutorial series stays
 * together near the starting area.
 */
export const spawnSlots: readonly SpawnSlotDefinition[] = [
  ...tutorialSpawnSlots,
  ...createFirstFloorSpawnSlots(FIRST_FLOOR_RANDOMIZED_BOOKS),
  ...createSecondFloorSpawnSlots(SECOND_FLOOR_RANDOMIZED_BOOKS),
];

if (spawnSlots.length !== TOTAL_BOOKS) {
  throw new Error(
    `Expected ${TOTAL_BOOKS} spawn slots, got ${spawnSlots.length}`,
  );
}

export const spawnSlotById = new Map(
  spawnSlots.map((spawnSlot) => [spawnSlot.id, spawnSlot]),
);
