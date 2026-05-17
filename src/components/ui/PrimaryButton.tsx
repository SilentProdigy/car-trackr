import type { ButtonHTMLAttributes, ReactNode } from 'react'

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  loading?: boolean
}

export function PrimaryButton({
  children,
  loading,
  disabled,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className="w-full rounded-2xl bg-[#1f3d32] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#173029] disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {loading ? 'Please wait...' : children}
    </button>
  )
}