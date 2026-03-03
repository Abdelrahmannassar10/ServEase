import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerFactoryService } from './factory';
export declare class CustomerController {
    private readonly customerService;
    private readonly customerFactoryService;
    constructor(customerService: CustomerService, customerFactoryService: CustomerFactoryService);
    updateProfile(updateCustomerDto: UpdateCustomerDto, req: any): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../models").Customer, {}, import("mongoose").DefaultSchemaOptions> & import("../../models").Customer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../models").Customer, {}, import("mongoose").DefaultSchemaOptions> & import("../../models").Customer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getMyProfile(req: any): Promise<any>;
    getAnotherProfile(id: string): Promise<{
        mobileNumber: string;
        userName: any;
        profileURL: any;
        backgroundURL: any;
    }>;
    updatePassword(req: any, body: {
        oldPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    softDeleteAccount(req: any): Promise<{
        message: string;
    }>;
}
