# Kingdoms Game Bible

**Implementation-facing version:** 1.1  
**Motto:** *Today’s empire is tomorrow’s ruins.*

## Source of truth
This repository file is the implementation source of truth for Codex. The Google Doc may remain the planning copy, but approved changes must be synchronized intentionally. Do not add conflicting design rules.

## 1. Foundation
Kingdoms is a browser civilization simulation about guiding history rather than controlling it. A fragile thorp can grow into a village, town, city, kingdom, and empire. The goal is a remembered civilization, not a high score.

The player is an unseen **guiding force**, not a literal mayor, king, emperor, or deity. Leaders are in-world Characters who may age, die, be assassinated, be overthrown, or be replaced. The player remains while institutions, faiths, and empires change.

Normal-mode collapse, occupation, civil war, famine, and decline are recoverable historical setbacks. They should leave legacy: roads, ruins, old capitals, laws, religions, wonders, and dynasties.

### Core pillars
1. Living civilization.
2. Player choice matters.
3. Depth through connected systems.
4. Automation through growth.
5. Every era feels different.
6. History never disappears.
7. Strategic at every pace.
8. Power must be earned.
9. Every civilization tells a different story.
10. Multiple solutions to problems whenever practical.
11. The most interesting decision, not the most repetitive one.

### Three laws
1. **The player is the guiding force.**
2. **Influence, do not dictate.** Major outcomes are shaped through odds, preparation, legitimacy, support, and risk, not guaranteed buttons.
3. **History emerges.** Important outcomes must be understandable in hindsight, even when not deterministic.

### System rules
- Automation is delegation, not removal of gameplay.
- Direct control becomes institutional control as the realm grows.
- Randomness creates surprise but remains influenceable.
- Important outcomes explain what happened, why, and recovery paths.
- Long-term scale uses detailed named Characters plus aggregate population groups.

## 2. Politics and influence
Political action uses believable in-world mechanisms: councils, laws, appointments, patronage, gifts, honors, taxes, propaganda, investigations, spies, marriage alliances, faction support, trials, arrests, covert threats, and later appropriate covert incidents.

Major political actions are staged campaigns: planning, support-building, execution, resolution, and consequences. Capacity depends on government, offices, institutions, staff, and category; public/civic, religious, diplomatic, intelligence/covert, and military/security efforts have separate practical capacity.

Public action creates visible reaction, legitimacy effects, and diplomatic consequences. Covert action creates heat, exposure risk, and counterintelligence risk. Failure and exposure are separate. Campaigns can use mixed funding, conflict with warnings, be canceled with proportionate costs, and mature into lasting institutions.

## 3. UI and UX
### Information layers
Every major system supports:
- **Immersion:** human-readable status, icons, portraits, short language, visible place.
- **Management:** normal controls and choices.
- **Administration:** optional deep ledgers, exact modifiers, tables, histories, filters, charts.

Do not force Administration for ordinary understanding.

### Main page
The Main page evolves: Thorp/Hamlet survival command center, Village/Town Settlement Overview, City/Kingdom Realm Overview, then Realm/Province/World at empire scale.

The visual center is the **Realm Tableau**: a seasonal scene that visibly gains settlement development and escalating condition overlays. It starts as a layered vignette, later becomes a clickable settlement map, then connects to regional/world views.

Dynamic Overview Cards adapt to era, screen size, season, priority, threats, projects, and opportunities. Players may add, remove, reorder, pin, and restore ordinary cards. Critical alerts cannot be hidden through card customization.

When calm, balance Current Priority with the Realm Tableau. Current Priority begins as guidance and later becomes bounded delegation through approved institutions. It may not silently seize major commitments.

### Navigation and resources
- Early primary tabs: **Main, Buildings, Population**.
- New systems use a New marker; important systems can use a milestone card.
- Late navigation is hybrid and player-configurable: compact core tabs plus More/Administration or a vertical rail; favorites may be pinned.
- Food, Wood, and Stone remain large actionable cards while manual gathering matters, then collapse into a compact resource bar.
- Resource/time bar is sticky and responsive.
- Compact, Standard, and Detailed density presets exist; desktop and mobile layouts save separately.

### Inspector and Royal Ledger
The Inspector is the default contextual surface for a resource, building, Character, faction, event, district, landmark, or institution.
- Default right dock; player can configure dock/floating presentation, pinning, panel count, and ordinary-inspection time behavior.
- Header: icon or portrait, name, category/type.
- Routine objects are single-page; major entities may use a few simple tabs.
- Inspector is concise/moderate; Royal Ledger/spreadsheet mode owns deep tables, sorting, filters, comparisons, histories, and charts.
- Tooltips are supplemental only; critical details are click/tap reachable.
- Ordinary details use Inspector; major commitments and severe confirmations use modals.

### Alerts, advisors, access
- Alerts are severity-first and configurable. Noncritical alerts may offer **Inspect / Go to System / Snooze**.
- Main page shows one primary advisor recommendation. Material disagreement shows a **Council Divided** marker opening Council View.
- Advisors may be biased; show visible benefits/risks, traits, loyalty/faction, confidence, and known factors without exposing hidden schemes as cheat information.
- Onboarding is advisor-led/contextual with an optional tutorial panel.
- Known but unavailable actions remain visible and disabled with an explanation. Undiscovered actions may remain hidden.
- Serious or irreversible actions confirm by default; settings can reduce confirmation friction.
- Focus Mode is optional on all devices and preserves critical alerts and controls.
- Support common keyboard navigation/time shortcuts.

### Visual and accessibility standards
- Readable parchment/dark grand-strategy hybrid.
- Default presentation moves from cozy settlement to imposing institutional grand strategy. Unlocked era themes remain selectable.
- Crisis visuals begin subtly and alter the Tableau strongly only when imminent or active.
- No hover-only critical information. Preserve keyboard focus, touch targets, contrast, and narrow-screen usability.

## 4. Art and audio
Kingdoms uses an original dark-fantasy pixel-RPG sound identity, atmospheric and historical rather than limited to strict 8-bit or 16-bit timbres.

Seasonal signatures: Spring is uneasy renewal; Summer is desert/caravan with Middle Eastern influence; Fall is harvest/fire/ritual; Winter is bleak and ominous, never cheerful.

Authoritative audio contract: `assets/KINGDOM_IDLE_AUDIO_CODEX_INTEGRATION_SPEC_V1_2.md`.

Rules: one primary music track at a time; controlled crossfades; one seasonal ambience bed; contextual ambience as occasional one-shots; one specific crisis overlay; event stinger priority; no sound for each passive tick or individual battle action; stable key manifest; safe playback failure.

## 5. Technical direction
### UI Foundation Refactor I
This is the immediate approved task. Establish a reusable UI foundation without changing simulation mechanics, save data, balance, progression thresholds, resources, raids, construction, jobs, religion, trade, or other gameplay rules.

Required scope:
- responsive semantic shell;
- sticky header and resource/time strip;
- progressive navigation container;
- reusable Inspector host/API;
- Dynamic Overview wrappers around working Main-page behavior;
- desktop Inspector dock and mobile full-screen/expanded Inspector;
- focus, Escape close, no hover-only information, and no narrow-screen overflow.

No frameworks, dependencies, TypeScript, backend work, audio integration, gameplay redesign, save migration, asset replacement, or fake future tabs. Reuse current detail/presentation data and do not duplicate simulation math.

Required validation: fresh game, gathering, rates, build queue, jobs, hiring, seasons, raids, tabs, existing modal flows, saves, module registry/pacing harness, direct browser startup, and desktop/390px/320px UI checks.

## 6. Decision log summary
- 001-013: foundation, recoverable setbacks, legacy continuity, split population, guiding-force player, guided randomness, progressive systems.
- 014-015: **Stewards** and **Characters** are standard terms.
- 016-023: dashboard plus settlement, evolving Main page, information layers, progressive resources, deliberate click targets, Inspector over ordinary modals, mode-aware events, vignette-to-world-map path.
- 026-027: believable influence and staged institution-limited campaigns.
- 028-029: V1.2 audio package is authoritative; audio is selective, layered, gameplay-safe.
- 030-032: Inspector standard, configurable, Ledger owns deep data.
- 033-039: progressive navigation, alerts, Ledger, device layouts, density, era visuals, Tableau overlays.
- 040-043: dynamic overview customization, priority-to-delegation, Council Divided, staged refactor.
- 044-047: contextual onboarding, discoverable action states, Focus Mode, sticky responsive resource/time bar.
- 048: UI Foundation Refactor I is mechanics-preserving.

## Open naming
- Final public game title; `Kingdoms` is a working title.
- Final player-facing name for the legacy/new-civilization loop.
- Final universal progression label: Era, Age, Settlement Stage, or Civilization Stage.
