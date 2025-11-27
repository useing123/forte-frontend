import { NextRequest } from 'next/server'
import { proxyRequest } from '../../proxy'

export async function POST(request: NextRequest) {
    return proxyRequest(request, '/api/repositories/sync', {
        method: 'POST',
    })
}
