import { supabase } from '../../lib/supabase'
import { getCurrentBusiness } from '../../lib/business'
import type { Booking, BookingFormData, BookingStatus } from '../../types/database'
import { logActivity } from '../../lib/activityLog'

export async function getBookings(): Promise<Booking[]> {
  const business = await getCurrentBusiness()

  if (!business) {
    return []
  }

  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      *,
      cars (*),
      customers (*)
    `,
    )
    .eq('business_id', business.id)
    .is('deleted_at', null)
    .order('pickup_date', { ascending: true })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function createBooking(formData: BookingFormData) {
  const business = await getCurrentBusiness()

  if (!business) {
    throw new Error('Please create a business first.')
  }

  const pickupDate = new Date(formData.pickup_date)
  const returnDate = new Date(formData.return_date)

  if (!formData.car_id) {
    throw new Error('Please select a car.')
  }

  if (!formData.customer_id) {
    throw new Error('Please select a customer.')
  }

  if (!formData.pickup_date || !formData.return_date) {
    throw new Error('Please select pickup and return dates.')
  }

  if (returnDate < pickupDate) {
    throw new Error('Return date cannot be earlier than pickup date.')
  }

  const hasConflict = await checkBookingConflict({
    businessId: business.id,
    carId: formData.car_id,
    pickupDate: formData.pickup_date,
    returnDate: formData.return_date,
  })

  if (hasConflict) {
    throw new Error('This car is already booked within the selected date range.')
  }

  const rentalDays = calculateRentalDays(formData.pickup_date, formData.return_date)
  const dailyRate = Number(formData.daily_rate || 0)
  const downPayment = Number(formData.down_payment || 0)
  const totalAmount = rentalDays * dailyRate
  const balance = totalAmount - downPayment

  const payload = {
    business_id: business.id,
    car_id: formData.car_id,
    customer_id: formData.customer_id,
    pickup_date: formData.pickup_date,
    return_date: formData.return_date,
    daily_rate: dailyRate,
    total_amount: totalAmount,
    down_payment: downPayment,
    balance,
    booking_status: formData.booking_status,
    payment_status: formData.payment_status,
    notes: formData.notes || null,
  }

  const { error } = await supabase.from('bookings').insert(payload)

  if (error) {
    throw error
  }

  await logActivity({
    action: 'created',
    entityType: 'booking',
    metadata: {
      car_id: formData.car_id,
      customer_id: formData.customer_id,
    },
  })

  if (
    formData.booking_status === 'confirmed' ||
    formData.booking_status === 'ongoing'
  ) {
    await supabase
      .from('cars')
      .update({
        status: formData.booking_status === 'ongoing' ? 'rented' : 'reserved',
      })
      .eq('id', formData.car_id)
  }
}

export async function deleteBooking(bookingId: string) {
  const { error } = await supabase
    .from('bookings')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq('id', bookingId)

  if (error) {
    throw error
  }

  await logActivity({
    action: 'soft_deleted',
    entityType: 'booking',
    entityId: bookingId,
  })
}

export async function checkBookingConflict({
  businessId,
  carId,
  pickupDate,
  returnDate,
}: {
  businessId: string
  carId: string
  pickupDate: string
  returnDate: string
}) {
  const { data, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('business_id', businessId)
    .eq('car_id', carId)
    .is('deleted_at', null)
    .in('booking_status', ['pending', 'confirmed', 'ongoing'])
    .lte('pickup_date', returnDate)
    .gte('return_date', pickupDate)
    .limit(1)

  if (error) {
    throw error
  }

  return Boolean(data && data.length > 0)
}

export function calculateRentalDays(pickupDate: string, returnDate: string) {
  if (!pickupDate || !returnDate) return 0

  const start = new Date(pickupDate)
  const end = new Date(returnDate)

  const diffTime = end.getTime() - start.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(diffDays || 1, 1)
}

export async function updateBookingStatus(
  bookingId: string,
  bookingStatus: BookingStatus,
) {
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('id, car_id')
    .eq('id', bookingId)
    .single()

  if (bookingError) {
    throw bookingError
  }

  const { error } = await supabase
    .from('bookings')
    .update({
      booking_status: bookingStatus,
    })
    .eq('id', bookingId)

  if (error) {
    throw error
  }

  let carStatus:
    | 'available'
    | 'reserved'
    | 'rented'
    | 'maintenance'
    | 'inactive'
    | null = null

  if (bookingStatus === 'pending') {
    carStatus = 'available'
  }

  if (bookingStatus === 'confirmed') {
    carStatus = 'reserved'
  }

  if (bookingStatus === 'ongoing') {
    carStatus = 'rented'
  }

  if (bookingStatus === 'completed' || bookingStatus === 'cancelled') {
    carStatus = 'available'
  }

  if (carStatus) {
    const { error: carError } = await supabase
      .from('cars')
      .update({
        status: carStatus,
      })
      .eq('id', booking.car_id)

    if (carError) {
      throw carError
    }
  }

  await logActivity({
    action: 'updated',
    entityType: 'booking',
    entityId: bookingId,
    metadata: {
      booking_status: bookingStatus,
    },
  })
}