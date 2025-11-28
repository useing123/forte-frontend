import { NextRequest } from 'next/server'
import { proxyRequest } from '@/lib/proxy'

export async function GET(request: NextRequest) {
    const endpoint = '/api/repositories'
    return proxyRequest(request, endpoint)
}
