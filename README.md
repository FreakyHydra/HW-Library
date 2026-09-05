# Orbis

Orbis is the standalone reusable asset archive for The Howling Whispers.

The `HW-Library` repository contains the user-facing Orbis frontend and its Library-specific API client. It is intentionally separate from Rebrand (`HW-Landing`) and from the future Project Whispers simulation runtime.

## Current direction

- Server-backed assets, not browser-local ownership
- Card-heavy blue warm moonlight interface
- Reusable Characters, Places, Factions, Species, Societies, Families, Memories, and Worlds
- Curated Howling Whispers data first
- Project Whispers simulation launch integration later
- Rebrand integration later
- Authentication and mailing later

## Branch model

- `main` - stable root
- `dev` - integration branch
- `frontend` - Library UI and browsing
- `backend` - Library-facing backend work until HW-API takes over shared API responsibilities
- `auth` - authentication/account integration
- `mailing` - verification/recovery/security mail integration
- `whispers-integration` - Project Whispers simulation integration
- `rebrand-integration` - Rebrand client integration
- `export-import` - HW asset/world package work

No formal release versioning or changelog is required during the current core-development stage.

## Local development

Requirements: Node.js 20 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The development server opens on `http://localhost:5174`.

Leave `VITE_HW_LIBRARY_API_URL` blank to use the temporary frontend fixtures. Set it to the shared API origin when the real Global Asset Index API is available.

## Verification

```bash
npm test
npm run build
npm run preview
```

The production preview opens on `http://localhost:4174`. Deployment, DNS, reverse proxy and production secret configuration are intentionally outside this repository foundation.

## Source structure

- `src/api` contains the stable Library client boundary and fixture/HTTP implementations.
- `src/components` contains shared shell, card and state primitives.
- `src/features/library` contains temporary frontend fixtures.
- `src/views` contains the Library home, collections and record detail views.
- `src/types` contains shared asset and future simulation launch contracts.
- `docs/API_CONTRACT.md` documents the initial server contract.
