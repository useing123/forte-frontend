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
        const url = `${BACKEND_URL}${endpoint}`

        // Forward cookies from the incoming request
        const cookies = request.headers.get('cookie') || ''

        // Merge headers
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Cookie': cookies,
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

        // Forward set-cookie headers from backend to client
        response.headers.forEach((value, key) => {
            if (key.toLowerCase() === 'set-cookie') {
                nextResponse.headers.set(key, value)
            }
        })

        // Set content type
        const contentType = response.headers.get('content-type')
        if (contentType) {
            nextResponse.headers.set('content-type', contentType)
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
