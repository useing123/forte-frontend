# New Backend Endpoints Specification

> **Context**: This document defines the *missing* endpoints required by the current frontend (Dashboard, Settings) and *new* endpoints needed for the **AI Code Review Agent**.
> **Source**: GitLab API features were identified using `context7` MCP (Library: `/websites/docs_gitlab_com`).

---

## 📊 Dashboard & Analytics (Missing)

### 1. Get Dashboard Metrics
**Endpoint**: `GET /api/dashboard/metrics`  
**Query Params**: `?time_range=30days` (optional)  
**Auth**: Session cookie required

**Response**:
```json
{
  "prsReviewed": {
    "total": 158,
    "incremental": 23
  },
  "suggestions": {
    "reviewComments": 342,
    "accepted": 186
  },
  "learnings": {
    "used": 47,
    "created": 12
  }
}
```

### 2. Get Leaderboard
**Endpoint**: `GET /api/dashboard/leaderboard`  
**Auth**: Session cookie required

**Response**:
```json
{
  "data": [
    {
      "rank": 1,
      "user": {
        "id": "user_1",
        "name": "Alice Chen",
        "avatar_url": "https://..."
      },
      "prs_reviewed": 47,
      "suggestions_accepted": 23
    }
  ]
}
```

---

## 🔑 API Keys (Missing)

### 3. List API Keys
**Endpoint**: `GET /api/api-keys`  
**Auth**: Session cookie required

**Response**:
```json
{
  "data": [
    {
      "id": "key_123",
      "key_name": "Production Key",
      "key_prefix": "rva_prod_",
      "created_at": "2025-11-20T10:00:00Z",
      "last_used_at": "2025-11-25T02:00:00Z"
    }
  ]
}
```

### 4. Create API Key
**Endpoint**: `POST /api/api-keys`  
**Auth**: Session cookie required

**Request**:
```json
{
  "name": "My New Key"
}
```

**Response**:
```json
{
  "id": "key_456",
  "key_name": "My New Key",
  "key_prefix": "rva_dev_",
  "key": "rva_dev_abcdef123456...", // Only returned once!
  "created_at": "2025-11-25T10:00:00Z"
}
```

### 5. Delete API Key
**Endpoint**: `DELETE /api/api-keys/{id}`  
**Auth**: Session cookie required  
**Response**: `204 No Content`

---

## 🤖 AI Code Review Agent Features (New)

> These endpoints proxy to GitLab API to let the frontend/agent access code and reviews.

### 6. List Merge Requests
**Endpoint**: `GET /api/repositories/{id}/merge_requests`  
**Query Params**: `?state=opened`  
**Auth**: Session cookie required

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "iid": 15, // Internal ID used for other calls
      "title": "Fix login bug",
      "author": { "name": "Bob" },
      "created_at": "2025-11-24T10:00:00Z",
      "web_url": "https://gitlab.com/..."
    }
  ]
}
```

### 7. Get Merge Request Diffs (For AI Analysis)
**Endpoint**: `GET /api/repositories/{id}/merge_requests/{mr_iid}/diffs`  
**Auth**: Session cookie required

**Response**:
```json
[
  {
    "old_path": "lib/api.ts",
    "new_path": "lib/api.ts",
    "new_file": false,
    "renamed_file": false,
    "deleted_file": false,
    "diff": "@@ -10,6 +10,8 @@\n class APIError extends Error..."
  }
]
```

### 8. Get Discussions/Comments (Context)
**Endpoint**: `GET /api/repositories/{id}/merge_requests/{mr_iid}/discussions`  
**Auth**: Session cookie required

**Response**:
```json
[
  {
    "id": "disc_123",
    "notes": [
      {
        "id": 555,
        "body": "Please fix this typo.",
        "author": { "name": "Alice" }
      }
    ]
  }
]
```

### 9. Post AI Review Comment
**Endpoint**: `POST /api/repositories/{id}/merge_requests/{mr_iid}/comments`  
**Auth**: Session cookie required

**Request**:
```json
{
  "body": "AI Review: Potential null pointer exception here."
}
```

**Response**:
```json
{
  "id": 556,
  "body": "AI Review: Potential null pointer exception here.",
  "created_at": "2025-11-25T12:00:00Z"
}
```

---

## 🕵️ Agent Activities (New)

### 10. List Agent Activities
**Endpoint**: `GET /api/agent/activities`  
**Query Params**: `?page=1&per_page=20`  
**Auth**: Session cookie required

**Response**:
```json
{
  "data": [
    {
      "id": "act_123",
      "type": "review_started",
      "description": "Started reviewing MR !15",
      "project_name": "frontend-app",
      "created_at": "2025-11-25T14:00:00Z",
      "metadata": {
        "mr_id": 15,
        "file_path": "src/utils.ts"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 50
  }
}
```

### 11. Get Agent Activity Details
**Endpoint**: `GET /api/agent/activities/{id}`  
**Auth**: Session cookie required

**Response**:
```json
{
  "id": "act_123",
  "type": "bug_found",
  "description": "Found potential security issue",
  "details": "Detected hardcoded secret in auth.ts line 45",
  "created_at": "2025-11-25T14:05:00Z"
}
```

---

## 🔌 Integrations (Missing)

### 12. List Integrations
**Endpoint**: `GET /api/integrations`  
**Auth**: Session cookie required

**Response**:
```json
{
  "data": [
    {
      "id": "gitlab",
      "name": "GitLab",
      "description": "Connect your GitLab repositories...",
      "connected": true,
      "status": "Connected"
    },
    {
      "id": "jira",
      "name": "Jira",
      "description": "Link code reviews to Jira issues...",
      "connected": false,
      "status": "Not connected"
    }
  ]
}
```

### 13. Connect/Disconnect Integration
**Endpoint**: `POST /api/integrations/{id}/toggle`  
**Auth**: Session cookie required

**Request**:
```json
{
  "connected": true
}
```

**Response**:
```json
{
  "id": "jira",
  "connected": true,
  "status": "Connected"
}
```

---

## 📄 Reports (Missing)

### 14. List Reports
**Endpoint**: `GET /api/reports`  
**Auth**: Session cookie required

**Response**:
```json
{
  "data": [
    {
      "id": "rep_123",
      "name": "Weekly Summary",
      "type": "recurring",
      "created_at": "2025-11-20T10:00:00Z",
      "status": "ready",
      "download_url": "https://api.reviewai.com/reports/rep_123.pdf"
    }
  ]
}
```

### 15. Create Report
**Endpoint**: `POST /api/reports`  
**Auth**: Session cookie required

**Request**:
```json
{
  "type": "on-demand", // or "recurring"
  "date_range": "last_30_days"
}
```

**Response**:
```json
{
  "id": "rep_456",
  "status": "generating",
  "message": "Report generation started"
}
```
