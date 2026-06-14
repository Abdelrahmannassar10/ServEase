import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Customer } from '../customer/customer.schema';
import {
  City,
  LocationScope,
  PaymentMode,
  RequestType,
  ServiceStatus,
  state,
} from '../../common/types/enum';
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

  @Prop({ type: String, required: true, enum: City })
  governorate: City;

  @Prop({ type: String, required: true, enum: state })
  city: state;

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

  // ── Broadcast fields ─────────────────────────────────────────────────────────

  @Prop({ type: String, enum: RequestType, default: RequestType.DIRECT })
  requestType: RequestType;

  @Prop({ type: String, enum: LocationScope, default: null })
  locationScope?: LocationScope;

  @Prop({ type: Boolean, default: false })
  matchByTopRated: boolean;

  @Prop({ type: String, enum: PaymentMode, default: PaymentMode.FIXED })
  paymentMode: PaymentMode;

  @Prop({ type: Number, default: null })
  preferredPrice?: number;

  @Prop({ type: Number, default: null })
  hoursWorked?: number;
}
export const serviceRequestSchema =SchemaFactory.createForClass(ServiceRequest);
export type HServiceRequestDocument =HydratedDocument<ServiceRequest>;
