import { Play, Pause, Trash2, Music2 } from 'lucide-react';
import { CoverImage } from '../common/CoverImage';
import { usePlayer } from '../../context/PlayerContext';

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
}

export function SongRow({ song, index, queue, canDelete = false, onDeleteRequest, showCover = true }) {
  const player = usePlayer();
  const isCurrent = player.currentTrack?._id === song._id;
  const isPlayingThis = isCurrent && player.isPlaying;
  const artistName = typeof song.artist === 'object' ? song.artist?.username : 'Unknown artist';

  const handlePlay = () => {
    if (isCurrent) {
      player.togglePlayPause();
    } else {
      player.playTrack(song, queue);
    }
  };

  return (
    <div className="group flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-base-hover sm:gap-4 sm:px-3">
      <button
        onClick={handlePlay}
        aria-label={isPlayingThis ? `Pause ${song.title}` : `Play ${song.title}`}
        className="flex h-6 w-6 shrink-0 items-center justify-center text-ink-faint group-hover:text-ink"
      >
        {typeof index === 'number' && !isCurrent ? (
          <>
            <span className="group-hover:hidden">{index + 1}</span>
            <Play className="hidden h-3.5 w-3.5 group-hover:block" fill="currentColor" />
          </>
        ) : isPlayingThis ? (
          <Pause className="h-3.5 w-3.5 text-moss" fill="currentColor" />
        ) : (
          <Play className="h-3.5 w-3.5 text-moss" fill="currentColor" />
        )}
      </button>

      {showCover && (
        <CoverImage
          src={song.coverImage}
          alt={song.title}
          seed={song._id}
          className="h-10 w-10 shrink-0 rounded object-cover"
          iconClassName="h-4 w-4"
        />
      )}

      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${isCurrent ? 'text-moss' : 'text-ink'}`}>
          {song.title}
        </p>
        <p className="truncate text-xs text-ink-faint">{artistName}</p>
      </div>

      {song.duration ? (
        <span className="hidden shrink-0 text-xs tabular-nums text-ink-faint sm:inline">
          {formatDuration(song.duration)}
        </span>
      ) : null}

      {canDelete && (
        <button
          onClick={() => onDeleteRequest(song)}
          aria-label={`Delete ${song.title}`}
          className="shrink-0 text-ink-faint opacity-0 transition-opacity hover:text-signal-danger group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function SongRowIcon() {
  return <Music2 className="h-4 w-4" />;
}
