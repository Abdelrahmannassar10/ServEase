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
exports.ServiceService = void 0;
const common_1 = require("@nestjs/common");
const service_repository_1 = require("../../models/service/service.repository");
const category_repository_1 = require("../../models/category/category.repository");
let ServiceService = class ServiceService {
    serviceRepository;
    categoryRepository;
    constructor(serviceRepository, categoryRepository) {
        this.serviceRepository = serviceRepository;
        this.categoryRepository = categoryRepository;
    }
    async create(createServiceDto) {
        const service = await this.serviceRepository.create(createServiceDto);
        await this.categoryRepository.updateById(createServiceDto.categoryId, { $push: { services: service._id } });
        return { message: 'Service created successfully', service: service.name };
    }
};
exports.ServiceService = ServiceService;
exports.ServiceService = ServiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [service_repository_1.ServiceRepository,
        category_repository_1.CategoryRepository])
], ServiceService);
//# sourceMappingURL=service.service.js.map