import type { ReactNode } from 'react'

type DashboardSectionProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

export function DashboardSection({
  title,
  subtitle,
  children,
}: DashboardSectionProps) {
  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#10231c]">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>

      {children}
    </section>
  )
}