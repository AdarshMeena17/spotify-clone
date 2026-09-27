import { useEffect, useMemo, useState } from 'react';
import { SearchX, RefreshCw } from 'lucide-react';
import { getMusic, getAlbums, getErrorMessage } from '../services/api';
import { SearchBar } from '../components/music/SearchBar';
import { SongGrid } from '../components/music/SongGrid';
import { AlbumGrid } from '../components/albums/AlbumGrid';
import { SkeletonGrid } from '../components/common/Loader';
import { EmptyState, ErrorState } from '../components/common/EmptyState';

export default function Search() {
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const load = async () => {
    setStatus('loading');
    try {
      const [musicRes, albumsRes] = await Promise.all([getMusic(), getAlbums()]);
      setSongs(musicRes.music || []);
      setAlbums(albumsRes.albums || []);
      setStatus('ready');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load search results.'));
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredSongs = useMemo(() => {
    if (!normalizedQuery) return songs;
    return songs.filter((song) => {
      const artistName = typeof song.artist === 'object' ? song.artist?.username : '';
      return (
        song.title?.toLowerCase().includes(normalizedQuery) ||
        artistName?.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [songs, normalizedQuery]);

  const filteredAlbums = useMemo(() => {
    if (!normalizedQuery) return albums;
    return albums.filter((album) => {
      const artistName = typeof album.artist === 'object' ? album.artist?.username : '';
      return (
        album.title?.toLowerCase().includes(normalizedQuery) ||
        artistName?.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [albums, normalizedQuery]);

  const noResults = normalizedQuery && filteredSongs.length === 0 && filteredAlbums.length === 0;

  if (status === 'error') {
    return (
      <ErrorState
        icon={RefreshCw}
        title="Search is unavailable"
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
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Search</h1>
        <p className="mt-1 text-sm text-ink-dim">Filters songs and albums already loaded from your library.</p>
        <div className="mt-4 max-w-xl">
          <SearchBar value={query} onChange={setQuery} autoFocus />
        </div>
      </div>

      {status === 'loading' ? (
        <SkeletonGrid />
      ) : noResults ? (
        <EmptyState
          icon={SearchX}
          title={`No results for "${query}"`}
          description="Try a different song title, artist name, or album title."
        />
      ) : (
        <>
          {filteredSongs.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-ink">Songs</h2>
              <SongGrid songs={filteredSongs} />
            </section>
          )}
          {filteredAlbums.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-ink">Albums</h2>
              <AlbumGrid albums={filteredAlbums} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
