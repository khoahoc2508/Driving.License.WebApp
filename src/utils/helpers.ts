import CONFIG from '@/configs/config'

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

export const getInputBehavior = (field: any) => {
  const isCurrency = !!field?.isCurrency

  return {
    shouldFormat: isCurrency,
    forceTextType: isCurrency,
    format: (value: string) => (isCurrency ? formatCurrencyVNDInput(value) : value || '')
  }
}

/**
 * Format currency to Vietnamese format
 * @param amount - The amount to format
 * @returns Formatted currency string or null if amount is null/undefined
 */
export const formatCurrency = (amount: number | undefined | null): string | null => {
  if (amount === undefined || amount === null) return null

  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format date to Vietnamese format (dd/mm/yyyy)
 * @param date - The date to format (Date object, string, or null/undefined)
 * @returns Formatted date string or empty string if date is null/undefined
 */
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return ''

  try {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)

    return ''
  }
}

/**
 * Format date and time to Vietnamese format (dd/mm/yyyy hh:mm)
 * @param date - The date to format (Date object, string, or null/undefined)
 * @returns Formatted date and time string or empty string if date is null/undefined
 */
export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return ''

  try {
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting date time:', error)

    return ''
  }
}

/**
 * Convert date to ISO string for DateOnly (sets time to 00:00:00 UTC)
 * @param date - The date to convert (Date object, string, or null/undefined)
 * @returns ISO string in format YYYY-MM-DDTHH:mm:ss.sssZ or null if date is null/undefined
 */
export const formatDateOnlyForAPI = (date: Date | string | null | undefined): string | null => {
  if (!date) return null

  try {
    let dateObj: Date

    // If it's a string in dd/MM/yyyy format, parse it correctly
    if (typeof date === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const parsedDate = parseVietnameseDate(date)

      if (!parsedDate) return null
      dateObj = parsedDate
    } else {
      dateObj = new Date(date)
    }

    debugger

    // Set time to 00:00:00 UTC
    const utcDate = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 0, 0, 0, 0))

    return utcDate.toISOString()
  } catch (error) {
    console.error('Error formatting date only for API:', error)

    return null
  }
}

/**
 * Convert date to ISO string for DateTime (converts local time to UTC)
 * @param date - The date to convert (Date object, string, or null/undefined)
 * @returns ISO string in format YYYY-MM-DDTHH:mm:ss.sssZ or null if date is null/undefined
 */
export const formatDateTimeForAPI = (date: Date | string | null | undefined): string | null => {
  if (!date) return null

  try {
    let dateObj: Date

    // If it's a string in dd/MM/yyyy format, parse it correctly
    if (typeof date === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const parsedDate = parseVietnameseDate(date)

      if (!parsedDate) return null
      dateObj = parsedDate
    } else {
      dateObj = new Date(date)
    }

    return dateObj.toISOString()
  } catch (error) {
    console.error('Error formatting date time for API:', error)

    return null
  }
}

/**
 * Parse Vietnamese date string (dd/MM/yyyy) to Date object
 * @param dateString - Date string in format dd/MM/yyyy
 * @returns Date object or null if invalid
 */
export const parseVietnameseDate = (dateString: string): Date | null => {
  if (!dateString) return null

  try {
    const [day, month, year] = dateString.split('/')

    if (!day || !month || !year) return null

    // Create date in local timezone
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

    // Check if date is valid
    if (isNaN(date.getTime())) return null

    return date
  } catch (error) {
    console.error('Error parsing Vietnamese date:', error)

    return null
  }
}

export const getStatusColor = (status: number | undefined) => {
  if (status === undefined) {
    return 'default'
  }

  switch (status) {
    case CONFIG.StepStatus.Pending:
      return 'info'
    case CONFIG.StepStatus.InProgress:
      return 'warning'
    case CONFIG.StepStatus.Completed:
      return 'success'
    default:
      return 'default'
  }
}
