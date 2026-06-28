import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { Types } from 'mongoose';
import { ChatSessionRepository, ChatRole, ProviderRepository, ServiceRepository } from '@models/index';
import { ServiceRequestService } from '@modules/service-request/service-request.service';
import { City, state, PaymentMode, LocationScope } from '../../common/types/enum';

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
    private readonly serviceRequestService: ServiceRequestService,
    private readonly providerRepository: ProviderRepository,
    private readonly serviceRepository: ServiceRepository,
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
    const responseType: string | undefined = body?.data?.response_type;

    let bookingResult: { confirmation?: string; data?: any } | null = null;

    if (responseType === 'specific_action' || responseType === 'broadcast_action') {
      const messages = session.messages ?? [];
      bookingResult = await this.handleBookingAction(body.data, userId, message, messages).catch((err: any) => ({
        confirmation: `I couldn't process your booking: ${err.message ?? 'Something went wrong'}`,
      }));
    }

    const finalAnswer = bookingResult?.confirmation ?? answer;

    const now = new Date();

    const userMsg = { text: message, role: ChatRole.USER, timestamp: now } as any;
    const assistantMsg = { text: finalAnswer, role: ChatRole.ASSISTANT, timestamp: new Date() } as any;

    // atomic push with cap
    const updated = await this.chatSessionRepository.findOneAndUpdate(
      { _id: session._id },
      { $push: { messages: { $each: [userMsg, assistantMsg], $slice: -MESSAGE_CAP } } },
    );

    return {
      sessionId: session.sessionId,
      answer: finalAnswer,
      saved: !!updated,
      ...(bookingResult?.data ? { booking: bookingResult.data } : {}),
    };
  }

  private extractProviderName(messages: any[], currentMessage: string): string | null {
    const allTexts = [...messages.map((m: any) => m.text as string), currentMessage];

    for (const text of allTexts.reverse()) {
      const match = text.match(/\b(?:with|by|provider)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/);
      if (match) return match[1];
    }

    return null;
  }

  private normalizeChatbotData(raw: any) {
    return {
      response_type: raw.response_type,
      providerName: raw.provider_name ?? raw.providerName,
      serviceNeeded: raw.service_type ?? raw.serviceNeeded,
      governorate: raw.governorate,
      city: raw.city,
      street: raw.street,
      exactLocation: raw.exact_location ?? raw.exactLocation,
      dateNeeded: raw.preferred_date ?? raw.dateNeeded,
      startTime: raw.preferred_time ?? raw.startTime,
      paymentMode: raw.payment_mode ?? raw.paymentMode,
      preferredPrice: raw.preferred_price ?? raw.preferredPrice,
      locationScope: raw.search_scope ?? raw.locationScope,
      matchByTopRated: raw.matchByTopRated ?? false,
    };
  }

  private async handleBookingAction(data: any, userId: string, currentMessage: string, messages: any[]) {
    const d = this.normalizeChatbotData(data);

    if (d.response_type === 'specific_action') {
      let providerName: string | undefined = d.providerName;
      if (!providerName) {
        providerName = this.extractProviderName(messages, currentMessage) ?? undefined;
      }
      if (!providerName) {
        return { confirmation: 'No provider name was specified for this booking.' };
      }

      const provider = await this.providerRepository.findOne({
        $or: [
          { userName: { $regex: new RegExp(`^${providerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
          {
            $expr: {
              $eq: [
                { $trim: { input: { $toLower: { $concat: ['$firstName', ' ', '$lastName'] } } } },
                providerName.trim().toLowerCase(),
              ],
            },
          },
        ],
        isDeleted: { $ne: true },
      });

      if (!provider) {
        return { confirmation: `Sorry, I couldn't find a provider named "${providerName}". Please check the name and try again.` };
      }

      const dto = {
        providerId: provider._id.toString(),
        serviceNeeded: d.serviceNeeded,
        governorate: d.governorate as City,
        city: d.city as state,
        street: d.street,
        exactLocation: d.exactLocation,
        dateNeeded: new Date(d.dateNeeded),
        startTime: d.startTime,
        paymentMode: d.paymentMode?.toUpperCase() as PaymentMode | undefined,
        preferredPrice: d.preferredPrice != null ? Number(d.preferredPrice) : undefined,
      };

      const created = await this.serviceRequestService.create(dto as any, new Types.ObjectId(userId));

      return {
        confirmation: `Your service request has been sent to ${providerName}. They will review it and respond shortly.`,
        data: created,
      };
    }

    if (d.response_type === 'broadcast_action') {
      const serviceName: string = d.serviceNeeded;
      if (!serviceName) {
        return { confirmation: 'No service was specified for this broadcast request.' };
      }

      const service = await this.serviceRepository.findOne({
        name: { $regex: new RegExp(`^${serviceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      });

      if (!service) {
        return { confirmation: `Sorry, I couldn't find a service matching "${serviceName}". Please try again.` };
      }

      const broadcastDto = {
        serviceId: service._id.toString(),
        governorate: d.governorate as City,
        city: d.city as state,
        street: d.street,
        exactLocation: d.exactLocation,
        serviceNeeded: d.serviceNeeded,
        dateNeeded: new Date(d.dateNeeded),
        startTime: d.startTime,
        locationScope: (d.locationScope ?? 'DISTRICT') as LocationScope,
        matchByTopRated: d.matchByTopRated,
        paymentMode: (d.paymentMode ?? 'FIXED').toUpperCase() as PaymentMode,
        preferredPrice: d.preferredPrice != null ? Number(d.preferredPrice) : undefined,
      };

      const result = await this.serviceRequestService.createBroadcastRequest(broadcastDto as any, new Types.ObjectId(userId));

      return {
        confirmation: `Your service request has been broadcast to ${result.notifiedProviders} provider(s). You will receive offers soon.`,
        data: result.request,
      };
    }

    return null;
  }

  async getHistory(userId: string) {
    const session = await this.chatSessionRepository.findOne({ userId });
    return session?.messages ?? [];
  }
}
