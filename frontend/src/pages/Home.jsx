import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Music2, Disc3, History, RefreshCw } from 'lucide-react';
import { getMusic, getAlbums, getErrorMessage } from '../services/api';
import { SongGrid } from '../components/music/SongGrid';
import { AlbumGrid } from '../components/albums/AlbumGrid';
import { SkeletonGrid } from '../components/common/Loader';
import { EmptyState, ErrorState } from '../components/common/EmptyState';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const { recentlyPlayed } = usePlayer();
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState('');

  const load = async () => {
    setStatus('loading');
    try {
      const [musicRes, albumsRes] = await Promise.all([getMusic(), getAlbums()]);
      setSongs(musicRes.music || []);
      setAlbums(albumsRes.albums || []);
      setStatus('ready');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load your library.'));
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const greeting = user ? `Welcome back, ${user.username}` : 'Welcome to Wavelength';

  if (status === 'error') {
    return (
      <ErrorState
        icon={RefreshCw}
        title="Couldn't load your library"
        description={error}
        action={
          <button className="btn-secondary" onClick={load}>
            Try again
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{greeting}</h1>
        <p className="mt-1 text-sm text-ink-dim">Here's what's playing across Wavelength.</p>
      </div>

      {recentlyPlayed.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <History className="h-4 w-4 text-ink-faint" />
            <h2 className="text-lg font-semibold text-ink">Recently played</h2>
          </div>
          <SongGrid songs={recentlyPlayed} />
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Latest music</h2>
          {songs.length > 0 && (
            <Link to="/search" className="text-sm font-medium text-ink-dim hover:text-moss">
              View all
            </Link>
          )}
        </div>
        {status === 'loading' ? (
          <SkeletonGrid />
        ) : songs.length === 0 ? (
          <EmptyState
            icon={Music2}
            title="No songs yet"
            description="Once artists start uploading, their tracks will show up here."
          />
        ) : (
          <SongGrid songs={songs.slice(0, 10)} />
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Albums</h2>
          {albums.length > 0 && (
            <Link to="/albums" className="text-sm font-medium text-ink-dim hover:text-moss">
              View all
            </Link>
          )}
        </div>
        {status === 'loading' ? (
          <SkeletonGrid />
        ) : albums.length === 0 ? (
          <EmptyState
            icon={Disc3}
            title="No albums yet"
            description="Artist-created albums will appear here once they're published."
          />
        ) : (
          <AlbumGrid albums={albums.slice(0, 10)} />
        )}
      </section>
    </div>
  );
}
