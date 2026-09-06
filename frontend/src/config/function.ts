export type ApiResponse<T> = {
  success: boolean
  data: T
  message: string
  statusCode: number
  timestamp: string
}

export function getResponseData<T>(response: ApiResponse<T>) {
  if (!response.success) {
    throw new Error(response.message)
  }

  return response.data
}