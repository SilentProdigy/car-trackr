import { supabase } from '../../lib/supabase'
import { getCurrentBusiness } from '../../lib/business'
import type { Car, CarFormData } from '../../types/database'
import { logActivity } from '../../lib/activityLog'

export async function getCars(): Promise<Car[]> {
  const business = await getCurrentBusiness()

  if (!business) {
    return []
  }

  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('business_id', business.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function createCar(formData: CarFormData, photoFile?: File | null) {
  const business = await getCurrentBusiness()

  if (!business) {
    throw new Error('Please create a business first.')
  }

  let photoUrl: string | null = null

  if (photoFile) {
    photoUrl = await uploadCarPhoto(photoFile, business.id)
  }

  const payload = {
    business_id: business.id,
    car_name: formData.car_name,
    brand: formData.brand || null,
    model: formData.model || null,
    plate_number: formData.plate_number,
    year: formData.year ? Number(formData.year) : null,
    transmission: formData.transmission || null,
    fuel_type: formData.fuel_type || null,
    seats: formData.seats ? Number(formData.seats) : null,
    daily_rate: formData.daily_rate ? Number(formData.daily_rate) : 0,
    status: formData.status,
    photo_url: photoUrl,
    notes: formData.notes || null,
  }

  const { error } = await supabase.from('cars').insert(payload)

  if (error) {
    throw error
  }

  
  await logActivity({
    action: 'created',
    entityType: 'car',
    metadata: {
      car_name: formData.car_name,
      plate_number: formData.plate_number,
    },
  })
}

export async function deleteCar(carId: string) {
  const { data: existingBookings, error: bookingError } = await supabase
    .from('bookings')
    .select('id')
    .eq('car_id', carId)
    .is('deleted_at', null)
    .limit(1)

  if (bookingError) {
    throw bookingError
  }

  if (existingBookings && existingBookings.length > 0) {
    throw new Error(
      'This car has booking records. Mark it as inactive instead of deleting it.',
    )
  }

  const { error } = await supabase
    .from('cars')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq('id', carId)

  if (error) {
    throw error
  }

  await logActivity({
    action: 'soft_deleted',
    entityType: 'car',
    entityId: carId,
  })
}

async function uploadCarPhoto(file: File, businessId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${businessId}/${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('car-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage.from('car-photos').getPublicUrl(fileName)

  return data.publicUrl
}

export async function updateCar(
  carId: string,
  formData: CarFormData,
  photoFile?: File | null,
) {
  const business = await getCurrentBusiness()

  if (!business) {
    throw new Error('Please create a business first.')
  }

  let photoUrl: string | null | undefined = undefined

  if (photoFile) {
    photoUrl = await uploadCarPhoto(photoFile, business.id)
  }

  const payload: {
    car_name: string
    brand: string | null
    model: string | null
    plate_number: string
    year: number | null
    transmission: string | null
    fuel_type: string | null
    seats: number | null
    daily_rate: number
    status: string
    notes: string | null
    photo_url?: string | null
  } = {
    car_name: formData.car_name,
    brand: formData.brand || null,
    model: formData.model || null,
    plate_number: formData.plate_number,
    year: formData.year ? Number(formData.year) : null,
    transmission: formData.transmission || null,
    fuel_type: formData.fuel_type || null,
    seats: formData.seats ? Number(formData.seats) : null,
    daily_rate: formData.daily_rate ? Number(formData.daily_rate) : 0,
    status: formData.status,
    notes: formData.notes || null,
  }

  if (photoUrl !== undefined) {
    payload.photo_url = photoUrl
  }

  const { error } = await supabase
    .from('cars')
    .update(payload)
    .eq('id', carId)

  if (error) {
    throw error
  }

  await logActivity({
    action: 'updated',
    entityType: 'car',
    entityId: carId,
    metadata: {
      car_name: formData.car_name,
      plate_number: formData.plate_number,
    },
  })
}