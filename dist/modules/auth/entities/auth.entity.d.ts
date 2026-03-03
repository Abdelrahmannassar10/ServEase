import { City, ServiceCategory } from '@common/types/enum';
import { Types } from 'mongoose';
export declare class Customer {
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
export declare class Provider {
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
    writtenCv: string;
    adminApproved: boolean;
    nationalNumber: string;
    service: ServiceCategory;
    specialization: string;
}
