import { z } from "zod";

import { FloorSchema, SectionCodeSchema } from "@/game/catalog/schema";

export const SectionPlacementSchema = z.object({
  sectionCode: SectionCodeSchema,
  floor: FloorSchema,
  zone: z.enum(["left", "right", "back"]),
  routeOrder: z.number().int().nonnegative(),
});

export const FixedLocationSchema = z.object({
  id: z.string().min(1),
  floor: FloorSchema,
  description: z.string().min(1),
});

export const LibraryTopologySchema = z.object({
  sections: SectionPlacementSchema.array().length(31),
  fixedLocations: FixedLocationSchema.array(),
});

export type SectionPlacement = z.infer<typeof SectionPlacementSchema>;
export type FixedLocation = z.infer<typeof FixedLocationSchema>;
export type LibraryTopology = z.infer<typeof LibraryTopologySchema>;
