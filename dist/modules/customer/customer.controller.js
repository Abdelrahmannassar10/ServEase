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
exports.CustomerController = void 0;
const common_1 = require("@nestjs/common");
const customer_service_1 = require("./customer.service");
const update_customer_dto_1 = require("./dto/update-customer.dto");
const passport_1 = require("@nestjs/passport");
const factory_1 = require("./factory");
const guard_1 = require("../../common/guard");
const decorators_1 = require("../../common/decorators");
const enum_1 = require("../../common/types/enum");
let CustomerController = class CustomerController {
    customerService;
    customerFactoryService;
    constructor(customerService, customerFactoryService) {
        this.customerService = customerService;
        this.customerFactoryService = customerFactoryService;
    }
    async updateProfile(updateCustomerDto, req) {
        const customer = await this.customerFactoryService.updateProfile(updateCustomerDto, req.user);
        const updatedCustomer = await this.customerService.updateProfile(customer, req.user._id);
        return updatedCustomer;
    }
    async getMyProfile(req) {
        return await this.customerService.getProfile(req.user._id);
    }
    async getAnotherProfile(id) {
        return await this.customerService.getAnotherProfile(id);
    }
    async updatePassword(req, body) {
        const { oldPassword, newPassword } = body;
        if (!oldPassword || !newPassword) {
            throw new common_1.UnauthorizedException('Old password and new password are required');
        }
        if (oldPassword === newPassword) {
            throw new common_1.UnauthorizedException('New password must be different from old password');
        }
        return await this.customerService.updatePassword(req.user._id, oldPassword, newPassword);
    }
    async softDeleteAccount(req) {
        return await this.customerService.softDeleteAccount(req.user._id);
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.CUSTOMER),
    (0, common_1.Post)('update-profile'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_customer_dto_1.UpdateCustomerDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.CUSTOMER),
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getAnotherProfile", null);
__decorate([
    (0, common_1.Post)('update-password'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.CUSTOMER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Post)('delete-account'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.CUSTOMER),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "softDeleteAccount", null);
exports.CustomerController = CustomerController = __decorate([
    (0, common_1.Controller)('customer'),
    __metadata("design:paramtypes", [customer_service_1.CustomerService,
        factory_1.CustomerFactoryService])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map