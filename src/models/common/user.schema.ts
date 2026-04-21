import { City, Role, UserAgent } from '@common/types/enum';
import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
   toObject: { virtuals: true },
  discriminatorKey: 'role',
})
export class User {
  readonly _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  firstName: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Virtual({
    get(this: User) {
      return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
    },
    set(this: User, value: string) {
      const parts = value.trim().split(' ');
      this.firstName = parts[0];
      this.lastName = parts.slice(1).join(' ') || '';
    },
  })
  userName: string;
  @Prop({ type: String, required: true, unique: true })
  email: string;

  mobileNumber: string;

  @Prop({
    type: String,
    required: function (this: User) {
      return this.userAgent === 'SYSTEM';
    },
  })
  password: string;

  @Prop({ type: String })
  otp: string;

  @Prop({ type: Date })
  otpExpiry: Date;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;
  @Prop({ enum: Role, required: true })
  role: Role;
  @Prop({ type: String, enum: UserAgent, default: UserAgent.SYSTEM })
  userAgent: UserAgent;

  state: string;

  city: City;

  @Prop({ type: Date })
  dob: Date;
  adminApproved: boolean;
  @Virtual({
    get(this: User) {
      if (!this.dob) return null;
      const ageDifMs = Date.now() - this.dob.getTime();
      const ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    },
    set(this: User, value: number) {
      const currentDate = new Date();
      const birthYear = currentDate.getFullYear() - value;
      this.dob = new Date(
        birthYear,
        currentDate.getMonth(),
        currentDate.getDate(),
      );
    },
  })
  age: number;
  @Prop({ type: Date })
  changeCredentialTimestamp: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: String })
  profileURL: string;

  @Prop({ type: String })
  profilePublicId: string;

  @Prop({ type: String })
  backgroundURL: string;

  @Prop({ type: String })
  backgroundPublicId: string;
}
export const userSchema = SchemaFactory.createForClass(User);
export type HUserDocument = HydratedDocument<User>;
