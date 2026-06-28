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
- UI needs restructuring before deep government, factions, leaders, occupation, rebellion, or million-scale population systems are added.

## Approved but not yet implemented
1. UI Foundation Refactor I.
2. Main Page / Realm Tableau progression.
3. Split population simulation for high-scale population.
4. Politics and influence campaigns.
5. V1.2 audio integration using the supplied asset contract.

## Current task
`docs/tasks/current-task.md` is ready for Codex.

## Update protocol
After a task is merged, update this file with:
- completed scope;
- touched modules and migrations;
- checks actually run;
- known limitations or regressions;
- the next recommended task.
