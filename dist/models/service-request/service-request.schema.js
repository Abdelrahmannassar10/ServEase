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
exports.serviceRequestSchema = exports.ServiceRequest = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const customer_schema_1 = require("../customer/customer.schema");
const enum_1 = require("../../common/types/enum");
const provider_schema_1 = require("../provider/provider.schema");
let ServiceRequest = class ServiceRequest {
    _id;
    customerId;
    providerId;
    governorate;
    city;
    street;
    exactLocation;
    serviceNeeded;
    dateNeeded;
    startTime;
    endTime;
    price;
    status;
    completionCode;
    addedToProviderCalendar;
};
exports.ServiceRequest = ServiceRequest;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: customer_schema_1.Customer.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ServiceRequest.prototype, "customerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: provider_schema_1.Provider.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ServiceRequest.prototype, "providerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ServiceRequest.prototype, "governorate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ServiceRequest.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ServiceRequest.prototype, "street", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ServiceRequest.prototype, "exactLocation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ServiceRequest.prototype, "serviceNeeded", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], ServiceRequest.prototype, "dateNeeded", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ServiceRequest.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ServiceRequest.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ServiceRequest.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: enum_1.ServiceStatus,
    }),
    __metadata("design:type", String)
], ServiceRequest.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], ServiceRequest.prototype, "completionCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, type: Boolean }),
    __metadata("design:type", Boolean)
], ServiceRequest.prototype, "addedToProviderCalendar", void 0);
exports.ServiceRequest = ServiceRequest = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toJSON: { virtuals: true },
    })
], ServiceRequest);
exports.serviceRequestSchema = mongoose_1.SchemaFactory.createForClass(ServiceRequest);
//# sourceMappingURL=service-request.schema.js.map