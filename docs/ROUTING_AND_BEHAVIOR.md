# HW-Library Routing and Behaviour

Repository: `FreakyHydra/HW-Library`
Branch: `frontend`

## Purpose

This document defines how the first Library frontend should behave before backend/auth integration exists.

## Primary entry URL

Production-facing target route:

`/library/`

The user should first see the Coda Library entry mat.

## Entry flow

```text
/library/
→ entry mat
→ ENTER LIBRARY
→ library browser
```

The button does not navigate to Project Whispers.

It only enters the Library browser.

No login is required in this phase.

## Category routes

Required routes:

```text
/library/characters/
/library/places/
/library/worlds/
/library/factions/
/library/species/
/library/societies/
/library/families/
/library/memories/
```

Each route should:

- keep the shared Library shell
- show the active category
- filter mock asset data to the selected type
- preserve search where practical

## Asset detail route

Use a stable direct route such as:

```text
/library/asset/:id
```

or an equivalent type-aware route if the existing router strongly prefers it.

Requirements:

- direct navigation works in dev environment
- browser Back returns to the previous library view
- unknown IDs show a useful not-found state
- no hard crash on malformed route

## Search behaviour

Search should match at minimum:

- name
- description
- origin world
- tags

Search should be case-insensitive.

Empty search restores the current category list.

No server search is required yet.

## SIMULATE behaviour

`SIMULATE` is a future Project Whispers launcher.

For this frontend phase:

- Character and Place detail views must show it prominently
- cards may also show it if space permits
- activation must NOT pretend a real simulation has started
- show a clear placeholder such as `Project Whispers integration is not connected yet.`

Do not implement a fake roleplay engine in HW-Library.

## Future Project Whispers handoff

Keep the UI ready for this future sequence:

```text
SIMULATE
→ Project Whispers
→ PRESS F11 gate
→ experimental warning
→ fake loading sequence
→ sanitized context
→ simulation
```

No implementation is required in this branch now.

## Open origin world

Asset detail pages may expose `OPEN ORIGIN WORLD` as a placeholder action.

It must not hard-code a Rebrand URL architecture that has not been finalized.

Keep origin references in the mock model so future integration can supply a real link.

## Copy to World

`COPY TO WORLD` may appear as a disabled/placeholder secondary action.

Future behaviour will be:

```text
Asset
→ COPY TO WORLD
→ fetch destination world list from Rebrand/HW-API
→ create independent copy
```

Live linked assets are explicitly out of scope.

## Delete

Do not make mock delete pretend to permanently destroy server data.

If shown in the UI, it should be disabled, marked future, or only remove mock state in an obviously non-persistent demonstration.

## Browser state

Initial frontend may keep:

- entered/not-entered state
- current view preference
- search query

in memory/session state.

Do not build account persistence yet.

## Error states

Required friendly states:

### No assets

Show category-specific empty copy and a future creation/import hint.

### No search matches

Show:

`No library entries match your search.`

Provide a clear search reset.

### Asset not found

Show:

`This library entry could not be found.`

Provide `RETURN TO LIBRARY`.

## URL ownership boundary

HW-Library owns `/library/...` presentation.

Rebrand integration and Project Whispers integration should remain external boundaries.

Do not duplicate their internal UI inside this branch.
