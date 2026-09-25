"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

import { useGameSettings } from "@/game/settings/game-settings";

export function CameraSettings() {
  const camera = useThree((state) => state.camera);
  const { fov } = useGameSettings();

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) {
      return;
    }

    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, fov]);

  return null;
}
