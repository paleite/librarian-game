"use client";

import { useEffect } from "react";

import { useGameStore } from "@/game/state/game-store";

export function GameClock() {
  const phase = useGameStore((state) => state.phase);
  const addElapsedMilliseconds = useGameStore(
    (state) => state.addElapsedMilliseconds,
  );

  useEffect(() => {
    if (phase !== "sorting") {
      return;
    }

    let frameId = 0;
    let previousTimestamp = performance.now();

    const tick = (timestamp: number) => {
      const delta = timestamp - previousTimestamp;
      previousTimestamp = timestamp;

      if (!document.hidden) {
        addElapsedMilliseconds(delta);
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [addElapsedMilliseconds, phase]);

  return null;
}
