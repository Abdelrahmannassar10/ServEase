import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import {
  City,
  Gender,
  ProviderStatus,
  Role,
  state,
  UserAgent,
} from '@common/types/enum';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  discriminatorKey: 'role',
})
export class Provider {
  readonly _id: Types.ObjectId;

  firstName: string;
  lastName: string;
  userName: string;
  userAgent: UserAgent;

  email: string;

  @Prop({
    type: String,
    required: true,
  })
  mobileNumber: string;

  password: string;

  otp: string;

  otpExpiry: Date;

  isVerified: boolean;
  role: Role;

  @Prop({
    type: String,
    required: function (this: Provider) {
      return this.userAgent === 'SYSTEM';
    },
    enum: state,
  })
  state: state;

  @Prop({
    type: String,
    required: function (this: Provider) {
      return this.userAgent === 'SYSTEM';
    },
    enum: City,
  })
  city: City;

  @Prop({
    enum: Gender,
    required: function (this: Provider) {
      return this.userAgent === 'SYSTEM';
    },
    type: String,
  })
  gender: Gender;

  dob: Date;

  age: number;
  changeCredentialTimestamp: Date;

  isDeleted: boolean;

  deletedAt: Date;

  profileURL: string;

  backgroundURL: string;
  @Prop({ type: String })
  writtenCv: string;

  @Prop({ type: String, unique: true, required: true, match: /^\d{6,20}$/ })
  nationalNumber: string;

  @Prop({
    type: String,
    enum: ProviderStatus,
    default: ProviderStatus.PendingApproval,
  })
  adminApproved: ProviderStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true })
  service: mongoose.Types.ObjectId;

  @Prop({ type: String })
  specialization: string;

  @Prop({ type: String })
  cvUrl: string;

  @Prop({ default: 0, min: 0 })
  providerCancelCount: number;

  @Prop({ default: 0, min: 0 })
  providerCancelFees: number;

  @Prop({ type: Number, default: 0, min: 0 })
  debt: number;

  @Prop({ type: Number, default: 0, min: 0, max: 5 })
  averageRating: number;

  @Prop({ type: Number, default: 0, min: 0 })
  reviewsCount: number;
}
export const providerSchema = SchemaFactory.createForClass(Provider);
export type HProviderDocument = HydratedDocument<Provider>;
