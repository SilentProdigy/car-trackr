import { Mail, Pencil, Phone, Trash2, UserRound } from 'lucide-react'
import type { Customer } from '../../types/database'
import { SecureFileButton } from '../../components/ui/SecureFileButton'

type CustomerCardProps = {
  customer: Customer
  onDelete: (customerId: string) => void
  onEdit: (customer: Customer) => void
  canEdit?: boolean
  canDelete?: boolean
}

export function CustomerCard({ customer, onDelete, onEdit, canEdit, canDelete }: CustomerCardProps) {
  return (
    <article className="rounded-[1.75rem] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#e8f0ec] text-[#1f3d32]">
          <UserRound size={26} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold text-[#10231c]">
            {customer.full_name}
          </h2>

          <div className="mt-2 space-y-1">
            {customer.phone && (
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} />
                {customer.phone}
              </p>
            )}

            {customer.email && (
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} />
                {customer.email}
              </p>
            )}
          </div>
        </div>
      </div>

      {customer.address && (
        <div className="mt-4 rounded-2xl bg-[#f6f8f7] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
            Address
          </p>
          <p className="mt-1 text-sm text-[#10231c]">{customer.address}</p>
        </div>
      )}

      {customer.emergency_contact && (
        <div className="mt-3 rounded-2xl bg-[#f6f8f7] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
            Emergency Contact
          </p>
          <p className="mt-1 text-sm text-[#10231c]">
            {customer.emergency_contact}
          </p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        {customer.valid_id_url ? (
          <SecureFileButton
            bucket="customer-documents"
            filePath={customer.valid_id_url}
            label="View Valid ID"
          />
        ) : (
          <div className="rounded-2xl bg-gray-50 px-3 py-3 text-center text-xs font-bold text-gray-400">
            No Valid ID
          </div>
        )}

        {customer.driver_license_url ? (
          <SecureFileButton
            bucket="customer-documents"
            filePath={customer.driver_license_url}
            label="View License"
          />
        ) : (
          <div className="rounded-2xl bg-gray-50 px-3 py-3 text-center text-xs font-bold text-gray-400">
            No License
          </div>
        )}
      </div>

      {customer.notes && (
        <p className="mt-4 rounded-2xl bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          {customer.notes}
        </p>
      )}
      {canEdit && (
        <button
          type="button"
          onClick={() => onEdit(customer)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e8f0ec] px-4 py-3 text-sm font-bold text-[#1f3d32]"
        >
          <Pencil size={16} />
          Edit Customer
        </button>
      )}
      
      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(customer.id)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
        >
          <Trash2 size={16} />
          Delete Customer
        </button>
      )}
    </article>
  )
}