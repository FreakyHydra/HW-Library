# Library API client contract

The frontend consumes a server-backed Library API through `src/api/contracts.ts`.

Set `VITE_HW_LIBRARY_API_URL` to the API origin. When it is blank, the frontend uses development fixtures. Fixtures are temporary presentation data and are never treated as browser-owned records.

## Initial read endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/v1/library/overview` | Category counts, recently edited records and pinned records |
| `GET` | `/v1/library/assets` | Search and filter globally indexed assets |
| `GET` | `/v1/library/assets/:id` | Fetch one complete Library record |

Supported asset query parameters are `type`, `search`, `sourceType` and `sort`.

## Stable frontend models

- `LibraryAsset` provides common identity, provenance, origin world, tags and dependency summary fields.
- `AssetQuery` defines the first global index query surface.
- `SimulationTarget` reserves the dormant boundary for Project Whispers without coupling this site to a runtime.

## Authentication and visibility

Discord authentication uses same-origin routes under `/api/auth`. `GET /api/auth/me` returns the signed-in profile and the server-calculated `canViewAdult` and `canCreate` permissions.

Every asset has a `contentRating` of `sfw` or `adult`. When the current session cannot view adult content, list and overview responses retain a neutral card but replace all sensitive fields and set `restricted: true` with `verificationPath: /verification`. Direct detail requests return `403`.

## Initial write endpoints

| Method | Path | Access |
| --- | --- | --- |
| `POST` | `/v1/library/assets` | Accepted Discord creator role |
| `PATCH` | `/v1/library/assets/:id` | Accepted Discord creator role and matching immutable creator ID |

Records store `creator_user_id`. Responses join that ID to the creator's current profile, keeping visible author names fluid without weakening ownership.

## Administration

All routes below require a signed-in Discord user with effective Orbis administrator access. Server-side middleware enforces authorization.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/admin/overview` | Non-secret operational and system status |
| `GET` | `/api/admin/settings` | Effective editable settings, source and fallback information |
| `PUT` | `/api/admin/settings` | Validate, persist and audit a complete operational settings update |
| `GET` | `/api/admin/audit` | Recent non-secret setting changes |
| `GET` | `/api/config/public` | Public Discord invite URL only |

The administration API never returns `DATABASE_URL`, `SESSION_SECRET` or `DISCORD_CLIENT_SECRET` values.
