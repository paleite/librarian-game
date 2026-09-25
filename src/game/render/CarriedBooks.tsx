"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { getStableBookColor } from "@/game/render/book-visuals";
import { bookInstances } from "@/game/run/book-instances";
import { useGameStore } from "@/game/state/game-store";

import { BookLabelPlane } from "./BookLabelPlane";

const bookById = new Map(bookInstances.map((book) => [book.id, book]));
const targetPosition = new THREE.Vector3();
const targetQuaternion = new THREE.Quaternion();
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const up = new THREE.Vector3();

function CarriedBook({
  book,
  index,
}: {
  book: NonNullable<ReturnType<typeof bookById.get>>;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;

    if (!mesh) {
      return;
    }

    const targetY = index * 0.062;
    const settle = 1 - Math.exp(-delta * 16);
    const wobble =
      Math.sin(state.clock.elapsedTime * 2.1 + index * 0.72) * 0.004;

    mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, 0, settle);
    mesh.position.y = THREE.MathUtils.lerp(
      mesh.position.y,
      targetY + wobble,
      settle,
    );
    mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, 0, settle);
    mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, 0.08, settle);
    mesh.rotation.y = THREE.MathUtils.lerp(
      mesh.rotation.y,
      (index % 2 === 0 ? -1 : 1) * 0.012,
      settle,
    );
    mesh.rotation.z = THREE.MathUtils.lerp(
      mesh.rotation.z,
      Math.sin(index * 1.7) * 0.01,
      settle,
    );
  });

  return (
    <mesh
      ref={meshRef}
      position={[0.08, index * 0.062 - 0.08, 0.08]}
      rotation={[0.16, 0.05, 0.03]}
      scale={[0.24, 0.055, 0.34]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={getStableBookColor(book.seriesId, book.sectionCode)}
        roughness={0.75}
      />
      <BookLabelPlane
        title={book.title}
        volumeNumber={book.volumeNumber}
        seriesId={book.seriesId}
      />
    </mesh>
  );
}

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

  useFrame((state, delta) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    camera.getWorldDirection(forward);
    right.crossVectors(forward, camera.up).normalize();
    up.copy(camera.up).normalize();

    const walkBob =
      Math.sin(state.clock.elapsedTime * 7.5) *
      Math.min(0.012, carriedBooks.length * 0.0015);
    const sideSway =
      Math.sin(state.clock.elapsedTime * 3.1) *
      Math.min(0.01, carriedBooks.length * 0.0012);

    targetPosition
      .copy(camera.position)
      .add(forward.clone().multiplyScalar(0.8))
      .add(right.clone().multiplyScalar(0.32 + sideSway))
      .add(up.clone().multiplyScalar(-0.34 + walkBob));

    targetQuaternion.copy(camera.quaternion);

    const follow = 1 - Math.exp(-delta * 18);
    group.position.lerp(targetPosition, follow);
    group.quaternion.slerp(targetQuaternion, follow);
  });

  return (
    <group ref={groupRef}>
      {carriedBooks.map((book, index) => (
        <CarriedBook book={book} index={index} key={book.id} />
      ))}
    </group>
  );
}
