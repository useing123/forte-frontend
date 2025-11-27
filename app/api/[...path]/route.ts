import { NextRequest } from 'next/server'
import { proxyRequest } from '../proxy'

async function handler(request: NextRequest) {
    const { pathname, search } = new URL(request.url)
    // Construct the endpoint by taking everything after '/api'
    const endpoint = pathname.substring(4) + search

    const body = request.body ? await request.text() : undefined

    return proxyRequest(request, endpoint, {
        method: request.method,
        body,
    })
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH }