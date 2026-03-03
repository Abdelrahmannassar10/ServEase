import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  categoryId: mongoose.Types.ObjectId;
}
export const serviceSchema = SchemaFactory.createForClass(Service);
export type HServiceDocument = mongoose.HydratedDocument<Service>;