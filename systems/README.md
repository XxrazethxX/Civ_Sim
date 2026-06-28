# Woodstock Systems Split

The game boots from `index.html` through `systems/game.bundle.js`, a compatibility bundle generated from the source modules. This keeps direct file opening and simple local servers working while the source remains split into real system files.

Current module boundaries:

1. `state.js` - saveable state conventions, balance snapshots, pacing snapshots.
2. `buildings.js` - building/build-queue helpers and ownership boundary.
3. `population.js` - canonical worker records: `{ id, age, classType, job, injured }`.
4. `military.js` - raid/conquest ownership boundary and force summaries.
5. `trade.js` - market/trade ownership boundary.
6. `religion.js` - law/deity/faith ownership boundary.
7. `ui.js` - render scheduling, tooltip normalization, UI-only helpers.
8. `simulation.js` - pacing harness for population milestones.
9. `registry.js` - module manifest exposed at `window.WOODSTOCK_SYSTEMS`.

The remaining large compatibility runtime lives in `game.js` while the systems are extracted. The checked-in bundle is generated from these module files so the game does not blank out when opened outside an ES module server.

Dev/test entry points:

- `window.WOODSTOCK_SYSTEMS` shows the active module registry.
- `window.WOODSTOCK_RUN_PACING_TEST()` runs the 10, 50, 200, 500, and 2000 population pacing harness from the browser console.

Run with `node systems/dev-server.mjs`, then open `http://127.0.0.1:5173/`. Directly opening `index.html` also works because `game.bundle.js` is a classic browser script.

After editing source modules, regenerate `systems/game.bundle.js` from the module files before playtesting:

```powershell
node systems/build-bundle.mjs
```
