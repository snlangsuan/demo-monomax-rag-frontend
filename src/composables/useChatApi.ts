import type { IChatMessage, IChatMessageObject, IChatRoom } from '~/types/chat'
import type { IPaginationItemResponse } from '~/types/share'

export const useChatApi = () => {
  const getRoomList = async (hasMessage: boolean = false): Promise<IPaginationItemResponse<IChatRoom>> => {
    const result = await useGet<IPaginationItemResponse<IChatRoom>>('/chat/rooms', { only_msg: hasMessage })
    return result
  }
  const createRoom = async (members: Array<string>): Promise<IChatRoom> => {
    const result = await usePost<IChatRoom>('/chat/rooms', { members })
    return result
  }
  const getRoom = async (roomId: string): Promise<IChatRoom> => {
    const result = await useGet<IChatRoom>(`/chat/rooms/${roomId}`)
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
  return { createRoom, getMessageHistory, getRoom, getRoomList, sendMessage }
}
