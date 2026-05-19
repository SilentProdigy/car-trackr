import type React from 'react'
import {
  Building2,
  CarFront,
  CircleDollarSign,
  LayoutDashboard,
  ReceiptText,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AdminBottomNav as BottomNav } from '../../components/layout/AdminBottomNav'
import { getAdminStats } from './superAdminApi'
import { enableAdminBusinessAccess } from '../../lib/accessMode'
import { useEffect } from 'react'
import { disableAdminBusinessAccess } from '../../lib/accessMode'

export function SuperAdminDashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['super-admin-stats'],
    queryFn: getAdminStats,
  })

  useEffect(() => {
    disableAdminBusinessAccess()
  }, [])

  return (
    <main className="min-h-screen bg-[#f6f8f7] pb-24">
      <header className="bg-[#111827] px-5 pb-8 pt-6 text-white">
        <p className="text-sm opacity-80">Super Admin</p>

        <div className="mt-1 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Application Dashboard</h1>
            <p className="mt-1 text-sm opacity-80">
              Manage businesses, users, and platform-wide activity.
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <ShieldCheck size={24} />
          </div>
        </div>
      </header>

      <section className="-mt-4 space-y-5 px-5">
        {isLoading && (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-semibold text-[#111827]">
              Loading admin dashboard...
            </p>
          </div>
        )}

        {isError && (
          <div className="rounded-3xl bg-red-50 p-5 text-red-700">
            {error instanceof Error ? error.message : 'Failed to load admin data.'}
          </div>
        )}

        {data && (
          <>
            <section className="grid grid-cols-2 gap-3">
              <AdminMetric
                label="Businesses"
                value={String(data.totalBusinesses)}
                icon={<Building2 size={22} />}
              />
              <AdminMetric
                label="Users"
                value={String(data.totalUsers)}
                icon={<UsersRound size={22} />}
              />
              <AdminMetric
                label="Cars"
                value={String(data.totalCars)}
                icon={<CarFront size={22} />}
              />
              <AdminMetric
                label="Bookings"
                value={String(data.totalBookings)}
                icon={<LayoutDashboard size={22} />}
              />
              <AdminMetric
                label="Collected"
                value={`₱${Number(data.totalCollected).toLocaleString()}`}
                icon={<CircleDollarSign size={22} />}
              />
              <AdminMetric
                label="Expenses"
                value={`₱${Number(data.totalExpenses).toLocaleString()}`}
                icon={<ReceiptText size={22} />}
              />
            </section>

            <section className="rounded-[2rem] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#10231c]">
                Business Status
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <StatusBox label="Active" value={data.activeBusinesses} />
                <StatusBox label="Suspended" value={data.suspendedBusinesses} />
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#10231c]">
                Admin Actions
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <AdminLink to="/admin/businesses" label="Manage Businesses" />
                <AdminLink to="/admin/users" label="Manage User Profiles" />
                <AdminLink to="/activity-logs" label="View Activity Logs" />
                <button
                  type="button"
                  onClick={() => {
                    enableAdminBusinessAccess()
                    window.location.href = '/dashboard'
                  }}
                  className="rounded-2xl bg-[#1f3d32] px-4 py-4 text-left text-sm font-bold text-white"
                >
                  Go to Business Dashboard
                </button>
              </div>
            </section>
          </>
        )}
      </section>

      <BottomNav />
    </main>
  )
}

function AdminMetric({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-[1.75rem] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-[#111827]">{value}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-[#111827]">
          {icon}
        </div>
      </div>
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

function AdminLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="rounded-2xl bg-gray-100 px-4 py-4 text-sm font-bold text-[#111827]"
    >
      {label}
    </Link>
  )
}