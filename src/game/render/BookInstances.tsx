"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { shelfRowTransformById } from "@/game/layout/shelf-row-transforms";
import { spawnSlotById } from "@/game/layout/spawn-slots";
import { bookInstances } from "@/game/run/book-instances";
import { useGameStore } from "@/game/state/game-store";

const BOOK_SIZE: readonly [number, number, number] = [0.22, 0.055, 0.32];

const SECTION_COLORS: Record<string, string> = {
  "1A": "#6f4b2f",
  "1B": "#405fa8",
  "1C": "#7a1f24",
  "1D": "#728548",
  "1E": "#4e326a",
  "1F": "#8b463e",
  "1G": "#8d76ad",
  "1H": "#2d2d32",
  "1I": "#70428d",
  "1J": "#3d7891",
  "1K": "#d9d2c8",
  "1L": "#e2d6a4",
  "1M": "#9a6137",
  "1N": "#6a5639",
  "2A": "#724238",
  "2B": "#64794b",
  "2C": "#b8a9bd",
  "2D": "#637086",
  "2E": "#87715e",
  "2F": "#334c5d",
  "2G": "#456b42",
  "2H": "#68443d",
  "2I": "#82453e",
  "2J": "#c6bdab",
  "2K": "#496d55",
  "2L": "#9b5d83",
  "2M": "#38383e",
  "2N": "#655547",
  "2O": "#715d45",
  "2P": "#6f4d83",
  "2Q": "#6b4543",
};

const bookById = new Map(bookInstances.map((book) => [book.id, book]));

export interface BookInstancesProps {
  onInspectBook: (bookId: string | null) => void;
}

export function BookInstances({ onInspectBook }: BookInstancesProps) {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const bookLocations = useGameStore((state) => state.bookLocations);
  const pickUpBook = useGameStore((state) => state.pickUpBook);

  const visibleBooks = useMemo(
    () =>
      Object.entries(bookLocations).flatMap(([bookId, location]) => {
        if (
          location.kind !== "spawn" &&
          location.kind !== "dropped" &&
          location.kind !== "shelf"
        ) {
          return [];
        }

        const book = bookById.get(bookId);

        if (!book) {
          return [];
        }

        let transform;

        if (location.kind === "spawn") {
          transform = spawnSlotById.get(location.slotId)?.transform;
        } else if (location.kind === "dropped") {
          transform = location.transform;
        } else {
          const row = shelfRowTransformById.get(location.rowId);

          if (!row) {
            return [];
          }

          const spacing = 0.23;
          const centeredIndex = location.index - (row.capacity - 1) / 2;
          const localX = centeredIndex * spacing;
          const yaw = row.transform.rotation[1];

          transform = {
            position: [
              row.transform.position[0] + localX * Math.cos(yaw),
              row.transform.position[1] + 0.09,
              row.transform.position[2] + localX * Math.sin(yaw),
            ] as const,
            rotation: [0, yaw, 0] as const,
          };
        }

        if (!transform) {
          return [];
        }

        return [{ book, transform }];
      }),
    [bookLocations],
  );

  useLayoutEffect(() => {
    const mesh = instancedMeshRef.current;

    if (!mesh) {
      return;
    }

    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler();
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3(...BOOK_SIZE);
    const color = new THREE.Color();

    for (let index = 0; index < visibleBooks.length; index += 1) {
      const { book, transform } = visibleBooks[index];

      position.set(...transform.position);
      euler.set(...transform.rotation);
      quaternion.setFromEuler(euler);
      matrix.compose(position, quaternion, scale);

      mesh.setMatrixAt(index, matrix);
      mesh.setColorAt(
        index,
        color.set(SECTION_COLORS[book.sectionCode] ?? "#7a6a58"),
      );
    }

    mesh.count = visibleBooks.length;
    mesh.instanceMatrix.needsUpdate = true;

    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }

    mesh.computeBoundingSphere();
  }, [visibleBooks]);

  const getTargetBookId = (event: ThreeEvent<PointerEvent>) => {
    if (event.instanceId === undefined) {
      return null;
    }

    return visibleBooks[event.instanceId]?.book.id ?? null;
  };

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[undefined, undefined, 3072]}
      castShadow
      receiveShadow
      onPointerMove={(event) => onInspectBook(getTargetBookId(event))}
      onPointerOut={() => onInspectBook(null)}
      onPointerDown={(event) => {
        const bookId = getTargetBookId(event);

        if (!bookId) {
          return;
        }

        event.stopPropagation();
        onInspectBook(null);
        pickUpBook(bookId);
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.78} />
    </instancedMesh>
  );
}
