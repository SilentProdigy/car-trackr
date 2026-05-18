import { useState } from 'react'
import type React from 'react'
import { Plus, ShieldCheck, UserRound } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BottomNav } from '../../components/layout/BottomNav'
import { PrimaryButton } from '../../components/ui/PrimaryButton'
import { Toast, type ToastType } from '../../components/ui/Toast'
import { usePermissions } from '../auth/usePermissions'
import {
  addBusinessMember,
  deactivateBusinessMember,
  getBusinessMembers,
  updateBusinessMemberRole,
  type AddMemberFormData,
} from './teamApi'

const initialFormData: AddMemberFormData = {
  user_id: '',
  role: 'staff',
}

export function TeamPage() {
  const queryClient = useQueryClient()
  const { data: permissions } = usePermissions()

  const [formData, setFormData] = useState<AddMemberFormData>(initialFormData)
  const [toast, setToast] = useState<{
    type: ToastType
    message: string
  } | null>(null)

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['business-members'],
    queryFn: getBusinessMembers,
    enabled: permissions?.canManageMembers,
  })

  const addMutation = useMutation({
    mutationFn: addBusinessMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-members'] })
      setFormData(initialFormData)
      setToast({
        type: 'success',
        message: 'Team member added successfully.',
      })
    },
    onError: (error) => {
      setToast({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to add member.',
      })
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: string
      role: 'manager' | 'staff' | 'viewer'
    }) => updateBusinessMemberRole(memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-members'] })
      setToast({
        type: 'success',
        message: 'Member role updated.',
      })
    },
  })

  const deactivateMutation = useMutation({
    mutationFn: deactivateBusinessMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-members'] })
      setToast({
        type: 'success',
        message: 'Member deactivated.',
      })
    },
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formData.user_id.trim()) {
      setToast({
        type: 'error',
        message: 'User ID is required.',
      })
      return
    }

    await addMutation.mutateAsync(formData)
  }

  if (permissions && !permissions.canManageMembers) {
    return (
      <main className="min-h-screen bg-[#f6f8f7] pb-24">
        <header className="bg-[#1f3d32] px-5 py-6 text-white">
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="mt-1 text-sm opacity-80">Owner access only</p>
        </header>

        <section className="px-5 py-5">
          <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-700">
              <ShieldCheck size={30} />
            </div>
            <h2 className="text-lg font-bold text-[#10231c]">
              Access Restricted
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Only the business owner can manage team members.
            </p>
          </div>
        </section>

        <BottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f6f8f7] pb-24">
      <header className="bg-[#1f3d32] px-5 pb-8 pt-6 text-white">
        <p className="text-sm opacity-80">Access Control</p>
        <h1 className="mt-1 text-2xl font-bold">Team Management</h1>
        <p className="mt-1 text-sm opacity-80">
          Add staff and control what they can access.
        </p>
      </header>

      <section className="-mt-4 space-y-5 px-5">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-[2rem] bg-white p-5 shadow-sm"
        >
          <div>
            <h2 className="text-lg font-bold text-[#10231c]">
              Add Team Member
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter the Supabase Auth user ID of the staff account.
            </p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#10231c]">
              User ID
            </span>
            <input
              value={formData.user_id}
              placeholder="Auth user UUID"
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  user_id: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#10231c]">
              Role
            </span>
            <select
              value={formData.role}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  role: event.target.value as AddMemberFormData['role'],
                }))
              }
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
            >
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="viewer">Viewer</option>
            </select>
          </label>

          <PrimaryButton type="submit" loading={addMutation.isPending}>
            Add Member
          </PrimaryButton>
        </form>

        <section className="rounded-[2rem] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#10231c]">Members</h2>

          {isLoading && (
            <p className="mt-4 text-sm text-gray-500">Loading members...</p>
          )}

          {!isLoading && members.length === 0 && (
            <div className="mt-4 rounded-2xl bg-[#f6f8f7] px-4 py-5 text-center">
              <p className="text-sm text-gray-500">No team members yet.</p>
            </div>
          )}

          <div className="mt-4 space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="rounded-2xl bg-[#f6f8f7] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f0ec] text-[#1f3d32]">
                    <UserRound size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#10231c]">
                      {member.user_id}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Status: {member.status}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                  <select
                    value={member.role}
                    disabled={member.status !== 'active'}
                    onChange={(event) =>
                      updateRoleMutation.mutate({
                        memberId: member.id,
                        role: event.target.value as 'manager' | 'staff' | 'viewer',
                      })
                    }
                    className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none"
                  >
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                    <option value="viewer">Viewer</option>
                  </select>

                  <button
                    type="button"
                    disabled={member.status !== 'active'}
                    onClick={() => deactivateMutation.mutate(member.id)}
                    className="rounded-2xl bg-red-50 px-4 py-2 text-sm font-bold text-red-700 disabled:opacity-50"
                  >
                    Disable
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
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