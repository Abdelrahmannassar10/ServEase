import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

@Schema()
export class BlacklistToken {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date; 
}

export const BlacklistTokenSchema = SchemaFactory.createForClass(BlacklistToken);
export type HTokenDocument = HydratedDocument<BlacklistToken>;