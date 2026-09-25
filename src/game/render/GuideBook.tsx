"use client";

import { useMemo } from "react";
import * as THREE from "three";

function createGuideCoverTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 768;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas 2D context is unavailable");
  }

  context.fillStyle = "#e9dfc8";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#7a2e26";
  context.fillRect(0, 0, 92, canvas.height);
  context.fillRect(canvas.width - 92, 0, 92, canvas.height);

  context.strokeStyle = "#a8864b";
  context.lineWidth = 12;
  context.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

  context.fillStyle = "#b89a59";
  context.font = "700 30px Georgia, serif";
  context.textAlign = "center";
  context.fillText("ARCANE", canvas.width / 2, 255);

  context.font = "700 54px Georgia, serif";
  context.fillStyle = "#a07f46";
  context.fillText("LIBRARIAN", canvas.width / 2, 340);

  context.font = "700 72px Georgia, serif";
  context.fillStyle = "#b08d4f";
  context.fillText("GUIDE", canvas.width / 2, 445);

  context.strokeStyle = "#b08d4f";
  context.lineWidth = 6;
  context.beginPath();
  context.moveTo(155, 500);
  context.lineTo(357, 500);
  context.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  return texture;
}

export function GuideBook() {
  const coverTexture = useMemo(() => createGuideCoverTexture(), []);

  return (
    <group position={[-0.72, 0.76, 35.2]} rotation={[0, -0.12, 0.02]}>
      <mesh
        scale={[0.5, 0.08, 0.7]}
        userData={{
          getInteractionInfo: () => ({
            title: "Arcane Librarian GUIDE",
            subtitle: "Tutorial book",
            action: "Read",
          }),
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6e2a25" roughness={0.68} />
      </mesh>

      <mesh
        position={[0, 0.043, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.46, 0.66, 1]}
        renderOrder={3}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={coverTexture}
          polygonOffset
          polygonOffsetFactor={-3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
