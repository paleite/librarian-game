"use client";

import { useEffect } from "react";

import { PROVISIONAL_DAY_TO_NIGHT_MILLISECONDS } from "@/game/content/lighting-tuning";
import {
  unlockLibraryAudio,
  updateLibraryMusic,
} from "@/game/audio/music";

export function LibraryAmbience({
  active,
  correctRows,
  cozyMode,
  elapsedMilliseconds,
}: {
  active: boolean;
  correctRows: number;
  cozyMode: boolean;
  elapsedMilliseconds: number;
}) {
  useEffect(() => {
    const unlock = () => unlockLibraryAudio();

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    const completionProgress = correctRows / 400;
    const nightProgress = cozyMode
      ? 0
      : Math.max(
          0,
          Math.min(
            1,
            elapsedMilliseconds / PROVISIONAL_DAY_TO_NIGHT_MILLISECONDS,
          ),
        );

    updateLibraryMusic({
      active,
      completionProgress,
      nightProgress,
    });
  }, [active, correctRows, cozyMode, elapsedMilliseconds]);

  return null;
}
