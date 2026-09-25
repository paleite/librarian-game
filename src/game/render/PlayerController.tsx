"use client";

import { PointerLockControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { canSprint, hasHighJump } from "@/game/rules/progression";
import { useGameStore } from "@/game/state/game-store";
import type { Transform3 } from "@/game/run/types";

const WALK_SPEED = 4.2;
const SPRINT_SPEED = 7.2;
const JUMP_VELOCITY = 6.2;
const HIGH_JUMP_VELOCITY = 9.4;
const PLAYER_EYE_OFFSET = 0.65;
const DROP_ALL_HOLD_MILLISECONDS = 360;

function createDropTransforms(
  camera: THREE.Camera,
  count: number,
): Transform3[] {
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();
  right.crossVectors(forward, camera.up).normalize();

  const origin = camera.position
    .clone()
    .add(forward.clone().multiplyScalar(1.2));
  origin.y = Math.max(0.12, origin.y - 1.45);

  return Array.from({ length: count }, (_, index) => {
    const column = index % 5;
    const row = Math.floor(index / 5);
    const lateralOffset = (column - 2) * 0.27;
    const forwardOffset = row * 0.36;

    const position = origin
      .clone()
      .add(right.clone().multiplyScalar(lateralOffset))
      .add(forward.clone().multiplyScalar(forwardOffset));

    return {
      position: [position.x, position.y, position.z],
      rotation: [0, Math.atan2(forward.x, forward.z), 0],
    };
  });
}

export function PlayerController() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const pressedKeysRef = useRef(new Set<string>());
  const dropKeyDownAtRef = useRef<number | null>(null);
  const forwardVector = useRef(new THREE.Vector3());
  const rightVector = useRef(new THREE.Vector3());
  const movementVector = useRef(new THREE.Vector3());
  const cameraRef = useRef<THREE.Camera | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      pressedKeysRef.current.add(event.code);

      if (event.code === "KeyQ" && !event.repeat) {
        dropKeyDownAtRef.current = performance.now();
      }

      if (event.code === "KeyZ" && !event.repeat) {
        const state = useGameStore.getState();

        if (state.phase === "special-stage") {
          state.startSpecialStageUltimate();
        }
      }

      if (
        !event.repeat &&
        document.pointerLockElement &&
        ["Digit1", "Digit2", "Digit3", "Digit4", "Digit5"].includes(event.code)
      ) {
        const magicByKey = {
          Digit1: "sort",
          Digit2: "shelf-guide",
          Digit3: "insight",
          Digit4: "auto-shelving",
          Digit5: "assemble",
        } as const;

        const magicId = magicByKey[event.code as keyof typeof magicByKey];

        if (magicId) {
          useGameStore.getState().useMajorMagic(magicId);
        }
      }

      if (event.code === "Space" && !event.repeat) {
        const rigidBody = rigidBodyRef.current;

        if (!rigidBody) {
          return;
        }

        const velocity = rigidBody.linvel();

        if (Math.abs(velocity.y) > 0.08) {
          return;
        }

        const state = useGameStore.getState();

        rigidBody.setLinvel(
          {
            x: velocity.x,
            y: hasHighJump(state) ? HIGH_JUMP_VELOCITY : JUMP_VELOCITY,
            z: velocity.z,
          },
          true,
        );
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeysRef.current.delete(event.code);

      if (event.code !== "KeyQ") {
        return;
      }

      const camera = cameraRef.current;
      const startedAt = dropKeyDownAtRef.current;
      dropKeyDownAtRef.current = null;

      if (!camera || startedAt === null) {
        return;
      }

      const state = useGameStore.getState();

      if (state.carriedBookIds.length === 0) {
        return;
      }

      const heldMilliseconds = performance.now() - startedAt;
      const transforms = createDropTransforms(
        camera,
        heldMilliseconds >= DROP_ALL_HOLD_MILLISECONDS
          ? state.carriedBookIds.length
          : 1,
      );

      if (heldMilliseconds >= DROP_ALL_HOLD_MILLISECONDS) {
        state.dropAllCarriedBooks(transforms);
        return;
      }

      const topBookId = state.carriedBookIds.at(-1);

      if (topBookId) {
        state.dropCarriedBook(topBookId, transforms[0]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(({ camera }) => {
    cameraRef.current = camera;

    const rigidBody = rigidBodyRef.current;

    if (!rigidBody) {
      return;
    }

    camera.getWorldDirection(forwardVector.current);
    forwardVector.current.y = 0;

    if (forwardVector.current.lengthSq() > 0) {
      forwardVector.current.normalize();
    }

    rightVector.current.crossVectors(forwardVector.current, camera.up).normalize();
    movementVector.current.set(0, 0, 0);

    if (pressedKeysRef.current.has("KeyW")) {
      movementVector.current.add(forwardVector.current);
    }

    if (pressedKeysRef.current.has("KeyS")) {
      movementVector.current.sub(forwardVector.current);
    }

    if (pressedKeysRef.current.has("KeyD")) {
      movementVector.current.add(rightVector.current);
    }

    if (pressedKeysRef.current.has("KeyA")) {
      movementVector.current.sub(rightVector.current);
    }

    if (movementVector.current.lengthSq() > 0) {
      const state = useGameStore.getState();
      const speed =
        pressedKeysRef.current.has("ShiftLeft") && canSprint(state)
          ? SPRINT_SPEED
          : WALK_SPEED;

      movementVector.current.normalize().multiplyScalar(speed);
    }

    const velocity = rigidBody.linvel();

    rigidBody.setLinvel(
      {
        x: movementVector.current.x,
        y: velocity.y,
        z: movementVector.current.z,
      },
      true,
    );

    const translation = rigidBody.translation();
    camera.position.set(
      translation.x,
      translation.y + PLAYER_EYE_OFFSET,
      translation.z,
    );
  });

  return (
    <>
      <PointerLockControls makeDefault />
      <RigidBody
        ref={rigidBodyRef}
        position={[0, 1, 7]}
        colliders={false}
        enabledRotations={[false, false, false]}
        friction={0}
        canSleep={false}
      >
        <CapsuleCollider args={[0.45, 0.35]} />
      </RigidBody>
    </>
  );
}
