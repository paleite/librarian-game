import { SavePayloadSchema, type SavePayload } from "./schema";

const SAVE_KEY_PREFIX = "librarian-game.save.";
const SLOT_ID_PATTERN = /^[a-z0-9-]{1,32}$/;

function getStorage(): Storage {
  if (typeof window === "undefined") {
    throw new Error("Save storage is only available in the browser");
  }

  return window.localStorage;
}

function getSaveKey(slotId: string): string {
  if (!SLOT_ID_PATTERN.test(slotId)) {
    throw new Error(`Invalid save slot id: ${slotId}`);
  }

  return `${SAVE_KEY_PREFIX}${slotId}`;
}

export function writeSaveSlot(slotId: string, payload: SavePayload): void {
  const validatedPayload = SavePayloadSchema.parse(payload);
  getStorage().setItem(getSaveKey(slotId), JSON.stringify(validatedPayload));
}

export function readSaveSlot(slotId: string): SavePayload | null {
  const serialized = getStorage().getItem(getSaveKey(slotId));

  if (serialized === null) {
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(serialized);
  } catch {
    throw new Error(`Save slot ${slotId} does not contain valid JSON`);
  }

  return SavePayloadSchema.parse(parsed);
}

export function deleteSaveSlot(slotId: string): void {
  getStorage().removeItem(getSaveKey(slotId));
}

export function listSaveSlotIds(): string[] {
  const storage = getStorage();
  const slotIds: string[] = [];

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);

    if (!key?.startsWith(SAVE_KEY_PREFIX)) {
      continue;
    }

    const slotId = key.slice(SAVE_KEY_PREFIX.length);

    if (SLOT_ID_PATTERN.test(slotId)) {
      slotIds.push(slotId);
    }
  }

  return slotIds.sort();
}
