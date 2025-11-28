import { NextRequest } from 'next/server'
import { proxyRequest } from '@/lib/proxy'

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return proxyRequest(request, `/api/api-keys/${params.id}`)
}
