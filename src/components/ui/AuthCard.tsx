import type { ReactNode } from 'react'

type AuthCardProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f8f7] px-5 py-8">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#1f3d32] text-2xl font-bold text-white">
            R
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#416b57]">
            Car Rental Tracker
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#10231c]">{title}</h1>

          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        </div>

        {children}
      </div>
    </main>
  )
}