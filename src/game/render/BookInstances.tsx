"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { playPickupCue } from "@/game/audio/sfx";
import { bookInstances } from "@/game/run/book-instances";
import { getStableBookColor } from "@/game/render/book-visuals";
import { getBookWorldTransform } from "@/game/render/book-world";
import { useGameStore } from "@/game/state/game-store";

const BOOK_SIZE: readonly [number, number, number] = [0.22, 0.055, 0.32];

const bookById = new Map(bookInstances.map((book) => [book.id, book]));

export interface BookInstancesProps {
  onInspectBook: (bookId: string | null) => void;
}

export function BookInstances({ onInspectBook }: BookInstancesProps) {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const bookLocations = useGameStore((state) => state.bookLocations);
  const pickUpBook = useGameStore((state) => state.pickUpBook);
  const activeInsightSeriesId = useGameStore((state) => state.activeInsightSeriesId);

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

        const transform = getBookWorldTransform(location);

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
      const location = bookLocations[book.id];
      const insightMatch =
        activeInsightSeriesId === book.seriesId &&
        (location?.kind === "spawn" || location?.kind === "dropped");

      mesh.setColorAt(
        index,
        color.set(
          insightMatch
            ? "#f6e76a"
            : getStableBookColor(book.seriesId, book.sectionCode),
        ),
      );
    }

    mesh.count = visibleBooks.length;
    mesh.instanceMatrix.needsUpdate = true;

    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }

    mesh.computeBoundingSphere();
  }, [activeInsightSeriesId, bookLocations, visibleBooks]);

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
      userData={{
        mobileInteract: (intersection: THREE.Intersection) => {
          const instanceId = intersection.instanceId;

          if (instanceId === undefined) {
            return;
          }

          const target = visibleBooks[instanceId];

          if (!target) {
            return;
          }

          onInspectBook(null);
          pickUpBook(target.book.id);
          playPickupCue();
        },
      }}
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
        playPickupCue();
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.78} />
    </instancedMesh>
  );
}
