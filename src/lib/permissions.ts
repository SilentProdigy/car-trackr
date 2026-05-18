import { supabase } from './supabase'
import { getCurrentBusiness } from './business'

export type BusinessRole = 'super_admin' | 'owner' | 'manager' | 'staff' | 'viewer' | 'none'

export type PermissionSet = {
  role: BusinessRole
  canView: boolean
  canWrite: boolean
  canManage: boolean
  canDelete: boolean
  canManageMembers: boolean
  isSuperAdmin?: boolean
}

export async function getCurrentUserPermissions(): Promise<PermissionSet> {
  const { data: isSuperAdminData, error: superAdminError } = await supabase.rpc('is_super_admin')

  if (superAdminError) {
    throw superAdminError
  }

  if (isSuperAdminData === true) {
    return {
      role: 'super_admin',
      canView: true,
      canWrite: true,
      canManage: true,
      canDelete: true,
      canManageMembers: true,
      isSuperAdmin: true,
    }
  }

  const business = await getCurrentBusiness()

  if (!business) {
    return {
      role: 'none',
      canView: false,
      canWrite: false,
      canManage: false,
      canDelete: false,
      canManageMembers: false,
      isSuperAdmin: false,
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
    canView: ['super_admin', 'owner', 'manager', 'staff', 'viewer'].includes(role),
    canWrite: ['super_admin', 'owner', 'manager', 'staff'].includes(role),
    canManage: ['super_admin', 'owner', 'manager'].includes(role),
    canDelete: ['super_admin', 'owner', 'manager'].includes(role),
    canManageMembers: role === 'owner' || role === 'super_admin',
    isSuperAdmin: role === 'super_admin',
  }
}