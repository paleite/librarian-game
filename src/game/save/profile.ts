import {
  achievementIds,
  type AchievementId,
} from "@/game/content/achievements";

const PROFILE_STORAGE_KEY = "librarian-game.profile";
export const ACHIEVEMENT_UNLOCKED_EVENT = "librarian-game:achievement-unlocked";

export interface ProfileState {
  specialStageUnlocked: boolean;
  unlockedAchievementIds: AchievementId[];
}

const defaultProfileState: ProfileState = {
  specialStageUnlocked: false,
  unlockedAchievementIds: [],
};

function sanitizeAchievementIds(value: unknown): AchievementId[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const allowed = new Set<string>(achievementIds);

  return [...new Set(
    value.filter(
      (id): id is AchievementId =>
        typeof id === "string" && allowed.has(id),
    ),
  )];
}

export function readProfileState(): ProfileState {
  if (typeof window === "undefined") {
    return defaultProfileState;
  }

  const serialized = window.localStorage.getItem(PROFILE_STORAGE_KEY);

  if (!serialized) {
    return defaultProfileState;
  }

  try {
    const parsed = JSON.parse(serialized) as Partial<ProfileState>;

    return {
      specialStageUnlocked: parsed.specialStageUnlocked === true,
      unlockedAchievementIds: sanitizeAchievementIds(
        parsed.unlockedAchievementIds,
      ),
    };
  } catch {
    return defaultProfileState;
  }
}

function writeProfileState(profile: ProfileState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function unlockSpecialStage(): void {
  const profile = readProfileState();

  if (profile.specialStageUnlocked) {
    return;
  }

  writeProfileState({
    ...profile,
    specialStageUnlocked: true,
  });
}

export function unlockAchievements(
  achievementIdsToUnlock: readonly AchievementId[],
): AchievementId[] {
  if (typeof window === "undefined" || achievementIdsToUnlock.length === 0) {
    return [];
  }

  const profile = readProfileState();
  const unlockedSet = new Set(profile.unlockedAchievementIds);
  const newlyUnlocked: AchievementId[] = [];

  for (const achievementId of achievementIdsToUnlock) {
    if (unlockedSet.has(achievementId)) {
      continue;
    }

    unlockedSet.add(achievementId);
    newlyUnlocked.push(achievementId);
  }

  if (newlyUnlocked.length === 0) {
    return [];
  }

  writeProfileState({
    ...profile,
    unlockedAchievementIds: [...unlockedSet],
  });

  for (const achievementId of newlyUnlocked) {
    window.dispatchEvent(
      new CustomEvent<AchievementId>(ACHIEVEMENT_UNLOCKED_EVENT, {
        detail: achievementId,
      }),
    );
  }

  return newlyUnlocked;
}
