import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { City, Role, ServiceCategory, UserAgent } from '@common/types/enum';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  discriminatorKey: 'role',
})
export class Provider {
  readonly _id: Types.ObjectId;

  firstName: string;
  lastName: string;
  userName: string;

  email: string;
  @Prop({ type: String, required: true, unique: true })
  mobileNumber: string;

  password: string;

  otp: string;

  otpExpiry: Date;

  isVerified: boolean;
  role: Role;
  @Prop({ type: String, required: true })
  state: string;
  @Prop({ type: String, required: true, enum: City })
  city: City;

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

  @Prop({ type: Boolean, default: false })
  adminApproved: boolean;

  @Prop({ type: String, enum: ServiceCategory })
  service: ServiceCategory;

  @Prop({ type: String })
  specialization: string;

  @Prop({ type: String })
  cvUrl: string;
}
export const providerSchema = SchemaFactory.createForClass(Provider);
export type HProviderDocument = HydratedDocument<Provider>;
