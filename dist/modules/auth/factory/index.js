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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFactoryService = void 0;
const helper_1 = require("../../../common/helper");
const auth_entity_1 = require("../entities/auth.entity");
const bcrypt = __importStar(require("bcrypt"));
const common_1 = require("@nestjs/common");
class AuthFactoryService {
    async createCustomer(customerDTO) {
        const customer = new auth_entity_1.Customer();
        customer.firstName = customerDTO.firstName;
        customer.lastName = customerDTO.lastName;
        customer.email = customerDTO.email;
        if (customerDTO.mobileNumber) {
            customer.mobileNumber = await (0, helper_1.encrypt)(customerDTO.mobileNumber);
        }
        else {
            throw new common_1.BadRequestException('Mobile number is required for customers');
        }
        customer.password = await bcrypt.hash(customerDTO.password, 10);
        customer.otp = (0, helper_1.generateOTP)();
        customer.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        customer.isVerified = false;
        customer.dob = customerDTO.dob;
        customer.city = customerDTO.city;
        customer.state = customerDTO.state;
        return customer;
    }
    async createProvider(providerDTO) {
        const provider = new auth_entity_1.Provider();
        provider.firstName = providerDTO.firstName;
        provider.lastName = providerDTO.lastName;
        provider.email = providerDTO.email;
        provider.mobileNumber = await (0, helper_1.encrypt)(providerDTO.mobileNumber);
        provider.password = await bcrypt.hash(providerDTO.password, 10);
        provider.otp = (0, helper_1.generateOTP)();
        provider.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        provider.isVerified = false;
        provider.dob = providerDTO.dob;
        provider.city = providerDTO.city;
        provider.state = providerDTO.state;
        provider.writtenCv = providerDTO.writtenCv;
        provider.nationalNumber = providerDTO.nationalNumber;
        provider.adminApproved = false;
        provider.service = providerDTO.service;
        provider.specialization = providerDTO.specialization;
        return provider;
    }
}
exports.AuthFactoryService = AuthFactoryService;
//# sourceMappingURL=index.js.map