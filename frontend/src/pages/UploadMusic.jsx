import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { UploadMusicForm } from '../components/artist/UploadMusicForm';

export default function UploadMusic() {
  const { notify } = useToast();
  const navigate = useNavigate();

  const handleUploaded = () => {
    notify('Song uploaded successfully.', 'success');
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Upload a song</h1>
        <p className="mt-1 text-sm text-ink-dim">
          Your track goes live on Wavelength immediately after upload.
        </p>
      </div>

      <UploadMusicForm onUploaded={handleUploaded} />

      <button
        onClick={() => navigate('/dashboard')}
        className="text-sm font-medium text-ink-dim hover:text-moss"
      >
        View your uploaded songs
      </button>
    </div>
  );
}
