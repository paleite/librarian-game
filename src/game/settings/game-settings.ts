"use client";

import { useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "librarian-game.settings";
const SETTINGS_CHANGED_EVENT = "librarian-game:settings-changed";

export interface GameSettings {
  fov: number;
  renderScale: number;
  displayTutorial: boolean;
  vignette: boolean;
}

export const defaultGameSettings: GameSettings = {
  fov: 70,
  renderScale: 1,
  displayTutorial: true,
  vignette: true,
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function sanitizeSettings(value: unknown): GameSettings {
  if (!value || typeof value !== "object") {
    return defaultGameSettings;
  }

  const candidate = value as Partial<GameSettings>;

  return {
    fov:
      typeof candidate.fov === "number"
        ? clamp(Math.round(candidate.fov), 70, 110)
        : defaultGameSettings.fov,
    renderScale:
      typeof candidate.renderScale === "number"
        ? clamp(candidate.renderScale, 0.5, 1)
        : defaultGameSettings.renderScale,
    displayTutorial:
      typeof candidate.displayTutorial === "boolean"
        ? candidate.displayTutorial
        : defaultGameSettings.displayTutorial,
    vignette:
      typeof candidate.vignette === "boolean"
        ? candidate.vignette
        : defaultGameSettings.vignette,
  };
}

function readSerialized(): string {
  if (typeof window === "undefined") {
    return JSON.stringify(defaultGameSettings);
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return JSON.stringify(defaultGameSettings);
  }

  try {
    return JSON.stringify(sanitizeSettings(JSON.parse(stored)));
  } catch {
    return JSON.stringify(defaultGameSettings);
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(SETTINGS_CHANGED_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(SETTINGS_CHANGED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function updateGameSettings(patch: Partial<GameSettings>): void {
  if (typeof window === "undefined") {
    return;
  }

  const current = sanitizeSettings(JSON.parse(readSerialized()));
  const next = sanitizeSettings({ ...current, ...patch });

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(SETTINGS_CHANGED_EVENT));
}

export function useGameSettings(): GameSettings {
  const serialized = useSyncExternalStore(
    subscribe,
    readSerialized,
    () => JSON.stringify(defaultGameSettings),
  );

  return useMemo(
    () => sanitizeSettings(JSON.parse(serialized)),
    [serialized],
  );
}
