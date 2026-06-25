# Frontend Chatbot Feature Plan

This plan covers all frontend changes required to integrate the new Socket.io-based chatbot feature with your NestJS backend.

## 1. Overview

- Use `socket.io-client` to connect to the backend namespace `/chat`.
- Send the logged-in user's JWT via `socket.auth.token` during connection.
- Frontend emits chat requests and receives responses in real time.
- The backend persists chat history per user and reuses a single session.

## 2. Required packages

Install:

```bash
pnpm add socket.io-client
# or npm install socket.io-client
```

## 3. Environment configuration

Add the frontend API base URL to your frontend environment config:

```env
VITE_API_URL=https://your-api.com
```

If you already have a `.env` file, add the above line.

## 4. Socket client helper

Create a singleton socket helper to avoid reconnecting multiple times from different components.

Example file: `src/lib/chatSocket.ts`

- Connect to `${VITE_API_URL}/chat`
- Pass the token as `auth: { token }`
- Use transport `websocket`
- Reuse the same socket instance across the app
- Provide a `disconnectChatSocket()` helper for logout cleanup

## 5. Chat hook

Create a reusable hook, e.g. `src/hooks/useChat.ts`, that:

- Accepts the JWT access token
- Connects the socket once
- Subscribes to events:
  - `chat:response`
  - `chat:history`
  - `chat:error`
- Emits initial `chat:history` request on mount
- Sends messages through `chat:message`
- Updates local UI state with user and assistant messages
- Tracks loading and error state
- Cleans up listeners on unmount

## 6. Chat message payload

Send the payload as:

```js
socket.emit('chat:message', { message: text });
```

Backend validation rules:

- `message` must be a string
- cannot be empty
- maximum length is 2000 characters

If validation fails, the backend will emit `chat:error`.

## 7. Chat UI component

Create a minimal chat UI component such as `ChatWidget` with:

- A scrollable message list
- User/assistant message bubbles
- Loading indicator while waiting for `chat:response`
- Error display if `chat:error` is received
- Input field with Enter-to-send and button send
- Disable send while waiting for a response

## 8. Authentication flow

- Use the same JWT token from login state.
- Do not send the token in query strings or headers; use Socket.io `auth`.
- Reconnect the socket only if the token is valid.
- On logout, call `disconnectChatSocket()`.

## 9. Frontend state & session behavior

- Do not manage session IDs in the frontend.
- The backend will automatically reuse the user’s single chat session.
- The frontend should only send messages and ask for history.

## 10. Error handling

Handle these responses:

- `chat:response` → update conversation with assistant answer
- `chat:history` → hydrate conversation history on load
- `chat:error` → show a clear error banner/message

Also handle socket connection errors gracefully:

- connection failure
- unauthorized token
- unexpected disconnect

## 11. Optional UX improvements

- Show a “typing…” indicator while waiting for a response
- Allow message retries on failure
- Auto-scroll chat list to the latest message
- Disable submission of empty/whitespace-only messages
- Enforce max message length in the input

## 12. Testing

Verify the feature with these checks:

- A logged-in customer/provider can connect and receive `chat:history`
- Sending `chat:message` returns `chat:response`
- Errors from `chat:error` display properly
- Logout disconnects the socket
- Invalid token connection is rejected by the backend

## 13. Example folder structure

```
src/
  lib/
    chatSocket.ts
  hooks/
    useChat.ts
  components/
    ChatWidget.tsx
```

## 14. Notes for backend compatibility

- Backend endpoint namespace: `/chat`
- Socket events:
  - `chat:message`
  - `chat:history`
  - `chat:response`
  - `chat:error`
- Auth method: JWT in `handshake.auth.token`
- Only `Role.CUSTOMER` and `Role.PROVIDER` are allowed
- Admins are blocked from chat

## 15. Deployment reminder

Set the backend env var `FRONTEND_URL` to your deployed frontend origin for production CORS.

Example:

```env
FRONTEND_URL=https://your-frontend-domain.com
```
