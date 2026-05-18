import { Building2, ShieldCheck } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getUserAccessInfo } from './accessApi'
import { AppLogo } from '../../components/ui/AppLogo'

export function ChooseAccessPage() {
  const navigate = useNavigate()

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['user-access-info'],
    queryFn: getUserAccessInfo,
    retry: false,
  })

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8f7]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#d7e5dd] border-t-[#1f3d32]" />
          <p className="text-sm font-semibold text-[#1f3d32]">
            Checking access...
          </p>
        </div>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8f7] px-5">
        <div className="w-full max-w-md rounded-[2rem] bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#10231c]">
            Access check failed
          </h1>
          <p className="mt-2 text-sm text-red-700">
            {error instanceof Error ? error.message : 'Unable to check access.'}
          </p>
        </div>
      </main>
    )
  }

  if (!data) {
    return <Navigate to="/login" replace />
  }

  if (data.isSuperAdmin && !data.hasBusiness) {
    return <Navigate to="/admin" replace />
  }

  if (!data.isSuperAdmin && data.hasBusiness) {
    return <Navigate to="/dashboard" replace />
  }

  if (!data.isSuperAdmin && !data.hasBusiness) {
    return <Navigate to="/business-setup" replace />
  }

  return (
    <main className="min-h-screen bg-[#f6f8f7] px-5 py-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <AppLogo size="lg" showText={false} className="mb-5" />

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#416b57]">
            Access Selection
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#10231c]">
            Choose where to continue
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your account has both business access and super admin access.
          </p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard', { replace: true })}
            className="w-full rounded-[2rem] bg-white p-5 text-left shadow-sm transition hover:bg-[#f9fbfa]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#e8f0ec] text-[#1f3d32]">
                <Building2 size={26} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#10231c]">
                  Business Dashboard
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your car rental business, bookings, payments, cars,
                  customers, expenses, and reports.
                </p>

                <p className="mt-3 text-sm font-bold text-[#1f3d32]">
                  {data.business?.business_name ?? 'Your Business'}
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin', { replace: true })}
            className="w-full rounded-[2rem] bg-[#111827] p-5 text-left text-white shadow-sm transition hover:bg-black"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                <ShieldCheck size={26} />
              </div>

              <div>
                <h2 className="text-lg font-bold">Super Admin Panel</h2>

                <p className="mt-1 text-sm text-white/70">
                  Manage the entire application, businesses, users, platform
                  analytics, verification, and suspensions.
                </p>

                <p className="mt-3 text-sm font-bold text-white">
                  Platform Administration
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </main>
  )
}