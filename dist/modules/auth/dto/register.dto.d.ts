import { City, ServiceCategory } from '@common/types/enum';
export declare class ProviderRegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    password: string;
    dob: Date;
    city: City;
    state: string;
    writtenCv: string;
    nationalNumber: string;
    service: ServiceCategory;
    specialization: string;
}
export declare class CustomerRegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    password: string;
    dob: Date;
    city: City;
    state: string;
}
