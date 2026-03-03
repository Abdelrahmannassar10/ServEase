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
exports.ProviderService = void 0;
const common_1 = require("@nestjs/common");
const index_1 = require("../../models/index");
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
    findAll() {
        return `This action returns all provider`;
    }
    findOne(id) {
        return `This action returns a #${id} provider`;
    }
    remove(id) {
        return `This action removes a #${id} provider`;
    }
};
exports.ProviderService = ProviderService;
exports.ProviderService = ProviderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [index_1.ProviderRepository])
], ProviderService);
//# sourceMappingURL=provider.service.js.map