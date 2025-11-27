# API Documentation

This document provides a detailed reference for the API routes available in the Forte Hackathon Core application.

## Overview

The application exposes a RESTful API built with FastAPI. It handles authentication via GitLab OAuth, manages user tokens, lists repositories, and processes GitLab webhooks.

## Authentication

The API uses session-based authentication.
- **Session Cookie**: `session` (signed cookie)
- **Required for**: All endpoints except `/health`, `/gitlab/webhook`, `/auth/login`, and `/auth/callback`.

## Endpoints

### 1. System & Webhooks

#### `GET /health`
**Description**: Health check endpoint to verify the service is running.
- **Auth Required**: No
- **Response**:
  ```json
  {
    "status": "ok"
  }
  ```

#### `POST /gitlab/webhook`
**Description**: Receives and processes webhooks from GitLab (specifically Merge Request events).
- **Auth Required**: No (Validates `X-Gitlab-Token` header)
- **Headers**:
  - `X-Gitlab-Event`: Must be "Merge Request Hook"
  - `X-Gitlab-Token`: Secret token for validation
  - `X-Gitlab-Event-UUID`: Unique event ID
- **Body**: GitLab webhook payload (JSON)
- **Response**:
  - `202 Accepted`: Status "queued", "ignored", "duplicate_skipped", or "cooldown_skipped"
  - `401 Unauthorized`: Invalid token
  - `403 Forbidden`: IP not allowed
  - `429 Too Many Requests`: Rate limit exceeded

---

### 2. Authentication (`/auth`)

#### `GET /auth/login`
**Description**: Initiates the OAuth 2.0 flow with GitLab. Redirects the user to GitLab's authorization page.
- **Auth Required**: No
- **Response**: `307 Temporary Redirect` to GitLab

#### `GET /auth/callback`
**Description**: OAuth callback handler. Exchanges the authorization code for an access token, retrieves user info, and sets the session cookie.
- **Auth Required**: No
- **Query Parameters**:
  - `code`: Authorization code
  - `state`: State parameter for CSRF protection
- **Response**: `307 Temporary Redirect` to the frontend (e.g., `/dashboard` or `/onboarding`)

#### `GET /auth/me`
**Description**: Returns the currently authenticated user's information.
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "id": "gitlab:12345",
    "username": "jdoe",
    "email": "jdoe@example.com",
    "name": "John Doe",
    "avatar_url": "..."
  }
  ```

#### `POST /auth/logout`
**Description**: Logs out the user by clearing the session cookie.
- **Auth Required**: No (but effectively yes to have a session to clear)
- **Response**:
  ```json
  {
    "status": "ok"
  }
  ```

---

### 3. Onboarding & Tokens (`/api/onboarding`, `/api/tokens`)

#### `GET /api/onboarding/status`
**Description**: Checks if the user has completed onboarding (i.e., has added at least one token).
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "completed": true,
    "has_tokens": true,
    "token_count": 1
  }
  ```

#### `POST /api/onboarding/token`
**Description**: Adds a new GitLab Personal Access Token (PAT) for the user. Validates the token with GitLab before saving.
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "token": "glpat-...",
    "name": "My Token"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Token added successfully",
    "token_id": "uuid..."
  }
  ```

#### `GET /api/tokens`
**Description**: Lists all access tokens associated with the current user.
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "uuid...",
        "name": "My Token",
        "project_id": 123,
        "scopes": ["api"],
        "created_at": 1630000000,
        "last_used_at": 1630000000
      }
    ]
  }
  ```

#### `DELETE /api/tokens/{token_id}`
**Description**: Deletes a specific token.
- **Auth Required**: Yes
- **Path Parameters**:
  - `token_id`: ID of the token to delete
- **Response**: `204 No Content`

---

### 4. Repositories (`/api/repositories`)

#### `GET /api/repositories`
**Description**: Lists repositories accessible to the user. Supports search and pagination.
- **Auth Required**: Yes
- **Query Parameters**:
  - `search`: (Optional) Search query for repository name or path
  - `page`: (Optional) Page number (default: 1)
  - `per_page`: (Optional) Items per page (default: 10)
- **Response**:
  ```json
  {
    "data": [
      {
        "id": 123,
        "name": "repo-name",
        "full_path": "group/repo-name",
        ...
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 10,
      "total": 50
    }
  }
  ```

#### `POST /api/repositories/sync`
**Description**: Triggers a synchronization of repositories from GitLab for the current user.
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "synced": 15
  }
  ```
