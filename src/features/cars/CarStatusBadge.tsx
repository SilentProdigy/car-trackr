import type { CarStatus } from '../../types/database'

type CarStatusBadgeProps = {
  status: CarStatus
}

const statusLabels: Record<CarStatus, string> = {
  available: 'Available',
  reserved: 'Reserved',
  rented: 'Rented',
  maintenance: 'Maintenance',
  inactive: 'Inactive',
}

const statusClasses: Record<CarStatus, string> = {
  available: 'bg-green-50 text-green-700',
  reserved: 'bg-blue-50 text-blue-700',
  rented: 'bg-orange-50 text-orange-700',
  maintenance: 'bg-yellow-50 text-yellow-700',
  inactive: 'bg-gray-100 text-gray-600',
}

export function CarStatusBadge({ status }: CarStatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses[status]}`}
    >
      {statusLabels[status]}
    </span>
  )
}