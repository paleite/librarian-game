"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";

import type { PlacementFeedback } from "@/game/rules/placement-feedback";
import { useCoarsePointer } from "@/game/input/use-coarse-pointer";

import { BookInstances } from "./BookInstances";
import { CarriedBooks } from "./CarriedBooks";
import { LibraryScene } from "./LibraryScene";
import { PlayerController } from "./PlayerController";
import { RecallStone } from "./RecallStone";
import { SecretObjects } from "./SecretObjects";
import { ShelfTargets } from "./ShelfTargets";
import { SectionPlaques } from "./SectionPlaques";
import { ExitDoor } from "./ExitDoor";
import { GameClock } from "./GameClock";
import { SpecialStageController } from "./SpecialStageController";
import { LibraryLighting } from "./LibraryLighting";

export interface GameCanvasProps {
  onInspectBook: (bookId: string | null) => void;
  onPlacementFeedback: (feedback: PlacementFeedback) => void;
}

export function GameCanvas({
  onInspectBook,
  onPlacementFeedback,
}: GameCanvasProps) {
  const coarsePointer = useCoarsePointer();

  return (
    <Canvas
      camera={{ fov: 70, near: 0.05, far: 120, position: [0, 1.65, 7] }}
      dpr={coarsePointer ? 1 : [1, 1.5]}
      shadows={!coarsePointer}
    >
      <color attach="background" args={["#100c09"]} />
      <fog attach="fog" args={["#100c09", 14, 38]} />
      <LibraryLighting />

      <Physics gravity={[0, -20, 0]}>
        <GameClock />
        <SpecialStageController />
        <LibraryScene />
        <ExitDoor />
        <ShelfTargets onPlacementFeedback={onPlacementFeedback} />
        <SectionPlaques />
        <SecretObjects />
        <RecallStone />
        <BookInstances onInspectBook={onInspectBook} />
        <CarriedBooks />
        <PlayerController />
      </Physics>
    </Canvas>
  );
}
