import type React from 'react'
import {
  AlertTriangle,
  BarChart3,
  CalendarClock,
  CarFront,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Coins,
  CreditCard,
  TrendingDown,
  TrendingUp,
  UsersRound,
  Wrench,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BottomNav } from '../../components/layout/BottomNav'
import { BookingStatusBadge } from '../bookings/BookingStatusBadge'
import { CarStatusBadge } from '../cars/CarStatusBadge'
import { getDashboardData } from './dashboardApi'
import { DashboardMetricCard } from './DashboardMetricCard'
import { DashboardSection } from './DashboardSection'
import { ProgressBar } from './ProgressBar'

export function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  })

  return (
    <main className="min-h-screen bg-[#f6f8f7] pb-24">
      <header className="bg-[#1f3d32] px-5 pb-8 pt-6 text-white">
        <p className="text-sm opacity-80">Welcome back</p>

        <div className="mt-1 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">
            {data?.business?.business_name ?? 'Car Rental Dashboard'}
            </h1>
            <p className="mt-1 text-sm opacity-80">
              Live overview of bookings, fleet, and cash flow.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <BarChart3 size={24} />
          </div>
        </div>
      </header>

      <section className="-mt-4 space-y-5 px-5">
        {isLoading && (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#d7e5dd] border-t-[#1f3d32]" />
            <p className="text-sm font-semibold text-[#1f3d32]">
              Loading dashboard...
            </p>
          </div>
        )}

        {isError && (
          <div className="rounded-3xl bg-red-50 p-5 text-red-700">
            <p className="text-sm font-bold">Failed to load dashboard.</p>
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
            <DashboardSection
              title="Financial Overview"
              subtitle="Track collected cash, receivables, costs, and profit."
            >
              <div className="grid grid-cols-2 gap-3">
                <DashboardMetricCard
                  label="Collected"
                  value={`₱${Number(data.totalCollected).toLocaleString()}`}
                  helper="Actual payments received"
                  icon={<Coins size={22} />}
                  tone="success"
                />

                <DashboardMetricCard
                  label="Receivables"
                  value={`₱${Number(data.pendingBalance).toLocaleString()}`}
                  helper="Unpaid balances"
                  icon={<CreditCard size={22} />}
                  tone="warning"
                />

                <DashboardMetricCard
                  label="Expenses"
                  value={`₱${Number(data.totalExpenses).toLocaleString()}`}
                  helper="Business expenses"
                  icon={<TrendingDown size={22} />}
                  tone="danger"
                />

                <DashboardMetricCard
                  label="Net Profit"
                  value={`₱${Number(data.netProfit).toLocaleString()}`}
                  helper="Collected - costs"
                  icon={<TrendingUp size={22} />}
                  tone={data.netProfit >= 0 ? 'success' : 'danger'}
                />
              </div>

              <div className="mt-5 space-y-5 rounded-[1.5rem] bg-[#f6f8f7] p-4">
                <ProgressBar
                  label="Collection Rate"
                  value={data.collectionRate}
                  helper="Percentage of booking revenue already collected."
                />

                <ProgressBar
                  label="Fleet Utilization"
                  value={data.utilizationRate}
                  helper="Rented or reserved cars compared to total fleet."
                />
              </div>
            </DashboardSection>

            <DashboardSection
              title="Quick Actions"
              subtitle="Fast access to the most used operations."
            >
              <div className="grid grid-cols-2 gap-3">
                <QuickAction
                  to="/bookings"
                  label="New Booking"
                  icon={<CalendarClock size={20} />}
                  primary
                />
                <QuickAction
                  to="/payments"
                  label="Add Payment"
                  icon={<CircleDollarSign size={20} />}
                />
                <QuickAction
                  to="/cars"
                  label="Add Car"
                  icon={<CarFront size={20} />}
                />
                <QuickAction
                  to="/customers"
                  label="Add Customer"
                  icon={<UsersRound size={20} />}
                />
              </div>
            </DashboardSection>

            <DashboardSection
              title="Fleet Status"
              subtitle="Current vehicle availability and operating status."
            >
              <div className="grid grid-cols-2 gap-3">
                <FleetStatusItem
                  label="Available"
                  value={data.availableCars}
                  icon={<CheckCircle2 size={18} />}
                />
                <FleetStatusItem
                  label="Rented"
                  value={data.rentedCars}
                  icon={<CarFront size={18} />}
                />
                <FleetStatusItem
                  label="Reserved"
                  value={data.reservedCars}
                  icon={<Clock3 size={18} />}
                />
                <FleetStatusItem
                  label="Maintenance"
                  value={data.maintenanceCars}
                  icon={<Wrench size={18} />}
                />
              </div>
            </DashboardSection>

            <DashboardSection
              title="Booking Analytics"
              subtitle="Status distribution of all reservations."
            >
              <div className="grid grid-cols-2 gap-3">
                <StatusBox label="Pending" value={data.pendingBookings} />
                <StatusBox label="Confirmed" value={data.confirmedBookings} />
                <StatusBox label="Ongoing" value={data.ongoingBookings} />
                <StatusBox label="Completed" value={data.completedBookings} />
              </div>

              {data.cancelledBookings > 0 && (
                <div className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  <span className="font-bold">{data.cancelledBookings}</span>{' '}
                  cancelled booking record
                  {data.cancelledBookings > 1 ? 's' : ''}.
                </div>
              )}
            </DashboardSection>

            <DashboardSection
              title="Upcoming Returns"
              subtitle="Bookings that need attention within the next 7 days."
            >
              <div className="space-y-3">
                {data.upcomingReturns.length === 0 && (
                  <EmptyMessage message="No upcoming returns within the next 7 days." />
                )}

                {data.upcomingReturns.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-2xl bg-[#f6f8f7] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#10231c]">
                          {booking.customers?.full_name ?? 'Unknown Customer'}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {booking.cars?.car_name ?? 'Unknown Car'}
                        </p>
                      </div>

                      <BookingStatusBadge status={booking.booking_status} />
                    </div>

                    <p className="mt-3 text-sm text-gray-600">
                      Return date:{' '}
                      <span className="font-bold text-[#10231c]">
                        {booking.return_date}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </DashboardSection>

            <DashboardSection
              title="Pending Balances"
              subtitle="Customers with the highest unpaid balances."
            >
              <div className="space-y-3">
                {data.bookingsWithBalance.length === 0 && (
                  <EmptyMessage message="No pending balances. All active bookings are fully paid." />
                )}

                {data.bookingsWithBalance.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-[#f6f8f7] p-4"
                  >
                    <div>
                      <p className="font-bold text-[#10231c]">
                        {booking.customers?.full_name ?? 'Unknown Customer'}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {booking.cars?.car_name ?? 'Unknown Car'}
                      </p>
                    </div>

                    <p className="text-sm font-bold text-red-700">
                      ₱{Number(booking.balance).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </DashboardSection>

            <DashboardSection
              title="Top Performing Cars"
              subtitle="Ranked by booking revenue."
            >
              <div className="space-y-3">
                {data.topCars.length === 0 && (
                  <EmptyMessage message="No car performance data yet." />
                )}

                {data.topCars.map((item, index) => (
                  <div
                    key={item.car.id}
                    className="rounded-2xl bg-[#f6f8f7] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#10231c]">
                          #{index + 1} {item.car.car_name}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.bookings} booking
                          {item.bookings !== 1 ? 's' : ''}
                        </p>
                      </div>

                      <p className="text-sm font-bold text-[#1f3d32]">
                        ₱{Number(item.revenue).toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-3">
                      <CarStatusBadge status={item.car.status} />
                    </div>
                  </div>
                ))}
              </div>
            </DashboardSection>

            <DashboardSection
              title="Recent Bookings"
              subtitle="Latest reservation activity."
            >
              <div className="space-y-3">
                {data.recentBookings.length === 0 && (
                  <EmptyMessage message="No recent bookings yet." />
                )}

                {data.recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-2xl bg-[#f6f8f7] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#10231c]">
                          {booking.customers?.full_name ?? 'Unknown Customer'}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {booking.cars?.car_name ?? 'Unknown Car'}
                        </p>
                      </div>

                      <BookingStatusBadge status={booking.booking_status} />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <MiniInfo label="Pickup" value={booking.pickup_date} />
                      <MiniInfo label="Return" value={booking.return_date} />
                    </div>
                  </div>
                ))}
              </div>
            </DashboardSection>

            {data.activeMaintenance.length > 0 && (
              <DashboardSection
                title="Maintenance Alerts"
                subtitle="Vehicles currently scheduled or under maintenance."
              >
                <div className="space-y-3">
                  {data.activeMaintenance.map((record) => (
                    <div
                      key={record.id}
                      className="rounded-2xl bg-yellow-50 p-4 text-yellow-800"
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle size={20} className="mt-0.5 shrink-0" />
                        <div>
                          <p className="font-bold">
                            {record.cars?.car_name ?? 'Unknown Car'}
                          </p>
                          <p className="mt-1 text-sm">
                            {record.maintenance_type ?? 'Maintenance'} —{' '}
                            {record.status.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardSection>
            )}

            <DashboardSection
              title="Business Totals"
              subtitle="Overall records stored in your system."
            >
              <div className="grid grid-cols-3 gap-3">
                <TotalBox label="Cars" value={data.totalCars} />
                <TotalBox label="Customers" value={data.totalCustomers} />
                <TotalBox label="Bookings" value={data.totalBookings} />
              </div>
            </DashboardSection>
          </>
        )}
      </section>

      <BottomNav />
    </main>
  )
}

function QuickAction({
  to,
  label,
  icon,
  primary,
}: {
  to: string
  label: string
  icon: React.ReactNode
  primary?: boolean
}) {
  return (
    <Link
      to={to}
      className={[
        'flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-bold',
        primary
          ? 'bg-[#1f3d32] text-white'
          : 'bg-[#e8f0ec] text-[#1f3d32]',
      ].join(' ')}
    >
      {icon}
      {label}
    </Link>
  )
}

function FleetStatusItem({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-[#f6f8f7] p-4">
      <div className="flex items-center gap-2 text-[#416b57]">
        {icon}
        <p className="text-xs font-semibold">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-bold text-[#10231c]">{value}</p>
    </div>
  )
}

function StatusBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-[#f6f8f7] p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#10231c]">{value}</p>
    </div>
  )
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white px-3 py-2">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 text-xs font-bold text-[#10231c]">{value}</p>
    </div>
  )
}

function TotalBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-[#f6f8f7] p-4 text-center">
      <p className="text-2xl font-bold text-[#1f3d32]">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  )
}

function EmptyMessage({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-[#f6f8f7] px-4 py-5 text-center">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  )
}