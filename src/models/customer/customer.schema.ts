import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { City, Gender, Role, state, UserAgent } from '@common/types/enum';

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
    enum:state
  })
  state: state;
  
  @Prop({
    type: String,
    required: function (this: Customer) {
      return this.userAgent === 'SYSTEM';
    },
    enum: City,
  })
  city: City;

    @Prop({
      enum: Gender,
      required: function (this: Customer) {
        return this.userAgent === 'SYSTEM';
      },
      type: String,
    })
    gender: Gender;

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
