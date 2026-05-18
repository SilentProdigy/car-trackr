import { Trash2 } from 'lucide-react'
import type { Payment } from '../../types/database'
import { SecureFileButton } from '../../components/ui/SecureFileButton'

type PaymentCardProps = {
  payment: Payment
  onDelete: (paymentId: string) => void
  canEdit?: boolean
  canDelete?: boolean
}

export function PaymentCard({ payment, onDelete, canDelete }: PaymentCardProps) {
  return (
    <article className="rounded-[1.75rem] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#10231c]">
            ₱{Number(payment.amount).toLocaleString()}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {payment.payment_method ?? 'Payment'} • {payment.payment_date}
          </p>
        </div>

        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
          Paid
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-[#f6f8f7] px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
          Booking
        </p>

        <p className="mt-1 text-sm font-bold text-[#10231c]">
          {payment.bookings?.customers?.full_name ?? 'Unknown Customer'}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {payment.bookings?.cars?.car_name ?? 'Unknown Car'}
        </p>
      </div>

      {payment.receipt_url && (
        <SecureFileButton
          bucket="payment-receipts"
          filePath={payment.receipt_url}
          label="View Receipt"
        />
      )}
      {payment.notes && (
        <p className="mt-4 rounded-2xl bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          {payment.notes}
        </p>
      )}

      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(payment.id)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
        >
          <Trash2 size={16} />
          Delete Payment
        </button>
      )}
    </article>
  )
}