import { City, Role } from '@common/types/enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  discriminatorKey: 'role',
})
export class Admin {
  readonly _id: Types.ObjectId;

  firstName: string;
  lastName: string;
  userName: string;

  email: string;

  password: string;

  otp: string;

  otpExpiry: Date;

  role: Role;

  isDeleted: boolean;

  deletedAt: Date;

  @Prop({ type: [Types.ObjectId], ref: 'Provider' })
  pendingApprovals: Types.ObjectId[];
}
export const adminSchema = SchemaFactory.createForClass(Admin);
export type HAdminDocument = HydratedDocument<Admin>;
