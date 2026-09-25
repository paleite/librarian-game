"use client";

import { useGameSettings } from "@/game/settings/game-settings";

export function VignetteOverlay() {
  const { vignette } = useGameSettings();

  if (!vignette) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20"
      style={{
        background:
          "radial-gradient(circle at center, transparent 48%, rgba(0,0,0,0.12) 70%, rgba(0,0,0,0.48) 100%)",
      }}
    />
  );
}
