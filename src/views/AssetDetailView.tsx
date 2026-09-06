import { ArrowLeft, Boxes, Clock3, MapPin, Pencil, Sparkles, UserRound } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { libraryApi } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { findNavigationItem } from '../app/library-nav';
import { ErrorState, LoadingState } from '../components/StatePanel';
import { useLibraryData } from '../hooks/useLibraryData';

export function AssetDetailView() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const { data: asset, error, loading, retry } = useLibraryData((signal) => libraryApi.getAsset(id, signal), [id]);

  if (loading) return <div className="page"><LoadingState label="Opening the record..." /></div>;
  if (error || !asset) return <div className="page"><ErrorState retry={retry} /></div>;

  const category = findNavigationItem(asset.type);
  const Icon = category?.icon;
  const canEdit = user?.permissions.canCreate && asset.author?.id === user.id;
  return (
    <div className="page detail-page">
      <Link className="back-link" to={`/library/${asset.type}`}><ArrowLeft size={16} /> Back to {category?.label}</Link>
      <section className={`detail-hero tone-${asset.visualTone}`}>
        <div className="detail-hero__art"><span className="visual-orb" /><span className="visual-ridge visual-ridge--back" /><span className="visual-ridge visual-ridge--front" /></div>
        <div className="detail-hero__copy">
          <span className="eyebrow">{Icon && <Icon size={14} />} {category?.shortLabel} record</span>
          <h1>{asset.name}</h1><p>{asset.summary}</p>
          <div className="detail-actions">{canEdit ? <Link className="button button--primary" to={`/asset/${asset.id}/edit`}><Pencil size={16} /> Edit record</Link> : <button className="button button--disabled" disabled title="Only the verified creator can edit this record"><Pencil size={16} /> Creator protected</button>}<button className="button button--disabled" disabled title="Project Whispers arrives in a later phase"><Sparkles size={16} /> Simulate later</button></div>
        </div>
      </section>
      <div className="detail-layout">
        <section className="record-panel"><span className="eyebrow">Archive note</span><h2>About this record</h2><p>{asset.summary}</p><DocumentContent document={asset.document} /><div className="tag-row tag-row--large">{asset.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></section>
        <aside className="metadata-panel"><h2>Record details</h2>{asset.author && <div>{asset.author.avatarUrl ? <img className="author-avatar" src={asset.author.avatarUrl} alt="" /> : <UserRound />}<span><small>Created by</small><strong>{asset.author.displayName}</strong></span></div>}{asset.originWorldName && <div><MapPin /><span><small>Origin world</small><strong>{asset.originWorldName}</strong></span></div>}<div><Boxes /><span><small>Known dependencies</small><strong>{asset.dependencyCount} connected records</strong></span></div><div><Clock3 /><span><small>Last tended</small><strong>{new Date(asset.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</strong></span></div></aside>
      </div>
    </div>
  );
}

function DocumentContent({ document }: { document?: Record<string, unknown> }) {
  if (!document) return null;
  const hidden = new Set(['id', 'sourceId', 'name', 'title']);
  const entries = Object.entries(document).filter(([key, value]) => !hidden.has(key) && value !== '' && value != null && (!Array.isArray(value) || value.length > 0));
  if (!entries.length) return null;
  return <div className="document-content">{entries.map(([key, value]) => <DocumentValue key={key} label={key} value={value} />)}</div>;
}

function DocumentValue({ label, value }: { label: string; value: unknown }) {
  const heading = label.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase());
  if (Array.isArray(value)) return <section><h3>{heading}</h3>{value.every((item) => typeof item !== 'object') ? <ul>{value.map((item, index) => <li key={index}>{String(item)}</li>)}</ul> : <div className="document-cards">{value.map((item, index) => <DocumentContent document={item as Record<string, unknown>} key={index} />)}</div>}</section>;
  if (value && typeof value === 'object') return <section><h3>{heading}</h3><DocumentContent document={value as Record<string, unknown>} /></section>;
  return <section><h3>{heading}</h3><p>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}</p></section>;
}
