"use client";

import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";

import type { PlacementFeedback } from "@/game/rules/placement-feedback";
import { useCoarsePointer } from "@/game/input/use-coarse-pointer";
import { useGameSettings } from "@/game/settings/game-settings";
import { useViewControlStore } from "@/game/state/view-control-store";

import { BookInstances } from "./BookInstances";
import { BookLabels } from "./BookLabels";
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
import { AchievementController } from "./AchievementController";
import { ShelfFurniture } from "./ShelfFurniture";
import { FloorMaps } from "./FloorMaps";
import { LibraryLandmarks } from "./LibraryLandmarks";
import { GuideBook } from "./GuideBook";

export interface GameCanvasProps {
  onPlacementFeedback: (feedback: PlacementFeedback) => void;
}

export function GameCanvas({
  onPlacementFeedback,
}: GameCanvasProps) {
  const coarsePointer = useCoarsePointer();
  const { fov, renderScale } = useGameSettings();
  const zoomHeld = useViewControlStore((state) => state.zoomHeld);

  return (
    <Canvas
      dpr={coarsePointer ? renderScale : [renderScale, 1.5 * renderScale]}
      shadows={!coarsePointer}
    >
      <color attach="background" args={["#100c09"]} />
      <fog attach="fog" args={["#100c09", 14, 38]} />
      <PerspectiveCamera
        makeDefault
        far={120}
        fov={zoomHeld ? Math.max(25, fov * 0.55) : fov}
        near={0.05}
        position={[0, 1.65, 33]}
        rotation={[0, Math.PI, 0]}
      />
      <LibraryLighting />

      <Physics gravity={[0, -20, 0]}>
        <GameClock />
        <AchievementController />
        <SpecialStageController />
        <LibraryScene />
        <ShelfFurniture />
        <FloorMaps />
        <LibraryLandmarks />
        <GuideBook />
        <ExitDoor />
        <ShelfTargets onPlacementFeedback={onPlacementFeedback} />
        <SectionPlaques />
        <SecretObjects />
        <RecallStone />
        <BookInstances />
        <BookLabels />
        <CarriedBooks />
        <PlayerController />
      </Physics>
    </Canvas>
  );
}
