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
exports.providerSchema = exports.Provider = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const enum_1 = require("../../common/types/enum");
let Provider = class Provider {
    _id;
    firstName;
    lastName;
    userName;
    email;
    mobileNumber;
    password;
    otp;
    otpExpiry;
    isVerified;
    role;
    state;
    city;
    dob;
    age;
    changeCredentialTimestamp;
    isDeleted;
    deletedAt;
    profileURL;
    backgroundURL;
    writtenCv;
    nationalNumber;
    adminApproved;
    service;
    specialization;
    cvUrl;
};
exports.Provider = Provider;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true
    }),
    __metadata("design:type", String)
], Provider.prototype, "mobileNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true
    }),
    __metadata("design:type", String)
], Provider.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true
    }),
    __metadata("design:type", String)
], Provider.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Provider.prototype, "writtenCv", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, unique: true, required: true, match: /^\d{6,20}$/ }),
    __metadata("design:type", String)
], Provider.prototype, "nationalNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Provider.prototype, "adminApproved", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: enum_1.ServiceCategory }),
    __metadata("design:type", String)
], Provider.prototype, "service", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Provider.prototype, "specialization", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Provider.prototype, "cvUrl", void 0);
exports.Provider = Provider = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        discriminatorKey: 'role',
    })
], Provider);
exports.providerSchema = mongoose_1.SchemaFactory.createForClass(Provider);
//# sourceMappingURL=provider.schema.js.map