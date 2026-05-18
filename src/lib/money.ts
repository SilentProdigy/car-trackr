export function parseMoney(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return 0

  const parsed = Number(value)

  if (Number.isNaN(parsed)) return 0

  return Math.round(parsed * 100) / 100
}

export function calculateBalance(totalAmount: number, paidAmount: number) {
  return Math.max(Math.round((totalAmount - paidAmount) * 100) / 100, 0)
}