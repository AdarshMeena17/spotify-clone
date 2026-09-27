import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Spinner } from './Loader';

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    if (open) document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-xl2 border border-base-border bg-base-panel p-6 shadow-lift animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-signal-danger/10 text-signal-danger">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <h2 id="confirm-modal-title" className="mt-4 text-base font-semibold text-ink">
          {title}
        </h2>
        {description && <p className="mt-1.5 text-sm text-ink-dim">{description}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-ghost" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-full bg-signal-danger px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isLoading && <Spinner className="h-4 w-4" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
