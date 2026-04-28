import { format, formatDistanceToNow, isAfter, isBefore, addDays, startOfDay, endOfDay } from 'date-fns'

export const formatDate = (date: Date | string, formatStr: string = 'MMM dd, yyyy'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, formatStr)
}

export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export const isOverdue = (dueDate: Date | string): boolean => {
  const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  return isBefore(dateObj, new Date())
}

export const isDueSoon = (dueDate: Date | string, days: number = 3): boolean => {
  const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  const threeDaysFromNow = addDays(new Date(), days)
  return isAfter(dateObj, new Date()) && isBefore(dateObj, threeDaysFromNow)
}

export const getStartOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return startOfDay(dateObj)
}

export const getEndOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return endOfDay(dateObj)
}

export const getTimeRange = (period: 'day' | 'week' | 'month' | 'quarter' | 'year'): { start: Date; end: Date } => {
  const now = new Date()
  const start = startOfDay(now)
  
  switch (period) {
    case 'day':
      return { start, end: endOfDay(now) }
    case 'week':
      return { start: addDays(start, -7), end: endOfDay(now) }
    case 'month':
      return { start: addDays(start, -30), end: endOfDay(now) }
    case 'quarter':
      return { start: addDays(start, -90), end: endOfDay(now) }
    case 'year':
      return { start: addDays(start, -365), end: endOfDay(now) }
    default:
      return { start, end: endOfDay(now) }
  }
}
