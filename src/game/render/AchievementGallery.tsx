"use client";

import {
  achievementDefinitions,
  type AchievementId,
} from "@/game/content/achievements";

export function AchievementGallery({
  unlockedAchievementIds,
  onClose,
}: {
  unlockedAchievementIds: readonly AchievementId[];
  onClose: () => void;
}) {
  const unlocked = new Set(unlockedAchievementIds);

  return (
    <div className="pointer-events-auto absolute inset-0 z-50 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="mx-auto my-6 w-full max-w-2xl rounded-2xl border border-white/15 bg-stone-950/95 p-5 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              Achievements
            </div>
            <h2 className="mt-2 text-2xl font-semibold">
              {unlockedAchievementIds.length}/{achievementDefinitions.length}
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

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {achievementDefinitions.map((achievement) => {
            const isUnlocked = unlocked.has(achievement.id);

            return (
              <div
                className={
                  "rounded-xl border p-4 " +
                  (isUnlocked
                    ? "border-amber-300/25 bg-amber-300/[0.06]"
                    : "border-white/10 bg-white/[0.025] opacity-55")
                }
                key={achievement.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">{achievement.name}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-white/45">
                    {isUnlocked ? "Unlocked" : "Locked"}
                  </div>
                </div>
                <div className="mt-2 text-sm leading-5 text-white/55">
                  {achievement.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
