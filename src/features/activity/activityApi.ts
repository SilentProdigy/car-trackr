import { supabase } from '../../lib/supabase'
import { getCurrentBusiness } from '../../lib/business'

export type ActivityLog = {
  id: string
  business_id: string
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export async function getActivityLogs(): Promise<ActivityLog[]> {
  const business = await getCurrentBusiness()

  if (!business) return []

  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw error

  return data ?? []
}