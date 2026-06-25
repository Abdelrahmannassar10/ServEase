import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
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
  userId: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  sessionId: string;

  @Prop({ type: [ChatMessage], default: [] })
  messages: ChatMessage[];
}

export const chatSessionSchema = SchemaFactory.createForClass(ChatSession);
export type HChatSessionDocument = HydratedDocument<ChatSession>;
