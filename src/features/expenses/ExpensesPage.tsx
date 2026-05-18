import { useState } from 'react'
import { Plus, ReceiptText, RefreshCcw } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BottomNav } from '../../components/layout/BottomNav'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { getCars } from '../cars/carsApi'
import type { ExpenseFormData } from '../../types/database'
import { AddExpenseForm } from './AddExpenseForm'
import { ExpenseCard } from './ExpenseCard'
import { createExpense, deleteExpense, getExpenses } from './expensesApi'
import { usePermissions } from '../auth/usePermissions'

export function ExpensesPage() {
  const queryClient = useQueryClient()
  const { data: permissions } = usePermissions()

  const [showAddForm, setShowAddForm] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null)

  const {
    data: expenses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses,
  })

  const { data: cars = [] } = useQuery({
    queryKey: ['cars'],
    queryFn: getCars,
  })

  const createMutation = useMutation({
    mutationFn: ({
      formData,
      receiptFile,
    }: {
      formData: ExpenseFormData
      receiptFile?: File | null
    }) => createExpense(formData, receiptFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
  })

  const selectedExpense = expenses.find(
    (expense) => expense.id === expenseToDelete,
  )

  const totalExpenses = expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount)
  }, 0)

  const vehicleExpenses = expenses
    .filter((expense) => expense.car_id)
    .reduce((sum, expense) => sum + Number(expense.amount), 0)

  async function handleCreateExpense(
    formData: ExpenseFormData,
    receiptFile?: File | null,
  ) {
    await createMutation.mutateAsync({
      formData,
      receiptFile,
    })
  }

  function confirmDeleteExpense() {
    if (!expenseToDelete) return

    deleteMutation.mutate(expenseToDelete, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['expenses'] })
        setExpenseToDelete(null)
      },
    })
  }

  return (
    <main className="min-h-screen bg-[#f6f8f7] pb-24">
      <header className="bg-[#1f3d32] px-5 py-6 text-white">
        <p className="text-sm opacity-80">Cost Tracking</p>

        <div className="mt-1 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Expenses</h1>
          {permissions?.canWrite && (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-[#1f3d32]"
            >
              <Plus size={18} />
              Add
            </button>
          )}
        </div>
      </header>

      <section className="px-5 py-5">
        {isLoading && (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#d7e5dd] border-t-[#1f3d32]" />
            <p className="text-sm font-semibold text-[#1f3d32]">
              Loading expenses...
            </p>
          </div>
        )}

        {isError && (
          <div className="rounded-3xl bg-red-50 p-5 text-red-700">
            <p className="text-sm font-bold">Failed to load expenses.</p>
            <p className="mt-1 text-sm">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-red-100 px-4 py-2 text-sm font-bold"
            >
              <RefreshCcw size={16} />
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && expenses.length === 0 && (
          <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e8f0ec] text-[#1f3d32]">
              <ReceiptText size={28} />
            </div>

            <h2 className="text-lg font-bold text-[#10231c]">
              No expenses yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Start tracking fuel, repairs, maintenance, and business expenses.
            </p>

            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="mt-5 rounded-2xl bg-[#1f3d32] px-5 py-3 text-sm font-bold text-white"
            >
              Add First Expense
            </button>
          </div>
        )}

        {!isLoading && !isError && expenses.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <SummaryCard
                label="Total Expenses"
                value={`₱${Number(totalExpenses).toLocaleString()}`}
              />

              <SummaryCard
                label="Vehicle Costs"
                value={`₱${Number(vehicleExpenses).toLocaleString()}`}
              />
            </div>

            {expenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onDelete={setExpenseToDelete}
                canEdit={permissions?.canWrite}
                canDelete={permissions?.canWrite}
              />
            ))}
          </div>
        )}
      </section>

      {showAddForm && (
        <AddExpenseForm
          cars={cars}
          onSubmit={handleCreateExpense}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {expenseToDelete && (
        <ConfirmModal
          title="Delete expense?"
          message={`Are you sure you want to delete "${
            selectedExpense?.title ?? 'this expense'
          }"? This action cannot be undone.`}
          confirmLabel="Delete Expense"
          cancelLabel="Keep Expense"
          loading={deleteMutation.isPending}
          onConfirm={confirmDeleteExpense}
          onCancel={() => setExpenseToDelete(null)}
        />
      )}

      <BottomNav />
    </main>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-[#1f3d32]">{value}</p>
    </div>
  )
}