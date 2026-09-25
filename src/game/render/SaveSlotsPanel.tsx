"use client";

import { useSyncExternalStore } from "react";

import {
  deleteSaveSlot,
  readSaveSlot,
  SAVE_SLOTS_CHANGED_EVENT,
} from "@/game/save/storage";
import { getCorrectRowCount } from "@/game/rules/shelf-state";

const MANUAL_SAVE_SLOTS = ["slot-1", "slot-2", "slot-3"] as const;
const ALL_DISPLAY_SLOTS = [...MANUAL_SAVE_SLOTS, "autosave"] as const;

type DisplaySlotId = (typeof ALL_DISPLAY_SLOTS)[number];

interface SaveSlotSummary {
  slotId: DisplaySlotId;
  exists: boolean;
  savedAt: string | null;
  correctRows: number;
  elapsedMilliseconds: number;
  seed: string | null;
}

function subscribe(callback: () => void) {
  window.addEventListener(SAVE_SLOTS_CHANGED_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(SAVE_SLOTS_CHANGED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function createSnapshot(): string {
  const summaries = ALL_DISPLAY_SLOTS.map((slotId): SaveSlotSummary => {
    try {
      const payload = readSaveSlot(slotId);

      if (!payload) {
        return {
          slotId,
          exists: false,
          savedAt: null,
          correctRows: 0,
          elapsedMilliseconds: 0,
          seed: null,
        };
      }

      return {
        slotId,
        exists: true,
        savedAt: payload.savedAt,
        correctRows: getCorrectRowCount(payload.state.bookLocations),
        elapsedMilliseconds: payload.state.elapsedMilliseconds,
        seed: payload.state.runIdentity?.seed ?? null,
      };
    } catch {
      return {
        slotId,
        exists: false,
        savedAt: null,
        correctRows: 0,
        elapsedMilliseconds: 0,
        seed: null,
      };
    }
  });

  return JSON.stringify(summaries);
}

function serverSnapshot() {
  return JSON.stringify(
    ALL_DISPLAY_SLOTS.map((slotId) => ({
      slotId,
      exists: false,
      savedAt: null,
      correctRows: 0,
      elapsedMilliseconds: 0,
      seed: null,
    })),
  );
}

function formatElapsed(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function formatSavedAt(value: string | null): string {
  if (!value) {
    return "Empty";
  }

  const date = new Date(value);

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function SaveSlotsPanel({
  canSave,
  onSave,
  onLoad,
  onClose,
}: {
  canSave: boolean;
  onSave: (slotId: string) => void;
  onLoad: (slotId: string) => void;
  onClose: () => void;
}) {
  const snapshot = useSyncExternalStore(
    subscribe,
    createSnapshot,
    serverSnapshot,
  );
  const summaries = JSON.parse(snapshot) as SaveSlotSummary[];

  const deleteSlot = (slotId: string) => {
    deleteSaveSlot(slotId);
  };

  return (
    <div className="pointer-events-auto absolute inset-0 z-50 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="mx-auto my-6 w-full max-w-2xl rounded-2xl border border-white/15 bg-stone-950/95 p-5 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              Save data
            </div>
            <h2 className="mt-2 text-2xl font-semibold">Library saves</h2>
          </div>
          <button
            className="min-h-11 rounded-xl border border-white/15 px-4 text-sm"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          {summaries.map((summary, index) => {
            const isAutosave = summary.slotId === "autosave";
            const label = isAutosave ? "Autosave" : `Save Slot ${index + 1}`;

            return (
              <div
                className="rounded-xl border border-white/10 bg-white/[0.035] p-4"
                key={summary.slotId}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{label}</div>
                    <div className="mt-1 text-xs text-white/45">
                      {formatSavedAt(summary.savedAt)}
                    </div>
                  </div>

                  {summary.exists ? (
                    <div className="text-right text-xs text-white/55">
                      <div>{summary.correctRows}/400 rows</div>
                      <div>{formatElapsed(summary.elapsedMilliseconds)}</div>
                    </div>
                  ) : (
                    <div className="text-xs text-white/35">No save data</div>
                  )}
                </div>

                {summary.exists && summary.seed ? (
                  <div className="mt-3 truncate rounded bg-black/25 px-2 py-1 font-mono text-[10px] text-white/35">
                    {summary.seed}
                  </div>
                ) : null}

                <div className="mt-3 flex flex-wrap gap-2">
                  {!isAutosave && canSave ? (
                    <button
                      className="min-h-10 rounded-lg border border-amber-300/20 bg-amber-300/[0.07] px-3 text-sm text-amber-100"
                      onClick={() => onSave(summary.slotId)}
                      type="button"
                    >
                      {summary.exists ? "Overwrite" : "Save here"}
                    </button>
                  ) : null}

                  {summary.exists ? (
                    <>
                      <button
                        className="min-h-10 rounded-lg border border-white/15 px-3 text-sm hover:bg-white/[0.06]"
                        onClick={() => onLoad(summary.slotId)}
                        type="button"
                      >
                        Load
                      </button>
                      <button
                        className="min-h-10 rounded-lg border border-red-300/15 px-3 text-sm text-red-200/70 hover:bg-red-400/[0.06]"
                        onClick={() => deleteSlot(summary.slotId)}
                        type="button"
                      >
                        Delete
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
