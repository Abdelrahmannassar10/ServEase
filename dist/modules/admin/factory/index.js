"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminFactoryService = void 0;
const enum_1 = require("../../../common/types/enum");
const admin_entity_1 = require("../entities/admin.entity");
class AdminFactoryService {
    CreateAdmin(createAdminDto) {
        const admin = new admin_entity_1.Admin();
        admin.firstName = createAdminDto.firstName;
        admin.lastName = createAdminDto.lastName;
        admin.email = createAdminDto.email;
        admin.password = createAdminDto.password;
        admin.role = enum_1.Role.ADMIN;
        admin.isDeleted = false;
        return admin;
    }
}
exports.AdminFactoryService = AdminFactoryService;
//# sourceMappingURL=index.js.map