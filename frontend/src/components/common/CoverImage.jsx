import { useState } from 'react';
import { Music2 } from 'lucide-react';

// Deterministic gradient chosen from the title, so the same song/album
// always gets the same fallback rather than a random one on each render.
const GRADIENTS = [
  'from-moss/40 via-base-panel to-base-raised',
  'from-signal-warn/30 via-base-panel to-base-raised',
  'from-sky-500/25 via-base-panel to-base-raised',
  'from-fuchsia-500/20 via-base-panel to-base-raised',
  'from-moss-dim/35 via-base-panel to-base-raised',
];

function gradientFor(seed = '') {
  const sum = [...seed].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return GRADIENTS[sum % GRADIENTS.length];
}

export function CoverImage({ src, alt, seed, className = '', iconClassName = 'h-6 w-6' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br ${gradientFor(
          seed || alt
        )} ${className}`}
        role="img"
        aria-label={alt}
      >
        <Music2 className={`${iconClassName} text-ink-faint`} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
