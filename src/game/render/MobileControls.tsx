"use client";

import { useRef, useState } from "react";

import {
  majorMagicDefinitions,
  type MajorMagicId,
} from "@/game/content/abilities";
import { playerInput } from "@/game/input/player-input";
import { useGameStore } from "@/game/state/game-store";

const JOYSTICK_RADIUS = 54;

export interface MobileControlsProps {
  onOpenMenu: () => void;
}

export function MobileControls({ onOpenMenu }: MobileControlsProps) {
  const [stick, setStick] = useState({ x: 0, y: 0 });
  const [magicOpen, setMagicOpen] = useState(false);
  const joystickPointerId = useRef<number | null>(null);
  const lookPointerId = useRef<number | null>(null);
  const lookPrevious = useRef({ x: 0, y: 0 });

  const phase = useGameStore((state) => state.phase);
  const majorMagicLevels = useGameStore((state) => state.majorMagicLevels);

  const updateJoystick = (
    event: React.PointerEvent<HTMLDivElement>,
    origin?: { x: number; y: number },
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = origin?.x ?? rect.left + rect.width / 2;
    const centerY = origin?.y ?? rect.top + rect.height / 2;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distance = Math.hypot(dx, dy);
    const scale = distance > JOYSTICK_RADIUS ? JOYSTICK_RADIUS / distance : 1;
    const x = dx * scale;
    const y = dy * scale;

    setStick({ x, y });
    playerInput.setMove(x / JOYSTICK_RADIUS, -y / JOYSTICK_RADIUS);
  };

  const queueMagic = (id: MajorMagicId) => {
    playerInput.queueMajorMagic(id);
    setMagicOpen(false);
  };

  return (
    <div className="mobile-game-controls pointer-events-none absolute inset-0 z-20">
      <div
        className="pointer-events-auto absolute inset-y-0 right-0 w-[58%] touch-none"
        onPointerDown={(event) => {
          if (event.pointerType !== "touch") {
            return;
          }

          lookPointerId.current = event.pointerId;
          lookPrevious.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (event.pointerId !== lookPointerId.current) {
            return;
          }

          const dx = event.clientX - lookPrevious.current.x;
          const dy = event.clientY - lookPrevious.current.y;

          playerInput.addLookDelta(dx, dy);
          lookPrevious.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          if (event.pointerId === lookPointerId.current) {
            lookPointerId.current = null;
          }
        }}
        onPointerCancel={() => {
          lookPointerId.current = null;
        }}
      />

      <button
        className="pointer-events-auto absolute right-[max(12px,env(safe-area-inset-right))] top-[max(12px,env(safe-area-inset-top))] grid h-12 w-12 place-items-center rounded-xl border border-white/20 bg-black/55 text-xl text-white backdrop-blur"
        onClick={onOpenMenu}
        type="button"
        aria-label="Open game menu"
      >
        ☰
      </button>

      <div
        className="pointer-events-auto absolute bottom-[max(18px,env(safe-area-inset-bottom))] left-[max(18px,env(safe-area-inset-left))] h-32 w-32 touch-none rounded-full border border-white/20 bg-black/30 backdrop-blur-sm"
        onPointerDown={(event) => {
          joystickPointerId.current = event.pointerId;
          event.currentTarget.setPointerCapture(event.pointerId);
          updateJoystick(event);
        }}
        onPointerMove={(event) => {
          if (event.pointerId === joystickPointerId.current) {
            updateJoystick(event);
          }
        }}
        onPointerUp={(event) => {
          if (event.pointerId !== joystickPointerId.current) {
            return;
          }

          joystickPointerId.current = null;
          setStick({ x: 0, y: 0 });
          playerInput.clearMove();
        }}
        onPointerCancel={() => {
          joystickPointerId.current = null;
          setStick({ x: 0, y: 0 });
          playerInput.clearMove();
        }}
        aria-label="Movement joystick"
      >
        <div
          className="absolute left-1/2 top-1/2 h-14 w-14 rounded-full border border-white/30 bg-white/20"
          style={{
            transform: `translate(calc(-50% + ${stick.x}px), calc(-50% + ${stick.y}px))`,
          }}
        />
      </div>

      <div className="pointer-events-auto absolute bottom-[max(18px,env(safe-area-inset-bottom))] right-[max(16px,env(safe-area-inset-right))] flex flex-col items-end gap-2">
        {magicOpen ? (
          <div className="mb-1 flex gap-2 rounded-2xl border border-white/15 bg-black/70 p-2 backdrop-blur">
            {majorMagicDefinitions.map((magic) => {
              const level = majorMagicLevels[magic.id];

              return (
                <button
                  className="grid h-11 min-w-11 place-items-center rounded-xl border border-white/15 bg-white/10 px-2 text-sm font-semibold text-white disabled:opacity-35"
                  disabled={level <= 0}
                  key={magic.id}
                  onClick={() => queueMagic(magic.id)}
                  type="button"
                  aria-label={magic.name}
                >
                  {magic.hotkey}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="flex items-end gap-2">
          {phase === "special-stage" ? (
            <button
              className="grid h-14 min-w-14 place-items-center rounded-2xl border border-violet-300/30 bg-violet-500/25 px-3 text-sm font-bold text-white backdrop-blur"
              onClick={() => playerInput.queueSpecialUltimate()}
              type="button"
            >
              ULT
            </button>
          ) : null}

          <button
            className="grid h-14 min-w-14 place-items-center rounded-2xl border border-white/20 bg-black/50 px-3 text-sm font-semibold text-white backdrop-blur"
            onClick={() => setMagicOpen((open) => !open)}
            type="button"
          >
            Magic
          </button>

          <button
            className="grid h-14 min-w-14 place-items-center rounded-2xl border border-white/20 bg-black/50 px-3 text-sm font-semibold text-white backdrop-blur"
            onPointerDown={() => playerInput.startDrop()}
            onPointerUp={() => playerInput.releaseDrop()}
            onPointerCancel={() => playerInput.releaseDrop()}
            type="button"
          >
            Drop
          </button>

          <button
            className="grid h-16 min-w-16 place-items-center rounded-2xl border border-white/20 bg-black/55 px-3 text-sm font-semibold text-white backdrop-blur"
            onPointerDown={(event) => {
              event.preventDefault();
              playerInput.queueJump();
            }}
            type="button"
          >
            Jump
          </button>
        </div>
      </div>
    </div>
  );
}
