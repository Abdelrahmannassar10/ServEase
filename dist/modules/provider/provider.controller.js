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
exports.ProviderController = void 0;
const common_1 = require("@nestjs/common");
const provider_service_1 = require("./provider.service");
const update_provider_dto_1 = require("./dto/update-provider.dto");
const factory_1 = require("./factory");
const passport_1 = require("@nestjs/passport");
const guard_1 = require("../../common/guard");
const enum_1 = require("../../common/types/enum");
const decorators_1 = require("../../common/decorators");
let ProviderController = class ProviderController {
    providerService;
    providerFactoryService;
    constructor(providerService, providerFactoryService) {
        this.providerService = providerService;
        this.providerFactoryService = providerFactoryService;
    }
    updateProfile(updateProviderDto, req) {
        const provider = this.providerFactoryService.updateProvider(updateProviderDto, req.user);
        return this.providerService.update(req.user._id, provider);
    }
    async getMyProfile(req) {
        return await this.providerService.getProfile(req.user._id);
    }
    async getAnotherProfile(id) {
        return await this.providerService.searchProfile(id);
    }
    async updatePassword(req, body) {
        const { oldPassword, newPassword } = body;
        if (!oldPassword || !newPassword) {
            throw new common_1.UnauthorizedException('Old password and new password are required');
        }
        if (oldPassword === newPassword) {
            throw new common_1.UnauthorizedException('New password must be different from old password');
        }
        return await this.providerService.updatePassword(req.user._id, oldPassword, newPassword);
    }
    async softDeleteAccount(req) {
        return await this.providerService.softDeleteAccount(req.user._id);
    }
};
exports.ProviderController = ProviderController;
__decorate([
    (0, common_1.Post)('profile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.PROVIDER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_provider_dto_1.UpdateProviderDto, Object]),
    __metadata("design:returntype", void 0)
], ProviderController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.PROVIDER),
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProviderController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProviderController.prototype, "getAnotherProfile", null);
__decorate([
    (0, common_1.Post)("update-password"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.PROVIDER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProviderController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Delete)('soft-delete'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.PROVIDER),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProviderController.prototype, "softDeleteAccount", null);
exports.ProviderController = ProviderController = __decorate([
    (0, common_1.Controller)('provider'),
    __metadata("design:paramtypes", [provider_service_1.ProviderService,
        factory_1.ProviderFactoryService])
], ProviderController);
//# sourceMappingURL=provider.controller.js.map