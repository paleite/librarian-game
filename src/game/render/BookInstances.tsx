"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { playPickupCue } from "@/game/audio/sfx";
import { getBookWorldTransform } from "@/game/render/book-world";
import { getStableBookColor } from "@/game/render/book-visuals";
import { bookInstances } from "@/game/run/book-instances";
import { useGameStore } from "@/game/state/game-store";

const BOOK_SIZE: readonly [number, number, number] = [0.22, 0.055, 0.32];

const bookById = new Map(bookInstances.map((book) => [book.id, book]));

interface AnimatedBookTransform {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
}

export interface BookInstancesProps {
  onInspectBook: (bookId: string | null) => void;
}

export function BookInstances({ onInspectBook }: BookInstancesProps) {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const animatedTransformByBookId = useRef(
    new Map<string, AnimatedBookTransform>(),
  );
  const bookLocations = useGameStore((state) => state.bookLocations);
  const pickUpBook = useGameStore((state) => state.pickUpBook);
  const activeInsightSeriesId = useGameStore(
    (state) => state.activeInsightSeriesId,
  );

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
        const transform = getBookWorldTransform(location);

        if (!book || !transform) {
          return [];
        }

        return [{ book, transform, location }];
      }),
    [bookLocations],
  );

  useFrame((_, delta) => {
    const mesh = instancedMeshRef.current;

    if (!mesh) {
      return;
    }

    const matrix = new THREE.Matrix4();
    const targetQuaternion = new THREE.Quaternion();
    const targetEuler = new THREE.Euler();
    const targetPosition = new THREE.Vector3();
    const scale = new THREE.Vector3(...BOOK_SIZE);
    const color = new THREE.Color();
    const damping = 1 - Math.exp(-delta * 18);
    const visibleIds = new Set<string>();

    for (let index = 0; index < visibleBooks.length; index += 1) {
      const { book, transform, location } = visibleBooks[index];
      visibleIds.add(book.id);

      targetPosition.set(...transform.position);
      targetEuler.set(...transform.rotation);
      targetQuaternion.setFromEuler(targetEuler);

      let animated = animatedTransformByBookId.current.get(book.id);

      if (!animated) {
        animated = {
          position: targetPosition.clone(),
          quaternion: targetQuaternion.clone(),
        };
        animatedTransformByBookId.current.set(book.id, animated);
      } else {
        animated.position.lerp(targetPosition, damping);
        animated.quaternion.slerp(targetQuaternion, damping);
      }

      matrix.compose(animated.position, animated.quaternion, scale);
      mesh.setMatrixAt(index, matrix);

      const insightMatch =
        activeInsightSeriesId === book.seriesId &&
        (location.kind === "spawn" || location.kind === "dropped");

      mesh.setColorAt(
        index,
        color.set(
          insightMatch
            ? "#f6e76a"
            : getStableBookColor(book.seriesId, book.sectionCode),
        ),
      );
    }

    for (const bookId of animatedTransformByBookId.current.keys()) {
      if (!visibleIds.has(bookId)) {
        animatedTransformByBookId.current.delete(bookId);
      }
    }

    mesh.count = visibleBooks.length;
    mesh.instanceMatrix.needsUpdate = true;

    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  });

  const getTargetBookId = (event: ThreeEvent<PointerEvent>) => {
    if (event.instanceId === undefined) {
      return null;
    }

    return visibleBooks[event.instanceId]?.book.id ?? null;
  };

  const pickUp = (bookId: string) => {
    onInspectBook(null);
    pickUpBook(bookId);
    playPickupCue();
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

          if (target) {
            pickUp(target.book.id);
          }
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
        pickUp(bookId);
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.78} />
    </instancedMesh>
  );
}
