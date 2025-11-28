import { NextRequest } from 'next/server'
import { proxyRequest } from '@/lib/proxy'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    return proxyRequest(request, `/api/tokens/${id}`)
}
