import { ProviderService } from './provider.service';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProviderFactoryService } from './factory';
export declare class ProviderController {
    private readonly providerService;
    private readonly providerFactoryService;
    constructor(providerService: ProviderService, providerFactoryService: ProviderFactoryService);
    updateProfile(updateProviderDto: UpdateProviderDto, req: any): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../models").Provider, {}, import("mongoose").DefaultSchemaOptions> & import("../../models").Provider & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../models").Provider, {}, import("mongoose").DefaultSchemaOptions> & import("../../models").Provider & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../models").Provider, {}, import("mongoose").DefaultSchemaOptions> & import("../../models").Provider & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../models").Provider, {}, import("mongoose").DefaultSchemaOptions> & import("../../models").Provider & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").Document<unknown, {}, import("../../models").Provider, {}, import("mongoose").DefaultSchemaOptions> & import("../../models").Provider & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, "findOneAndUpdate", {}>;
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
