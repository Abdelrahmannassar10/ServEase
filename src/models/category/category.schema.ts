import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    default: [],
  })
  services: mongoose.Types.ObjectId[];
}
export const categorySchema = SchemaFactory.createForClass(Category);
export type HCategoryDocument = mongoose.HydratedDocument<Category>;