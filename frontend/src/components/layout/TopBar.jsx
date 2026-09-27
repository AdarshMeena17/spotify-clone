import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, User, LayoutGrid, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function TopBar() {
  const { user, isAuthenticated, isArtist, logout } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    notify('Logged out.', 'success');
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-base-border bg-base/90 px-4 backdrop-blur sm:px-6">
      <button
        onClick={() => navigate('/search')}
        aria-label="Search"
        className="flex flex-1 items-center gap-2 rounded-full border border-base-border bg-base-raised px-4 py-2 text-sm text-ink-faint transition-colors hover:border-ink-faint sm:max-w-xs"
      >
        <Search className="h-4 w-4" />
        Search songs, artists, albums
      </button>

      <div className="relative" ref={menuRef}>
        {isAuthenticated ? (
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-base-border bg-base-raised py-1 pl-1 pr-3 text-sm text-ink transition-colors hover:border-ink-faint"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-moss/20 text-moss">
              <User className="h-3.5 w-3.5" />
            </span>
            <span className="hidden max-w-[8rem] truncate sm:inline">{user?.username}</span>
            <ChevronDown className="h-3.5 w-3.5 text-ink-faint" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button className="btn-ghost" onClick={() => navigate('/login')}>
              Log in
            </button>
            <button className="btn-primary" onClick={() => navigate('/register')}>
              Sign up
            </button>
          </div>
        )}

        {menuOpen && isAuthenticated && (
          <div className="absolute right-0 z-40 mt-2 w-52 animate-fade-in overflow-hidden rounded-lg border border-base-border bg-base-panel shadow-lift">
            <div className="border-b border-base-border px-4 py-3">
              <p className="truncate text-sm font-medium text-ink">{user?.username}</p>
              <p className="truncate text-xs text-ink-faint">{user?.email}</p>
              {isArtist && (
                <span className="mt-1.5 inline-block rounded-full bg-moss/15 px-2 py-0.5 text-[11px] font-medium text-moss">
                  Artist
                </span>
              )}
            </div>
            <button
              onClick={() => {
                navigate('/profile');
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-ink-dim hover:bg-base-hover hover:text-ink"
            >
              <User className="h-4 w-4" /> Profile
            </button>
            {isArtist && (
              <button
                onClick={() => {
                  navigate('/dashboard');
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-ink-dim hover:bg-base-hover hover:text-ink"
              >
                <LayoutGrid className="h-4 w-4" /> Artist dashboard
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-signal-danger hover:bg-base-hover"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
