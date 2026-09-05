# HW-Library

Shared reusable asset library for Howling Whispers.

This repository hosts the user-facing Library frontend and library-specific client logic. It is intentionally being built as a clean project rather than as a fork of another gallery or DAM system.

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
