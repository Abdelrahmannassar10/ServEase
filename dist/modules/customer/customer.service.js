"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const index_1 = require("../../models/index");
const helper_1 = require("../../common/helper");
const bcrypt = __importStar(require("bcrypt"));
const cloudinary_1 = require("../../common/cloudinary");
let CustomerService = class CustomerService {
    customerRepository;
    cloudService;
    constructor(customerRepository, cloudService) {
        this.customerRepository = customerRepository;
        this.cloudService = cloudService;
    }
    updateProfile(updateProfile, id) {
        const updatedCustomer = this.customerRepository.updateById(id, updateProfile);
        if (!updatedCustomer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return updatedCustomer;
    }
    async getProfile(userid) {
        const customer = await this.customerRepository.findById(userid);
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const { password, isVerified, id, otpExpiry, otp, __v, userAgent, role, _id, isDeleted, updatedAt, dob, deletedAt, changeCredentialTimestamp, createdAt, ...customerData } = JSON.parse(JSON.stringify(customer));
        customerData.mobileNumber = await (0, helper_1.decrypt)(customerData.mobileNumber);
        return customerData;
    }
    async getAnotherProfile(userid) {
        const customer = await this.customerRepository.findById(userid);
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const { mobileNumber, userName, profileURL, backgroundURL, ...customerData } = JSON.parse(JSON.stringify(customer));
        const decryptedMobileNumber = await (0, helper_1.decrypt)(mobileNumber);
        return { mobileNumber: decryptedMobileNumber, userName, profileURL, backgroundURL };
    }
    async updatePassword(userid, oldPassword, newPassword) {
        const customer = await this.customerRepository.findById(userid);
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        if (!(await bcrypt.compare(oldPassword, customer.password))) {
            throw new common_1.UnauthorizedException('Old password is incorrect');
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        customer.password = hashedNewPassword;
        customer.changeCredentialTimestamp = new Date();
        await this.customerRepository.updateById(customer.id, customer);
        return { message: 'Password updated successfully' };
    }
    async softDeleteAccount(userid) {
        const customer = await this.customerRepository.findById(userid);
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        await this.customerRepository.softDeleteById(userid);
        return { message: 'Account deleted successfully' };
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [index_1.CustomerRepository,
        cloudinary_1.CloudinaryService])
], CustomerService);
//# sourceMappingURL=customer.service.js.map