import { supabase } from './supabase'
import { getCurrentBusiness } from './business'

type LogActivityParams = {
  action: string
  entityType: string
  entityId?: string | null
  metadata?: Record<string, unknown>
}

export async function logActivity({
  action,
  entityType,
  entityId,
  metadata = {},
}: LogActivityParams) {
  try {
    const business = await getCurrentBusiness()

    if (!business) return

    const {
      data: { user },
    } = await supabase.auth.getUser()

    await supabase.from('activity_logs').insert({
      business_id: business.id,
      user_id: user?.id ?? null,
      action,
      entity_type: entityType,
      entity_id: entityId ?? null,
      metadata,
    })
  } catch (error) {
    console.warn('Activity log failed:', error)
  }
}