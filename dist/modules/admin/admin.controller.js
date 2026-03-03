"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const factory_1 = require("./factory");
const guard_1 = require("../../common/guard");
const passport_1 = require("@nestjs/passport");
const enum_1 = require("../../common/types/enum");
const decorators_1 = require("../../common/decorators");
let AdminController = class AdminController {
    adminService;
    adminFactoryService;
    constructor(adminService, adminFactoryService) {
        this.adminService = adminService;
        this.adminFactoryService = adminFactoryService;
    }
    create(createAdminDto) {
        const admin = this.adminFactoryService.CreateAdmin(createAdminDto);
        return this.adminService.createAdmin(admin);
    }
    adminLogin(req) {
        return this.adminService.login(req.user);
    }
    getPendingProviders() {
        return this.adminService.getPendingProviders();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('admin-local')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminLogin", null);
__decorate([
    (0, common_1.Get)('pending-providers'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.CUSTOMER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPendingProviders", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        factory_1.AdminFactoryService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map