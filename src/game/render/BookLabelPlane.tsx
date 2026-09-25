"use client";

import { useMemo } from "react";
import * as THREE from "three";

const textureCache = new Map<string, THREE.CanvasTexture>();

function createLabelTexture(title: string, volumeNumber: number) {
  const cacheKey = `${title}::${volumeNumber}`;
  const cached = textureCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 96;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas 2D context is unavailable");
  }

  context.fillStyle = "#efe2bd";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "#5b432b";
  context.lineWidth = 5;
  context.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);

  context.fillStyle = "#21170f";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "700 22px Arial, sans-serif";

  let fontSize = 22;

  while (
    fontSize > 10 &&
    context.measureText(title).width > canvas.width - 20
  ) {
    fontSize -= 1;
    context.font = `700 ${fontSize}px Arial, sans-serif`;
  }

  context.fillText(title, canvas.width / 2, 38);

  context.font = "700 17px Arial, sans-serif";
  context.fillStyle = "#6d4f31";
  context.fillText(`VOL. ${volumeNumber}`, canvas.width / 2, 70);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);

  return texture;
}

export function BookLabelPlane({
  title,
  volumeNumber,
}: {
  title: string;
  volumeNumber: number;
}) {
  const texture = useMemo(
    () => createLabelTexture(title, volumeNumber),
    [title, volumeNumber],
  );

  return (
    <mesh
      position={[0, 0.0305, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[0.19, 0.105, 1]}
      renderOrder={2}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        polygonOffset
        polygonOffsetFactor={-2}
        toneMapped={false}
      />
    </mesh>
  );
}
