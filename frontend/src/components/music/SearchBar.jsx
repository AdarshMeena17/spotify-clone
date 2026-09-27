import { Search, X } from 'lucide-react';

export function SearchBar({ value, onChange, placeholder = 'Search songs, artists, albums', autoFocus = false }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search"
        className="w-full rounded-full border border-base-border bg-base-raised py-3 pl-11 pr-10 text-sm text-ink placeholder:text-ink-faint focus:border-moss focus:outline-none"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
