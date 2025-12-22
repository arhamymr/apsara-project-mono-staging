# Backend Setup Guide

## Port Configuration

The Go backend runs on **port 1323** by default (not 1234).

### Environment Variables

**Frontend (.env.local):**
```env
API_URL=http://localhost:1323
API_HUB_KEY=pk_live_OlZXPvo9HT1R9c3N5SxyuFLMT91mIW0c
```

**Backend (.env):**
```env
PORT=:1323
```

## Starting the Backend

### Option 1: Direct Go Command
```bash
cd apps/backend
go run server.go
```

### Option 2: Using Make (if available)
```bash
make run
```

### Option 3: Docker
```bash
docker-compose up backend
```

## Verifying Backend is Running

Test the health endpoint:
```bash
# Using curl
curl http://localhost:1323/health

# Using PowerShell
Invoke-WebRequest http://localhost:1323/health

# Using browser
http://localhost:1323/health
```

Expected response:
```json
{
  "status": "ok"
}
```

## Testing Blog API

```bash
# List blogs
curl -H "Authorization: Bearer pk_live_OlZXPvo9HT1R9c3N5SxyuFLMT91mIW0c" \
  http://localhost:1323/api/v1/blogs

# Get single blog
curl -H "Authorization: Bearer pk_live_OlZXPvo9HT1R9c3N5SxyuFLMT91mIW0c" \
  http://localhost:1323/api/v1/blogs/blog-slug
```

## Troubleshooting

### Port Already in Use
If port 1323 is already in use:
```bash
# Find process using port 1323
netstat -ano | findstr :1323

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or change port in .env
PORT=:1324
```

### Backend Not Starting
1. Check Go is installed: `go version`
2. Check dependencies: `go mod download`
3. Check for errors in logs
4. Verify environment variables are set

### CORS Issues
If you get CORS errors, check `apps/backend/internal/config/config.go`:
- Default CORS origins: `http://localhost:1234`, `http://127.0.0.1:1234`
- Update if needed for your frontend URL

## Full Stack Startup

1. **Start Backend:**
   ```bash
   cd apps/backend
   go run server.go
   ```

2. **Start Frontend (new terminal):**
   ```bash
   cd apps/web
   npm run dev
   ```

3. **Verify:**
   - Backend: http://localhost:1323/health
   - Frontend: http://localhost:1234
   - Blog API: http://localhost:1234/blog

## Environment Variables Summary

| Variable | Value | Purpose |
|----------|-------|---------|
| `API_URL` | `http://localhost:1323` | Backend API base URL |
| `API_HUB_KEY` | `pk_live_...` | API authentication key |
| `PORT` | `:1323` | Backend server port |

## Next Steps

After backend is running:
1. Restart Next.js dev server
2. Navigate to http://localhost:1234/blog
3. Blog posts should load from backend
