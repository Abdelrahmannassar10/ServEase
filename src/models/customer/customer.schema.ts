import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { City, Role, UserAgent } from '@common/types/enum';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
   toObject: { virtuals: true },
  discriminatorKey: 'role',
})
export class Customer {
  readonly _id: Types.ObjectId;

  firstName: string;
  lastName: string;
  userName: string;

  email: string;
  @Prop({
    type: String,
    required: function (this: Customer) {
      return this.userAgent === 'SYSTEM';
    },
  })
  mobileNumber: string;

  password: string;

  otp: string;

  otpExpiry: Date;

  isVerified: boolean;

  @Prop({
      type: String,
      required: function (this: Customer) {
        return this.userAgent === 'SYSTEM';
      },
    })
  state: string;

  @Prop({
    type: String,
    required: function (this: Customer) {
      return this.userAgent === 'SYSTEM';
    },
    enum: City,
  })
  city: City;

  dob: Date;
  userAgent: UserAgent;
  role: Role;
  age: number;
  changeCredentialTimestamp: Date;

  isDeleted: boolean;

  deletedAt: Date;

  profileURL: string;

  backgroundURL: string;
  @Prop({ type: String })
  googlePicture: string;
}
export const customerSchema = SchemaFactory.createForClass(Customer);
export type HCustomerDocument = HydratedDocument<Customer>;
