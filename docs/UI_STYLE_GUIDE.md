# HW-Library UI Style Guide

Repository: `FreakyHydra/HW-Library`
Branch: `frontend`

## Visual Identity

The Library must feel like **warm moonlight with Coda**, not cold corporate blue.

Reference mood:

- deep navy night sky
- indigo moonlight
- soft cream typography
- warm amber lantern glow
- muted copper/gold highlights
- cozy soft shadows
- rounded friendly surfaces
- inviting illustrated atmosphere

Avoid:

- sterile SaaS blue
- bright cyan neon everywhere
- flat gray admin-panel styling
- overly industrial Rebrand copper styling
- excessive glassmorphism
- hard cyberpunk visual language
- generic Bootstrap/dashboard appearance

## Product separation

The three major products should feel related but distinct.

### Rebrand / Forge

- workshop
- construction
- editing
- instrument panels
- copper/mechanical character

### HW-Library

- archive
- discovery
- collection
- warm moonlight
- visual browsing
- calm and inviting

### Project Whispers

- experimental simulator
- immersive
- darker
- glitch/simulation aesthetics

Do not make the Library look like a recolored Rebrand page.

## Entry Mat Artwork

The supplied Coda Library artwork is the primary entry visual.

It should be treated as artwork, not as a background texture to aggressively crop.

Priorities when fitting it:

1. Coda remains visible
2. `Howling Whispers` remains readable
3. `WELCOME TO THE LIBRARY` remains readable
4. the category icon area remains useful
5. the open lake area under the logo remains available for `ENTER LIBRARY`

Use `object-fit` / responsive positioning carefully.

Do not crop away the mascot to make the image fill a narrow viewport.

On narrow screens, a contained or repositioned presentation is preferable to destructive cropping.

## Entry Button

Exact label:

`ENTER LIBRARY`

Position:

Centered in the open lake area directly below the main title/subtitle/category block where practical.

Style direction:

- translucent deep navy background
- subtle backdrop blur only if it remains readable
- cream/off-white lettering
- warm amber/copper border
- warm outer glow
- rounded but not pill-like to the point of looking mobile-app generic
- medium-large target size

Hover:

- very small upward movement
- slightly stronger warm glow
- no large bounce

Focus:

- clearly visible keyboard outline
- do not rely only on color

## Suggested palette direction

These are directional values, not immutable brand tokens:

```css
--night-950: #080d1d;
--night-900: #0d1730;
--night-800: #142449;
--moon-100: #edf3ff;
--cream-100: #fff4df;
--cream-200: #f4e2c5;
--amber-300: #e6b675;
--amber-400: #cf9151;
--copper-500: #a9653f;
--muted-blue: #7185ac;
```

Do not saturate every surface with amber. Warm colors are accents against the blue moonlit atmosphere.

## Typography

The banner artwork already contains decorative branding typography.

The actual application UI should use readable web typography.

Preferred character:

- headings: slightly soft/editorial, not harsh geometric SaaS
- body: highly readable sans-serif
- metadata: compact but not tiny

Avoid all-caps body copy.

All-caps is acceptable for:

- small category labels
- provenance tags
- compact metadata

## Cards

Cards are the primary browsing surface.

They should feel like collectible library entries, not database rows.

Recommended structure:

```text
[ image / thumbnail ]

TYPE · ORIGIN WORLD
Asset Name
Short description

[tag] [tag]

[ SIMULATE ]   [ OPEN / ⋯ ]
```

Card treatment:

- dark navy/indigo surface
- subtle moonlit border
- soft depth
- warm highlight on hover
- images get generous visual space
- do not put every possible action permanently on the card

Use a three-dot/context action menu for secondary actions if card width becomes crowded.

## Card density

The Library is expected to become card-heavy.

Design for two eventual view modes:

### Card View

- image forward
- discovery oriented
- larger cards

### Compact View

- smaller thumbnail
- denser metadata
- better for hundreds of assets

The first phase may implement only Card View, but component structure must not prevent Compact View later.

## Category Navigation

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

Use simple icons consistently.

Do not overdecorate every category control.

Desktop may use sidebar or top category rail.

Mobile should collapse into a horizontal scroller, select/popover, or compact drawer.

## Detail Pages

Detail pages should feel like opening a library entry.

Suggested layout desktop:

```text
large image          asset identity / actions
                     origin / type / source
                     description
                     tags
                     related metadata

secondary sections below
```

Primary action should stand out.

For Character / Place:

`SIMULATE`

Secondary actions should be visually quieter.

## Motion

Motion should feel gentle.

Good:

- short fades
- soft slides
- subtle card lift
- low-intensity glow change

Avoid:

- constant floating animation
- large parallax
- aggressive zoom
- excessive particle effects

Respect `prefers-reduced-motion`.

## Warmth rule

When choosing between two visually valid options, prefer the one that feels:

- welcoming
- handmade
- cozy
- moonlit
- personal

rather than:

- enterprise
- technical
- clinical
- futuristic

Coda is the emotional anchor for this visual identity.
