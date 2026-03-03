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
exports.ProviderService = void 0;
const common_1 = require("@nestjs/common");
const index_1 = require("../../models/index");
const bcrypt = __importStar(require("bcrypt"));
const helper_1 = require("../../common/helper");
let ProviderService = class ProviderService {
    providerRepository;
    constructor(providerRepository) {
        this.providerRepository = providerRepository;
    }
    update(id, updateProviderDto) {
        return this.providerRepository.updateById(id, updateProviderDto);
    }
    async getProfile(userid) {
        const provider = await this.providerRepository.findById(userid);
        if (!provider) {
            throw new common_1.NotFoundException('Provider not found');
        }
        const { password, isVerified, id, otpExpiry, otp, __v, userAgent, role, _id, updatedAt, createdAt, adminApproved, ...providerData } = JSON.parse(JSON.stringify(provider));
        providerData.mobileNumber = await (0, helper_1.decrypt)(provider.mobileNumber);
        return providerData;
    }
    async searchProfile(id) {
        const provider = await this.providerRepository.findById(id);
        if (!provider) {
            throw new common_1.NotFoundException('Provider not found');
        }
        const { mobileNumber, userName, profileURL, backgroundURL, ...providerData } = JSON.parse(JSON.stringify(provider));
        const decryptedMobileNumber = await (0, helper_1.decrypt)(mobileNumber);
        return { mobileNumber: decryptedMobileNumber, userName, profileURL, backgroundURL };
    }
    async updatePassword(userid, oldPassword, newPassword) {
        const provider = await this.providerRepository.findById(userid);
        if (!provider) {
            throw new common_1.NotFoundException('Provider not found');
        }
        if (!(await bcrypt.compare(oldPassword, provider.password))) {
            throw new common_1.UnauthorizedException('Old password is incorrect');
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        provider.password = hashedNewPassword;
        provider.changeCredentialTimestamp = new Date();
        await this.providerRepository.updateById(provider.id, provider);
        return { message: 'Password updated successfully' };
    }
    async softDeleteAccount(userid) {
        const provider = await this.providerRepository.findById(userid);
        if (!provider) {
            throw new common_1.NotFoundException('Provider not found');
        }
        await this.providerRepository.softDeleteById(userid);
        return { message: 'Account deleted successfully' };
    }
};
exports.ProviderService = ProviderService;
exports.ProviderService = ProviderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [index_1.ProviderRepository])
], ProviderService);
//# sourceMappingURL=provider.service.js.map