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

Authentication, mutation endpoints, Rebrand deep links and simulation context are intentionally left for their assigned phases.
