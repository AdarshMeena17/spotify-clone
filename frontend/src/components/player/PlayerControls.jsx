import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Spinner } from '../common/Loader';

export function PlayerControls({
  isPlaying,
  isLoading,
  hasNext,
  hasPrevious,
  onPlayPause,
  onNext,
  onPrevious,
  size = 'default',
}) {
  const playBtnSize = size === 'large' ? 'h-12 w-12' : 'h-8 w-8';
  const iconSize = size === 'large' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onPrevious}
        disabled={!hasPrevious && size !== 'large'}
        aria-label="Previous track"
        className="text-ink-dim transition-colors hover:text-ink disabled:opacity-30"
      >
        <SkipBack className={iconSize} fill="currentColor" />
      </button>

      <button
        onClick={onPlayPause}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className={`flex ${playBtnSize} items-center justify-center rounded-full bg-ink text-base transition-transform hover:scale-105 active:scale-95`}
      >
        {isLoading ? (
          <Spinner className={iconSize} />
        ) : isPlaying ? (
          <Pause className={iconSize} fill="currentColor" />
        ) : (
          <Play className={`${iconSize} translate-x-[1px]`} fill="currentColor" />
        )}
      </button>

      <button
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next track"
        className="text-ink-dim transition-colors hover:text-ink disabled:opacity-30"
      >
        <SkipForward className={iconSize} fill="currentColor" />
      </button>
    </div>
  );
}
