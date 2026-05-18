import { useMemo, useState } from 'react'
import type React from 'react'
import { X } from 'lucide-react'
import { PrimaryButton } from '../../components/ui/PrimaryButton'
import type {
  BookingFormData,
  BookingStatus,
  Car,
  Customer,
  PaymentStatus,
} from '../../types/database'
import { calculateRentalDays } from './bookingsApi'
import { calculateBalance, parseMoney } from '../../lib/money'

type AddBookingFormProps = {
  cars: Car[]
  customers: Customer[]
  onSubmit: (formData: BookingFormData) => Promise<void>
  onClose: () => void
}

const initialFormData: BookingFormData = {
  car_id: '',
  customer_id: '',
  pickup_date: '',
  return_date: '',
  daily_rate: '',
  down_payment: '',
  booking_status: 'pending',
  payment_status: 'unpaid',
  notes: '',
}

export function AddBookingForm({
  cars,
  customers,
  onSubmit,
  onClose,
}: AddBookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>(initialFormData)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedCar = cars.find((car) => car.id === formData.car_id)

  const rentalDays = useMemo(() => {
    return calculateRentalDays(formData.pickup_date, formData.return_date)
  }, [formData.pickup_date, formData.return_date])

  const dailyRate = parseMoney(formData.daily_rate)
  const downPayment = parseMoney(formData.down_payment)
  const totalAmount = parseMoney(rentalDays * dailyRate)
  const balance = calculateBalance(totalAmount, downPayment)

  function updateField<K extends keyof BookingFormData>(
    key: K,
    value: BookingFormData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function handleCarChange(carId: string) {
    const car = cars.find((item) => item.id === carId)

    setFormData((current) => ({
      ...current,
      car_id: carId,
      daily_rate: car ? String(car.daily_rate) : '',
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formData.car_id) {
      setErrorMessage('Please select a car.')
      return
    }

    if (!formData.customer_id) {
      setErrorMessage('Please select a customer.')
      return
    }

    if (!formData.pickup_date || !formData.return_date) {
      setErrorMessage('Please select pickup and return dates.')
      return
    }

    setErrorMessage('')
    setLoading(true)

    try {
      await onSubmit(formData)
      setFormData(initialFormData)
      onClose()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create booking.'
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
            <h2 className="text-lg font-bold text-[#10231c]">Add Booking</h2>
            <p className="text-xs text-gray-500">
              Create a rental reservation.
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
                Customer
              </span>

              <select
                value={formData.customer_id}
                onChange={(event) =>
                  updateField('customer_id', event.target.value)
                }
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.full_name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Car
              </span>

              <select
                value={formData.car_id}
                onChange={(event) => handleCarChange(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
              >
                <option value="">Select car</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.car_name} — {car.plate_number} — ₱
                    {Number(car.daily_rate).toLocaleString()}
                  </option>
                ))}
              </select>
            </label>

            {selectedCar && (
              <div className="rounded-2xl bg-[#f6f8f7] px-4 py-3 text-sm text-[#10231c]">
                <p className="font-bold">{selectedCar.car_name}</p>
                <p className="mt-1 text-gray-500">
                  Plate: {selectedCar.plate_number}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                  Pickup date
                </span>

                <input
                  type="date"
                  value={formData.pickup_date}
                  onChange={(event) =>
                    updateField('pickup_date', event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                  Return date
                </span>

                <input
                  type="date"
                  value={formData.return_date}
                  onChange={(event) =>
                    updateField('return_date', event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                  Daily rate
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.daily_rate}
                  onWheel={(event) => event.currentTarget.blur()}
                  onChange={(event) =>
                    updateField('daily_rate', event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                  Down payment
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.down_payment}
                  onWheel={(event) => event.currentTarget.blur()}
                  onChange={(event) =>
                    updateField('down_payment', event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
                />
              </label>
            </div>

            <div className="rounded-[1.5rem] bg-[#1f3d32] p-4 text-white">
              <div className="flex justify-between text-sm">
                <span className="opacity-80">Rental Days</span>
                <span className="font-bold">{rentalDays}</span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="opacity-80">Total Amount</span>
                <span className="font-bold">
                  ₱{Number(totalAmount).toLocaleString()}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="opacity-80">Balance</span>
                <span className="font-bold">
                  ₱{Number(balance).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                  Booking status
                </span>

                <select
                  value={formData.booking_status}
                  onChange={(event) =>
                    updateField(
                      'booking_status',
                      event.target.value as BookingStatus,
                    )
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                  Payment status
                </span>

                <select
                  value={formData.payment_status}
                  onChange={(event) =>
                    updateField(
                      'payment_status',
                      event.target.value as PaymentStatus,
                    )
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
              </label>
            </div>

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
              Save Booking
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  )
}