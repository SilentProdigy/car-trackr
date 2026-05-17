import { AlertTriangle, X } from 'lucide-react'

type ConfirmModalProps = {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-5">
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700">
            <AlertTriangle size={26} />
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-full bg-gray-100 p-2 text-gray-500 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5">
          <h2 className="text-xl font-bold text-[#10231c]">{title}</h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">{message}</p>
        </div>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-full rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Deleting...' : confirmLabel}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full rounded-2xl bg-gray-100 px-5 py-3 text-sm font-bold text-[#10231c] transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}