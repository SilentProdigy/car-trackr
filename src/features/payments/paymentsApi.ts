import { supabase } from '../../lib/supabase'
import { getCurrentBusiness } from '../../lib/business'
import type { Payment, PaymentFormData } from '../../types/database'
import { logActivity } from '../../lib/activityLog'

export async function getPayments(): Promise<Payment[]> {
  const business = await getCurrentBusiness()

  if (!business) {
    return []
  }

  const { data, error } = await supabase
    .from('payments')
    .select(
      `
      *,
      bookings (
        *,
        cars (*),
        customers (*)
      )
    `,
    )
    .eq('business_id', business.id)
    .is('deleted_at', null)
    .order('payment_date', { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function createPayment(
  formData: PaymentFormData,
  receiptFile?: File | null,
) {
  const business = await getCurrentBusiness()

  if (!business) {
    throw new Error('Please create a business first.')
  }

  if (!formData.booking_id) {
    throw new Error('Please select a booking.')
  }

  const paymentAmount = Number(formData.amount || 0)

  if (paymentAmount <= 0) {
    throw new Error('Payment amount must be greater than 0.')
  }

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('id, total_amount, down_payment, balance')
    .eq('id', formData.booking_id)
    .single()

  if (bookingError) {
    throw bookingError
  }

  let receiptUrl: string | null = null

  if (receiptFile) {
    receiptUrl = await uploadReceipt(receiptFile, business.id)
  }

  const { error } = await supabase.from('payments').insert({
    business_id: business.id,
    booking_id: formData.booking_id,
    amount: paymentAmount,
    payment_method: formData.payment_method || null,
    payment_date: formData.payment_date || new Date().toISOString().slice(0, 10),
    receipt_url: receiptUrl,
    notes: formData.notes || null,
  })

  if (error) {
    throw error
  }

  const newPaidAmount = Number(booking.down_payment || 0) + paymentAmount
  const totalAmount = Number(booking.total_amount || 0)
  const newBalance = Math.max(totalAmount - newPaidAmount, 0)

  let paymentStatus: 'unpaid' | 'partial' | 'paid' | 'refunded' = 'unpaid'

  if (newPaidAmount >= totalAmount) {
    paymentStatus = 'paid'
  } else if (newPaidAmount > 0) {
    paymentStatus = 'partial'
  }

  const { error: updateBookingError } = await supabase
    .from('bookings')
    .update({
      down_payment: newPaidAmount,
      balance: newBalance,
      payment_status: paymentStatus,
    })
    .eq('id', formData.booking_id)

  if (updateBookingError) {
    throw updateBookingError
  }

  await logActivity({
    action: 'created',
    entityType: 'payment',
    metadata: {
      booking_id: formData.booking_id,
      amount: paymentAmount,
    },
  })
}

export async function deletePayment(paymentId: string) {
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select('id, booking_id, amount')
    .eq('id', paymentId)
    .single()

  if (paymentError) {
    throw paymentError
  }

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('id, total_amount, down_payment')
    .eq('id', payment.booking_id)
    .single()

  if (bookingError) {
    throw bookingError
  }

  const { error } = await supabase
  .from('payments')
  .update({
    deleted_at: new Date().toISOString(),
  })
  .eq('id', paymentId)

  if (error) {
    throw error
  }

  await logActivity({
    action: 'soft_deleted',
    entityType: 'payment',
    entityId: paymentId,
  })

  const newPaidAmount = Math.max(
    Number(booking.down_payment || 0) - Number(payment.amount || 0),
    0,
  )

  const totalAmount = Number(booking.total_amount || 0)
  const newBalance = Math.max(totalAmount - newPaidAmount, 0)

  let paymentStatus: 'unpaid' | 'partial' | 'paid' | 'refunded' = 'unpaid'

  if (newPaidAmount >= totalAmount) {
    paymentStatus = 'paid'
  } else if (newPaidAmount > 0) {
    paymentStatus = 'partial'
  }

  const { error: updateBookingError } = await supabase
    .from('bookings')
    .update({
      down_payment: newPaidAmount,
      balance: newBalance,
      payment_status: paymentStatus,
    })
    .eq('id', payment.booking_id)

  if (updateBookingError) {
    throw updateBookingError
  }

  await logActivity({
    action: 'updated',
    entityType: 'booking',
    entityId: payment.booking_id,
    metadata: {
      down_payment: newPaidAmount,
      balance: newBalance,
      payment_status: paymentStatus,
    },
  })
}

async function uploadReceipt(file: File, businessId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${businessId}/${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw uploadError
  }

  return fileName
}