# Kingdoms Architecture

## Status
Confirmed against the repository on 2026-06-28. The game source is present in this repository. See `docs/technical/repository-inventory.md` for the latest verified inventory and asset caveats.

## Runtime model
- Browser-based vanilla HTML, CSS, and JavaScript application.
- Static application shell: `index.html`.
- Source modules: `systems/`.
- Generated compatibility runtime bundle: `systems/game.bundle.js`.
- Central game runtime and most rendering/detail routing: `systems/game.js`.
- UI helpers: `systems/ui.js`.
- Current runtime imports registry, state, population, UI, simulation, and village-theme modules.
- System modules cover state, buildings, population, military, trade, religion, UI, and simulation helpers.

## Local workflow
- Build the compatibility bundle after source-module changes:
  `node systems/build-bundle.mjs`
- Run the local development server:
  `node systems/dev-server.mjs`
- Preserve direct-browser startup and the source-to-bundle workflow.

## Architectural boundaries
- Simulation modules own authoritative state, rates, progression, and consequences.
- UI modules render state and dispatch actions; they must not duplicate simulation math.
- Save compatibility is a first-class constraint. UI-only preferences should not change simulation save data unless explicitly designed and migrated.
- Stable DOM IDs and event contracts are part of the current integration surface until intentionally replaced.

## Current scalability concern
The current population implementation tracks individual worker records. Long-term scale requires the approved split model: detailed named Characters plus aggregate population groups. Do not migrate this during UI Foundation Refactor I.
