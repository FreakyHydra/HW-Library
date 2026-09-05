import { Menu, Search, Settings, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { libraryNavigation } from '../app/library-nav';
import { BrandMark } from './BrandMark';

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/all${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ''}`);
  };

  return (
    <div className="app-shell">
      <div className="atmosphere" aria-hidden="true"><span /><span /><span /></div>
      <aside className={`sidebar ${menuOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__top">
          <BrandMark />
          <button className="icon-button sidebar__close" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={20} /></button>
        </div>
        <nav className="library-nav" aria-label="Library collections">
          <NavLink className={({ isActive }) => `library-nav__item ${isActive ? 'is-active' : ''}`} to="/" end>
            <BookGlyph /><span><strong>Library home</strong><small>Your archive at a glance</small></span>
          </NavLink>
          <div className="library-nav__label">Collections</div>
          {libraryNavigation.map(({ type, label, icon: Icon }) => (
            <NavLink key={type} className={({ isActive }) => `library-nav__item ${isActive ? 'is-active' : ''}`} to={`/library/${type}`}>
              <Icon size={18} strokeWidth={1.7} /><span><strong>{label}</strong></span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__footer">
          <div className="api-lamp"><span /> <small>Development archive</small></div>
          <button className="sidebar__settings"><Settings size={17} /> Settings</button>
        </div>
      </aside>

      {menuOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}

      <div className="app-main">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={22} /></button>
          <form className="global-search" onSubmit={submitSearch}>
            <Search size={18} aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search every shelf..." aria-label="Search the whole Library" />
            <kbd>Enter</kbd>
          </form>
          <div className="keeper-badge" title="Coda is keeping watch">
            <span className="keeper-badge__face">ᵔᴥᵔ</span>
            <span><small>Archive keeper</small><strong>Coda</strong></span>
          </div>
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  );
}

function BookGlyph() {
  return <span className="book-glyph" aria-hidden="true"><i /><i /><i /></span>;
}
