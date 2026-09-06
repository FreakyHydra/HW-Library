import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { Router, type NextFunction, type Request, type Response } from 'express';
import { z } from 'zod';
import { decideAccess } from './access.js';
import type { AppConfig } from './config.js';
import type { DatabasePool } from './db.js';
import { discordAuthorizeUrl, discordAvatarUrl, discordDecorationUrl, exchangeCode, getDiscordUser, getGuildMembership } from './discord.js';

const profileSchema = z.object({ displayName: z.string().trim().min(2).max(40) });
const ACCESS_MAX_AGE_MS = 5 * 60 * 1000;

const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

const safeReturnTo = (value: unknown) => typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/';

function publicProfile(row: Record<string, unknown>, access: { isGuildMember: boolean; canViewAdult: boolean; canCreate: boolean }) {
  return {
    id: row.id,
    displayName: row.display_name,
    discordUsername: row.discord_username,
    avatarUrl: row.avatar_url,
    avatarDecorationUrl: row.avatar_decoration_url,
    accentColor: row.accent_color,
    displayNameCustomized: row.display_name_customized,
    permissions: access,
  };
}

export async function refreshSessionAccess(request: Request, config: AppConfig, force = false) {
  if (!request.session.userId || !request.session.discordAccessToken) return;
  if (!force && request.session.access && Date.now() - request.session.access.checkedAt < ACCESS_MAX_AGE_MS) return;
  if ((request.session.discordTokenExpiresAt ?? 0) <= Date.now()) {
    request.session.access = { isGuildMember: false, canViewAdult: false, canCreate: false, checkedAt: Date.now() };
    return;
  }
  try {
    const membership = await getGuildMembership(request.session.discordAccessToken, config.DISCORD_GUILD_ID);
    request.session.access = { ...decideAccess(membership.isGuildMember, membership.roles, config), checkedAt: Date.now() };
  } catch {
    request.session.access = { isGuildMember: false, canViewAdult: false, canCreate: false, checkedAt: Date.now() };
  }
}

export function requireCreator(config: AppConfig, pool: DatabasePool) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      await refreshSessionAccess(request, config);
      if (!request.session.userId) return response.status(401).json({ error: 'Sign in with Discord to create in Orbis.' });
      if (!request.session.access?.canCreate) return response.status(403).json({ error: 'The verified 18+ Discord role is required to create or edit.', verificationPath: '/verification' });
      await pool.query(
        `UPDATE users SET is_guild_member = $2, can_view_adult = $3, can_create = $4, access_checked_at = now(), updated_at = now() WHERE id = $1`,
        [request.session.userId, request.session.access.isGuildMember, request.session.access.canViewAdult, request.session.access.canCreate],
      );
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function createAuthRouter(config: AppConfig, pool: DatabasePool) {
  const router = Router();

  router.get('/discord/login', (request, response, next) => {
    const state = randomBytes(32).toString('base64url');
    request.session.oauthState = state;
    request.session.oauthReturnTo = safeReturnTo(request.query.returnTo);
    request.session.save((error) => {
      if (error) return next(error);
      response.redirect(discordAuthorizeUrl(config, state));
    });
  });

  router.get('/discord/callback', async (request, response, next) => {
    try {
      const code = typeof request.query.code === 'string' ? request.query.code : '';
      const state = typeof request.query.state === 'string' ? request.query.state : '';
      const expectedState = request.session.oauthState ?? '';
      if (!code || !state || !expectedState || !safeEqual(state, expectedState)) return response.redirect('/?auth=invalid-state');

      delete request.session.oauthState;
      const token = await exchangeCode(config, code);
      const [discordUser, membership] = await Promise.all([
        getDiscordUser(token.access_token),
        getGuildMembership(token.access_token, config.DISCORD_GUILD_ID),
      ]);
      const access = decideAccess(membership.isGuildMember, membership.roles, config);
      const fallbackName = discordUser.global_name?.trim() || discordUser.username;
      const id = randomUUID();
      const result = await pool.query(
        `INSERT INTO users (
          id, discord_id, discord_username, discord_global_name, display_name, avatar_url,
          avatar_decoration_url, banner_hash, accent_color, collectibles, primary_guild,
          is_guild_member, can_view_adult, can_create
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        ON CONFLICT (discord_id) DO UPDATE SET
          discord_username = excluded.discord_username,
          discord_global_name = excluded.discord_global_name,
          display_name = CASE WHEN users.display_name_customized THEN users.display_name ELSE excluded.display_name END,
          avatar_url = excluded.avatar_url,
          avatar_decoration_url = excluded.avatar_decoration_url,
          banner_hash = excluded.banner_hash,
          accent_color = excluded.accent_color,
          collectibles = excluded.collectibles,
          primary_guild = excluded.primary_guild,
          is_guild_member = excluded.is_guild_member,
          can_view_adult = excluded.can_view_adult,
          can_create = excluded.can_create,
          access_checked_at = now(), updated_at = now(), last_login_at = now()
        RETURNING *`,
        [id, discordUser.id, discordUser.username, discordUser.global_name, fallbackName,
          discordAvatarUrl(discordUser), discordDecorationUrl(discordUser), discordUser.banner ?? null,
          discordUser.accent_color ?? null, discordUser.collectibles ?? null, discordUser.primary_guild ?? null,
          access.isGuildMember, access.canViewAdult, access.canCreate],
      );

      const returnTo = request.session.oauthReturnTo ?? '/';
      await new Promise<void>((resolve, reject) => request.session.regenerate((error) => error ? reject(error) : resolve()));
      request.session.userId = String(result.rows[0].id);
      request.session.discordAccessToken = token.access_token;
      request.session.discordTokenExpiresAt = Date.now() + token.expires_in * 1000;
      request.session.access = { ...access, checkedAt: Date.now() };
      request.session.save((error) => error ? next(error) : response.redirect(returnTo));
    } catch (error) {
      next(error);
    }
  });

  router.get('/me', async (request, response, next) => {
    try {
      if (!request.session.userId) return response.json({ user: null });
      await refreshSessionAccess(request, config);
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [request.session.userId]);
      if (!result.rowCount) return response.json({ user: null });
      const access = request.session.access ?? { isGuildMember: false, canViewAdult: false, canCreate: false };
      response.json({ user: publicProfile(result.rows[0], access) });
    } catch (error) {
      next(error);
    }
  });

  router.patch('/profile', async (request, response, next) => {
    try {
      if (!request.session.userId) return response.status(401).json({ error: 'Sign in required.' });
      const body = profileSchema.parse(request.body);
      const result = await pool.query(
        `UPDATE users SET display_name = $2, display_name_customized = true, updated_at = now() WHERE id = $1 RETURNING *`,
        [request.session.userId, body.displayName],
      );
      const access = request.session.access ?? { isGuildMember: false, canViewAdult: false, canCreate: false };
      response.json({ user: publicProfile(result.rows[0], access) });
    } catch (error) {
      next(error);
    }
  });

  router.post('/logout', (request, response, next) => {
    request.session.destroy((error) => {
      if (error) return next(error);
      response.clearCookie(config.SESSION_COOKIE_NAME, { path: '/' });
      response.status(204).end();
    });
  });

  return router;
}
