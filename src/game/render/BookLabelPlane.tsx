"use client";

import { useMemo } from "react";
import * as THREE from "three";

import { tutorialSeriesId } from "@/game/content/tutorial-series";

const textureCache = new Map<string, THREE.CanvasTexture>();

function createLabelTexture(
  title: string,
  volumeNumber: number,
  seriesId?: string,
) {
  const cacheKey = `${seriesId ?? "unknown"}::${title}::${volumeNumber}`;
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

  const tutorialCat = seriesId === tutorialSeriesId;

  if (tutorialCat) {
    context.save();
    context.translate(30, 31);
    context.fillStyle = "#f7f3ea";
    context.strokeStyle = "#57483a";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(0, 0, 17, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.beginPath();
    context.moveTo(-13, -12);
    context.lineTo(-7, -26);
    context.lineTo(-1, -14);
    context.moveTo(13, -12);
    context.lineTo(7, -26);
    context.lineTo(1, -14);
    context.stroke();
    context.fillStyle = "#57483a";
    context.beginPath();
    context.arc(-6, -2, 2.2, 0, Math.PI * 2);
    context.arc(6, -2, 2.2, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

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

  context.fillText(
    title,
    tutorialCat ? canvas.width / 2 + 18 : canvas.width / 2,
    38,
  );

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
  seriesId,
}: {
  title: string;
  volumeNumber: number;
  seriesId?: string;
}) {
  const texture = useMemo(
    () => createLabelTexture(title, volumeNumber, seriesId),
    [seriesId, title, volumeNumber],
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
