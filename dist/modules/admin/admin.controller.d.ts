import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminFactoryService } from './factory';
export declare class AdminController {
    private readonly adminService;
    private readonly adminFactoryService;
    constructor(adminService: AdminService, adminFactoryService: AdminFactoryService);
    create(createAdminDto: CreateAdminDto): Promise<{
        message: string;
    }>;
    adminLogin(req: any): Promise<{
        access_token: string;
    }>;
    getPendingProviders(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../models").Admin, {}, import("mongoose").DefaultSchemaOptions> & import("../../models").Admin & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../models").Admin, {}, import("mongoose").DefaultSchemaOptions> & import("../../models").Admin & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../models").Admin, {}, import("mongoose").DefaultSchemaOptions> & import("../../models").Admin & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../models").Admin, {}, import("mongoose").DefaultSchemaOptions> & import("../../models").Admin & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").Document<unknown, {}, import("../../models").Admin, {}, import("mongoose").DefaultSchemaOptions> & import("../../models").Admin & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, "find", {}>;
}
