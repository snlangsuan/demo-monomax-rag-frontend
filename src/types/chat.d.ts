import type { Dayjs } from 'dayjs'

export interface IChatAccount {
  id: string
  display_name: string
  profile: string
}

export interface IChatMessage {
  id: string
  message: {
    text?: string
    images?: Array<string>
  }
  from: IChatAccount
  to: IChatAccount
  timestamp: Dayjs
}