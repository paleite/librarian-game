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
import { useInteractionUiStore } from "@/game/state/interaction-ui-store";
import { useGameSettings } from "@/game/settings/game-settings";

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
  const { invertMouse } = useGameSettings();
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const pressedKeysRef = useRef(new Set<string>());
  const dropKeyDownAtRef = useRef<number | null>(null);
  const forwardVector = useRef(new THREE.Vector3());
  const rightVector = useRef(new THREE.Vector3());
  const movementVector = useRef(new THREE.Vector3());
  const interactionRaycaster = useRef(new THREE.Raycaster());
  const interactionCenter = useRef(new THREE.Vector2(0, 0));
  const lastAimCheckAt = useRef(0);
  const lastTargetedShelfRowId = useRef<string | null>(null);
  const lastAimObject = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      pressedKeysRef.current.add(event.code);

      if (
        event.code === "KeyE" &&
        !event.repeat &&
        document.pointerLockElement
      ) {
        playerInput.queueInteract();
      }

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

    const handleWheel = (event: WheelEvent) => {
      if (!document.pointerLockElement) {
        return;
      }

      const state = useGameStore.getState();
      const count = state.carriedBookIds.length;

      if (count < 2 || event.deltaY === 0) {
        return;
      }

      event.preventDefault();

      if (event.deltaY > 0) {
        state.reorderCarriedBook(count - 1, 0);
      } else {
        state.reorderCarriedBook(0, count - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!document.pointerLockElement || coarsePointer) {
        return;
      }

      const camera = statePlayerCamera.current;

      if (!camera) {
        return;
      }

      camera.rotation.order = "YXZ";
      camera.rotation.y -= event.movementX * 0.002;
      camera.rotation.x = THREE.MathUtils.clamp(
        camera.rotation.x +
          event.movementY * 0.002 * (invertMouse ? 1 : -1),
        -MAX_PITCH,
        MAX_PITCH,
      );
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [coarsePointer, invertMouse]);

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
    interactionRaycaster.current.setFromCamera(interactionCenter.current, camera);

    if (performance.now() - lastAimCheckAt.current >= 100) {
      lastAimCheckAt.current = performance.now();

      const intersections = interactionRaycaster.current.intersectObjects(
        scene.children,
        true,
      );
      const aimIntersection = intersections.find(
        (intersection) =>
          typeof intersection.object.userData.getInteractionInfo === "function" ||
          typeof intersection.object.userData.targetShelfRowId === "string" ||
          typeof intersection.object.userData.mobileInteract === "function",
      ) ?? null;

      if (lastAimObject.current && lastAimObject.current !== aimIntersection?.object) {
        const previousAimOut = lastAimObject.current.userData.onAimOut;

        if (typeof previousAimOut === "function") {
          previousAimOut();
        }
      }

      lastAimObject.current = aimIntersection?.object ?? null;

      if (aimIntersection) {
        const onAim = aimIntersection.object.userData.onAim;

        if (typeof onAim === "function") {
          onAim(aimIntersection);
        }

        const getInteractionInfo =
          aimIntersection.object.userData.getInteractionInfo;
        const info =
          typeof getInteractionInfo === "function"
            ? getInteractionInfo(aimIntersection)
            : null;

        useInteractionUiStore.getState().setAimed(info ?? null);
      } else {
        useInteractionUiStore.getState().setAimed(null);
      }

      const aimedShelfRowId =
        typeof aimIntersection?.object.userData.targetShelfRowId === "string"
          ? (aimIntersection.object.userData.targetShelfRowId as string)
          : null;

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
      <PointerLockControls enabled={!coarsePointer} makeDefault pointerSpeed={0} />
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
