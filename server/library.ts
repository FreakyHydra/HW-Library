import { randomUUID } from 'node:crypto';
import { Router, type Request } from 'express';
import { z } from 'zod';
import { refreshSessionAccess, requireCreator } from './auth.js';
import type { AppConfig } from './config.js';
import type { DatabasePool } from './db.js';

const assetTypes = ['world', 'character', 'place', 'faction', 'species', 'society', 'family', 'memory'] as const;
const sourceTypes = ['curated', 'user-created', 'imported-v2', 'copied', 'public-curated', 'legacy-import'] as const;
const tones = ['moon', 'forest', 'ember', 'mist', 'violet', 'river'] as const;

const createAssetSchema = z.object({
  type: z.enum(assetTypes),
  name: z.string().trim().min(1).max(120),
  summary: z.string().trim().max(2000).default(''),
  originWorldId: z.string().uuid().nullable().optional(),
  contentRating: z.enum(['sfw', 'adult']).default('sfw'),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  visualTone: z.enum(tones).default('moon'),
});
const updateAssetSchema = createAssetSchema.omit({ type: true }).partial();

function canViewAdult(request: Request) {
  return request.session.access?.canViewAdult === true;
}

function mapAsset(row: Record<string, unknown>) {
  if (row.restricted) {
    return {
      id: `restricted:${row.id}`,
      type: row.type,
      name: 'Not verified',
      summary: 'This record is available to verified adult members of The Howling Whispers Discord.',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      sourceType: 'user-created',
      contentRating: 'adult',
      tags: ['Verification required'],
      dependencyCount: 0,
      pinned: false,
      visualTone: 'mist',
      restricted: true,
      verificationPath: '/verification',
    };
  }
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    summary: row.summary,
    originWorldId: row.origin_world_id ?? undefined,
    originWorldName: row.origin_world_name ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sourceType: row.source_type,
    contentRating: row.content_rating,
    tags: row.tags,
    dependencyCount: row.dependency_count,
    pinned: row.pinned,
    visualTone: row.visual_tone,
    author: row.creator_user_id ? { id: row.creator_user_id, displayName: row.author_name, avatarUrl: row.author_avatar_url ?? undefined } : undefined,
  };
}

const selectAssets = `
  SELECT a.*, origin.name AS origin_world_name,
    u.display_name AS author_name, u.avatar_url AS author_avatar_url,
    (a.content_rating = 'adult' AND NOT $1::boolean) AS restricted
  FROM library_assets a
  LEFT JOIN library_assets origin ON origin.id = a.origin_world_id
  LEFT JOIN users u ON u.id = a.creator_user_id`;

export function createLibraryRouter(config: AppConfig, pool: DatabasePool) {
  const router = Router();

  router.use(async (request, _response, next) => {
    try {
      await refreshSessionAccess(request, config);
      next();
    } catch (error) {
      next(error);
    }
  });

  router.get('/overview', async (request, response, next) => {
    try {
      const adult = canViewAdult(request);
      const [recent, pinned, counts] = await Promise.all([
        pool.query(`${selectAssets} ORDER BY a.updated_at DESC LIMIT 4`, [adult]),
        pool.query(`${selectAssets} WHERE a.pinned = true ORDER BY a.updated_at DESC`, [adult]),
        pool.query(`SELECT type, count(*)::int AS count FROM library_assets GROUP BY type`),
      ]);
      const countMap = Object.fromEntries(assetTypes.map((type) => [type, 0]));
      for (const row of counts.rows) countMap[row.type] = row.count;
      response.json({ recent: recent.rows.map(mapAsset), pinned: pinned.rows.map(mapAsset), counts: countMap });
    } catch (error) {
      next(error);
    }
  });

  router.get('/assets', async (request, response, next) => {
    try {
      const values: unknown[] = [canViewAdult(request)];
      const where: string[] = [];
      const type = typeof request.query.type === 'string' && assetTypes.includes(request.query.type as typeof assetTypes[number]) ? request.query.type : undefined;
      const sourceType = typeof request.query.sourceType === 'string' && sourceTypes.includes(request.query.sourceType as typeof sourceTypes[number]) ? request.query.sourceType : undefined;
      const search = typeof request.query.search === 'string' ? request.query.search.trim().slice(0, 120) : '';
      if (type) { values.push(type); where.push(`a.type = $${values.length}`); }
      if (sourceType) { values.push(sourceType); where.push(`a.source_type = $${values.length}`); }
      if (search) {
        values.push(`%${search}%`);
        where.push(`(a.content_rating = 'adult' AND NOT $1::boolean OR a.name ILIKE $${values.length} OR a.summary ILIKE $${values.length} OR $${values.length} = ANY(a.tags))`);
      }
      const clause = where.length ? ` WHERE ${where.join(' AND ')}` : '';
      const order = request.query.sort === 'name' ? 'a.name ASC' : 'a.updated_at DESC';
      const result = await pool.query(`${selectAssets}${clause} ORDER BY ${order} LIMIT 200`, values);
      response.json({ items: result.rows.map(mapAsset), total: result.rowCount });
    } catch (error) {
      next(error);
    }
  });

  router.get('/assets/:id', async (request, response, next) => {
    try {
      if (request.params.id.startsWith('restricted:')) return response.status(403).json({ error: 'Verification required.', verificationPath: '/verification' });
      const result = await pool.query(`${selectAssets} WHERE a.id = $2`, [canViewAdult(request), request.params.id]);
      if (!result.rowCount) return response.status(404).json({ error: 'Record not found.' });
      if (result.rows[0].restricted) return response.status(403).json({ error: 'Verification required.', verificationPath: '/verification' });
      response.json(mapAsset(result.rows[0]));
    } catch (error) {
      next(error);
    }
  });

  router.post('/assets', requireCreator(config, pool), async (request, response, next) => {
    try {
      const asset = createAssetSchema.parse(request.body);
      const result = await pool.query(
        `INSERT INTO library_assets (id,type,name,summary,origin_world_id,creator_user_id,source_type,content_rating,tags,visual_tone)
         VALUES ($1,$2,$3,$4,$5,$6,'user-created',$7,$8,$9) RETURNING *`,
        [randomUUID(), asset.type, asset.name, asset.summary, asset.originWorldId ?? null, request.session.userId, asset.contentRating, asset.tags, asset.visualTone],
      );
      response.status(201).json(mapAsset({ ...result.rows[0], restricted: false }));
    } catch (error) {
      next(error);
    }
  });

  router.patch('/assets/:id', requireCreator(config, pool), async (request, response, next) => {
    try {
      const asset = updateAssetSchema.parse(request.body);
      const current = await pool.query('SELECT * FROM library_assets WHERE id = $1', [request.params.id]);
      if (!current.rowCount) return response.status(404).json({ error: 'Record not found.' });
      if (current.rows[0].creator_user_id !== request.session.userId) return response.status(403).json({ error: 'Only the creator can change this record.' });
      const nextAsset = { ...current.rows[0], ...{
        name: asset.name ?? current.rows[0].name,
        summary: asset.summary ?? current.rows[0].summary,
        origin_world_id: asset.originWorldId === undefined ? current.rows[0].origin_world_id : asset.originWorldId,
        content_rating: asset.contentRating ?? current.rows[0].content_rating,
        tags: asset.tags ?? current.rows[0].tags,
        visual_tone: asset.visualTone ?? current.rows[0].visual_tone,
      }};
      const result = await pool.query(
        `UPDATE library_assets SET name=$2, summary=$3, origin_world_id=$4, content_rating=$5, tags=$6, visual_tone=$7, updated_at=now()
         WHERE id=$1 RETURNING *`,
        [request.params.id, nextAsset.name, nextAsset.summary, nextAsset.origin_world_id, nextAsset.content_rating, nextAsset.tags, nextAsset.visual_tone],
      );
      const user = await pool.query('SELECT display_name, avatar_url FROM users WHERE id = $1', [request.session.userId]);
      response.json(mapAsset({ ...result.rows[0], restricted: false, author_name: user.rows[0].display_name, author_avatar_url: user.rows[0].avatar_url }));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
