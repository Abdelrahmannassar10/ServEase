import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class GeneralSetting {
  readonly _id: string;

  @Prop({ type: Number, required: true, default: 10, min: 0, max: 100 })
  webCommission: number;

  @Prop({ type: Number, required: true, default: 0, min: 0 })
  providerDebt: number;

  @Prop({ type: Number, required: true, default: 0, min: 0 })
  providerCancelFee: number;

  @Prop({ type: Number, required: true, default: 0, min: 0 })
  providerCancelCount: number;

  @Prop({ type: Number, required: true, default: 0, min: 0 })
  revenue: number;
}

export const generalSettingSchema =
  SchemaFactory.createForClass(GeneralSetting);
export type GeneralSettingDocument = HydratedDocument<GeneralSetting>;
