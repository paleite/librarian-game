"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { bookInstances } from "@/game/run/book-instances";
import { useGameStore } from "@/game/state/game-store";

import { BookLabelPlane } from "./BookLabelPlane";
import { getBookWorldTransform } from "./book-world";

const MAX_LABELS = 40;
const MAX_LABEL_DISTANCE_SQUARED = 5.5 * 5.5;
const bookById = new Map(bookInstances.map((book) => [book.id, book]));

export function BookLabels() {
  const camera = useThree((state) => state.camera);
  const bookLocations = useGameStore((state) => state.bookLocations);
  const [nearbyBookIds, setNearbyBookIds] = useState<string[]>([]);
  const lastUpdateAt = useRef(0);
  const previousKey = useRef("");

  useFrame(({ clock }) => {
    const now = clock.elapsedTime;

    if (now - lastUpdateAt.current < 0.22) {
      return;
    }

    lastUpdateAt.current = now;

    const cameraPosition = camera.position;
    const candidates: Array<{ bookId: string; distanceSquared: number }> = [];

    for (const [bookId, location] of Object.entries(bookLocations)) {
      const transform = getBookWorldTransform(location);

      if (!transform) {
        continue;
      }

      const dx = transform.position[0] - cameraPosition.x;
      const dy = transform.position[1] - cameraPosition.y;
      const dz = transform.position[2] - cameraPosition.z;
      const distanceSquared = dx * dx + dy * dy + dz * dz;

      if (distanceSquared <= MAX_LABEL_DISTANCE_SQUARED) {
        candidates.push({ bookId, distanceSquared });
      }
    }

    candidates.sort(
      (left, right) => left.distanceSquared - right.distanceSquared,
    );

    const nextIds = candidates
      .slice(0, MAX_LABELS)
      .map((candidate) => candidate.bookId);
    const nextKey = nextIds.join("|");

    if (nextKey === previousKey.current) {
      return;
    }

    previousKey.current = nextKey;
    setNearbyBookIds(nextIds);
  });

  const labels = useMemo(
    () =>
      nearbyBookIds.flatMap((bookId) => {
        const book = bookById.get(bookId);
        const location = bookLocations[bookId];

        if (!book || !location) {
          return [];
        }

        const transform = getBookWorldTransform(location);

        if (!transform) {
          return [];
        }

        return [{ book, transform }];
      }),
    [bookLocations, nearbyBookIds],
  );

  return (
    <>
      {labels.map(({ book, transform }) => (
        <group
          key={book.id}
          position={transform.position}
          rotation={transform.rotation}
        >
          <BookLabelPlane
            title={book.title}
            volumeNumber={book.volumeNumber}
            seriesId={book.seriesId}
          />
        </group>
      ))}
    </>
  );
}
