"use client";

export function PauseMenu({
  onResume,
  onSaveLoad,
  onSettings,
  onAchievements,
  onReturnToTitle,
}: {
  onResume: () => void;
  onSaveLoad: () => void;
  onSettings: () => void;
  onAchievements: () => void;
  onReturnToTitle: () => void;
}) {
  return (
    <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-stone-950/95 p-5 text-white shadow-2xl">
        <div className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
          Paused
        </div>

        <div className="mt-5 grid gap-2">
          <button
            className="min-h-12 rounded-xl bg-amber-200 px-4 font-semibold text-stone-950 hover:bg-amber-100"
            onClick={onResume}
            type="button"
          >
            Resume
          </button>
          <button
            className="min-h-12 rounded-xl border border-white/15 px-4 text-sm hover:bg-white/[0.06]"
            onClick={onSaveLoad}
            type="button"
          >
            Save / Load
          </button>
          <button
            className="min-h-12 rounded-xl border border-white/15 px-4 text-sm hover:bg-white/[0.06]"
            onClick={onSettings}
            type="button"
          >
            Settings
          </button>
          <button
            className="min-h-12 rounded-xl border border-white/15 px-4 text-sm hover:bg-white/[0.06]"
            onClick={onAchievements}
            type="button"
          >
            Achievements
          </button>
          <button
            className="mt-2 min-h-12 rounded-xl border border-red-200/15 px-4 text-sm text-red-100/75 hover:bg-red-400/[0.06]"
            onClick={onReturnToTitle}
            type="button"
          >
            Return to title
          </button>
        </div>
      </div>
    </div>
  );
}
