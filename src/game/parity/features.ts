export type ParityStatus = "missing" | "partial" | "matched";

export interface FeatureParity {
  id: string;
  sourceFeature: string;
  sourceBehavior: string;
  cloneBehavior: string;
  status: ParityStatus;
  evidence: string;
}

export const featureParity: readonly FeatureParity[] = [
  {
    id: "library-scale",
    sourceFeature: "Full library scale",
    sourceBehavior: "Two floors, 31 sections, 400 series, and 3,072 physical volumes.",
    cloneBehavior: "31 sections, 400 authored series, 3,072 derived physical volumes, deterministic run generation, and a two-floor browser scene exist. Exact geometry/art parity is still being tuned.",
    status: "partial",
    evidence: "Public source-game catalog and map index.",
  },
  {
    id: "book-handling",
    sourceFeature: "Manual book handling",
    sourceBehavior: "Inspect, pick up, carry, reorder, drop, and shelve volumes.",
    cloneBehavior: "Pickup, carrying, reorder actions, single/stack drop, shelf placement, and instanced rendering are implemented; inspection UI and final feedback polish remain.",
    status: "partial",
    evidence: "Source-game controls and player guides.",
  },
  {
    id: "row-validation",
    sourceFeature: "Correct row validation",
    sourceBehavior: "A series must be together, in the correct section, and numerically ordered.",
    cloneBehavior: "Row correctness is derived from same-series, complete-volume, correct-section, and numerical-order rules and drives live progress.",
    status: "partial",
    evidence: "Source-game shelf guides and completion behavior.",
  },
  {
    id: "major-magic",
    sourceFeature: "Five Major Magic abilities",
    sourceBehavior: "Sort, Shelf Guide, Insight, Auto-Shelving, and Assemble reduce existing sorting friction.",
    cloneBehavior: "Canonical ability definitions exist. Ability actions are pending.",
    status: "partial",
    evidence: "Source-game ability documentation and guides.",
  },
  {
    id: "minor-magic",
    sourceFeature: "Four hidden Minor Magic upgrades",
    sourceBehavior: "Four fixed keys unlock high jump, sprint, and two carry-capacity upgrades.",
    cloneBehavior: "All four keys/chests are interactive and unlock sprint, high jump, +3 capacity, and +2 capacity. Exact world transforms remain parity-tuning data.",
    status: "partial",
    evidence: "Independent key-location guides.",
  },
  {
    id: "recall-stone",
    sourceFeature: "Recall Stone",
    sourceBehavior: "Recovers remaining unshelved or unreachable books during late cleanup.",
    cloneBehavior: "Interactive Recall Stone gathers remaining non-shelved books when 20 or fewer remain.",
    status: "partial",
    evidence: "Source-game update notes and guide documentation.",
  },
  {
    id: "save-load",
    sourceFeature: "Manual saves, autosave, and multiple slots",
    sourceBehavior: "Players can save/load and toggle autosave.",
    cloneBehavior: "Versioned Zod-validated browser saves and a quick save/load slot are implemented. Multiple-slot UI and autosave remain.",
    status: "partial",
    evidence: "Source-game 1.0.12 update behavior.",
  },
  {
    id: "cozy-mode",
    sourceFeature: "Cozy Gameplay",
    sourceBehavior: "Supports a low-pressure presentation with time/lighting differences.",
    cloneBehavior: "Pending.",
    status: "missing",
    evidence: "Source-game settings and guide documentation.",
  },
  {
    id: "challenge-runs",
    sourceFeature: "Challenge completion conditions",
    sourceBehavior: "Supports sub-three-hour, no-Major-Magic, and zero-correct-row routes.",
    cloneBehavior: "Pending.",
    status: "missing",
    evidence: "Source-game achievement conditions.",
  },
  {
    id: "special-stage",
    sourceFeature: "Special Stage",
    sourceBehavior: "Post-completion mode with an ultimate automated clear payoff.",
    cloneBehavior: "Pending.",
    status: "missing",
    evidence: "Source-game post-game and achievement documentation.",
  },
];
