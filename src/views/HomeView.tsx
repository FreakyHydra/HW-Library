import { ArrowDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { libraryApi } from '../api/client';
import { libraryNavigation } from '../app/library-nav';
import { AssetCard } from '../components/AssetCard';
import { ErrorState, LoadingState } from '../components/StatePanel';
import { useLibraryData } from '../hooks/useLibraryData';

export function HomeView() {
  const { data, error, loading, retry } = useLibraryData((signal) => libraryApi.getOverview(signal));

  return (
    <div className="page home-page">
      <section className="banner-gate" aria-label="Welcome to The Howling Whispers Library">
        <img src="/assets/howling-whispers-library-banner.webp" alt="Coda welcomes you to The Howling Whispers Library beneath a moonlit sky" />
        <a className="banner-gate__button" href="#shelves"><span>Enter the Library</span><ArrowDown size={17} /></a>
      </section>

      <section className="section-block" id="shelves">
        <div className="section-heading"><div><span className="eyebrow">Find your way</span><h2>Browse the shelves</h2></div><Link to="/all">View everything <ArrowRight size={16} /></Link></div>
        <div className="category-grid">
          {libraryNavigation.map(({ type, label, description, icon: Icon }) => (
            <Link className="category-tile" to={`/library/${type}`} key={type}>
              <span className="category-tile__icon"><Icon /></span>
              <span><strong>{label}</strong><small>{description}</small></span>
              <ArrowRight className="category-tile__arrow" size={17} />
              {data && <span className="category-tile__count">{data.counts[type]}</span>}
            </Link>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">Recently tended</span><h2>Fresh from the archive</h2></div></div>
        {loading && <LoadingState />}
        {error && <ErrorState retry={retry} />}
        {data && <div className="asset-grid">{data.recent.map((asset) => <AssetCard asset={asset} key={asset.id} />)}</div>}
      </section>

      <section className="quiet-note"><span className="quiet-note__paw">●</span><div><strong>Coda is keeping watch.</strong><p>Your source records stay unchanged when you browse. Project Whispers will open these stories later, when the simulation wing is ready.</p></div></section>
    </div>
  );
}
