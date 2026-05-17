import { supabase } from '../../lib/supabase'
import { getCurrentBusiness } from '../../lib/business'
import type { Expense, ExpenseFormData } from '../../types/database'
import { logActivity } from '../../lib/activityLog'

export async function getExpenses(): Promise<Expense[]> {
  const business = await getCurrentBusiness()

  if (!business) {
    return []
  }

  const { data, error } = await supabase
    .from('expenses')
    .select(
      `
      *,
      cars (*)
    `,
    )
    .eq('business_id', business.id)
    .is('deleted_at', null)
    .order('expense_date', { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function createExpense(
  formData: ExpenseFormData,
  receiptFile?: File | null,
) {
  const business = await getCurrentBusiness()

  if (!business) {
    throw new Error('Please create a business first.')
  }

  if (!formData.title.trim()) {
    throw new Error('Expense title is required.')
  }

  const amount = Number(formData.amount || 0)

  if (amount <= 0) {
    throw new Error('Expense amount must be greater than 0.')
  }

  let receiptUrl: string | null = null

  if (receiptFile) {
    receiptUrl = await uploadExpenseReceipt(receiptFile, business.id)
  }

  const { error } = await supabase.from('expenses').insert({
    business_id: business.id,
    car_id: formData.car_id || null,
    title: formData.title,
    category: formData.category || null,
    amount,
    expense_date:
      formData.expense_date || new Date().toISOString().slice(0, 10),
    receipt_url: receiptUrl,
    notes: formData.notes || null,
  })

  if (error) {
    throw error
  }

  await logActivity({
    action: 'created',
    entityType: 'expense',
    metadata: {
      car_id: formData.car_id,
      title: formData.title,
      amount,
    },
  })
}

export async function deleteExpense(expenseId: string) {
  const { error } = await supabase
    .from('expenses')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq('id', expenseId)

  if (error) {
    throw error
  }

  await logActivity({
    action: 'soft_deleted',
    entityType: 'expense',
    entityId: expenseId,
  })
}

async function uploadExpenseReceipt(file: File, businessId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${businessId}/${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw uploadError
  }

  return fileName
}