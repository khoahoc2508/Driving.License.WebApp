export const formatCurrencyVNDInput = (value: string): string => {
  const digitsOnly = (value || '').replace(/[^\d]/g, '')
  if (!digitsOnly) return ''
  try {
    return new Intl.NumberFormat('vi-VN').format(Number(digitsOnly))
  } catch {
    return digitsOnly
  }
}

export const parseVNDToNumber = (value: string): number | null => {
  const digitsOnly = (value || '').replace(/[^\d]/g, '')
  if (!digitsOnly) return null
  return Number(digitsOnly)
}
