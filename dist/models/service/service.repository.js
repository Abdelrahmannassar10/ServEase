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
exports.ServiceRepository = void 0;
const mongoose_1 = require("mongoose");
const abstract_repository_1 = require("../abstract.repository");
const mongoose_2 = require("@nestjs/mongoose");
const common_1 = require("@nestjs/common");
const service_schema_1 = require("./service.schema");
let ServiceRepository = class ServiceRepository extends abstract_repository_1.AbstractRepository {
    serviceModel;
    constructor(serviceModel) {
        super(serviceModel);
        this.serviceModel = serviceModel;
    }
};
exports.ServiceRepository = ServiceRepository;
exports.ServiceRepository = ServiceRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(service_schema_1.Service.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], ServiceRepository);
//# sourceMappingURL=service.repository.js.map