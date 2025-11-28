import { NextRequest } from 'next/server'
import { proxyRequest } from '@/lib/proxy'

export async function GET(request: NextRequest) {
    return proxyRequest(request, '/api/integrations/jira')
}

export async function POST(request: NextRequest) {
    return proxyRequest(request, '/api/integrations/jira')
}

export async function DELETE(request: NextRequest) {
    return proxyRequest(request, '/api/integrations/jira')
}
