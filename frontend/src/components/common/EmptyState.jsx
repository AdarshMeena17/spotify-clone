export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-base-border px-6 py-16 text-center animate-fade-in">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-base-panel text-ink-faint">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-dim">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({ icon: Icon, title = 'Something went wrong', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-base-border bg-base-raised px-6 py-16 text-center animate-fade-in">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-signal-danger/10 text-signal-danger">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-dim">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
