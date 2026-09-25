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

import { playerInput } from "@/game/input/player-input";
import { useCoarsePointer } from "@/game/input/use-coarse-pointer";
import { canSprint, hasHighJump } from "@/game/rules/progression";
import type { Transform3 } from "@/game/run/types";
import { useGameStore } from "@/game/state/game-store";

const WALK_SPEED = 4.2;
const SPRINT_SPEED = 7.2;
const JUMP_VELOCITY = 6.2;
const HIGH_JUMP_VELOCITY = 9.4;
const PLAYER_EYE_OFFSET = 0.65;
const DROP_ALL_HOLD_MILLISECONDS = 360;
const TOUCH_LOOK_SENSITIVITY = 0.003;
const MAX_PITCH = Math.PI / 2 - 0.08;

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

function dropBooks(camera: THREE.Camera, heldMilliseconds: number) {
  const state = useGameStore.getState();

  if (state.carriedBookIds.length === 0) {
    return;
  }

  const dropAll = heldMilliseconds >= DROP_ALL_HOLD_MILLISECONDS;
  const transforms = createDropTransforms(
    camera,
    dropAll ? state.carriedBookIds.length : 1,
  );

  if (dropAll) {
    state.dropAllCarriedBooks(transforms);
    return;
  }

  const topBookId = state.carriedBookIds.at(-1);

  if (topBookId) {
    state.dropCarriedBook(topBookId, transforms[0]);
  }
}

export function PlayerController() {
  const coarsePointer = useCoarsePointer();
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const pressedKeysRef = useRef(new Set<string>());
  const dropKeyDownAtRef = useRef<number | null>(null);
  const forwardVector = useRef(new THREE.Vector3());
  const rightVector = useRef(new THREE.Vector3());
  const movementVector = useRef(new THREE.Vector3());
  const interactionRaycaster = useRef(new THREE.Raycaster());
  const lastAimCheckAt = useRef(0);
  const lastTargetedShelfRowId = useRef<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      pressedKeysRef.current.add(event.code);

      if (event.code === "KeyQ" && !event.repeat) {
        dropKeyDownAtRef.current = performance.now();
      }

      if (event.code === "KeyZ" && !event.repeat) {
        playerInput.queueSpecialUltimate();
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
          playerInput.queueMajorMagic(magicId);
        }
      }

      if (event.code === "Space" && !event.repeat) {
        playerInput.queueJump();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeysRef.current.delete(event.code);

      if (event.code !== "KeyQ") {
        return;
      }

      const startedAt = dropKeyDownAtRef.current;
      dropKeyDownAtRef.current = null;

      if (startedAt !== null) {
        const state = useGameStore.getState();

        if (state.carriedBookIds.length > 0) {
          const heldMilliseconds = performance.now() - startedAt;
          const camera = statePlayerCamera.current;

          if (camera) {
            dropBooks(camera, heldMilliseconds);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(({ camera, scene }) => {
    statePlayerCamera.current = camera;

    const rigidBody = rigidBodyRef.current;

    if (!rigidBody) {
      return;
    }

    const frameInput = playerInput.consumeFrame();

    if (
      !document.pointerLockElement &&
      (frameInput.lookDeltaX !== 0 || frameInput.lookDeltaY !== 0)
    ) {
      camera.rotation.order = "YXZ";
      camera.rotation.y -= frameInput.lookDeltaX * TOUCH_LOOK_SENSITIVITY;
      camera.rotation.x = THREE.MathUtils.clamp(
        camera.rotation.x - frameInput.lookDeltaY * TOUCH_LOOK_SENSITIVITY,
        -MAX_PITCH,
        MAX_PITCH,
      );
    }

    interactionRaycaster.current.far = 3.2;
    interactionRaycaster.current.setFromCamera({ x: 0, y: 0 }, camera);

    if (coarsePointer && performance.now() - lastAimCheckAt.current >= 100) {
      lastAimCheckAt.current = performance.now();

      const aimedShelfRowId =
        interactionRaycaster.current
          .intersectObjects(scene.children, true)
          .map((intersection) =>
            typeof intersection.object.userData.targetShelfRowId === "string"
              ? (intersection.object.userData.targetShelfRowId as string)
              : null,
          )
          .find((rowId) => rowId !== null) ?? null;

      if (aimedShelfRowId !== lastTargetedShelfRowId.current) {
        lastTargetedShelfRowId.current = aimedShelfRowId;
        useGameStore.getState().setTargetedShelfRow(aimedShelfRowId);
      }
    }

    if (frameInput.interactQueued) {
      const intersections = interactionRaycaster.current.intersectObjects(
        scene.children,
        true,
      );
      const carryingBook =
        useGameStore.getState().carriedBookIds.length > 0;

      const interaction = carryingBook
        ? intersections.find(
            (intersection) =>
              typeof intersection.object.userData.targetShelfRowId === "string" &&
              typeof intersection.object.userData.mobileInteract === "function",
          ) ??
          intersections.find(
            (intersection) =>
              typeof intersection.object.userData.mobileInteract === "function",
          )
        : intersections.find(
            (intersection) =>
              typeof intersection.object.userData.mobileInteract === "function",
          );

      if (interaction) {
        const mobileInteract = interaction.object.userData.mobileInteract as (
          hit: THREE.Intersection,
        ) => void;

        mobileInteract(interaction);
      }
    }

    if (frameInput.specialUltimateQueued) {
      const state = useGameStore.getState();

      if (state.phase === "special-stage") {
        state.startSpecialStageUltimate();
      }
    }

    if (frameInput.majorMagicQueued) {
      useGameStore.getState().useMajorMagic(frameInput.majorMagicQueued);
    }

    if (frameInput.jumpQueued) {
      const velocity = rigidBody.linvel();

      if (Math.abs(velocity.y) <= 0.08) {
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
    }

    if (
      frameInput.dropReleasedAt !== null &&
      frameInput.dropPressedAt !== null
    ) {
      dropBooks(
        camera,
        frameInput.dropReleasedAt - frameInput.dropPressedAt,
      );
    }

    camera.getWorldDirection(forwardVector.current);
    forwardVector.current.y = 0;

    if (forwardVector.current.lengthSq() > 0) {
      forwardVector.current.normalize();
    }

    rightVector.current.crossVectors(forwardVector.current, camera.up).normalize();

    const keyboardX =
      (pressedKeysRef.current.has("KeyD") ? 1 : 0) -
      (pressedKeysRef.current.has("KeyA") ? 1 : 0);
    const keyboardY =
      (pressedKeysRef.current.has("KeyW") ? 1 : 0) -
      (pressedKeysRef.current.has("KeyS") ? 1 : 0);

    const moveX = THREE.MathUtils.clamp(keyboardX + frameInput.moveX, -1, 1);
    const moveY = THREE.MathUtils.clamp(keyboardY + frameInput.moveY, -1, 1);

    movementVector.current
      .copy(forwardVector.current)
      .multiplyScalar(moveY)
      .add(rightVector.current.clone().multiplyScalar(moveX));

    const inputMagnitude = Math.hypot(moveX, moveY);

    if (movementVector.current.lengthSq() > 0) {
      const state = useGameStore.getState();
      const wantsSprint =
        pressedKeysRef.current.has("ShiftLeft") || inputMagnitude > 0.82;
      const speed = wantsSprint && canSprint(state) ? SPRINT_SPEED : WALK_SPEED;

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
      <PointerLockControls enabled={!coarsePointer} makeDefault />
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

const statePlayerCamera: { current: THREE.Camera | null } = {
  current: null,
};
