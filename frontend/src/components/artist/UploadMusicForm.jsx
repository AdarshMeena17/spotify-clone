import { useRef, useState } from 'react';
import { UploadCloud, Music2, ImagePlus, CheckCircle2 } from 'lucide-react';
import { uploadMusic, getErrorMessage } from '../../services/api';
import { Spinner } from '../common/Loader';

const AUDIO_ACCEPT = 'audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/*';
const IMAGE_ACCEPT = 'image/png,image/jpeg,image/webp';

export function UploadMusicForm({ onUploaded }) {
  const [title, setTitle] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | loading | success
  const [error, setError] = useState('');
  const audioInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const resetForm = () => {
    setTitle('');
    setAudioFile(null);
    setCoverFile(null);
    setCoverPreview(null);
    setProgress(0);
    if (audioInputRef.current) audioInputRef.current.value = '';
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const handleCoverChange = (file) => {
    setCoverFile(file);
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    } else {
      setCoverPreview(null);
    }
  };

  const validate = () => {
    if (!title.trim()) return 'Give your song a title.';
    if (!audioFile) return 'Choose an audio file to upload.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setStatus('loading');
    try {
      await uploadMusic(
        { title: title.trim(), audioFile, coverImageFile: coverFile },
        (evt) => {
          if (evt.total) setProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      );
      setStatus('success');
      onUploaded?.();
      setTimeout(() => {
        resetForm();
        setStatus('idle');
      }, 1600);
    } catch (err) {
      setError(getErrorMessage(err, 'Upload failed. Please try again.'));
      setStatus('idle');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface p-6 sm:p-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="song-title" className="mb-1.5 block text-sm font-medium text-ink">
            Song title
          </label>
          <input
            id="song-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Midnight Static"
            className="input-field"
            disabled={status === 'loading'}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Audio file</label>
            <label
              htmlFor="audio-upload"
              className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-base-border bg-base-panel px-4 text-center transition-colors hover:border-moss"
            >
              <Music2 className="h-5 w-5 text-ink-faint" />
              <span className="truncate text-xs text-ink-dim">
                {audioFile ? audioFile.name : 'MP3, WAV, or OGG'}
              </span>
              <input
                id="audio-upload"
                ref={audioInputRef}
                type="file"
                accept={AUDIO_ACCEPT}
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className="sr-only"
                disabled={status === 'loading'}
              />
            </label>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Cover image <span className="text-ink-faint">(optional)</span>
            </label>
            <label
              htmlFor="cover-upload"
              className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed border-base-border bg-base-panel px-4 text-center transition-colors hover:border-moss"
            >
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
              ) : (
                <>
                  <ImagePlus className="h-5 w-5 text-ink-faint" />
                  <span className="text-xs text-ink-dim">PNG, JPG, or WEBP</span>
                </>
              )}
              <input
                id="cover-upload"
                ref={coverInputRef}
                type="file"
                accept={IMAGE_ACCEPT}
                onChange={(e) => handleCoverChange(e.target.files?.[0] || null)}
                className="sr-only"
                disabled={status === 'loading'}
              />
            </label>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-signal-danger">
            {error}
          </p>
        )}

        {status === 'loading' && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-hover">
            <div
              className="h-full rounded-full bg-moss transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
          {status === 'loading' ? (
            <>
              <Spinner className="h-4 w-4" /> Uploading… {progress}%
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Uploaded
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4" /> Upload song
            </>
          )}
        </button>
      </div>
    </form>
  );
}
