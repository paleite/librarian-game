"use client";

import { useEffect, useState } from "react";

import {
  achievementDefinitionById,
  type AchievementId,
} from "@/game/content/achievements";
import { ACHIEVEMENT_UNLOCKED_EVENT } from "@/game/save/profile";

interface ToastState {
  id: AchievementId;
  nonce: number;
}

export function AchievementToasts() {
  const [queue, setQueue] = useState<ToastState[]>([]);

  useEffect(() => {
    const handleUnlock = (event: Event) => {
      const achievementId = (event as CustomEvent<AchievementId>).detail;

      if (!achievementDefinitionById.has(achievementId)) {
        return;
      }

      setQueue((current) => [
        ...current,
        {
          id: achievementId,
          nonce: performance.now(),
        },
      ]);
    };

    window.addEventListener(ACHIEVEMENT_UNLOCKED_EVENT, handleUnlock);

    return () =>
      window.removeEventListener(ACHIEVEMENT_UNLOCKED_EVENT, handleUnlock);
  }, []);

  useEffect(() => {
    if (queue.length === 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setQueue((current) => current.slice(1));
    }, 4200);

    return () => window.clearTimeout(timeoutId);
  }, [queue]);

  const activeToast = queue[0];

  if (!activeToast) {
    return null;
  }

  const achievement = achievementDefinitionById.get(activeToast.id);

  if (!achievement) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute bottom-[max(18px,env(safe-area-inset-bottom))] left-1/2 z-50 w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-amber-300/25 bg-black/80 px-4 py-3 text-white shadow-2xl backdrop-blur">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">
        Achievement unlocked
      </div>
      <div className="mt-1 font-semibold">{achievement.name}</div>
      <div className="mt-1 text-xs text-white/55">
        {achievement.description}
      </div>
    </div>
  );
}
