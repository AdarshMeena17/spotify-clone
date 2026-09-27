import { useRef, useState } from 'react';
import { ImagePlus, CheckCircle2, Disc3 } from 'lucide-react';
import { createAlbum, getErrorMessage } from '../../services/api';
import { Spinner } from '../common/Loader';

const IMAGE_ACCEPT = 'image/png,image/jpeg,image/webp';

export function CreateAlbumForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const coverInputRef = useRef(null);

  const handleCoverChange = (file) => {
    setCoverFile(file);
    setCoverPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Give your album a title.');
      return;
    }
    setError('');
    setStatus('loading');
    try {
      await createAlbum({ title: title.trim(), coverImageFile: coverFile });
      setStatus('success');
      onCreated?.();
      setTimeout(() => {
        setTitle('');
        setCoverFile(null);
        setCoverPreview(null);
        if (coverInputRef.current) coverInputRef.current.value = '';
        setStatus('idle');
      }, 1600);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create album. Please try again.'));
      setStatus('idle');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface p-6 sm:p-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="album-title" className="mb-1.5 block text-sm font-medium text-ink">
            Album title
          </label>
          <input
            id="album-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Nocturne Sessions"
            className="input-field"
            disabled={status === 'loading'}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Album cover <span className="text-ink-faint">(optional)</span>
          </label>
          <label
            htmlFor="album-cover-upload"
            className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed border-base-border bg-base-panel px-4 text-center transition-colors hover:border-moss"
          >
            {coverPreview ? (
              <img src={coverPreview} alt="Album cover preview" className="h-full w-full object-cover" />
            ) : (
              <>
                <ImagePlus className="h-5 w-5 text-ink-faint" />
                <span className="text-xs text-ink-dim">PNG, JPG, or WEBP</span>
              </>
            )}
            <input
              id="album-cover-upload"
              ref={coverInputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              onChange={(e) => handleCoverChange(e.target.files?.[0] || null)}
              className="sr-only"
              disabled={status === 'loading'}
            />
          </label>
        </div>

        {error && (
          <p role="alert" className="text-sm text-signal-danger">
            {error}
          </p>
        )}

        <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
          {status === 'loading' ? (
            <>
              <Spinner className="h-4 w-4" /> Creating…
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Album created
            </>
          ) : (
            <>
              <Disc3 className="h-4 w-4" /> Create album
            </>
          )}
        </button>
      </div>
    </form>
  );
}
