import { useState } from 'react';
import { ListPlus, CheckCircle2 } from 'lucide-react';
import { addSongToAlbum, getErrorMessage } from '../../services/api';
import { Spinner } from '../common/Loader';

export function AddSongToAlbumForm({ albums, songs, onAdded }) {
  const [albumId, setAlbumId] = useState('');
  const [songId, setSongId] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!albumId || !songId) {
      setError('Choose both an album and a song.');
      return;
    }
    setError('');
    setStatus('loading');
    try {
      await addSongToAlbum(albumId, songId);
      setStatus('success');
      onAdded?.();
      setTimeout(() => {
        setSongId('');
        setStatus('idle');
      }, 1400);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not add song to album.'));
      setStatus('idle');
    }
  };

  if (!albums.length || !songs.length) {
    return (
      <p className="text-sm text-ink-dim">
        You need at least one album and one uploaded song before you can add tracks to an album.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface space-y-5 p-6 sm:p-8">
      <div>
        <label htmlFor="album-select" className="mb-1.5 block text-sm font-medium text-ink">
          Album
        </label>
        <select
          id="album-select"
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
          className="input-field"
        >
          <option value="">Select an album</option>
          {albums.map((album) => (
            <option key={album._id} value={album._id}>
              {album.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="song-select" className="mb-1.5 block text-sm font-medium text-ink">
          Song
        </label>
        <select
          id="song-select"
          value={songId}
          onChange={(e) => setSongId(e.target.value)}
          className="input-field"
        >
          <option value="">Select a song</option>
          {songs.map((song) => (
            <option key={song._id} value={song._id}>
              {song.title}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p role="alert" className="text-sm text-signal-danger">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === 'loading'} className="btn-secondary w-full">
        {status === 'loading' ? (
          <>
            <Spinner className="h-4 w-4" /> Adding…
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle2 className="h-4 w-4" /> Added to album
          </>
        ) : (
          <>
            <ListPlus className="h-4 w-4" /> Add to album
          </>
        )}
      </button>
    </form>
  );
}
