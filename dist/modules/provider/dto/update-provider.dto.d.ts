import { City, ServiceCategory } from '@common/types/enum';
export declare class UpdateProviderDto {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    dob: Date;
    city: City;
    state: string;
    writtenCv: string;
    nationalNumber: string;
    service: ServiceCategory;
    specialization: string;
}
