import { Customer } from './entities/customer.entity';
import { CustomerRepository } from '@models/index';
import { CloudinaryService } from '@common/cloudinary';
export declare class CustomerService {
    private readonly customerRepository;
    private readonly cloudService;
    constructor(customerRepository: CustomerRepository, cloudService: CloudinaryService);
    updateProfile(updateProfile: Customer, id: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("@models/index").Customer, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").Customer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("@models/index").Customer, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").Customer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("@models/index").Customer, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").Customer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("@models/index").Customer, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").Customer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").Document<unknown, {}, import("@models/index").Customer, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").Customer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, "findOneAndUpdate", {}>;
    getProfile(userid: string): Promise<any>;
    getAnotherProfile(userid: string): Promise<{
        mobileNumber: string;
        userName: any;
        profileURL: any;
        backgroundURL: any;
    }>;
    updatePassword(userid: string, oldPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    uploadPhoto(userid: string, photo: Express.Multer.File): Promise<{
        message: string;
        profileURL: string;
    }>;
    uploadBackgroundPhoto(userid: string, photo: Express.Multer.File): Promise<{
        message: string;
        backgroundURL: string;
    }>;
    deletePhoto(userid: string, type: 'profile' | 'background'): Promise<{
        result: string;
    }>;
    softDeleteAccount(userid: string): Promise<{
        message: string;
    }>;
}
