import { Role } from "@common/types/enum";
import { CreateAdminDto } from "../dto/create-admin.dto";
import { Admin } from "../entities/admin.entity";

export class AdminFactoryService {

    CreateAdmin(createAdminDto: CreateAdminDto) {
        const admin = new Admin();
        admin.firstName = createAdminDto.firstName;
        admin.lastName = createAdminDto.lastName;
        admin.email = createAdminDto.email;
        admin.password = createAdminDto.password;
        admin.role = Role.ADMIN;
        admin.isDeleted = false;
        return admin;
    }
}
