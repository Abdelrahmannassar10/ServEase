import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSession, chatSessionSchema, ChatSessionRepository } from 'src/models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatSession.name, schema: chatSessionSchema },
    ]),
  ],
  providers: [ChatSessionRepository],
  exports: [ChatSessionRepository],
})
export class ChatSessionMongooseModule {}
