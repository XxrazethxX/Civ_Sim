# Civ Sim

A browser-based civilization and settlement simulation game.

## Local Structure

- `index.html` is the browser entry point.
- `systems/game.js` is the main source runtime.
- `systems/game.bundle.js` is the generated browser bundle loaded by `index.html`.
- `systems/*.js` contains system modules for state, buildings, population, military, trade, religion, UI, and simulation helpers.

## Development

Regenerate the browser bundle after source edits:

```bash
node systems/build-bundle.mjs
```
