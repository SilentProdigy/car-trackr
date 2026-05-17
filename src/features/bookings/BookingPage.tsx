import { useState } from 'react'
import { CalendarDays, Plus, RefreshCcw } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BottomNav } from '../../components/layout/BottomNav'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { getCars } from '../cars/carsApi'
import { getCustomers } from '../customers/customersApi'
import type { BookingFormData, BookingStatus } from '../../types/database'
import { AddBookingForm } from './AddBookingForm'
import { BookingCard } from './BookingCard'
import {
  createBooking,
  deleteBooking,
  getBookings,
  updateBookingStatus,
} from './bookingsApi'

export function BookingsPage() {
  const queryClient = useQueryClient()

  const [showAddForm, setShowAddForm] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null)

  const updateStatusMutation = useMutation({
    mutationFn: ({
        bookingId,
        status,
    }: {
        bookingId: string
        status: BookingStatus
    }) => updateBookingStatus(bookingId, status),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bookings'] })
        queryClient.invalidateQueries({ queryKey: ['cars'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    })

    function handleUpdateBookingStatus(bookingId: string, status: BookingStatus) {
        updateStatusMutation.mutate({
            bookingId,
            status,
        })
    }

  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    isError: bookingsError,
    error: bookingsErrorData,
    refetch,
  } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  })

  const { data: cars = [] } = useQuery({
    queryKey: ['cars'],
    queryFn: getCars,
  })

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  })

  const createMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['cars'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBooking,
  })

  const selectedBooking = bookings.find(
    (booking) => booking.id === bookingToDelete,
  )

  async function handleCreateBooking(formData: BookingFormData) {
    await createMutation.mutateAsync(formData)
  }

  function handleDeleteBooking(bookingId: string) {
    setBookingToDelete(bookingId)
  }

  function confirmDeleteBooking() {
    if (!bookingToDelete) return

    deleteMutation.mutate(bookingToDelete, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bookings'] })
        setBookingToDelete(null)
      },
    })
  }

  const totalRevenue = bookings.reduce((sum, booking) => {
    if (booking.booking_status === 'cancelled') return sum
    return sum + Number(booking.total_amount)
  }, 0)

  const pendingBalances = bookings.reduce((sum, booking) => {
    if (booking.booking_status === 'cancelled') return sum
    return sum + Number(booking.balance)
  }, 0)

  return (
    <main className="min-h-screen bg-[#f6f8f7] pb-24">
      <header className="bg-[#1f3d32] px-5 py-6 text-white">
        <p className="text-sm opacity-80">Reservations</p>

        <div className="mt-1 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Bookings</h1>

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
        {bookingsLoading && (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#d7e5dd] border-t-[#1f3d32]" />
            <p className="text-sm font-semibold text-[#1f3d32]">
              Loading bookings...
            </p>
          </div>
        )}

        {bookingsError && (
          <div className="rounded-3xl bg-red-50 p-5 text-red-700">
            <p className="text-sm font-bold">Failed to load bookings.</p>
            <p className="mt-1 text-sm">
              {bookingsErrorData instanceof Error
                ? bookingsErrorData.message
                : 'Unknown error'}
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

        {!bookingsLoading && !bookingsError && bookings.length === 0 && (
          <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e8f0ec] text-[#1f3d32]">
              <CalendarDays size={28} />
            </div>

            <h2 className="text-lg font-bold text-[#10231c]">
              No bookings yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Create your first car rental booking.
            </p>

            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="mt-5 rounded-2xl bg-[#1f3d32] px-5 py-3 text-sm font-bold text-white"
            >
              Add First Booking
            </button>
          </div>
        )}

        {!bookingsLoading && !bookingsError && bookings.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <SummaryCard label="Total Bookings" value={String(bookings.length)} />
              <SummaryCard
                label="Total Revenue"
                value={`₱${Number(totalRevenue).toLocaleString()}`}
              />
              <SummaryCard
                label="Pending Balance"
                value={`₱${Number(pendingBalances).toLocaleString()}`}
              />
              <SummaryCard
                label="Ongoing"
                value={String(
                  bookings.filter(
                    (booking) => booking.booking_status === 'ongoing',
                  ).length,
                )}
              />
            </div>

            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onDelete={handleDeleteBooking}
                onUpdateStatus={handleUpdateBookingStatus}
                />
            ))}
          </div>
        )}
      </section>

      {showAddForm && (
        <AddBookingForm
          cars={cars}
          customers={customers}
          onSubmit={handleCreateBooking}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {bookingToDelete && (
        <ConfirmModal
          title="Delete booking?"
          message={`Are you sure you want to delete the booking for ${
            selectedBooking?.customers?.full_name ?? 'this customer'
          }? This action cannot be undone.`}
          confirmLabel="Delete Booking"
          cancelLabel="Keep Booking"
          loading={deleteMutation.isPending}
          onConfirm={confirmDeleteBooking}
          onCancel={() => setBookingToDelete(null)}
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