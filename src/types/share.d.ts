export interface IPaginationItemResponse<T> {
  items: Array<T>
}

export interface IResponseErrorDetails {
  message: string
  property: string
}
