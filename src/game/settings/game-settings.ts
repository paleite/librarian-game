"use client";

import { useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "librarian-game.settings";
const SETTINGS_CHANGED_EVENT = "librarian-game:settings-changed";

export const keyBindingActions = [
  "moveForward",
  "moveBackward",
  "moveLeft",
  "moveRight",
  "interact",
  "drop",
  "bookList",
  "jump",
  "sprint",
  "magicMenu",
  "ability1",
  "ability2",
  "ability3",
  "ability4",
  "ability5",
  "specialUltimate",
] as const;

export type KeyBindingAction = (typeof keyBindingActions)[number];
export type KeyBindings = Record<KeyBindingAction, string>;

export const defaultKeyBindings: KeyBindings = {
  moveForward: "KeyW",
  moveBackward: "KeyS",
  moveLeft: "KeyA",
  moveRight: "KeyD",
  interact: "KeyE",
  drop: "KeyQ",
  bookList: "KeyR",
  jump: "Space",
  sprint: "ShiftLeft",
  magicMenu: "Tab",
  ability1: "Digit1",
  ability2: "Digit2",
  ability3: "Digit3",
  ability4: "Digit4",
  ability5: "Digit5",
  specialUltimate: "KeyZ",
};

export interface GameSettings {
  fov: number;
  renderScale: number;
  displayTutorial: boolean;
  vignette: boolean;
  invertMouse: boolean;
  keyBindings: KeyBindings;
}

export const defaultGameSettings: GameSettings = {
  fov: 70,
  renderScale: 1,
  displayTutorial: true,
  vignette: true,
  invertMouse: false,
  keyBindings: defaultKeyBindings,
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function sanitizeKeyBindings(value: unknown): KeyBindings {
  const candidate =
    value && typeof value === "object"
      ? (value as Partial<KeyBindings>)
      : {};

  return Object.fromEntries(
    keyBindingActions.map((action) => {
      const code = candidate[action];

      return [
        action,
        typeof code === "string" && code.length > 0
          ? code
          : defaultKeyBindings[action],
      ];
    }),
  ) as KeyBindings;
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
    invertMouse:
      typeof candidate.invertMouse === "boolean"
        ? candidate.invertMouse
        : defaultGameSettings.invertMouse,
    keyBindings: sanitizeKeyBindings(candidate.keyBindings),
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

export function updateKeyBinding(
  action: KeyBindingAction,
  code: string,
): void {
  const current = sanitizeSettings(JSON.parse(readSerialized()));

  updateGameSettings({
    keyBindings: {
      ...current.keyBindings,
      [action]: code,
    },
  });
}

export function resetKeyBindings(): void {
  updateGameSettings({
    keyBindings: defaultKeyBindings,
  });
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
