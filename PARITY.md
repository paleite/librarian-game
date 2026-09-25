# Librarian clone parity checklist

This checklist tracks **player-facing parity with _Librarian: Tidy Up the Arcane Library!_**.

A box is checked only when the source-game behavior/content/presentation is implemented closely enough to count as parity. Having the underlying architecture or a rough functional substitute is not enough.

Project-specific additions such as mobile controls, Next.js, GitHub Pages, and pnpm are tracked separately at the bottom and do **not** count toward source-game parity.

## 1. Library world and layout

- [x] One persistent two-floor library
- [x] 31 category sections: 1A–1N and 2A–2Q
- [x] 3,072 physical volumes
- [x] 400 series/rows represented in game data
- [x] Fixed physical spawn positions
- [x] Ordinary book identities shuffled across fixed positions per run
- [x] Fixed ten-volume tutorial Monsterology series placement
- [x] Traversable staircase between floors
- [x] Shelf furniture generated at the semantic shelf positions
- [x] Section plaques exist in-world
- [ ] Reconstruct the library's actual room proportions, shelf placement, stairs, tables, benches, pots, crest, scale, wall treatment, props, and circulation from source screenshots/video
- [ ] Match shelf/bookcase dimensions and row spacing to the source
- [ ] Match first-floor and second-floor section locations to the source maps precisely
- [ ] Match starting position/front-door area to the source
- [ ] Match the exact locations/appearance of the Recall Stone and other fixed interactables
- [ ] Match the exact locations/appearance of all four keys and their chests

## 2. Source categorization maps and wayfinding

- [x] Functional section directory information exists
- [x] Section code/name plaques exist
- [x] Completed sections can visibly indicate completion
- [ ] Recreate the source-like illustrated floor categorization/map board that shows where each book category belongs
- [ ] Put the categorization maps in the correct staircase locations/orientations
- [ ] Make the maps readable at normal in-world viewing distance
- [ ] Match the source map's visual grouping/layout rather than only listing section names
- [ ] Verify first-floor map presentation against the post-v1.0.5 source behavior

## 3. Book catalog, appearance, and classification clues

- [x] 400 series with 3/5/10-volume structures represented
- [x] Volume numbers represented
- [x] Book title + volume information available
- [x] Stable visual identity per series across runs
- [x] All volumes in a series share the same stable visual family
- [x] Physical title/volume labels render on nearby/carried books
- [ ] Verify all per-section series counts and 3/5/10-volume distributions against the source catalog
- [ ] Verify the 400 series/title catalog against the source
- [ ] Match source-like cover/spine visual families by category
- [ ] Match recurring source motifs/marks used as classification clues
- [ ] Preserve intentional color overlap between categories; color must remain a clue rather than a category ID
- [ ] Match title typography/placement/volume-number presentation closely
- [ ] Match physical book dimensions, spine orientation, stacks, rotations, and clutter density to the source
- [ ] Verify the fixed tutorial books' exact positions/order

## 4. Inspect / carry / drop interaction

- [x] Pick up books
- [x] Starting carry capacity of 10
- [x] Carry stack state
- [x] Reorder carried books
- [x] Drop a single carried book
- [x] Hold Drop to lay down the whole carried stack
- [x] Dropped books remain in-world
- [x] Carried-book stack has motion/sway rather than hard snapping
- [x] Dropped/shelved book transforms settle rather than hard snapping
- [ ] When aiming at a book, show the source-like title/volume interaction information
- [ ] While carrying a book, persistently show its title/volume in the source-like bottom widget
- [ ] When aiming at interactable objects, show their names/actions consistently
- [ ] Match source pickup/carry/drop animation timing and offsets
- [ ] Match source interaction distance and aim tolerance
- [ ] Match source stack-drop spacing/orientation more precisely

## 5. Shelving and correctness feedback

- [x] A complete series is all volumes together
- [x] Numerical volume order is required
- [x] Correct category/section is required
- [x] Series are not alphabetized
- [x] Series are not hard-bound to one specific title slot; compatible rows within a category can be used
- [x] 3/5/10-volume row capacities are represented
- [x] Correct-row count is derived rather than stored manually
- [x] 400-row progress exists
- [x] Wrong-section placement produces no success state
- [x] Correct-section but wrong row/position can produce the weaker silver feedback
- [x] Exact placement can produce gold feedback
- [x] Completed section plaque can turn blue
- [ ] While holding a book and aiming at a shelf, show the source-like **green placement ghost/outline at the exact destination slot**
- [ ] Match silver/gold feedback duration, intensity, and presentation
- [ ] Match source row/section completion audio feedback
- [ ] Verify whether all shelf-tier flexibility and row-capacity rules exactly match source behavior
- [ ] Verify edge cases for split series, duplicates, temporarily incomplete rows, and moving already-shelved books

## 6. Minor Magic and secrets

- [x] Four colored/symbol keys represented
- [x] Four matching chests represented
- [x] Crimson reward: High Jump
- [x] Golden reward: Carry +3
- [x] Emerald reward: Sprint
- [x] Azure reward: Carry +2
- [x] Maximum carry capacity reaches 15
- [x] Minor Magic does not increment Major Magic usage
- [x] Recall Stone activates at 20 or fewer remaining unshelved books
- [x] Recall Stone only targets unshelved books
- [ ] Match Crimson key location at/under the starting crest precisely
- [ ] Match Golden key location in the stair-rail decorative pot precisely
- [ ] Match Emerald key location under the large book pile precisely
- [ ] Add/match the readable note beside the Emerald key
- [ ] Match Azure key location on the elevated second-floor shelf near 2O precisely
- [ ] Preserve the traversal dependency where Azure effectively requires High Jump
- [ ] Match chest locations around the Warrior/Archery side precisely
- [ ] Reproduce chest reward presentation (letters/potions) where source-backed
- [ ] Match key/chest interaction visuals/audio closely

## 7. Major Magic progression

- [x] Five Major Magic abilities represented
- [x] Sort
- [x] Shelf Guide
- [x] Insight
- [x] Auto-Shelving
- [x] Assemble
- [x] Sort max level 5
- [x] Other core spell max levels represented separately
- [x] Upgrade/spend-points flow exists
- [x] Known skill-point row thresholds through row 55 encoded
- [ ] Verify and encode every later row-to-point threshold
- [ ] Verify total obtainable point count against all spell max levels
- [ ] Match source upgrade-screen presentation and controls
- [ ] Confirm exact unlock/availability conditions for each ability

## 8. Major Magic behavior and timing

- [x] Sort operates on carried books
- [x] Shelf Guide identifies/highlights the destination section
- [x] Insight highlights loose matching volumes
- [x] Auto-Shelving can place compatible carried books
- [x] Assemble gathers matching loose volumes into the carried stack
- [x] Major Magic usage is counted
- [x] Source-backed level-1/max timing endpoints are isolated as data
- [ ] Verify exact effect semantics for every level of Sort
- [ ] Verify exact effect semantics/range/count for every level of Assemble
- [ ] Verify exact Auto-Shelving behavior while its active window is running
- [ ] Verify exact intermediate cooldown values per level
- [ ] Verify exact intermediate active-duration values per level
- [ ] Match spell visual effects to source
- [ ] Match spell audio to source behavior using original/non-copied assets
- [ ] Match cooldown UI and ready-state feedback

## 9. Recall / late-game cleanup

- [x] Recall Stone exists
- [x] <=20 threshold implemented
- [x] Remaining loose books can be recalled near the stairs
- [ ] Match the Recall Stone's exact physical location/model/presentation
- [ ] Match recall animation and arrival layout
- [ ] Match the source tutorial/message shown when Recall becomes relevant
- [ ] Verify behavior for unreachable/stuck vs ordinary loose books

## 10. Saving and persistence

- [x] Multiple manual save slots
- [x] Autosave slot
- [x] Autosave on newly completed rows
- [x] Versioned/validated save data
- [x] Catalog/layout compatibility guards
- [x] Rich save/load panel with empty state, timestamp, progress, time, seed, overwrite/load/delete
- [ ] Match source save-slot count/naming/presentation exactly
- [ ] Verify all source autosave triggers
- [ ] Verify whether any state currently excluded from saves should persist
- [ ] Match source new-game/load confirmation flows
- [ ] Match Steam Cloud only if/when an equivalent web-sync feature is deliberately added

## 11. Cozy mode, time, lighting, ambience

- [x] Normal elapsed run timer
- [x] Cozy mode hides the timer
- [x] Cozy mode keeps daytime lighting
- [x] Normal mode transitions toward night
- [x] Lamps become more prominent at night
- [x] Original progressive ambience/music reacts to completion progress
- [ ] Verify exact source day/night transition schedule
- [ ] Match source daylight/night color balance and lamp placement
- [ ] Match source ambience transitions as the library fills
- [ ] Match source BGM progression structure using original/non-copied music
- [ ] Verify any Cozy-mode effects on Principal evaluation
- [ ] Match source settings/accessibility options that materially affect gameplay

## 12. Completion and Principal evaluation

- [x] Completion can be submitted through the front exit
- [x] Completion records elapsed time
- [x] Completion records Major Magic usage
- [x] Completion can distinguish correct-row count
- [x] Under-three-hours condition exists
- [x] No-Major-Magic completion condition exists
- [x] All-3,072-shelved with zero correct rows condition exists
- [ ] Verify and implement Principal evaluation formula
- [ ] Verify and implement exact rank thresholds
- [ ] Reproduce documented rank labels in the correct circumstances:
  - [ ] Fired!
  - [ ] A Total Mess!
  - [ ] A Sleepy Person!
  - [ ] A Very Good Person!
  - [ ] Very Interesting!
  - [ ] The Tremendous Winner!
- [ ] Verify how keys/Minor Magic affect evaluation
- [ ] Verify how Cozy mode affects evaluation
- [ ] Verify best-time presentation/persistence
- [ ] Match completion/evaluation screen presentation

## 13. Achievements

- [x] First Step
- [x] Intermediate (50 rows)
- [x] Veteran (200 rows)
- [x] Grand (400 rows)
- [x] Novice Mage
- [x] Sage
- [x] Life Hack
- [x] Archmage condition represented
- [x] Overtime Avoider condition represented
- [x] Efficiency condition represented
- [x] Anti-Magic condition represented
- [x] You are Fired condition represented
- [x] Achievement persistence
- [x] Achievement unlock toast
- [x] Achievement gallery
- [ ] Verify every achievement condition/name against the current source build
- [ ] Ensure Archmage is actually reachable once the full Major Magic point schedule is known
- [ ] Match source achievement timing/presentation where visible in-game

## 14. Special Stage

- [x] Unlocks after normal completion
- [x] Appears from title/menu once unlocked
- [x] Separate from normal-run clear-time records
- [x] Ultimate can be started with Z
- [x] Mobile equivalent for Ultimate exists
- [x] Ultimate progressively auto-arranges books
- [ ] Verify exact Special Stage initial state/layout
- [ ] Verify exact Ultimate duration
- [ ] Verify exact Ultimate book-order/animation sequence
- [ ] Match Ultimate visuals/audio
- [ ] Verify exact completion requirement for Overtime Avoider
- [ ] Match Special Stage title/menu/completion presentation

## 15. Interaction UI parity

- [ ] Aimed book name/volume shown consistently
- [ ] Held/top carried book title/volume shown persistently
- [ ] Shelf/category name shown when aimed
- [ ] Key names shown when aimed
- [ ] Chest names/locked state shown when aimed
- [ ] Recall Stone name/state shown when aimed
- [ ] Exit name/state shown when aimed
- [ ] Green shelf-placement preview driven by the same aim target
- [ ] Remove duplicate/debug-only inspection widgets once unified interaction HUD is live
- [ ] Match source prompt positioning, sizing, typography, and fade behavior

## 16. Environment, props, materials, and presentation

- [x] Functional shelf geometry
- [x] Functional floor-directory geometry
- [x] Functional generated gameplay SFX
- [ ] Match source shelf wood/material treatment
- [ ] Match walls/floors/ceiling/stair materials
- [ ] Add/match source props: crest, pots, tables, benches, scale, book piles, lamps, signs, etc.
- [ ] Match room fog/visibility
- [ ] Match source lighting/material response
- [ ] Match source post-processing if materially visible
- [ ] Match source title screen
- [ ] Match source HUD styling
- [ ] Match source menus
- [ ] Match source fonts/iconography where legally/technically appropriate
- [ ] Replace debug-looking UI with source-like player-facing UI throughout

## 17. Audio parity

- [x] Functional original pickup cue
- [x] Functional original placement cues
- [x] Functional original row-completion cue
- [x] Functional original secret/Recall cues
- [x] Functional original achievement cue
- [x] Functional original ambient/music engine
- [ ] Match when each source cue fires
- [ ] Tune cue character/duration/intensity closer to source without copying source audio
- [ ] Add/match footsteps and movement ambience
- [ ] Add/match shelf/library environmental ambience
- [ ] Add/match Major Magic cues
- [ ] Add/match completion/Special Stage cues
- [ ] Verify whether section completion/BGM transitions need additional audio states

## 18. Source-version parity / regression checks

- [x] Hold-Drop whole-stack behavior from v1.0.13 represented
- [x] Recall threshold uses 20 rather than older 10 behavior
- [x] Tutorial Monsterology fixed-placement exception represented
- [ ] Verify parity against current source version rather than older guides where they conflict
- [ ] Verify map visibility/presentation against v1.0.5+ behavior
- [ ] Verify any later patches that changed interactions, saves, skills, or progression
- [ ] Do a complete source-vs-clone regression pass after the remaining exact-data items are implemented

---

# Project-specific additions (not source-game parity)

These are deliberate web/mobile extensions and infrastructure. They are useful, but they do not make the clone more source-accurate and therefore are excluded from parity scoring.

## Web/runtime
- [x] Next.js App Router
- [x] Static export
- [x] GitHub Pages deployment
- [x] pnpm + frozen-lockfile CI
- [x] React Three Fiber
- [x] Rapier
- [x] Browser-local persistence

## Mobile extension
- [x] Touch joystick
- [x] Swipe-look
- [x] Touch Use / Jump / Drop / Magic controls
- [x] Coarse-pointer HUD/menu
- [x] Safe-area handling
- [x] Mobile DPR/shadow reduction
- [x] Center-ray touch interaction
- [ ] Device-playtest joystick dead zone
- [ ] Device-playtest swipe sensitivity
- [ ] Device-playtest interaction range
- [ ] Tune portrait layout
- [ ] Tune landscape layout

## General web UX
- [x] Disable text selection/touch callout globally
- [ ] PWA/offline-install experience if desired

---

## Parity rules

- Do not check an item merely because a rough implementation exists.
- Check it when the observable behavior/content/presentation is close enough to the source to count as parity.
- Keep uncertain thresholds, timings, transforms, and formulas isolated as provisional data until verified.
- Do not invent source values to make the checklist look complete.
- When public sources conflict, prefer current-version evidence and record the conflict rather than silently choosing one.
