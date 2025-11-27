import { NextRequest } from 'next/server'
import { proxyRequest } from '../../proxy'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.toString()
    const endpoint = query ? `/api/dashboard/metrics?${query}` : '/api/dashboard/metrics'

    return proxyRequest(request, endpoint)
}
