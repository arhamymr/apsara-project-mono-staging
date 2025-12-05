# LiveKit Backend API

Go backend service for LiveKit video conferencing integration.

## Quick Start

```bash
# Install dependencies
go mod tidy

# Set environment variables
cp .env.example .env
# Edit .env with your LiveKit credentials

# Run the server
pnpm dev
```

Server runs on `http://localhost:1323`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `LIVEKIT_API_KEY` | LiveKit API key |
| `LIVEKIT_API_SECRET` | LiveKit API secret |
| `LIVEKIT_URL` | LiveKit server URL (e.g., `wss://your-app.livekit.cloud`) |

## API Documentation

Access live documentation at: `GET /docs`

---

## Endpoints

### Health Check
```bash
GET /
```
Returns server status.

```bash
curl http://localhost:1323/
```

Response:
```json
{"status": "ok"}
```

---

### Generate Token
```bash
POST /livekit/token
```
Generate a JWT token for joining a LiveKit room.

Request:
```json
{
  "room": "my-room",
  "identity": "user-123",
  "name": "John Doe"
}
```

```bash
curl -X POST http://localhost:1323/livekit/token \
  -H "Content-Type: application/json" \
  -d '{"room": "my-room", "identity": "user-123", "name": "John Doe"}'
```

Response:
```json
{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

---

### Create Room
```bash
POST /livekit/rooms
```
Create a new LiveKit room.

Request:
```json
{
  "name": "my-room",
  "emptyTimeout": 300,
  "maxParticipants": 10
}
```

```bash
curl -X POST http://localhost:1323/livekit/rooms \
  -H "Content-Type: application/json" \
  -d '{"name": "my-room", "emptyTimeout": 300, "maxParticipants": 10}'
```

---

### List Rooms
```bash
GET /livekit/rooms
```
List all active rooms.

```bash
curl http://localhost:1323/livekit/rooms
```

---

### Delete Room
```bash
DELETE /livekit/rooms/:room
```
Delete a room by name.

```bash
curl -X DELETE http://localhost:1323/livekit/rooms/my-room
```

Response:
```json
{"status": "deleted"}
```

---

### List Participants
```bash
GET /livekit/rooms/:room/participants
```
List all participants in a room.

```bash
curl http://localhost:1323/livekit/rooms/my-room/participants
```

---

### Remove Participant
```bash
DELETE /livekit/rooms/:room/participants/:identity
```
Remove a participant from a room.

```bash
curl -X DELETE http://localhost:1323/livekit/rooms/my-room/participants/user-123
```

Response:
```json
{"status": "removed"}
```

---

### Mute Participant Track
```bash
POST /livekit/rooms/:room/participants/:identity/mute
```
Mute or unmute a participant's track.

Request:
```json
{
  "trackSid": "TR_xxxxx",
  "muted": true
}
```

```bash
curl -X POST http://localhost:1323/livekit/rooms/my-room/participants/user-123/mute \
  -H "Content-Type: application/json" \
  -d '{"trackSid": "TR_xxxxx", "muted": true}'
```

---

### Webhook
```bash
POST /livekit/webhook
```
Webhook endpoint for LiveKit events (room started, participant joined, etc.).

Configure this URL in your LiveKit dashboard.

---

## Project Structure

```
apps/backend/
├── server.go                    # Main entry point
├── internal/
│   ├── config/config.go         # Configuration loading
│   ├── handler/
│   │   ├── types.go             # Request/response types
│   │   ├── docs.go              # API documentation handler
│   │   ├── health.go            # Health check handler
│   │   ├── token.go             # Token generation
│   │   ├── room.go              # Room management
│   │   ├── participant.go       # Participant management
│   │   └── webhook.go           # Webhook handler
│   ├── livekit/client.go        # LiveKit client wrapper
│   └── router/router.go         # Route setup
├── go.mod
├── go.sum
└── package.json
```

## Frontend Integration

```typescript
// Example: Get token and join room
const response = await fetch('http://localhost:1323/livekit/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    room: 'my-room',
    identity: 'user-123',
    name: 'John Doe'
  })
});

const { token } = await response.json();

// Use token with LiveKit client SDK
import { Room } from 'livekit-client';

const room = new Room();
await room.connect('wss://your-app.livekit.cloud', token);
```
