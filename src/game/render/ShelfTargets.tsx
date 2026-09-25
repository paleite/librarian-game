"use client";

import { useMemo } from "react";

import { shelfRows } from "@/game/layout/shelf-rows";
import { shelfRowTransformById } from "@/game/layout/shelf-row-transforms";
import { useGameStore } from "@/game/state/game-store";

const rowById = new Map(shelfRows.map((row) => [row.id, row]));

export function ShelfTargets() {
  const bookLocations = useGameStore((state) => state.bookLocations);
  const carriedBookIds = useGameStore((state) => state.carriedBookIds);
  const placeBookOnShelf = useGameStore((state) => state.placeBookOnShelf);

  const occupiedIndexesByRow = useMemo(() => {
    const result = new Map<string, Set<number>>();

    for (const location of Object.values(bookLocations)) {
      if (location.kind !== "shelf") {
        continue;
      }

      const indexes = result.get(location.rowId) ?? new Set<number>();
      indexes.add(location.index);
      result.set(location.rowId, indexes);
    }

    return result;
  }, [bookLocations]);

  const topCarriedBookId = carriedBookIds.at(-1);

  return (
    <>
      {shelfRows.map((row) => {
        const rowTransform = shelfRowTransformById.get(row.id);

        if (!rowTransform) {
          return null;
        }

        const occupiedIndexes =
          occupiedIndexesByRow.get(row.id) ?? new Set<number>();

        return (
          <mesh
            key={row.id}
            position={rowTransform.transform.position}
            rotation={rowTransform.transform.rotation}
            onPointerDown={(event) => {
              if (!topCarriedBookId) {
                return;
              }

              event.stopPropagation();

              let targetIndex = -1;

              for (let index = 0; index < row.capacity; index += 1) {
                if (!occupiedIndexes.has(index)) {
                  targetIndex = index;
                  break;
                }
              }

              if (targetIndex === -1) {
                return;
              }

              placeBookOnShelf(topCarriedBookId, row.id, targetIndex);
            }}
          >
            <boxGeometry args={[Math.max(0.9, row.capacity * 0.24), 0.07, 0.38]} />
            <meshStandardMaterial
              color={topCarriedBookId ? "#7b5a32" : "#443426"}
              roughness={0.82}
            />
          </mesh>
        );
      })}
    </>
  );
}
