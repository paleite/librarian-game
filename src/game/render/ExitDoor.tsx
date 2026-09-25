"use client";

import { useMemo } from "react";

import { useGameStore } from "@/game/state/game-store";

export function ExitDoor() {
  const bookLocations = useGameStore((state) => state.bookLocations);
  const completeRun = useGameStore((state) => state.completeRun);

  const allBooksShelved = useMemo(
    () =>
      Object.values(bookLocations).length === 3072 &&
      Object.values(bookLocations).every(
        (location) => location.kind === "shelf",
      ),
    [bookLocations],
  );

  return (
    <mesh
      position={[0, 2.15, 41.65]}
      scale={[3.2, 4.3, 0.28]}
      onPointerDown={(event) => {
        event.stopPropagation();

        if (allBooksShelved) {
          completeRun();
        }
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={allBooksShelved ? "#765f3b" : "#342b20"}
        emissive={allBooksShelved ? "#9a7635" : "#000000"}
        emissiveIntensity={allBooksShelved ? 0.18 : 0}
        roughness={0.74}
      />
    </mesh>
  );
}
