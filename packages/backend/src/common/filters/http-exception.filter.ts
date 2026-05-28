import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { ErrorCode } from '@wanzai/contracts'
import type { Response } from 'express'

interface FormattedBody {
  code: number
  data: unknown
  message: string
}

const STATUS_TO_ERROR_CODE: Record<number, ErrorCode> = {
  [HttpStatus.BAD_REQUEST]: ErrorCode.BAD_REQUEST,
  [HttpStatus.UNAUTHORIZED]: ErrorCode.UNAUTHORIZED,
  [HttpStatus.FORBIDDEN]: ErrorCode.FORBIDDEN,
  [HttpStatus.NOT_FOUND]: ErrorCode.NOT_FOUND,
  [HttpStatus.CONFLICT]: ErrorCode.CONFLICT,
  [HttpStatus.TOO_MANY_REQUESTS]: ErrorCode.TOO_MANY_REQUESTS,
  [HttpStatus.INTERNAL_SERVER_ERROR]: ErrorCode.INTERNAL_ERROR,
}

function isFormattedBody(body: unknown): body is FormattedBody {
  if (!body || typeof body !== 'object') return false
  const b = body as Record<string, unknown>
  return typeof b.code === 'number' && 'message' in b
}

function isPrismaError(
  err: unknown,
): err is Error & { code: string; meta?: Record<string, unknown> } {
  return (
    err instanceof Error &&
    'code' in err &&
    typeof (err as Record<string, unknown>).code === 'string'
  )
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (isFormattedBody(exceptionResponse)) {
        response.status(status).json(exceptionResponse)
        return
      }

      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message?: string | string[] }).message
      const msg = Array.isArray(message) ? message.join('; ') : message || exception.message

      response.status(status).json({
        code: STATUS_TO_ERROR_CODE[status] ?? ErrorCode.INTERNAL_ERROR,
        data: null,
        message: msg,
      })
      return
    }

    if (isPrismaError(exception)) {
      if (exception.code === 'P2025') {
        response.status(HttpStatus.NOT_FOUND).json({
          code: ErrorCode.NOT_FOUND,
          data: null,
          message: '记录不存在',
        })
        return
      }
      if (exception.code === 'P2002') {
        response.status(HttpStatus.CONFLICT).json({
          code: ErrorCode.CONFLICT,
          data: null,
          message: '资源已存在',
        })
        return
      }
    }

    if (exception instanceof Error) {
      this.logger.error(`Unhandled error: ${exception.message}`, exception.stack)
    } else {
      this.logger.error(`Unknown exception thrown: ${String(exception)}`)
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: ErrorCode.INTERNAL_ERROR,
      data: null,
      message: 'Internal server error',
    })
  }
}
