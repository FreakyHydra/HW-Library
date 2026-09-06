import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(8789),
  APP_ORIGIN: z.string().url(),
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(32),
  SESSION_COOKIE_NAME: z.string().min(1).default('orbis.sid'),
  TRUST_PROXY: z.enum(['true', 'false']).default('false'),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),
  DISCORD_REDIRECT_URI: z.string().url(),
  DISCORD_GUILD_ID: z.string().regex(/^\d+$/),
  DISCORD_ADULT_ROLE_IDS: z.string().default(''),
  DISCORD_CREATOR_ROLE_IDS: z.string().default(''),
});

const parseRoleIds = (value: string) => new Set(value.split(',').map((id) => id.trim()).filter(Boolean));

export function loadConfig(environment: NodeJS.ProcessEnv = process.env) {
  const env = envSchema.parse(environment);
  const adultRoleIds = parseRoleIds(env.DISCORD_ADULT_ROLE_IDS);
  const configuredCreatorRoleIds = parseRoleIds(env.DISCORD_CREATOR_ROLE_IDS);
  const creatorRoleIds = configuredCreatorRoleIds.size > 0 ? configuredCreatorRoleIds : adultRoleIds;

  if (adultRoleIds.size === 0) throw new Error('DISCORD_ADULT_ROLE_IDS must contain at least one role ID.');
  if (creatorRoleIds.size === 0) throw new Error('DISCORD_CREATOR_ROLE_IDS or DISCORD_ADULT_ROLE_IDS must contain at least one role ID.');

  return {
    ...env,
    adultRoleIds,
    creatorRoleIds,
    isProduction: env.NODE_ENV === 'production',
    trustProxy: env.TRUST_PROXY === 'true',
  };
}

export type AppConfig = ReturnType<typeof loadConfig>;
