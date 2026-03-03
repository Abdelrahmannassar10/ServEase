import { City } from "@common/types/enum";
import { Types } from "mongoose";

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
      state: string;
}
