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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRequestService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const enum_1 = require("../../common/types/enum");
const factory_1 = require("./factory");
const service_request_repository_1 = require("../../models/service-request/service-request.repository");
const helper_1 = require("../../common/helper");
const index_1 = require("../../models/index");
let ServiceRequestService = class ServiceRequestService {
    serviceRequestRepository;
    serviceRequestFactory;
    providerRepository;
    constructor(serviceRequestRepository, serviceRequestFactory, providerRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.serviceRequestFactory = serviceRequestFactory;
        this.providerRepository = providerRepository;
    }
    async create(dto, customerId) {
        const duplicate = await this.serviceRequestRepository.findDuplicateRequest(customerId, new mongoose_1.Types.ObjectId(dto.providerId), dto.dateNeeded, dto.startTime);
        if (duplicate) {
            throw new common_1.ConflictException('You already sent a request to this provider at the same date and time');
        }
        const serviceRequest = this.serviceRequestFactory.createServiceRequest(dto, customerId);
        serviceRequest.status = enum_1.ServiceStatus.WAITING;
        const created = await this.serviceRequestRepository.create(serviceRequest);
        const { __v, isDeleted, providerCancelFees, providerCancelCount, completionCode, createdAt, updatedAt, ...data } = JSON.parse(JSON.stringify(created));
        return data;
    }
    async findOneForUser(requestId, userId, field) {
        const request = await this.findOne(requestId);
        if (request[field]?.toString() !== userId.toString()) {
            throw new common_1.UnauthorizedException('You are not allowed to access this service request');
        }
        return request;
    }
    async findAll() {
        return this.serviceRequestRepository.find({});
    }
    async findOne(id) {
        const request = await this.serviceRequestRepository.findById(id);
        if (!request) {
            throw new common_1.NotFoundException('Service request not found');
        }
        return request;
    }
    async providerAccept(id, dto, providerId) {
        const request = await this.findOneForUser(id, providerId, 'providerId');
        if (request.status !== enum_1.ServiceStatus.WAITING) {
            throw new common_1.BadRequestException('Provider can only accept a waiting request');
        }
        if (!dto.price || !dto.endTime) {
            throw new common_1.BadRequestException('Price and end time are required');
        }
        const updated = await this.serviceRequestRepository.updateById(id, {
            providerId,
            price: dto.price,
            endTime: dto.endTime,
            status: enum_1.ServiceStatus.PENDING,
        });
        const { __v, isDeleted, providerCancelFees, providerCancelCount, addedToProviderCalendar, completionCode, createdAt, updatedAt, ...data } = JSON.parse(JSON.stringify(updated));
        return data;
    }
    async providerReject(id, providerId) {
        const request = await this.findOneForUser(id, providerId, 'providerId');
        if (request.status !== enum_1.ServiceStatus.WAITING) {
            throw new common_1.BadRequestException('Provider can only reject a waiting request');
        }
        const update = await this.serviceRequestRepository.updateById(id, {
            status: enum_1.ServiceStatus.REFUSED,
        });
        const { __v, isDeleted, providerCancelFees, providerCancelCount, addedToProviderCalendar, completionCode, createdAt, updatedAt, ...data } = JSON.parse(JSON.stringify(update));
        return data;
    }
    async customerAccept(id, customerId) {
        const request = await this.findOneForUser(id, customerId, 'customerId');
        if (request.status !== enum_1.ServiceStatus.PENDING) {
            throw new common_1.BadRequestException('Customer can only accept a pending request');
        }
        const completionCode = (0, helper_1.generateCode)();
        const update = await this.serviceRequestRepository.updateById(id, {
            status: enum_1.ServiceStatus.CONFIRMED,
            completionCode,
            addedToProviderCalendar: true,
        });
        const { __v, isDeleted, providerCancelFees, providerCancelCount, addedToProviderCalendar, createdAt, updatedAt, ...data } = JSON.parse(JSON.stringify(update));
        return data;
    }
    async customerReject(id, customerId) {
        const request = await this.findOneForUser(id, customerId, 'customerId');
        if (request.status !== enum_1.ServiceStatus.PENDING) {
            throw new common_1.BadRequestException('Customer can only reject a pending request');
        }
        const update = await this.serviceRequestRepository.updateById(id, {
            status: enum_1.ServiceStatus.REFUSED,
        });
        const { __v, isDeleted, providerCancelFees, providerCancelCount, addedToProviderCalendar, createdAt, updatedAt, ...data } = JSON.parse(JSON.stringify(update));
        return data;
    }
    async customerCancel(id, customerId) {
        const request = await this.findOneForUser(id, customerId, 'customerId');
        if (request.status !== enum_1.ServiceStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Customer can only cancel confirmed service');
        }
        const update = await this.serviceRequestRepository.updateById(id, {
            status: enum_1.ServiceStatus.REFUSED,
            addedToProviderCalendar: false,
            completionCode: null,
        });
        const { __v, isDeleted, providerCancelFees, providerCancelCount, addedToProviderCalendar, createdAt, updatedAt, completionCode, ...data } = JSON.parse(JSON.stringify(update));
        return data;
    }
    async providerCancel(id, providerId) {
        const request = await this.findOneForUser(id, providerId, 'providerId');
        if (request.status !== enum_1.ServiceStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Provider can only cancel confirmed service');
        }
        if (!request.price) {
            throw new common_1.BadRequestException('Cannot calculate cancel fee because price is missing');
        }
        if (!request.providerId) {
            throw new common_1.BadRequestException('Provider is missing');
        }
        const provider = await this.providerRepository.findById(request.providerId.toString());
        if (!provider) {
            throw new common_1.NotFoundException('Provider not found');
        }
        const cancelFee = Math.round(request.price * 0.2);
        await this.providerRepository.updateById(request.providerId.toString(), {
            providerCancelCount: (provider.providerCancelCount || 0) + 1,
            providerCancelFees: (provider.providerCancelFees || 0) + cancelFee,
        });
        const updated = await this.serviceRequestRepository.updateById(id, {
            status: enum_1.ServiceStatus.REFUSED,
            addedToProviderCalendar: false,
            completionCode: null,
        });
        const { __v, isDeleted, addedToProviderCalendar, completionCode, createdAt, updatedAt, ...data } = JSON.parse(JSON.stringify(updated));
        return data;
    }
    async completeService(id, dto, customerId) {
        const request = await this.findOneForUser(id, customerId, 'customerId');
        if (request.status !== enum_1.ServiceStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Only confirmed service can be completed');
        }
        if (!dto.completionCode) {
            throw new common_1.BadRequestException('Completion code is required');
        }
        if (dto.completionCode !== request.completionCode) {
            throw new common_1.BadRequestException('Invalid completion code');
        }
        if (!request.price) {
            throw new common_1.BadRequestException('Cannot calculate provider debt because price is missing');
        }
        if (!request.providerId) {
            throw new common_1.BadRequestException('Provider is missing');
        }
        const provider = await this.providerRepository.findById(request.providerId.toString());
        if (!provider) {
            throw new common_1.NotFoundException('Provider not found');
        }
        const debtAmount = Math.round(request.price * 0.4);
        await this.providerRepository.updateById(request.providerId.toString(), {
            debt: (provider.debt || 0) + debtAmount,
            providerCancelCount: 0,
        });
        const updated = await this.serviceRequestRepository.updateById(id, {
            status: enum_1.ServiceStatus.COMPLETED,
            completionCode: null,
        });
        const { __v, isDeleted, addedToProviderCalendar, completionCode, createdAt, updatedAt, ...data } = JSON.parse(JSON.stringify(updated));
        return data;
    }
    async findRequests(user) {
        if (user.role === enum_1.Role.CUSTOMER) {
            this.serviceRequestRepository.find({});
        }
    }
};
exports.ServiceRequestService = ServiceRequestService;
exports.ServiceRequestService = ServiceRequestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [service_request_repository_1.ServiceRequestRepository,
        factory_1.ServiceRequestFactoryService,
        index_1.ProviderRepository])
], ServiceRequestService);
//# sourceMappingURL=service-request.service.js.map