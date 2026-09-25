"use client";

import { Html } from "@react-three/drei";

import { sections } from "@/game/catalog/sections";

function FloorMap({
  floor,
  position,
  rotation,
}: {
  floor: 1 | 2;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const floorSections = sections.filter((section) => section.floor === floor);

  return (
    <group position={position} rotation={rotation}>
      <mesh scale={[2.8, 2.05, 0.12]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#765434" roughness={0.75} />
      </mesh>

      <Html
        center
        distanceFactor={5.8}
        position={[0, 0, 0.08]}
        transform
        zIndexRange={[12, 0]}
      >
        <div className="pointer-events-none w-60 rounded border border-amber-950/40 bg-[#e7d7ae] p-3 text-[#2b1a0e] shadow-xl">
          <div className="text-center text-[12px] font-black uppercase tracking-[0.16em]">
            Floor {floor} Directory
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[8px] leading-tight">
            {floorSections.map((section) => (
              <div className="flex gap-1" key={section.code}>
                <strong>{section.code}</strong>
                <span>{section.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Html>
    </group>
  );
}

export function FloorMaps() {
  return (
    <>
      <FloorMap
        floor={1}
        position={[-2.85, 1.55, 35.6]}
        rotation={[0, 0.16, 0]}
      />
      <FloorMap
        floor={2}
        position={[2.85, 6.15, 27.5]}
        rotation={[0, Math.PI - 0.16, 0]}
      />
    </>
  );
}
