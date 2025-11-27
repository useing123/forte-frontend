import { NextRequest } from 'next/server'
import { proxyRequest } from '../proxy'

export async function GET(request: NextRequest) {
    return proxyRequest(request, '/api/api-keys')
}

export async function POST(request: NextRequest) {
    const body = await request.text()

    return proxyRequest(request, '/api/api-keys', {
        method: 'POST',
        body,
    })
}
