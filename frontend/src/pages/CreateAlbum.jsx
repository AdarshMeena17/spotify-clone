import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { CreateAlbumForm } from '../components/artist/CreateAlbumForm';

export default function CreateAlbum() {
  const { notify } = useToast();
  const navigate = useNavigate();

  const handleCreated = () => {
    notify('Album created successfully.', 'success');
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Create an album</h1>
        <p className="mt-1 text-sm text-ink-dim">
          Add songs to it afterward from your artist dashboard.
        </p>
      </div>

      <CreateAlbumForm onCreated={handleCreated} />

      <button
        onClick={() => navigate('/dashboard')}
        className="text-sm font-medium text-ink-dim hover:text-moss"
      >
        Go to your dashboard
      </button>
    </div>
  );
}
