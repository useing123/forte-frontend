import { NextRequest } from 'next/server'
import { proxyRequest } from '../../proxy'

export async function GET(request: NextRequest) {
  const { search } = new URL(request.url)
  return proxyRequest(request, `/auth/callback${search}`)
}