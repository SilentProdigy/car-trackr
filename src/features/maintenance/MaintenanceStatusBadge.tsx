import type { MaintenanceStatus } from '../../types/database'

type MaintenanceStatusBadgeProps = {
  status: MaintenanceStatus
}

const labels: Record<MaintenanceStatus, string> = {
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
}

const classes: Record<MaintenanceStatus, string> = {
  scheduled: 'bg-yellow-50 text-yellow-700',
  in_progress: 'bg-orange-50 text-orange-700',
  completed: 'bg-green-50 text-green-700',
}

export function MaintenanceStatusBadge({ status }: MaintenanceStatusBadgeProps) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${classes[status]}`}>
      {labels[status]}
    </span>
  )
}