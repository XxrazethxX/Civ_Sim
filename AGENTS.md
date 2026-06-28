# Kingdoms — Required Agent Instructions

## Read before changing code
1. `docs/design/KINGDOMS_GAME_BIBLE.md`
2. `docs/technical/architecture.md`
3. `docs/technical/implementation-status.md`
4. `docs/tasks/current-task.md`
5. Any system-specific source documents named by the current task.

Inspect the existing implementation before proposing structural changes.

## Non-negotiable engineering rules
- Preserve gameplay mechanics, balance, progression, resource flows, save compatibility, and startup behavior unless the task explicitly authorizes a mechanics or data migration.
- Do not duplicate simulation math in UI code.
- Keep UI/presentation state separate from simulation state unless the task explicitly documents a safe persistence strategy.
- Do not add frameworks, external dependencies, or a TypeScript migration without explicit approval.
- Preserve existing DOM IDs, event contracts, source-to-bundle workflow, and generated compatibility bundle unless the task explicitly changes them.
- Use the authoritative audio integration specification at `assets/KINGDOM_IDLE_AUDIO_CODEX_INTEGRATION_SPEC_V1_2.md` for any audio work. Do not substitute unknown files, raw paths scattered through code, or procedural replacements.
- Do not silently change player-facing naming, progression rules, or design decisions recorded in the Game Bible.

## Workflow
- Work on a feature branch and open a pull request; do not merge without user approval.
- Make changes small, coherent, and reviewable.
- Update `docs/technical/implementation-status.md` whenever a task materially changes the implementation.
- In the pull request summary, report changed files, validation performed, known risks, and follow-up work.
