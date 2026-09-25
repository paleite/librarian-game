import { z } from "zod";

export const FloorSchema = z.union([z.literal(1), z.literal(2)]);

export const SectionCodeSchema = z.string().regex(/^[12][A-Q]$/);

export const SectionSchema = z.object({
  code: SectionCodeSchema,
  floor: FloorSchema,
  name: z.string().min(1),
  colorFamily: z.string().min(1),
});

export const VolumeCountSchema = z.union([
  z.literal(3),
  z.literal(5),
  z.literal(10),
]);

export const BookSeriesSchema = z.object({
  id: z.string().regex(/^[12][a-q]-\d{2}$/),
  sectionCode: SectionCodeSchema,
  title: z.string().min(1),
  volumeCount: VolumeCountSchema,
  visualFamily: z.string().min(1),
});

export type Floor = z.infer<typeof FloorSchema>;
export type SectionCode = z.infer<typeof SectionCodeSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type BookSeries = z.infer<typeof BookSeriesSchema>;
