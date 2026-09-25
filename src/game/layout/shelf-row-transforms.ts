import { shelfRows } from "./shelf-rows";
import { libraryTopology } from "./library-layout";
import type { Transform3 } from "@/game/run/types";

export interface ShelfRowTransformDefinition {
  rowId: string;
  transform: Transform3;
  capacity: 3 | 5 | 10;
}

const SECTION_SPACING = 6.2;
const FIRST_SECTION_Z = 31;
const FLOOR_Y: Record<1 | 2, number> = {
  1: 0.75,
  2: 5.35,
};

function getSectionBaseTransform(
  sectionCode: string,
): { position: [number, number, number]; yaw: number } {
  const placement = libraryTopology.sections.find(
    (candidate) => candidate.sectionCode === sectionCode,
  );

  if (!placement) {
    throw new Error(`Missing topology placement for ${sectionCode}`);
  }

  const y = FLOOR_Y[placement.floor];

  if (placement.zone === "left") {
    return {
      position: [-8.1, y, FIRST_SECTION_Z - placement.routeOrder * SECTION_SPACING],
      yaw: Math.PI / 2,
    };
  }

  if (placement.zone === "right") {
    return {
      position: [8.1, y, FIRST_SECTION_Z - placement.routeOrder * SECTION_SPACING],
      yaw: -Math.PI / 2,
    };
  }

  const backIndex = placement.floor === 1
    ? placement.routeOrder - 12
    : placement.routeOrder - 12;
  const backCount = placement.floor === 1 ? 2 : 5;
  const x = (backIndex - (backCount - 1) / 2) * 3.2;

  return {
    position: [x, y, -39.5],
    yaw: 0,
  };
}

const rowsBySection = new Map<string, typeof shelfRows>();

for (const row of shelfRows) {
  const current = rowsBySection.get(row.sectionCode) ?? [];
  rowsBySection.set(row.sectionCode, [...current, row]);
}

export const shelfRowTransforms: readonly ShelfRowTransformDefinition[] =
  Array.from(rowsBySection).flatMap(([sectionCode, rows]) => {
    const base = getSectionBaseTransform(sectionCode);
    const columns = rows.length > 12 ? 2 : 1;
    const rowsPerColumn = Math.ceil(rows.length / columns);

    return rows.map((row, index) => {
      const column = Math.floor(index / rowsPerColumn);
      const verticalIndex = index % rowsPerColumn;
      const horizontalOffset =
        columns === 1 ? 0 : column === 0 ? -1.55 : 1.55;
      const verticalOffset = verticalIndex * 0.34;

      const localX = horizontalOffset;
      const localZ = 0;

      const worldX =
        base.position[0] +
        localX * Math.cos(base.yaw) -
        localZ * Math.sin(base.yaw);
      const worldZ =
        base.position[2] +
        localX * Math.sin(base.yaw) +
        localZ * Math.cos(base.yaw);

      return {
        rowId: row.id,
        capacity: row.capacity,
        transform: {
          position: [worldX, base.position[1] + verticalOffset, worldZ],
          rotation: [0, base.yaw, 0],
        },
      };
    });
  });

export const shelfRowTransformById = new Map(
  shelfRowTransforms.map((row) => [row.rowId, row]),
);
