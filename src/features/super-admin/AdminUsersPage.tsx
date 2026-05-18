import { useState } from 'react'
import { UserRound } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BottomNav } from '../../components/layout/BottomNav'
import { Toast, type ToastType } from '../../components/ui/Toast'
import { getAdminProfiles, updateProfileRole } from './superAdminApi'

export function AdminUsersPage() {
  const queryClient = useQueryClient()

  const [toast, setToast] = useState<{
    type: ToastType
    message: string
  } | null>(null)

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: getAdminProfiles,
  })

  const updateRoleMutation = useMutation({
    mutationFn: updateProfileRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] })
      queryClient.invalidateQueries({ queryKey: ['super-admin-stats'] })
      setToast({
        type: 'success',
        message: 'User role updated.',
      })
    },
    onError: (error) => {
      setToast({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to update role.',
      })
    },
  })

  return (
    <main className="min-h-screen bg-[#f6f8f7] pb-24">
      <header className="bg-[#111827] px-5 pb-8 pt-6 text-white">
        <p className="text-sm opacity-80">Super Admin</p>
        <h1 className="mt-1 text-2xl font-bold">Manage User Profiles</h1>
      </header>

      <section className="-mt-4 space-y-4 px-5">
        {isLoading && (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-gray-500">Loading users...</p>
          </div>
        )}

        {profiles.map((profile) => (
          <article
            key={profile.id}
            className="rounded-[2rem] bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-[#111827]">
                <UserRound size={26} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-bold text-[#10231c]">
                  {profile.full_name ?? 'Unnamed User'}
                </h2>
                <p className="mt-1 break-all text-xs text-gray-500">
                  {profile.id}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Created: {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Role
              </span>

              <select
                value={profile.role}
                onChange={(event) =>
                  updateRoleMutation.mutate({
                    profileId: profile.id,
                    role: event.target.value as 'owner' | 'staff' | 'super_admin',
                  })
                }
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="owner">Owner</option>
                <option value="staff">Staff</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </label>
          </article>
        ))}
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