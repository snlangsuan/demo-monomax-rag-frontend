import type { IUserAccount, IUserAuthToken } from '~/types/user'

export const useUserApi = () => {
  const getToken = async (): Promise<IUserAuthToken> => {
    const data = await usePost<IUserAuthToken>('/users/signin')
    return data
  }
  const getAdminToken = async (): Promise<IUserAuthToken> => {
    const data = await usePost<IUserAuthToken>('/users/admin/signin')
    return data
  }
  const getMe = async (): Promise<IUserAccount> => {
    const data = await useGet<IUserAccount>('/users/me')
    return data
  }
  return { getAdminToken, getMe, getToken }
}
