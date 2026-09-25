"use client";

import {
  updateGameSettings,
  useGameSettings,
} from "@/game/settings/game-settings";

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

  return (
    <div className="pointer-events-auto absolute inset-0 z-50 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="mx-auto my-6 w-full max-w-xl rounded-2xl border border-white/15 bg-stone-950/95 p-5 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              Settings
            </div>
            <h2 className="mt-2 text-2xl font-semibold">Display & Gameplay</h2>
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

          <label className="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.035] px-4">
            <div>
              <div className="font-semibold">Display Tutorial</div>
              <div className="mt-1 text-xs text-white/45">
                Show tutorial and late-game help prompts
              </div>
            </div>
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
            <div>
              <div className="font-semibold">Auto Save</div>
              <div className="mt-1 text-xs text-white/45">
                Save automatically when a new row is completed
              </div>
            </div>
            <input
              checked={autosaveEnabled}
              onChange={(event) =>
                onAutosaveChange(event.currentTarget.checked)
              }
              type="checkbox"
            />
          </label>

          <label className="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.035] px-4">
            <div>
              <div className="font-semibold">Invert Mouse</div>
              <div className="mt-1 text-xs text-white/45">
                Invert vertical mouse-look direction
              </div>
            </div>
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
            <div>
              <div className="font-semibold">Vignette</div>
              <div className="mt-1 text-xs text-white/45">
                Darken the outer edge of the screen
              </div>
            </div>
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
      </div>
    </div>
  );
}
