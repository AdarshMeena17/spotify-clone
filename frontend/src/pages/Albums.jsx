import { useEffect, useState } from 'react';
import { Disc3, RefreshCw } from 'lucide-react';
import { getAlbums, getErrorMessage } from '../services/api';
import { AlbumGrid } from '../components/albums/AlbumGrid';
import { SkeletonGrid } from '../components/common/Loader';
import { EmptyState, ErrorState } from '../components/common/EmptyState';

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const load = async () => {
    setStatus('loading');
    try {
      const { albums: data } = await getAlbums();
      setAlbums(data || []);
      setStatus('ready');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load albums.'));
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Albums</h1>

      {status === 'loading' ? (
        <SkeletonGrid />
      ) : status === 'error' ? (
        <ErrorState
          icon={RefreshCw}
          title="Couldn't load albums"
          description={error}
          action={
            <button className="btn-secondary" onClick={load}>
              Try again
            </button>
          }
        />
      ) : albums.length === 0 ? (
        <EmptyState
          icon={Disc3}
          title="No albums yet"
          description="Albums created by artists will show up here."
        />
      ) : (
        <AlbumGrid albums={albums} />
      )}
    </div>
  );
}
