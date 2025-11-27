import { NextRequest } from 'next/server'
import { proxyRequest } from '../../proxy'

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    const path = params.path.join('/')
    return proxyRequest(request, `/auth/${path}`)
}

export async function POST(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    const path = params.path.join('/')
    const body = await request.text()

    return proxyRequest(request, `/auth/${path}`, {
        method: 'POST',
        body,
    })
}
