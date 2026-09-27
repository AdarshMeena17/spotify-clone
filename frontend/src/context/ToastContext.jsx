import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (message, type = 'info') => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-28 right-4 z-[100] flex flex-col gap-2 sm:bottom-24">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] || Info;
          const accent =
            toast.type === 'success'
              ? 'text-moss'
              : toast.type === 'error'
              ? 'text-signal-danger'
              : 'text-ink-dim';
          return (
            <div
              key={toast.id}
              role="status"
              className="pointer-events-auto flex max-w-sm animate-slide-up items-start gap-3 rounded-lg border border-base-border bg-base-panel px-4 py-3 shadow-lift"
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${accent}`} />
              <p className="text-sm text-ink">{toast.message}</p>
              <button
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="ml-auto text-ink-faint hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
