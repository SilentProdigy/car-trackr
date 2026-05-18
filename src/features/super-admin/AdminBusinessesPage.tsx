import { useState } from 'react'
import { Building2, ShieldCheck } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BottomNav } from '../../components/layout/BottomNav'
import { Toast, type ToastType } from '../../components/ui/Toast'
import {
  getAdminBusinesses,
  updateBusinessStatus,
  updateBusinessVerification,
} from './superAdminApi'

export function AdminBusinessesPage() {
  const queryClient = useQueryClient()

  const [toast, setToast] = useState<{
    type: ToastType
    message: string
  } | null>(null)

  const {
    data: businesses = [],
    isLoading,
    isError,
    error,
   } = useQuery({
    queryKey: ['admin-businesses'],
    queryFn: getAdminBusinesses, 
   })

  const statusMutation = useMutation({
    mutationFn: updateBusinessStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-businesses'] })
      queryClient.invalidateQueries({ queryKey: ['super-admin-stats'] })
      setToast({
        type: 'success',
        message: 'Business status updated.',
      })
    },
    onError: (error) => {
      setToast({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update business status.',
      })
    },
  })

  const verifyMutation = useMutation({
    mutationFn: updateBusinessVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-businesses'] })
      setToast({
        type: 'success',
        message: 'Business verification updated.',
      })
    },
  })

  return (
    <main className="min-h-screen bg-[#f6f8f7] pb-24">
      <header className="bg-[#111827] px-5 pb-8 pt-6 text-white">
        <p className="text-sm opacity-80">Super Admin</p>
        <h1 className="mt-1 text-2xl font-bold">Manage Businesses</h1>
      </header>

      <section className="-mt-4 space-y-4 px-5">
        {isLoading && (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-gray-500">Loading businesses...</p>
          </div>
        )}

        {businesses.map((business) => (
          <article
            key={business.id}
            className="rounded-[2rem] bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-[#111827]">
                <Building2 size={26} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-lg font-bold text-[#10231c]">
                    {business.business_name}
                  </h2>

                  {business.is_verified && (
                    <ShieldCheck size={17} className="text-green-700" />
                  )}
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  Owner: {business.profiles?.full_name ?? business.owner_id}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Created: {new Date(business.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Info label="Status" value={business.status} />
              <Info
                label="Verified"
                value={business.is_verified ? 'Yes' : 'No'}
              />
            </div>

            {business.suspension_reason && (
              <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {business.suspension_reason}
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  verifyMutation.mutate({
                    businessId: business.id,
                    isVerified: !business.is_verified,
                  })
                }
                className="rounded-2xl bg-gray-100 px-4 py-3 text-sm font-bold text-[#111827]"
              >
                {business.is_verified ? 'Unverify' : 'Verify'}
              </button>

              {business.status === 'suspended' ? (
                <button
                  type="button"
                  onClick={() =>
                    statusMutation.mutate({
                      businessId: business.id,
                      status: 'active',
                    })
                  }
                  className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700"
                >
                  Reactivate
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const reason = window.prompt(
                      'Reason for suspending this business:',
                    )

                    statusMutation.mutate({
                      businessId: business.id,
                      status: 'suspended',
                      reason: reason ?? 'Suspended by super admin.',
                    })
                  }}
                  className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
                >
                  Suspend
                </button>
              )}
            </div>
          </article>
        ))}

        {isError && (
        <div className="rounded-3xl bg-red-50 p-5 text-red-700 shadow-sm">
            <p className="text-sm font-bold">Failed to load businesses.</p>
            <p className="mt-1 text-sm">
            {error instanceof Error ? error.message : 'Unknown error'}
            </p>
        </div>
        )}

        {!isLoading && !isError && businesses.length === 0 && (
        <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-100 text-[#111827]">
            <Building2 size={30} />
            </div>

            <h2 className="text-lg font-bold text-[#10231c]">
            No businesses found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
            Businesses will appear here after users complete business setup.
            </p>
        </div>
        )}
      </section>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <BottomNav />
    </main>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f6f8f7] p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-bold capitalize text-[#10231c]">
        {value}
      </p>
    </div>
  )
}