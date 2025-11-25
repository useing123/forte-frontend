// API client for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

class APIError extends Error {
    constructor(public status: number, message: string) {
        super(message)
        this.name = 'APIError'
    }
}

// Mock data for development mode
const mockData = {
    user: { id: '1', username: 'developer', email: 'dev@example.com', name: 'Dev User', avatar_url: '' },
    onboardingStatus: { completed: false, has_tokens: false }, // NEW: for onboarding check
    repositories: {
        data: [
            { id: '1', gitlab_repo_id: 1, name: 'frontend-app', full_path: 'dev/frontend-app', visibility: 'private', description: 'Main frontend', last_review_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
            { id: '2', gitlab_repo_id: 2, name: 'backend-api', full_path: 'dev/backend-api', visibility: 'private', description: 'Backend API', last_review_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
            { id: '3', gitlab_repo_id: 3, name: 'mobile-app', full_path: 'dev/mobile-app', visibility: 'public', description: 'Mobile app', last_review_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
        ]
    },
    metrics: {
        prsReviewed: { total: 158, incremental: 23 },
        suggestions: { reviewComments: 342, accepted: 186 },
        learnings: { used: 47, created: 12 }
    },
    leaderboard: {
        data: [
            { rank: 1, user: { id: '1', name: 'Alice Chen', avatar_url: '' }, prs_reviewed: 47, suggestions_accepted: 23 },
            { rank: 2, user: { id: '2', name: 'Bob Smith', avatar_url: '' }, prs_reviewed: 38, suggestions_accepted: 19 },
            { rank: 3, user: { id: '3', name: 'Carol Davis', avatar_url: '' }, prs_reviewed: 31, suggestions_accepted: 15 },
        ]
    },
    apiKeys: {
        data: [
            { id: '1', key_name: 'Production Key', key_prefix: 'rva_prod_', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), last_used_at: new Date().toISOString() },
            { id: '2', key_name: 'Development Key', key_prefix: 'rva_dev_', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        ]
    }
}

async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Development mode: return mock data
    if (DEV_MODE) {
        console.log(`[DEV MODE] Mock API call: ${endpoint}`)
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay

        if (endpoint === '/auth/me') return mockData.user as T
        if (endpoint === '/api/onboarding/status') return mockData.onboardingStatus as T
        if (endpoint === '/api/onboarding/token' && options?.method === 'POST') {
            // Mark onboarding as completed after token submission
            mockData.onboardingStatus.completed = true
            mockData.onboardingStatus.has_tokens = true
            return { success: true, message: 'Token added successfully' } as T
        }
        if (endpoint.startsWith('/api/repositories')) return mockData.repositories as T
        if (endpoint.startsWith('/api/dashboard/metrics')) return mockData.metrics as T
        if (endpoint.startsWith('/api/dashboard/leaderboard')) return mockData.leaderboard as T
        if (endpoint === '/api/api-keys' && options?.method !== 'POST') return mockData.apiKeys as T
        if (endpoint.startsWith('/api/api-keys') && options?.method === 'POST') {
            return { id: Date.now().toString(), key_name: 'New Key', key: 'rva_new_abc123xyz456', key_prefix: 'rva_new_', created_at: new Date().toISOString() } as T
        }
        if (endpoint.startsWith('/api/repositories/sync')) return { synced: 3 } as T

        return {} as T
    }

    // Production mode: call actual backend
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include', // Important: sends cookies for session
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    })

    if (!res.ok) {
        if (res.status === 401) {
            // Redirect to backend login
            if (typeof window !== 'undefined') {
                window.location.href = `${API_BASE_URL}/auth/login`
            }
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
