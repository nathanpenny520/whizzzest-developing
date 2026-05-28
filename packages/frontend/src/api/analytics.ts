import { api } from './client'
import type { IApiResponse } from '@wanzai/contracts'

export async function recordPageView(data: {
  path: string
  referrer?: string
  title?: string
}): Promise<void> {
  await api.post('/analytics/pageview', data)
}

export async function getAnalyticsStats(days = 7): Promise<Record<string, unknown>> {
  const res = await api.get<IApiResponse>('/analytics/stats', { params: { days } })
  return res.data.data as Record<string, unknown>
}
