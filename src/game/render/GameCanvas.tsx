"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";

import { LibraryScene } from "./LibraryScene";
import { PlayerController } from "./PlayerController";

export function GameCanvas() {
  return (
    <Canvas
      camera={{ fov: 70, near: 0.05, far: 120, position: [0, 1.65, 7] }}
      dpr={[1, 1.5]}
      shadows
    >
      <color attach="background" args={["#100c09"]} />
      <fog attach="fog" args={["#100c09", 14, 38]} />
      <ambientLight intensity={0.65} />
      <directionalLight
        castShadow
        intensity={1.2}
        position={[4, 9, 5]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <Physics gravity={[0, -20, 0]}>
        <LibraryScene />
        <PlayerController />
      </Physics>
    </Canvas>
  );
}
