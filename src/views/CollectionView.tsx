import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { libraryApi } from '../api/client';
import { findNavigationItem } from '../app/library-nav';
import { AssetCard } from '../components/AssetCard';
import { EmptyState, ErrorState, LoadingState } from '../components/StatePanel';
import { useLibraryData } from '../hooks/useLibraryData';
import type { AssetType, SourceType } from '../types/library';

export function CollectionView({ all = false }: { all?: boolean }) {
  const { type } = useParams();
  const navigation = findNavigationItem(type);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [source, setSource] = useState<SourceType | ''>('');
  const [sort, setSort] = useState<'recent' | 'name'>('recent');
  const selectedType = all ? undefined : navigation?.type;
  const query = useMemo(() => ({ type: selectedType as AssetType | undefined, search: searchParams.get('search') ?? '', sourceType: source || undefined, sort }), [selectedType, searchParams, source, sort]);
  const loader = useCallback((signal: AbortSignal) => libraryApi.listAssets(query, signal), [query]);
  const { data, error, loading, retry } = useLibraryData(loader, [loader]);
  const Icon = navigation?.icon;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next = new URLSearchParams(searchParams);
    search.trim() ? next.set('search', search.trim()) : next.delete('search');
    setSearchParams(next);
  };

  const title = all ? 'The complete archive' : navigation?.label ?? 'Unknown shelf';
  const description = all ? 'Every record across every shelf, ready to search from one quiet place.' : navigation?.description;

  return (
    <div className="page collection-page">
      <header className="collection-header">
        <div className="collection-header__icon">{Icon ? <Icon /> : <span className="all-shelves-icon">✦</span>}</div>
        <div><span className="eyebrow">{all ? 'All collections' : 'Library collection'}</span><h1>{title}</h1><p>{description}</p></div>
        <span className="collection-header__count">{data?.total ?? '...'} <small>records</small></span>
      </header>

      <div className="filter-bar">
        <form className="collection-search" onSubmit={submit}><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${all ? 'the archive' : title.toLocaleLowerCase()}...`} /></form>
        <label className="select-control"><SlidersHorizontal size={16} /><select value={source} onChange={(event) => setSource(event.target.value as SourceType | '')}><option value="">All sources</option><option value="curated">Curated</option><option value="user-created">User created</option><option value="imported-v2">Imported V2</option><option value="copied">Copied</option></select><ChevronDown size={15} /></label>
        <label className="select-control"><span>Sort:</span><select value={sort} onChange={(event) => setSort(event.target.value as 'recent' | 'name')}><option value="recent">Recently edited</option><option value="name">Name</option></select><ChevronDown size={15} /></label>
      </div>

      {loading && <LoadingState label="Searching the shelves..." />}
      {error && <ErrorState retry={retry} />}
      {data && data.items.length === 0 && <EmptyState search={query.search} />}
      {data && data.items.length > 0 && <div className="asset-grid asset-grid--collection">{data.items.map((asset) => <AssetCard asset={asset} key={asset.id} />)}</div>}
    </div>
  );
}
