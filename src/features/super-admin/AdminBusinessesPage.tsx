import { useState, useEffect } from 'react'
import { Building2, ShieldCheck } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AdminBottomNav } from '../../components/layout/AdminBottomNav'
import { Toast, type ToastType } from '../../components/ui/Toast'
import {
  getAdminBusinesses,
  softDeleteBusiness,
  updateBusinessStatus,
  updateBusinessVerification,
} from './superAdminApi'
import { ReasonModal } from '../../components/ui/ReasonModal'
import { disableAdminBusinessAccess } from '../../lib/accessMode'
import { ConfirmModal } from '../../components/ui/ConfirmModal'

export function AdminBusinessesPage() {
  const queryClient = useQueryClient()

  const [toast, setToast] = useState<{
    type: ToastType
    message: string
  } | null>(null)

  const [businessToSuspend, setBusinessToSuspend] = useState<{
    id: string
    name: string
    } | null>(null)

  const [businessToDelete, setBusinessToDelete] = useState<{
    id: string
    name: string
  } | null>(null)

  const deleteMutation = useMutation({
    mutationFn: softDeleteBusiness,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-businesses'] })
      queryClient.invalidateQueries({ queryKey: ['super-admin-stats'] })

      setBusinessToDelete(null)

      setToast({
        type: 'success',
        message: 'Business deleted successfully.',
      })
    },
    onError: (error) => {
      setToast({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to delete business.',
      })
    },
  })

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

  useEffect(() => {
    disableAdminBusinessAccess()
  }, [])

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
                    onClick={() =>
                        setBusinessToSuspend({
                        id: business.id,
                        name: business.business_name,
                        })
                    }
                    className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
                    >
                    Suspend
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  setBusinessToDelete({
                    id: business.id,
                    name: business.business_name,
                  })
                }
                className="col-span-2 rounded-2xl bg-red-700 px-4 py-3 text-sm font-bold text-white"
              >
                Delete Business
              </button>
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

      <ReasonModal
        open={Boolean(businessToSuspend)}
        title="Suspend business?"
        description={
            businessToSuspend
            ? `Provide a reason for suspending "${businessToSuspend.name}".`
            : ''
        }
        label="Suspension reason"
        placeholder="Example: Violation of platform rules, incomplete verification, suspicious activity..."
        confirmLabel="Suspend Business"
        cancelLabel="Cancel"
        loading={statusMutation.isPending}
        onClose={() => setBusinessToSuspend(null)}
        onConfirm={(reason) => {
            if (!businessToSuspend) return

            statusMutation.mutate(
            {
                businessId: businessToSuspend.id,
                status: 'suspended',
                reason: reason || 'Suspended by super admin.',
            },
            {
                onSuccess: () => {
                setBusinessToSuspend(null)
                },
            },
            )
        }}
        />
      {businessToDelete && (
        <ConfirmModal
          title="Delete business?"
          message={`Are you sure you want to delete "${businessToDelete.name}"? This will hide the business from the platform but keep its records in the database.`}
          confirmLabel="Delete Business"
          cancelLabel="Cancel"
          loading={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(businessToDelete.id)}
          onCancel={() => setBusinessToDelete(null)}
        />
      )}
      <AdminBottomNav />
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