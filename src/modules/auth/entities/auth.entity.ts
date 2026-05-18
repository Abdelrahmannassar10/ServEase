import {  City, Gender, ProviderStatus, ServiceCategory, state } from '@common/types/enum';
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
  service:ServiceCategory;
  specialization: string;
  gender:Gender;
}
