"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { bookInstances } from "@/game/run/book-instances";
import { useGameStore } from "@/game/state/game-store";

const bookById = new Map(bookInstances.map((book) => [book.id, book]));

export function CarriedBooks() {
  const groupRef = useRef<THREE.Group>(null);
  const camera = useThree((state) => state.camera);
  const carriedBookIds = useGameStore((state) => state.carriedBookIds);

  const carriedBooks = useMemo(
    () =>
      carriedBookIds
        .map((bookId) => bookById.get(bookId))
        .filter((book) => book !== undefined),
    [carriedBookIds],
  );

  useFrame(() => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);

    group.position
      .copy(camera.position)
      .add(forward.multiplyScalar(0.8))
      .add(new THREE.Vector3(0.32, -0.34, 0));
    group.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={groupRef}>
      {carriedBooks.map((book, index) => (
        <mesh
          key={book.id}
          position={[0, index * 0.06, 0]}
          rotation={[0.08, 0, 0]}
          scale={[0.24, 0.055, 0.34]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8c7055" roughness={0.75} />
        </mesh>
      ))}
    </group>
  );
}
