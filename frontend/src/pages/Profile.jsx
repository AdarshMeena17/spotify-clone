import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

export default function Profile() {
  const { user, isArtist, logout } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    notify('Logged out.', 'success');
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Your account</h1>
        <p className="mt-1 text-sm text-ink-dim">
          Account details are read-only for now — profile editing isn't available yet.
        </p>
      </div>

      <div className="card-surface p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-moss/15 text-moss">
            <User className="h-7 w-7" />
          </div>
          <div>
            <p className="text-lg font-semibold text-ink">{user?.username}</p>
            {isArtist && (
              <span className="mt-1 inline-block rounded-full bg-moss/15 px-2.5 py-0.5 text-xs font-medium text-moss">
                Artist account
              </span>
            )}
          </div>
        </div>

        <dl className="mt-6 divide-y divide-base-border border-t border-base-border">
          <div className="flex items-center justify-between py-3">
            <dt className="flex items-center gap-2 text-sm text-ink-dim">
              <Mail className="h-4 w-4" /> Email
            </dt>
            <dd className="text-sm text-ink">{user?.email}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="flex items-center gap-2 text-sm text-ink-dim">
              <Shield className="h-4 w-4" /> Role
            </dt>
            <dd className="text-sm capitalize text-ink">{user?.role}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="flex items-center gap-2 text-sm text-ink-dim">
              <Calendar className="h-4 w-4" /> Member since
            </dt>
            <dd className="text-sm text-ink">{formatDate(user?.createdAt)}</dd>
          </div>
        </dl>
      </div>

      <button onClick={handleLogout} className="btn-secondary w-full text-signal-danger">
        <LogOut className="h-4 w-4" /> Log out
      </button>
    </div>
  );
}
