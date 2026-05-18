import { CarFront, Trash2 } from 'lucide-react'
import type { Expense } from '../../types/database'
import { SecureFileButton } from '../../components/ui/SecureFileButton'

type ExpenseCardProps = {
  expense: Expense
  onDelete: (expenseId: string) => void
  canEdit?: boolean
  canDelete?: boolean
}

export function ExpenseCard({ expense, onDelete, canEdit, canDelete }: ExpenseCardProps) {
  return (
    <article className="rounded-[1.75rem] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#10231c]">
            {expense.title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {expense.category ?? 'Expense'} • {expense.expense_date}
          </p>
        </div>

        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
          ₱{Number(expense.amount).toLocaleString()}
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-[#f6f8f7] px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
          Related To
        </p>

        <p className="mt-1 flex items-center gap-2 text-sm font-bold text-[#10231c]">
          <CarFront size={15} />
          {expense.cars?.car_name ?? 'General Business Expense'}
        </p>
      </div>

      {expense.receipt_url && (
         <div className="mt-4">
            <SecureFileButton
              bucket="receipts"
              filePath={expense.receipt_url}
              label="View Receipt"
            />
          </div>
      )}

      {expense.notes && (
        <p className="mt-4 rounded-2xl bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          {expense.notes}
        </p>
      )}

      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(expense.id)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
        >
          <Trash2 size={16} />
          Delete Expense
        </button>
      )}
    </article>
  )
}