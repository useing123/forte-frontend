// API client for backend communication
const API_BASE_URL = '' // Empty string = use relative paths to Next.js API routes

class APIError extends Error {
    constructor(public status: number, message: string) {
        super(message)
        this.name = 'APIError'
    }
}

async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Use rewrites for both /auth and /api endpoints
    // Credentials are sent with all requests for session cookie handling
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include', // Send cookies with all requests
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    })

    if (!res.ok) {
        if (res.status === 401) {
            // Don't auto-redirect - let calling code handle it
            // This prevents infinite redirect loops
            throw new APIError(401, 'Unauthorized')
        }
        const error = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new APIError(res.status, error.error || `Request failed with status ${res.status}`)
    }

    return res.json()
}

// Types
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

export interface DashboardMetrics {
    prsReviewed: {
        total: number
        incremental: number
    }
    suggestions: {
        reviewComments: number
        accepted: number
    }
    learnings: {
        used: number
        created: number
    }
}

export interface LeaderboardEntry {
    rank: number
    user: {
        id: string
        name: string
        avatar_url?: string
    }
    prs_reviewed: number
    suggestions_accepted: number
}

export interface LeaderboardResponse {
    data: LeaderboardEntry[]
}

export interface ApiKey {
    id: string
    key_name: string
    key_prefix: string
    created_at: string
    last_used_at?: string
    key?: string // Only present on creation
}

export interface ApiKeysResponse {
    data: ApiKey[]
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

// API methods
export const api = {
    // Auth
    getCurrentUser: () => apiClient<User>('/auth/me'),

    logout: () => apiClient('/auth/logout', { method: 'POST' }),

    // Onboarding
    getOnboardingStatus: () => apiClient<OnboardingStatus>('/api/onboarding/status'),

    getTokens: () => apiClient<TokensResponse>('/api/tokens'),

    deleteToken: (tokenId: string) => apiClient(`/api/tokens/${tokenId}`, { method: 'DELETE' }),

    submitProjectToken: (token: string, name: string) =>
        apiClient('/api/onboarding/token', {
            method: 'POST',
            body: JSON.stringify({ token, name }),
        }),

    // Repositories
    getRepositories: (params?: { search?: string; page?: number; per_page?: number }) => {
        const query = params ? `?${new URLSearchParams(params as any)}` : ''
        return apiClient<RepositoriesResponse>(`/api/repositories${query}`)
    },

    syncRepositories: () => apiClient('/api/repositories/sync', { method: 'POST' }),

    // Dashboard
    getMetrics: (timeRange = '30days') =>
        apiClient<DashboardMetrics>(`/api/dashboard/metrics?time_range=${timeRange}`),

    getLeaderboard: () => apiClient<LeaderboardResponse>('/api/dashboard/leaderboard'),

    // API Keys
    getApiKeys: () => apiClient<ApiKeysResponse>('/api/api-keys'),

    createApiKey: (name: string) =>
        apiClient<ApiKey>('/api/api-keys', {
            method: 'POST',
            body: JSON.stringify({ name }),
        }),

    deleteApiKey: (id: string) =>
        apiClient(`/api/api-keys/${id}`, { method: 'DELETE' }),
}
