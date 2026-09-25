import { createSeededRandom } from "@/game/run/seeded-random";
import type { Transform3 } from "@/game/run/types";

export interface SpawnSlotDefinition {
  id: string;
  floor: 1 | 2;
  transform: Transform3;
}

const BOOKS_PER_FLOOR = 1536;
const GRID_COLUMNS = 48;
const GRID_ROWS = 32;
const HALL_WIDTH = 15.5;
const HALL_LENGTH = 15.5;

function createFloorSpawnSlots(
  floor: 1 | 2,
  floorY: number,
): SpawnSlotDefinition[] {
  const random = createSeededRandom(`layout-v1-floor-${floor}`);
  const slots: SpawnSlotDefinition[] = [];

  for (let index = 0; index < BOOKS_PER_FLOOR; index += 1) {
    const column = index % GRID_COLUMNS;
    const row = Math.floor(index / GRID_COLUMNS);
    const normalizedX = column / (GRID_COLUMNS - 1) - 0.5;
    const normalizedZ = row / (GRID_ROWS - 1) - 0.5;

    const x =
      normalizedX * HALL_WIDTH +
      (random() - 0.5) * (HALL_WIDTH / GRID_COLUMNS) * 0.8;
    const z =
      normalizedZ * HALL_LENGTH +
      (random() - 0.5) * (HALL_LENGTH / GRID_ROWS) * 0.8;
    const yaw = (random() - 0.5) * Math.PI * 2;
    const tiltX = (random() - 0.5) * 0.16;
    const tiltZ = (random() - 0.5) * 0.16;

    slots.push({
      id: `floor-${floor}-scatter-${String(index + 1).padStart(4, "0")}`,
      floor,
      transform: {
        position: [x, floorY + 0.08, z],
        rotation: [tiltX, yaw, tiltZ],
      },
    });
  }

  return slots;
}

/**
 * Stable semantic spawn slots for the current layout version.
 *
 * Their IDs are permanent for LAYOUT_VERSION=1. Exact transforms are tuning
 * data: changing them requires a layout-version bump, but does not affect book
 * identity, catalog data, save shape, or sorting rules.
 */
export const spawnSlots: readonly SpawnSlotDefinition[] = [
  ...createFloorSpawnSlots(1, 0),
  ...createFloorSpawnSlots(2, 4.6),
];

if (spawnSlots.length !== 3072) {
  throw new Error(`Expected 3072 spawn slots, got ${spawnSlots.length}`);
}

export const spawnSlotById = new Map(
  spawnSlots.map((spawnSlot) => [spawnSlot.id, spawnSlot]),
);
