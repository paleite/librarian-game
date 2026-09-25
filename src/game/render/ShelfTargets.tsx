"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { useMemo, useState } from "react";
import * as THREE from "three";

import { shelfRowTransformById } from "@/game/layout/shelf-row-transforms";
import { shelfRows } from "@/game/layout/shelf-rows";
import {
  getPlacementFeedback,
  type PlacementFeedback,
} from "@/game/rules/placement-feedback";
import { useGameStore } from "@/game/state/game-store";

interface HoveredSlot {
  rowId: string;
  index: number;
}

interface TransientFeedback extends HoveredSlot {
  feedback: Exclude<PlacementFeedback, "wrong-section">;
}

export interface ShelfTargetsProps {
  onPlacementFeedback: (feedback: PlacementFeedback) => void;
}

function getNearestFreeIndex(
  desiredIndex: number,
  capacity: number,
  occupiedIndexes: ReadonlySet<number>,
): number | null {
  if (!occupiedIndexes.has(desiredIndex)) {
    return desiredIndex;
  }

  for (let distance = 1; distance < capacity; distance += 1) {
    const left = desiredIndex - distance;
    const right = desiredIndex + distance;

    if (left >= 0 && !occupiedIndexes.has(left)) {
      return left;
    }

    if (right < capacity && !occupiedIndexes.has(right)) {
      return right;
    }
  }

  return null;
}

function resolveSlotIndexFromPoint(
  object: THREE.Object3D,
  point: THREE.Vector3,
  capacity: number,
  occupiedIndexes: ReadonlySet<number>,
): number | null {
  const width = Math.max(0.9, capacity * 0.24);
  const localPoint = object.worldToLocal(point.clone());
  const normalized = THREE.MathUtils.clamp(
    localPoint.x / width + 0.5,
    0,
    0.9999,
  );
  const desiredIndex = Math.floor(normalized * capacity);

  return getNearestFreeIndex(desiredIndex, capacity, occupiedIndexes);
}

export function ShelfTargets({
  onPlacementFeedback,
}: ShelfTargetsProps) {
  const [hoveredSlot, setHoveredSlot] = useState<HoveredSlot | null>(null);
  const [transientFeedback, setTransientFeedback] =
    useState<TransientFeedback | null>(null);

  const bookLocations = useGameStore((state) => state.bookLocations);
  const carriedBookIds = useGameStore((state) => state.carriedBookIds);
  const placeBookOnShelf = useGameStore((state) => state.placeBookOnShelf);
  const setTargetedShelfRow = useGameStore((state) => state.setTargetedShelfRow);

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

  const placeAtPoint = (
    object: THREE.Object3D,
    point: THREE.Vector3,
    rowId: string,
    capacity: number,
    occupiedIndexes: ReadonlySet<number>,
  ) => {
    if (!topCarriedBookId) {
      return;
    }

    const targetIndex = resolveSlotIndexFromPoint(
      object,
      point,
      capacity,
      occupiedIndexes,
    );

    if (targetIndex === null) {
      return;
    }

    const feedback = getPlacementFeedback({
      bookId: topCarriedBookId,
      rowId,
      index: targetIndex,
      bookLocations,
    });

    placeBookOnShelf(topCarriedBookId, rowId, targetIndex);
    onPlacementFeedback(feedback);

    if (feedback === "wrong-section") {
      setTransientFeedback(null);
    } else {
      setTransientFeedback({
        rowId,
        index: targetIndex,
        feedback,
      });
      window.setTimeout(() => setTransientFeedback(null), 650);
    }

    setHoveredSlot(null);
  };

  return (
    <>
      {shelfRows.map((row) => {
        const rowTransform = shelfRowTransformById.get(row.id);

        if (!rowTransform) {
          return null;
        }

        const occupiedIndexes =
          occupiedIndexesByRow.get(row.id) ?? new Set<number>();
        const width = Math.max(0.9, row.capacity * 0.24);

        return (
          <mesh
            key={row.id}
            position={rowTransform.transform.position}
            rotation={rowTransform.transform.rotation}
            userData={{
              targetShelfRowId: row.id,
              mobileInteract: (intersection: THREE.Intersection) => {
                setTargetedShelfRow(row.id);
                placeAtPoint(
                  intersection.object,
                  intersection.point,
                  row.id,
                  row.capacity,
                  occupiedIndexes,
                );
              },
            }}
            onPointerMove={(event: ThreeEvent<PointerEvent>) => {
              if (!topCarriedBookId) {
                setHoveredSlot(null);
                return;
              }

              const index = resolveSlotIndexFromPoint(
                event.object,
                event.point,
                row.capacity,
                occupiedIndexes,
              );

              setHoveredSlot(index === null ? null : { rowId: row.id, index });
              setTargetedShelfRow(row.id);
            }}
            onPointerOut={() => {
              setHoveredSlot(null);
              setTargetedShelfRow(null);
            }}
            onPointerDown={(event: ThreeEvent<PointerEvent>) => {
              if (!topCarriedBookId) {
                return;
              }

              event.stopPropagation();
              placeAtPoint(
                event.object,
                event.point,
                row.id,
                row.capacity,
                occupiedIndexes,
              );
            }}
          >
            <boxGeometry args={[width, 0.07, 0.38]} />
            <meshStandardMaterial color="#443426" roughness={0.82} />
          </mesh>
        );
      })}

      {hoveredSlot && topCarriedBookId ? (
        <SlotCue
          color="#45c879"
          opacity={0.52}
          rowId={hoveredSlot.rowId}
          index={hoveredSlot.index}
        />
      ) : null}

      {transientFeedback ? (
        <SlotCue
          color={
            transientFeedback.feedback === "exact" ? "#f4c851" : "#d7d9de"
          }
          opacity={0.8}
          rowId={transientFeedback.rowId}
          index={transientFeedback.index}
        />
      ) : null}
    </>
  );
}

function SlotCue({
  color,
  opacity,
  rowId,
  index,
}: {
  color: string;
  opacity: number;
  rowId: string;
  index: number;
}) {
  const row = shelfRowTransformById.get(rowId);

  if (!row) {
    return null;
  }

  const spacing = 0.23;
  const localX = (index - (row.capacity - 1) / 2) * spacing;
  const yaw = row.transform.rotation[1];

  return (
    <mesh
      position={[
        row.transform.position[0] + localX * Math.cos(yaw),
        row.transform.position[1] + 0.12,
        row.transform.position[2] + localX * Math.sin(yaw),
      ]}
      rotation={[0, yaw, 0]}
      scale={[0.24, 0.07, 0.34]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.45}
        opacity={opacity}
        transparent
      />
    </mesh>
  );
}
