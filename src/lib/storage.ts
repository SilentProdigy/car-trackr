import { supabase } from './supabase'

export function getStoragePathFromUrlOrPath(value: string) {
  try {
    const url = new URL(value)
    const marker = '/object/public/'

    if (url.pathname.includes(marker)) {
      const afterMarker = url.pathname.split(marker)[1]
      const parts = afterMarker.split('/')
      parts.shift()
      return parts.join('/')
    }

    const signedMarker = '/object/sign/'

    if (url.pathname.includes(signedMarker)) {
      const afterMarker = url.pathname.split(signedMarker)[1]
      const parts = afterMarker.split('/')
      parts.shift()
      return parts.join('/')
    }

    return value
  } catch {
    return value
  }
}

export async function createSignedFileUrl(
  bucket: string,
  filePathOrUrl: string,
  expiresInSeconds = 60 * 10,
) {
  const filePath = getStoragePathFromUrlOrPath(filePathOrUrl)

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresInSeconds)

  if (error) {
    throw error
  }

  return data.signedUrl
}