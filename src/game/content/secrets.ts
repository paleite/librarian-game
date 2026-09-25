import type { MinorMagicId } from "./abilities";

export type SecretKeyId =
  | "crimson-octagon"
  | "golden-diamond"
  | "emerald-club"
  | "azure-star";

export interface SecretDefinition {
  keyId: SecretKeyId;
  keyLocationId: string;
  chestLocationId: string;
  rewardId: MinorMagicId;
  note?: string;
}

export const secretDefinitions: readonly SecretDefinition[] = [
  {
    keyId: "crimson-octagon",
    keyLocationId: "first-floor-stair-crest",
    chestLocationId: "second-floor-warrior-crimson-chest",
    rewardId: "high-jump",
  },
  {
    keyId: "golden-diamond",
    keyLocationId: "stair-railing-right-white-pot",
    chestLocationId: "second-floor-archery-golden-chest",
    rewardId: "carry-capacity-3",
  },
  {
    keyId: "emerald-club",
    keyLocationId: "first-floor-bench-book-pile-near-scales",
    chestLocationId: "second-floor-warrior-emerald-chest",
    rewardId: "sprint",
    note: "A readable note is placed beside this key in the source game.",
  },
  {
    keyId: "azure-star",
    keyLocationId: "second-floor-top-of-2o-bookcase",
    chestLocationId: "second-floor-archery-azure-chest",
    rewardId: "carry-capacity-2",
  },
];
