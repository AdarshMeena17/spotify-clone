import { NavLink } from 'react-router-dom';
import { Home, Search, Disc3, User, UploadCloud } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function MobileNav() {
  const { isAuthenticated, isArtist } = useAuth();

  const links = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/albums', label: 'Albums', icon: Disc3 },
    isAuthenticated && isArtist
      ? { to: '/upload', label: 'Upload', icon: UploadCloud }
      : { to: isAuthenticated ? '/profile' : '/login', label: isAuthenticated ? 'Profile' : 'Log in', icon: User },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-base-border bg-base-raised/95 backdrop-blur lg:hidden"
      aria-label="Primary"
    >
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1.5 text-[11px] font-medium transition-colors ${
              isActive ? 'text-moss' : 'text-ink-faint'
            }`
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
