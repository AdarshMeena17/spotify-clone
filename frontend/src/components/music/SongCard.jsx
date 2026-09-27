import { Play, Pause, Trash2 } from 'lucide-react';
import { CoverImage } from '../common/CoverImage';
import { usePlayer } from '../../context/PlayerContext';

export function SongCard({ song, queue, canDelete = false, onDeleteRequest }) {
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
    <div className="group relative rounded-xl2 border border-base-border bg-base-raised p-3 transition-all hover:-translate-y-0.5 hover:border-base-hover hover:bg-base-panel">
      <div className="relative">
        <CoverImage
          src={song.coverImage}
          alt={song.title}
          seed={song._id}
          className="aspect-square w-full rounded-md object-cover"
        />
        <button
          onClick={handlePlay}
          aria-label={isPlayingThis ? `Pause ${song.title}` : `Play ${song.title}`}
          className={`absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-moss text-base shadow-lift transition-all hover:scale-105 hover:bg-moss-bright ${
            isCurrent ? 'opacity-100' : 'opacity-0 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100'
          }`}
        >
          {isPlayingThis ? (
            <Pause className="h-4 w-4" fill="currentColor" />
          ) : (
            <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" />
          )}
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={`truncate text-sm font-medium ${isCurrent ? 'text-moss' : 'text-ink'}`}>
            {song.title}
          </p>
          <p className="truncate text-xs text-ink-faint">{artistName}</p>
        </div>
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
    </div>
  );
}
