import * as THREE from "three";

import { sections } from "@/game/catalog/sections";
import { libraryTopology } from "@/game/layout/library-layout";

const textureCache = new Map<1 | 2, THREE.CanvasTexture>();

interface MapSection {
  code: string;
  name: string;
  zone: "left" | "right" | "back";
  routeOrder: number;
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function drawSectionBox(
  context: CanvasRenderingContext2D,
  section: MapSection,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  context.save();

  roundRect(context, x, y, width, height, 12);
  context.fillStyle = "#d8c08a";
  context.fill();
  context.lineWidth = 4;
  context.strokeStyle = "#553a20";
  context.stroke();

  context.fillStyle = "#2a1b10";
  context.textAlign = "left";
  context.textBaseline = "middle";
  context.font = "700 25px Georgia, serif";
  context.fillText(section.code, x + 14, y + height / 2);

  context.font = "600 16px Georgia, serif";
  const maxWidth = width - 72;
  let label = section.name;

  if (context.measureText(label).width > maxWidth) {
    while (label.length > 5 && context.measureText(label + "…").width > maxWidth) {
      label = label.slice(0, -1);
    }
    label += "…";
  }

  context.fillText(label, x + 66, y + height / 2);
  context.restore();
}

function createFloorMapTexture(floor: 1 | 2): THREE.CanvasTexture {
  const cached = textureCache.get(floor);

  if (cached) {
    return cached;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 768;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas 2D context is unavailable");
  }

  context.fillStyle = "#e9dbb7";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "#725132";
  context.lineWidth = 18;
  context.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  context.fillStyle = "#2f2014";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "700 44px Georgia, serif";
  context.fillText(
    floor === 1 ? "FIRST FLOOR · ARCANE CATEGORIES" : "SECOND FLOOR · ARCANE CATEGORIES",
    canvas.width / 2,
    65,
  );

  context.font = "600 19px Georgia, serif";
  context.fillStyle = "#6b4c2d";
  context.fillText(
    "Match a book's title, cover clues, and category to the marked shelf section",
    canvas.width / 2,
    107,
  );

  const sectionNameByCode = new Map(
    sections.map((section) => [section.code, section.name]),
  );

  const floorPlacements = libraryTopology.sections
    .filter((placement) => placement.floor === floor)
    .map(
      (placement): MapSection => ({
        code: placement.sectionCode,
        name:
          sectionNameByCode.get(placement.sectionCode) ??
          placement.sectionCode,
        zone: placement.zone,
        routeOrder: placement.routeOrder,
      }),
    );

  const left = floorPlacements
    .filter((section) => section.zone === "left")
    .sort((a, b) => a.routeOrder - b.routeOrder);
  const right = floorPlacements
    .filter((section) => section.zone === "right")
    .sort((a, b) => a.routeOrder - b.routeOrder);
  const back = floorPlacements
    .filter((section) => section.zone === "back")
    .sort((a, b) => a.routeOrder - b.routeOrder);

  const hallTop = 205;
  const hallBottom = 655;
  const sideWidth = 330;
  const sideGap = 12;
  const boxHeight = Math.min(
    64,
    (hallBottom - hallTop - sideGap * (Math.max(left.length, right.length) - 1)) /
      Math.max(left.length, right.length),
  );

  left.forEach((section, index) => {
    drawSectionBox(
      context,
      section,
      54,
      hallTop + index * (boxHeight + sideGap),
      sideWidth,
      boxHeight,
    );
  });

  right.forEach((section, index) => {
    drawSectionBox(
      context,
      section,
      canvas.width - 54 - sideWidth,
      hallTop + index * (boxHeight + sideGap),
      sideWidth,
      boxHeight,
    );
  });

  const aisleX = 408;
  const aisleWidth = 208;
  roundRect(context, aisleX, hallTop, aisleWidth, hallBottom - hallTop, 24);
  context.fillStyle = "#f5ecd3";
  context.fill();
  context.strokeStyle = "#a4835e";
  context.lineWidth = 5;
  context.stroke();

  context.fillStyle = "#b79a75";
  context.font = "700 20px Georgia, serif";
  context.save();
  context.translate(
    aisleX + aisleWidth / 2,
    hallTop + (hallBottom - hallTop) / 2,
  );
  context.rotate(-Math.PI / 2);
  context.fillText("MAIN LIBRARY AISLE", 0, 0);
  context.restore();

  const backY = 132;
  const backGap = 10;
  const backWidth =
    (canvas.width - 108 - backGap * (back.length - 1)) /
    Math.max(1, back.length);

  back.forEach((section, index) => {
    drawSectionBox(
      context,
      section,
      54 + index * (backWidth + backGap),
      backY,
      backWidth,
      58,
    );
  });

  context.fillStyle = "#6d4c2e";
  roundRect(context, 424, 668, 176, 54, 12);
  context.fill();
  context.fillStyle = "#f7edd1";
  context.font = "700 20px Georgia, serif";
  context.fillText(
    floor === 1 ? "FRONT / STAIRS" : "STAIRS / BALCONY",
    512,
    695,
  );

  context.fillStyle = "#7d6246";
  context.font = "600 15px Georgia, serif";
  context.fillText("LEFT SHELVES", 220, 742);
  context.fillText("RIGHT SHELVES", 804, 742);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  textureCache.set(floor, texture);

  return texture;
}

export function getFloorMapTexture(floor: 1 | 2): THREE.CanvasTexture {
  return createFloorMapTexture(floor);
}
