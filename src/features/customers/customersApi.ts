import { supabase } from '../../lib/supabase'
import { getCurrentBusiness } from '../../lib/business'
import type { Customer, CustomerFormData } from '../../types/database'
import { logActivity } from '../../lib/activityLog'

export async function getCustomers(): Promise<Customer[]> {
  const business = await getCurrentBusiness()

  if (!business) {
    return []
  }

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('business_id', business.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function createCustomer(
  formData: CustomerFormData,
  validIdFile?: File | null,
  driverLicenseFile?: File | null,
) {
  const business = await getCurrentBusiness()

  if (!business) {
    throw new Error('Please create a business first.')
  }

  let validIdUrl: string | null = null
  let driverLicenseUrl: string | null = null

  if (validIdFile) {
    validIdUrl = await uploadCustomerDocument(validIdFile, business.id, 'valid-id')
  }

  if (driverLicenseFile) {
    driverLicenseUrl = await uploadCustomerDocument(
      driverLicenseFile,
      business.id,
      'driver-license',
    )
  }

  const payload = {
    business_id: business.id,
    full_name: formData.full_name,
    phone: formData.phone || null,
    email: formData.email || null,
    address: formData.address || null,
    emergency_contact: formData.emergency_contact || null,
    notes: formData.notes || null,
    valid_id_url: validIdUrl,
    driver_license_url: driverLicenseUrl,
  }

  const { error } = await supabase.from('customers').insert(payload)

  if (error) {
    throw error
  }

  await logActivity({
    action: 'created',
    entityType: 'customer',
    metadata: {
      full_name: formData.full_name,
      email: formData.email,
    },
  })
}

export async function deleteCustomer(customerId: string) {
  const { data: existingBookings, error: bookingError } = await supabase
    .from('bookings')
    .select('id')
    .eq('customer_id', customerId)
    .is('deleted_at', null)
    .limit(1)

  if (bookingError) {
    throw bookingError
  }

  if (existingBookings && existingBookings.length > 0) {
    throw new Error(
      'This customer has booking records. Keep the customer record for history.',
    )
  }

  const { error } = await supabase
    .from('customers')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq('id', customerId)

  if (error) {
    throw error
  }

  await logActivity({
    action: 'soft_deleted',
    entityType: 'customer',
    entityId: customerId,
  })
}

async function uploadCustomerDocument(
  file: File,
  businessId: string,
  folder: 'valid-id' | 'driver-license',
) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${businessId}/${folder}/${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('customer-documents')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw uploadError
  }

  return fileName
}

export async function updateCustomer(
  customerId: string,
  formData: CustomerFormData,
  validIdFile?: File | null,
  driverLicenseFile?: File | null,
) {
  const business = await getCurrentBusiness()

  if (!business) {
    throw new Error('Please create a business first.')
  }

  let validIdUrl: string | null | undefined = undefined
  let driverLicenseUrl: string | null | undefined = undefined

  if (validIdFile) {
    validIdUrl = await uploadCustomerDocument(validIdFile, business.id, 'valid-id')
  }

  if (driverLicenseFile) {
    driverLicenseUrl = await uploadCustomerDocument(
      driverLicenseFile,
      business.id,
      'driver-license',
    )
  }

  const payload: {
    full_name: string
    phone: string | null
    email: string | null
    address: string | null
    emergency_contact: string | null
    notes: string | null
    valid_id_url?: string | null
    driver_license_url?: string | null
  } = {
    full_name: formData.full_name,
    phone: formData.phone || null,
    email: formData.email || null,
    address: formData.address || null,
    emergency_contact: formData.emergency_contact || null,
    notes: formData.notes || null,
  }

  if (validIdUrl !== undefined) {
    payload.valid_id_url = validIdUrl
  }

  if (driverLicenseUrl !== undefined) {
    payload.driver_license_url = driverLicenseUrl
  }

  const { error } = await supabase
    .from('customers')
    .update(payload)
    .eq('id', customerId)

  if (error) {
    throw error
  }

  await logActivity({
    action: 'updated',
    entityType: 'customer',
    entityId: customerId,
    metadata: {
      full_name: formData.full_name,
      email: formData.email,
    },
  })
}