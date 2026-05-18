import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

type ReasonModalProps = {
  open: boolean
  title: string
  description?: string
  label?: string
  placeholder?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  defaultValue?: string
  onClose: () => void
  onConfirm: (value: string) => void
}

export function ReasonModal({
  open,
  title,
  description,
  label = 'Reason',
  placeholder = 'Enter reason...',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  defaultValue = '',
  onClose,
  onConfirm,
}: ReasonModalProps) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    if (open) {
      setValue(defaultValue)
    }
  }, [open, defaultValue])

  if (!open) return null

  function handleConfirm() {
    onConfirm(value.trim())
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 px-4 py-6">
      <div className="mx-auto mt-10 w-full max-w-md rounded-[2rem] bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-[#10231c]">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full bg-gray-100 p-2 text-gray-600 disabled:opacity-60"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#10231c]">
              {label}
            </span>

            <textarea
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={placeholder}
              rows={4}
              disabled={loading}
              className="min-h-28 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20 disabled:opacity-60"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-2xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700 disabled:opacity-60"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}