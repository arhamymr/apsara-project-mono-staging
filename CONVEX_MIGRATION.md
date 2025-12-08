# Chat System Migration to Convex

This document outlines the migration of the chat system from REST API calls to Convex.

## Changes Made

### 1. Database Schema Updates
- Added `chatSessions` table to track user chat sessions
- Added `chatMessages` table to store chat messages with metadata
- Updated `apps/web/convex/schema.ts`

### 2. Convex Functions
Created `apps/web/convex/chat.ts` with:
- `getUserChatSessions` - Query to get user's chat sessions
- `getChatMessages` - Query to get messages for a session
- `createChatSession` - Mutation to create new chat session
- `addUserMessage` - Mutation to add user messages
- `addAssistantMessage` - Mutation to add assistant responses
- `processChatMessage` - Action to handle chat processing with external API
- `getOrCreateDefaultSession` - Mutation to get or create default session

### 3. Hook Updates
Updated `apps/web/layouts/os/components/assistant/chat/useChat.ts`:
- Replaced React Query with Convex hooks
- Added session management
- Maintained app intent detection functionality
- Added proper loading state management

### 4. Component Updates
- Updated `chat-message-area.tsx` to use message `_id` for keys
- Removed unused imports from main chat component

### 5. Environment Variables
Added `BACKEND_URL` to both `.env.local` and `.env.prod` for external API calls.

## Setup Instructions

1. **Start Convex Development Server**
   ```bash
   cd apps/web
   pnpm convex:dev
   ```

2. **Start Next.js Development Server**
   ```bash
   cd apps/web
   pnpm dev
   ```

3. **Deploy Convex (Production)**
   ```bash
   cd apps/web
   pnpm convex:deploy
   ```

## Features

### Session Management
- Automatic session creation for new users
- Persistent chat history across sessions
- Session-based message organization
- **NEW**: Multiple chat sessions with sidebar navigation
- **NEW**: Session switching and management
- **NEW**: Auto-generated session titles from first message

### Chat Controls
- **NEW**: Start new chat sessions
- **NEW**: Clear/reset current chat
- **NEW**: Delete chat sessions
- **NEW**: Keyboard shortcuts (Ctrl+N for new chat, Ctrl+R to clear)
- **NEW**: Collapsible sessions sidebar

### App Intent Detection
- Maintains existing app opening functionality
- Stores intent metadata in messages
- Triggers app opening through callbacks

### External API Integration
- Processes messages through existing backend API
- Handles errors gracefully
- Maintains backward compatibility

### Real-time Updates
- Messages update in real-time through Convex
- Automatic UI updates when new messages arrive
- Optimistic updates for better UX

### User Interface
- **NEW**: Enhanced chat layout with sidebar
- **NEW**: Session management interface
- **NEW**: Keyboard shortcuts help tooltip
- **NEW**: Improved chat header with controls

## Migration Benefits

1. **Real-time Capabilities**: Messages update instantly across sessions
2. **Offline Support**: Convex provides offline-first functionality
3. **Type Safety**: Full TypeScript support with generated types
4. **Scalability**: Built-in scaling and performance optimization
5. **Data Persistence**: Reliable message storage and retrieval
6. **User Experience**: Faster loading and better error handling

## New Components Added

### Chat Layout Components
- `chat-layout.tsx` - Main layout with sidebar and chat area
- `chat-sessions-sidebar.tsx` - Sidebar for managing chat sessions
- `keyboard-shortcuts-help.tsx` - Help tooltip for keyboard shortcuts

### Enhanced Functionality
- Session switching and management
- Keyboard shortcuts for common actions
- Auto-generated session titles
- Session deletion with confirmation

## Keyboard Shortcuts

- **Enter**: Send message
- **Shift+Enter**: New line in message
- **Ctrl+N** (or **Cmd+N**): Start new chat
- **Ctrl+R** (or **Cmd+R**): Clear current chat

## Next Steps

1. ✅ Test the chat functionality thoroughly
2. ✅ Add chat session management UI
3. Consider adding message search capabilities
4. Implement message editing/deletion features
5. Consider adding message reactions or threading
6. Add export chat functionality
7. Implement chat session sharing