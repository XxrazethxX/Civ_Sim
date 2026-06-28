# Kingdoms

A browser-based civilization simulation about guiding history rather than controlling it.

> Today's empire is tomorrow's ruins.

## Local Structure

- `index.html` is the browser entry point.
- `systems/game.js` is the main source runtime.
- `systems/game.bundle.js` is the generated browser bundle loaded by `index.html`.
- `systems/*.js` contains system modules for state, buildings, population, military, trade, religion, UI, and simulation helpers.
- `assets/` contains seasonal art and music assets.
- `docs/` contains design, technical, and task notes.

## Development

Regenerate the browser bundle after source edits:

```bash
node systems/build-bundle.mjs
```
