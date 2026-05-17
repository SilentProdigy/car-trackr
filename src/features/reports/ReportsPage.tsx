import type React from 'react'
import {
  BarChart3,
  CalendarCheck,
  CarFront,
  CircleDollarSign,
  Coins,
  TrendingDown,
  TrendingUp,
  Wrench,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { BottomNav } from '../../components/layout/BottomNav'
import { getReportsData } from './reportsApi'
import { ReportSummaryCard } from './ReportSummaryCard'
import { AvailabilityCalendar } from './AvailabilityCalendar'

export function ReportsPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['reports'],
    queryFn: getReportsData,
  })

  return (
    <main className="min-h-screen bg-[#f6f8f7] pb-24">
      <header className="bg-[#1f3d32] px-5 py-6 text-white">
        <p className="text-sm opacity-80">Business Intelligence</p>

        <div className="mt-1 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Reports</h1>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
            <BarChart3 size={24} />
          </div>
        </div>
      </header>

      <section className="space-y-5 px-5 py-5">
        {isLoading && (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#d7e5dd] border-t-[#1f3d32]" />
            <p className="text-sm font-semibold text-[#1f3d32]">
              Loading reports...
            </p>
          </div>
        )}

        {isError && (
          <div className="rounded-3xl bg-red-50 p-5 text-red-700">
            <p className="text-sm font-bold">Failed to load reports.</p>
            <p className="mt-1 text-sm">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-2xl bg-red-100 px-4 py-2 text-sm font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <ReportSummaryCard
                label="Collected"
                value={`₱${Number(data.totalCollected).toLocaleString()}`}
                helper="Actual received payments"
                icon={<Coins size={22} />}
              />

              <ReportSummaryCard
                label="Total Revenue"
                value={`₱${Number(data.totalRevenue).toLocaleString()}`}
                helper="Booking total amount"
                icon={<CircleDollarSign size={22} />}
              />

              <ReportSummaryCard
                label="Expenses"
                value={`₱${Number(data.totalExpenses).toLocaleString()}`}
                helper="Operating and vehicle costs"
                icon={<TrendingDown size={22} />}
              />

              <ReportSummaryCard
                label="Net Profit"
                value={`₱${Number(data.netProfit).toLocaleString()}`}
                helper="Collected - expenses - maintenance"
                icon={<TrendingUp size={22} />}
              />
            </div>

            <div className="rounded-[2rem] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#10231c]">
                Booking Summary
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <SmallMetric
                  label="Ongoing"
                  value={String(data.ongoingBookings)}
                  icon={<CalendarCheck size={18} />}
                />
                <SmallMetric
                  label="Completed"
                  value={String(data.completedBookings)}
                  icon={<CalendarCheck size={18} />}
                />
                <SmallMetric
                  label="Cancelled"
                  value={String(data.cancelledBookings)}
                  icon={<CalendarCheck size={18} />}
                />
                <SmallMetric
                  label="Pending Balance"
                  value={`₱${Number(data.pendingBalance).toLocaleString()}`}
                  icon={<CircleDollarSign size={18} />}
                />
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#10231c]">
                Fleet Summary
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <SmallMetric
                  label="Available"
                  value={String(data.availableCars)}
                  icon={<CarFront size={18} />}
                />
                <SmallMetric
                  label="Rented"
                  value={String(data.rentedCars)}
                  icon={<CarFront size={18} />}
                />
                <SmallMetric
                  label="Reserved"
                  value={String(data.reservedCars)}
                  icon={<CarFront size={18} />}
                />
                <SmallMetric
                  label="Maintenance"
                  value={String(data.maintenanceCars)}
                  icon={<Wrench size={18} />}
                />
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#10231c]">
                Top Rented Cars
              </h2>

              <div className="mt-4 space-y-3">
                {data.mostRentedCars.length === 0 && (
                  <p className="rounded-2xl bg-[#f6f8f7] px-4 py-4 text-center text-sm text-gray-500">
                    No rental data yet.
                  </p>
                )}

                {data.mostRentedCars.map((item, index) => (
                  <div
                    key={item.car.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-[#f6f8f7] px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#10231c]">
                        #{index + 1} {item.car.car_name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.bookings} bookings
                      </p>
                    </div>

                    <p className="text-sm font-bold text-[#1f3d32]">
                      ₱{Number(item.revenue).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <AvailabilityCalendar cars={data.cars} bookings={data.bookings} />
          </>
        )}
      </section>

      <BottomNav />
    </main>
  )
}

function SmallMetric({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-[#f6f8f7] p-4">
      <div className="flex items-center gap-2 text-[#416b57]">
        {icon}
        <p className="text-xs font-semibold">{label}</p>
      </div>

      <p className="mt-2 text-xl font-bold text-[#10231c]">{value}</p>
    </div>
  )
}