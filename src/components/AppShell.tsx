import { LogIn, Menu, Search, Settings, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { libraryNavigation } from '../app/library-nav';
import { BrandMark } from './BrandMark';
import { discordLoginPath, useAuth } from '../auth/AuthContext';
import { projectList } from '../data/projects';
import { UserAvatar } from './UserAvatar';

function formatCountdown(targetIso: string, now: number) {
  const remaining = Math.max(0, new Date(targetIso).getTime() - now);
  if (remaining === 0) return 'CONCEPT LIVE';
  const totalMinutes = Math.floor(remaining / 60_000);
  const days = Math.floor(totalMinutes / 1_440);
  const hours = Math.floor((totalMinutes % 1_440) / 60);
  const minutes = totalMinutes % 60;
  return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
}

function ProjectEtas() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="project-etas" aria-label="Upcoming project release estimates">
      {projectList.map((project) => (
        <NavLink
          key={project.slug}
          className={`project-eta project-eta--${project.slug}`}
          to={`/projects/${project.slug}`}
          title={`${project.name} ${project.releaseLabel} target: ${project.targetLabel}`}
        >
          <span className="project-eta__name">{project.name}</span>
          <strong className="project-eta__time" aria-live="polite">{formatCountdown(project.targetIso, now)}</strong>
          <small>{project.targetLabel.toUpperCase()} · {project.releaseLabel.toUpperCase()}</small>
        </NavLink>
      ))}
    </div>
  );
}

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
            <BookGlyph /><span><strong>Coda home</strong><small>Your archive at a glance</small></span>
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
          {user?.permissions.canAdmin && <NavLink className="sidebar__settings" to="/admin"><SlidersHorizontal size={17} /> Administration</NavLink>}
          <NavLink className="sidebar__settings" to="/account"><Settings size={17} /> Account</NavLink>
        </div>
      </aside>

      {menuOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}

      <div className="app-main">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={22} /></button>
          <form className="global-search" onSubmit={submitSearch}>
            <Search size={18} aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search every shelf..." aria-label="Search all of Coda" />
            <kbd>Enter</kbd>
          </form>
          <ProjectEtas />
          {user ? (
            <NavLink className="keeper-badge keeper-badge--user" to="/account" title="Open your Coda account">
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
