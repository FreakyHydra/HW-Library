import { ArrowLeft, Boxes, Clock3, MapPin, Pencil, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { libraryApi } from '../api/client';
import { findNavigationItem } from '../app/library-nav';
import { ErrorState, LoadingState } from '../components/StatePanel';
import { useLibraryData } from '../hooks/useLibraryData';

export function AssetDetailView() {
  const { id = '' } = useParams();
  const { data: asset, error, loading, retry } = useLibraryData((signal) => libraryApi.getAsset(id, signal), [id]);

  if (loading) return <div className="page"><LoadingState label="Opening the record..." /></div>;
  if (error || !asset) return <div className="page"><ErrorState retry={retry} /></div>;

  const category = findNavigationItem(asset.type);
  const Icon = category?.icon;
  return (
    <div className="page detail-page">
      <Link className="back-link" to={`/library/${asset.type}`}><ArrowLeft size={16} /> Back to {category?.label}</Link>
      <section className={`detail-hero tone-${asset.visualTone}`}>
        <div className="detail-hero__art"><span className="visual-orb" /><span className="visual-ridge visual-ridge--back" /><span className="visual-ridge visual-ridge--front" /></div>
        <div className="detail-hero__copy">
          <span className="eyebrow">{Icon && <Icon size={14} />} {category?.shortLabel} record</span>
          <h1>{asset.name}</h1><p>{asset.summary}</p>
          <div className="detail-actions"><button className="button button--primary"><Pencil size={16} /> Edit in Rebrand</button><button className="button button--disabled" disabled title="Project Whispers arrives in a later phase"><Sparkles size={16} /> Simulate later</button></div>
        </div>
      </section>
      <div className="detail-layout">
        <section className="record-panel"><span className="eyebrow">Archive note</span><h2>About this record</h2><p>{asset.summary}</p><div className="tag-row tag-row--large">{asset.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></section>
        <aside className="metadata-panel"><h2>Record details</h2>{asset.originWorldName && <div><MapPin /><span><small>Origin world</small><strong>{asset.originWorldName}</strong></span></div>}<div><Boxes /><span><small>Known dependencies</small><strong>{asset.dependencyCount} connected records</strong></span></div><div><Clock3 /><span><small>Last tended</small><strong>{new Date(asset.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</strong></span></div></aside>
      </div>
    </div>
  );
}
