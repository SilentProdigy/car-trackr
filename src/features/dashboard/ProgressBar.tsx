type ProgressBarProps = {
  label: string
  value: number
  helper?: string
}

export function ProgressBar({ label, value, helper }: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), 100)

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#10231c]">{label}</p>
        <p className="text-sm font-bold text-[#1f3d32]">{safeValue}%</p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-[#e8f0ec]">
        <div
          className="h-full rounded-full bg-[#1f3d32] transition-all duration-500"
          style={{ width: `${safeValue}%` }}
        />
      </div>

      {helper && <p className="mt-2 text-xs text-gray-500">{helper}</p>}
    </div>
  )
}