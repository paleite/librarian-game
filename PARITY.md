# Librarian clone parity checklist

This is the canonical implementation tracker. Check boxes are updated as features land and pass the normal pnpm/typecheck/lint/static-export pipeline.

## Foundation
- [x] Next.js static export on GitHub Pages
- [x] pnpm + frozen-lockfile CI
- [x] React Three Fiber + Rapier runtime
- [x] Desktop first-person controls
- [x] Mobile/touch controls with joystick, swipe-look, Use/Jump/Drop/Magic
- [x] Responsive mobile HUD/menu and coarse-pointer render profile
- [x] Global text selection/touch-callout disabled

## Library/catalog
- [x] 31 sections
- [x] 400 series
- [x] 3,072 physical book instances
- [x] Fixed spawn slots + shuffled ordinary assignments
- [x] Fixed ten-volume tutorial Monsterology placement
- [x] Two-floor traversable library shell
- [x] Shelf furniture generated from semantic row transforms
- [x] Section plaques and floor directory maps
- [x] Stable per-series book colors
- [x] Physical title + volume labels on nearby/carried books
- [ ] Tune exact library geometry/art against source screenshots/video
- [ ] Tune exact fixed secret/key/chest transforms

## Core sorting loop
- [x] Inspect title/volume
- [x] Pick up/carry/reorder/drop
- [x] Hold-drop full carried stack
- [x] 3/5/10 shelf row capacities
- [x] Correct-section / exact-placement / wrong-section feedback
- [x] Correct-row validation and 400-row progress
- [x] Completed-section blue plaque state
- [x] Center-ray mobile interaction
- [x] Source-like generated pickup/place/row-complete feedback audio
- [ ] Add source-like book pickup/carry/place motion polish
- [ ] Tune interaction ranges/sensitivities from device/browser playtesting

## Minor Magic / secrets
- [x] Crimson / Golden / Emerald / Azure keys
- [x] Matching chests
- [x] High Jump
- [x] Sprint
- [x] Carry +3
- [x] Carry +2
- [x] Recall Stone at <=20 unshelved books
- [x] Secret/Recall feedback cues

## Major Magic
- [x] Sort
- [x] Shelf Guide
- [x] Insight
- [x] Auto-Shelving
- [x] Assemble
- [x] Hotkeys + mobile controls
- [x] Per-spell levels / max levels
- [x] Tab/touch upgrade UI
- [x] Known row-to-point thresholds through row 55
- [x] Source-backed level-1/max timing endpoints isolated in tuning data
- [ ] Verify and encode later row-to-point thresholds
- [ ] Verify and encode exact intermediate per-level cooldown/active timings
- [ ] Tune spell visuals/audio to source behavior

## Saves / presentation
- [x] Versioned Zod save payload
- [x] Three manual slots
- [x] Autosave slot
- [x] Row-completion autosave
- [x] Save compatibility guards
- [x] Cozy mode hides timer
- [x] Cozy mode keeps daytime lighting
- [x] Normal dynamic day/night + lamps
- [ ] Verify exact day/night transition timing
- [ ] Polish save-slot UX to match source more closely

## Completion / progression
- [x] Elapsed normal-run timer
- [x] Exit-door completion flow
- [x] Under-three-hours condition
- [x] No-Major-Magic condition
- [x] 3,072-shelved / 0-correct-row condition
- [x] Persistent achievement profile
- [x] Achievement unlock toasts
- [x] Achievement gallery
- [x] Special Stage profile unlock
- [x] Special Stage Ultimate on Z/mobile
- [x] Special Stage kept separate from normal clear time
- [ ] Verify Principal rank names/threshold logic and implement evaluation
- [ ] Verify exact Special Stage Ultimate timing/visual sequence

## Visual/audio parity still to close
- [x] Stable book colors across runs
- [x] Titles/volume numbers printed on physical books
- [x] Generated shelf/furniture geometry
- [x] Generated functional SFX cues without copying source audio assets
- [ ] Tune exact cover/spine visual families per category/series
- [ ] Add source-like ambient/BGM progression with original audio
- [ ] Match final environment lighting/material/prop treatment

## Rule for unchecked source-data items
Do not invent missing source values. Keep uncertain timing/threshold/transform data isolated and marked provisional until verified from source material, public guides, screenshots/video, or game data.

