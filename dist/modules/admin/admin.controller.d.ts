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
