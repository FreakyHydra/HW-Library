# Orbis to Speculus bridge

Orbis is the launch authority and credential boundary for Speculus. A user opens a Library record and selects **Simulate**. Orbis snapshots the selected record, related world context, the current Orbis identity as the fallback persona, and a short-lived generation grant. It then deposits that version 1 package into Speculus over the private server bridge and redirects the browser to the returned one-time URL.

## Credential boundary

- Users enter NovelAI tokens only in Orbis Account settings.
- Orbis encrypts tokens with AES-256-GCM using `ORBIS_CREDENTIAL_ENCRYPTION_KEY`.
- The API returns only configured status, model, and update time.
- Speculus receives an opaque grant scoped to one launch, asset ID, asset revision, model, and expiry.
- The Speculus browser never receives the grant. Speculus seals it in its HTTP-only server session.
- Only Orbis decrypts the token, immediately before its server-side request to NovelAI.
- Ollama and direct provider URLs are not part of this bridge.

## Production installation

Apply migrations in order, including:

```bash
psql "$DATABASE_URL" -f server/migrations/004_speculus_bridge.sql
```

Generate independent secrets. Do not reuse the session secret:

```bash
openssl rand -base64 32
openssl rand -hex 32
```

Set these in `/etc/howlingwhispers/orbis.env`:

```env
ORBIS_CREDENTIAL_ENCRYPTION_KEY=<base64 output, exactly 32 decoded bytes>
SPECULUS_BRIDGE_URL=http://127.0.0.1:8790
SPECULUS_BRIDGE_SECRET=<shared hex output>
SPECULUS_LAUNCH_TTL_SECONDS=14400
```

Set the same bridge secret in the protected Speculus environment. Build Speculus with its deployment date:

```env
SPECULUS_PUBLIC_ORIGIN=https://spec.thehowlingwhispers.com
SPECULUS_BRIDGE_SECRET=<same shared hex output>
ORBIS_GENERATION_API_URL=http://127.0.0.1:8789/api/v1/generation/speculus
SPECULUS_UPDATE_DATE=<YYYY-MM-DD deployment date>
```

The public domain remains intentionally non-navigable without a one-time launch package. Direct visits show the missing-system-medium boot failure.

## Launch package content

The primary record is immutable for the lifetime of the launch and carries its `updated_at` value as the source revision. A world launch includes its children. A child-record launch includes its origin world and accessible sibling records. Related adult records remain excluded unless the launching user has adult access or owns the related record.

Character records are adapted to Character Card V2 fields when matching structured fields exist. Other record types run through Speculus's narrator subject. Until Orbis has a dedicated persona model, the signed-in user's display name is sent as a minimal anti-impersonation persona.
