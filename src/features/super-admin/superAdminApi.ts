import { supabase } from '../../lib/supabase'

export type AdminBusiness = {
  id: string
  owner_id: string
  business_name: string
  logo_url: string | null
  phone: string | null
  email: string | null
  address: string | null
  status: 'active' | 'suspended' | 'inactive'
  is_verified: boolean
  suspended_at: string | null
  suspension_reason: string | null
  created_at: string
  profiles?: {
    id: string
    full_name: string | null
    role: string
  } | null
}

export type AdminProfile = {
  id: string
  full_name: string | null
  role: string
  created_at: string
}

export async function getAdminStats() {
  const [
    businessesResult,
    profilesResult,
    carsResult,
    customersResult,
    bookingsResult,
    paymentsResult,
    expensesResult,
  ] = await Promise.all([
    supabase.from('businesses').select('*'),
    supabase.from('profiles').select('*'),
    supabase.from('cars').select('*').is('deleted_at', null),
    supabase.from('customers').select('*').is('deleted_at', null),
    supabase.from('bookings').select('*').is('deleted_at', null),
    supabase.from('payments').select('*').is('deleted_at', null),
    supabase.from('expenses').select('*').is('deleted_at', null),
  ])

  if (businessesResult.error) throw businessesResult.error
  if (profilesResult.error) throw profilesResult.error
  if (carsResult.error) throw carsResult.error
  if (customersResult.error) throw customersResult.error
  if (bookingsResult.error) throw bookingsResult.error
  if (paymentsResult.error) throw paymentsResult.error
  if (expensesResult.error) throw expensesResult.error

  const businesses = businessesResult.data ?? []
  const profiles = profilesResult.data ?? []
  const cars = carsResult.data ?? []
  const customers = customersResult.data ?? []
  const bookings = bookingsResult.data ?? []
  const payments = paymentsResult.data ?? []
  const expenses = expensesResult.data ?? []

  const totalCollected = payments.reduce((sum, payment) => {
    return sum + Number(payment.amount)
  }, 0)

  const totalExpenses = expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount)
  }, 0)

  return {
    totalBusinesses: businesses.length,
    activeBusinesses: businesses.filter((item) => item.status === 'active').length,
    suspendedBusinesses: businesses.filter((item) => item.status === 'suspended').length,
    totalUsers: profiles.length,
    superAdmins: profiles.filter((item) => item.role === 'super_admin').length,
    totalCars: cars.length,
    totalCustomers: customers.length,
    totalBookings: bookings.length,
    totalCollected,
    totalExpenses,
  }
}

export async function getAdminBusinesses(): Promise<AdminBusiness[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  const businesses = data ?? []

  const ownerIds = businesses.map((business) => business.owner_id)

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .in('id', ownerIds)

  if (profilesError) {
    throw profilesError
  }

  return businesses.map((business) => ({
    ...business,
    profiles:
      profiles?.find((profile) => profile.id === business.owner_id) ?? null,
  }))
}

export async function getAdminProfiles(): Promise<AdminProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return data ?? []
}

export async function updateBusinessStatus({
  businessId,
  status,
  reason,
}: {
  businessId: string
  status: 'active' | 'suspended' | 'inactive'
  reason?: string
}) {
  const payload = {
    status,
    suspended_at: status === 'suspended' ? new Date().toISOString() : null,
    suspension_reason: status === 'suspended' ? reason ?? null : null,
  }

  const { error } = await supabase
    .from('businesses')
    .update(payload)
    .eq('id', businessId)

  if (error) throw error
}

export async function updateBusinessVerification({
  businessId,
  isVerified,
}: {
  businessId: string
  isVerified: boolean
}) {
  const { error } = await supabase
    .from('businesses')
    .update({
      is_verified: isVerified,
    })
    .eq('id', businessId)

  if (error) throw error
}

export async function updateProfileRole({
  profileId,
  role,
}: {
  profileId: string
  role: 'owner' | 'staff' | 'super_admin'
}) {
  const { error } = await supabase
    .from('profiles')
    .update({
      role,
    })
    .eq('id', profileId)

  if (error) throw error
}