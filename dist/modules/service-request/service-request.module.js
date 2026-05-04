"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRequestModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const modules_1 = require("../../shared/modules");
const service_request_controller_1 = require("./service-request.controller");
const service_request_service_1 = require("./service-request.service");
const factory_1 = require("./factory");
const service_request_repository_1 = require("../../models/service-request/service-request.repository");
const service_request_schema_1 = require("../../models/service-request/service-request.schema");
let ServiceRequestModule = class ServiceRequestModule {
};
exports.ServiceRequestModule = ServiceRequestModule;
exports.ServiceRequestModule = ServiceRequestModule = __decorate([
    (0, common_1.Module)({
        imports: [
            modules_1.UserMongooseModule,
            mongoose_1.MongooseModule.forFeature([
                {
                    name: service_request_schema_1.ServiceRequest.name,
                    schema: service_request_schema_1.serviceRequestSchema,
                },
            ]),
        ],
        controllers: [service_request_controller_1.ServiceRequestController],
        providers: [
            service_request_service_1.ServiceRequestService,
            factory_1.ServiceRequestFactoryService,
            service_request_repository_1.ServiceRequestRepository,
        ],
    })
], ServiceRequestModule);
//# sourceMappingURL=service-request.module.js.map