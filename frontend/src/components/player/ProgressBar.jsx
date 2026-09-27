function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
}

export function ProgressBar({ currentTime, duration, onSeek, compact = false }) {
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex w-full items-center gap-2">
      {!compact && (
        <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-ink-faint">
          {formatTime(currentTime)}
        </span>
      )}
      <div className="group relative flex-1">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-label="Seek"
          className="peer relative z-10 h-3 w-full cursor-pointer opacity-0"
        />
        <div className="pointer-events-none absolute inset-y-0 my-auto h-1 w-full rounded-full bg-base-hover">
          <div
            className="h-1 rounded-full bg-ink transition-[width] peer-hover:bg-moss group-hover:bg-moss"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      {!compact && (
        <span className="w-9 shrink-0 text-[11px] tabular-nums text-ink-faint">
          {formatTime(duration)}
        </span>
      )}
    </div>
  );
}
