import {  City, Gender, ProviderStatus, state } from '@common/types/enum';
import { Types } from 'mongoose';



export class Customer {
  readonly _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  password: string;
  otp: string;
  otpExpiry: Date;
  isVerified: boolean;
  dob: Date;
  city: City;
  state: state;
  gender:Gender;
  profileURL: string;
}

export class Provider {
  readonly _id: Types.ObjectId;

  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  password: string;
  otp: string;
  otpExpiry: Date;
  isVerified: boolean;
  dob: Date;
  city: City;
  state: state;
  writtenCv: string;
  adminApproved: ProviderStatus;
  nationalNumber: string;
  service: Types.ObjectId;
  specialization: string;
  gender:Gender;
  profileURL: string;
  hourPrice: number;
  idCardFrontUrl: string;
  idCardBackUrl: string;
}
