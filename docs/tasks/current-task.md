# Current Task — UI Foundation Refactor I

**Status:** Ready for Codex.

## Read first
- `AGENTS.md`
- `docs/design/KINGDOMS_GAME_BIBLE.md`, especially UI sections and Technical section 5.7.
- `docs/technical/architecture.md`
- `docs/technical/testing.md`
- `docs/technical/repository-inventory.md`

## Goal
Establish the reusable UI foundation without changing simulation mechanics, balance, resource flows, progression thresholds, saves, raids, construction, jobs, religion, trade, or other gameplay rules.

## Required scope
- Build a semantic responsive app shell: sticky header, progressive navigation container, sticky resource/time strip, main workspace, desktop Inspector dock, and non-destructive Chronicle region.
- Preserve early manual Food, Wood, and Stone gathering. Existing early resource cards remain actionable while gaining support for a future compact presentation.
- Create a reusable Inspector API and host. Move safe ordinary resource/dashboard details to the Inspector. Keep Help, Options, Achievements, full event history, major commitments, and severe confirmations in their existing modal/page model.
- Wrap existing Main-page panels in Dynamic Overview Card containers without deleting working behavior: Settlement Summary, seasonal World Overview / Realm Tableau, Population and Labor, Well-Being, Active Effects, Recent Events, worker controls, and hiring controls.
- Keep current progressive tab unlock logic. Do not render fake empty future systems.
- Add responsive and accessible behavior: focused Inspector lifecycle, Escape close, mobile full-screen Inspector or expanded sheet, no hover-only information, no narrow-screen horizontal overflow.

## Explicit exclusions
- No new framework, dependency, TypeScript migration, backend, audio integration, gameplay-system redesign, balance change, save migration, or asset replacement.
- Do not duplicate simulation math in presentation code.

## Required verification
Run and document the checks in `docs/technical/testing.md`.

## Completion report
In the pull request, state changed files, verification actually run, known risks, and the next recommended task.
