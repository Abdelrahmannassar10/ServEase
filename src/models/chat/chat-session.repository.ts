import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { HChatSessionDocument, ChatSession } from './chat-session.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatSessionRepository extends AbstractRepository<HChatSessionDocument> {
  constructor(@InjectModel(ChatSession.name) private readonly chatModel: Model<HChatSessionDocument>) {
    super(chatModel);
  }
}
