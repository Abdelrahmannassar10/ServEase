import { CreateAdminDto } from "../dto/create-admin.dto";
import { Admin } from "../entities/admin.entity";
export declare class AdminFactoryService {
    CreateAdmin(createAdminDto: CreateAdminDto): Admin;
}
