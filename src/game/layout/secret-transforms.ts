import type { Transform3 } from "@/game/run/types";
import type { SecretKeyId } from "@/game/content/secrets";

export interface SecretWorldTransform {
  keyId: SecretKeyId;
  keyTransform: Transform3;
  chestTransform: Transform3;
}

export const secretWorldTransforms: readonly SecretWorldTransform[] = [
  {
    keyId: "crimson-octagon",
    keyTransform: {
      position: [0, 1.15, 39.2],
      rotation: [0, 0, 0],
    },
    chestTransform: {
      position: [-7.2, 5.05, 30.5],
      rotation: [0, Math.PI / 2, 0],
    },
  },
  {
    keyId: "golden-diamond",
    keyTransform: {
      position: [4.55, 1.28, 35.6],
      rotation: [0, 0.5, 0],
    },
    chestTransform: {
      position: [7.2, 5.05, 30.5],
      rotation: [0, -Math.PI / 2, 0],
    },
  },
  {
    keyId: "emerald-club",
    keyTransform: {
      position: [-3.8, 1.18, 22.7],
      rotation: [0, 0.2, 0],
    },
    chestTransform: {
      position: [-7.2, 5.05, 27.9],
      rotation: [0, Math.PI / 2, 0],
    },
  },
  {
    keyId: "azure-star",
    keyTransform: {
      position: [-0.2, 8.15, -39.1],
      rotation: [0, 0, 0],
    },
    chestTransform: {
      position: [7.2, 5.05, 27.9],
      rotation: [0, -Math.PI / 2, 0],
    },
  },
];
