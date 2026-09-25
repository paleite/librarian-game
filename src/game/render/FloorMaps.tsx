"use client";

import { useMemo } from "react";

import { getFloorMapTexture } from "./floor-map-texture";

function FloorMap({
  floor,
  position,
  rotation,
}: {
  floor: 1 | 2;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const texture = useMemo(() => getFloorMapTexture(floor), [floor]);

  return (
    <group position={position} rotation={rotation}>
      <mesh scale={[3.35, 2.55, 0.16]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#624227" roughness={0.72} />
      </mesh>

      <mesh
        position={[0, 0, 0.095]}
        scale={[3.08, 2.28, 1]}
        userData={{
          getInteractionInfo: () => ({
            title: `Floor ${floor} Categorization Map`,
            subtitle: "Shows where each library category belongs",
          }),
        }}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      <mesh position={[0, 1.2, 0.1]} scale={[3.25, 0.12, 0.12]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8a6237" roughness={0.68} />
      </mesh>

      <mesh position={[0, -1.2, 0.1]} scale={[3.25, 0.12, 0.12]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8a6237" roughness={0.68} />
      </mesh>
    </group>
  );
}

export function FloorMaps() {
  return (
    <>
      <FloorMap
        floor={1}
        position={[-3.15, 1.75, 35.2]}
        rotation={[0, 0.16, 0]}
      />
      <FloorMap
        floor={2}
        position={[3.15, 6.35, 27.2]}
        rotation={[0, Math.PI - 0.16, 0]}
      />
    </>
  );
}
