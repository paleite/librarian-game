"use client";

import { useEffect, useMemo, useState } from "react";

import { majorMagicDefinitions } from "@/game/content/abilities";
import {
  getMajorMagicActiveMilliseconds,
  getMajorMagicCooldownMilliseconds,
} from "@/game/content/major-magic-tuning";
import { useGameStore } from "@/game/state/game-store";

function formatSeconds(milliseconds: number): string {
  return Math.max(0, Math.ceil(milliseconds / 1000)).toString();
}

export function MajorMagicHud() {
  const [now, setNow] = useState(() => Date.now());
  const phase = useGameStore((state) => state.phase);
  const levels = useGameStore((state) => state.majorMagicLevels);
  const readyAt = useGameStore((state) => state.majorMagicReadyAt);
  const shelfGuideActiveUntil = useGameStore(
    (state) => state.shelfGuideActiveUntil,
  );
  const insightActiveUntil = useGameStore(
    (state) => state.insightActiveUntil,
  );
  const autoShelvingActiveUntil = useGameStore(
    (state) => state.autoShelvingActiveUntil,
  );

  useEffect(() => {
    if (phase !== "sorting" && phase !== "special-stage") {
      return;
    }

    const intervalId = window.setInterval(() => setNow(Date.now()), 100);

    return () => window.clearInterval(intervalId);
  }, [phase]);

  const activeUntilById = useMemo(
    () => ({
      sort: 0,
      "shelf-guide": shelfGuideActiveUntil,
      insight: insightActiveUntil,
      "auto-shelving": autoShelvingActiveUntil,
      assemble: 0,
    }),
    [
      autoShelvingActiveUntil,
      insightActiveUntil,
      shelfGuideActiveUntil,
    ],
  );

  if (phase !== "sorting" && phase !== "special-stage") {
    return null;
  }

  const unlocked = majorMagicDefinitions.filter(
    (definition) => levels[definition.id] > 0,
  );

  if (unlocked.length === 0) {
    return null;
  }

  return (
    <div className="desktop-major-magic-hud pointer-events-none absolute bottom-5 left-5 z-30 flex flex-col gap-1.5 text-white">
      {unlocked.map((definition) => {
        const level = levels[definition.id];
        const activeUntil = activeUntilById[definition.id];
        const activeRemaining = Math.max(0, activeUntil - now);
        const cooldownRemaining = Math.max(0, readyAt[definition.id] - now);
        const activeDuration = getMajorMagicActiveMilliseconds(
          definition.id,
          level,
        );
        const cooldownDuration = getMajorMagicCooldownMilliseconds(
          definition.id,
          level,
        );

        const active = activeRemaining > 0;
        const cooling = cooldownRemaining > 0 && !active;

        const progress = active
          ? activeDuration > 0
            ? activeRemaining / activeDuration
            : 0
          : cooling && cooldownDuration > 0
            ? cooldownRemaining / cooldownDuration
            : 0;

        return (
          <div
            className="w-56 rounded-lg border border-white/15 bg-black/68 px-2.5 py-2 shadow-lg backdrop-blur"
            key={definition.id}
          >
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded border border-white/20 bg-white/10 text-xs font-black">
                {definition.hotkey}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-xs font-semibold">
                    {definition.name}
                  </div>
                  <div className="text-[10px] text-white/45">
                    Lv {level}
                  </div>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={
                      "h-full origin-left rounded-full transition-[width] duration-100 " +
                      (active
                        ? "bg-violet-300"
                        : cooling
                          ? "bg-white/45"
                          : "bg-emerald-300")
                    }
                    style={{
                      width:
                        active || cooling
                          ? `${Math.max(0, Math.min(1, progress)) * 100}%`
                          : "100%",
                    }}
                  />
                </div>
              </div>
              <div className="w-12 text-right text-[10px] font-semibold">
                {active
                  ? `ACTIVE ${formatSeconds(activeRemaining)}`
                  : cooling
                    ? `${formatSeconds(cooldownRemaining)}s`
                    : "READY"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
