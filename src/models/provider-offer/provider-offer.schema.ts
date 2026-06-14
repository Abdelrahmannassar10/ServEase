import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OfferStatus } from '../../common/types/enum';
import { ServiceRequest } from '../service-request/service-request.schema';
import { Provider } from '../provider/provider.schema';

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class ProviderOffer {
  readonly _id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: ServiceRequest.name,
    required: true,
  })
  serviceRequestId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Provider.name,
    required: true,
  })
  providerId: Types.ObjectId;

  @Prop({ type: String, enum: OfferStatus, default: OfferStatus.PENDING })
  status: OfferStatus;

  @Prop({ type: Number, default: null })
  offeredPrice?: number;

  @Prop({ type: String, default: null })
  offeredEndTime?: string;

  @Prop({ type: Date, default: null })
  respondedAt?: Date;
}

export const providerOfferSchema = SchemaFactory.createForClass(ProviderOffer);
export type HProviderOfferDocument = HydratedDocument<ProviderOffer>;
