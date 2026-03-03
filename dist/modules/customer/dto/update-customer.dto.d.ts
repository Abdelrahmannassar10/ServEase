import { City } from '@common/types/enum';
export declare class UpdateCustomerDto {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    dob: Date;
    city: City;
    state: string;
}
