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
exports.CommonService = void 0;
const cloudinary_1 = require("../../common/cloudinary");
const index_1 = require("../../models/index");
const common_1 = require("@nestjs/common");
let CommonService = class CommonService {
    userRepository;
    cloudService;
    constructor(userRepository, cloudService) {
        this.userRepository = userRepository;
        this.cloudService = cloudService;
    }
    async uploadPhoto(user, photo) {
        const userExist = await this.userRepository.findById(user._id);
        if (!userExist) {
            throw new common_1.NotFoundException(`${user.role} not found`);
        }
        const upload = await this.cloudService.uploadImage(photo, `ServEase/${userExist.role}/${userExist.email}/profile`, `profile_${userExist._id}`);
        userExist.profileURL = upload.secure_url;
        await this.userRepository.updateById(userExist.id, userExist);
        return {
            message: 'Profile photo added successfully',
            profileURL: upload.secure_url,
        };
    }
    async uploadBackgroundPhoto(user, photo) {
        const userExist = await this.userRepository.findById(user._id);
        if (!userExist) {
            throw new common_1.NotFoundException(`${user.role} not found`);
        }
        const upload = await this.cloudService.uploadImage(photo, `ServEase/${userExist.role}/${userExist.email}/background`, `background_${userExist._id}`);
        userExist.backgroundURL = upload.secure_url;
        await this.userRepository.updateById(userExist.id, userExist);
        return {
            message: 'Background photo added successfully',
            backgroundURL: upload.secure_url,
        };
    }
};
exports.CommonService = CommonService;
exports.CommonService = CommonService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [index_1.UserRepository,
        cloudinary_1.CloudinaryService])
], CommonService);
//# sourceMappingURL=common.service.js.map