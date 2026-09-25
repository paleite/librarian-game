"use client";

import * as THREE from "three";

import { PROVISIONAL_DAY_TO_NIGHT_MILLISECONDS } from "@/game/content/lighting-tuning";
import { useGameStore } from "@/game/state/game-store";

const LAMP_POSITIONS = [
  [-6.5, 3.4, 27],
  [6.5, 3.4, 27],
  [-6.5, 3.4, 10],
  [6.5, 3.4, 10],
  [-6.5, 3.4, -8],
  [6.5, 3.4, -8],
  [-6.5, 3.4, -26],
  [6.5, 3.4, -26],
  [-6.5, 8, 21],
  [6.5, 8, 21],
  [-6.5, 8, 0],
  [6.5, 8, 0],
  [-6.5, 8, -22],
  [6.5, 8, -22],
] as const;

export function LibraryLighting() {
  const cozyMode = useGameStore((state) => state.cozyMode);
  const elapsedMilliseconds = useGameStore(
    (state) => state.elapsedMilliseconds,
  );

  const nightProgress = cozyMode
    ? 0
    : THREE.MathUtils.clamp(
        elapsedMilliseconds / PROVISIONAL_DAY_TO_NIGHT_MILLISECONDS,
        0,
        1,
      );

  const ambientIntensity = THREE.MathUtils.lerp(0.72, 0.2, nightProgress);
  const daylightIntensity = THREE.MathUtils.lerp(1.25, 0.18, nightProgress);
  const lampIntensity = THREE.MathUtils.lerp(0.05, 2.4, nightProgress);

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        castShadow
        intensity={daylightIntensity}
        position={[4, 9, 5]}
        color={nightProgress > 0.5 ? "#b7c5ff" : "#fff3d5"}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {LAMP_POSITIONS.map((position) => (
        <pointLight
          key={position.join(":")}
          color="#ffc878"
          decay={2}
          distance={11}
          intensity={lampIntensity}
          position={position}
        />
      ))}
    </>
  );
}
