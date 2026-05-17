import { useState } from 'react'
import type React from 'react'
import { X } from 'lucide-react'
import { PrimaryButton } from '../../components/ui/PrimaryButton'
import type { Car, ExpenseFormData } from '../../types/database'

type AddExpenseFormProps = {
  cars: Car[]
  onSubmit: (
    formData: ExpenseFormData,
    receiptFile?: File | null,
  ) => Promise<void>
  onClose: () => void
}

const initialFormData: ExpenseFormData = {
  car_id: '',
  title: '',
  category: 'Maintenance',
  amount: '',
  expense_date: new Date().toISOString().slice(0, 10),
  notes: '',
}

export function AddExpenseForm({
  cars,
  onSubmit,
  onClose,
}: AddExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>(initialFormData)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField<K extends keyof ExpenseFormData>(
    key: K,
    value: ExpenseFormData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formData.title.trim()) {
      setErrorMessage('Expense title is required.')
      return
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setErrorMessage('Please enter a valid amount.')
      return
    }

    setErrorMessage('')
    setLoading(true)

    try {
      await onSubmit(formData, receiptFile)
      setFormData(initialFormData)
      setReceiptFile(null)
      onClose()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save expense.'
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 px-4 py-6">
      <div className="mx-auto flex h-full max-w-md flex-col rounded-[2rem] bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-[#10231c]">Add Expense</h2>
            <p className="text-xs text-gray-500">
              Track business or vehicle-related expenses.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-gray-100 p-2 text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            {errorMessage && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Expense title
              </span>

              <input
                value={formData.title}
                placeholder="Oil change, fuel, car wash..."
                onChange={(event) => updateField('title', event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                  Category
                </span>

                <select
                  value={formData.category}
                  onChange={(event) =>
                    updateField('category', event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
                >
                  <option value="Fuel">Fuel</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Repair">Repair</option>
                  <option value="Car Wash">Car Wash</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Registration">Registration</option>
                  <option value="Office Expense">Office Expense</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                  Amount
                </span>

                <input
                  type="number"
                  value={formData.amount}
                  placeholder="1000"
                  onChange={(event) => updateField('amount', event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Related car
              </span>

              <select
                value={formData.car_id}
                onChange={(event) => updateField('car_id', event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
              >
                <option value="">General business expense</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.car_name} — {car.plate_number}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Expense date
              </span>

              <input
                type="date"
                value={formData.expense_date}
                onChange={(event) =>
                  updateField('expense_date', event.target.value)
                }
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Receipt upload
              </span>

              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(event) =>
                  setReceiptFile(event.target.files?.[0] ?? null)
                }
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#10231c]">
                Notes
              </span>

              <textarea
                value={formData.notes}
                placeholder="Optional notes"
                onChange={(event) => updateField('notes', event.target.value)}
                className="min-h-24 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
              />
            </label>
          </div>

          <div className="sticky bottom-0 mt-6 bg-white pb-1 pt-4">
            <PrimaryButton type="submit" loading={loading}>
              Save Expense
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  )
}