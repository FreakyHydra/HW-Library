import type { LibraryApi } from './contracts';
import { LibraryApiError } from './contracts';
import type { AssetListResponse, AssetQuery, LibraryAsset, LibraryOverview } from '../types/library';

export class HttpLibraryApi implements LibraryApi {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, signal?: AbortSignal): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        signal,
        headers: { Accept: 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new LibraryApiError(`Library request failed with status ${response.status}.`, response.status);
      return await response.json() as T;
    } catch (error) {
      if (error instanceof LibraryApiError || (error instanceof DOMException && error.name === 'AbortError')) throw error;
      throw new LibraryApiError('The Library service could not be reached.', undefined, error);
    }
  }

  getOverview(signal?: AbortSignal) {
    return this.request<LibraryOverview>('/v1/library/overview', signal);
  }

  listAssets(query: AssetQuery = {}, signal?: AbortSignal) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => value && params.set(key, value));
    const suffix = params.size ? `?${params}` : '';
    return this.request<AssetListResponse>(`/v1/library/assets${suffix}`, signal);
  }

  getAsset(id: string, signal?: AbortSignal) {
    return this.request<LibraryAsset>(`/v1/library/assets/${encodeURIComponent(id)}`, signal);
  }
}
