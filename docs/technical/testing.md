# Kingdoms Testing Baseline

Do not mark a task complete without documenting what was actually run.

## Required workflow checks
1. Build source modules into the compatibility bundle:
   `node systems/build-bundle.mjs`
2. Start the normal browser entry point:
   `node systems/dev-server.mjs`
3. Confirm direct-browser startup remains valid.

## Core regression checks
- Fresh game starts correctly.
- Manual Food, Wood, and Stone gathering works.
- Resource rates and storage display correctly.
- Build queue and construction controls work.
- Worker jobs, labor assignment, and hiring work.
- Seasons and seasonal presentation update.
- Raids and threat handling retain their existing behavior.
- Progressive tab locking/unlocking works.
- Existing help, settings, achievements, event-history, and major commitment modals work.
- Existing saves load safely.
- Module registry and pacing harness remain available.

## UI regression checks
Test at wide desktop plus 390px and 320px widths:
- no horizontal overflow;
- keyboard focus is visible;
- all critical information is reachable without hover;
- Inspector opens and closes correctly for Food, Season, Settlement Summary, an Active Effect, and Raid Threat when available;
- Escape closes the Inspector;
- mobile Inspector uses the approved full-screen or expanded-sheet treatment;
- high-contrast, compact, and parchment modes remain readable.
