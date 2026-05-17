import { useState } from 'react'
import { FileText } from 'lucide-react'
import { createSignedFileUrl } from '../../lib/storage'

type SecureFileButtonProps = {
  bucket: string
  filePath: string | null
  label: string
}

export function SecureFileButton({
  bucket,
  filePath,
  label,
}: SecureFileButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleOpenFile() {
    if (!filePath) return

    setLoading(true)

    try {
      const signedUrl = await createSignedFileUrl(bucket, filePath)
      window.open(signedUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to open file.')
    } finally {
      setLoading(false)
    }
  }

  if (!filePath) {
    return (
      <div className="rounded-2xl bg-gray-50 px-3 py-3 text-center text-xs font-bold text-gray-400">
        No File
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleOpenFile}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e8f0ec] px-3 py-3 text-xs font-bold text-[#1f3d32] disabled:opacity-60"
    >
      <FileText size={15} />
      {loading ? 'Opening...' : label}
    </button>
  )
}