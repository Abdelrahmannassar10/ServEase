import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProviderRepository } from '@models/index';
export declare class ProviderService {
    private readonly providerRepository;
    constructor(providerRepository: ProviderRepository);
    update(id: string, updateProviderDto: UpdateProviderDto): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("@models/index").Provider, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").Provider & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("@models/index").Provider, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").Provider & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("@models/index").Provider, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").Provider & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("@models/index").Provider, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").Provider & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").Document<unknown, {}, import("@models/index").Provider, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").Provider & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, "findOneAndUpdate", {}>;
    getProfile(userid: string): Promise<any>;
    searchProfile(id: string): Promise<{
        id: any;
        mobileNumber: any;
        userName: any;
        profileURL: any;
        backgroundURL: any;
    }>;
    updatePassword(userid: string, oldPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    softDeleteAccount(userid: string): Promise<{
        message: string;
    }>;
}
