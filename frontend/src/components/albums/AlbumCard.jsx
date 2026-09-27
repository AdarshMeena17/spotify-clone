import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { CoverImage } from '../common/CoverImage';
import { usePlayer } from '../../context/PlayerContext';

export function AlbumCard({ album }) {
  const player = usePlayer();
  const artistName = typeof album.artist === 'object' ? album.artist?.username : 'Unknown artist';
  const songCount = album.songs?.length || 0;

  const handlePlayAlbum = (e) => {
    e.preventDefault();
    if (songCount > 0) player.playTrack(album.songs[0], album.songs);
  };

  return (
    <Link
      to={`/album/${album._id}`}
      className="group relative block rounded-xl2 border border-base-border bg-base-raised p-3 transition-all hover:-translate-y-0.5 hover:border-base-hover hover:bg-base-panel"
    >
      <div className="relative">
        <CoverImage
          src={album.coverImage}
          alt={album.title}
          seed={album._id}
          className="aspect-square w-full rounded-md object-cover"
        />
        {songCount > 0 && (
          <button
            onClick={handlePlayAlbum}
            aria-label={`Play ${album.title}`}
            className="absolute bottom-2 right-2 flex h-10 w-10 translate-y-1 items-center justify-center rounded-full bg-moss text-base opacity-0 shadow-lift transition-all hover:scale-105 hover:bg-moss-bright group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" />
          </button>
        )}
      </div>
      <div className="mt-3">
        <p className="truncate text-sm font-medium text-ink">{album.title}</p>
        <p className="truncate text-xs text-ink-faint">{artistName}</p>
        <p className="truncate text-xs text-ink-faint">
          {songCount} {songCount === 1 ? 'song' : 'songs'}
        </p>
      </div>
    </Link>
  );
}
