const API_BASE_URL = ''

class APIError extends Error {
    constructor(public status: number, message: string) {
        super(message)
        this.name = 'APIError'
    }
}

async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    })

    if (!res.ok) {
        if (res.status === 401) {
            throw new APIError(401, 'Unauthorized')
        }
        const error = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new APIError(res.status, error.error || `Request failed with status ${res.status}`)
    }

    return res.json()
}

export interface User {
    id: string
    username: string
    email: string
    name: string
    avatar_url: string
}

export interface Repository {
    id: string
    gitlab_repo_id: number
    name: string
    full_path: string
    visibility: string
    description?: string
    last_review_at?: string
}

export interface RepositoriesResponse {
    data: Repository[]
    pagination?: {
        page: number
        per_page: number
        total: number
    }
}

export interface Token {
    id: string
    name: string
    project_id?: string
    scopes?: string[]
    created_at: string
    last_used_at?: string
}

export interface TokensResponse {
    data: Token[]
}

export interface OnboardingStatus {
    completed: boolean
    has_tokens: boolean
    token_count?: number
}

export const api = {
    getCurrentUser: () => apiClient<User>('/auth/me'),

    logout: () => apiClient('/auth/logout', { method: 'POST' }),

    getOnboardingStatus: () => apiClient<OnboardingStatus>('/api/onboarding/status'),

    getTokens: () => apiClient<TokensResponse>('/api/tokens'),

    deleteToken: (tokenId: string) => apiClient(`/api/tokens/${tokenId}`, { method: 'DELETE' }),

    submitProjectToken: (token: string, name: string) =>
        apiClient('/api/onboarding/token', {
            method: 'POST',
            body: JSON.stringify({ token, name }),
        }),

    getRepositories: (params?: { search?: string; page?: number; per_page?: number }) => {
        const query = params ? `?${new URLSearchParams(params as any)}` : ''
        return apiClient<RepositoriesResponse>(`/api/repositories${query}`)
    },

    syncRepositories: () => apiClient('/api/repositories/sync', { method: 'POST' }),
}
