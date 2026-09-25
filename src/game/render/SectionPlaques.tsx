"use client";

import { Html } from "@react-three/drei";
import { useMemo } from "react";

import { sections } from "@/game/catalog/sections";
import { shelfRows } from "@/game/layout/shelf-rows";
import { shelfRowTransformById } from "@/game/layout/shelf-row-transforms";
import { isSectionComplete } from "@/game/rules/shelf-state";
import { useGameStore } from "@/game/state/game-store";

function getPlaqueTransform(sectionCode: string) {
  const transforms = shelfRows
    .filter((row) => row.sectionCode === sectionCode)
    .map((row) => shelfRowTransformById.get(row.id))
    .filter((row) => row !== undefined);

  if (transforms.length === 0) {
    return null;
  }

  const x =
    transforms.reduce((sum, row) => sum + row.transform.position[0], 0) /
    transforms.length;
  const z =
    transforms.reduce((sum, row) => sum + row.transform.position[2], 0) /
    transforms.length;
  const y =
    Math.max(...transforms.map((row) => row.transform.position[1])) + 0.55;

  return {
    position: [x, y, z] as const,
    rotation: transforms[0].transform.rotation,
  };
}

export function SectionPlaques() {
  const bookLocations = useGameStore((state) => state.bookLocations);
  const guidedSectionCode = useGameStore((state) => state.activeShelfGuideSectionCode);

  const completionByCode = useMemo(
    () =>
      new Map(
        sections.map((section) => [
          section.code,
          isSectionComplete(section.code, bookLocations),
        ]),
      ),
    [bookLocations],
  );

  return (
    <>
      {sections.map((section) => {
        const transform = getPlaqueTransform(section.code);

        if (!transform) {
          return null;
        }

        const complete = completionByCode.get(section.code) ?? false;
        const guided = guidedSectionCode === section.code;

        return (
          <group
            key={section.code}
            position={transform.position}
            rotation={transform.rotation}
          >
            <mesh scale={[0.95, 0.28, 0.08]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color={guided ? "#9d7d22" : complete ? "#245aa7" : "#151515"}
                emissive={guided ? "#ffd85c" : complete ? "#2d72d2" : "#000000"}
                emissiveIntensity={guided ? 0.95 : complete ? 0.72 : 0}
                roughness={0.45}
              />
            </mesh>

            <Html
              center
              distanceFactor={7}
              position={[0, 0, 0.06]}
              transform
              zIndexRange={[20, 0]}
            >
              <div
                className={
                  "pointer-events-none whitespace-nowrap rounded px-2 py-1 text-center text-[10px] font-bold tracking-wide " +
                  (guided
                    ? "bg-amber-500/90 text-black"
                    : complete
                      ? "bg-blue-600/90 text-white"
                      : "bg-black/85 text-white/75")
                }
              >
                <div>{section.code}</div>
                <div className="text-[7px] font-medium">{section.name}</div>
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}
