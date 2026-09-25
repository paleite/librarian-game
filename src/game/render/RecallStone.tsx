"use client";

import { useMemo } from "react";

import { useGameStore } from "@/game/state/game-store";

export function RecallStone() {
  const bookLocations = useGameStore((state) => state.bookLocations);
  const recallLooseBooks = useGameStore((state) => state.recallLooseBooks);

  const unshelvedCount = useMemo(
    () =>
      Object.values(bookLocations).filter(
        (location) => location.kind !== "shelf",
      ).length,
    [bookLocations],
  );

  const enabled = unshelvedCount > 0 && unshelvedCount <= 20;

  return (
    <group position={[0, 0, 35.2]}>
      <mesh
        position={[0, 0.55, 0]}
        onPointerDown={(event) => {
          event.stopPropagation();

          if (enabled) {
            recallLooseBooks();
          }
        }}
      >
        <cylinderGeometry args={[0.34, 0.45, 1.1, 8]} />
        <meshStandardMaterial
          color={enabled ? "#7062a8" : "#40394c"}
          emissive={enabled ? "#5d50a0" : "#000000"}
          emissiveIntensity={enabled ? 0.35 : 0}
          roughness={0.6}
        />
      </mesh>

      <mesh position={[0, 1.22, 0]}>
        <octahedronGeometry args={[0.24, 0]} />
        <meshStandardMaterial
          color={enabled ? "#c7b9ff" : "#605970"}
          emissive={enabled ? "#927dff" : "#000000"}
          emissiveIntensity={enabled ? 0.75 : 0}
        />
      </mesh>
    </group>
  );
}
