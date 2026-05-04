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
exports.ServiceRequestController = void 0;
const decorators_1 = require("../../common/decorators");
const guard_1 = require("../../common/guard");
const enum_1 = require("../../common/types/enum");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const create_service_request_dto_1 = require("./dto/create-service-request.dto");
const service_request_service_1 = require("./service-request.service");
let ServiceRequestController = class ServiceRequestController {
    serviceRequestService;
    constructor(serviceRequestService) {
        this.serviceRequestService = serviceRequestService;
    }
    create(dto, req) {
        console.log(req.user);
        return this.serviceRequestService.create(dto, req.user._id);
    }
    findAll() {
        return this.serviceRequestService.findAll();
    }
    findOne(id) {
        return this.serviceRequestService.findOne(id);
    }
    providerAccept(body, req) {
        return this.serviceRequestService.providerAccept(body.id, body, req.user._id);
    }
    providerReject(id, req) {
        return this.serviceRequestService.providerReject(id, req.user._id);
    }
    customerAccept(id, req) {
        return this.serviceRequestService.customerAccept(id, req.user._id);
    }
    customerReject(id, req) {
        return this.serviceRequestService.customerReject(id, req.user._id);
    }
    customerCancel(id, req) {
        return this.serviceRequestService.customerCancel(id, req.user._id);
    }
    providerCancel(id, req) {
        return this.serviceRequestService.providerCancel(id, req.user._id);
    }
    completeService(body, req) {
        return this.serviceRequestService.completeService(body.id, body, req.user._id);
    }
    async getRequestService(req) {
        return this.serviceRequestService.findRequests(req.user);
    }
};
exports.ServiceRequestController = ServiceRequestController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.CUSTOMER),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_request_dto_1.CreateServiceRequestDto, Object]),
    __metadata("design:returntype", void 0)
], ServiceRequestController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServiceRequestController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.CUSTOMER, enum_1.Role.PROVIDER, enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceRequestController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('provider-accept'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.PROVIDER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ServiceRequestController.prototype, "providerAccept", null);
__decorate([
    (0, common_1.Patch)('provider-reject'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.PROVIDER),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ServiceRequestController.prototype, "providerReject", null);
__decorate([
    (0, common_1.Patch)('customer-accept'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.CUSTOMER),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ServiceRequestController.prototype, "customerAccept", null);
__decorate([
    (0, common_1.Patch)('customer-reject'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.CUSTOMER),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ServiceRequestController.prototype, "customerReject", null);
__decorate([
    (0, common_1.Patch)('customer-cancel'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.CUSTOMER),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ServiceRequestController.prototype, "customerCancel", null);
__decorate([
    (0, common_1.Patch)('provider-cancel'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.PROVIDER),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ServiceRequestController.prototype, "providerCancel", null);
__decorate([
    (0, common_1.Patch)('complete'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.CUSTOMER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ServiceRequestController.prototype, "completeService", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.CUSTOMER, enum_1.Role.PROVIDER),
    (0, common_1.Get)("get-requests"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceRequestController.prototype, "getRequestService", null);
exports.ServiceRequestController = ServiceRequestController = __decorate([
    (0, common_1.Controller)('service-requests'),
    __metadata("design:paramtypes", [service_request_service_1.ServiceRequestService])
], ServiceRequestController);
//# sourceMappingURL=service-request.controller.js.map