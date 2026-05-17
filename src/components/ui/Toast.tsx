import { CheckCircle2, XCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error'

type ToastProps = {
  type: ToastType
  message: string
  onClose: () => void
}

export function Toast({ type, message, onClose }: ToastProps) {
  const isSuccess = type === 'success'

  return (
    <div className="fixed left-4 right-4 top-4 z-[80] mx-auto max-w-md">
      <div
        className={[
          'flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl',
          isSuccess ? 'border-green-100' : 'border-red-100',
        ].join(' ')}
      >
        <div
          className={[
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            isSuccess
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700',
          ].join(' ')}
        >
          {isSuccess ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#10231c]">
            {isSuccess ? 'Success' : 'Error'}
          </p>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-gray-100 p-1.5 text-gray-500"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  )
}