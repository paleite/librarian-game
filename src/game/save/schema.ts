import { z } from "zod";

import { majorMagicIds, minorMagicIds } from "@/game/content/abilities";
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

export const SavePayloadSchema = z.object({
  saveVersion: z.literal(1),
  savedAt: z.string().datetime(),
  state: z.object({
    phase: z.enum(["title", "sorting", "completed"]),
    runIdentity: RunIdentitySchema.nullable(),
    bookLocations: z.record(z.string(), BookLocationSchema),
    carriedBookIds: z.array(z.string()),
    collectedKeyIds: z.array(z.enum(secretKeyIds)),
    unlockedMajorMagicIds: z.array(z.enum(majorMagicIds)),
    unlockedMinorMagicIds: z.array(z.enum(minorMagicIds)),
    elapsedMilliseconds: z.number().int().nonnegative(),
    majorMagicUsageCount: z.number().int().nonnegative(),
    cozyMode: z.boolean(),
  }),
});

export type SavePayload = z.infer<typeof SavePayloadSchema>;
