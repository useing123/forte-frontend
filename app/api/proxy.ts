import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://forte-hackathon-core-forte-hackathon-shoe.fin1.bult.app'

/**
 * Proxy utility to forward requests to the backend API
 * Handles cookies, headers, and streaming responses server-side to avoid CORS
 */
export async function proxyRequest(
    request: NextRequest,
    endpoint: string,
    options: RequestInit = {}
): Promise<NextResponse> {
    try {
        const url = `${BACKEND_URL}${endpoint}${request.nextUrl.search}`

        // Forward cookies from the incoming request
        const cookies = request.headers.get('cookie') || ''
        const authorization = request.headers.get('authorization')

        // Merge headers
        const baseHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            'Cookie': cookies,
        }

        if (authorization) {
            baseHeaders['Authorization'] = authorization
        }

        const headers: HeadersInit = {
            ...baseHeaders,
            ...options.headers,
        }

        // Make request to backend
        const response = await fetch(url, {
            ...options,
            headers,
            credentials: 'include', // Important for backend session handling
        })

        // Get response data
        const data = await response.text()

        // Create Next.js response with same status and headers
        const nextResponse = new NextResponse(data, {
            status: response.status,
            statusText: response.statusText,
        })

        // Forward important headers from backend to client
        // Note: set-cookie can have multiple values, we need to handle them properly
        const headersToForward = ['content-type', 'cache-control', 'etag']

        headersToForward.forEach(headerName => {
            const value = response.headers.get(headerName)
            if (value) {
                nextResponse.headers.set(headerName, value)
            }
        })

        // Handle set-cookie headers (can be multiple)
        // In fetch API, multiple set-cookie headers are concatenated
        const setCookie = response.headers.get('set-cookie')
        if (setCookie) {
            nextResponse.headers.set('set-cookie', setCookie)
        }

        return nextResponse
    } catch (error) {
        console.error('Proxy error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
