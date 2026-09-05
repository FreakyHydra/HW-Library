import type { AssetListResponse, AssetQuery, LibraryAsset, LibraryOverview } from '../types/library';

export interface LibraryApi {
  getOverview(signal?: AbortSignal): Promise<LibraryOverview>;
  listAssets(query?: AssetQuery, signal?: AbortSignal): Promise<AssetListResponse>;
  getAsset(id: string, signal?: AbortSignal): Promise<LibraryAsset>;
}

export class LibraryApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'LibraryApiError';
  }
}
