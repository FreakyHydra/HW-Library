# HW-Library Foundation

## Product role

HW-Library is the shared, server-backed reusable asset library for Howling Whispers projects.

It is separate from Rebrand.

Rebrand will consume Library assets when a user adds existing characters, places, factions, species, societies, families, memories, and other reusable content to a world.

Project Whispers will later consume Library/Rebrand simulation targets through an explicit integration contract.

## Visual direction

The Library uses a **warm moonlight** identity.

The intended feeling is warm, welcoming, quiet, slightly dreamy, and recognizably Howling Whispers.

### Palette direction

- deep navy / indigo night surfaces
- soft moonlit blue atmosphere
- warm cream text
- muted amber / copper interaction highlights
- low-intensity warm glows
- gentle panel depth

Avoid a cold sterile blue SaaS appearance.

The visual shorthand is **warm Coda style**: friendly, cozy, playful enough to feel alive, while remaining practical for a card-heavy asset library.

## Library interaction model

The Library is not a forum.

It is primarily a visual asset browser with:

- card view
- compact view later
- category navigation
- search
- filters later
- sorting later
- favorites/pinning later
- asset detail views

Initial asset categories:

- Characters
- Places
- Worlds
- Factions
- Species
- Societies
- Families
- Memories / Events

## Ownership and storage

Actual user assets are intended to be stored server-side.

Browser local storage may later be used for temporary UI state, caching, drafts, or device-specific preferences, but it is not the master asset store.

Authentication is intentionally postponed until the account/server work is ready.

## Curated character direction

Howling Whispers curated character data is the preferred native format.

Character Card V2 is compatibility import/export, not the preferred authoring model.

V2 import belongs inside a selected world in Rebrand, where the imported card can be completed through the curated editor.

## Simulation direction

Interactive assets will ultimately expose `SIMULATE`.

`SIMULATE` will launch Project Whispers through a formal simulation target contract.

The Library itself does not implement separate character-chat, place-visit, faction-explore engines.

Project Whispers is intended to become the universal simulator.

The parent world remains the source of canon, while a sanitized context resolver supplies only the relevant slice required by the selected simulation target.

## Current stage

Current work is core development only.

No login yet.
No production server integration yet.
No formal versioning/release changelog yet.
No public release claims.
