import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Disc3, Music2, RefreshCw } from 'lucide-react';
import { getMusic, getAlbums, deleteMusic, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { usePlayer } from '../context/PlayerContext';
import { SongRow } from '../components/music/SongRow';
import { AlbumGrid } from '../components/albums/AlbumGrid';
import { AddSongToAlbumForm } from '../components/artist/AddSongToAlbumForm';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { SkeletonRow, SkeletonGrid } from '../components/common/Loader';
import { EmptyState, ErrorState } from '../components/common/EmptyState';

export default function ArtistDashboard() {
  const { user } = useAuth();
  const { notify } = useToast();
  const player = usePlayer();

  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setStatus('loading');
    try {
      const [musicRes, albumsRes] = await Promise.all([getMusic(), getAlbums()]);
      setSongs(musicRes.music || []);
      setAlbums(albumsRes.albums || []);
      setStatus('ready');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load your dashboard.'));
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mySongs = songs.filter((song) => {
    const artistId = typeof song.artist === 'object' ? song.artist?._id : song.artist;
    return artistId === user?.id;
  });

  const myAlbums = albums.filter((album) => {
    const artistId = typeof album.artist === 'object' ? album.artist?._id : album.artist;
    return artistId === user?.id;
  });

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteMusic(pendingDelete._id);
      setSongs((prev) => prev.filter((s) => s._id !== pendingDelete._id));
      player.removeTrackFromPlayer(pendingDelete._id);
      notify('Song deleted.', 'success');
      setPendingDelete(null);
    } catch (err) {
      notify(getErrorMessage(err, 'Could not delete this song.'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (status === 'error') {
    return (
      <ErrorState
        icon={RefreshCw}
        title="Couldn't load your dashboard"
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Artist dashboard</h1>
          <p className="mt-1 text-sm text-ink-dim">Manage the songs and albums you've published.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/upload" className="btn-secondary">
            <UploadCloud className="h-4 w-4" /> Upload song
          </Link>
          <Link to="/create-album" className="btn-primary">
            <Disc3 className="h-4 w-4" /> New album
          </Link>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-ink">Your songs</h2>
        {status === 'loading' ? (
          <div className="space-y-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : mySongs.length === 0 ? (
          <EmptyState
            icon={Music2}
            title="No songs uploaded yet"
            description="Upload your first track to see it here."
            action={
              <Link to="/upload" className="btn-primary">
                Upload a song
              </Link>
            }
          />
        ) : (
          <div className="card-surface divide-y divide-base-border p-2">
            {mySongs.map((song, index) => (
              <SongRow
                key={song._id}
                song={song}
                index={index}
                queue={mySongs}
                canDelete
                onDeleteRequest={setPendingDelete}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-ink">Your albums</h2>
        {status === 'loading' ? (
          <SkeletonGrid count={4} />
        ) : myAlbums.length === 0 ? (
          <EmptyState
            icon={Disc3}
            title="No albums yet"
            description="Group your songs into an album for listeners to browse."
            action={
              <Link to="/create-album" className="btn-primary">
                Create an album
              </Link>
            }
          />
        ) : (
          <AlbumGrid albums={myAlbums} />
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-ink">Add a song to an album</h2>
        <AddSongToAlbumForm albums={myAlbums} songs={mySongs} onAdded={load} />
      </section>

      <ConfirmModal
        open={!!pendingDelete}
        title={`Delete "${pendingDelete?.title}"?`}
        description="This will permanently remove the song from Wavelength. This can't be undone."
        confirmLabel="Delete song"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
