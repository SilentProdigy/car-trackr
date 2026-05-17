import type { BookingStatus, PaymentStatus } from '../../types/database'

type BookingStatusBadgeProps = {
  status: BookingStatus
}

type PaymentStatusBadgeProps = {
  status: PaymentStatus
}

const bookingLabels: Record<BookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  ongoing: 'Ongoing',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const bookingClasses: Record<BookingStatus, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  ongoing: 'bg-orange-50 text-orange-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
}

const paymentLabels: Record<PaymentStatus, string> = {
  unpaid: 'Unpaid',
  partial: 'Partial',
  paid: 'Paid',
  refunded: 'Refunded',
}

const paymentClasses: Record<PaymentStatus, string> = {
  unpaid: 'bg-red-50 text-red-700',
  partial: 'bg-yellow-50 text-yellow-700',
  paid: 'bg-green-50 text-green-700',
  refunded: 'bg-gray-100 text-gray-600',
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${bookingClasses[status]}`}
    >
      {bookingLabels[status]}
    </span>
  )
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${paymentClasses[status]}`}
    >
      {paymentLabels[status]}
    </span>
  )
}