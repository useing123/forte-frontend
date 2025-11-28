import { NextRequest } from 'next/server'
import { proxyRequest } from '@/lib/proxy'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.toString()
    const endpoint = query ? `/api/repositories?${query}` : '/api/repositories'

    return proxyRequest(request, endpoint)
}
