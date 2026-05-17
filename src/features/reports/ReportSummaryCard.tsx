import type { ReactNode } from 'react'

type ReportSummaryCardProps = {
  label: string
  value: string
  helper?: string
  icon?: ReactNode
}

export function ReportSummaryCard({
  label,
  value,
  helper,
  icon,
}: ReportSummaryCardProps) {
  return (
    <div className="rounded-[1.75rem] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-[#1f3d32]">{value}</p>

          {helper && <p className="mt-1 text-xs text-gray-400">{helper}</p>}
        </div>

        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f0ec] text-[#1f3d32]">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}