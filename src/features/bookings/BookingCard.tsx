import { CalendarDays, CarFront, Trash2 } from 'lucide-react'
import type { Booking, BookingStatus } from '../../types/database'
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from './BookingStatusBadge'

type BookingCardProps = {
  booking: Booking
  onDelete: (bookingId: string) => void
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void
  canEdit?: boolean
  canDelete?: boolean
}

export function BookingCard({
  booking,
  onDelete,
  onUpdateStatus,
  canDelete
}: BookingCardProps) {
  return (
    <article className="rounded-[1.75rem] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#10231c]">
            {booking.customers?.full_name ?? 'Unknown Customer'}
          </h2>

          <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <CarFront size={15} />
            {booking.cars?.car_name ?? 'Unknown Car'}
          </p>
        </div>

        <BookingStatusBadge status={booking.booking_status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <InfoBox label="Pickup" value={booking.pickup_date} />
        <InfoBox label="Return" value={booking.return_date} />
      </div>

      <div className="mt-4 rounded-2xl bg-[#1f3d32] p-4 text-white">
        <AmountRow label="Total Amount" value={booking.total_amount} />
        <AmountRow label="Paid Amount" value={booking.down_payment} />
        <AmountRow label="Balance" value={booking.balance} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <PaymentStatusBadge status={booking.payment_status} />

        <p className="flex items-center gap-2 text-xs text-gray-500">
          <CalendarDays size={14} />
          Created {new Date(booking.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-4 rounded-2xl bg-[#f6f8f7] p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
          Update Status
        </p>

        <div className="grid grid-cols-2 gap-2">
          <StatusButton
            label="Confirmed"
            disabled={booking.booking_status === 'confirmed'}
            onClick={() => onUpdateStatus(booking.id, 'confirmed')}
          />

          <StatusButton
            label="Ongoing"
            disabled={booking.booking_status === 'ongoing'}
            onClick={() => onUpdateStatus(booking.id, 'ongoing')}
          />

          <StatusButton
            label="Completed"
            disabled={booking.booking_status === 'completed'}
            onClick={() => onUpdateStatus(booking.id, 'completed')}
          />

          <StatusButton
            label="Cancelled"
            danger
            disabled={booking.booking_status === 'cancelled'}
            onClick={() => onUpdateStatus(booking.id, 'cancelled')}
          />
        </div>
      </div>

      {booking.notes && (
        <p className="mt-4 rounded-2xl bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          {booking.notes}
        </p>
      )}
      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(booking.id)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
        >
          <Trash2 size={16} />
          Delete Booking
        </button>
      )}
      
    </article>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f6f8f7] px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-[#10231c]">{value}</p>
    </div>
  )
}

function AmountRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-3 first:mt-0 flex justify-between text-sm">
      <span className="opacity-80">{label}</span>
      <span className="font-bold">₱{Number(value).toLocaleString()}</span>
    </div>
  )
}

function StatusButton({
  label,
  danger,
  disabled,
  onClick,
}: {
  label: string
  danger?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        'rounded-xl px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50',
        danger
          ? 'bg-red-50 text-red-700 hover:bg-red-100'
          : 'bg-white text-[#1f3d32] hover:bg-[#e8f0ec]',
      ].join(' ')}
    >
      {label}
    </button>
  )
}