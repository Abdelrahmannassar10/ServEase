# Chatbot Feature Plan — Real-Time via Socket.io

> This plan is based on an actual review of your project (NestJS + Mongoose) after extracting `src.rar`, matched against the real chatbot API (`POST /chat` on `https://menaabdelbasset-chatbot-2.hf.space/chat`).

**Decisions confirmed for this version:**
- Frontend: **React**
- Chatbot API endpoint: `https://menaabdelbasset-chatbot-2.hf.space/chat`
- Sessions: **one active session per user** (decided below, section 2)
- Retry on chatbot API failure: **yes**, with exponential backoff

---

## 1. Technical decision: Socket.io, not plain REST

**Socket.io is the right call here**, for these reasons:

| Criteria | REST (HTTP) | Socket.io |
|---|---|---|
| Instant response to the user | Needs polling or a fresh request per message | Persistent connection, instant push |
| Performance cost (handshake) | New TCP/TLS connection per message | One connection kept open for the whole session |
| Notifying both sides (e.g. typing/streaming) | Awkward to implement | Built-in pattern |
| Fit with the rest of your project | Whole project is REST controllers | Added as a separate module, no conflicts |

Important: **your backend does not talk to the chatbot over a socket.** The chatbot API itself is plain REST (`fetch`). Socket.io sits **only between the frontend and your NestJS backend**; your backend proxies the request to the chatbot via `fetch` — exactly the same pattern you already use in `payment.service.ts` for Paymob.

```
Frontend  <—— Socket.io (real-time) ——>  Your NestJS Backend  <—— HTTP fetch ——>  Chatbot API (HF Space)
```

---

## 2. Roles & sessions — decisions

**Roles allowed:** `Role.CUSTOMER`, `Role.PROVIDER`
**Roles blocked:** `Role.ADMIN`

We enforce this the same way your existing `RolesGuard` + `@Roles()` work, but in a WebSocket-compatible version (`WsRolesGuard`), since the HTTP `RolesGuard` is built on `context.switchToHttp()` and doesn't work directly with sockets.

**Sessions — decision:** one active session per user, managed automatically by the backend.

Reasoning: a support/info chatbot like this one almost always maps to "continue my one ongoing conversation," not multiple parallel threads per user. So:
- When the frontend connects/sends a message **without** a `sessionId`, the backend looks up (or creates) that user's single open `ChatSession` and uses it.
- The schema still stores a `sessionId` field per session (not hardcoded to the user), so if you ever want multiple sessions per user (e.g. "new conversation" button) later, it's a small addition — add a `startNewSession` event and stop auto-reusing the old one. No migration needed.

---

## 3. Connection security with JWT

The frontend sends the JWT (the access token from login) with the socket connection itself, not as a normal header:

```js
// Frontend
const socket = io('https://your-api.com/chat', {
  auth: { token: accessToken },
});
```

The backend uses a `WsJwtGuard` that reuses the same logic as your existing `JwtStrategy` (token validation, blacklist check, password-change invalidation) but applied to `handshake.auth.token` instead of the `Authorization` header.

---

## 4. CORS

Since the real frontend domain wasn't provided yet, the gateway reads the allowed origin from an env var so you can lock it down without touching code:

```ts
@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: process.env.FRONTEND_URL || '*' },
})
```

Set `FRONTEND_URL=https://your-real-frontend-domain.com` in `.env` once you have it (dev can keep `*`).

---

## 5. New backend files

Following your existing structure (`@modules`, `@models`, `@common`, `@shared`):

```
src/
├── models/
│   └── chat/
│       ├── chat-session.schema.ts      # one document per user's chat session
│       ├── chat-session.repository.ts  # extends AbstractRepository
│       └── index.ts
│
├── modules/
│   └── chat/
│       ├── chat.module.ts
│       ├── chat.gateway.ts             # the Socket.io Gateway
│       ├── chat.service.ts             # talks to the chatbot API + persists messages
│       └── dto/
│           └── send-message.dto.ts
│
└── common/
    ├── guard/
    │   └── ws-roles.guard.ts           # WS version of RolesGuard
    └── strategy/
        └── ws-jwt.guard.ts             # authenticates the socket via JWT
```

### 5.1 Schema (`chat-session.schema.ts`)

```ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum ChatRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

@Schema({ _id: false })
export class ChatMessage {
  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: String, enum: ChatRole, required: true })
  role: ChatRole;

  @Prop({ type: Date, required: true, default: Date.now })
  timestamp: Date;
}

@Schema({ timestamps: true })
export class ChatSession {
  readonly _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId; // unique -> enforces "one active session per user"

  @Prop({ type: String, required: true, unique: true })
  sessionId: string; // same session_id sent to the chatbot API

  @Prop({ type: [ChatMessage], default: [] })
  messages: ChatMessage[];
}

export const chatSessionSchema = SchemaFactory.createForClass(ChatSession);
```

> Important detail from your own testing of the API: the `role` value the chatbot accepts is exactly `"user"` or `"assistant"` (the `422` you hit earlier was caused by `"usr"`). We store these exact values in the DB so no extra mapping is needed when forwarding `chat_history`.

### 5.2 Gateway (`chat.gateway.ts`)

```ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { WsJwtGuard, WsRolesGuard } from '@common/guard';
import { Roles } from '@common/decorators';
import { Role } from '@common/types/enum';

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: process.env.FRONTEND_URL || '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    // Auth happens per-event via WsJwtGuard; nothing required here.
  }

  handleDisconnect(client: Socket) {
    // Optional cleanup.
  }

  @UseGuards(WsJwtGuard, WsRolesGuard)
  @Roles(Role.CUSTOMER, Role.PROVIDER)
  @SubscribeMessage('chat:message')
  async onMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { message: string },
  ) {
    const user = client.data.user; // set by WsJwtGuard
    try {
      const result = await this.chatService.sendMessage(user._id, data.message);
      client.emit('chat:response', result);
    } catch (err: any) {
      client.emit('chat:error', { message: err.message ?? 'Chatbot is unavailable, please try again.' });
    }
  }

  @UseGuards(WsJwtGuard, WsRolesGuard)
  @Roles(Role.CUSTOMER, Role.PROVIDER)
  @SubscribeMessage('chat:history')
  async onGetHistory(@ConnectedSocket() client: Socket) {
    const history = await this.chatService.getHistory(client.data.user._id);
    client.emit('chat:history', history);
  }
}
```

### 5.3 Service (`chat.service.ts`) — talking to the chatbot API, with retry

```ts
import { Injectable, BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { ChatSessionRepository } from '@models/chat/chat-session.repository';
import { ChatRole } from '@models/chat/chat-session.schema';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class ChatService {
  private readonly chatbotUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly chatSessionRepository: ChatSessionRepository,
  ) {
    this.chatbotUrl = this.configService.get<string>('CHATBOT_API_URL')!;
  }

  /**
   * Calls the chatbot API with retry + exponential backoff.
   * Retries only on network errors or 5xx (transient failures).
   * Does NOT retry on 4xx (e.g. 422 validation errors) — those are our bug, not a transient failure.
   */
  private async callChatbotWithRetry(payload: Record<string, any>) {
    let lastError: any;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(this.chatbotUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', accept: 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.status >= 500) {
          throw new Error(`Chatbot API returned ${response.status}`);
        }

        if (!response.ok) {
          // 4xx: don't retry, surface immediately
          const errBody = await response.json().catch(() => null);
          throw new BadGatewayException(errBody?.detail ?? 'Chatbot request was rejected');
        }

        return await response.json();
      } catch (err: any) {
        lastError = err;
        if (err instanceof BadGatewayException) throw err; // no retry for 4xx
        if (attempt < MAX_RETRIES) {
          await sleep(BASE_DELAY_MS * 2 ** attempt); // 500ms, 1s, 2s
          continue;
        }
      }
    }

    throw new BadGatewayException('Chatbot service is currently unavailable. Please try again shortly.');
  }

  async sendMessage(userId: string, message: string) {
    let session = await this.chatSessionRepository.findOne({ userId });

    if (!session) {
      session = await this.chatSessionRepository.create({
        userId,
        sessionId: randomUUID(),
        messages: [],
      });
    }

    const body = await this.callChatbotWithRetry({
      session_id: session.sessionId,
      message,
      chat_history: session.messages.map((m) => ({
        text: m.text,
        role: m.role, // already 'user' | 'assistant'
        timestamp: m.timestamp,
      })),
    });

    const answer: string = body?.data?.answer ?? '';

    const now = new Date();
    session.messages.push(
      { text: message, role: ChatRole.USER, timestamp: now },
      { text: answer, role: ChatRole.ASSISTANT, timestamp: new Date() },
    );
    await this.chatSessionRepository.updateById(session._id, {
      messages: session.messages,
    });

    return { sessionId: session.sessionId, answer };
  }

  async getHistory(userId: string) {
    const session = await this.chatSessionRepository.findOne({ userId });
    return session?.messages ?? [];
  }
}
```

### 5.4 `WsJwtGuard` (`ws-jwt.guard.ts`)

```ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from '@models/token/token.repository';
import { UserRepository } from '@models/index';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake?.auth?.token;
    if (!token) throw new UnauthorizedException('No token provided');

    const isBlacklisted = await this.tokenRepository.isBlacklisted(token);
    if (isBlacklisted) throw new UnauthorizedException('Token is blacklisted');

    const payload = this.jwtService.verify(token);
    const user = await this.userRepository.findById(payload._id);
    if (
      user?.changeCredentialTimestamp &&
      payload.iat * 1000 < user.changeCredentialTimestamp.getTime()
    ) {
      throw new UnauthorizedException('Token is invalid due to credential change');
    }

    client.data.user = { _id: payload._id, role: payload.role, email: payload.email };
    return true;
  }
}
```

### 5.5 `WsRolesGuard` (`ws-roles.guard.ts`)

```ts
import { Role } from '@common/types/enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class WsRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) return true;
    const client = context.switchToWs().getClient();
    return roles.includes(client.data.user?.role);
  }
}
```

---

## 6. Module (`chat.module.ts`)

```ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatSessionMongooseModule } from '@shared/modules'; // add this, same pattern as UserMongooseModule

@Module({
  imports: [
    ChatSessionMongooseModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ secret: config.get('JWT_SECRET') }),
    }),
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
```

Add `ChatModule` to the `imports[]` array in `app.module.ts`.

---

## 7. New environment variables

`.env`:
```
CHATBOT_API_URL=https://menaabdelbasset-chatbot-2.hf.space/chat
FRONTEND_URL=https://your-real-frontend-domain.com   # set once known; '*' works for local dev
```

`dev.config.ts`:
```ts
CHATBOT_API_URL: process.env.CHATBOT_API_URL,
FRONTEND_URL: process.env.FRONTEND_URL,
```

---

## 8. Required packages (backend)

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```
(`@nestjs/jwt` is likely already installed with your `AuthModule` — if not: `npm install @nestjs/jwt`)

---

## 9. Frontend (React)

### 9.1 Package
```bash
npm install socket.io-client
```

### 9.2 Singleton socket connection

```ts
// chatSocket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getChatSocket(token: string): Socket {
  if (!socket) {
    socket = io(`${import.meta.env.VITE_API_URL}/chat`, {
      auth: { token },
      transports: ['websocket'],
    });
  }
  return socket;
}

export function disconnectChatSocket() {
  socket?.disconnect();
  socket = null;
}
```

### 9.3 `useChat` hook

```tsx
// useChat.ts
import { useEffect, useRef, useState } from 'react';
import { getChatSocket } from './chatSocket';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export function useChat(token: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef(getChatSocket(token));

  useEffect(() => {
    const socket = socketRef.current;

    socket.on('chat:response', ({ answer }: { answer: string }) => {
      setMessages((prev) => [...prev, { role: 'assistant', text: answer }]);
      setLoading(false);
    });

    socket.on('chat:history', (history: ChatMessage[]) => setMessages(history));

    socket.on('chat:error', ({ message }: { message: string }) => {
      setError(message);
      setLoading(false);
    });

    socket.emit('chat:history');

    return () => {
      socket.off('chat:response');
      socket.off('chat:history');
      socket.off('chat:error');
    };
  }, []);

  const sendMessage = (text: string) => {
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);
    setError(null);
    socketRef.current.emit('chat:message', { message: text });
  };

  return { messages, sendMessage, loading, error };
}
```

### 9.4 Minimal chat component

```tsx
// ChatWidget.tsx
import { useState } from 'react';
import { useChat } from './useChat';

export function ChatWidget({ token }: { token: string }) {
  const { messages, sendMessage, loading, error } = useChat(token);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="chat-widget">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}`}>{m.text}</div>
        ))}
        {loading && <div className="chat-bubble assistant typing">…</div>}
        {error && <div className="chat-error">{error}</div>}
      </div>
      <div className="chat-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} disabled={loading}>Send</button>
      </div>
    </div>
  );
}
```

---

## 10. End-to-end message flow

1. The user (Customer/Provider) types a message in the React widget.
2. Frontend emits `chat:message` over the socket.
3. `WsJwtGuard` validates the token; `WsRolesGuard` rejects Admin.
4. `ChatGateway` calls `ChatService.sendMessage`.
5. `ChatService` fetches/creates the user's single `ChatSession`, builds `chat_history`, and calls the chatbot API via `fetch` — retrying up to 3 times with backoff on network errors or 5xx.
6. The answer is saved to MongoDB and pushed back via `client.emit('chat:response', ...)`. On unrecoverable failure, `chat:error` is emitted instead so the UI can show a clear message instead of hanging.

---

## 11. Implementation checklist

- [ ] Install packages (`@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`, `socket.io-client`)
- [ ] Add `CHATBOT_API_URL` and `FRONTEND_URL` to `.env` and `dev.config.ts`
- [ ] Create `ChatSession` schema + repository + `ChatSessionMongooseModule`
- [ ] Create `WsJwtGuard` and `WsRolesGuard`
- [ ] Create `ChatService` (chatbot API call with retry + persistence)
- [ ] Create `ChatGateway` (`chat:message`, `chat:history`)
- [ ] Create `ChatModule` and register it in `app.module.ts`
- [ ] Frontend: `chatSocket.ts` + `useChat` hook + `ChatWidget` component
- [ ] Verify Customer/Provider can connect and chat; Admin is rejected
- [ ] Verify retry behavior: simulate a 500/timeout from the chatbot API and confirm 3 retries with backoff before `chat:error` is emitted
- [ ] Verify a 422 from the chatbot API is surfaced immediately, without retrying
- [ ] Set the real `FRONTEND_URL` once known, replacing the dev `*` CORS origin
