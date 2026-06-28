# Kingdoms Implementation Status

Last updated: 2026-06-28

## Repository state
- The design/Codex documentation workflow is established and merged on `main`.
- The game source is present: `index.html` is the browser entry point and `systems/game.js` is the main runtime source.
- The repository contains the source-to-bundle workflow described in `README.md`.
- The V1.2 audio integration specification is not currently present at `assets/KINGDOM_IDLE_AUDIO_CODEX_INTEGRATION_SPEC_V1_2.md`. This does not block UI Foundation Refactor I, but the full audio package must be added before audio integration work.
- See `docs/technical/repository-inventory.md` for the current verified inventory.

## Current playable foundation
- Vanilla browser civilization/idle simulation.
- Early manual gathering for Food, Wood, and Stone.
- Existing systems include buildings, population, religion, military, trade, seasons, raids, worker jobs, hiring, saves, and progressive tabs.
- UI Foundation Refactor I is implemented: semantic shell, sticky desktop chrome, dynamic overview cards, Inspector detail surface, mobile Inspector sheet, and non-destructive Chronicle region.

## Approved but not yet implemented
1. Main Page / Realm Tableau progression.
2. Split population simulation for high-scale population.
3. Politics and influence campaigns.
4. V1.2 audio integration using the supplied asset contract.

## Current task
UI Foundation Refactor I is implemented on `feat/ui-foundation-refactor-i`.

## Completed scope
- Added a reusable Inspector host/API for read-only dashboard and resource details.
- Routed safe ordinary details to the Inspector: resources, population, season, happiness/fear, dashboard stats/panels, active effect chips, and passive raid threat.
- Preserved modal/page flows for Help, Options, Achievements, full event history, job/class controls, land demolition, and active raid response.
- Added semantic app shell structure, progressive nav labeling, sticky desktop resource/status chrome, desktop Inspector dock, mobile full-screen Inspector sheet, and Chronicle region labeling.
- Wrapped Main-page dashboard panels as dynamic overview cards while preserving existing IDs and event contracts.

## Touched modules and migrations
- `index.html`: shell markup, Inspector host, responsive/sticky/Inspector styles.
- `systems/ui.js`: reusable Inspector host controller.
- `systems/game.js`: Inspector wiring, detail routing, app-shell semantics, overview card labeling.
- `systems/game.bundle.js`: regenerated compatibility bundle.
- Save migrations: none.

## Checks actually run
- `node --check systems/ui.js`
- `node --check systems/game.js`
- `node --check systems/build-bundle.mjs`
- `node systems/build-bundle.mjs`
- `node --check systems/game.bundle.js`
- `node systems/dev-server.mjs`
- Browser checks at `http://localhost:8000/` and fresh-origin `http://127.0.0.1:8000/`: startup, no console errors, starter gathering, Inspector open/close/Escape, full event history modal preservation, 390px and 320px no-overflow/mobile sheet checks, high-contrast and parchment option checks.
- Bundle contract check confirmed `window.WOODSTOCK_SYSTEMS`, `window.WOODSTOCK_RUN_PACING_TEST`, and `createInspectorHost` are present in `systems/game.bundle.js`.

## Known limitations or regressions
- The in-app browser blocks `file://` navigation, so direct-file startup could not be literally opened there. Structural direct-browser compatibility is preserved: `index.html` still loads `./systems/game.bundle.js` directly and no module loader, framework, backend, or dev-server-only dependency was added.
- Raid Threat Inspector was not exercised in a live raid/threat-visible state during browser QA because the fresh test state keeps the raid surface locked/dormant.

## Next recommended task
Main Page / Realm Tableau progression.

## Update protocol
After a task is merged, update this file with:
- completed scope;
- touched modules and migrations;
- checks actually run;
- known limitations or regressions;
- the next recommended task.
