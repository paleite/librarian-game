import { z } from "zod";

import { minorMagicIds } from "@/game/content/abilities";
import { secretKeyIds } from "@/game/content/secrets";

const Transform3Schema = z.object({
  position: z.tuple([z.number(), z.number(), z.number()]),
  rotation: z.tuple([z.number(), z.number(), z.number()]),
});

const BookLocationSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("spawn"),
    slotId: z.string().min(1),
  }),
  z.object({
    kind: z.literal("carried"),
    index: z.number().int().nonnegative(),
  }),
  z.object({
    kind: z.literal("shelf"),
    rowId: z.string().min(1),
    index: z.number().int().nonnegative(),
  }),
  z.object({
    kind: z.literal("dropped"),
    transform: Transform3Schema,
  }),
]);

const RunIdentitySchema = z.object({
  seed: z.string().min(1),
  catalogVersion: z.number().int().positive(),
  layoutVersion: z.number().int().positive(),
});

const MajorMagicLevelsSchema = z.object({
  sort: z.number().int().min(0).max(5),
  "shelf-guide": z.number().int().min(0).max(10),
  insight: z.number().int().min(0).max(10),
  "auto-shelving": z.number().int().min(0).max(10),
  assemble: z.number().int().min(0).max(10),
});

export const SavePayloadSchema = z.object({
  saveVersion: z.literal(6),
  savedAt: z.string().datetime(),
  state: z.object({
    phase: z.enum(["title", "sorting", "completed"]),
    runIdentity: RunIdentitySchema.nullable(),
    bookLocations: z.record(z.string(), BookLocationSchema),
    carriedBookIds: z.array(z.string()),
    collectedKeyIds: z.array(z.enum(secretKeyIds)),
    openedSecretChestIds: z.array(z.enum(secretKeyIds)),
    majorMagicLevels: MajorMagicLevelsSchema,
    shelfGuideActiveUntil: z.number().nonnegative(),
    insightActiveUntil: z.number().nonnegative(),
    majorMagicReadyAt: z.object({
      sort: z.number().nonnegative(),
      "shelf-guide": z.number().nonnegative(),
      insight: z.number().nonnegative(),
      "auto-shelving": z.number().nonnegative(),
      assemble: z.number().nonnegative(),
    }),
    autoShelvingActiveUntil: z.number().nonnegative(),
    unlockedMinorMagicIds: z.array(z.enum(minorMagicIds)),
    elapsedMilliseconds: z.number().int().nonnegative(),
    majorMagicUsageCount: z.number().int().nonnegative(),
    cozyMode: z.boolean(),
    autosaveEnabled: z.boolean(),
  }),
});

export type SavePayload = z.infer<typeof SavePayloadSchema>;
