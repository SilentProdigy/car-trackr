import { supabase } from '../../lib/supabase'
import { getCurrentBusiness } from '../../lib/business'
import type { Business, Profile } from '../../types/database'
import { logActivity } from '../../lib/activityLog'

export type ProfileSettingsData = {
  profile: Profile | null
  business: Business | null
  userEmail: string | null
}

export type ProfileFormData = {
  full_name: string
  business_name: string
  phone: string
  email: string
  address: string
}

export async function getProfileSettings(): Promise<ProfileSettingsData> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('User is not logged in.')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) {
    throw profileError
  }

  const business = await getCurrentBusiness()

  return {
    profile,
    business,
    userEmail: user.email ?? null,
  }
}

export async function updateProfileSettings(
  formData: ProfileFormData,
  logoFile?: File | null,
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('User is not logged in.')
  }

  const business = await getCurrentBusiness()

  let logoUrl: string | null | undefined = undefined

  if (logoFile && business) {
    logoUrl = await uploadBusinessLogo(logoFile, business.id)
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: formData.full_name || null,
      role: 'owner',
    })

  if (profileError) {
    throw profileError
  }

  if (!business) {
    const { error: businessError } = await supabase.from('businesses').insert({
      owner_id: user.id,
      business_name: formData.business_name,
      phone: formData.phone || null,
      email: formData.email || null,
      address: formData.address || null,
      logo_url: logoUrl ?? null,
    })

    if (businessError) {
      throw businessError
    }

    return
  }

  const payload: {
    business_name: string
    phone: string | null
    email: string | null
    address: string | null
    logo_url?: string | null
  } = {
    business_name: formData.business_name,
    phone: formData.phone || null,
    email: formData.email || null,
    address: formData.address || null,
  }

  if (logoUrl !== undefined) {
    payload.logo_url = logoUrl
  }

  const { error: businessError } = await supabase
    .from('businesses')
    .update(payload)
    .eq('id', business.id)

  if (businessError) {
    throw businessError
  }
}

async function uploadBusinessLogo(file: File, businessId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${businessId}/${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('business-logos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw uploadError
  }

  await logActivity({
    action: 'created',
    entityType: 'logo',
    entityId: fileName,
  })

  const { data } = supabase.storage.from('business-logos').getPublicUrl(fileName)

  return data.publicUrl
}