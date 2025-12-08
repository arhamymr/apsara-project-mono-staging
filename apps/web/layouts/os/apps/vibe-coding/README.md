# Vibe Coding - Convex Integration

This directory contains the Vibe Coding feature integrated with Convex for real-time data synchronization.

## Structure

```
vibe-coding/
├── index.tsx                    # Main entry point (welcome screen)
├── editor.tsx                   # Editor interface with chat and code panels
├── hooks/
│   ├── use-vibe-code-convex.ts # Hook for welcome screen (session management)
│   └── use-vibe-editor-convex.ts # Hook for editor (chat functionality)
├── components/                  # UI components (currently using placeholder UI)
└── README.md                    # This file
```

## Convex Integration

### Database Schema

The feature uses the following Convex tables:

- **chatSessions**: Stores vibe-coding sessions
  - `userId`: Owner of the session
  - `title`: Session title (auto-generated from first message)
  - `createdAt`, `updatedAt`: Timestamps

- **chatMessages**: Stores messages in sessions
  - `sessionId`: Reference to chat session
  - `userId`: Message author
  - `role`: "user" or "assistant"
  - `content`: Message text
  - `metadata`: Contains `appIntent` to identify vibe-coding messages
  - `createdAt`: Timestamp

### Convex Functions

Located in `apps/web/convex/vibeCoding.ts`:

1. **createVibeCodeSession** (mutation)
   - Creates a new vibe-coding session with an initial message
   - Returns the session ID

2. **sendVibeCodeMessage** (mutation)
   - Sends a user message in an existing session
   - Updates session timestamp

3. **processVibeCodeMessage** (action)
   - Processes messages and generates AI responses
   - Currently returns placeholder responses
   - TODO: Integrate with actual AI backend

4. **getVibeCodeSessions** (query)
   - Retrieves all vibe-coding sessions for the current user
   - Filters sessions by `appIntent` metadata

## Features

### Welcome Screen (`index.tsx`)
- Create new vibe-coding sessions
- View recent conversations
- Quick-start suggestions
- Centered, responsive layout

### Editor (`editor.tsx`)
- Split-panel interface (chat + code)
- Real-time message synchronization
- Tab navigation (Editor, Preview, Terminal, Artifacts)
- File explorer (placeholder)
- Monaco editor integration (placeholder)

## Current Status

✅ **Completed:**
- Convex database schema
- Session management
- Real-time chat functionality
- Welcome screen UI
- Editor UI layout
- Message persistence

🚧 **Placeholder/TODO:**
- AI response generation (currently returns placeholder text)
- Code artifact generation
- File tree and code editor integration
- Sandbox preview functionality
- Terminal logs
- Artifact management

## Usage

### Creating a Session

```typescript
import { useVibeCodeConvex } from './hooks/use-vibe-code-convex';

const { handleStartChat } = useVibeCodeConvex();

// Create a new session
const sessionId = await handleStartChat("Build a todo app");
```

### Sending Messages

```typescript
import { useVibeEditorConvex } from './hooks/use-vibe-editor-convex';

const { handleSendMessage } = useVibeEditorConvex(sessionId);

// Send a message
await handleSendMessage("Add a dark mode toggle");
```

## Next Steps

1. **AI Integration**: Replace placeholder responses in `processVibeCodeMessage` with actual AI service calls
2. **Artifact System**: Implement code generation and file management
3. **Sandbox Integration**: Connect to E2B or similar sandbox service for live previews
4. **File Editor**: Integrate Monaco editor with real file content
5. **Terminal**: Add real-time terminal output from sandbox

## Development

To work on this feature:

1. Start Convex dev server:
   ```bash
   cd apps/web
   npm run convex:dev
   ```

2. Start Next.js dev server:
   ```bash
   npm run dev
   ```

3. Open the Vibe Coding app from the OS dock

## Notes

- All chat data is stored in Convex and syncs in real-time
- Sessions are user-specific and authenticated
- The `appIntent` metadata field identifies vibe-coding messages vs other chat types
- The UI is fully functional but backend integrations are placeholders
