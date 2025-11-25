# Authentication Integration Guide

## Current Status: Development Mode (Mocked)

The frontend is currently running in **development mode** with mocked authentication. This allows you to develop and test the UI without a backend.

## How It Works Now

1. **Environment Variable:** `NEXT_PUBLIC_DEV_MODE=true` in `.env.local`
2. **API Client:** Returns mock data instead of calling backend
3. **Landing Page:** Shows "Dev Mode" and goes straight to dashboard
4. **No Authentication:** No login required during development

## Mock Data Available

- **Repositories:** 3 sample GitLab repos
- **Dashboard Metrics:** Sample PRs reviewed, suggestions
- **Leaderboard:** 3 sample developers
- **API Keys:** 2 sample keys

## When Ready to Integrate Real Backend

### Step 1: Switch to Production Mode

Edit `.env.local`:
```bash
# Change this from 'true' to 'false'
NEXT_PUBLIC_DEV_MODE=false

# Set your actual backend URL
NEXT_PUBLIC_API_URL=https://your-backend.com
```

### Step 2: Ensure Backend is Ready

Your backend team needs to implement these endpoints:

**Authentication:**
- `GET /auth/login` - Redirects to GitLab OAuth
- `GET /auth/callback` - Handles OAuth callback, sets session cookie
- `GET /auth/me` - Returns current user info
- `POST /auth/logout` - Clears session

**Data:**
- `GET /api/repositories` - List user's GitLab repos
- `POST /api/repositories/sync` - Sync repos from GitLab
- `GET /api/dashboard/metrics` - Dashboard metrics
- `GET /api/dashboard/leaderboard` - Leaderboard data
- `GET /api/api-keys` - List API keys
- `POST /api/api-keys` - Create API key
- `DELETE /api/api-keys/:id` - Delete API key

Full API contract: See `walkthrough.md`

### Step 3: Test Authentication Flow

1. Visit homepage → Click "Sign in with GitLab"
2. Complete GitLab OAuth
3. Should redirect back to `/dashboard` with session cookie
4. All API calls will now use real backend data

### Step 4: CORS Configuration

Your backend **must** allow CORS with credentials:

```python
# FastAPI example
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,  # CRITICAL for cookies!
    allow_methods=["*"],
    allow_headers=["*"],
)
```

```javascript
// Express example
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,  // CRITICAL for cookies!
}));
```

### Step 5: Verify Session Cookies

Backend should set cookies with these properties:
- `httpOnly: true` - Prevents XSS attacks
- `secure: true` - Only in production with HTTPS
- `sameSite: 'lax'` - CSRF protection

## Troubleshooting

### Problem: "Unauthorized" after login
**Solution:** Check CORS `allow_credentials` is `true`

### Problem: Session cookie not being sent
**Solution:** Verify `credentials: 'include'` in frontend API calls (already done)

### Problem: OAuth redirect not working
**Solution:** Check GitLab OAuth redirect URI matches backend callback URL

### Problem: 404 on API endpoints
**Solution:** Verify backend URL in `.env.local` is correct

## Development Tips

### Switching Between Modes

```bash
# Development (mock data, no backend)
NEXT_PUBLIC_DEV_MODE=true

# Production (real backend)
NEXT_PUBLIC_DEV_MODE=false
```

### Adding More Mock Data

Edit `lib/api.ts` in the `mockData` object to add more sample data.

### Testing Error States

In dev mode, you can temporarily modify the API client to throw errors for testing error handling.

## Files to Review

- **lib/api.ts** - API client with dev mode logic
- **app/page.tsx** - Landing page with dev mode bypass
- **.env.local.example** - Environment variable template
- **walkthrough.md** - Complete API contract documentation

## Ready to Deploy?

1. ✅ Set `NEXT_PUBLIC_DEV_MODE=false`
2. ✅ Update `NEXT_PUBLIC_API_URL` to production backend
3. ✅ Ensure backend implements all required endpoints
4. ✅ Verify CORS is configured correctly
5. ✅ Test OAuth flow end-to-end
6. 🚀 Deploy!
