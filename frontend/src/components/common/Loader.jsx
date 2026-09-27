import { Loader2 } from 'lucide-react';

export function Spinner({ className = '' }) {
  return <Loader2 className={`animate-spin ${className}`} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="animate-fade-in rounded-xl2 border border-base-border bg-base-raised p-3">
      <div className="aspect-square w-full animate-pulse rounded-md bg-base-hover" />
      <div className="mt-3 h-3.5 w-3/4 animate-pulse rounded bg-base-hover" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-base-hover" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex animate-fade-in items-center gap-3 rounded-md px-3 py-2">
      <div className="h-10 w-10 shrink-0 animate-pulse rounded bg-base-hover" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/3 animate-pulse rounded bg-base-hover" />
        <div className="h-2.5 w-1/4 animate-pulse rounded bg-base-hover" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function FullscreenLoader({ label = 'Loading Wavelength…' }) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-base">
      <div className="flex items-end gap-1">
        <span className="h-6 w-1.5 origin-bottom animate-bar-1 rounded-full bg-moss" />
        <span className="h-6 w-1.5 origin-bottom animate-bar-2 rounded-full bg-moss" />
        <span className="h-6 w-1.5 origin-bottom animate-bar-3 rounded-full bg-moss" />
      </div>
      <p className="text-sm text-ink-dim">{label}</p>
    </div>
  );
}
