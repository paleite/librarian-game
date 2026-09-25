import type { MajorMagicId } from "@/game/content/abilities";

interface PlayerInputSnapshot {
  moveX: number;
  moveY: number;
  lookDeltaX: number;
  lookDeltaY: number;
  jumpQueued: boolean;
  dropPressedAt: number | null;
  dropReleasedAt: number | null;
  majorMagicQueued: MajorMagicId | null;
  specialUltimateQueued: boolean;
  interactQueued: boolean;
}

const state: PlayerInputSnapshot = {
  moveX: 0,
  moveY: 0,
  lookDeltaX: 0,
  lookDeltaY: 0,
  jumpQueued: false,
  dropPressedAt: null,
  dropReleasedAt: null,
  majorMagicQueued: null,
  specialUltimateQueued: false,
  interactQueued: false,
};

export const playerInput = {
  setMove(x: number, y: number) {
    state.moveX = Math.max(-1, Math.min(1, x));
    state.moveY = Math.max(-1, Math.min(1, y));
  },

  addLookDelta(x: number, y: number) {
    state.lookDeltaX += x;
    state.lookDeltaY += y;
  },

  queueJump() {
    state.jumpQueued = true;
  },

  startDrop() {
    if (state.dropPressedAt === null) {
      state.dropPressedAt = performance.now();
    }
  },

  releaseDrop() {
    if (state.dropPressedAt !== null) {
      state.dropReleasedAt = performance.now();
    }
  },

  queueMajorMagic(id: MajorMagicId) {
    state.majorMagicQueued = id;
  },

  queueSpecialUltimate() {
    state.specialUltimateQueued = true;
  },

  queueInteract() {
    state.interactQueued = true;
  },

  consumeFrame() {
    const snapshot = { ...state };

    state.lookDeltaX = 0;
    state.lookDeltaY = 0;
    state.jumpQueued = false;
    state.majorMagicQueued = null;
    state.specialUltimateQueued = false;
    state.interactQueued = false;

    if (state.dropReleasedAt !== null) {
      state.dropPressedAt = null;
      state.dropReleasedAt = null;
    }

    return snapshot;
  },

  clearMove() {
    state.moveX = 0;
    state.moveY = 0;
  },
};
