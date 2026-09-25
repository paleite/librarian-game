export const tutorialSeriesId = "1a-08";

export const tutorialBookIds = Array.from({ length: 10 }, (_, index) =>
  `${tutorialSeriesId}:${String(index + 1).padStart(2, "0")}`,
);

export const tutorialSpawnSlotIds = Array.from({ length: 10 }, (_, index) =>
  `tutorial-monsterology-${String(index + 1).padStart(2, "0")}`,
);

export const fixedTutorialBookPlacements = tutorialBookIds.map(
  (bookId, index) => ({
    bookId,
    slotId: tutorialSpawnSlotIds[index],
  }),
);
