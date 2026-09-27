import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, ArrowLeft, Music2, RefreshCw } from 'lucide-react';
import { getAlbums, getErrorMessage } from '../services/api';
import { CoverImage } from '../components/common/CoverImage';
import { SongRow } from '../components/music/SongRow';
import { EmptyState, ErrorState } from '../components/common/EmptyState';
import { SkeletonRow } from '../components/common/Loader';
import { usePlayer } from '../context/PlayerContext';

export default function AlbumDetails() {
  const { id } = useParams();
  const player = usePlayer();
  const [album, setAlbum] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | not-found | error
  const [error, setError] = useState('');

  // The backend does not expose GET /api/albums/:id, so we load the
  // full album list (which already has songs populated) and select
  // the matching one client-side.
  const load = async () => {
    setStatus('loading');
    try {
      const { albums } = await getAlbums();
      const found = albums.find((a) => a._id === id);
      if (!found) {
        setStatus('not-found');
        return;
      }
      setAlbum(found);
      setStatus('ready');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load this album.'));
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (status === 'loading') {
    return (
      <div className="space-y-6">
        <div className="h-48 w-48 animate-pulse rounded-xl2 bg-base-hover" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'not-found') {
    return (
      <EmptyState
        icon={Music2}
        title="Album not found"
        description="This album may have been removed."
        action={
          <Link to="/albums" className="btn-secondary">
            Back to albums
          </Link>
        }
      />
    );
  }

  if (status === 'error') {
    return (
      <ErrorState
        icon={RefreshCw}
        title="Something went wrong"
        description={error}
        action={
          <button className="btn-secondary" onClick={load}>
            Try again
          </button>
        }
      />
    );
  }

  const artistName = typeof album.artist === 'object' ? album.artist?.username : 'Unknown artist';
  const songs = album.songs || [];

  return (
    <div className="space-y-8">
      <Link to="/albums" className="inline-flex items-center gap-1.5 text-sm text-ink-dim hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to albums
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
        <CoverImage
          src={album.coverImage}
          alt={album.title}
          seed={album._id}
          className="h-40 w-40 shrink-0 rounded-xl2 object-cover shadow-lift sm:h-48 sm:w-48"
          iconClassName="h-10 w-10"
        />
        <div>
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">{album.title}</h1>
          <p className="mt-2 text-sm text-ink-dim">{artistName}</p>
          <p className="text-sm text-ink-dim">
            {songs.length} {songs.length === 1 ? 'song' : 'songs'}
          </p>
          {songs.length > 0 && (
            <button
              onClick={() => player.playTrack(songs[0], songs)}
              className="btn-primary mt-4"
            >
              <Play className="h-4 w-4" fill="currentColor" /> Play album
            </button>
          )}
        </div>
      </div>

      {songs.length === 0 ? (
        <EmptyState icon={Music2} title="This album is empty" description="No songs have been added yet." />
      ) : (
        <div className="space-y-1">
          {songs.map((song, index) => (
            <SongRow key={song._id} song={song} index={index} queue={songs} />
          ))}
        </div>
      )}
    </div>
  );
}
