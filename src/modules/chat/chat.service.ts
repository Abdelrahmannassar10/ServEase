import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { ChatSessionRepository, ChatRole } from '@models/index';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;
const MESSAGE_CAP = 200; // keep last N messages to avoid unbounded growth

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

@Injectable()
export class ChatService {
  private readonly chatbotUrl: string;
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly chatSessionRepository: ChatSessionRepository,
  ) {
    this.chatbotUrl = this.configService.get<string>('CHATBOT_API_URL')!;
  }

  private async callChatbotWithRetry(payload: Record<string, any>) {
    let lastError: any;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10_000);

        const response = await fetch(this.chatbotUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', accept: 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal as any,
        });

        clearTimeout(timeout);

        if (response.status >= 500) {
          throw new Error(`Chatbot API returned ${response.status}`);
        }

        const body = await response.json().catch(() => null);

        if (!response.ok) {
          // 4xx: don't retry
          throw new BadGatewayException(body ?? 'Chatbot request was rejected');
        }

        return body;
      } catch (err: any) {
        lastError = err;
        // do not retry on client errors
        if (err instanceof BadGatewayException) throw err;

        if (attempt < MAX_RETRIES) {
          // add jitter
          const backoff = BASE_DELAY_MS * 2 ** attempt;
          const jitter = Math.floor(Math.random() * 100);
          await sleep(backoff + jitter);
          continue;
        }
      }
    }

    this.logger.error('Chatbot unavailable', lastError);
    throw new BadGatewayException('Chatbot service is currently unavailable. Please try again shortly.');
  }

  async sendMessage(userId: string, message: string) {
    let session = await this.chatSessionRepository.findOne({ userId });

    if (!session) {
      try {
        session = await this.chatSessionRepository.create({
          userId,
          sessionId: randomUUID(),
          messages: [],
        } as any);
      } catch (err: any) {
        // possible duplicate-key if concurrent create — re-read
        if (err?.code === 11000) {
          session = await this.chatSessionRepository.findOne({ userId });
        } else {
          throw err;
        }
      }
    }

    if (!session) {
      throw new Error('Unable to create or retrieve chat session');
    }

    const body = await this.callChatbotWithRetry({
      session_id: session.sessionId,
      message,
      chat_history: session.messages.map((m: any) => ({ text: m.text, role: m.role, timestamp: m.timestamp })),
    });

    const answer: string = body?.data?.answer ?? '';

    const now = new Date();

    const userMsg = { text: message, role: ChatRole.USER, timestamp: now } as any;
    const assistantMsg = { text: answer, role: ChatRole.ASSISTANT, timestamp: new Date() } as any;

    // atomic push with cap
    const updated = await this.chatSessionRepository.findOneAndUpdate(
      { _id: session._id },
      { $push: { messages: { $each: [userMsg, assistantMsg], $slice: -MESSAGE_CAP } } },
    );

    return { sessionId: session.sessionId, answer, saved: !!updated };
  }

  async getHistory(userId: string) {
    const session = await this.chatSessionRepository.findOne({ userId });
    return session?.messages ?? [];
  }
}
