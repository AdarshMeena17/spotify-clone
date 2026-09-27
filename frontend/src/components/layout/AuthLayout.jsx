import { Link } from 'react-router-dom';
import { Disc3 } from 'lucide-react';

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen bg-base">
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-moss-dim/25 via-base to-base p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-moss text-base">
            <Disc3 className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-ink">Wavelength</span>
        </Link>
        <div className="max-w-md">
          <h1 className="font-display text-4xl font-bold leading-tight text-ink">
            Every track you upload, one place to play it.
          </h1>
          <p className="mt-4 text-ink-dim">
            Wavelength connects listeners with the artists behind every song — real uploads, real
            playback, no filler.
          </p>
        </div>
        <p className="text-xs text-ink-faint">© {new Date().getFullYear()} Wavelength</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-moss text-base">
              <Disc3 className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-ink">Wavelength</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
          {subtitle && <p className="mt-1.5 text-sm text-ink-dim">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
