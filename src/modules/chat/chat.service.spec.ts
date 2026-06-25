import { BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  let service: ChatService;
  let configService: ConfigService;
  let chatSessionRepository: any;

  beforeEach(() => {
    configService = { get: jest.fn().mockReturnValue('https://chatbot.test/api') } as any;
    chatSessionRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      findOneAndUpdate: jest.fn(),
    };

    service = new ChatService(configService, chatSessionRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should send a message and persist chat session history', async () => {
    const session = {
      _id: 'abc123',
      sessionId: 'session-1',
      messages: [],
    };

    chatSessionRepository.findOne.mockResolvedValue(session);
    chatSessionRepository.findOneAndUpdate.mockResolvedValue({});

    const responsePayload = { data: { answer: 'Hello from bot' } };
    jest.spyOn(global, 'fetch' as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(responsePayload),
    });

    const result = await service.sendMessage('user-1', 'Hi there');

    expect(result.answer).toBe('Hello from bot');
    expect(result.sessionId).toBe('session-1');
    expect(chatSessionRepository.findOne).toHaveBeenCalledWith({ userId: 'user-1' });
    expect(chatSessionRepository.findOneAndUpdate).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should throw BadGatewayException on 4xx response without retrying', async () => {
    jest.spyOn(global, 'fetch' as any).mockResolvedValue({
      ok: false,
      status: 422,
      json: jest.fn().mockResolvedValue({ detail: 'Validation failed' }),
    });

    await expect(
      (service as any).callChatbotWithRetry({ message: 'test' }),
    ).rejects.toThrow(BadGatewayException);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
