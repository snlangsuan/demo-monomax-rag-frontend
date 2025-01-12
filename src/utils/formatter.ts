import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

export const conv_date = (date: string | Dayjs): Dayjs => {
  return typeof date === 'string' ? dayjs(date) : date
}

export const date_format = (date: string, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(date).format(format)
}
