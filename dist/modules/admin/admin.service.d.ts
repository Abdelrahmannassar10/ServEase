import { Admin } from './entities/admin.entity';
import { AdminRepository, ProviderRepository } from '@models/index';
import { JwtService } from '@nestjs/jwt';
export declare class AdminService {
    private readonly adminRepository;
    private readonly providerRepository;
    private readonly jwtService;
    constructor(adminRepository: AdminRepository, providerRepository: ProviderRepository, jwtService: JwtService);
    createAdmin(admin: Admin): Promise<{
        message: string;
    }>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    getPendingProviders(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("@models/index").Provider, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").Provider & Required<{
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
    })[]>;
}
