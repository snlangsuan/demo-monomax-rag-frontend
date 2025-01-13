import { H3Error } from 'h3'
import { FetchError } from 'ofetch'
import type { IResponseErrorDetails } from '~/types/share'

export const getErrorMessage = (
  error: unknown,
  defaultProp: string = 'password'
): [number, string, IResponseErrorDetails[] | null] => {
  let status: number = 500
  let msg: string = 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาทำรายการใหม่อีกครั้ง'
  let details: IResponseErrorDetails[] | null = null
  if (error instanceof H3Error) {
    msg = error.data.message
    status = error.statusCode
    if (error.data.details) details = error.data.details
  } else if (error instanceof FetchError) {
    msg = error.data.message
    status = error.statusCode!
    if (!error.data.details) details = [{ message: msg, property: defaultProp }]
  }
  return [status, msg, details]
}
