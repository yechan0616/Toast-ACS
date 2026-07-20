import type { AnyErrorCode, ErrorEnvelope } from '../types/errors'

export class ApiError extends Error {
  readonly code: AnyErrorCode
  readonly status: number

  constructor(envelope: ErrorEnvelope, status: number) {
    super(envelope.message)
    this.name = 'ApiError'
    this.code = envelope.code
    this.status = status
  }
}

type UnauthorizedHandler = (error: ApiError) => void
let unauthorizedHandler: UnauthorizedHandler | undefined

export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
  unauthorizedHandler = handler
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  signal?: AbortSignal
}

async function toApiError(response: Response): Promise<ApiError> {
  let envelope: ErrorEnvelope = {
    code: 'UNKNOWN',
    message: '일시적인 오류가 있어요. 잠시 후 다시 시도해 주세요.',
  }

  try {
    const parsed = (await response.json()) as Partial<ErrorEnvelope>
    if (parsed && typeof parsed.code === 'string') {
      envelope = {
        code: parsed.code as AnyErrorCode,
        message: parsed.message ?? envelope.message,
      }
    }
  } catch {}

  return new ApiError(envelope, response.status)
}

export async function request<T>(
  path: string,
  { method = 'GET', body, signal }: RequestOptions = {},
): Promise<T> {
  let response: Response

  try {
    response = await fetch(path, {
      method,
      credentials: 'include',
      headers:
        body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch {
    throw new ApiError(
      {
        code: 'NETWORK_ERROR',
        message: '서버에 연결할 수 없어요. 네트워크를 확인해 주세요.',
      },
      0,
    )
  }

  if (!response.ok) {
    const error = await toApiError(response)
    if (response.status === 401) {
      unauthorizedHandler?.(error)
    }
    throw error
  }

  if (
    response.status === 204 ||
    response.headers.get('content-length') === '0'
  ) {
    return undefined as T
  }

  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) =>
    request<T>(path, { method: 'GET', signal }),
  post: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: 'POST', body, signal }),
}
