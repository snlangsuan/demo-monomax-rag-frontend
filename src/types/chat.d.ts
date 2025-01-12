import type { IUserAccount } from './user'

export type TMessageType = 'text' | 'image'

export interface IChatMessageObject {
  text: string
  type: TMessageType
}

export interface IChatMessage {
  created_at: string
  id: string
  is_bot: boolean
  message: IChatMessageObject
  room: string
  source: IUserAccount
}

export interface IChatRoom {
  created_at?: string
  id: string
  members: Array<IUserAccount>
  message?: IChatMessageObject
  name?: string
  profile?: string
}
