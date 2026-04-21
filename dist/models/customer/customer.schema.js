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
exports.customerSchema = exports.Customer = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const enum_1 = require("../../common/types/enum");
let Customer = class Customer {
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
    state;
    city;
    dob;
    userAgent;
    role;
    age;
    changeCredentialTimestamp;
    isDeleted;
    deletedAt;
    profileURL;
    backgroundURL;
    googlePicture;
};
exports.Customer = Customer;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: function () {
            return this.userAgent === 'SYSTEM';
        },
    }),
    __metadata("design:type", String)
], Customer.prototype, "mobileNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: function () {
            return this.userAgent === 'SYSTEM';
        },
    }),
    __metadata("design:type", String)
], Customer.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: function () {
            return this.userAgent === 'SYSTEM';
        },
        enum: enum_1.City,
    }),
    __metadata("design:type", String)
], Customer.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Customer.prototype, "googlePicture", void 0);
exports.Customer = Customer = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        discriminatorKey: 'role',
    })
], Customer);
exports.customerSchema = mongoose_1.SchemaFactory.createForClass(Customer);
//# sourceMappingURL=customer.schema.js.map