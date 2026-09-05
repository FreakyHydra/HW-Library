# HW-Library Frontend Implementation Brief

Repository: `FreakyHydra/HW-Library`
Branch: `frontend`
Primary route: `/library/`
Status: Core foundation work

## Goal

Build the first usable frontend for **Howling Whispers Library**.

This is not Rebrand and not Project Whispers. It is the shared master library where reusable authored assets can be browsed, opened, edited later, recycled later, exported later, and eventually simulated through Project Whispers.

The immediate frontend goal is:

1. Warm Coda-style entry mat on `/library/`
2. `ENTER LIBRARY` button centered beneath the main logo/subtitle area
3. Actual card-heavy library browser behind the entry mat
4. Category browsing for Characters, Places, Worlds, Factions, Species, Societies, Families, and Memories
5. Asset detail pages using mock data for now
6. `SIMULATE` action as a visible placeholder for future Project Whispers integration
7. No login yet
8. No real backend dependency yet

## Critical boundary

Do not redesign unrelated Howling Whispers projects.

Do not move Project Whispers into this repository.

Do not implement OAuth, email, database migrations, server-side permissions, public sharing, or `.hw-world` packaging in this frontend phase.

Do not invent new product requirements.

## Entry Mat

The entry mat is a first-class part of `/library/`.

Use the supplied warm Coda library banner as the primary hero artwork.

The artwork already communicates:

- Howling Whispers
- Welcome to the Library
- Characters
- Places
- Worlds
- Factions
- Species
- Societies
- Families
- Memories

### Entry button placement

Place a prominent `ENTER LIBRARY` button centered under the main title/subtitle area of the banner, visually in the open lake area beneath the logo.

The button should feel integrated with the artwork, not pasted on top as a generic web button.

Recommended treatment:

- dark translucent navy glass background
- soft cream text
- warm amber/copper border
- subtle warm outer glow
- gentle hover lift
- clear keyboard focus state

The button must remain readable at desktop and mobile sizes.

### Entry behaviour

When `ENTER LIBRARY` is activated:

- reveal or transition to the actual library browser
- use a short soft fade/slide transition
- do not use a long cinematic animation
- do not block navigation
- do not require fullscreen

For the first implementation, the entry state can be session-local and does not need persistence across visits.

## Library Browser

After entry, show a card-heavy browsing interface.

Required major areas:

- top search field
- category navigation
- responsive asset grid
- simple sort/filter placeholders where useful
- card/compact view switch can be stubbed if not complete

Categories:

- All
- Characters
- Places
- Worlds
- Factions
- Species
- Societies
- Families
- Memories

## Cards

Each asset card should display enough information to understand it without opening it.

Minimum card fields:

- image or visual placeholder
- asset name
- type
- origin world
- short description
- source/provenance label if applicable
- optional small tags

Example source labels:

- CURATED
- USER CREATED
- IMPORTED V2
- COPIED
- PUBLIC

These labels are provenance only. They must not reinterpret authored content.

### Card actions

Primary supported action for interactive mock assets:

- `SIMULATE`

Secondary actions may be shown as placeholders or menu items:

- OPEN
- EDIT
- COPY TO WORLD
- DUPLICATE
- EXPORT
- DELETE

Do not implement destructive behaviour against real data yet.

## Asset Detail Pages

Clicking an asset card should open a dedicated detail view.

Character example should include:

- large image
- name
- type
- origin world
- short description
- tags
- source/provenance
- `SIMULATE`
- `EDIT`
- `COPY TO WORLD`
- `EXPORT`

Place detail should include:

- large image
- place name
- location type
- parent world
- parent location if available
- description
- tags
- `SIMULATE`
- `EDIT`
- `COPY TO WORLD`
- `EXPORT`

Use mock data only for this frontend phase.

## Simulation Placeholder

`SIMULATE` must exist visually because it is a core Library action.

For now, it may open a lightweight placeholder dialog/page that states Project Whispers integration is not connected yet.

Do not implement fake Project Whispers logic inside HW-Library.

Future flow will be:

```text
Library asset
→ SIMULATE
→ Project Whispers pre-launch gate
→ Press F11
→ experimental warning
→ fake loading sequence
→ sanitized context simulation
```

That future integration belongs to the `whispers-integration` branch/repository work.

## Routing

Support routes conceptually equivalent to:

```text
/library/
/library/characters/
/library/places/
/library/worlds/
/library/factions/
/library/species/
/library/societies/
/library/families/
/library/memories/
/library/asset/:id
```

Exact internal router implementation is flexible, but browser refresh/direct navigation should not produce broken state in the frontend development environment.

## Responsive requirements

Desktop:

- wide hero entry mat
- category/navigation visible
- multi-column card grid

Tablet:

- reduced side spacing
- 2 to 3 column card grid depending on width

Mobile:

- hero remains readable without hiding Coda or the title completely
- `ENTER LIBRARY` remains obvious
- category controls collapse cleanly
- single-column or compact two-column card layout where practical
- no horizontal page scrolling

## Accessibility

Required:

- keyboard reachable controls
- visible focus states
- semantic buttons/links
- useful image alt text
- sufficient text contrast
- `aria-label` where icon-only buttons exist
- reduced-motion preference should suppress non-essential transitions

## Data boundary

Use a small mock data layer that can later be replaced by `HW-API`.

Do not tightly couple UI components to hard-coded arrays.

Prefer a shape like:

```ts
interface LibraryAsset {
  id: string
  type: 'character' | 'place' | 'world' | 'faction' | 'species' | 'society' | 'family' | 'memory'
  name: string
  description: string
  image?: string
  originWorldId?: string
  originWorldName?: string
  sourceType?: string
  tags?: string[]
  updatedAt?: string
}
```

The final shared type will be defined with HW-API later.

## Mock content

Use enough mock assets to prove the browser works across categories.

Include at least:

- Ragna as a character example
- Bitterroot as a world example
- Ragna's Bedroom as a place example
- one faction
- one species
- one society
- one family
- one memory/event

Do not invent deep canon. Mock descriptions should be short and clearly demonstrative.

## Code quality

- TypeScript strictness should remain useful
- avoid giant single-file UI implementation
- split reusable card/navigation/detail components
- keep mock data separate from presentation
- avoid premature state-management libraries
- no unnecessary framework additions unless justified
- build must pass before completion

## Definition of Done

This phase is complete when:

1. `/library/` opens on the Coda entry mat
2. `ENTER LIBRARY` is positioned under the logo area and works
3. entering reveals the library browser
4. all required categories can be browsed
5. mock assets render as responsive cards
6. cards open detail views
7. Character and Place examples show a visible `SIMULATE` action
8. styling matches the warm Coda moonlight direction
9. mobile layout is usable
10. build/type checks pass
11. no login/backend is required to use the mock frontend
