import { shelfRowTransformById } from "@/game/layout/shelf-row-transforms";
import { spawnSlotById } from "@/game/layout/spawn-slots";
import type { BookLocation, Transform3 } from "@/game/run/types";

export function getBookWorldTransform(
  location: BookLocation,
): Transform3 | null {
  if (location.kind === "spawn") {
    return spawnSlotById.get(location.slotId)?.transform ?? null;
  }

  if (location.kind === "dropped") {
    return location.transform;
  }

  if (location.kind === "carried") {
    return null;
  }

  const row = shelfRowTransformById.get(location.rowId);

  if (!row) {
    return null;
  }

  const spacing = 0.23;
  const centeredIndex = location.index - (row.capacity - 1) / 2;
  const localX = centeredIndex * spacing;
  const yaw = row.transform.rotation[1];

  return {
    position: [
      row.transform.position[0] + localX * Math.cos(yaw),
      row.transform.position[1] + 0.09,
      row.transform.position[2] + localX * Math.sin(yaw),
    ],
    rotation: [0, yaw, 0],
  };
}
