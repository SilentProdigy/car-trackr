import { useEffect, useState } from 'react'
import type React from 'react'
import {
  Building2,
  Camera,
  LogOut,
  Mail,
  RefreshCcw,
  Save,
  UserRound,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BottomNav } from '../../components/layout/BottomNav'
import { FormInput } from '../../components/ui/FormInput'
import { Toast, type ToastType } from '../../components/ui/Toast'
import { supabase } from '../../lib/supabase'
import {
  getProfileSettings,
  updateProfileSettings,
  type ProfileFormData,
} from './profileApi'

const initialFormData: ProfileFormData = {
  full_name: '',
  business_name: '',
  phone: '',
  email: '',
  address: '',
}

export function ProfilePage() {
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<ProfileFormData>(initialFormData)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [toast, setToast] = useState<{
    type: ToastType
    message: string
  } | null>(null)

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['profile-settings'],
    queryFn: getProfileSettings,
  })

  useEffect(() => {
    if (!data) return

    setFormData({
      full_name: data.profile?.full_name ?? '',
      business_name: data.business?.business_name ?? '',
      phone: data.business?.phone ?? '',
      email: data.business?.email ?? '',
      address: data.business?.address ?? '',
    })
  }, [data])

  const updateMutation = useMutation({
    mutationFn: ({
      formData,
      logoFile,
    }: {
      formData: ProfileFormData
      logoFile?: File | null
    }) => updateProfileSettings(formData, logoFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile-settings'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['reports'] })

      setLogoFile(null)
      setToast({
        type: 'success',
        message: 'Profile updated successfully.',
      })
    },
    onError: (error) => {
      setToast({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to update profile.',
      })
    },
  })

  function updateField<K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formData.business_name.trim()) {
      setToast({
        type: 'error',
        message: 'Business name is required.',
      })
      return
    }

    await updateMutation.mutateAsync({
      formData,
      logoFile,
    })
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <main className="min-h-screen bg-[#f6f8f7] pb-24">
      <header className="bg-[#1f3d32] px-5 pb-8 pt-6 text-white">
        <p className="text-sm opacity-80">Account Settings</p>

        <div className="mt-1 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Profile Management</h1>
            <p className="mt-1 text-sm opacity-80">
              Update your personal and business information.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <UserRound size={24} />
          </div>
        </div>
      </header>

      <section className="-mt-4 space-y-5 px-5">
        {isLoading && (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#d7e5dd] border-t-[#1f3d32]" />
            <p className="text-sm font-semibold text-[#1f3d32]">
              Loading profile...
            </p>
          </div>
        )}

        {isError && (
          <div className="rounded-3xl bg-red-50 p-5 text-red-700">
            <p className="text-sm font-bold">Failed to load profile.</p>
            <p className="mt-1 text-sm">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-red-100 px-4 py-2 text-sm font-bold"
            >
              <RefreshCcw size={16} />
              Retry
            </button>
          </div>
        )}

        {data && (
          <>
            <section className="rounded-[2rem] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-[#e8f0ec] text-[#1f3d32]">
                  {data.business?.logo_url ? (
                    <img
                      src={data.business.logo_url}
                      alt={data.business.business_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 size={34} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-xl font-bold text-[#10231c]">
                    {data.business?.business_name || 'Your Business'}
                  </h2>

                  <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <Mail size={14} />
                    {data.userEmail ?? 'No email'}
                  </p>
                </div>
              </div>
            </section>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-[2rem] bg-white p-5 shadow-sm"
            >
              <div>
                <h2 className="text-lg font-bold text-[#10231c]">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  This is your owner profile information.
                </p>
              </div>

              <FormInput
                label="Full name"
                value={formData.full_name}
                placeholder="Juan Dela Cruz"
                onChange={(value) => updateField('full_name', value)}
              />

              <div className="border-t border-gray-100 pt-5">
                <h2 className="text-lg font-bold text-[#10231c]">
                  Business Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  These details are used for dashboards, bookings, and reports.
                </p>
              </div>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#10231c]">
                  <Camera size={16} />
                  Business logo
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setLogoFile(event.target.files?.[0] ?? null)
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm"
                />

                {logoFile && (
                  <p className="mt-2 text-xs text-gray-500">
                    Selected: {logoFile.name}
                  </p>
                )}
              </label>

              <FormInput
                label="Business name"
                value={formData.business_name}
                required
                placeholder="Example: Juan Car Rental"
                onChange={(value) => updateField('business_name', value)}
              />

              <FormInput
                label="Business phone"
                value={formData.phone}
                placeholder="09XX XXX XXXX"
                onChange={(value) => updateField('phone', value)}
              />

              <FormInput
                label="Business email"
                type="email"
                value={formData.email}
                placeholder="business@example.com"
                onChange={(value) => updateField('email', value)}
              />

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                  Business address
                </span>

                <textarea
                  value={formData.address}
                  placeholder="Complete business address"
                  onChange={(event) =>
                    updateField('address', event.target.value)
                  }
                  className="min-h-28 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
                />
              </label>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1f3d32] px-5 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </form>

            <section className="rounded-[2rem] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#10231c]">Account</h2>
              <p className="mt-1 text-sm text-gray-500">
                Sign out from your current session.
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 text-sm font-bold text-red-700"
              >
                <LogOut size={18} />
                Logout
              </button>
            </section>
          </>
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