import { useState } from 'react'
import type React from 'react'
import { X } from 'lucide-react'
import { PrimaryButton } from '../../components/ui/PrimaryButton'
import type { Booking, PaymentFormData } from '../../types/database'

type AddPaymentFormProps = {
  bookings: Booking[]
  onSubmit: (
    formData: PaymentFormData,
    receiptFile?: File | null,
  ) => Promise<void>
  onClose: () => void
}

const initialFormData: PaymentFormData = {
  booking_id: '',
  amount: '',
  payment_method: 'Cash',
  payment_date: new Date().toISOString().slice(0, 10),
  notes: '',
}

export function AddPaymentForm({
  bookings,
  onSubmit,
  onClose,
}: AddPaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>(initialFormData)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedBooking = bookings.find(
    (booking) => booking.id === formData.booking_id,
  )

  function updateField<K extends keyof PaymentFormData>(
    key: K,
    value: PaymentFormData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formData.booking_id) {
      setErrorMessage('Please select a booking.')
      return
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setErrorMessage('Please enter a valid payment amount.')
      return
    }

    setErrorMessage('')
    setLoading(true)

    try {
      await onSubmit(formData, receiptFile)
      setFormData(initialFormData)
      setReceiptFile(null)
      onClose()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save payment.'
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 px-4 py-6">
      <div className="mx-auto flex h-full max-w-md flex-col rounded-[2rem] bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-[#10231c]">Add Payment</h2>
            <p className="text-xs text-gray-500">
              Record customer payment for a booking.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-gray-100 p-2 text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            {errorMessage && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Booking
              </span>

              <select
                value={formData.booking_id}
                onChange={(event) =>
                  updateField('booking_id', event.target.value)
                }
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
              >
                <option value="">Select booking</option>
                {bookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.customers?.full_name ?? 'Customer'} —{' '}
                    {booking.cars?.car_name ?? 'Car'} — Balance ₱
                    {Number(booking.balance).toLocaleString()}
                  </option>
                ))}
              </select>
            </label>

            {selectedBooking && (
              <div className="rounded-[1.5rem] bg-[#f6f8f7] p-4">
                <p className="text-sm font-bold text-[#10231c]">
                  {selectedBooking.customers?.full_name}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedBooking.cars?.car_name}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <InfoBox
                    label="Total"
                    value={`₱${Number(
                      selectedBooking.total_amount,
                    ).toLocaleString()}`}
                  />
                  <InfoBox
                    label="Balance"
                    value={`₱${Number(
                      selectedBooking.balance,
                    ).toLocaleString()}`}
                  />
                </div>
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Amount paid
              </span>

              <input
                type="number"
                value={formData.amount}
                placeholder="1000"
                onChange={(event) => updateField('amount', event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                  Method
                </span>

                <select
                  value={formData.payment_method}
                  onChange={(event) =>
                    updateField('payment_method', event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
                >
                  <option value="Cash">Cash</option>
                  <option value="GCash">GCash</option>
                  <option value="Maya">Maya</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                  Date
                </span>

                <input
                  type="date"
                  value={formData.payment_date}
                  onChange={(event) =>
                    updateField('payment_date', event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Receipt upload
              </span>

              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(event) =>
                  setReceiptFile(event.target.files?.[0] ?? null)
                }
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Notes
              </span>

              <textarea
                value={formData.notes}
                placeholder="Optional notes"
                onChange={(event) => updateField('notes', event.target.value)}
                className="min-h-24 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
              />
            </label>
          </div>

          <div className="sticky bottom-0 mt-6 bg-white pb-1 pt-4">
            <PrimaryButton type="submit" loading={loading}>
              Save Payment
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-[#10231c]">{value}</p>
    </div>
  )
}