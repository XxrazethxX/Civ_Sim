# Kingdoms Repository Inventory

Last checked: 2026-06-28

## Confirmed implementation files
- `index.html` is present and is the browser entry point.
- `systems/game.js` is present and imports existing registry, state, population, UI, simulation, and village-theme modules.
- `README.md` confirms the source-to-bundle workflow with `systems/game.bundle.js` and `node systems/build-bundle.mjs`.

## Documentation files
- `AGENTS.md`
- `docs/design/KINGDOMS_GAME_BIBLE.md`
- `docs/technical/architecture.md`
- `docs/technical/implementation-status.md`
- `docs/technical/testing.md`
- `docs/tasks/current-task.md`

## Asset caveat
The repository does not currently contain `assets/KINGDOM_IDLE_AUDIO_CODEX_INTEGRATION_SPEC_V1_2.md`. This does not block the current UI Foundation Refactor I, which explicitly excludes audio work. Add the supplied V1.2 audio package and its specification before any audio-integration task.
