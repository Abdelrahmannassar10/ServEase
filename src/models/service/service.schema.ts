import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Service {
  readonly _id: mongoose.Types.ObjectId;
  @Prop({ required: true })
  name: string;

  @Prop({ type: String })
  icon_text?: string;
}
export const serviceSchema = SchemaFactory.createForClass(Service);
export type HServiceDocument = mongoose.HydratedDocument<Service>;
