import { AlbumCard } from './AlbumCard';

export function AlbumGrid({ albums }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {albums.map((album) => (
        <AlbumCard key={album._id} album={album} />
      ))}
    </div>
  );
}
