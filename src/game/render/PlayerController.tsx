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

const WALK_SPEED = 4.2;
const PLAYER_EYE_OFFSET = 0.65;

export function PlayerController() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const pressedKeysRef = useRef(new Set<string>());
  const forwardVector = useRef(new THREE.Vector3());
  const rightVector = useRef(new THREE.Vector3());
  const movementVector = useRef(new THREE.Vector3());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      pressedKeysRef.current.add(event.code);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeysRef.current.delete(event.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(({ camera }) => {
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
      movementVector.current.normalize().multiplyScalar(WALK_SPEED);
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
