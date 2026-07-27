"use client";

type Props = {
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  title,
  message,
  confirmLabel = "Eliminar",
  variant = "danger",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-xl max-w-[400px] w-[90%] p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              variant === "danger" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="text-sm text-[var(--color-muted)] mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="bg-[var(--color-surface-elevated)] rounded-full px-4 py-2 text-sm font-semibold hover:bg-[var(--color-border-soft)] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              variant === "danger"
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-amber-500 text-white hover:bg-amber-600"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
