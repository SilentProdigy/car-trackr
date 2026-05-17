import type { ReactNode } from 'react'

type DashboardMetricCardProps = {
  label: string
  value: string
  helper?: string
  icon?: ReactNode
  tone?: 'default' | 'success' | 'warning' | 'danger'
}

const toneClasses = {
  default: 'bg-[#e8f0ec] text-[#1f3d32]',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-yellow-50 text-yellow-700',
  danger: 'bg-red-50 text-red-700',
}

export function DashboardMetricCard({
  label,
  value,
  helper,
  icon,
  tone = 'default',
}: DashboardMetricCardProps) {
  return (
    <div className="rounded-[1.75rem] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-2 truncate text-2xl font-bold text-[#10231c]">
            {value}
          </p>

          {helper && <p className="mt-1 text-xs text-gray-400">{helper}</p>}
        </div>

        {icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${toneClasses[tone]}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}