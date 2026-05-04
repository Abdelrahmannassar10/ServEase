"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRequestFactoryService = void 0;
const service_request_schema_1 = require("../../../models/service-request/service-request.schema");
const mongoose_1 = require("mongoose");
class ServiceRequestFactoryService {
    createServiceRequest(dto, customerId) {
        const request = new service_request_schema_1.ServiceRequest();
        request.customerId = customerId;
        request.governorate = dto.governorate;
        request.city = dto.city;
        request.street = dto.street;
        request.exactLocation = dto.exactLocation;
        request.serviceNeeded = dto.serviceNeeded;
        request.dateNeeded = dto.dateNeeded;
        request.startTime = dto.startTime;
        request.addedToProviderCalendar = false;
        request.customerId = customerId;
        request.providerId = new mongoose_1.Types.ObjectId(dto.providerId);
        return request;
    }
}
exports.ServiceRequestFactoryService = ServiceRequestFactoryService;
//# sourceMappingURL=index.js.map