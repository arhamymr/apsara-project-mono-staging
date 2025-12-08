import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Create a new vibe-coding session
export const createVibeCodeSession = mutation({
  args: { 
    title: v.optional(v.string()),
    initialMessage: v.string(),
  },
  handler: async (ctx, { title, initialMessage }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = Date.now();
    
    // Create the chat session
    const sessionId = await ctx.db.insert("chatSessions", {
      userId,
      title: title || (initialMessage.length > 50 ? initialMessage.substring(0, 47) + "..." : initialMessage),
      createdAt: now,
      updatedAt: now,
    });

    // Add the initial user message
    await ctx.db.insert("chatMessages", {
      sessionId,
      userId,
      role: "user",
      content: initialMessage,
      metadata: {
        appIntent: {
          type: 'vibe-coding',
          appId: 'vibe-coding',
          appName: 'Vibe Code Agent'
        }
      },
      createdAt: now,
    });

    return sessionId;
  },
});

// Process a vibe-coding message (simplified version)
export const processVibeCodeMessage = action({
  args: { 
    sessionId: v.id("chatSessions"), 
    userMessage: v.string(),
  },
  handler: async (ctx, { sessionId, userMessage }) => {
    try {
      // Add user message
      await ctx.runMutation(api.chat.addUserMessage, {
        sessionId,
        content: userMessage,
        metadata: {
          appIntent: {
            type: 'vibe-coding',
            appId: 'vibe-coding',
            appName: 'Vibe Code Agent'
          }
        }
      });

      // Placeholder response with sample application structure
      const assistantReply = `I'll help you build: "${userMessage}"

Here's a placeholder application structure:

\`\`\`
project/
├── src/
│   ├── index.html
│   ├── main.js
│   └── styles.css
├── package.json
└── README.md
\`\`\`

**Files Created:**

**index.html**
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <h1>Welcome to Your App</h1>
        <p>This is a placeholder. The actual vibe-coding functionality will be integrated soon.</p>
    </div>
    <script src="main.js"></script>
</body>
</html>
\`\`\`

**main.js**
\`\`\`javascript
console.log('App initialized');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
});
\`\`\`

**styles.css**
\`\`\`css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    background: #f5f5f5;
}

#app {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h1 {
    color: #333;
    margin-bottom: 1rem;
}
\`\`\`

**package.json**
\`\`\`json
{
  "name": "your-app",
  "version": "1.0.0",
  "description": "Placeholder application",
  "main": "src/main.js",
  "scripts": {
    "start": "serve src",
    "dev": "serve src"
  }
}
\`\`\`

This is a placeholder response. The actual vibe-coding backend will generate real, working applications based on your requirements.`;

      await ctx.runMutation(api.chat.addAssistantMessage, {
        sessionId,
        content: assistantReply,
      });

      return { success: true, response: assistantReply };
    } catch (error) {
      console.error('Vibe-coding processing error:', error);
      const errorMessage = 'Sorry, there was an error processing your vibe-coding request.';
      
      await ctx.runMutation(api.chat.addAssistantMessage, {
        sessionId,
        content: errorMessage,
      });

      return { success: false, response: errorMessage };
    }
  },
});

// Get vibe-coding sessions (filtered chat sessions)
export const getVibeCodeSessions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Get all sessions for the user
    const sessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Filter for vibe-coding sessions by checking if they have vibe-coding messages
    const vibeCodeSessions = [];
    
    for (const session of sessions) {
      const messages = await ctx.db
        .query("chatMessages")
        .withIndex("by_session", (q) => q.eq("sessionId", session._id))
        .first();
      
      if (messages?.metadata?.appIntent?.type === 'vibe-coding') {
        const messageCount = await ctx.db
          .query("chatMessages")
          .withIndex("by_session", (q) => q.eq("sessionId", session._id))
          .collect()
          .then(msgs => msgs.length);
          
        vibeCodeSessions.push({
          ...session,
          messageCount
        });
      }
    }

    return vibeCodeSessions;
  },
});

// Send a message in an existing vibe-coding session
export const sendVibeCodeMessage = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    content: v.string(),
  },
  handler: async (ctx, { sessionId, content }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user owns this session
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found or access denied");
    }

    // Add user message
    const messageId = await ctx.db.insert("chatMessages", {
      sessionId,
      userId,
      role: "user",
      content,
      metadata: {
        appIntent: {
          type: 'vibe-coding',
          appId: 'vibe-coding',
          appName: 'Vibe Code Agent'
        }
      },
      createdAt: Date.now(),
    });

    // Update session timestamp
    await ctx.db.patch(sessionId, { updatedAt: Date.now() });

    return messageId;
  },
});

// Create a dummy artifact for a session
export const createDummyArtifact = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    projectType: v.optional(v.string()),
  },
  handler: async (ctx, { sessionId, projectType = "react" }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user owns this session
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found or access denied");
    }

    const now = Date.now();

    // Create dummy files based on project type
    const dummyFiles: Record<string, unknown> = {
      "react": {
        "package.json": JSON.stringify({
          name: "my-react-app",
          version: "1.0.0",
          dependencies: {
            "react": "^18.2.0",
            "react-dom": "^18.2.0"
          },
          scripts: {
            "dev": "vite",
            "build": "vite build"
          }
        }, null, 2),
        "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>`,
        "src/main.jsx": `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
        "src/App.jsx": `import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Hello React!</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p>This is a dummy artifact for demonstration.</p>
    </div>
  )
}

export default App`,
        "src/App.css": `.App {
  text-align: center;
  padding: 2rem;
}

.card {
  padding: 2rem;
}

button {
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: #1a1a1a;
  color: white;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}`,
        "src/index.css": `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`,
        "README.md": `# My React App

This is a dummy artifact created for demonstration purposes.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

- React 18
- Vite for fast development
- Modern CSS
`
      },
      "html": {
        "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to My Website</h1>
        <p>This is a dummy artifact for demonstration.</p>
        <button onclick="handleClick()">Click Me</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
        "styles.css": `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  text-align: center;
  max-width: 500px;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
}

p {
  color: #666;
  margin-bottom: 2rem;
}

button {
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.05);
}`,
        "script.js": `function handleClick() {
  alert('Hello from the dummy artifact!');
  console.log('Button clicked');
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded successfully');
});`,
        "README.md": `# My Website

A simple HTML/CSS/JS website.

## Files

- index.html - Main HTML file
- styles.css - Styling
- script.js - JavaScript functionality
`
      }
    };

    const files = dummyFiles[projectType] || dummyFiles["html"];

    // Create the artifact
    const artifactId = await ctx.db.insert("artifacts", {
      sessionId,
      userId,
      name: `${projectType === "react" ? "React" : "HTML"} App`,
      description: `A dummy ${projectType} application for demonstration`,
      files: JSON.stringify(files),
      metadata: {
        framework: projectType === "react" ? "React" : "Vanilla",
        language: projectType === "react" ? "JavaScript" : "HTML/CSS/JS",
        dependencies: projectType === "react" ? ["react", "react-dom", "vite"] : [],
      },
      createdAt: now,
      updatedAt: now,
    });

    return artifactId;
  },
});

// Get artifacts for a session
export const getSessionArtifacts = query({
  args: { sessionId: v.id("chatSessions") },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Verify user owns this session
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) return [];

    const artifacts = await ctx.db
      .query("artifacts")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .order("desc")
      .collect();

    // Parse files JSON string back to object
    return artifacts.map(artifact => ({
      ...artifact,
      files: JSON.parse(artifact.files),
    }));
  },
});

// Get the latest artifact for a session
export const getLatestArtifact = query({
  args: { sessionId: v.id("chatSessions") },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Verify user owns this session
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) return null;

    const artifact = await ctx.db
      .query("artifacts")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .order("desc")
      .first();

    // Parse files JSON string back to object
    if (artifact) {
      return {
        ...artifact,
        files: JSON.parse(artifact.files),
      };
    }

    return null;
  },
});