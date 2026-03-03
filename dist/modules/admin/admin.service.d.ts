import { Admin } from './entities/admin.entity';
import { AdminRepository } from '@models/index';
import { JwtService } from '@nestjs/jwt';
export declare class AdminService {
    private readonly adminRepository;
    private readonly jwtService;
    constructor(adminRepository: AdminRepository, jwtService: JwtService);
    createAdmin(admin: Admin): Promise<{
        message: string;
    }>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    getPendingProviders(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("@models/index").Admin, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").Admin & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("@models/index").Admin, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").Admin & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("@models/index").Admin, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").Admin & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("@models/index").Admin, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").Admin & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").Document<unknown, {}, import("@models/index").Admin, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").Admin & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, "find", {}>;
}
