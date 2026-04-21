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
exports.userSchema = exports.User = void 0;
const enum_1 = require("../../common/types/enum");
const mongoose_1 = require("@nestjs/mongoose");
let User = class User {
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
    userAgent;
    state;
    city;
    dob;
    adminApproved;
    age;
    changeCredentialTimestamp;
    isDeleted;
    deletedAt;
    profileURL;
    profilePublicId;
    backgroundURL;
    backgroundPublicId;
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Virtual)({
        get() {
            return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
        },
    }),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: function () {
            return this.userAgent === 'SYSTEM';
        },
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "otp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], User.prototype, "otpExpiry", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: enum_1.Role, required: true }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: enum_1.UserAgent, default: enum_1.UserAgent.SYSTEM }),
    __metadata("design:type", String)
], User.prototype, "userAgent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], User.prototype, "dob", void 0);
__decorate([
    (0, mongoose_1.Virtual)({
        get() {
            if (!this.dob)
                return null;
            const ageDifMs = Date.now() - this.dob.getTime();
            const ageDate = new Date(ageDifMs);
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        },
        set(value) {
            const currentDate = new Date();
            const birthYear = currentDate.getFullYear() - value;
            this.dob = new Date(birthYear, currentDate.getMonth(), currentDate.getDate());
        },
    }),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], User.prototype, "changeCredentialTimestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isDeleted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], User.prototype, "deletedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "profileURL", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "profilePublicId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "backgroundURL", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "backgroundPublicId", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        discriminatorKey: 'role',
    })
], User);
exports.userSchema = mongoose_1.SchemaFactory.createForClass(User);
//# sourceMappingURL=user.schema.js.map