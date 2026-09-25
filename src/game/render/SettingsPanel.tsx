"use client";

import { useEffect, useState } from "react";

import {
  resetKeyBindings,
  type KeyBindingAction,
  updateGameSettings,
  updateKeyBinding,
  useGameSettings,
} from "@/game/settings/game-settings";

const bindingLabels: readonly [
  KeyBindingAction,
  string,
][] = [
  ["moveForward", "Move Forward"],
  ["moveBackward", "Move Backward"],
  ["moveLeft", "Move Left"],
  ["moveRight", "Move Right"],
  ["interact", "Interact / Place Book"],
  ["drop", "Drop Book"],
  ["bookList", "Book List"],
  ["jump", "Jump"],
  ["sprint", "Sprint"],
  ["magicMenu", "Major Magic Menu"],
  ["ability1", "Ability 1"],
  ["ability2", "Ability 2"],
  ["ability3", "Ability 3"],
  ["ability4", "Ability 4"],
  ["ability5", "Ability 5"],
  ["specialUltimate", "Special Stage Ultimate"],
];

function displayCode(code: string): string {
  if (code.startsWith("Key")) {
    return code.slice(3);
  }

  if (code.startsWith("Digit")) {
    return code.slice(5);
  }

  if (code === "ShiftLeft") {
    return "Left Shift";
  }

  if (code === "ShiftRight") {
    return "Right Shift";
  }

  if (code === "Space") {
    return "Space";
  }

  return code;
}

export function SettingsPanel({
  autosaveEnabled,
  onAutosaveChange,
  onClose,
}: {
  autosaveEnabled: boolean;
  onAutosaveChange: (enabled: boolean) => void;
  onClose: () => void;
}) {
  const settings = useGameSettings();
  const [capturing, setCapturing] =
    useState<KeyBindingAction | null>(null);

  useEffect(() => {
    if (!capturing) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.code === "Escape") {
        setCapturing(null);
        return;
      }

      updateKeyBinding(capturing, event.code);
      setCapturing(null);
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () =>
      window.removeEventListener("keydown", handleKeyDown, true);
  }, [capturing]);

  return (
    <div className="pointer-events-auto absolute inset-0 z-50 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="mx-auto my-6 w-full max-w-2xl rounded-2xl border border-white/15 bg-stone-950/95 p-5 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              Settings
            </div>
            <h2 className="mt-2 text-2xl font-semibold">
              Display, Gameplay & Layout
            </h2>
          </div>
          <button
            className="min-h-11 rounded-xl border border-white/15 px-4 text-sm"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <label className="block rounded-xl border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">FOV</div>
                <div className="mt-1 text-xs text-white/45">
                  Source range: 70–110°
                </div>
              </div>
              <div className="text-sm font-semibold">{settings.fov}°</div>
            </div>
            <input
              className="mt-3 w-full"
              max={110}
              min={70}
              onChange={(event) =>
                updateGameSettings({
                  fov: Number(event.currentTarget.value),
                })
              }
              step={1}
              type="range"
              value={settings.fov}
            />
          </label>

          <label className="block rounded-xl border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">Render Scale</div>
                <div className="mt-1 text-xs text-white/45">
                  Browser renderer resolution scale
                </div>
              </div>
              <div className="text-sm font-semibold">
                {Math.round(settings.renderScale * 100)}%
              </div>
            </div>
            <input
              className="mt-3 w-full"
              max={100}
              min={50}
              onChange={(event) =>
                updateGameSettings({
                  renderScale: Number(event.currentTarget.value) / 100,
                })
              }
              step={5}
              type="range"
              value={Math.round(settings.renderScale * 100)}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.035] px-4">
              <span className="font-semibold">Display Tutorial</span>
              <input
                checked={settings.displayTutorial}
                onChange={(event) =>
                  updateGameSettings({
                    displayTutorial: event.currentTarget.checked,
                  })
                }
                type="checkbox"
              />
            </label>

            <label className="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.035] px-4">
              <span className="font-semibold">Auto Save</span>
              <input
                checked={autosaveEnabled}
                onChange={(event) =>
                  onAutosaveChange(event.currentTarget.checked)
                }
                type="checkbox"
              />
            </label>

            <label className="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.035] px-4">
              <span className="font-semibold">Invert Mouse</span>
              <input
                checked={settings.invertMouse}
                onChange={(event) =>
                  updateGameSettings({
                    invertMouse: event.currentTarget.checked,
                  })
                }
                type="checkbox"
              />
            </label>

            <label className="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.035] px-4">
              <span className="font-semibold">Vignette</span>
              <input
                checked={settings.vignette}
                onChange={(event) =>
                  updateGameSettings({
                    vignette: event.currentTarget.checked,
                  })
                }
                type="checkbox"
              />
            </label>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">Layout</div>
                <div className="mt-1 text-xs text-white/45">
                  Select a binding, then press the replacement key.
                </div>
              </div>
              <button
                className="rounded-lg border border-white/15 px-3 py-2 text-xs hover:bg-white/[0.06]"
                onClick={() => {
                  resetKeyBindings();
                  setCapturing(null);
                }}
                type="button"
              >
                Restore defaults
              </button>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {bindingLabels.map(([action, label]) => (
                <button
                  className={
                    "flex min-h-11 items-center justify-between gap-3 rounded-lg border px-3 text-left text-sm " +
                    (capturing === action
                      ? "border-amber-300/40 bg-amber-300/[0.08]"
                      : "border-white/10 bg-black/20 hover:bg-white/[0.05]")
                  }
                  key={action}
                  onClick={() => setCapturing(action)}
                  type="button"
                >
                  <span className="truncate text-white/70">{label}</span>
                  <span className="shrink-0 rounded border border-white/15 bg-black/35 px-2 py-1 font-mono text-xs font-semibold text-white">
                    {capturing === action
                      ? "Press key…"
                      : displayCode(settings.keyBindings[action])}
                  </span>
                </button>
              ))}
            </div>

            {capturing ? (
              <div className="mt-3 text-xs text-amber-200/70">
                Press Escape to cancel rebinding.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
