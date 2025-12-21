# Lead Management API Helper

## Overview

The API Helper is a built-in UI tool that helps developers integrate the Lead Management API into their applications. It provides ready-to-use code examples in multiple programming languages based on your actual pipeline configuration.

## Features

### 🎯 Pipeline-Specific Code Generation
- Automatically includes your pipeline ID and stage IDs
- Uses your actual pipeline structure for realistic examples
- No manual configuration needed

### 💻 Multi-Language Support
- **cURL**: For quick testing and debugging
- **JavaScript**: For browser-based applications
- **TypeScript**: For type-safe implementations
- **Python**: For backend integrations and scripts

### 📚 Complete API Coverage
1. **Create Single Lead**: Add one lead at a time
2. **Create Bulk Leads**: Import multiple leads efficiently (up to 100 per request)
3. **List Pipelines**: Discover available pipelines
4. **Get Pipeline Stages**: Retrieve stages for a specific pipeline

### ✨ Developer-Friendly Features
- One-click copy to clipboard
- Syntax-highlighted code examples
- Inline documentation and notes
- Real pipeline IDs and stage IDs
- Rate limiting information
- Error handling examples

## How to Access

1. Open the Lead Management app
2. Select or create a pipeline
3. Click the **"API"** button in the header
4. Choose your endpoint and programming language
5. Copy the code and integrate into your application

## Code Example Structure

Each code example includes:
- **Authentication**: Bearer token setup
- **Request Headers**: Proper content-type and authorization
- **Request Body**: Complete with all available fields
- **Response Handling**: Success and error cases
- **Type Definitions**: (TypeScript only) Full type safety

## API Endpoints

### POST /api/v1/leads
Create a single lead in a specific pipeline stage.

**Required Fields:**
- `pipelineId`: Your pipeline ID
- `stageId`: Target stage ID
- `name`: Lead name

**Optional Fields:**
- `company`, `value`, `email`, `phone`, `owner`, `source`, `notes`

### POST /api/v1/leads/bulk
Create multiple leads in one request (max 100).

**Features:**
- Partial success handling
- Individual error reporting
- Atomic operations per lead

### GET /api/v1/pipelines
List all pipelines you have access to.

**Returns:**
- Pipeline ID, name, timestamps
- Access level (owner/edit/view)

### GET /api/v1/pipelines/:id/stages
Get all stages for a specific pipeline.

**Returns:**
- Stage ID, title, color, position
- Sorted by position

## Authentication

All API requests require a Convex Auth token:

```
Authorization: Bearer YOUR_AUTH_TOKEN_HERE
```

To obtain your auth token:
1. Log in to the application
2. Open browser DevTools (F12)
3. Go to Application > Local Storage
4. Find your Convex auth token
5. Replace `YOUR_AUTH_TOKEN_HERE` in the code examples

## Rate Limits

- **100 requests per minute** per user
- Applies to all endpoints
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Unix timestamp when limit resets

## Best Practices

### 1. Error Handling
Always implement proper error handling:
- Check HTTP status codes
- Parse error responses
- Log errors for debugging
- Implement retry logic for transient failures

### 2. Bulk Operations
When importing large datasets:
- Use bulk endpoint for efficiency
- Batch in groups of 100 or less
- Handle partial failures gracefully
- Implement progress tracking

### 3. Data Validation
Before sending requests:
- Validate email formats
- Ensure required fields are present
- Check value is non-negative
- Verify pipeline and stage IDs exist

### 4. Security
- Never commit auth tokens to version control
- Use environment variables for tokens
- Rotate tokens regularly
- Use HTTPS in production

## Common Use Cases

### 1. Website Form Integration
Capture leads from your website and automatically add them to your pipeline:
```javascript
// Form submission handler
async function handleFormSubmit(formData) {
  const lead = {
    pipelineId: 'your-pipeline-id',
    stageId: 'new-leads-stage-id',
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    source: 'Website Form'
  };
  
  // Use code from API Helper
  const response = await createLead(lead);
  return response;
}
```

### 2. CRM Import
Import leads from another CRM system:
```python
# Read from CSV and bulk import
import csv

leads = []
with open('leads.csv', 'r') as file:
    reader = csv.DictReader(file)
    for row in reader:
        leads.append({
            'pipelineId': pipeline_id,
            'stageId': stage_id,
            'name': row['name'],
            'company': row['company'],
            'email': row['email'],
            'value': int(row['value'])
        })

# Import in batches of 100
for i in range(0, len(leads), 100):
    batch = leads[i:i+100]
    create_leads_bulk(batch)
```

### 3. Zapier/Make Integration
Connect with automation platforms:
- Use webhook triggers
- Map fields from source to API
- Handle errors and retries
- Log successful imports

### 4. Mobile App Integration
Add leads from mobile applications:
- Use TypeScript for React Native
- Implement offline queue
- Sync when connection available
- Show user feedback

## Troubleshooting

### 401 Unauthorized
- Check auth token is valid
- Ensure token hasn't expired
- Verify Bearer prefix in header

### 403 Forbidden
- Confirm you have edit access to pipeline
- Check pipeline sharing settings
- Verify organization membership

### 404 Not Found
- Validate pipeline ID exists
- Confirm stage ID belongs to pipeline
- Check for typos in IDs

### 429 Too Many Requests
- Implement rate limiting in your code
- Add delays between requests
- Use bulk endpoint for multiple leads
- Check `Retry-After` header

### 400 Bad Request
- Validate all required fields present
- Check email format is valid
- Ensure value is non-negative
- Verify JSON is properly formatted

## Support

For additional help:
- Check the [API Documentation](/api/v1/docs)
- Review the [OpenAPI Specification](/api/v1/docs/openapi.json)
- Contact support for integration assistance

## Future Enhancements

Planned features for the API Helper:
- Interactive API testing (send real requests)
- Response preview
- Authentication token management
- Webhook configuration
- Custom field mapping
- Import history tracking
