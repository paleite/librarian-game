"use client";

import { useSyncExternalStore } from "react";

export type TutorialId = "stack-drop" | "recall-stone";

const STORAGE_KEY = "librarian-game.dismissed-tutorials";
const CHANGED_EVENT = "librarian-game:tutorial-state-changed";

function readDismissedIds(): TutorialId[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]",
    ) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (value): value is TutorialId =>
        value === "stack-drop" || value === "recall-stone",
    );
  } catch {
    return [];
  }
}

function serializeDismissedIds(): string {
  return JSON.stringify(readDismissedIds().sort());
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGED_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(CHANGED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function dismissTutorial(id: TutorialId): void {
  if (typeof window === "undefined") {
    return;
  }

  const dismissed = new Set(readDismissedIds());
  dismissed.add(id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...dismissed]));
  window.dispatchEvent(new Event(CHANGED_EVENT));
}

export function useDismissedTutorials(): readonly TutorialId[] {
  const serialized = useSyncExternalStore(
    subscribe,
    serializeDismissedIds,
    () => "[]",
  );

  return JSON.parse(serialized) as TutorialId[];
}
