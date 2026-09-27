import { NavLink } from 'react-router-dom';
import { Home, Search, Disc3, UploadCloud, LayoutGrid, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const baseLinks = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/albums', label: 'Albums', icon: Disc3 },
];

export function Sidebar() {
  const { isArtist, isAuthenticated } = useAuth();

  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-base-border bg-base-raised px-4 py-6 lg:flex">
      <div className="flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-moss text-base">
          <Disc3 className="h-4 w-4" strokeWidth={2.5} />
        </div>
        <span className="font-display text-lg font-bold tracking-tight text-ink">Wavelength</span>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {baseLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-base-hover text-ink'
                  : 'text-ink-dim hover:bg-base-hover hover:text-ink'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {isAuthenticated && isArtist && (
        <div className="mt-8">
          <p className="px-3 text-xs font-medium text-ink-faint">For artists</p>
          <nav className="mt-2 flex flex-col gap-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-base-hover text-ink'
                    : 'text-ink-dim hover:bg-base-hover hover:text-ink'
                }`
              }
            >
              <LayoutGrid className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/upload"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-base-hover text-ink'
                    : 'text-ink-dim hover:bg-base-hover hover:text-ink'
                }`
              }
            >
              <UploadCloud className="h-4 w-4" />
              Upload music
            </NavLink>
          </nav>
        </div>
      )}

      <div className="mt-auto">
        <NavLink
          to={isAuthenticated ? '/profile' : '/login'}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-base-hover text-ink' : 'text-ink-dim hover:bg-base-hover hover:text-ink'
            }`
          }
        >
          <User className="h-4 w-4" />
          {isAuthenticated ? 'Profile' : 'Log in'}
        </NavLink>
      </div>
    </aside>
  );
}
