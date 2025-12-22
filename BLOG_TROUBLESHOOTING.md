# Blog API Troubleshooting Guide

## Error: "Failed to fetch blogs"

### Common Causes & Solutions

#### 1. **Backend Not Running**
- **Symptom**: Connection refused or timeout errors
- **Solution**: 
  - Ensure the Go backend is running on port 1234
  - Check: `http://localhost:1234/health`
  - Start backend: `go run ./apps/backend/server.go`

#### 2. **Missing Environment Variables**
- **Symptom**: "API key not configured" error
- **Solution**: 
  - Verify `.env.local` has these variables:
    ```
    API_URL=http://localhost:1234
    API_HUB_KEY=pk_live_OlZXPvo9HT1R9c3N5SxyuFLMT91mIW0c
    ```
  - Restart Next.js dev server after updating env vars

#### 3. **Invalid API Key**
- **Symptom**: 403 Forbidden error
- **Solution**:
  - Check the API key is correct in `.env.local`
  - Verify the key has `blogs:read` permission
  - Generate a new key if needed

#### 4. **Backend API Endpoint Issue**
- **Symptom**: 404 Not Found error
- **Solution**:
  - Verify backend has the blog endpoints registered
  - Check: `GET /api/v1/blogs` returns data
  - Check: `GET /api/v1/blogs/:slug` returns data
  - Test with curl:
    ```bash
    curl -H "Authorization: Bearer YOUR_API_KEY" \
      http://localhost:1234/api/v1/blogs
    ```

#### 5. **CORS Issues**
- **Symptom**: CORS error in browser console
- **Solution**:
  - Backend CORS is configured in `apps/backend/internal/router/router.go`
  - Verify CORS origins include your frontend URL
  - Check browser console for specific CORS error

### Debugging Steps

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for detailed error messages
   - Check Network tab for API response

2. **Check Server Logs**
   - Next.js logs: Terminal where `npm run dev` is running
   - Backend logs: Terminal where Go server is running
   - Look for error messages with details

3. **Test API Directly**
   ```bash
   # Test backend health
   curl http://localhost:1234/health
   
   # Test blogs endpoint
   curl -H "Authorization: Bearer YOUR_API_KEY" \
     http://localhost:1234/api/v1/blogs
   ```

4. **Check Network Tab**
   - Open DevTools → Network tab
   - Reload page
   - Click on `/api/blogs` request
   - Check Response tab for error details

### Environment Variables Checklist

- [ ] `API_URL` is set to backend URL (default: `http://localhost:1234`)
- [ ] `API_HUB_KEY` is set to valid API key
- [ ] `.env.local` file exists in `apps/web/`
- [ ] Next.js dev server restarted after env changes
- [ ] Backend is running and accessible

### API Response Format

**Success Response (200)**
```json
{
  "data": [
    {
      "id": "blog-1",
      "title": "Blog Title",
      "excerpt": "Blog excerpt...",
      "slug": "blog-slug",
      "coverImage": "https://...",
      "authorName": "Author Name",
      "publishedAt": "2024-01-01T00:00:00Z",
      "tags": ["tag1", "tag2"]
    }
  ],
  "pagination": {
    "hasMore": false,
    "page": 1,
    "perPage": 10,
    "total": 1
  }
}
```

**Error Response (4xx/5xx)**
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

### Still Having Issues?

1. Check the server logs for detailed error messages
2. Verify backend is returning correct data format
3. Ensure API key has proper permissions
4. Check network connectivity between frontend and backend
5. Try clearing browser cache and reloading
