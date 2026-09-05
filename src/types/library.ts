export const assetTypes = [
  'world',
  'character',
  'place',
  'faction',
  'species',
  'society',
  'family',
  'memory',
] as const;

export type AssetType = (typeof assetTypes)[number];
export type SourceType = 'curated' | 'user-created' | 'imported-v2' | 'copied' | 'public-curated' | 'legacy-import';

export interface LibraryAsset {
  id: string;
  type: AssetType;
  name: string;
  summary: string;
  originWorldId?: string;
  originWorldName?: string;
  createdAt: string;
  updatedAt: string;
  sourceType: SourceType;
  tags: string[];
  dependencyCount: number;
  pinned?: boolean;
  visualTone: 'moon' | 'forest' | 'ember' | 'mist' | 'violet' | 'river';
}

export interface AssetQuery {
  type?: AssetType;
  search?: string;
  sourceType?: SourceType;
  sort?: 'recent' | 'name';
}

export interface AssetListResponse {
  items: LibraryAsset[];
  total: number;
}

export interface LibraryOverview {
  recent: LibraryAsset[];
  pinned: LibraryAsset[];
  counts: Record<AssetType, number>;
}

export interface SimulationTarget {
  type: AssetType;
  assetId: string;
  originWorldId?: string;
  requestedScope: 'asset' | 'world';
  personaId?: string;
  sessionId?: string;
}
