import { supabase } from '../../lib/supabase'
import { getCurrentBusiness } from '../../lib/business'
import type {
  Maintenance,
  MaintenanceFormData,
  MaintenanceStatus,
} from '../../types/database'
import { logActivity } from '../../lib/activityLog'

export async function getMaintenanceRecords(): Promise<Maintenance[]> {
  const business = await getCurrentBusiness()

  if (!business) {
    return []
  }

  const { data, error } = await supabase
    .from('maintenance')
    .select(
      `
      *,
      cars (*)
    `,
    )
    .eq('business_id', business.id)
    .is('deleted_at', null)
    .order('service_date', { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function createMaintenanceRecord(
  formData: MaintenanceFormData,
  receiptFile?: File | null,
) {
  const business = await getCurrentBusiness()

  if (!business) {
    throw new Error('Please create a business first.')
  }

  if (!formData.car_id) {
    throw new Error('Please select a car.')
  }

  const cost = Number(formData.cost || 0)

  let receiptUrl: string | null = null

  if (receiptFile) {
    receiptUrl = await uploadMaintenanceFile(receiptFile, business.id)
  }

  const { error } = await supabase.from('maintenance').insert({
    business_id: business.id,
    car_id: formData.car_id,
    maintenance_type: formData.maintenance_type || null,
    description: formData.description || null,
    cost,
    service_date: formData.service_date || null,
    next_service_date: formData.next_service_date || null,
    status: formData.status,
    receipt_url: receiptUrl,
  })

  if (error) {
    throw error
  }

  if (formData.status === 'scheduled' || formData.status === 'in_progress') {
    await supabase
      .from('cars')
      .update({
        status: 'maintenance',
      })
      .eq('id', formData.car_id)
  }

  if (formData.status === 'completed') {
    await supabase
      .from('cars')
      .update({
        status: 'available',
      })
      .eq('id', formData.car_id)
  }

  await logActivity({
    action: 'created',
    entityType: 'maintenance',
    metadata: {
      car_id: formData.car_id,
      maintenance_type: formData.maintenance_type,
      cost,
    },
  })
}

export async function updateMaintenanceStatus(
  maintenanceId: string,
  status: MaintenanceStatus,
) {
  const { data: record, error: recordError } = await supabase
    .from('maintenance')
    .select('id, car_id')
    .eq('id', maintenanceId)
    .single()

  if (recordError) {
    throw recordError
  }

  const { error } = await supabase
    .from('maintenance')
    .update({
      status,
    })
    .eq('id', maintenanceId)

  if (error) {
    throw error
  }

  if (status === 'scheduled' || status === 'in_progress') {
    await supabase
      .from('cars')
      .update({
        status: 'maintenance',
      })
      .eq('id', record.car_id)
  }

  if (status === 'completed') {
    await supabase
      .from('cars')
      .update({
        status: 'available',
      })
      .eq('id', record.car_id)
  }
}

export async function deleteMaintenanceRecord(maintenanceId: string) {
  const { error } = await supabase
    .from('maintenance')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq('id', maintenanceId)

  if (error) {
    throw error
  }

  await logActivity({
    action: 'soft_deleted',
    entityType: 'maintenance',
    entityId: maintenanceId,
  })
}

async function uploadMaintenanceFile(file: File, businessId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${businessId}/${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('maintenance-files')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw uploadError
  }

  return fileName
}