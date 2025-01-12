import type { IChatMessage, IChatMessageObject, IChatRoom } from '~/types/chat'
import type { IPaginationItemResponse } from '~/types/share'

export const useChatApi = () => {
  const getRoomList = async (): Promise<IPaginationItemResponse<IChatRoom>> => {
    const result = await useGet<IPaginationItemResponse<IChatRoom>>('/chat/rooms')
    return result
  }
  const createRoom = async (members: Array<string>): Promise<IChatRoom> => {
    const result = await usePost<IChatRoom>('/chat/rooms', { members })
    return result
  }
  const sendMessage = async (
    room: string,
    message: IChatMessageObject,
    thread_id: string | null = null
  ): Promise<void> => {
    await usePost('/chat/send', { message, room, thread_id })
  }
  const getMessageHistory = async (
    room: string,
    is_human: boolean = false
  ): Promise<IPaginationItemResponse<IChatMessage>> => {
    const result = await useGet<IPaginationItemResponse<IChatMessage>>(`/chat/rooms/${room}/messages`, {
      is_human,
    })
    return result
  }
  return { createRoom, getMessageHistory, getRoomList, sendMessage }
}
