const PROFILE_STORAGE_KEY = "librarian-game.profile";

interface ProfileState {
  specialStageUnlocked: boolean;
}

const defaultProfileState: ProfileState = {
  specialStageUnlocked: false,
};

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
    };
  } catch {
    return defaultProfileState;
  }
}

export function unlockSpecialStage(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    PROFILE_STORAGE_KEY,
    JSON.stringify({ specialStageUnlocked: true } satisfies ProfileState),
  );
}
