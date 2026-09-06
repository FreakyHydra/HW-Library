import { LogIn, Menu, Search, Settings, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { libraryNavigation } from '../app/library-nav';
import { BrandMark } from './BrandMark';
import { discordLoginPath, useAuth } from '../auth/AuthContext';
import { UserAvatar } from './UserAvatar';

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

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
            <BookGlyph /><span><strong>Orbis home</strong><small>Your archive at a glance</small></span>
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
          <NavLink className="sidebar__settings" to="/account"><Settings size={17} /> Account</NavLink>
        </div>
      </aside>

      {menuOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}

      <div className="app-main">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={22} /></button>
          <form className="global-search" onSubmit={submitSearch}>
            <Search size={18} aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search every shelf..." aria-label="Search all of Orbis" />
            <kbd>Enter</kbd>
          </form>
          {user ? (
            <NavLink className="keeper-badge keeper-badge--user" to="/account" title="Open your Orbis account">
              <UserAvatar user={user} />
              <span><small>{user.permissions.canCreate ? 'Verified creator' : 'SFW access'}</small><strong>{user.displayName}</strong></span>
              {user.permissions.canCreate && <ShieldCheck className="keeper-badge__verified" size={15} />}
            </NavLink>
          ) : (
            <a className={`discord-login ${authLoading ? 'is-loading' : ''}`} href={discordLoginPath(location.pathname)}><LogIn size={16} /><span>Sign in with Discord</span></a>
          )}
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  );
}

function BookGlyph() {
  return <span className="book-glyph" aria-hidden="true"><i /><i /><i /></span>;
}
