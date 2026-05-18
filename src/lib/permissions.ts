import { supabase } from './supabase'
import { getCurrentBusiness } from './business'

export type BusinessRole = 'owner' | 'manager' | 'staff' | 'viewer' | 'none'

export type PermissionSet = {
  role: BusinessRole
  canView: boolean
  canWrite: boolean
  canManage: boolean
  canDelete: boolean
  canManageMembers: boolean
}

export async function getCurrentUserPermissions(): Promise<PermissionSet> {
  const business = await getCurrentBusiness()

  if (!business) {
    return {
      role: 'none',
      canView: false,
      canWrite: false,
      canManage: false,
      canDelete: false,
      canManageMembers: false,
    }
  }

  const { data, error } = await supabase.rpc('get_business_role', {
    target_business_id: business.id,
  })

  if (error) {
    throw error
  }

  const role = (data ?? 'none') as BusinessRole

  return {
    role,
    canView: ['owner', 'manager', 'staff', 'viewer'].includes(role),
    canWrite: ['owner', 'manager', 'staff'].includes(role),
    canManage: ['owner', 'manager'].includes(role),
    canDelete: ['owner', 'manager'].includes(role),
    canManageMembers: role === 'owner',
  }
}