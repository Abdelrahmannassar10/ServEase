import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Customer } from '../customer/customer.schema';
import { ServiceStatus } from '../../common/types/enum';
import { Provider } from '../provider/provider.schema';
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
})
export class ServiceRequest {
  readonly _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Customer.name, required: true })
  customerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Provider.name })
  providerId: Types.ObjectId;

  @Prop({ required: true })
  governorate: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  exactLocation: string;

  @Prop({ required: true })
  serviceNeeded: string;

  @Prop({ required: true })
  dateNeeded: Date;

  @Prop({ required: true })
  startTime: string;

  @Prop()
  endTime?: string;

  @Prop()
  price?: number;

  @Prop({ type: String, enum: ServiceStatus })
  status: ServiceStatus;
  @Prop({ type: String,default: null })
  completionCode?: string | null;
  @Prop({ default: false, type: Boolean })
  addedToProviderCalendar: boolean;

  @Prop({ type: Date })
  scheduledEndAt?: Date;

}
export const serviceRequestSchema =SchemaFactory.createForClass(ServiceRequest);
export type HServiceRequestDocument =HydratedDocument<ServiceRequest>;
