# Vibe Coding Feature - Data Flow Documentation

## Overview

The Vibe Coding feature is an AI-powered code generation tool that allows users to chat with an AI agent to build web applications. It uses a streaming architecture to provide real-time feedback during code generation.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐         ┌─────────────────────────────────────┐   │
│  │   VibeCodeRoot      │         │        VibeCodeEditor               │   │
│  │   (index.tsx)       │────────▶│        (editor.tsx)                 │   │
│  │                     │         │                                     │   │
│  │  • Welcome screen   │         │  ┌─────────────┐ ┌───────────────┐  │   │
│  │  • Session list     │         │  │ ChatPanel   │ │  CodePanel    │  │   │
│  │  • Quick prompts    │         │  │             │ │               │  │   │
│  └─────────────────────┘         │  │ • Messages  │ │ • File tree   │  │   │
│                                  │  │ • Input     │ │ • Editor      │  │   │
│                                  │  │ • Streaming │ │ • Preview     │  │   │
│                                  │  └─────────────┘ └───────────────┘  │   │
│                                  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              HOOKS LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │ useVibeCodeConvex│  │ useVibeEditorConvex│ │ useArtifactsConvex      │  │
│  │ (use-vibe-code)  │  │ (use-vibe-editor)│  │ (use-artifacts)         │  │
│  │                  │  │                  │  │                          │  │
│  │ • Create session │  │ • Send messages  │  │ • File tree building     │  │
│  │ • List sessions  │  │ • Stream handling│  │ • File selection         │  │
│  │ • Session select │  │ • State mgmt     │  │ • Artifact queries       │  │
│  └──────────────────┘  └────────┬─────────┘  └──────────────────────────┘  │
│                                 │                                           │
│                                 ▼                                           │
│                    ┌──────────────────────┐                                 │
│                    │  useStreamHandler    │                                 │
│                    │  (use-stream-handler)│                                 │
│                    │                      │                                 │
│                    │  • SSE parsing       │                                 │
│                    │  • Stream callbacks  │                                 │
│                    │  • Abort handling    │                                 │
│                    └──────────┬───────────┘                                 │
│                               │                                             │
└───────────────────────────────┼─────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           UTILITIES LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    stream-parser.ts                                  │   │
│  │                                                                      │   │
│  │  • parseSSEBuffer()    - Parse SSE buffer into lines                │   │
│  │  • parseSSELine()      - Parse single SSE line to StreamPart        │   │
│  │  • processStreamPart() - Process stream events and update state     │   │
│  │  • createStreamState() - Initialize stream state                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    stream-types.ts                                   │   │
│  │                                                                      │   │
│  │  StreamPart types: text-delta, tool-call, tool-call-delta,          │   │
│  │                    reasoning-delta, tool-result, error, done        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                ▼                               ▼
┌───────────────────────────────┐  ┌───────────────────────────────────────┐
│      CODING AGENT API         │  │           CONVEX BACKEND              │
│  (External Mastra Service)    │  │         (vibeCoding.ts)               │
├───────────────────────────────┤  ├───────────────────────────────────────┤
│                               │  │                                       │
│  POST /coding-agent/stream    │  │  Mutations:                           │
│                               │  │  • createVibeCodeSession              │
│  SSE Response Events:         │  │  • sendVibeCodeMessage                │
│  • start                      │  │  • saveGeneratedArtifact              │
│  • step-start                 │  │                                       │
│  • reasoning-delta            │  │  Queries:                             │
│  • text-delta                 │  │  • getVibeCodeSessions                │
│  • tool-call                  │  │  • getSessionArtifacts                │
│  • tool-result                │  │  • getLatestArtifact                  │
│  • step-finish                │  │                                       │
│  • finish                     │  │  Tables:                              │
│  • error                      │  │  • chatSessions                       │
│                               │  │  • chatMessages                       │
│                               │  │  • artifacts                          │
└───────────────────────────────┘  └───────────────────────────────────────┘
```

## Data Flow Sequences

### 1. Starting a New Chat Session

```
User Input → VibeCodeRoot → useVibeCodeConvex.handleStartChat()
                                    │
                                    ▼
                    Convex: createVibeCodeSession()
                    • Creates chatSession record
                    • Saves initial user message
                    • Returns sessionId
                                    │
                                    ▼
                    openSubWindow() → VibeCodeEditor
                                    │
                                    ▼
                    useVibeEditorConvex (initialMessage)
                    • Auto-triggers streamFromAgent()
```

### 2. Message Streaming Flow

```
User sends message
        │
        ▼
useVibeEditorConvex.handleSendMessage()
        │
        ├──▶ Convex: sendVibeCodeMessage() (save user message)
        │
        ▼
useStreamHandler.streamFromAgent()
        │
        ▼
fetch(CODING_AGENT_API_URL) ──────────────────────────────────────┐
        │                                                          │
        ▼                                                          │
SSE Stream Reader                                                  │
        │                                                          │
        ▼                                                          │
parseSSEBuffer() → parseSSELine() → processStreamPart()           │
        │                                                          │
        ├── text-delta ──────▶ onTextDelta() → streamingContent   │
        ├── reasoning-delta ─▶ onReasoning() → reasoningContent   │
        ├── tool-call ───────▶ onToolCall() → currentToolCall     │
        ├── tool-result ─────▶ onFileCreated() → createdFiles     │
        └── error ───────────▶ Error handling                      │
                                                                   │
Stream Complete ◀──────────────────────────────────────────────────┘
        │
        ▼
Save Results to Convex:
├── addAssistantMessage() (save AI response)
└── saveGeneratedArtifact() (save generated files)
```

### 3. Artifact Display Flow

```
useArtifactsConvex(sessionId)
        │
        ├──▶ Query: getLatestArtifact()
        │           Returns: { files: Record<string, string>, ... }
        │
        ├──▶ Query: getSessionArtifacts()
        │           Returns: Artifact[]
        │
        ▼
Build File Tree (useMemo)
        │
        ├── Parse file paths
        ├── Create folder structure
        └── Sort: folders first, then files
        │
        ▼
CodePanel
├── File Explorer (fileTree)
├── Code Editor (fileContent)
└── Live Preview (files → LivePreview component)
```

### 4. Live Preview Rendering

```
CodePanel (activeTab === 'preview')
        │
        ▼
LivePreview component
        │
        ├── React framework? ──▶ ReactPreviewWrapper
        │                        • Sandpack integration
        │                        • Hot module replacement
        │
        └── Vanilla HTML/JS? ──▶ VanillaPreview
                                 • iframe rendering
                                 • CSS/JS injection
                                 • Console interception
```

## State Management

### Component State

| Hook | State Variables | Purpose |
|------|-----------------|---------|
| `useVibeCodeConvex` | `welcomeInput`, `currentSessionId`, `isStarting` | Welcome screen state |
| `useVibeEditorConvex` | `inputMessage`, `isStreaming`, `streamingContent`, `reasoningContent`, `currentToolCall`, `createdFiles` | Editor & streaming state |
| `useArtifactsConvex` | `selectedFile`, `prevArtifactId` | File selection state |
| `useStreamHandler` | `abortControllerRef` | Stream cancellation |

### Convex Reactive Queries

| Query | Trigger | Data |
|-------|---------|------|
| `getVibeCodeSessions` | On mount | List of user's vibe-coding sessions |
| `getChatMessages` | sessionId change | Messages for current session |
| `getLatestArtifact` | sessionId change | Most recent generated artifact |
| `getSessionArtifacts` | sessionId change | All artifacts for session |

## Stream Event Types

| Event Type | Payload | Handler Action |
|------------|---------|----------------|
| `text-delta` | `{ textDelta: string }` | Append to assistant content |
| `reasoning-delta` | `{ text?: string, providerMetadata? }` | Update reasoning display |
| `tool-call` | `{ toolName, args }` | Show tool being called |
| `tool-call-delta` | `{ toolCallId, argsTextDelta }` | Stream tool arguments |
| `tool-result` | `{ success, filePath, content }` | Add file to generated files |
| `error` | `{ error: string }` | Display error message |
| `done` | - | Stream complete |

## Key Files Reference

| File | Responsibility |
|------|----------------|
| `index.tsx` | Entry point, welcome screen, session management |
| `editor.tsx` | Main editor layout, orchestrates panels |
| `hooks/use-vibe-code.ts` | Session creation and listing |
| `hooks/use-vibe-editor.ts` | Message handling, streaming orchestration |
| `hooks/use-stream-handler.ts` | Low-level SSE stream handling |
| `hooks/use-artifacts.ts` | Artifact queries, file tree building |
| `utils/stream-parser.ts` | SSE parsing utilities |
| `types/stream-types.ts` | TypeScript types for stream events |
| `convex/vibeCoding.ts` | Backend mutations and queries |
| `components/live-preview.tsx` | Code preview rendering |
