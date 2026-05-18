import { supabase } from '../../lib/supabase'
import { getCurrentBusiness } from '../../lib/business'
import type { Business } from '../../types/database'

export type UserAccessInfo = {
  isSuperAdmin: boolean
  business: Business | null
  hasBusiness: boolean
}

export async function getUserAccessInfo(): Promise<UserAccessInfo> {
  const { data: isSuperAdmin, error: superAdminError } =
    await supabase.rpc('is_super_admin')

  if (superAdminError) {
    throw superAdminError
  }

  let business: Business | null = null

  try {
    business = await getCurrentBusiness()
  } catch {
    business = null
  }

  return {
    isSuperAdmin: Boolean(isSuperAdmin),
    business,
    hasBusiness: Boolean(business),
  }
}

export function resolveAccessRedirect(access: UserAccessInfo) {
  if (access.isSuperAdmin && access.hasBusiness) {
    return '/choose-access'
  }

  if (access.isSuperAdmin && !access.hasBusiness) {
    return '/admin'
  }

  if (!access.isSuperAdmin && access.hasBusiness) {
    return '/dashboard'
  }

  return '/business-setup'
}