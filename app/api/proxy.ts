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

        // Forward relevant headers from the incoming request to make the proxy transparent
        const cookies = request.headers.get('cookie') || ''
        const authorization = request.headers.get('authorization')
        const userAgent = request.headers.get('user-agent') || ''
        const accept = request.headers.get('accept') || '*/*'
        const acceptLanguage = request.headers.get('accept-language') || 'en-US,en;q=0.9'
        const acceptEncoding = request.headers.get('accept-encoding') || 'gzip, deflate, br'

        // Get original client IP
        const xForwardedFor = request.headers.get('x-forwarded-for')
        const clientIp = xForwardedFor ? xForwardedFor.split(',')[0].trim() : null

        // Build headers for the backend request
        const backendHeaders: Record<string, string> = {
            'Cookie': cookies,
            'User-Agent': userAgent,
            'Accept': accept,
            'Accept-Language': acceptLanguage,
            'Accept-Encoding': acceptEncoding,
            'Referer': request.url,
        }

        if (clientIp) {
            backendHeaders['X-Forwarded-For'] = clientIp
            backendHeaders['X-Real-IP'] = clientIp
        }

        if (authorization) {
            backendHeaders['Authorization'] = authorization
        }

        const method = options.method || 'GET'
        // Only add Content-Type for methods that typically have a body
        if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
            backendHeaders['Content-Type'] = 'application/json'
        }

        const headers: HeadersInit = {
            ...backendHeaders,
            ...options.headers,
        }

        // Make request to backend
        const response = await fetch(url, {
            ...options,
            headers,
            // `credentials` is not needed for server-side fetch
        })

        // Handle redirects
        if (response.status >= 300 && response.status < 400 && response.headers.has('location')) {
            const location = response.headers.get('location')!
            const nextResponse = NextResponse.redirect(location, response.status)

            // Forward set-cookie header on redirect
            const setCookie = response.headers.get('set-cookie')
            if (setCookie) {
                nextResponse.headers.set('set-cookie', setCookie)
            }
            return nextResponse
        }

        // Handle regular responses
        const data = await response.text()
        const nextResponse = new NextResponse(data, {
            status: response.status,
            statusText: response.statusText,
        })

        // Forward important headers from backend to client
        const headersToForward = ['content-type', 'cache-control', 'etag']
        headersToForward.forEach(headerName => {
            const value = response.headers.get(headerName)
            if (value) {
                nextResponse.headers.set(headerName, value)
            }
        })

        // Handle set-cookie headers
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
