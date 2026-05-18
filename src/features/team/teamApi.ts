import { supabase } from '../../lib/supabase'
import { getCurrentBusiness } from '../../lib/business'
import type { BusinessRole } from '../../lib/permissions'

export type BusinessMember = {
  id: string
  business_id: string
  user_id: string
  role: BusinessRole
  status: 'active' | 'inactive'
  created_at: string
}

export type AddMemberFormData = {
  user_id: string
  role: 'manager' | 'staff' | 'viewer'
}

export async function getBusinessMembers(): Promise<BusinessMember[]> {
  const business = await getCurrentBusiness()

  if (!business) return []

  const { data, error } = await supabase
    .from('business_members')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data ?? []
}

export async function addBusinessMember(formData: AddMemberFormData) {
  const business = await getCurrentBusiness()

  if (!business) {
    throw new Error('Please create a business first.')
  }

  const { error } = await supabase.from('business_members').insert({
    business_id: business.id,
    user_id: formData.user_id,
    role: formData.role,
    status: 'active',
  })

  if (error) throw error
}

export async function updateBusinessMemberRole(
  memberId: string,
  role: 'manager' | 'staff' | 'viewer',
) {
  const { error } = await supabase
    .from('business_members')
    .update({ role })
    .eq('id', memberId)

  if (error) throw error
}

export async function deactivateBusinessMember(memberId: string) {
  const { error } = await supabase
    .from('business_members')
    .update({ status: 'inactive' })
    .eq('id', memberId)

  if (error) throw error
}