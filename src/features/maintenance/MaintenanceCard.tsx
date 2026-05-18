import { CalendarDays, CarFront, Trash2 } from 'lucide-react'
import type { Maintenance, MaintenanceStatus } from '../../types/database'
import { MaintenanceStatusBadge } from './MaintenanceStatusBadge'
import { SecureFileButton } from '../../components/ui/SecureFileButton'

type MaintenanceCardProps = {
  record: Maintenance
  onDelete: (maintenanceId: string) => void
  onUpdateStatus: (maintenanceId: string, status: MaintenanceStatus) => void
  canEdit?: boolean
  canDelete?: boolean
}

export function MaintenanceCard({
  record,
  onDelete,
  onUpdateStatus,
  canEdit,
  canDelete
}: MaintenanceCardProps) {
  return (
    <article className="rounded-[1.75rem] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#10231c]">
            {record.maintenance_type ?? 'Maintenance'}
          </h2>

          <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <CarFront size={15} />
            {record.cars?.car_name ?? 'Unknown Car'}
          </p>
        </div>

        <MaintenanceStatusBadge status={record.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <InfoBox
          label="Service Date"
          value={record.service_date ?? 'No date'}
        />
        <InfoBox
          label="Next Service"
          value={record.next_service_date ?? 'No date'}
        />
      </div>

      <div className="mt-4 rounded-2xl bg-[#1f3d32] p-4 text-white">
        <div className="flex justify-between text-sm">
          <span className="opacity-80">Cost</span>
          <span className="font-bold">
            ₱{Number(record.cost).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-[#f6f8f7] p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
          Update Status
        </p>

        <div className="grid grid-cols-3 gap-2">
          <StatusButton
            label="Scheduled"
            disabled={record.status === 'scheduled'}
            onClick={() => onUpdateStatus(record.id, 'scheduled')}
          />

          <StatusButton
            label="In Progress"
            disabled={record.status === 'in_progress'}
            onClick={() => onUpdateStatus(record.id, 'in_progress')}
          />

          <StatusButton
            label="Completed"
            disabled={record.status === 'completed'}
            onClick={() => onUpdateStatus(record.id, 'completed')}
          />
        </div>
      </div>

      {record.receipt_url && (
        <div className="mt-4">
          <SecureFileButton 
            bucket="maintenance-files"
            filePath={record.receipt_url}
            label="View File"
          />
        </div>
      )}

      {record.description && (
        <p className="mt-4 rounded-2xl bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          {record.description}
        </p>
      )}

      <p className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <CalendarDays size={14} />
        Created {new Date(record.created_at).toLocaleDateString()}
      </p>

      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(record.id)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
        >
          <Trash2 size={16} />
          Delete Maintenance
        </button>
      )}
    </article>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f6f8f7] px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-[#10231c]">{value}</p>
    </div>
  )
}

function StatusButton({
  label,
  disabled,
  onClick,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#1f3d32] transition hover:bg-[#e8f0ec] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  )
}