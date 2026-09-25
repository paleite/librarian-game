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
    cloneBehavior: "31 sections, 400 authored series, 3,072 derived physical volumes, fixed physical spawn slots, shuffled ordinary assignments, the fixed ten-book tutorial series, and a two-floor browser scene exist. Exact geometry/art parity is still being tuned.",
    status: "partial",
    evidence: "Public source-game catalog and map index.",
  },
  {
    id: "book-handling",
    sourceFeature: "Manual book handling",
    sourceBehavior: "Inspect, pick up, carry, reorder, drop, and shelve volumes.",
    cloneBehavior: "Pickup, carrying, reorder actions, single/stack drop, shelf placement, title/volume inspection, placement preview, and instanced rendering are implemented. Final animation/audio polish remains.",
    status: "partial",
    evidence: "Source-game controls and player guides.",
  },
  {
    id: "row-validation",
    sourceFeature: "Correct row validation",
    sourceBehavior: "A series must be together, in the correct section, and numerically ordered.",
    cloneBehavior: "Row correctness is derived from same-series, complete-volume, correct-section, and numerical-order rules; exact/correct-section/wrong-section placement cues and blue completed-section plaques are implemented.",
    status: "partial",
    evidence: "Source-game shelf guides and completion behavior.",
  },
  {
    id: "major-magic",
    sourceFeature: "Five Major Magic abilities",
    sourceBehavior: "Sort, Shelf Guide, Insight, Auto-Shelving, and Assemble reduce existing sorting friction.",
    cloneBehavior: "All five spell effects, hotkeys, per-spell levels, a Tab upgrade screen, known row-to-point thresholds through row 55, cooldown endpoint tuning, and active windows are implemented. Intermediate cooldown interpolation and later point thresholds remain provisional/unsourced.",
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
    cloneBehavior: "Versioned Zod-validated browser saves, three manual slots, an autosave slot, and row-completion autosave are implemented.",
    status: "partial",
    evidence: "Source-game 1.0.12 update behavior.",
  },
  {
    id: "cozy-mode",
    sourceFeature: "Cozy Gameplay",
    sourceBehavior: "Supports a low-pressure presentation with time/lighting differences.",
    cloneBehavior: "Cozy mode hides the timer and normal run timing is tracked separately from Special Stage. Source-backed always-day lighting behavior is not yet implemented.",
    status: "partial",
    evidence: "Source-game settings and guide documentation.",
  },
  {
    id: "challenge-runs",
    sourceFeature: "Challenge completion conditions",
    sourceBehavior: "Supports sub-three-hour, no-Major-Magic, and zero-correct-row routes.",
    cloneBehavior: "Normal completion records elapsed time and Major Magic usage and reports the documented under-three-hours, no-Major-Magic, and zero-correct-row completion conditions. Principal rank thresholds remain intentionally unimplemented.",
    status: "partial",
    evidence: "Source-game achievement conditions.",
  },
  {
    id: "special-stage",
    sourceFeature: "Special Stage",
    sourceBehavior: "Post-completion mode with an ultimate automated clear payoff.",
    cloneBehavior: "Normal completion persists a profile unlock, the title menu exposes Special Stage, Z starts the Ultimate Skill, and books are automatically placed over a ten-minute window before the separate Special Stage completion state.",
    status: "partial",
    evidence: "Source-game post-game and achievement documentation.",
  },
];
