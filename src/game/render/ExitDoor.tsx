"use client";

import { useMemo } from "react";

import { useGameStore } from "@/game/state/game-store";

export function ExitDoor() {
  const bookLocations = useGameStore((state) => state.bookLocations);
  const phase = useGameStore((state) => state.phase);
  const completeRun = useGameStore((state) => state.completeRun);

  const allBooksShelved = useMemo(
    () =>
      Object.values(bookLocations).length === 3072 &&
      Object.values(bookLocations).every(
        (location) => location.kind === "shelf",
      ),
    [bookLocations],
  );

  const canSubmit =
    allBooksShelved &&
    (phase === "sorting" || phase === "special-stage");

  return (
    <mesh
      position={[0, 2.15, 41.65]}
      scale={[3.2, 4.3, 0.28]}
      userData={{
        mobileInteract: () => {
          if (canSubmit) {
            completeRun();
          }
        },
      }}
      onPointerDown={(event) => {
        event.stopPropagation();

        if (canSubmit) {
          completeRun();
        }
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={canSubmit ? "#765f3b" : "#342b20"}
        emissive={canSubmit ? "#9a7635" : "#000000"}
        emissiveIntensity={canSubmit ? 0.18 : 0}
        roughness={0.74}
      />
    </mesh>
  );
}
