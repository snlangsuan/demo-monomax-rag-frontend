interface IDefaultFetchOption {
  baseURL: string
  headers: HeadersInit
}

const defaultParams = (): IDefaultFetchOption => {
  const config = useRuntimeConfig()
  const params: IDefaultFetchOption = {
    baseURL: config.public.baseApiUrl,
    headers: { 'Content-Type': 'application/json', Authorization: '' },
  }

  const token = sessionStorage.getItem('auth.token')
  if (params.headers) {
    if (Array.isArray(params.headers)) {
      params.headers.push(['Authorization', `Bearer ${token}`])
    } else if (params.headers instanceof Headers) {
      params.headers.set('Authorization', `Bearer ${token}`)
    } else {
      params.headers.Authorization = `Bearer ${token}`
    }
  }
  return params
}

async function handleError<T>({ response }: { response: { status: number } }) {
  if (response.status === 401) {
    await navigateTo({ path: '/get-start' })
  }
}

export async function useGet<T>(endpoint: string, params: Record<string, unknown> = {}) {
  const data = await $fetch<T>(endpoint, { ...defaultParams(), onResponseError: handleError, query: params })
  return data
}

export async function usePost<T>(endpoint: string, params: Record<string, unknown> = {}) {
  const data = await $fetch<T>(endpoint, {
    ...defaultParams(),
    onResponseError: handleError,
    method: 'POST',
    body: params,
  })
  return data
}

export async function usePut<T>(endpoint: string, params: Record<string, unknown> = {}) {
  const data = await $fetch<T>(endpoint, {
    ...defaultParams(),
    onResponseError: handleError,
    method: 'PUT',
    body: params,
  })
  return data
}

export async function usePatch<T>(endpoint: string, params: Record<string, unknown> = {}) {
  const data = await $fetch<T>(endpoint, {
    ...defaultParams(),
    onResponseError: handleError,
    method: 'PATCH',
    body: params,
  })
  return data
}

export async function useDelete<T>(endpoint: string, params: Record<string, unknown> = {}) {
  const data = await $fetch<T>(endpoint, {
    ...defaultParams(),
    onResponseError: handleError,
    method: 'DELETE',
    body: params,
  })
  return data
}

export function useApi(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  endpoint: string,
  params: Record<string, unknown> = {}
) {
  if (method === 'get') return useGet(endpoint, params)
  if (method === 'post') return usePost(endpoint, params)
  if (method === 'put') return usePut(endpoint, params)
  if (method === 'patch') return usePatch(endpoint, params)
  if (method === 'delete') return useDelete(endpoint, params)
  throw new Error('method does not match.')
}