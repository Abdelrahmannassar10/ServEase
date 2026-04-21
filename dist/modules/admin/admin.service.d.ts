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
    getPendingProviders(): Promise<{
        id: import("mongoose").Types.ObjectId;
        userName: string;
        specialization: string;
        service: import("@common/types/enum").ServiceCategory;
        nationalNumber: string;
        writtenCv: string;
        state: string;
        city: import("@common/types/enum").City;
        email: string;
        mobileNumber: string;
        age: number;
        profileURL: string;
        backgroundURL: string;
        cvUrl: string;
    }[]>;
}
