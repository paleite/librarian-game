"use client";

export interface MobileHudProps {
  correctRows: number;
  carriedCount: number;
  carryCapacity: number;
  elapsedText: string;
  cozyMode: boolean;
}

export function MobileHud({
  correctRows,
  carriedCount,
  carryCapacity,
  elapsedText,
  cozyMode,
}: MobileHudProps) {
  return (
    <div className="mobile-game-hud pointer-events-none absolute left-[max(12px,env(safe-area-inset-left))] top-[max(12px,env(safe-area-inset-top))] z-30 flex items-center gap-2 text-xs text-white">
      <div className="rounded-xl border border-white/15 bg-black/55 px-3 py-2 backdrop-blur">
        <span className="font-semibold">{correctRows}/400</span>
        <span className="mx-2 text-white/35">·</span>
        <span>
          {carriedCount}/{carryCapacity}
        </span>
        {!cozyMode ? (
          <>
            <span className="mx-2 text-white/35">·</span>
            <span>{elapsedText}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
