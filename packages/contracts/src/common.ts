// 统一 API 响应格式
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

// 业务错误码
export enum ErrorCode {
  SUCCESS = 0,
  BAD_REQUEST = 40000,
  UNAUTHORIZED = 40100,
  FORBIDDEN = 40300,
  NOT_FOUND = 40400,
  CONFLICT = 40900,
  TOO_MANY_REQUESTS = 42900,
  INTERNAL_ERROR = 50000,
}
