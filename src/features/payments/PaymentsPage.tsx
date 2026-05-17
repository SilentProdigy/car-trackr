import { useState } from 'react'
import { Plus, Receipt, RefreshCcw } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BottomNav } from '../../components/layout/BottomNav'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { getBookings } from '../bookings/bookingsApi'
import type { PaymentFormData } from '../../types/database'
import { AddPaymentForm } from './AddPaymentForm'
import { PaymentCard } from './PaymentCard'
import { createPayment, deletePayment, getPayments } from './paymentsApi'

export function PaymentsPage() {
  const queryClient = useQueryClient()

  const [showAddForm, setShowAddForm] = useState(false)
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null)

  const {
    data: payments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['payments'],
    queryFn: getPayments,
  })

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  })

  const createMutation = useMutation({
    mutationFn: ({
      formData,
      receiptFile,
    }: {
      formData: PaymentFormData
      receiptFile?: File | null
    }) => createPayment(formData, receiptFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
        queryClient.invalidateQueries({ queryKey: ['cars'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deletePayment,
  })

  const selectedPayment = payments.find(
    (payment) => payment.id === paymentToDelete,
  )

  const unpaidBookings = bookings.filter(
    (booking) =>
      booking.booking_status !== 'cancelled' &&
      Number(booking.balance) > 0,
  )

  const totalCollected = payments.reduce((sum, payment) => {
    return sum + Number(payment.amount)
  }, 0)

  async function handleCreatePayment(
    formData: PaymentFormData,
    receiptFile?: File | null,
  ) {
    await createMutation.mutateAsync({
      formData,
      receiptFile,
    })
  }

  function confirmDeletePayment() {
    if (!paymentToDelete) return

    deleteMutation.mutate(paymentToDelete, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['payments'] })
        queryClient.invalidateQueries({ queryKey: ['bookings'] })
        setPaymentToDelete(null)
      },
    })
  }

  return (
    <main className="min-h-screen bg-[#f6f8f7] pb-24">
      <header className="bg-[#1f3d32] px-5 py-6 text-white">
        <p className="text-sm opacity-80">Revenue Tracking</p>

        <div className="mt-1 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Payments</h1>

          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-[#1f3d32]"
          >
            <Plus size={18} />
            Add
          </button>
        </div>
      </header>

      <section className="px-5 py-5">
        {isLoading && (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#d7e5dd] border-t-[#1f3d32]" />
            <p className="text-sm font-semibold text-[#1f3d32]">
              Loading payments...
            </p>
          </div>
        )}

        {isError && (
          <div className="rounded-3xl bg-red-50 p-5 text-red-700">
            <p className="text-sm font-bold">Failed to load payments.</p>
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

        {!isLoading && !isError && payments.length === 0 && (
          <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e8f0ec] text-[#1f3d32]">
              <Receipt size={28} />
            </div>

            <h2 className="text-lg font-bold text-[#10231c]">
              No payments yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Record customer payments for bookings.
            </p>

            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="mt-5 rounded-2xl bg-[#1f3d32] px-5 py-3 text-sm font-bold text-white"
            >
              Add First Payment
            </button>
          </div>
        )}

        {!isLoading && !isError && payments.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <SummaryCard
                label="Total Collected"
                value={`₱${Number(totalCollected).toLocaleString()}`}
              />

              <SummaryCard
                label="Payments"
                value={String(payments.length)}
              />
            </div>

            {payments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onDelete={setPaymentToDelete}
              />
            ))}
          </div>
        )}
      </section>

      {showAddForm && (
        <AddPaymentForm
          bookings={unpaidBookings}
          onSubmit={handleCreatePayment}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {paymentToDelete && (
        <ConfirmModal
          title="Delete payment?"
          message={`Are you sure you want to delete this payment of ₱${Number(
            selectedPayment?.amount ?? 0,
          ).toLocaleString()}? The booking balance will be recalculated.`}
          confirmLabel="Delete Payment"
          cancelLabel="Keep Payment"
          loading={deleteMutation.isPending}
          onConfirm={confirmDeletePayment}
          onCancel={() => setPaymentToDelete(null)}
        />
      )}

      <BottomNav />
    </main>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-[#1f3d32]">{value}</p>
    </div>
  )
}