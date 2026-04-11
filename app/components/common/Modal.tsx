export function Modal({
  title,
  description,
  onClose,
  onOk,
  children,
}: {
  title: string;
  description: string;
  onClose?: () => void;
  onOk?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-xl overflow-y-auto overflow-x-hidden rounded-3xl border border-white/60 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {description}
            </p>
          </div>

          <button
            className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        {children}

        {onOk && (
          <div className="mt-6 flex justify-end gap-3">
            <button
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
              onClick={onOk}
            >
              Ok
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
