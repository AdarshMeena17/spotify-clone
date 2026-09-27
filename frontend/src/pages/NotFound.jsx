import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center animate-fade-in">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-base-panel text-ink-faint">
        <Compass className="h-6 w-6" />
      </div>
      <h1 className="font-display text-3xl font-bold text-ink">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-dim">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="btn-primary mt-2">
        Back to home
      </Link>
    </div>
  );
}
