/** Extracts a user-readable error message from any caught error. */
export function extractErrorMessage(e: unknown, fallback = 'Error'): string {
  if (e && typeof e === 'object' && 'response' in e) {
    const resp = (e as { response?: { data?: { message?: string } } }).response
    return resp?.data?.message || fallback
  }
  return fallback
}
