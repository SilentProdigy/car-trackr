import { useMemo, useState } from 'react'
import { CalendarDays, Search } from 'lucide-react'
import type { Booking, Car } from '../../types/database'
import { CarStatusBadge } from '../cars/CarStatusBadge'

type AvailabilityCalendarProps = {
  cars: Car[]
  bookings: Booking[]
}

export function AvailabilityCalendar({
  cars,
  bookings,
}: AvailabilityCalendarProps) {
  const today = new Date().toISOString().slice(0, 10)

  const [selectedDate, setSelectedDate] = useState(today)
  const [searchTerm, setSearchTerm] = useState('')

  const availability = useMemo(() => {
    return cars
      .filter((car) => {
        const search = searchTerm.toLowerCase()

        return (
          car.car_name.toLowerCase().includes(search) ||
          car.plate_number.toLowerCase().includes(search) ||
          car.brand?.toLowerCase().includes(search) ||
          car.model?.toLowerCase().includes(search)
        )
      })
      .map((car) => {
        const activeBooking = bookings.find((booking) => {
          const isSameCar = booking.car_id === car.id
          const isActiveStatus = ['pending', 'confirmed', 'ongoing'].includes(
            booking.booking_status,
          )

          const overlaps =
            booking.pickup_date <= selectedDate &&
            booking.return_date >= selectedDate

          return isSameCar && isActiveStatus && overlaps
        })

        return {
          car,
          activeBooking,
          isAvailable:
            !activeBooking &&
            car.status !== 'maintenance' &&
            car.status !== 'inactive',
        }
      })
  }, [cars, bookings, selectedDate, searchTerm])

  const availableCount = availability.filter((item) => item.isAvailable).length
  const unavailableCount = availability.length - availableCount

  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#416b57]">
            Availability
          </p>
          <h2 className="mt-1 text-xl font-bold text-[#10231c]">
            Car Availability Calendar
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Check which cars are available on a selected date.
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f0ec] text-[#1f3d32]">
          <CalendarDays size={24} />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#10231c]">
            Select date
          </span>

          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
          />
        </label>

        <label className="flex items-center gap-3 rounded-2xl bg-[#f6f8f7] px-4 py-3">
          <Search size={18} className="text-gray-400" />
          <input
            value={searchTerm}
            placeholder="Search car or plate number..."
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <MiniStat label="Available" value={String(availableCount)} />
        <MiniStat label="Unavailable" value={String(unavailableCount)} />
      </div>

      <div className="mt-5 space-y-3">
        {availability.length === 0 && (
          <div className="rounded-2xl bg-[#f6f8f7] px-4 py-5 text-center">
            <p className="text-sm text-gray-500">No cars found.</p>
          </div>
        )}

        {availability.map(({ car, activeBooking, isAvailable }) => (
          <div
            key={car.id}
            className="rounded-2xl border border-gray-100 bg-[#f6f8f7] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-[#10231c]">{car.car_name}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {car.plate_number} • ₱{Number(car.daily_rate).toLocaleString()}
                  /day
                </p>
              </div>

              {isAvailable ? (
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                  Available
                </span>
              ) : (
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                  Unavailable
                </span>
              )}
            </div>

            {activeBooking ? (
              <div className="mt-3 rounded-xl bg-white px-3 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Booked By
                </p>
                <p className="mt-1 text-sm font-semibold text-[#10231c]">
                  {activeBooking.customers?.full_name ?? 'Unknown Customer'}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {activeBooking.pickup_date} to {activeBooking.return_date}
                </p>
              </div>
            ) : (
              <div className="mt-3">
                <CarStatusBadge status={car.status} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f6f8f7] p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-[#1f3d32]">{value}</p>
    </div>
  )
}