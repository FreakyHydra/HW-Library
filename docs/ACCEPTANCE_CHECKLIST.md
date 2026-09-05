# HW-Library Frontend Acceptance Checklist

Repository: `FreakyHydra/HW-Library`
Branch: `frontend`

Use this checklist before declaring the first Library frontend pass complete.

## Entry Mat

- [ ] `/library/` opens on the Coda Library entry mat
- [ ] supplied banner artwork is used as the primary hero visual
- [ ] Coda remains visible and is not destructively cropped on desktop
- [ ] `Howling Whispers` remains readable
- [ ] `WELCOME TO THE LIBRARY` remains readable
- [ ] category icon area remains visible where practical
- [ ] `ENTER LIBRARY` is centered beneath the title/subtitle area in the open lake area
- [ ] button has warm moonlit styling, not generic bright-blue SaaS styling
- [ ] button is keyboard accessible
- [ ] button has visible focus state
- [ ] entering uses a short non-blocking transition

## Library Browser

- [ ] browser appears after `ENTER LIBRARY`
- [ ] search control is present
- [ ] category navigation is present
- [ ] All category works
- [ ] Characters category works
- [ ] Places category works
- [ ] Worlds category works
- [ ] Factions category works
- [ ] Species category works
- [ ] Societies category works
- [ ] Families category works
- [ ] Memories category works
- [ ] active category is visually obvious
- [ ] asset grid is responsive

## Mock Assets

- [ ] at least one Character example exists
- [ ] Ragna is used as a Character example
- [ ] Bitterroot is used as a World example
- [ ] Ragna's Bedroom is used as a Place example
- [ ] at least one Faction exists
- [ ] at least one Species exists
- [ ] at least one Society exists
- [ ] at least one Family exists
- [ ] at least one Memory/Event exists
- [ ] mock descriptions do not invent unnecessary canon

## Cards

- [ ] cards show asset name
- [ ] cards show asset type
- [ ] cards show origin world where applicable
- [ ] cards show short description
- [ ] cards support image/visual placeholder
- [ ] provenance/source label can be shown
- [ ] tags can be shown without breaking layout
- [ ] cards are not overloaded with permanent buttons
- [ ] secondary actions can fit into a three-dot/menu pattern
- [ ] hover state is subtle and warm
- [ ] keyboard focus is visible

## Search

- [ ] search matches names
- [ ] search matches descriptions
- [ ] search matches origin world
- [ ] search matches tags
- [ ] search is case-insensitive
- [ ] clearing search restores results
- [ ] no-results state is friendly

## Asset Detail

- [ ] clicking/opening a card leads to a detail view
- [ ] direct asset route does not crash
- [ ] unknown asset ID shows a friendly not-found view
- [ ] Back navigation works
- [ ] Character detail has large visual area
- [ ] Character detail shows origin world
- [ ] Character detail shows source/provenance
- [ ] Character detail shows tags where available
- [ ] Character detail shows prominent `SIMULATE`
- [ ] Place detail has large visual area
- [ ] Place detail shows parent/origin world
- [ ] Place detail shows location type
- [ ] Place detail shows prominent `SIMULATE`

## SIMULATE Placeholder

- [ ] `SIMULATE` is visible for supported mock assets
- [ ] activating it does not fake a real roleplay session
- [ ] user is told Project Whispers integration is not connected yet
- [ ] no simulation engine is implemented inside HW-Library frontend

## Visual Direction

- [ ] overall palette is deep navy / indigo moonlight
- [ ] cream text is used appropriately
- [ ] amber/copper warmth is used as accent
- [ ] UI does not look like generic SaaS
- [ ] UI does not look like a recolored Rebrand Forge
- [ ] Coda entry art feels integrated with the UI
- [ ] cards feel collectible/library-like
- [ ] glow effects remain subtle
- [ ] typography remains readable

## Responsive

- [ ] no horizontal page scrolling at normal mobile widths
- [ ] desktop uses multi-column cards
- [ ] tablet layout remains usable
- [ ] mobile entry mat keeps both mascot and branding understandable
- [ ] mobile `ENTER LIBRARY` remains obvious
- [ ] mobile category navigation is usable
- [ ] mobile cards are readable
- [ ] controls meet comfortable touch target sizes

## Accessibility

- [ ] semantic buttons and links are used
- [ ] icon-only actions have accessible names
- [ ] useful image alt text exists
- [ ] contrast is acceptable
- [ ] focus states are visible
- [ ] keyboard browsing is possible
- [ ] non-essential motion respects `prefers-reduced-motion`

## Architecture

- [ ] presentation components are not tied directly to one giant hard-coded data array
- [ ] mock data is separated from presentation
- [ ] shared asset type is defined cleanly
- [ ] components are split reasonably
- [ ] no unnecessary state-management framework was added
- [ ] no OAuth was implemented
- [ ] no mailing system was implemented
- [ ] no production database was implemented
- [ ] no `.hw-world` exporter was implemented
- [ ] no Project Whispers runtime was copied into this repo

## Quality Gate

- [ ] dependency install succeeds
- [ ] TypeScript/type check succeeds if configured
- [ ] production build succeeds
- [ ] no obvious console errors during normal browsing
- [ ] direct category routes work in development
- [ ] direct asset route works in development

## Final review question

Before completion, ask:

> Does this feel like entering Coda's warm moonlit archive of worlds and characters, or does it feel like a generic asset-management dashboard?

If it feels generic, the visual pass is not finished.
