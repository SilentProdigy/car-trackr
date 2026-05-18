import { useState } from 'react'
import { Plus, RefreshCcw, Search, UsersRound } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BottomNav } from '../../components/layout/BottomNav'
import type { Customer, CustomerFormData } from '../../types/database'
import { AddCustomerForm } from './AddCustomerForm'
import { CustomerCard } from './CustomerCard'
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from './customersApi'

import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { Toast, type ToastType } from '../../components/ui/Toast'
import { usePermissions } from '../auth/usePermissions'

export function CustomersPage() {
  const queryClient = useQueryClient()
  const { data: permissions } = usePermissions()

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [toast, setToast] = useState<{
    type: ToastType
    message: string
  } | null>(null)

  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null)

  const {
    data: customers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  })

  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase()

    return (
      customer.full_name.toLowerCase().includes(search) ||
      customer.phone?.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search)
    )
  })

  const updateMutation = useMutation({
    mutationFn: ({
      customerId,
      formData,
      validIdFile,
      driverLicenseFile,
    }: {
      customerId: string
      formData: CustomerFormData
      validIdFile?: File | null
      driverLicenseFile?: File | null
    }) => updateCustomer(customerId, formData, validIdFile, driverLicenseFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setToast({
        type: 'success',
        message: 'Customer updated successfully.',
      })
    },
  })

  const createMutation = useMutation({
    mutationFn: ({
      formData,
      validIdFile,
      driverLicenseFile,
    }: {
      formData: CustomerFormData
      validIdFile?: File | null
      driverLicenseFile?: File | null
    }) => createCustomer(formData, validIdFile, driverLicenseFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    })

  async function handleSaveCustomer(
    formData: CustomerFormData,
    validIdFile?: File | null,
    driverLicenseFile?: File | null,
  ) {
    if (selectedCustomer) {
      await updateMutation.mutateAsync({
        customerId: selectedCustomer.id,
        formData,
        validIdFile,
        driverLicenseFile,
      })

      setSelectedCustomer(null)
      return
    }

    await createMutation.mutateAsync({
      formData,
      validIdFile,
      driverLicenseFile,
    })

    setToast({
      type: 'success',
      message: 'Customer added successfully.',
    })
  }

    function handleDeleteCustomer(customerId: string) {
        setCustomerToDelete(customerId)
    }

    function confirmDeleteCustomer() {
      if (!customerToDelete) return

      deleteMutation.mutate(customerToDelete, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['customers'] })
          setCustomerToDelete(null)
          setToast({
            type: 'success',
            message: 'Customer deleted successfully.',
          })
        },
        onError: (error) => {
          setToast({
            type: 'error',
            message:
              error instanceof Error
                ? error.message
                : 'Failed to delete customer.',
          })
        },
      })
    }

    // const selectedCustomer = customers.find(
    // (customer) => customer.id === customerToDelete,
    // )

  return (
    <main className="min-h-screen bg-[#f6f8f7] pb-24">
      <header className="bg-[#1f3d32] px-5 py-6 text-white">
        <p className="text-sm opacity-80">Customer Records</p>

        <div className="mt-1 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Customers</h1>
          {permissions?.canWrite && (
            <button
              type="button"
              onClick={() => {
                setSelectedCustomer(null)
                setShowAddForm(true)
              }}
              className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-[#1f3d32]"
            >
              <Plus size={18} />
              Add
            </button>
          )}
          
        </div>
      </header>

      <section className="px-5 py-5">
        <div className="mb-4 rounded-3xl bg-white p-4 shadow-sm">
          <label className="flex items-center gap-3 rounded-2xl bg-[#f6f8f7] px-4 py-3">
            <Search size={18} className="text-gray-400" />
            <input
              value={searchTerm}
              placeholder="Search customer..."
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
        </div>

        {isLoading && (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#d7e5dd] border-t-[#1f3d32]" />
            <p className="text-sm font-semibold text-[#1f3d32]">
              Loading customers...
            </p>
          </div>
        )}

        {isError && (
          <div className="rounded-3xl bg-red-50 p-5 text-red-700">
            <p className="text-sm font-bold">Failed to load customers.</p>
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

        {!isLoading && !isError && customers.length === 0 && (
          <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e8f0ec] text-[#1f3d32]">
              <UsersRound size={28} />
            </div>

            <h2 className="text-lg font-bold text-[#10231c]">
              No customers added yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add customers before creating rental bookings.
            </p>

            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="mt-5 rounded-2xl bg-[#1f3d32] px-5 py-3 text-sm font-bold text-white"
            >
              Add First Customer
            </button>
          </div>
        )}

        {!isLoading && !isError && customers.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <SummaryCard label="Total Customers" value={String(customers.length)} />
              <SummaryCard
                label="With License"
                value={String(
                  customers.filter((customer) => customer.driver_license_url)
                    .length,
                )}
              />
            </div>

            {filteredCustomers.length === 0 && (
              <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
                <p className="text-sm text-gray-500">
                  No customer matched your search.
                </p>
              </div>
            )}

            {filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onDelete={handleDeleteCustomer}
                onEdit={(customer) => {
                  setSelectedCustomer(customer)
                  setShowAddForm(true)
                }}
                canEdit={permissions?.canWrite ?? false}
                canDelete={permissions?.canWrite ?? false}
              />
            ))}
          </div>
        )}
      </section>

        {showAddForm && (
          <AddCustomerForm
            customer={selectedCustomer}
            onSubmit={handleSaveCustomer}
            onClose={() => {
              setShowAddForm(false)
              setSelectedCustomer(null)
            }}
          />
        )}

        {customerToDelete && (
            <ConfirmModal
                title="Delete customer?"
                message={`Are you sure you want to delete ${
                selectedCustomer?.full_name ?? 'this customer'
                }? This action cannot be undone.`}
                confirmLabel="Delete Customer"
                cancelLabel="Keep Customer"
                loading={deleteMutation.isPending}
                onConfirm={confirmDeleteCustomer}
                onCancel={() => setCustomerToDelete(null)}
            />
            )}

        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        <BottomNav />

      <BottomNav />
    </main>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#1f3d32]">{value}</p>
    </div>
  )
}